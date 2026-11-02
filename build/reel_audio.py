"""Original soundtrack + sound effects for design-src/reel-services-v2.html (27 s, 120 BPM).

Everything is synthesised here (no samples, no third-party music), and every hit is placed on
the same timeline as the animation, so music and picture stay in sync.
Usage:  python3 build/reel_audio.py build/reel-v2.wav
Needs numpy + scipy.
"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 48000
DUR = 27.0
N = int(SR * DUR)
BEAT = 0.5
G0 = 2.0                                  # groove starts on the logo hit
rng = np.random.default_rng(7)

def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(d * SR)) / SR
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def saw(f, t): return 2 * ((f * t) % 1) - 1
def noise(n): return rng.standard_normal(n)

class Bus:
    def __init__(self): self.x = np.zeros((N, 2))
    def add(self, sig, at, gain=1.0, pan=0.0):
        """Mix a mono (n,) or stereo (n,2) signal starting at time `at` (s)."""
        i = int(round(at * SR))
        if i >= N: return
        if sig.ndim == 1:
            l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
            sig = np.stack([sig * l, sig * r], 1) * np.sqrt(2)
        j = max(0, -i); i = max(0, i)
        seg = sig[j:j + N - i]
        self.x[i:i + len(seg)] += seg * gain

drums, bass, pad, arp, sfx, verb = Bus(), Bus(), Bus(), Bus(), Bus(), Bus()

# ---------------------------------------------------------------- sections
def groove(t):  return (G0 <= t < 17.5) or (22.0 <= t < 26.0)
def hats_on(t): return G0 <= t < 26.0
CHORDS = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]]   # Am  F  C  G
ROOTS = [45, 41, 48, 43]
def chord_at(t): return 0 if t < G0 else int((t - G0) // 2) % 4

# ---------------------------------------------------------------- instruments
def kick():
    t = tt(.45); f = 48 + 140 * np.exp(-t / .028)
    ph = 2 * np.pi * np.cumsum(f) / SR
    k = np.sin(ph) * np.exp(-t / .22) + .5 * np.exp(-t / .004) * noise(len(t)) * .3
    return np.tanh(k * 1.6)
def clap():
    t = tt(.3); env = np.zeros_like(t)
    for d in (0, .011, .022): env += (t >= d) * np.exp(-np.clip(t - d, 0, None) / (.006 if d < .02 else .12))
    return bp(noise(len(t)), 900, 3200) * env * .9
def hat(open_=False):
    t = tt(.3 if open_ else .06)
    return hp(noise(len(t)), 7000, 4) * np.exp(-t / (.09 if open_ else .018))
def pluck(m, d=.22, cut=3500, wave='saw'):
    t = tt(d); f = mtof(m)
    s = saw(f, t) + .5 * saw(f * 1.006, t) if wave == 'saw' else np.sign(np.sin(2 * np.pi * f * t))
    return lp(s * np.exp(-t / (d / 3.5)), cut) * .5
def bell(m, d=1.4):
    t = tt(d); f = mtof(m)
    return (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / .2)) * np.exp(-t / (d / 4)) * .4
def boom(d=2.0):
    t = tt(d); f = 32 + 70 * np.exp(-t / .12)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .7)
    s += lp(noise(len(t)), 900) * np.exp(-t / .08) * .5
    return np.tanh(s * 1.5)
def crash(d=2.0):
    t = tt(d); return hp(noise(len(t)), 4500, 2) * np.exp(-t / .55) * .45
def riser(d, f0=250, f1=9000):
    """Noise swept up through a band-pass, plus a rising tone."""
    n = int(d * SR); x = noise(n); out = np.zeros(n); blk = 1024
    for i in range(0, n, blk):
        u = i / n; fc = f0 * (f1 / f0) ** u
        out[i:i + blk] = bp(x[i:i + blk], fc * .7, min(fc * 1.4, SR / 2 - 100), 1)
    t = tt(d); u = t / d
    tone = np.sin(2 * np.pi * np.cumsum(180 * 4 ** u) / SR) * .25
    return (out * 2.2 + tone) * u ** 2.2
def whoosh(pre=.45, post=.3, f_peak=2600):
    """Air swoosh that peaks at t=pre (the cut)."""
    d = pre + post; n = int(d * SR); x = noise(n); out = np.zeros(n); blk = 512
    for i in range(0, n, blk):
        u = i / SR; k = u / pre if u < pre else 1 - (u - pre) / post * .7
        fc = 300 + (f_peak - 300) * np.clip(k, 0, 1) ** 1.5
        out[i:i + blk] = bp(x[i:i + blk], fc * .6, fc * 1.6, 1)
    t = tt(d)
    env = np.where(t < pre, (t / pre) ** 2.5, np.exp(-(t - pre) / (post / 3)))
    s = out * env * 2.0
    pan = np.clip((t - pre) / (d / 2), -1, 1)                       # sweeps left -> right through the cut
    return np.stack([s * np.cos((pan + 1) * np.pi / 4), s * np.sin((pan + 1) * np.pi / 4)], 1) * np.sqrt(2)
def pop(f0=1300, f1=500, d=.09):
    t = tt(d); f = f1 + (f0 - f1) * np.exp(-t / .015)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .03) * .7
def tick(f=3200, d=.025):
    t = tt(d); return np.sin(2 * np.pi * f * t) * np.exp(-t / .006) * .5
def slam():
    t = tt(.4); f = 60 + 160 * np.exp(-t / .03)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .12)
    s += bp(noise(len(t)), 1500, 6000) * np.exp(-t / .03) * .6
    return np.tanh(s * 1.4)
def glitch(d=.22):
    n = int(d * SR); out = np.zeros(n); q = np.random.default_rng(3); i = 0
    while i < n:
        L = min(int(q.uniform(.008, .03) * SR), n - i); t = np.arange(L) / SR
        f = q.choice([180, 360, 720, 1440, 2880]); s = np.sign(np.sin(2 * np.pi * f * t))
        s = np.round(s * q.uniform(.2, 1) * 4) / 4
        out[i:i + L] = s * (q.random() > .25); i += L
    return out * .35

# ---------------------------------------------------------------- music
beats = np.arange(G0, 26.0, BEAT)
kicks = [b for b in beats if groove(b)]
for b in kicks: drums.add(kick(), b, .95)
for b in beats:
    k = int(round((b - G0) / BEAT))
    if groove(b) and k % 2 == 1: drums.add(clap(), b, .55); verb.add(clap(), b, .18)
    if hats_on(b + .25):
        g = .22 if groove(b) else .12
        drums.add(hat(open_=(k % 4 == 3)), b + .25, g * (1.3 if k % 4 == 3 else 1), pan=.25)
    if groove(b):
        drums.add(hat(), b, .08, pan=-.3)
# snare roll building into the CTA drop (20.0 -> 22.0)
t0, roll = 20.0, []
while t0 < 22.0:
    roll.append(t0); u = (t0 - 20.0) / 2.0
    t0 += .25 if u < .5 else (.125 if u < .85 else .0625)
for x in roll:
    u = (x - 20) / 2
    s = clap() if u < .9 else clap()[:int(.05 * SR)]
    drums.add(s, x, .15 + .45 * u ** 1.5, pan=(u - .5) * .4)

# sidechain envelope from the kicks
duck = np.ones(N); tn = np.arange(N) / SR
for b in kicks:
    i = int(b * SR); j = min(N, i + int(.4 * SR))
    duck[i:j] = np.minimum(duck[i:j], 1 - .65 * np.exp(-(tn[i:j] - b) / .11))

# bass: rolling 8ths on the root
for b in np.arange(G0, 26.0, BEAT / 2):
    if not groove(b): continue
    m = ROOTS[chord_at(b)]
    bass.add(pluck(m - 12, .24, 650) + pluck(m, .24, 900) * .35, b, .9)

# pad: detuned saws, chord per bar, whole video
for bar in range(-1, 13):
    st = G0 + bar * 2 if bar >= 0 else 0.0
    d = 2.0 if bar >= 0 else 2.0
    if st >= 26.0: break
    ch = CHORDS[chord_at(st + .01)] if bar >= 0 else [57, 64, 69]
    t = tt(d + .6); s = np.zeros_like(t)
    for m in ch:
        for det in (-.07, 0, .07):
            s += saw(mtof(m + det), t + rng.random())
    env = np.clip(t / (.9 if bar < 0 else .25), 0, 1) * np.clip((d + .6 - t) / .6, 0, 1)
    s = lp(s * env, 1100 if bar < 0 else 1700) * .12
    g = .7 if (17.5 <= st < 22.0) else .5
    pad.add(s, st, g)
    verb.add(s, st, .25)

# arp: 16ths, chord tones up two octaves
PAT = [0, 1, 2, 1, 3, 2, 1, 2]
for b in np.arange(5.0, 26.0, BEAT / 4):
    ch = CHORDS[chord_at(b)]; tones = ch + [ch[0] + 12]
    k = int(round((b - 5.0) / (BEAT / 4)))
    m = tones[PAT[k % 8]] + 12
    bright = 2600 if not (17.5 <= b < 22) else 1800 + 2500 * np.clip((b - 17.5) / 4.5, 0, 1)
    s = pluck(m, .16, bright)
    pan = .45 * np.sin(k * .7)
    arp.add(s, b, .32, pan=pan)
    verb.add(s, b + .375, .10, pan=-pan)                         # dotted-8th echo

# ---------------------------------------------------------------- sound design
sfx.add(riser(2.0), 0.0, .55); verb.add(riser(2.0), 0.0, .2)
for at in (2.0, 22.0):
    sfx.add(boom(), at, 1.0); sfx.add(crash(), at, .7, pan=.1); verb.add(boom(), at, .25)
    for m in (69, 76, 81): sfx.add(bell(m, 2.0), at + .02, .18); verb.add(bell(m, 2.0), at, .25)
sfx.add(slam(), 2.25 - .02, .7, pan=-.15); sfx.add(slam(), 2.5 - .02, .8, pan=.15)
for k, at in enumerate((3.0, 3.125, 3.25)): sfx.add(tick(2400 + k * 400), at, .7)
sfx.add(glitch(), 3.42, .7); sfx.add(slam(), 3.5 - .02, .8); verb.add(slam(), 3.5, .2)
sfx.add(whoosh(.5, .35, 3200), 5.0 - .5, .9)                       # zoom-through into the services
for cut in (7.5, 10.0, 12.5, 15.0, 17.5):
    sfx.add(whoosh(.4, .3), cut - .4, .75)
for i in range(5):                                                 # each service: icon flip + 3 chips
    ps = 5.0 + 2.5 * i
    m = CHORDS[chord_at(ps + .5)][2] + 12
    sfx.add(bell(m, 1.0), ps + .45, .35); verb.add(bell(m, 1.0), ps + .45, .25)
    for k in range(3):
        sfx.add(pop(1100 + 150 * k, 450), ps + 1.07 + k * .25, .5, pan=(-.35 if k % 2 == 0 else .35))
        sfx.add(tick(5200), ps + 1.07 + k * .25, .25)
    for k in range(2):                                             # title words drop in
        sfx.add(tick(1800), ps + .5 + k * .08, .25)
# scene C: pins, planes, landings
sfx.add(pop(900, 400), 17.5 + .62, .5)
for t0, d, pan in ((18.5, .9, .5), (18.85, .8, .2)):
    sfx.add(whoosh(d * .6, d * .5, 1800), t0, .35)
    sfx.add(pop(1500, 700), t0 + d, .55, pan=pan); verb.add(bell(81, .8), t0 + d, .25)
sfx.add(riser(2.0, 400, 10000), 20.0, .45)
sfx.add(whoosh(.35, .4, 3600), 21.5 - .35, .9)                     # red circle wipe
# CTA details
for k in range(6): sfx.add(bell(76 + [0, 3, 5, 7, 10, 12][k], .9), 22.45 + k * .06, .16, pan=-.4 + k * .16)
for k in range(3): sfx.add(tick(2000 + 300 * k), 22.95 + k * .12, .5)
for k in range(16): sfx.add(tick(4200 + (k % 3) * 300, .015), 23.45 + k * .035, .18, pan=-.3 + k * .04)
sfx.add(pop(1000, 500), 24.0, .35)
sfx.add(pop(1400, 600), 24.5, .6); verb.add(bell(88, 1.0), 24.5, .3)
# final sting
sfx.add(boom(1.0), 26.0, .8); sfx.add(crash(1.0), 26.0, .5)
t = tt(1.0); stab = sum(saw(mtof(m), t) for m in (57, 64, 69, 72)) * np.exp(-t / .3)
stab = lp(stab, 2500) * .15
sfx.add(stab, 26.0, .9); verb.add(stab, 26.0, .6)

# ---------------------------------------------------------------- mix
ir_t = tt(2.4)
ir = np.stack([noise(len(ir_t)) * np.exp(-ir_t / .55), noise(len(ir_t)) * np.exp(-ir_t / .55)], 1)
ir[:, 0] = lp(ir[:, 0], 6000); ir[:, 1] = lp(ir[:, 1], 6000); ir /= np.sqrt((ir ** 2).sum(0))
wet = np.stack([fftconvolve(verb.x[:, c], ir[:, c])[:N] for c in range(2)], 1)

mix = drums.x * .5 + bass.x * duck[:, None] * 1.0 + pad.x * duck[:, None] * 1.5 + arp.x * (.4 + .6 * duck[:, None]) * 2.2 + sfx.x * .8 + wet * .8
mix = np.stack([hp(mix[:, c], 30) for c in range(2)], 1)
fade = np.clip((DUR - tn) / .5, 0, 1)[:, None]                     # soft end on the last half second
mix *= fade
mix /= np.abs(mix).max()
mix = np.tanh(mix * 1.5) / np.tanh(1.5) * .78                      # gentle limiter, true peak below -1 dBTP
out = sys.argv[1] if len(sys.argv) > 1 else 'reel-v2.wav'
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print('wrote', out, f'{DUR}s')
