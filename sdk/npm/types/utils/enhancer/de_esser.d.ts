export interface DeEsserOpts {
    centerHz?: number;
    q?: number;
    splitHz?: number;
    thresholdDb?: number;
    ratio?: number;
    kneeDb?: number;
    hysteresisDb?: number;
    maxReductionDb?: number;
    attackMs?: number;
    releaseMs?: number;
    lookAheadMs?: number;
}
export declare class DeEsser {
    private scBP;
    private hiHP;
    private env;
    private attack;
    private release;
    private sr;
    private centerHz;
    private q;
    private splitHz;
    private threshold;
    private ratio;
    private kneeDb;
    private hysteresisDb;
    private maxReductionDb;
    private active;
    private laSamples;
    private laMask;
    private laIdx;
    private laBufLo?;
    private laBufHi?;
    constructor(sampleRate: number, opts?: DeEsserOpts);
    /** Update parameters without reallocating filters when possible */
    update(opts: Partial<DeEsserOpts>): void;
    /** Process one sample. Apply GR only to high band (split-band de-ess). */
    process(x: number): number;
    reset(): void;
}
