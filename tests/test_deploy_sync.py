"""Exercise deploy.sh synchronization using temporary local Git repositories."""

import os
from pathlib import Path
import subprocess
import tempfile
import unittest


DEPLOY_SOURCE = (Path(__file__).resolve().parents[1] / "deploy.sh").read_text()
FUNCTIONS = DEPLOY_SOURCE.rsplit('\nmain "$@"', 1)[0]


class DeploySyncTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="deploy-sync-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.env = dict(
            os.environ,
            GIT_CONFIG_GLOBAL="/dev/null",
            GIT_CONFIG_NOSYSTEM="1",
            GIT_AUTHOR_NAME="Test",
            GIT_AUTHOR_EMAIL="test@example.com",
            GIT_COMMITTER_NAME="Test",
            GIT_COMMITTER_EMAIL="test@example.com",
            GIT_MERGE_AUTOEDIT="no",
        )
        self.git("init", "--bare", "--initial-branch=main", "remote.git")
        self.git("clone", "remote.git", "local")
        self.commit("local", "base.txt", "base")
        self.git("-C", "local", "push", "origin", "main")
        self.git("clone", "remote.git", "peer")

    def git(self, *args):
        return subprocess.run(
            ["git", *args], cwd=self.root, env=self.env,
            text=True, capture_output=True, check=True,
        ).stdout.strip()

    def commit(self, repo, filename, content):
        (self.root / repo / filename).write_text(content)
        self.git("-C", repo, "add", filename)
        self.git("-C", repo, "commit", "-m", content)
        return self.git("-C", repo, "rev-parse", "HEAD")

    def sync(self):
        return subprocess.run(
            ["bash", "-c", FUNCTIONS + "\nsync_remote\n"],
            cwd=self.root / "local", env=self.env,
            text=True, capture_output=True,
        )

    def test_equal(self):
        before = self.git("-C", "local", "rev-parse", "HEAD")
        result = self.sync()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(before, self.git("-C", "local", "rev-parse", "HEAD"))

    def test_ahead_keeps_local_commit(self):
        before = self.commit("local", "local.txt", "local change")
        result = self.sync()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("ahead", result.stdout.lower())
        self.assertNotIn("behind", result.stdout.lower())
        self.assertEqual(before, self.git("-C", "local", "rev-parse", "HEAD"))

    def test_behind_fast_forwards(self):
        remote = self.commit("peer", "remote.txt", "remote change")
        self.git("-C", "peer", "push", "origin", "main")
        result = self.sync()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(remote, self.git("-C", "local", "rev-parse", "HEAD"))

    def test_diverged_preserves_both_commits(self):
        local = self.commit("local", "local.txt", "local change")
        remote = self.commit("peer", "remote.txt", "remote change")
        self.git("-C", "peer", "push", "origin", "main")
        # An explicit merge must work even if the user's pull policy is ff-only.
        self.git("-C", "local", "config", "pull.ff", "only")
        result = self.sync()
        self.assertEqual(result.returncode, 0, result.stderr)
        for commit in (local, remote):
            self.git("-C", "local", "merge-base", "--is-ancestor", commit, "HEAD")

    def test_conflict_stops_sync(self):
        local = self.commit("local", "base.txt", "local change")
        self.commit("peer", "base.txt", "remote change")
        self.git("-C", "peer", "push", "origin", "main")
        result = self.sync()
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn("Remote changes synced", result.stdout)
        self.assertEqual(local, self.git("-C", "local", "rev-parse", "HEAD"))
        self.assertTrue(self.git("-C", "local", "diff", "--name-only", "--diff-filter=U"))

    def deploy(self, build_exit=0, choice="1\n"):
        # Exercise the real entrypoint and Git operations; replace expensive
        # asset/build/publishing boundaries with local markers.
        for filename in ("package.json", "gatsby-config.js"):
            if not (self.root / "local" / filename).exists():
                self.commit("local", filename, "{}")
        script = FUNCTIONS + '''
npm() { :; }
setup_git_lfs() { :; }
build_project() { return "$BUILD_EXIT"; }
deploy_to_gh_pages() {
    test "$(git rev-parse HEAD)" = "$(git ls-remote origin refs/heads/main | cut -f1)"
    touch ../published
}
main
'''
        return subprocess.run(
            ["bash", "-c", script], cwd=self.root / "local",
            env=dict(self.env, BUILD_EXIT=str(build_exit)), input=choice,
            text=True, capture_output=True,
        )

    def test_choice_one_commits_and_pushes_source_before_publishing(self):
        (self.root / "local" / "new-page.txt").write_text("new page")
        result = self.deploy()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue((self.root / "published").exists())
        self.assertEqual(self.git("--git-dir=remote.git", "show", "main:new-page.txt"), "new page")

    def test_failed_source_push_prevents_publication(self):
        hook = self.root / "remote.git" / "hooks" / "pre-receive"
        hook.write_text("#!/bin/sh\nexit 1\n")
        hook.chmod(0o755)
        result = self.deploy()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Source push failed", result.stdout)
        self.assertFalse((self.root / "published").exists())

    def test_failed_build_does_not_push_source(self):
        before = self.git("--git-dir=remote.git", "rev-parse", "main")
        result = self.deploy(build_exit=1)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(before, self.git("--git-dir=remote.git", "rev-parse", "main"))
        self.assertFalse((self.root / "published").exists())

    def test_feature_branch_is_not_published_as_main(self):
        self.git("-C", "local", "checkout", "-b", "feature")
        result = self.deploy()
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse((self.root / "published").exists())

    def test_old_stash_is_not_restored_by_deployment(self):
        (self.root / "local" / "base.txt").write_text("unrelated old edit")
        self.git("-C", "local", "stash", "push")
        old_stash = self.git("-C", "local", "rev-parse", "refs/stash")
        result = self.deploy()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(old_stash, self.git("-C", "local", "rev-parse", "refs/stash"))
        self.assertEqual((self.root / "local" / "base.txt").read_text(), "base")

    def test_temporary_stash_restored_after_success_and_build_failure(self):
        for build_exit in (0, 1):
            with self.subTest(build_exit=build_exit):
                draft = self.root / "local" / "draft.txt"
                draft.write_text("keep my untracked draft")
                result = self.deploy(build_exit=build_exit, choice="2\n")
                self.assertEqual(result.returncode, build_exit, result.stderr)
                self.assertEqual(draft.read_text(), "keep my untracked draft")
                self.assertEqual(self.git("-C", "local", "stash", "list"), "")
                draft.unlink()

    def test_cancel_leaves_changes_uncommitted(self):
        draft = self.root / "local" / "draft.txt"
        draft.write_text("do not publish")
        result = self.deploy(choice="3\n")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertFalse((self.root / "published").exists())
        self.assertIn("?? draft.txt", self.git("-C", "local", "status", "--porcelain"))


if __name__ == "__main__":
    unittest.main()
