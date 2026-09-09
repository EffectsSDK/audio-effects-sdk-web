/**
 * Denormal number handling utilities
 *
 * Denormal (subnormal) numbers can cause severe CPU performance degradation
 * (10-100x slowdown) in audio DSP filters due to CPU switching to slow microcode path.
 *
 * This module provides optimized strategies for handling denormals.
 */
/**
 * Flush a single value to zero if it's denormal
 * Optimized with a single comparison using absolute value
 */
export declare function flushDenormal(value: number): number;
/**
 * Flush multiple values to zero if denormal (optimized for state variables)
 * Returns true if any value was flushed
 */
export declare function flushDenormalState(values: number[]): boolean;
/**
 * Add a small DC offset to prevent denormals in feedback paths
 * This is a "hack" used in some commercial audio processors
 */
export declare const DENORMAL_DC_OFFSET = 1e-25;
/**
 * Process buffer with denormal protection using DC offset injection
 * More efficient than per-sample checks for long buffers
 */
export declare function processSafeFromDenormals<T>(processor: T, processMethod: (this: T, input: Float32Array) => Float32Array, input: Float32Array, injectDC?: boolean): Float32Array;
/**
 * Periodic denormal check - only check every N samples
 * Returns a flush function that should be called periodically
 */
export declare class PeriodicDenormalFlusher {
    private counter;
    private readonly interval;
    constructor(checkInterval?: number);
    /**
     * Check if it's time to flush denormals
     */
    shouldFlush(): boolean;
    /**
     * Reset the counter (call after flushing)
     */
    reset(): void;
    /**
     * Flush state variables if it's time
     */
    flushIfNeeded(stateVars: number[]): void;
}
/**
 * Smart denormal handler that adapts based on detection
 * If denormals are detected frequently, it increases check frequency
 */
export declare class AdaptiveDenormalHandler {
    private checkInterval;
    private counter;
    private denormalCount;
    private totalChecks;
    private readonly minInterval;
    private readonly maxInterval;
    private readonly adaptThreshold;
    constructor(initialInterval?: number);
    /**
     * Check and flush state variables with adaptive frequency
     */
    checkAndFlush(stateVars: number[]): void;
    getCheckInterval(): number;
}
