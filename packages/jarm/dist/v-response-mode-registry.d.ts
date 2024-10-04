import * as v from 'valibot';
import type { ResponseTypeOut } from './v-response-type-registry.js';
export declare const vJarmResponseMode: v.PicklistSchema<["jwt", "query.jwt", "fragment.jwt", "form_post.jwt"], undefined>;
export type JarmResponseMode = v.InferInput<typeof vJarmResponseMode>;
export declare const vOpenid4vpResponseMode: v.PicklistSchema<["direct_post"], undefined>;
export type Openid4vpResponseMode = v.InferInput<typeof vOpenid4vpResponseMode>;
/**
 *  * 'direct_post.jwt' The response is send as HTTP POST request using the application/x-www-form-urlencoded content type. The body contains a single parameter response which is the JWT encoded Response as defined in JARM 4.1
 */
export declare const vOpenid4vpJarmResponseMode: v.PicklistSchema<["direct_post.jwt"], undefined>;
export type Openid4vpJarmResponseMode = v.InferInput<typeof vOpenid4vpJarmResponseMode>;
/**
 *  The use of this parameter is NOT RECOMMENDED when the Response Mode that would be requested is the default mode specified for the Response Type.
 *  * 'query' In this mode, Authorization Response parameters are encoded in the query string added to the redirect_uri when redirecting back to the Client.
 *  * 'fragment' In this mode, Authorization Response parameters are encoded in the fragment added to the redirect_uri when redirecting back to the Client.
 *  * 'direct_post' the Authorization Response is send to an endpoint controlled by the Verifier via an HTTP POST request.
 */
export declare const vResponseMode: v.SchemaWithPipe<[v.PicklistSchema<["query", "fragment", "direct_post", "jwt", "query.jwt", "fragment.jwt", "form_post.jwt", "direct_post.jwt"], undefined>, v.DescriptionAction<"jwt" | "query.jwt" | "fragment.jwt" | "form_post.jwt" | "direct_post" | "direct_post.jwt" | "query" | "fragment", "Informs the Authorization Server of the mechanism to be used for returning parameters from the Authorization Endpoint.">]>;
export type ResponseMode = v.InferInput<typeof vResponseMode>;
export declare const getDefaultResponseMode: (input: {
    response_type: ResponseTypeOut;
}) => "query" | "fragment";
export declare const getJarmDefaultResponseMode: (input: {
    response_type: ResponseTypeOut;
}) => "query.jwt" | "fragment.jwt";
export declare const validateResponseMode: (input: {
    response_type: ResponseTypeOut;
    response_mode: ResponseMode;
}) => void;
//# sourceMappingURL=v-response-mode-registry.d.ts.map