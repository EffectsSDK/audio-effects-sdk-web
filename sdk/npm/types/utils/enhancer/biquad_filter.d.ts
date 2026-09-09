export declare class BiquadFilter {
    private b0;
    private b1;
    private b2;
    private a1;
    private a2;
    private x1;
    private x2;
    private y1;
    private y2;
    private denormalFlusher;
    configure(type: 'lowpass' | 'highpass' | 'bandpass' | 'lowshelf' | 'highshelf' | 'peaking' | 'notch', frequency: number, sampleRate: number, q?: number, gain?: number): void;
    process(input: number): number;
    /**
     * Process an entire buffer at once (optimized for performance)
     * This is significantly faster than processing sample-by-sample due to:
     * - Better CPU cache utilization
     * - Loop unrolling opportunities
     * - Reduced function call overhead
     * - Single denormal check at the end
     */
    processBuffer(input: Float32Array, output: Float32Array): void;
    reset(): void;
}
