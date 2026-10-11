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


if __name__ == "__main__":
    unittest.main()
