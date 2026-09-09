export declare class SaturationProtector {
    private readonly sampleRate;
    private readonly initialHeadroomDb;
    private readonly adjacentSpeechMs;
    private adjacentSpeechBlocksNeeded;
    private headroomDb;
    private preliminary;
    private reliable;
    private adjacentSpeechBlocks;
    private delayedPeakDb;
    private coeffLen;
    private attack;
    private decay;
    private blockMs;
    constructor(sampleRate: number, adjacentSpeechMs?: number, initialHeadroomDb?: number);
    private makeState;
    private updateBlockCoefficients;
    /**
     * @param speechActive   whether the block was classified as speech
     * @param peak           peak level of the block (linear)
     * @param speechLevelDbfs current speech level estimate
     * @param len            block length in samples
     */
    analyze(speechActive: boolean, peak: number, speechLevelDbfs: number, len: number): void;
    private updateState;
    private copyState;
    getHeadroomDb(): number;
    /**
     * The peak level the headroom is measured against: the oldest super-frame
     * maximum still in the ring, i.e. what this speaker actually peaked at ~1.6 s
     * ago. Callers that need a peak prediction should use this rather than
     * rebuilding it as speech level + headroom — the headroom is smoothed and the
     * speech level is not, so the sum ripples at the syllable rate even though
     * neither term is meant to.
     */
    getDelayedPeakDb(): number;
    reset(): void;
}
