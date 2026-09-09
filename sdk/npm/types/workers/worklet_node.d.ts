import { StudioAudioOptions } from "../utils/enhancer";
interface MessageEvent {
    data: any;
}
export interface SpeedupDebugInfo {
    latencyMs: number;
    outputBufferMs: number;
    floorMs: number;
    minFloorMs: number;
    latencyMode: string;
    latencyProfile: string;
    minInWindowMs: number | null;
    isSpeedingUp: boolean;
    hadUnderrunInWindow: boolean;
    workerBacklogMs: number;
    consecutiveUnderrunWindows: number;
    consecutiveStableWindows: number;
}
export declare class CustomWorkletNode extends AudioWorkletNode {
    private _onMetrics?;
    private _onDebugStats?;
    private _latencyMs;
    private _speedupDebug;
    getLatencyMs(): number;
    getSpeedupDebugInfo(): SpeedupDebugInfo;
    constructor(context: AudioContext, options: any);
    updateModelSampleRate(sampleRate: number): void;
    setWorkerPort(workerPort: MessagePort): void;
    setProcessingChunk(chunk: number): void;
    handleMessage_(event: MessageEvent): void;
    startProcessing(): void;
    stopProcessing(): void;
    setStudioSoundOptions(options: StudioAudioOptions): void;
    pushSilence(durationMs: number): void;
    dbgFreezeOutput(durationMs: number): void;
    setMetricsCallback(callback: (metrics: any) => void): void;
    enableDebugStats(enabled: boolean): void;
    setDebugStatsCallback(callback: (stats: any) => void): void;
}
export {};
