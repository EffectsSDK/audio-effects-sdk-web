import { BufferStreamProcessor } from "./buffer_stream_processor";
import { WorkletStreamProcessor } from "./worklet_stream_processor";
declare const streamProcessorMap: {
    worklet: typeof WorkletStreamProcessor;
    buffer: typeof BufferStreamProcessor;
};
declare type StreamProcessorMap = typeof streamProcessorMap;
declare type Keys = keyof StreamProcessorMap;
declare type Tuples<T> = T extends Keys ? [T, InstanceType<StreamProcessorMap[T]>] : never;
declare type SingleKeys<K> = [K] extends (K extends Keys ? [K] : never) ? K : never;
declare type ClassType<A extends Keys> = Extract<Tuples<Keys>, [A, any]>[1];
export declare class StreamProcessorFactory {
    static getStreamProcessor<K extends Keys>(k: SingleKeys<K>): ClassType<K>;
}
export {};
