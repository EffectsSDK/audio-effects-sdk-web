import { StreamProcessor } from "../stream_processor";
import { DenoiseStagesOptions } from "../model";
import { ModelType } from "../settings";
import { StudioAudioOptions } from "../utils/enhancer";
export declare class BufferStreamProcessor extends StreamProcessor {
    private _worker?;
    private _workerInitReplyWaiter?;
    private _isReady;
    private _denoisePower;
    private _denoiseStages;
    private _enhancer;
    private _metricsCalculator;
    private _studioSoundEnabled;
    private _studioSoundOptions;
    preload(): Promise<void>;
    init(stream: MediaStream | MediaStreamTrack): Promise<void>;
    /**
     * `sampleRate` is the rate the model is asked to run at, not the rate of the
     * buffers passed to processBuffer(): a model produces a different result at a
     * different rate, so it always runs at its configured rate and the incoming
     * buffer is resampled to it and back.
     */
    initForBuffer(preset?: ModelType, sampleRate?: number): Promise<void>;
    /**
     * The rate the model runs at: the requested one when supported, otherwise the
     * closest supported one.
     */
    private pickModelSampleRate;
    /**
     * Studio sound runs after the output is resampled back, so the enhancer works
     * at the rate of the buffer the caller passed in, not at the model rate.
     * Rebuilt per buffer so AGC/metrics state never leaks between calls.
     */
    private prepareEnhancer;
    processBuffer(audioData: Float32Array, sampleRate: number): Promise<Float32Array>;
    setStudioSoundOptions(options: StudioAudioOptions): void;
    getStudioAudioMetrics(): import("../utils/enhancer").AudioMetrics;
    private updateWorker;
    private initWorkerProcessor;
    private onWorkerMessage;
    private handleAuthRequest;
    setDenoisePower(power: number): void;
    setDenoiseStages(options: DenoiseStagesOptions): void;
    isReady(): boolean;
    destroy(): void;
}
