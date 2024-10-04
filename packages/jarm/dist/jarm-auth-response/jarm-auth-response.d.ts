import type { JarmDirectPostJwtAuthResponseValidationContext } from './c-jarm-auth-response.js';
export interface JarmDirectPostJwtAuthResponseValidation {
    /**
     * The JARM response parameter conveyed either as url query param, fragment param, or application/x-www-form-urlencoded in the body of a post request
     */
    response: string;
}
/**
 * Validate a JARM direct_post.jwt compliant authentication response
 * * The decryption key should be resolvable using the the protected header's 'kid' field
 * * The signature verification jwk should be resolvable using the jws protected header's 'kid' field and the payload's 'iss' field.
 */
export declare const jarmAuthResponseDirectPostJwtValidate: (input: JarmDirectPostJwtAuthResponseValidation, ctx: JarmDirectPostJwtAuthResponseValidationContext) => Promise<{
    authRequestParams: {
        response_type: string;
        client_metadata: {
            jwks?: {
                keys: ({
                    kty: string;
                    kid?: string | undefined;
                } & {
                    [key: string]: unknown;
                })[];
            } | undefined;
            jwks_uri?: string | undefined;
        } & {
            [key: string]: unknown;
        };
        client_id: string;
        state?: string | undefined;
        response_mode?: "jwt" | "query.jwt" | "fragment.jwt" | "form_post.jwt" | "direct_post.jwt" | undefined;
    } & {
        [key: string]: unknown;
    };
    authResponseParams: {
        vp_token: string;
        presentation_submission: unknown;
        state?: string | undefined;
        iss?: string | undefined;
        exp?: number | undefined;
        aud?: string | undefined;
        nonce?: string | undefined;
    } & {
        [key: string]: unknown;
    };
    type: "signed encrypted" | "encrypted" | "signed";
}>;
//# sourceMappingURL=jarm-auth-response.d.ts.map