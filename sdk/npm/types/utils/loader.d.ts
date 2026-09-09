export declare class Loader {
    protected _name: string;
    protected _cache?: Cache;
    get(url: string, cache?: boolean): Promise<any>;
    delete(): Promise<void>;
}
