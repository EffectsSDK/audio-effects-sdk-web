import { StreamProcessor } from "../stream_processor";
import { DenoiseStagesOptions } from "../model";
import { Config, ModelType } from "../settings";
import { StudioAudioOptions } from "../utils/enhancer";
export declare class WorkletStreamProcessor extends StreamProcessor {
    private _worklet?;
    private _context?;
    private _worker?;
    private _workerInitReplyWaiter?;
    private _messagePort?;
    private _audioGraphInited;
    private _isAudioContextSuspended;
    private _pendingMetricsCallback?;
    private _pendingDebugStatsCallback?;
    private _pendingDebugStatsEnabled;
    private _pendingStudioSoundOptions?;
    preload(): Promise<void>;
    suspend(): void;
    resume(): void;
    init(stream: MediaStream | MediaStreamTrack): Promise<void>;
    setPreset(preset: ModelType, sampleRate: number): Promise<void>;
    setAudioContext(context: AudioContext): Promise<void>;
    updateMessageChannel(): Promise<void>;
    initAudioContextGraph(): Promise<void>;
    private get requestedContextSampleRate();
    /**
     * Create the AudioContext, honoring contextSampleRate when configured.
     *
     * Browsers may refuse an explicit rate (throw) or silently settle on another
     * one, so both outcomes are reported and the pipeline keeps working: the
     * worklet resamples between the context rate and the model rate as needed.
     */
    private createAudioContext;
    updateAudioContext(): Promise<void>;
    updateWorker(): Promise<void>;
    initWorkerProcesssor(preset: ModelType, config: Config): Promise<void>;
    onWorkerMessage(event: MessageEvent): void;
    private handleAuthRequest;
    getLatencyMs(): number;
    getSpeedupDebugInfo(): {
        contextSampleRate: number;
        modelSampleRate: number;
        latencyMs: number;
        outputBufferMs: number;
        floorMs: number;
        minFloorMs: number;
        latencyMode: string;
        latencyProfile: string;
        minInWindowMs: number;
        isSpeedingUp: boolean;
        hadUnderrunInWindow: boolean;
        workerBacklogMs: number;
        consecutiveUnderrunWindows: number;
        consecutiveStableWindows: number;
    };
    setStudioSoundOptions(options: StudioAudioOptions): void;
    setStudioAudioMetricsCallback(callback: (metrics: any) => void): void;
    enableDebugStats(enabled: boolean): void;
    setDebugStatsCallback(callback: (stats: any) => void): void;
    setDenoisePower(power: number): void;
    setDenoiseStages(options: DenoiseStagesOptions): void;
    start(): void;
    stop(): void;
    pushSilence(durationMs: number): void;
    setDBGDelay(delayMs: number): void;
    dbgFreezeOutput(durationMs: number): void;
    destroy(): void;
}
