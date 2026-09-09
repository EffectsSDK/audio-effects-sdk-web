import { MetricsCalculator } from './metrics_calculator';
import { EQPreset, EnhancementOptions } from './types';
export declare class AudioEnhancer {
    private sampleRate;
    private eqFilters;
    private noiseGate;
    private deEsser;
    private harmonicExciter;
    private compressor;
    private voiceChanger;
    private presenceFilter;
    private brickwallLimiter;
    private gainMonitor;
    private options;
    private cachedAutoGainDb;
    private currentAutoGain;
    private currentAutoGainDb;
    private agcBlockActive;
    private agcActiveSamples;
    private agcAdjacentSpeechBlocks;
    private agcConsecutiveSpeechBlocks;
    private agcConsecutiveInactiveBlocks;
    private agcSpeechDuty;
    private agcInactiveBlocks;
    private agcConverged;
    private readonly AGC_ACTIVE_BLOCK_PEAK;
    private readonly AGC_PEAK_TARGET_DB;
    private readonly AGC_LEVEL_TAU_SECS;
    private readonly AGC_CONFIDENCE_SECS;
    private readonly AGC_STARTUP_SECS;
    private readonly AGC_CONVERGED_DB;
    private readonly AGC_CONSECUTIVE_SPEECH_MS;
    private readonly AGC_CONSECUTIVE_GAP_MS;
    private readonly AGC_ADJACENT_SPEECH_MS;
    private readonly AGC_SPEECH_HANGOVER_MS;
    private readonly AGC_LIMITER_THRESHOLD_DB;
    private readonly AGC_TARGET_TAU_SECS;
    private readonly AGC_MIN_GAIN_DB;
    private readonly AGC_MAX_OUTPUT_NOISE_DB;
    private agcSpeechLevelDb;
    private agcTargetSeeded;
    private agcLevelNum;
    private agcLevelDen;
    private saturationProtector;
    private agcLevel;
    private agcFastLevel;
    private readonly AGC_FAST_LEVEL_TAU;
    private agcWindowMin;
    private agcPrevWindowMin;
    private agcWindowSamples;
    private readonly AGC_NOISE_WINDOW_SECS;
    private readonly AGC_LEVEL_TAU;
    private agcSpeechRef;
    private readonly AGC_SPEECH_REF_DECAY_DB_PER_SEC;
    private readonly AGC_SPEECH_RANGE_DB;
    private agcSpeechLevel;
    private readonly AGC_SPEECH_DECAY_DB_PER_SEC;
    private readonly AGC_VOICED_RANGE_DB;
    private agcNoiseFloorDb;
    private agcNoiseMinRms;
    private agcNoisePeriodSamples;
    private agcNoiseFloorPeriodSamples;
    private readonly AGC_NOISE_FLOOR_PERIOD_SECS;
    private readonly AGC_NOISE_MIN_RMS;
    private agcCoeffLen;
    private agcLevelLeak;
    private agcTargetAlpha;
    private agcSmoothAlpha;
    private agcFastAlpha;
    private agcDutyAlpha;
    private agcSpeechRefDecay;
    private agcSpeechLevelDecay;
    private agcMaxRateDbPerSec;
    private agcStartupRateDbPerSec;
    private agcBlockDt;
    private agcGainBudgetSec;
    private readonly AGC_MAX_GAIN_BUDGET_SECS;
    private readonly AGC_MAX_STEP_PER_BLOCK_DB;
    private agcAdjacentSpeechBlocksNeeded;
    private agcConsecutiveSpeechBlocksNeeded;
    private agcConsecutiveGapBlocksNeeded;
    private agcHangoverBlocks;
    private agcNoiseWindowSamples;
    private agcConfidenceSamples;
    private agcStartupSamples;
    private agcMarginLin;
    private agcVoicedRangeLin;
    private agcSpeechRangeLin;
    private agcMaxBoostDb;
    private artifactRecoverySamples;
    private artifactRecoveryTotal;
    private scratchA;
    private scratchB;
    private scratchOut;
    private static readonly PRESETS;
    constructor(sampleRate?: number, options?: EnhancementOptions);
    setMetricsCalculator(metricsCalculator: MetricsCalculator): void;
    private setupEQ;
    process(input: Float32Array): Float32Array;
    private toDb;
    /**
     * Slow noise floor for the gain cap: the quietest block seen in each 5 s
     * period, with a slow attack and an instant decay. A floor that rises may
     * just be someone talking quickly; a floor that drops is real, and the gain
     * should be free to recover at once.
     */
    private updateAgcNoiseFloor;
    /** Coefficients that depend on the block size only. */
    private updateAgcBlockCoefficients;
    /** Coefficients that depend on the options only. */
    private updateAgcOptionCoefficients;
    /**
     * The gain this block would like to apply, before rate limiting.
     *
     * Four independent limits, all in dB, lowest wins. Each closes a different
     * way the plain "lift RMS to the target" answer goes wrong.
     */
    private computeTargetGainDb;
    /**
     * Move the applied gain towards the target by at most one step.
     *
     * Increases additionally wait for speech to be sustained, so a door slam or a
     * single loud syllable cannot start the gain climbing. When the wait ends the
     * step is scaled by however long it lasted, so nothing is lost by waiting.
     */
    private rateLimitGainDb;
    /**
     * Classify a block as speech or noise, maintaining the noise-floor estimate
     * it is judged against.
     *
     * A fixed absolute threshold cannot do this job. The denoiser leaves residue
     * well above any "this must be silence" level, so every pause read as very
     * quiet speech and the AGC wound up to its ceiling trying to lift it to the
     * target — measured: -60dBFS room noise came out at -32dBFS after 15s of
     * silence. Judging the block against the tracked floor keeps quiet-microphone
     * speech detectable (it still stands well above its own noise floor) while
     * pauses stay pauses.
     */
    private updateSpeechActivity;
    suppressTransient(sampleCount: number): void;
    private getArtifactRecoveryGain;
    /**
     * Fast path: only apply limiter when no other processing is enabled
     */
    private processLimiterOnly;
    private ensureScratch;
    setPreset(presetName: string): void;
    setCustomEQ(preset: EQPreset): void;
    setOptions(options: Partial<EnhancementOptions>): void;
    getAvailablePresets(): string[];
    getMeters(): import("./metrics_calculator").AudioMetrics;
    reset(): void;
}
