import * as v from 'valibot';
export declare const vJarmClientMetadataSign: v.ObjectSchema<{
    readonly authorization_signed_response_alg: v.SchemaWithPipe<[v.OptionalSchema<v.StringSchema<undefined>, never>, v.DescriptionAction<string | undefined, "JWA. If this is specified, the response will be signed using JWS and the configured algorithm. The algorithm none is not allowed.">]>;
    readonly authorization_encrypted_response_alg: v.OptionalSchema<v.NeverSchema<undefined>, never>;
    readonly authorization_encrypted_response_enc: v.OptionalSchema<v.NeverSchema<undefined>, never>;
}, undefined>;
export declare const vJarmClientMetadataEncrypt: v.ObjectSchema<{
    readonly authorization_signed_response_alg: v.OptionalSchema<v.NeverSchema<undefined>, never>;
    readonly authorization_encrypted_response_alg: v.SchemaWithPipe<[v.StringSchema<undefined>, v.DescriptionAction<string, "JWE alg algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.">]>;
    readonly authorization_encrypted_response_enc: v.SchemaWithPipe<[v.OptionalSchema<v.StringSchema<undefined>, "A128CBC-HS256">, v.DescriptionAction<string, "JWE enc algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.">]>;
}, undefined>;
export declare const vJarmClientMetadataSignEncrypt: v.ObjectSchema<{
    readonly authorization_encrypted_response_alg: v.SchemaWithPipe<[v.StringSchema<undefined>, v.DescriptionAction<string, "JWE alg algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.">]>;
    readonly authorization_encrypted_response_enc: v.SchemaWithPipe<[v.OptionalSchema<v.StringSchema<undefined>, "A128CBC-HS256">, v.DescriptionAction<string, "JWE enc algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.">]>;
    readonly authorization_signed_response_alg: v.SchemaWithPipe<[v.OptionalSchema<v.StringSchema<undefined>, never>, v.DescriptionAction<string | undefined, "JWA. If this is specified, the response will be signed using JWS and the configured algorithm. The algorithm none is not allowed.">]>;
}, undefined>;
/**
 * Clients may register their public encryption keys using the jwks_uri or jwks metadata parameters.
 */
export declare const vJarmClientMetadata: v.UnionSchema<[v.ObjectSchema<{
    readonly authorization_signed_response_alg: v.SchemaWithPipe<[v.OptionalSchema<v.StringSchema<undefined>, never>, v.DescriptionAction<string | undefined, "JWA. If this is specified, the response will be signed using JWS and the configured algorithm. The algorithm none is not allowed.">]>;
    readonly authorization_encrypted_response_alg: v.OptionalSchema<v.NeverSchema<undefined>, never>;
    readonly authorization_encrypted_response_enc: v.OptionalSchema<v.NeverSchema<undefined>, never>;
}, undefined>, v.ObjectSchema<{
    readonly authorization_signed_response_alg: v.OptionalSchema<v.NeverSchema<undefined>, never>;
    readonly authorization_encrypted_response_alg: v.SchemaWithPipe<[v.StringSchema<undefined>, v.DescriptionAction<string, "JWE alg algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.">]>;
    readonly authorization_encrypted_response_enc: v.SchemaWithPipe<[v.OptionalSchema<v.StringSchema<undefined>, "A128CBC-HS256">, v.DescriptionAction<string, "JWE enc algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.">]>;
}, undefined>, v.ObjectSchema<{
    readonly authorization_encrypted_response_alg: v.SchemaWithPipe<[v.StringSchema<undefined>, v.DescriptionAction<string, "JWE alg algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.">]>;
    readonly authorization_encrypted_response_enc: v.SchemaWithPipe<[v.OptionalSchema<v.StringSchema<undefined>, "A128CBC-HS256">, v.DescriptionAction<string, "JWE enc algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.">]>;
    readonly authorization_signed_response_alg: v.SchemaWithPipe<[v.OptionalSchema<v.StringSchema<undefined>, never>, v.DescriptionAction<string | undefined, "JWA. If this is specified, the response will be signed using JWS and the configured algorithm. The algorithm none is not allowed.">]>;
}, undefined>], undefined>;
export type JarmClientMetadata = v.InferInput<typeof vJarmClientMetadata>;
//# sourceMappingURL=v-jarm-client-metadata.d.ts.map