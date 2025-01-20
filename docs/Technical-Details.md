# Technical Details

### Initial Loading Optimization
- **Local Model Caching:**  
  On the first load, the SDK can cache ML model files locally. This behavior is configurable via `sdk.config({ cacheModels: true })` (true by default).
  The SDK provides a method to clear local cache with models via `sdk.clearCache()`.

- **Preload Function:**  
  Utilize the `sdk.preload()` method to load all required assets into memory before initiating the license call. Once preloaded, the SDK can start processing immediately.

- **Initial Page Preload:**  
  Initialize the SDK and perform the first preload on an introductory page of your application. This caches model files locally for the user, reducing network requests in subsequent uses.
  
- **Early Audio Capture Preload:**  
  Preload on the page where audio capture begins to ensure readiness from the outset.

## Managing Audio Processing

### Stopping and Restarting Processing

- **Run and Stop:**  
  Implement methods to pause (`sdk.stop()`) and resume (`sdk.run()`) SDK processing without disrupting the overall audio stream. When the SDK is stopped, it bypasses the original audio to output.


## Error Handling

The SDK provides an onError callback, where you can receive information about errors or the current state of the SDK.
Here are the key points to monitor:

1. Output audio speedup message - This is a normal occurrence where the SDK adjusts latency if it becomes too high.

2. SDK processing stopped - This happens when latency is too high, and the SDK is unable to process audio in real time. In such cases, the original audio will automatically pass through to the output.