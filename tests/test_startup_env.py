import os
import subprocess
import unittest

class TestStartupEnv(unittest.TestCase):
    def test_missing_secret_key_fails_fast_with_clear_message(self):
        # Run a python command that unsets SECRET_KEY and imports app
        script = (
            "import os, dotenv\n"
            "# Mock dotenv to not load .env\n"
            "dotenv.load_dotenv = lambda *args, **kwargs: None\n"
            "os.environ.pop('SECRET_KEY', None)\n"
            "import app\n"
        )
        proc = subprocess.run(
            [r".\.venv\bin\python.exe", "-c", script],
            capture_output=True,
            text=True
        )
        self.assertNotEqual(proc.returncode, 0)
        self.assertIn("RuntimeError", proc.stderr)
        self.assertIn("Configuration error: The SECRET_KEY environment variable is not set", proc.stderr)

if __name__ == "__main__":
    unittest.main()
