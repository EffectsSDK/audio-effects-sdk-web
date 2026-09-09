export declare class SlidingWindowBuffer {
    private winSize;
    private storage;
    constructor(windowSize: number);
    push(chunk: Float32Array): void;
    get view(): Float32Array;
    fill(v: number): void;
}
