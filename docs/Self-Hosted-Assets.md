# Self Hosted Assets
To use our SDK in production, we suggest moving all the required assets under your own domain and distribute them from there.

# List of assets
We provide the assets with every SDK update, which will include the ML model files, inference engine wasm files, and the SDK itself.

Example of assets structure (you can find all these assets in the current repository):

* assets
  * models
    * audio-model-2.5.0.tsvb
    * audio-model-3.3.3.wasm
    * audio-model-4.0.2.wasm
  * ort-wasm.wasm
  * ort-wasm-simd.wasm
  * atsvb-web.js

Which model a preset needs depends on the SDK version, so treat the list above as the
layout for the version in this repository rather than a fixed set:

| Preset | Model file |
|---|---|
| `speed` | `audio-model-4.0.2.wasm` |
| `balanced` | `audio-model-3.3.3.wasm` |
| `quality` | `audio-model-2.5.0.tsvb` (also needs the two `ort-wasm*.wasm` files) |

Call `sdk.getRequiredModels()` to get the exact files and URLs the SDK version you
installed will fetch. Pin that version in npm so the requirements cannot change under
a folder you have already filled - see the README section on version pinning.

# Assets Hosting

 * Put the assets in a subfolder of your site, for example: https://mysite.com/esdk/
 * Load the SDK from https://mysite.com/esdk/atsvb-web.js
 * Configure the SDK to work with the right assets:
 ```
  const sdk = new window.atsvb('{CUSTOMER_ID}');
  sdk.config({sdk_url: 'https://mysite.com/esdk/'});
 ```

 # Recommendations

 * If the application will load the SDK from subdomains (or from other domains), you need to ensure that the files have the right Access-Control settings. For example:
 ```
  add_header 'Access-Control-Allow-Origin' '*';
 ```

 * To get rid of WASM MIME type warning add next line to /etc/nginx/mime.types
 ```
 application/wasm    wasm;
 ``` 

 * To speed up the assets loading, use an appropriate Cache-Control policy. Additionally, we recommend using CDN services like CloudFlare or CloudFront.