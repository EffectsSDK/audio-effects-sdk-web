export interface EQPreset {
    name: string;
    bands: Array<{
        frequency: number;
        gain: number;
        q: number;
        type: 'lowpass' | 'highpass' | 'bandpass' | 'lowshelf' | 'highshelf' | 'peaking' | 'notch';
    }>;
}
export interface StudioAudioOptions {
    enabled?: boolean;
    options?: EnhancementOptions;
}
export interface EnhancementOptions {
    preset?: string;
    customEQ?: EQPreset;
    enableEqualizer?: boolean;
    enableCompressorEQ?: boolean;
    compressorThreshold?: number;
    compressorRatio?: number;
    enableNoiseGate?: boolean;
    /** Maximum adaptive opening threshold, dBFS RMS (default -65). */
    gateThreshold?: number;
    /** Maximum attenuation, negative dB (default -18); limited to -6 until level contrast is observed. */
    gateReduction?: number;
    enableDeEsser?: boolean;
    enableAutoGain?: boolean;
    autoGainTargetDb?: number;
    /** Maximum AGC boost in dB (default 30). Caps how far a quiet input is lifted. */
    agcMaxBoostDb?: number;
    /**
     * How far above the tracked noise floor a block must sit to count as speech,
     * in dB (default 12). Lower values make the AGC follow quieter speech at the
     * risk of tracking residual noise; higher values are more conservative.
     */
    agcSpeechMarginDb?: number;
    /**
     * Hard limit on how fast the applied gain may change, in dB per second
     * (default 6, as in WebRTC AGC2). This is a slew rate, not a time constant:
     * however wrong the target is, the gain cannot outrun this, so a bad estimate
     * can no longer produce an audible burst.
     */
    agcMaxGainChangeDbPerSec?: number;
    /**
     * Slew rate used until the speech level estimate is confident, in dB per
     * second (default 60), i.e. until the gain first reaches its target. The
     * level estimate is a real measurement from the first speech block onwards,
     * so this converges a quiet microphone quickly without chasing a wrong
     * target; `agcMaxGainChangeDbPerSec` governs everything after that.
     */
    agcStartupGainChangeDbPerSec?: number;
    /**
     * Ceiling on the noise level the AGC is allowed to produce at the output, in
     * dBFS (default -45). Gain that would push the tracked noise floor above this
     * is refused, so a quiet microphone in a noisy room is not boosted until the
     * room is boosted with it. Never forces attenuation. WebRTC AGC2 uses -50 in
     * the same post-suppression position; -45 is the tightest value measured not
     * to override `autoGainTargetDb` on a quiet microphone.
     */
    agcMaxOutputNoiseDb?: number;
    /**
     * Where the AGC is allowed to put predicted speech peaks, in dBFS (default
     * 1.58). Above full scale by design: the lookahead limiter absorbs the last
     * dB. Lower it (WebRTC AGC2 uses -5) to leave the limiter more headroom at
     * the cost of a few dB of loudness.
     */
    agcPeakTargetDb?: number;
    outputGain?: number;
    enableVoiceChanger?: boolean;
    voiceChangerIntensity?: number;
    voiceChangerPitch?: number;
    voiceChangerFormant?: number;
    voiceChangerChorus?: number;
}
