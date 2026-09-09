/// <reference types="dom-mediacapture-transform" />
import { DenoiseStagesOptions, EnhancerModelInterface } from "./model";
import { ModelType } from "./settings";
import { StudioAudioOptions } from "./utils/enhancer";
export declare class StreamProcessor {
    protected _originalStream?: MediaStream;
    protected _outputStream?: MediaStream;
    protected _sourceStream?: MediaStreamAudioSourceNode;
    protected _destinationStream: MediaStreamAudioDestinationNode;
    protected _modelMeta: EnhancerModelInterface;
    protected _modelSampleRate: number;
    constructor();
    init(stream: MediaStream | MediaStreamTrack): Promise<void>;
    setPreset(preset: ModelType, sampleRate: number): Promise<void>;
    setAudioContext(_context: AudioContext): void;
    setDenoisePower(_power: number): void;
    setDenoiseStages(_options: DenoiseStagesOptions): void;
    getInputAudioTrack(): MediaStreamAudioTrack;
    preload(): Promise<void>;
    getStream(): MediaStream;
    getAudioTrack(): MediaStreamTrack | null;
    getLatencyMs(): number;
    getSpeedupDebugInfo(): any;
    setStudioSoundOptions(options: StudioAudioOptions): void;
    setStudioAudioMetricsCallback(callback: (metrics: any) => void): void;
    enableDebugStats(_enabled: boolean): void;
    setDebugStatsCallback(_callback: (stats: any) => void): void;
    destroy(): void;
    start(): void;
    stop(): void;
    suspend(): void;
    resume(): void;
    pushSilence(_durationMs: number): void;
    setDBGDelay(_delayMs: number): void;
    dbgFreezeOutput(_durationMs: number): void;
}
