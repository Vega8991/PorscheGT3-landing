import sys, glob
from PIL import Image
pat, out, cols = sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 2
fs = sorted(glob.glob(pat)); print(fs)
ims = [Image.open(f) for f in fs]; W = 720; H = int(ims[0].height * W / ims[0].width)
s = Image.new('RGB', (W * cols, H * ((len(ims) + cols - 1) // cols)))
for i, im in enumerate(ims): s.paste(im.resize((W, H)), ((i % cols) * W, (i // cols) * H))
s.save(out)
