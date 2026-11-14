"""Rebuild every OneShot chapter written with lib.py (each file re-runs its own checks).
Usage (repo root):  pip install sympy mpmath  →  python3 tools/oneshot/build_all.py"""
import glob, os, runpy, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
for f in sorted(glob.glob(os.path.join(HERE, "[pcm]_*.py"))):
    runpy.run_path(f, run_name="__main__")
