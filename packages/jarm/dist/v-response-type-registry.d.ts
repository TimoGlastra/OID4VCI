import * as v from 'valibot';
export declare const oAuthResponseTypes: v.PicklistSchema<["code", "token"], undefined>;
export declare const oAuthMRTEPResponseTypes: v.PicklistSchema<["none", "id_token", "code token", "code id_token", "id_token token", "code id_token token"], undefined>;
export declare const openid4vpResponseTypes: v.PicklistSchema<["vp_token", "id_token vp_token"], undefined>;
export declare const vTransformedResponseTypes: v.PicklistSchema<["vp_token", "id_token vp_token", "code", "token", "none", "id_token", "code token", "code id_token", "id_token token", "code id_token token"], undefined>;
export declare const vResponseType: v.SchemaWithPipe<[v.StringSchema<undefined>, v.TransformAction<string, string>, v.PicklistSchema<["vp_token", "id_token vp_token", "code", "token", "none", "id_token", "code token", "code id_token", "id_token token", "code id_token token"], undefined>]>;
export type ResponseType = v.InferInput<typeof vTransformedResponseTypes>;
export type ResponseTypeOut = v.InferOutput<typeof vTransformedResponseTypes>;
//# sourceMappingURL=v-response-type-registry.d.ts.map