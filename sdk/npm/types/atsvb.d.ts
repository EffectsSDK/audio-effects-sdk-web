/// <reference types="dom-mediacapture-transform" />
import { ModelType } from "./settings";
import { ErrorObject } from "./utils/errorBus";
import { StudioAudioOptions } from "./utils/enhancer";
export { StudioAudioOptions, EnhancementOptions, EQPreset } from "./utils/enhancer/types";
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
    useAudioTrack(track: MediaStreamTrack): void;
    getCustomerId(): string;
    getStream(): MediaStream;
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
    enableStudioSound(): void;
    disableStudioSound(): void;
    setStudioSoundOptions(options: StudioAudioOptions): void;
    onError(f: (e: ErrorObject) => void): void;
    private dbg;
}
