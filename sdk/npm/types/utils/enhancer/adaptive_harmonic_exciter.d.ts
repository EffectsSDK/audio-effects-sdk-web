export declare class AdaptiveHarmonicExciter {
    private highpassFilter;
    private rmsTracker;
    private rmsThreshold;
    private topEndFilter;
    constructor(sampleRate: number);
    process(input: number): number;
    reset(): void;
}
