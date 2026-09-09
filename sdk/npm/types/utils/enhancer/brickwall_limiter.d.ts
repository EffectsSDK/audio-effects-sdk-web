/**
 * Lookahead brickwall limiter.
 *
 * Architecture
 * ─────────────
 * • 5 ms lookahead delay buffer (circular, size = floor(0.005 * sr)).
 * • Sliding-window maximum tracked with a monotonic deque — O(1) amortised
 *   per sample, no per-sample O(N) scan.
 * • Instantaneous attack on the window peak, 10 ms exponential release.
 *
 * Correctness note
 * ────────────────
 * Gain is derived from the *worst-case peak anywhere in the lookahead window*,
 * not just the current input sample.  This prevents peaks from escaping: by
 * the time a sample exits the delay, its required gain reduction has been
 * applied for the full lookahead period rather than starting to recover
 * immediately after detection.
 *
 * Deque invariant
 * ───────────────
 * The delay buffer write pointer always overwrites the position that the read
 * pointer just vacated (they advance in lockstep, gap = size − 1).  Therefore
 * the only eviction check needed is: if the deque front equals newWrite, pop it.
 */
export declare class BrickwallLimiter {
    private readonly buf;
    private readonly dq;
    private dqHead;
    private dqTail;
    private dqCount;
    private write;
    private read;
    private envelope;
    private lastPeak;
    private readonly threshold;
    private readonly release;
    private readonly size;
    constructor(sampleRate: number);
    process(input: number): number;
    /**
     * Level the limiter last had to act on, i.e. the peak of the lookahead
     * window. The AGC reads it to notice that it is already driving the limiter
     * before its own level estimate is trustworthy.
     */
    getLastPeak(): number;
    reset(): void;
}
