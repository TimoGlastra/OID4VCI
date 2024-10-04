import * as v from 'valibot';
import type { JarmAuthResponseParams } from './v-jarm-auth-response-params.js';
import type { JarmDirectPostJwtResponseParams } from './v-jarm-direct-post-jwt-auth-response-params.js';
export declare const vAuthRequestParams: v.LooseObjectSchema<{
    readonly state: v.OptionalSchema<v.StringSchema<undefined>, never>;
    readonly response_mode: v.OptionalSchema<v.UnionSchema<[v.PicklistSchema<["jwt", "query.jwt", "fragment.jwt", "form_post.jwt"], undefined>, v.PicklistSchema<["direct_post.jwt"], undefined>], undefined>, never>;
    readonly client_id: v.StringSchema<undefined>;
    readonly response_type: v.SchemaWithPipe<[v.StringSchema<undefined>, v.TransformAction<string, string>, v.PicklistSchema<["vp_token", "id_token vp_token", "code", "token", "none", "id_token", "code token", "code id_token", "id_token token", "code id_token token"], undefined>]>;
    readonly client_metadata: v.LooseObjectSchema<{
        readonly jwks: v.OptionalSchema<v.ObjectSchema<{
            readonly keys: v.ArraySchema<v.LooseObjectSchema<{
                readonly kid: v.OptionalSchema<v.StringSchema<undefined>, never>;
                readonly kty: v.StringSchema<undefined>;
            }, undefined>, undefined>;
        }, undefined>, never>;
        readonly jwks_uri: v.OptionalSchema<v.StringSchema<undefined>, never>;
    }, undefined>;
}, undefined>;
export type AuthRequestParams = v.InferInput<typeof vAuthRequestParams>;
export declare const vOAuthAuthRequestGetParamsOut: v.ObjectSchema<{
    readonly authRequestParams: v.LooseObjectSchema<{
        readonly state: v.OptionalSchema<v.StringSchema<undefined>, never>;
        readonly response_mode: v.OptionalSchema<v.UnionSchema<[v.PicklistSchema<["jwt", "query.jwt", "fragment.jwt", "form_post.jwt"], undefined>, v.PicklistSchema<["direct_post.jwt"], undefined>], undefined>, never>;
        readonly client_id: v.StringSchema<undefined>;
        readonly response_type: v.SchemaWithPipe<[v.StringSchema<undefined>, v.TransformAction<string, string>, v.PicklistSchema<["vp_token", "id_token vp_token", "code", "token", "none", "id_token", "code token", "code id_token", "id_token token", "code id_token token"], undefined>]>;
        readonly client_metadata: v.LooseObjectSchema<{
            readonly jwks: v.OptionalSchema<v.ObjectSchema<{
                readonly keys: v.ArraySchema<v.LooseObjectSchema<{
                    readonly kid: v.OptionalSchema<v.StringSchema<undefined>, never>;
                    readonly kty: v.StringSchema<undefined>;
                }, undefined>, undefined>;
            }, undefined>, never>;
            readonly jwks_uri: v.OptionalSchema<v.StringSchema<undefined>, never>;
        }, undefined>;
    }, undefined>;
}, undefined>;
export type OAuthAuthRequestGetParamsOut = v.InferOutput<typeof vOAuthAuthRequestGetParamsOut>;
export interface JarmDirectPostJwtAuthResponseValidationContext {
    openid4vp: {
        authRequest: {
            getParams: (input: JarmAuthResponseParams | JarmDirectPostJwtResponseParams) => Promise<OAuthAuthRequestGetParamsOut>;
        };
    };
    jwe: {
        decryptCompact: (input: {
            jwe: string;
            jwk: {
                kid: string;
            };
        }) => Promise<{
            plaintext: string;
        }>;
    };
}
//# sourceMappingURL=c-jarm-auth-response.d.ts.map