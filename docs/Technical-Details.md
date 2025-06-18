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

```javascript
// The type you receive in the onError callback
export interface ErrorObject {
  message: string;
  type: ErrorType;
  code?: ErrorCode;
  emitter?: ErrorEmitter;
  cause?: Error;
  data?: any;
}

export enum ErrorCode {
  PERFORMANCE_STOP     = 1001, // SDK stopped because latency exceeded 1 second
  REDUCE_LATENCY       = 1002, // SDK sped up audio (up to 20%) to reduce latency
  MODEL_LOAD_FAILED    = 1010, // Failed to load model (e.g. network error)
  PROCESSOR_INIT_ISSUE = 1020, // Failed to initialize processing module
  AUTH_ISSUE           = 1030, // Session server activation failed
  SUPPORT_ISSUE        = 1040, // SIMD support required by the “Balanced” preset is missing
}
```

The SDK provides an onError callback, where you can receive information about errors or the current state of the SDK.
Here are the key points to monitor:

1. Output audio speed-up (REDUCE_LATENCY) 
   
  - This is a normal response when latency creeps above your threshold. The SDK accelerates some chunks (up to 20%) to keep things in sync.

2. SDK processing stopped (PERFORMANCE_STOP)

  - Occurs when latency exceeds 1 second continuously, so the SDK can no longer process in real time.
  - In this case, incoming audio is passed through untouched.
  - Currently we are stopping the SDK if latency more than a second
  - Often transient resource spikes trigger it - consider retrying: wait ~2 seconds, then call sdk.run() again.
     