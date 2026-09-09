export interface AudioMetrics {
    peak: number;
    rms: number;
    peakDb: number;
    rmsDb: number;
}
export declare class MetricsCalculator {
    private peakLevel;
    private power;
    private alpha;
    private invAlpha;
    private rmsCache;
    private rmsDirty;
    private metricsCache;
    private readonly ln10;
    private readonly rmsDbFloor;
    private readonly powerEps;
    private readonly peakDecayBase;
    private readonly lnPeakDecayBase;
    constructor(sampleRate?: number, tau?: number);
    update(sample: number): void;
    updateBuffer(buffer: Float32Array): void;
    getMetrics(): AudioMetrics;
    getAutoGain(targetDb?: number, maxGain?: number): number;
    getPeakLevel(): number;
    getRMSLevel(): number;
    getPeakDb(): number;
    getRmsDb(): number;
    reset(): void;
}
