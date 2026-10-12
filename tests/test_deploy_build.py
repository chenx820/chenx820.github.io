"""Check dependency-install failures at the deployment build boundary."""

import os
from pathlib import Path
import subprocess
import tempfile
import unittest


FUNCTIONS = (Path(__file__).resolve().parents[1] / "deploy.sh").read_text().rsplit(
    '\nmain "$@"', 1
)[0]
NPM_STUB = '''
git() {
    echo "git $*" >> npm-calls
    return "$LFS_EXIT"
}
npm() {
    echo "$*" >> npm-calls
    if [ "$1" = ci ]; then
        return "$INSTALL_EXIT"
    fi
    if [ "$1" = run ] && [ "$2" = build ]; then
        mkdir -p public
        touch public/index.html
    fi
}
build_project
'''


class DeployBuildTest(unittest.TestCase):
    def run_build(self, install_exit, lfs_exit=0):
        with tempfile.TemporaryDirectory(prefix="deploy-build-test-") as temp:
            root = Path(temp)
            # A failed npm install can leave this directory behind.
            (root / "node_modules").mkdir()
            result = subprocess.run(
                ["bash", "-c", FUNCTIONS + NPM_STUB], cwd=root,
                env=dict(os.environ, INSTALL_EXIT=str(install_exit), LFS_EXIT=str(lfs_exit)),
                text=True, capture_output=True,
            )
            return result, (root / "npm-calls").read_text().splitlines()

    def test_existing_directory_still_installs_locked_dependencies(self):
        result, calls = self.run_build(0)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(calls, [
            "git lfs pull --include=content/**,src/**,static/** --exclude=",
            "ci --no-audit --no-fund", "run build",
        ])

    def test_failed_install_prevents_build(self):
        result, calls = self.run_build(1)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(calls, [
            "git lfs pull --include=content/**,src/**,static/** --exclude=",
            "ci --no-audit --no-fund",
        ])
        self.assertNotIn("Project built successfully", result.stdout)

    def test_failed_asset_download_prevents_install_and_build(self):
        result, calls = self.run_build(0, lfs_exit=1)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(calls, [
            "git lfs pull --include=content/**,src/**,static/** --exclude=",
        ])


if __name__ == "__main__":
    unittest.main()
