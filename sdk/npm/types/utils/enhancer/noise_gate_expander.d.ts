export interface NoiseGateExpanderOptions {
    /** Maximum opening threshold in dBFS RMS; the adaptive threshold can be lower. */
    threshold: number;
    /** Maximum attenuation in dB (negative). */
    reduction: number;
}
/** Lightweight level-based gate. No VAD, lookahead, or per-sample transcendental math. */
export declare class NoiseGateExpander {
    private gain;
    private env;
    private open;
    private floorGain;
    private uncertainGain;
    private target;
    private maxOpenLin;
    private thresholdDb;
    private reductionDb;
    private thrOpenLin;
    private thrCloseLin;
    private noise;
    private learnedContrast;
    private hold;
    private frames;
    private samples;
    private energy;
    private readonly frameSamples;
    private readonly gainAtk;
    private readonly gainRel;
    private readonly history;
    private readonly histogram;
    private readonly binLevels;
    private historySize;
    private historyIndex;
    constructor(sampleRate: number, options?: Partial<NoiseGateExpanderOptions>);
    setOptions(options: Partial<NoiseGateExpanderOptions>): void;
    private updateThresholds;
    private analyze;
    process(input: number): number;
    reset(): void;
}
