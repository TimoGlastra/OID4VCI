import * as v from 'valibot';
export declare const vJarmAuthResponseErrorParams: v.LooseObjectSchema<{
    readonly error: v.StringSchema<undefined>;
    readonly state: v.OptionalSchema<v.StringSchema<undefined>, never>;
    readonly error_description: v.SchemaWithPipe<[v.OptionalSchema<v.StringSchema<undefined>, never>, v.DescriptionAction<string | undefined, "Text providing additional information, used to assist the client developer in understanding the error that occurred.">]>;
    readonly error_uri: v.SchemaWithPipe<[v.OptionalSchema<v.SchemaWithPipe<[v.StringSchema<undefined>, v.UrlAction<string, undefined>]>, never>, v.DescriptionAction<string | undefined, "A URI identifying a human-readable web page with information about the error, used to provide the client developer with additional information about the error">]>;
}, undefined>;
export declare const vJarmAuthResponseParams: v.LooseObjectSchema<{
    readonly state: v.OptionalSchema<v.StringSchema<undefined>, never>;
    /**
     * The issuer URL of the authorization server that created the response
     */
    readonly iss: v.StringSchema<undefined>;
    /**
     * Expiration of the JWT
     */
    readonly exp: v.NumberSchema<undefined>;
    /**
     * The client_id of the client the response is intended for
     */
    readonly aud: v.StringSchema<undefined>;
}, undefined>;
export type JarmAuthResponseParams = v.InferInput<typeof vJarmAuthResponseParams>;
export declare const validateJarmAuthResponseParams: (input: {
    authRequestParams: {
        client_id: string;
        state?: string;
    };
    authResponseParams: JarmAuthResponseParams;
}) => void;
//# sourceMappingURL=v-jarm-auth-response-params.d.ts.map