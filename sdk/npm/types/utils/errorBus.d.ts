export declare type CallbackFunction = (n: ErrorObject) => void;
declare class _ErrorBus {
    private static _instance;
    static getInstance(): _ErrorBus;
    private onErrorFunction;
    private constructor();
    subscribe(f: CallbackFunction): void;
    notify(n: ErrorObjectLight): void;
}
export declare const ErrorBus: _ErrorBus;
export interface ErrorObject {
    message: string;
    type: ErrorType;
    code?: ErrorCode;
    emitter?: ErrorEmitter;
    cause?: Error;
    data?: any;
}
declare type ErrorObjectLight = Omit<ErrorObject, "type"> & {
    type?: ErrorType;
};
export declare enum ErrorCode {
    PERFORMANCE_STOP = 1001,
    REDUCE_LATENCY = 1002
}
export declare enum ErrorType {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error"
}
export declare enum ErrorEmitter {
    ATSVB = "atsvb",
    STREAM_PROCESSOR = "stream_processor",
    ML_INFERENCE = "ml_inference",
    MODEL = "model",
    WORKLET = "worklet",
    WORKER = "worker",
    MODEL_LOADER = "model_loader"
}
export {};
