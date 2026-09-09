import { Tensor, InferenceSession } from "onnxruntime-web";
import { ModelType } from "./settings";
declare type ModelInputData = {
    [name: string]: Tensor;
};
export declare type PreallocOptions = {
    [name: string]: Tensor;
};
export interface MLInference {
    getType(): string;
    init(customer_id: string, modelType: ModelType): Promise<void>;
    initByPath(customer_id: string, path: string): Promise<void>;
    run(inputData: ModelInputData, prealloc?: PreallocOptions): any;
    isReady(): boolean;
    setBackend(inference: any): void;
    dispose(): Promise<void>;
}
declare class ONNXMLInference implements MLInference {
    session?: InferenceSession;
    ready: boolean;
    private _loader;
    constructor();
    getType(): string;
    setBackend(inference: any): void;
    initByPath(customer_id: string, path: string): Promise<void>;
    init(customer_id: string, modelType?: ModelType): Promise<void>;
    isReady(): boolean;
    run(inputData: ModelInputData, prealloc?: PreallocOptions): Promise<InferenceSession.OnnxValueMapType>;
    dispose(): Promise<void>;
}
declare const inferenceMap: {
    onnx: typeof ONNXMLInference;
};
declare type InferenceMap = typeof inferenceMap;
declare type Keys = keyof InferenceMap;
declare type Tuples<T> = T extends Keys ? [T, InstanceType<InferenceMap[T]>] : never;
declare type SingleKeys<K> = [K] extends (K extends Keys ? [K] : never) ? K : never;
declare type ClassType<A extends Keys> = Extract<Tuples<Keys>, [A, any]>[1];
export declare class MLInferenceFactory {
    static getInference<K extends Keys>(k: SingleKeys<K>): ClassType<K>;
}
export {};
