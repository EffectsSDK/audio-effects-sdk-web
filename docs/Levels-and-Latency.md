# Level Control and Latency

How to run the SDK's Auto Gain Control and Noise Gate next to the browser's own audio
processing, and how to pick a latency policy. The examples below are condensed from a
production browser calling application.

---

## Table of Contents

1. [The problem: you are not the only one processing the audio](#the-problem-you-are-not-the-only-one-processing-the-audio)
2. [Step 1 — Detect what the browser is doing](#step-1--detect-what-the-browser-is-doing)
3. [Step 2 — Configure Studio Sound for that tier](#step-2--configure-studio-sound-for-that-tier)
4. [The Noise Gate](#the-noise-gate)
5. [Latency mode](#latency-mode)
6. [Switching presets and devices mid-call](#switching-presets-and-devices-mid-call)
7. [Diagnostics](#diagnostics)
8. [Complete example](#complete-example)

---

## The problem: you are not the only one processing the audio

Before your application ever sees a microphone track, the browser has already run its
own echo canceller, noise suppressor and gain control over it. You ask for what you
want through `getUserMedia` constraints — but a constraint is a request, not a
guarantee, and on some platforms it cannot be honoured at all.

The important case is echo cancellation. On iOS, and on any platform where the
operating system provides the echo canceller (Android with a hardware AEC, some
Windows drivers), asking for `echoCancellation: true` switches the capture to a
system voice-processing unit that bundles AEC, AGC and noise suppression together.
They cannot be separated. You get the browser's gain control whether you want it or
not, and on iOS `getSettings()` will not even report `autoGainControl`, so you cannot
tell from the API that it happened.

This matters because two automatic gain controls in series chase each other. Each one
reacts to the other's corrections, and the result is audible pumping. The rule that
follows is simple: **decide which AGC is in charge, and make the other one either
absent or demonstrably slower.**

For a call you never give up echo cancellation to win this argument. Echo is fatal;
a few dB of level mismatch is not.

---

## Step 1 — Detect what the browser is doing

Ask for what you want, then read back what you got:

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    deviceId: deviceId ? { exact: deviceId } : undefined,
    echoCancellation: true,     // keep it: this is a call
    noiseSuppression: false,    // the SDK does this, and better
    autoGainControl: false,     // we would like to own the level
  },
});

const settings = stream.getAudioTracks()[0].getSettings();
```

Classify the result into one of three tiers:

```javascript
function detectTier(settings) {
  const supported = navigator.mediaDevices.getSupportedConstraints();

  // The browser confirms it turned its own AGC off.
  if (settings.echoCancellation === true &&
      supported.autoGainControl &&
      settings.autoGainControl === false) {
    return 'full-control';
  }

  // The browser told us its AGC is on: bundled with the AEC, most likely.
  if (settings.autoGainControl === true) {
    return 'aec-bundled';
  }

  // Nothing was reported. iOS Safari lands here.
  return 'unknown';
}
```

`unknown` is treated exactly like `aec-bundled`. The risk is asymmetric: guessing
"conservative" when you had full control costs you some gain range, while guessing
"full control" when you did not gives you two fast AGCs fighting each other.

The SDK exposes the track it is actually reading from, so you can re-check this at any
point without holding on to the stream yourself:

```javascript
const track = sdk.getInputAudioTrack();
console.log(track && track.getSettings());
```

---

## Step 2 — Configure Studio Sound for that tier

```javascript
const AGC_PROFILES = {
  // Browser AGC is off and confirmed off. The SDK owns the level.
  'full-control': {
    agcMaxBoostDb: 30,
    agcMaxGainChangeDbPerSec: 6,
    agcStartupGainChangeDbPerSec: 60,
    agcMaxOutputNoiseDb: -45,
  },

  // Browser AGC is on, or we cannot tell. Trim only, and stay slower than it.
  'aec-bundled': {
    agcMaxBoostDb: 6,
    agcMaxGainChangeDbPerSec: 3,
    agcStartupGainChangeDbPerSec: 3,
    agcMaxOutputNoiseDb: -45,
  },
};
AGC_PROFILES['unknown'] = AGC_PROFILES['aec-bundled'];

function applyStudioSound(sdk, tier, agcEnabled, targetDb) {
  sdk.setStudioSoundOptions({
    enabled: true,
    options: {
      enableNoiseGate: true,
      enableDeEsser: false,
      enableCompressorEQ: false,
      enableEqualizer: false,
      enableAutoGain: agcEnabled,
      autoGainTargetDb: targetDb,
      ...AGC_PROFILES[tier],
      outputGain: 1,
    },
  });
}
```

### Why those three values differ

**`agcMaxBoostDb: 30 → 6`.** When an external AGC has already lifted a quiet
microphone, there is nothing left for a second one to lift. Leaving both with the same
30 dB of authority gives two controllers the same job.

**`agcMaxGainChangeDbPerSec: 6 → 3`.** This is the one that actually prevents pumping.
Two gain controllers oscillate when their time constants are comparable; if one is
demonstrably slower, it settles instead of chasing. This is a hard slew limit, not a
smoothing coefficient, so the guarantee holds regardless of what the other controller
does.

**`agcStartupGainChangeDbPerSec: 60 → 3`.** The fast startup phase exists to close a
large gap quickly when the SDK starts cold. With an external AGC already holding the
level there is no gap to close, and a fast ramp will only react to the other
controller's transient.

### Two rules that are easy to get wrong

**Send the whole options object every time.** Options are *merged* into the enhancer's
current state, not replaced. A key present in one call and absent in the next keeps its
previous value. If your `full-control` branch omits the keys that your conservative
branch sets, the conservative values survive the switch and the AGC stays clamped for
the rest of the session — with no error and nothing in the logs.

**`outputGain` is not a level control.** It is applied after the AGC and bypasses its
peak and noise ceilings. Raising it to compensate for a quiet signal disables the
protection against clipping. Change `autoGainTargetDb` instead.

---

## The Noise Gate

The gate runs after the denoise model, so its defaults are deliberately gentle — its
job is to tidy near-silence, not to do the suppression:

| Option | Default | Meaning |
|---|---|---|
| `enableNoiseGate` | `true` | on by default |
| `gateThreshold` | `-65` dBFS | below this the gate starts closing |
| `gateReduction` | `-18` dB | how far down it pulls when fully closed |

Keep it on when an external AGC is present. A browser AGC raises its gain during
pauses, which lifts the noise floor with it, and the gate is what keeps that from being
audible between phrases. The `agcMaxOutputNoiseDb` ceiling works on the same problem
from the other side: it refuses to add SDK gain on top of a noise floor that has
already risen.

If you hear the noise floor breathing in pauses, tighten `agcMaxOutputNoiseDb` toward
`-50` before touching the gate thresholds.

---

## Latency mode

```javascript
sdk.config({ latency_mode: 'auto' });   // 'auto' | 'low' | 'stable'
```

| Mode | Behaviour |
|---|---|
| `low` | Smallest output buffer. Lowest latency, least tolerance for scheduling jitter. |
| `stable` | Keeps more slack in the buffer. Higher latency, far fewer underruns. |
| `auto` | Starts at `low` and backs off after underruns. |

The pipeline also learns a safe buffer floor at runtime from the underruns it actually
observes, so `auto` adapts to the machine it is running on rather than to a guess.

A simple and effective policy is to pick by device class — mobile hardware and
background tabs are where scheduling jitter comes from:

```javascript
function pickLatencyMode() {
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|ipad|ipod|mobile|tablet/.test(ua);
  return isMobile ? 'stable' : 'low';
}

sdk.config({ latency_mode: pickLatencyMode() });
```

Preset choice interacts with this. `speed` costs far less CPU than `balanced`, and the
headroom it leaves is itself underrun protection — on mobile it is usually the better
trade even when the device could nominally run `balanced`.

For a call, also consider `context_sample_rate: 48000`: it makes the SDK's
`AudioContext` run at the rate the Opus encoder wants, removing a resampling step from
the output path. It has to be set before the input stream is attached, because an
`AudioContext` cannot change its rate afterwards.

---

## Switching presets and devices mid-call

**Studio Sound options can be changed at any time.** `setStudioSoundOptions()` is a
message to the audio worklet — no track is replaced, no renegotiation happens. This is
what makes the "start conservative, escalate later" strategy practical: begin in the
`unknown` profile, and if you determine that no external AGC is present, move to
`full-control` without interrupting the call.

**Capture constraints cannot.** `applyConstraints()` may be silently ignored, and the
fallback — calling `getUserMedia` again — produces a new track and a renegotiation.
Decide the constraints when the call starts.

**Mute Studio Sound across a preset switch.** `setPreset()` stops the pipeline
internally, which resets the enhancer's state, while the bypass path keeps feeding it
raw undenoised audio. The gate and the AGC converge on that, then converge again on the
new model's output; the double adaptation is audible as the noise floor moving back and
forth.

```javascript
async function switchPreset(sdk, preset, sampleRate) {
  sdk.config({ preset, sample_rate: sampleRate });
  sdk.setStudioSoundOptions({ enabled: false });
  try {
    await sdk.setPreset(preset, sampleRate);
  } finally {
    // in `finally` so a failed switch cannot leave the chain disabled
    applyStudioSound(sdk, tier, agcEnabled, targetDb);
  }
}
```

The same applies to a microphone change: `useStream()` also stops the pipeline
internally, so the AGC restarts its convergence from unity gain each time.

---

## Diagnostics

```javascript
sdk.enableDebugStats(true);
sdk.onDebugStats((s) => {
  // s.inputClipCount / s.inputClipPeak      - is the capture itself clipping
  // s.outputLimiterCount / .outputLimiterPeak - is the AGC driving the limiter
  // s.underrunCount / s.silentFrames        - is the buffer starving
  // s.pipelineGainDb                        - long-term input/output energy ratio
});

sdk.onStudioAudioMetrics((m) => {
  // m.rmsDb / m.peakDb - output level in dBFS
});

const info = sdk.getSpeedupDebugInfo();
// info.latencyMs, info.outputBufferMs, info.workerBacklogMs
// info.latencyMode, info.latencyProfile, info.floorMs
// info.contextSampleRate, info.modelSampleRate  - unequal means resampling is active
```

Two readings tell you most of what you need:

- **Limiter hits climbing while the speech level is above your target** — the AGC is
  overshooting. Check that the profile for the current tier was actually applied.
- **A noise floor that rises during pauses and drops when speech starts** — that is an
  external AGC at work, whatever `getSettings()` claims. Use the conservative profile.

---

## Complete example

```javascript
class AudioLevelManager {
  constructor(customerId) {
    this.sdk = new atsvb(customerId);
    this.tier = null;          // null is treated as conservative
    this.agcEnabled = true;
    this.targetDb = -18;

    this.sdk.config({
      preset: 'speed',
      sample_rate: 16000,
      latency_mode: /android|iphone|ipad|ipod|mobile/.test(navigator.userAgent.toLowerCase())
        ? 'stable' : 'low',
    });
    this.sdk.preload();
  }

  async start(deviceId) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        echoCancellation: true,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });

    this.tier = detectTier(stream.getAudioTracks()[0].getSettings());

    this.sdk.onReady = () => {
      this.applyStudioSound();   // after the pipeline exists and the tier is known
      this.sdk.run();
    };
    this.sdk.useStream(stream);

    return this.sdk.getStream();
  }

  applyStudioSound() {
    const profile = AGC_PROFILES[this.tier] || AGC_PROFILES['aec-bundled'];
    this.sdk.setStudioSoundOptions({
      enabled: true,
      options: {
        enableNoiseGate: true,
        enableDeEsser: false,
        enableCompressorEQ: false,
        enableEqualizer: false,
        enableAutoGain: this.agcEnabled,
        autoGainTargetDb: this.targetDb,
        ...profile,
        outputGain: 1,
      },
    });
  }

  // Safe to call at any point during a call.
  setAgc(enabled, targetDb) {
    this.agcEnabled = enabled;
    this.targetDb = targetDb;
    this.applyStudioSound();
  }
}
```

---

## Related

- [Studio Sound](Studio-Sound.md) — every filter and option in detail
- [Technical Details](Technical-Details.md)
- [Self Hosted Assets](Self-Hosted-Assets.md)
