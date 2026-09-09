export declare class API {
    private static instance;
    private constructor();
    static getInstance(): API;
    auth(payload: any, auth_key: string): Promise<any>;
}
