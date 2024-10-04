import * as v from 'valibot';
export declare const vJarmAuthResponseValidateMetadataInput: v.ObjectSchema<{
    readonly client_metadata: v.UnionSchema<[v.ObjectSchema<{
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
    readonly server_metadata: Omit<v.ObjectSchema<{
        readonly authorization_signing_alg_values_supported: v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWS [RFC7515] signing algorithms (alg values) JWA [RFC7518] supported by the authorization endpoint to sign the response.">]>;
        readonly authorization_encryption_alg_values_supported: v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWE [RFC7516] encryption algorithms (alg values) JWA [RFC7518] supported by the authorization endpoint to encrypt the response.">]>;
        readonly authorization_encryption_enc_values_supported: v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWE [RFC7516] encryption algorithms (enc values) JWA [RFC7518] supported by the authorization endpoint to encrypt the response.">]>;
    }, undefined>, "_types" | "_run" | "entries"> & {
        readonly entries: {
            readonly authorization_signing_alg_values_supported: v.OptionalSchema<v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWS [RFC7515] signing algorithms (alg values) JWA [RFC7518] supported by the authorization endpoint to sign the response.">]>, never>;
            readonly authorization_encryption_alg_values_supported: v.OptionalSchema<v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWE [RFC7516] encryption algorithms (alg values) JWA [RFC7518] supported by the authorization endpoint to encrypt the response.">]>, never>;
            readonly authorization_encryption_enc_values_supported: v.OptionalSchema<v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWE [RFC7516] encryption algorithms (enc values) JWA [RFC7518] supported by the authorization endpoint to encrypt the response.">]>, never>;
        };
        readonly _run: (dataset: v.Dataset<unknown, never>, config: v.Config<v.BaseIssue<unknown>>) => v.Dataset<v.InferObjectOutput<{
            readonly authorization_signing_alg_values_supported: v.OptionalSchema<v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWS [RFC7515] signing algorithms (alg values) JWA [RFC7518] supported by the authorization endpoint to sign the response.">]>, never>;
            readonly authorization_encryption_alg_values_supported: v.OptionalSchema<v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWE [RFC7516] encryption algorithms (alg values) JWA [RFC7518] supported by the authorization endpoint to encrypt the response.">]>, never>;
            readonly authorization_encryption_enc_values_supported: v.OptionalSchema<v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWE [RFC7516] encryption algorithms (enc values) JWA [RFC7518] supported by the authorization endpoint to encrypt the response.">]>, never>;
        }>, v.InferIssue<v.ObjectSchema<{
            readonly authorization_signing_alg_values_supported: v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWS [RFC7515] signing algorithms (alg values) JWA [RFC7518] supported by the authorization endpoint to sign the response.">]>;
            readonly authorization_encryption_alg_values_supported: v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWE [RFC7516] encryption algorithms (alg values) JWA [RFC7518] supported by the authorization endpoint to encrypt the response.">]>;
            readonly authorization_encryption_enc_values_supported: v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWE [RFC7516] encryption algorithms (enc values) JWA [RFC7518] supported by the authorization endpoint to encrypt the response.">]>;
        }, undefined>>>;
        readonly _types?: {
            readonly input: {
                authorization_signing_alg_values_supported?: string[] | undefined;
                authorization_encryption_alg_values_supported?: string[] | undefined;
                authorization_encryption_enc_values_supported?: string[] | undefined;
            };
            readonly output: {
                authorization_signing_alg_values_supported?: string[] | undefined;
                authorization_encryption_alg_values_supported?: string[] | undefined;
                authorization_encryption_enc_values_supported?: string[] | undefined;
            };
            readonly issue: v.StringIssue | v.ObjectIssue | v.ArrayIssue;
        } | undefined;
    };
}, undefined>;
export type JarmMetadataValidate = v.InferInput<typeof vJarmAuthResponseValidateMetadataInput>;
export declare const vJarmMetadataValidateOut: v.VariantSchema<"type", [v.ObjectSchema<{
    readonly type: v.LiteralSchema<"signed", undefined>;
    readonly client_metadata: v.ObjectSchema<{
        readonly authorization_signed_response_alg: v.SchemaWithPipe<[v.OptionalSchema<v.StringSchema<undefined>, never>, v.DescriptionAction<string | undefined, "JWA. If this is specified, the response will be signed using JWS and the configured algorithm. The algorithm none is not allowed.">]>;
        readonly authorization_encrypted_response_alg: v.OptionalSchema<v.NeverSchema<undefined>, never>;
        readonly authorization_encrypted_response_enc: v.OptionalSchema<v.NeverSchema<undefined>, never>;
    }, undefined>;
}, undefined>, v.ObjectSchema<{
    readonly type: v.LiteralSchema<"encrypted", undefined>;
    readonly client_metadata: v.ObjectSchema<{
        readonly authorization_signed_response_alg: v.OptionalSchema<v.NeverSchema<undefined>, never>;
        readonly authorization_encrypted_response_alg: v.SchemaWithPipe<[v.StringSchema<undefined>, v.DescriptionAction<string, "JWE alg algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.">]>;
        readonly authorization_encrypted_response_enc: v.SchemaWithPipe<[v.OptionalSchema<v.StringSchema<undefined>, "A128CBC-HS256">, v.DescriptionAction<string, "JWE enc algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.">]>;
    }, undefined>;
}, undefined>, v.ObjectSchema<{
    readonly type: v.LiteralSchema<"signed encrypted", undefined>;
    readonly client_metadata: v.ObjectSchema<{
        readonly authorization_encrypted_response_alg: v.SchemaWithPipe<[v.StringSchema<undefined>, v.DescriptionAction<string, "JWE alg algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.">]>;
        readonly authorization_encrypted_response_enc: v.SchemaWithPipe<[v.OptionalSchema<v.StringSchema<undefined>, "A128CBC-HS256">, v.DescriptionAction<string, "JWE enc algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.">]>;
        readonly authorization_signed_response_alg: v.SchemaWithPipe<[v.OptionalSchema<v.StringSchema<undefined>, never>, v.DescriptionAction<string | undefined, "JWA. If this is specified, the response will be signed using JWS and the configured algorithm. The algorithm none is not allowed.">]>;
    }, undefined>;
}, undefined>], undefined>;
export declare const jarmMetadataValidate: (vJarmMetadataValidate: JarmMetadataValidate) => v.InferOutput<typeof vJarmMetadataValidateOut>;
//# sourceMappingURL=jarm-validate-metadata.d.ts.map