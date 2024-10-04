export declare function appendQueryParams(input: {
    url: URL;
    params: Record<string, string | number | boolean>;
}): URL;
export declare function appendFragmentParams(input: {
    url: URL;
    fragments: Record<string, string | number | boolean>;
}): URL;
interface AssertValueSupported<T> {
    supported: T[];
    actual: T;
    error: Error;
    required: boolean;
}
export declare function assertValueSupported<T>(input: AssertValueSupported<T>): T | undefined;
export {};
//# sourceMappingURL=utils.d.ts.map