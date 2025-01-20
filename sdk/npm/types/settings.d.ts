export declare class Settings {
    static APP_ENV: string;
    static API_URL: string;
    static BASE_URL: string;
    static SDK_URL: string;
    static PRESET: ModelType;
    static SAMPLE_RATE: number;
    static PROCESSING_CHUNK_MS: number;
    static CUSTOMER_ID: string;
}
export interface Config {
    version: string;
    appEnv: string;
    apiUrl: string;
    preset: ModelType;
    sampleRate: number;
    customerID: string;
    sdkUrl: string;
    currentSrc: string | undefined;
    wasmPaths: {
        [name in string]: string;
    };
    presets: {
        [model in ModelType]: string;
    };
    cacheModels: boolean;
    processingChunk: number;
}
export declare class DefaultConfig {
    static VERSION: string;
    static APP_ENV: string;
    static API_URL: string;
    static PRESET: ModelType;
    static SAMPLE_RATE: number;
    static CUSTOMER_ID: string;
    static SDK_URL: string;
    static PROXY: boolean;
    static CACHE_MODELS: boolean;
    static CURRENT_SRC: string | undefined;
    static PROCESSING_CHUNK_MS: number;
    static WASM_PATHS: {
        [name in string]: string;
    };
    static PRESETS: {
        [model in ModelType]: string;
    };
    static getConfig(): Config;
    static setConfig(config: Config): void;
    static getModelUrl(model: string): string;
    static getPresetUrl(preset: string): string;
    static getCurrentPath(): void;
    static setWasmPath(): void;
    static setVersion(): void;
}
export declare type ModelType = "speed" | "balanced" | "quality";
