# Web Audio Effects SDK

# Real-time AI-Powered Audio Noise Suppression SDK

**Compatible with All Browsers and Effortlessly Integrates**

Experience flawless audio with our real-time AI-powered noise suppression solution, designed to work seamlessly across all browsers. Enjoy super easy integration, allowing you to enhance your application’s audio quality quickly and efficiently.

### Perfect for:
- **Video Conferencing:** Ensure crystal-clear communication without background distractions.
- **Live Streaming:** Deliver professional-grade audio for live broadcasts and streams.
- **Recording Applications:** Capture high-quality audio by eliminating unwanted noise.


## See it in Action
- [Noise Cancelling App - Chrome Extension](https://chromewebstore.google.com/detail/background-noise-remover/njmhcidcdbaannpafjdljminaigdgolj)
- [Relax Your Ears - Chrome Extension](https://chromewebstore.google.com/detail/relax-your-ears-ai-audio/haalkhejfckbcbheikblbllncbielmke)

## Simple Demo with Mic Playback and Audio/Video Postprocessing
- [Live Demo with Microphone](https://effectssdk.ai/sdk/audio/dev/mic-demo.html)
- [Live Demo Studio Sound with Microphone](https://effectssdk.ai/sdk/audio/dev/studio-sound-demo.html)
- [Live Demo for Audio Post-Processing](https://effectssdk.ai/sdk/audio/dev/audio-file-demo.html)
- [Live Demo for Video Post-Processing](https://effectssdk.ai/sdk/audio/dev/video-file-demo.html)

## Features

- Real-time AI-powered noise suppression
- Studio Sound - optional audio enhancement: Auto Gain Control, Noise Gate, Equalizer, Compressor, De-Esser, Brickwall Limiter, Metrics
- Adaptive jitter buffer with selectable latency policy
- Compatible with all major browsers
- High performance leveraging WebAssembly
- Multiple presets tailored for various hardware and use cases, balancing speed and quality
- Supports sample rates: 16K, 32K, 44.1K, 48K
- Simple and seamless integration

## Presets

| Preset | Sample rates | Notes |
|---|---|---|
| `speed` | 16000 | **Recommended.** Good quality at a fraction of the CPU cost. The headroom it leaves makes buffer underruns far less likely, which matters most on mobile and on loaded machines. |
| `balanced` | 32000, 44100, 48000 | Higher quality, noticeably heavier. |
| `quality` | 16000 | Highest quality, heaviest. Requires the ONNX runtime wasm files. |

`speed` and `balanced` require WebAssembly SIMD support; `quality` does not.

## Studio Sound
 - [Check out more details](docs/Studio-Sound.md)

## Trial Evaluation

A Customer ID is required for the Effects SDK.

To receive a new trial Customer ID, please fill out the contact form on the [effectssdk.ai](https://effectssdk.ai/cp/registration#audio) website.

## NPM

```terminal
npm install audio-effects-sdk
```

Usage of NPM package:

```typescript
import { atsvb } from 'audio-effects-sdk';

let sdk = new atsvb('{CustomerID}');

sdk.config({
  //default preset ('speed' is recommended, see Presets below)
  preset: 'speed',
  //default sample rate for processing
  sample_rate: 16000,
  //path to folder with models subfolder
  sdk_url: 'https://effectssdk.ai/sdk/audio/',
  //path to wasm files
  wasmPaths: {
      "ort-wasm.wasm": "https://effectssdk.ai/sdk/audio/dev/{SDK_VERSION}/ort-wasm.wasm",
      "ort-wasm-simd.wasm": "https://effectssdk.ai/sdk/audio/dev/{SDK_VERSION}/ort-wasm-simd.wasm"
  },
});

sdk.preload();
```

## Script Tag

```html
<script crossorigin="anonymous" src="https://effectssdk.ai/sdk/audio/dev/{SDK_VERSION}/atsvb-web.js"></script>
```

Usage of script tag instance:
```javascript
const sdk = new window.atsvb('{CUSTOMER_ID}');

sdk.config({
    preset: 'speed',
    sample_rate: 16000
});

sdk.preload();
```

## Usage with Microphone

```javascript
const sdk = new window.atsvb('{CUSTOMER_ID}');

sdk.config({
    preset: 'speed',
    sample_rate: 16000
});
sdk.preload();

sdk.onError((e) => {
    switch (e.type) {
        case 'error':
          console.error(e.message);
          break;
        case 'info':
          console.log(e.message);
          break;
    }
});

let audio = document.getElementById('audioElement');

sdk.onReady = () => {
    console.log('SDK is ready let\'s run it');
    //the output stream can be requested only after SDK is ready
    audio.srcObject = sdk.getStream();
    sdk.run();
};

window.addEventListener('load', function () {
    navigator.mediaDevices.getUserMedia({ video:false, audio: true }).then(stream => {
        sdk.useStream(stream);
    });
});

```

## Configuration

```javascript
sdk.config({
    // denoise model and the rate it runs at
    preset: 'speed',
    sample_rate: 16000,

    // latency policy: 'auto' | 'low' | 'stable'
    // 'auto' starts low and backs off after underruns, 'stable' keeps more slack
    latency_mode: 'auto',

    // AudioContext rate; 0 (default) lets the browser choose. Setting it to match
    // your encoder (48000 for Opus) avoids a resampling step on the output track.
    // Must be set before the input stream is attached.
    context_sample_rate: 0,

    // LSNR-based stage skipping for the wasm presets, saves CPU on clean frames
    denoise_stages: { enabled: false },
});
```

See [Level Control and Latency](docs/Levels-and-Latency.md) for how to choose these
in a real application, including what to do when the browser refuses to hand over
control of its own gain control.

## Runtime and Diagnostics API

```javascript
sdk.isRunning();            // is processing active
sdk.getLatencyMs();         // current end-to-end pipeline latency
sdk.getInputAudioTrack();   // capture track in use - getSettings() shows what the browser applied
sdk.getRequiredModels();    // model files this version needs, and the URLs it will fetch

sdk.enableDebugStats(true);
sdk.onDebugStats((s) => console.log(s));       // clipping, limiter hits, underruns, pipeline gain
sdk.getSpeedupDebugInfo();                     // jitter buffer state, latency split, sample rates
sdk.onStudioAudioMetrics((m) => console.log(m)); // output peak/RMS in dBFS
```

## Documentation
- [API Reference](https://effectssdk.ai/sdk/audio/docs/classes/atsvb.html)
- [Technical Details](docs/Technical-Details.md)
- [Level Control and Latency](docs/Levels-and-Latency.md)
- [Self Hosted Assets](docs/Self-Hosted-Assets.md)
