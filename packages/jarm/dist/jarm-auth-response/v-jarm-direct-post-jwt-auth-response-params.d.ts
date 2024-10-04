import * as v from 'valibot';
export declare const vJarmDirectPostJwtParams: v.LooseObjectSchema<{
    readonly vp_token: v.StringSchema<undefined>;
    readonly presentation_submission: v.UnknownSchema;
    readonly nonce: v.OptionalSchema<v.StringSchema<undefined>, never>;
    readonly iss: v.OptionalSchema<v.StringSchema<undefined>, never>;
    readonly exp: v.OptionalSchema<v.NumberSchema<undefined>, never>;
    readonly aud: v.OptionalSchema<v.StringSchema<undefined>, never>;
    readonly state: v.OptionalSchema<v.StringSchema<undefined>, never>;
}, undefined>;
export type JarmDirectPostJwtResponseParams = v.InferInput<typeof vJarmDirectPostJwtParams>;
export declare const jarmAuthResponseDirectPostValidateParams: (input: {
    authRequestParams: {
        state?: string;
    };
    authResponseParams: JarmDirectPostJwtResponseParams;
}) => void;
//# sourceMappingURL=v-jarm-direct-post-jwt-auth-response-params.d.ts.map