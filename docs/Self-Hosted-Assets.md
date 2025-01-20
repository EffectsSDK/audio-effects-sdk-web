# Self Hosted Assets
To use our SDK in production, we suggest moving all the required assets under your own domain and distribute them from there.

# List of assets
We provide the assets with every SDK update, which will include the ML model files, inference engine wasm files, and the SDK itself.

Example of assets structure (you can find all these assets in the current repository):

* assets
  * models
    * audio-model-1.0.1.tsvb
    * audio-model-2.5.0.tsvb
    * audio-model-3.3.1.wasm
  * ort-wasm.wasm
  * ort-wasm-simd.wasm
  * atsvb-web.js

# Assets Hosting

 * Put the assets in a subfolder of your site, for example: https://mysite.com/esdk/
 * Load the SDK from https://mysite.com/esdk/tsvb-web.js
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