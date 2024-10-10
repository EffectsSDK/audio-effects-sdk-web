# Audio Effects SDK - Web Integration Sample
Add real-time AI audio denoise to your product in a hour. 

## Requirements

- Obtaining Effects SDK Customer ID
- SSL to get MediaStream from browser

## Documentation
- [API Reference](https://effectssdk.ai/sdk/audio/docs/classes/atsvb.html)


## Demo
[Live Demo](https://effectssdk.ai/products/audio-effects-sdk)


We've developed three distinct presets, each powered by a unique machine learning model. These presets range from offering the highest quality to the best speed and CPU efficiency. Depending on the specific needs of your application and the hardware resources at your disposal, you can choose the most suitable preset.

The Speed and Quality presets are exclusively compatible with a 16000 sample rate. On the other hand, the Balanced preset is versatile, supporting multiple sample rates including 16000, 32000, 44100, and 48000.

For most users, we recommend the Balanced preset, particularly with a sample rate of either 16000 or 32000, as this configuration offers a well-rounded balance of performance and quality.


## Obtaining Effects SDK Customer ID
Effects SDK Customer ID is required to get SDK working.

To receive a new trial Customer ID please fill in the contact form on [effectssdk.com](https://effectssdk.ai/request-trial) website.

## Technical Details

- CUSTOMER_ID should be provided to the SDK constructor.
- SDK has 3 speed/balanced/quality presets (different ML models).

## Features

- AI Denoise - **implemented**
