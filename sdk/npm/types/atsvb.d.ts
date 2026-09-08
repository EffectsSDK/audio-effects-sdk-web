/// <reference types="dom-mediacapture-transform" />
import { DenoiseStagesOptions, ModelType } from "./settings";
import { ErrorObject } from "./utils/errorBus";
import { StudioAudioOptions } from "./utils/enhancer";
export { StudioAudioOptions, EnhancementOptions, EQPreset } from "./utils/enhancer/types";
export { DenoiseStagesOptions } from "./settings";
export declare class atsvb {
    onReady?: () => void;
    private _currentInitialization?;
    private _loader;
    private streamProcessor;
    private _isRunning;
    constructor(customer_id?: string);
    config(config: any): void;
    private init;
    private initImpl;
    clearCache(): Promise<void>;
    preload(): Promise<void>;
    setAudioContext(context: AudioContext): Promise<void>;
    setPreset(preset: ModelType, sampleRate: number): Promise<void>;
    private setPresetImpl;
    useStream(stream: MediaStream): void;
    setDenoisePower(power: number): void;
    setDenoiseStages(options: DenoiseStagesOptions): void;
    getDenoiseStages(): DenoiseStagesOptions | null;
    useAudioTrack(track: MediaStreamTrack): void;
    getCustomerId(): string;
    getRequiredModels(): Array<{
        preset: ModelType;
        path: string;
        url: string;
    }>;
    getStream(): MediaStream;
    getInputAudioTrack(): MediaStreamAudioTrack | null;
    getAudioTrack(): MediaStreamAudioTrack;
    processBuffer(inputBuffer: Float32Array, sampleRate: number): Promise<Float32Array>;
    clear(): void;
    run(): void;
    stop(): void;
    suspend(): false | undefined;
    resume(): false | undefined;
    isRunning(): boolean;
    getLatencyMs(): number;
    getSpeedupDebugInfo(): any;
    onStudioAudioMetrics(callback: (metrics: {
        peak: number;
        rms: number;
        peakDb: number;
        rmsDb: number;
    }) => void): void;
    enableDebugStats(enabled: boolean): void;
    onDebugStats(callback: (stats: {
        inputClipCount: number;
        inputClipPeak: number;
        outputLimiterCount: number;
        outputLimiterPeak: number;
        underrunCount: number;
        silentFrames: number;
        speedupCount: number;
        speedupDroppedMs: number;
        pipelineGainDb: number | null;
    }) => void): void;
    enableStudioSound(): void;
    disableStudioSound(): void;
    setStudioSoundOptions(options: StudioAudioOptions): void;
    onError(f: (e: ErrorObject) => void): void;
    dbg(value: any): void;
}
