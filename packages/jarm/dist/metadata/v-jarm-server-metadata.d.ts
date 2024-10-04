import * as v from 'valibot';
/**
 * Authorization servers SHOULD publish the supported algorithms for signing and encrypting the JWT of an authorization response by utilizing OAuth 2.0 Authorization Server Metadata [RFC8414] parameters.
 */
export declare const vJarmServerMetadata: v.ObjectSchema<{
    readonly authorization_signing_alg_values_supported: v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWS [RFC7515] signing algorithms (alg values) JWA [RFC7518] supported by the authorization endpoint to sign the response.">]>;
    readonly authorization_encryption_alg_values_supported: v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWE [RFC7516] encryption algorithms (alg values) JWA [RFC7518] supported by the authorization endpoint to encrypt the response.">]>;
    readonly authorization_encryption_enc_values_supported: v.SchemaWithPipe<[v.ArraySchema<v.StringSchema<undefined>, undefined>, v.DescriptionAction<string[], "JSON array containing a list of the JWE [RFC7516] encryption algorithms (enc values) JWA [RFC7518] supported by the authorization endpoint to encrypt the response.">]>;
}, undefined>;
export type JarmServerMetadata = v.InferInput<typeof vJarmServerMetadata>;
//# sourceMappingURL=v-jarm-server-metadata.d.ts.map