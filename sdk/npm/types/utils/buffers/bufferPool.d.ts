export declare class BufferPool {
    private u8Buffers;
    private f32Buffers;
    private name;
    private readonly MAX_PER_LENGTH;
    constructor(name?: string);
    getBuffer(type: "f32", length: number): Float32Array;
    getBuffer(type: "u8", length: number): Uint8Array;
    returnBuffer(buf: Uint8Array | Float32Array): void;
    private returnAs;
    clear(): void;
    trim(maxPerLen?: number): void;
}
