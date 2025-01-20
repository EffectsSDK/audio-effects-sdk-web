/// <reference types="dom-mediacapture-transform" />
import { ModelType } from "./settings";
import { ErrorObject } from "./utils/errorBus";
export declare class atsvb {
    onReady?: () => void;
    private _currentInitialization?;
    private _loader;
    private streamProcessor;
    private _isRunning;
    constructor(customer_id?: string);
    config(config: any): void;
    private init;
    private initImpl;
    clearCache(): Promise<void>;
    preload(): Promise<void>;
    setAudioContext(context: AudioContext): Promise<void>;
    setPreset(preset: ModelType, sampleRate: number): Promise<void>;
    private setPresetImpl;
    useStream(stream: MediaStream): void;
    setDenoisePower(power: number): void;
    useAudioTrack(track: MediaStreamTrack): void;
    getCustomerId(): string;
    getStream(): MediaStream;
    getAudioTrack(): MediaStreamAudioTrack;
    clear(): void;
    run(): void;
    stop(): void;
    suspend(): false | undefined;
    resume(): false | undefined;
    onError(f: (e: ErrorObject) => void): void;
    private dbg;
}
