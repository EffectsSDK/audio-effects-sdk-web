export interface SimpleCompressorOptions {
    threshold?: number;
    ratio?: number;
    attackMs?: number;
    releaseMs?: number;
    softKnee?: number;
    autoMakeup?: boolean;
    makeupGainDb?: number;
}
export declare class SimpleCompressor {
    private envelope;
    private threshold;
    private ratio;
    private attack;
    private release;
    private softKnee;
    private makeupGain;
    private dbToLinearLUT;
    private readonly LUT_SIZE;
    private readonly DB_MIN;
    private readonly DB_MAX;
    private readonly dbRange;
    private readonly invDbRange;
    private static readonly EPS;
    private static readonly INV_LN10;
    constructor(sampleRate: number, options?: Partial<SimpleCompressorOptions>);
    private buildLUT;
    private dbToLinear;
    private dbToLinearRaw;
    private static fastAbs;
    process(input: number): number;
    reset(): void;
}
