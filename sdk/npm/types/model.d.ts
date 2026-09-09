import { TypedTensor } from "onnxruntime-web";
import { MLInference } from "./ml_inference";
import { ModelType, DenoiseStagesOptions } from "./settings";
export { DenoiseStagesOptions } from "./settings";
export interface EnhancerModelInterface {
    init(customer_id: string, inference: any): Promise<void>;
    run(modelData: Float32Array, preallocOutput?: Float32Array): Promise<Float32Array>;
    getType(): ModelType;
    getChunkSize(): number;
    setPower(power: number): void;
    setStages(options: DenoiseStagesOptions): void;
    getSupportedSampleRates(): number[];
    isSampleRateSupported(sampleRate: number): boolean;
    clear(): void;
    isReady(): boolean;
    dispose(): Promise<void>;
}
declare abstract class ModelBase implements EnhancerModelInterface {
    protected _isReady: boolean;
    protected _chunkSize: number;
    protected _type: ModelType;
    protected _inference: MLInference;
    protected _supporteFrameRate: number[];
    protected _power: number;
    constructor();
    init(customer_id: string, inference?: any): Promise<void>;
    abstract run(modelData: Float32Array, preallocOutput?: Float32Array): Promise<Float32Array>;
    abstract getType(): ModelType;
    getSupportedSampleRates(): number[];
    isSampleRateSupported(sampleRate: number): boolean;
    clear(): void;
    setPower(power: number): void;
    setStages(_options: DenoiseStagesOptions): void;
    getChunkSize(): number;
    isReady(): boolean;
    dispose(): Promise<void>;
}
declare class ModelSpeed extends ModelBase {
    private _filter;
    private _loader;
    constructor();
    init(customer_id: string, inference?: any): Promise<void>;
    getType(): ModelType;
    setPower(power: number): void;
    setStages(options: DenoiseStagesOptions): void;
    run(frames: Float32Array, preallocOutput?: Float32Array): Promise<any>;
    clear(): void;
    dispose(): Promise<void>;
}
declare class ModelBalanced extends ModelBase {
    private _filter;
    private _loader;
    constructor();
    init(customer_id: string, inference?: any): Promise<void>;
    getType(): ModelType;
    setPower(power: number): void;
    setStages(options: DenoiseStagesOptions): void;
    run(frames: Float32Array, preallocOutput?: Float32Array): Promise<any>;
    clear(): void;
    dispose(): Promise<void>;
}
declare type TensorMap = {
    [name: string]: TypedTensor<"float32">;
};
declare class ModelQuality extends ModelBase {
    inputBuffer: TensorMap | null;
    preallocBuffers: TensorMap | null;
    outputArray: Float32Array | null;
    constructor();
    getType(): ModelType;
    init(customer_id: string, inference?: any): Promise<void>;
    run(frames: Float32Array, preallocOutput?: Float32Array): Promise<Float32Array>;
    clear(): void;
    dispose(): Promise<void>;
    private initInputOutputBuffers;
}
declare const modelTypesMap: {
    speed: typeof ModelSpeed;
    balanced: typeof ModelBalanced;
    quality: typeof ModelQuality;
};
declare type ModelTypesMap = typeof modelTypesMap;
declare type Keys = keyof ModelTypesMap;
declare type Tuples<T> = T extends Keys ? [T, InstanceType<ModelTypesMap[T]>] : never;
declare type SingleKeys<K> = [K] extends (K extends Keys ? [K] : never) ? K : never;
declare type ClassType<A extends Keys> = Extract<Tuples<Keys>, [A, any]>[1];
export declare class ModelFactory {
    static setThreadNumber(threadNum: number): void;
    static getModel<K extends Keys>(k: SingleKeys<K>): ClassType<K>;
}
