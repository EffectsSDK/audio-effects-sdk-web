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
- Studio Sound - audio enhancement with Equalizer, Compressor, Noise Gate, De-Esser, Auto Gain Control, Brickwall Limiter, Metrics
- Compatible with all major browsers
- High performance leveraging WebAssembly
- Multiple presets tailored for various hardware and use cases, balancing speed and quality
- Supports sample rates: 16K, 32K, 44.1K, 48K
- Simple and seamless integration

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
  //default preset
  preset: 'balanced',
  //default sample rate for processing
  sample_rate: 32000,
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
    preset: 'balanced',
    sample_rate: 32000
});

sdk.preload();
```

## Usage with Microphone

```javascript
const sdk = new window.atsvb('{CUSTOMER_ID}');

sdk.config({
    preset: 'balanced',
    sample_rate: 32000
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

## Documentation
- [API Reference](https://effectssdk.ai/sdk/audio/docs/classes/atsvb.html)
- [Technical Details](docs/Technical-Details.md)
- [Self Hosted Assets](docs/Self-Hosted-Assets.md)
