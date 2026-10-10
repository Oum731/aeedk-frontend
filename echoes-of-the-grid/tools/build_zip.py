import zipfile, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
out = root / "release" / "echoes-of-the-grid-crazygames.zip"
files = ["index.html", "js/levels.js", "js/audio.js", "js/game.js"]
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for f in files:
        z.write(root / f, f)
print(out, out.stat().st_size, "bytes")
