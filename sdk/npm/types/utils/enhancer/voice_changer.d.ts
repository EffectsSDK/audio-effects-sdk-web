export interface VoiceChangerOpts {
    /**
     * Pitch shift in semitones. Range: -12 to +12.
     * Negative = lower/deeper voice, Positive = higher voice.
     * Default: 0 (no shift)
     */
    pitchSemitones?: number;
    /**
     * Formant shift amount. Range: -100 to +100.
     * Negative = darker/larger vocal tract, Positive = brighter/smaller vocal tract.
     * This uses spectral tilt EQ to approximate formant shifting.
     * Default: 0
     */
    formantShift?: number;
    /**
     * Chorus/modulation depth. Range: 0 to 100.
     * Adds subtle detuning and movement for more "character".
     * Default: 0
     */
    chorusDepth?: number;
}
/**
 * VoiceChanger - Makes voice unrecognizable while preserving intelligibility.
 *
 * Uses a practical chain:
 * 1. Pitch shifting (delay-line based, ±12 semitones)
 * 2. Spectral tilt EQ (approximates formant shifting)
 * 3. Chorus/micro-delay (adds character and further masks identity)
 *
 * Even without true formant shifting, pitch + EQ tilt + chorus
 * achieves ~80% of perceived voice disguise effect.
 */
export declare class VoiceChanger {
    private sampleRate;
    private pitchBuffer;
    private pitchBufferSize;
    private pitchBufferMask;
    private writeIndex;
    private pitchRatio;
    private grainSize;
    private halfGrain;
    private hannWindow;
    private grain1Phase;
    private grain1ReadStart;
    private grain2Phase;
    private grain2ReadStart;
    private tiltFilterLow;
    private tiltFilterHigh;
    private chorusBuffer;
    private chorusBufferSize;
    private chorusWriteIndex;
    private chorusLfoPhase;
    private chorusLfoRate;
    private chorusDepth;
    private chorusBaseDelay;
    private pitchSemitones;
    private formantShift;
    constructor(sampleRate: number, opts?: VoiceChangerOpts);
    /**
     * Update voice changer parameters.
     */
    setOptions(opts: VoiceChangerOpts): void;
    /**
     * Set pitch shift in semitones (-12 to +12).
     */
    setPitchSemitones(semitones: number): void;
    /**
     * Set formant shift (-100 to +100).
     * Uses spectral tilt to approximate formant movement.
     */
    setFormantShift(shift: number): void;
    /**
     * Set chorus depth (0 to 100).
     */
    setChorusDepth(depth: number): void;
    /**
     * Set intensity (0-100) - convenience method that sets all parameters proportionally.
     */
    setIntensity(intensity: number): void;
    /**
     * Process a single audio sample.
     */
    process(input: number): number;
    /**
     * Pitch shift using SOLA-style overlap-add with Hann windowing.
     * Two grains overlap by 50%, each with independent lifecycle.
     * When a grain completes, it resyncs to current write position - this prevents drift.
     */
    private processPitchShift;
    /**
     * Chorus effect using modulated delay.
     */
    private processChorus;
    /**
     * Reset all internal state.
     */
    reset(): void;
    /**
     * Get current pitch shift in semitones.
     */
    getPitchSemitones(): number;
    /**
     * Get current formant shift.
     */
    getFormantShift(): number;
    /**
     * Get current chorus depth.
     */
    getChorusDepth(): number;
}
