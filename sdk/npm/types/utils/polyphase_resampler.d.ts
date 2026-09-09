import { BufferPool } from './buffers/bufferPool';
export interface PolyphaseResamplerOptions {
    /** Stopband attenuation of the anti-aliasing filter, dB. Drives filter length. */
    stopbandAttenuationDb?: number;
    /**
     * Transition band width as a fraction of the preserved Nyquist frequency.
     * 0.1 means the passband ends at 0.9*Nyquist and the stopband starts at Nyquist.
     * Wider transition -> shorter filter -> less CPU, at the cost of the top octave.
     */
    transitionWidth?: number;
    /** Upper bound on the interpolation factor L (caps filter memory). */
    maxInterpolationFactor?: number;
}
/**
 * Rational-factor polyphase FIR resampler.
 *
 * Replaces linear interpolation, which has no anti-aliasing at all: decimating
 * 48k->16k with it folds everything above 8kHz (sibilance, breath, denoiser
 * residue) back into the speech band, and interpolating back adds ~4dB of
 * droop near Nyquist plus unsuppressed images. The result is the familiar
 * "muffled yet harsh" character, and no later stage can undo it.
 *
 * Structure: conceptually upsample by L (zero stuffing), lowpass with a
 * Kaiser-windowed sinc, decimate by M. The polyphase form never materializes
 * the intermediate rate — each output sample touches only the K taps of one
 * phase branch, so the cost is K multiply-accumulates per output sample
 * regardless of how large L is.
 *
 * Cost for the rates this SDK uses is a few milliseconds of CPU per second of
 * audio, i.e. a small fraction of what the denoise model itself spends.
 */
export declare class PolyphaseResampler {
    private readonly inputSampleRate;
    private readonly outputSampleRate;
    /** Interpolation factor. */
    private readonly L;
    /** Decimation factor. */
    private readonly M;
    /** Taps per phase branch. */
    private readonly K;
    /**
     * Phase branches, time-reversed and stored contiguously: branch p occupies
     * [p*K, (p+1)*K) and holds h[p + (K-1-k)*L] at offset k. The reversal lets
     * both the coefficient walk and the sample walk run forward.
     */
    private readonly branches;
    /** Group delay of the prototype filter, in intermediate-rate samples. */
    private readonly groupDelay;
    private readonly pool;
    /** Previous K-1 input samples; the tail the next block needs to filter. */
    private history;
    /** Scratch holding history ++ current input. */
    private work;
    /** Index of the next output's newest input sample, relative to the next block. */
    private nextIndex;
    /** Phase of the next output, 0..L-1. */
    private phase;
    private destroyed;
    constructor(inputSampleRate: number, outputSampleRate: number, options?: PolyphaseResamplerOptions);
    /** Ratio of output to input rate actually realized (may differ if L was capped). */
    get ratio(): number;
    /** Filter delay expressed in output samples. */
    get latencyOutputSamples(): number;
    /** Filter length; exposed for diagnostics. */
    get filterTaps(): number;
    /**
     * Push a block in, get the resampled block out.
     *
     * The returned buffer is exactly sized and, when a pool is supplied, taken
     * from it — callers may transfer or recycle it. Output length varies between
     * calls because the phase advances fractionally.
     */
    feed(input: Float32Array, outputPool?: BufferPool): Float32Array;
    /**
     * One-shot resampling of a complete buffer, independent of streaming state.
     *
     * The filter's group delay is compensated so the result stays time-aligned
     * with the input, and the length matches the exact rate ratio.
     */
    feedBuffer(input: Float32Array): Float32Array;
    resetState(): void;
    destroy(): void;
    private ensureAlive;
    /**
     * Exact rational form of outputRate/inputRate, falling back to the best
     * rational approximation whose numerator fits maxL. Only exotic rate pairs
     * need the fallback; its error is parts-per-million, far below what the
     * jitter buffer already absorbs.
     */
    private static rationalRatio;
    private static gcd;
    /** Continued-fraction convergent of `value` with numerator <= maxNumerator. */
    private static approximate;
    /**
     * Kaiser-windowed sinc lowpass.
     * `cutoffNormalized` is in cycles per intermediate-rate sample; `gain`
     * compensates the 1/L amplitude loss caused by zero stuffing.
     */
    private static designLowpass;
    private static kaiserBeta;
    /** Modified Bessel function of the first kind, order 0. */
    private static besselI0;
}
