import type { JarmResponseMode, Openid4vpJarmResponseMode } from '../v-response-mode-registry.js';
import type { ResponseTypeOut } from '../v-response-type-registry.js';
interface JarmAuthResponseSendInput {
    authRequestParams: {
        response_mode?: JarmResponseMode | Openid4vpJarmResponseMode;
        response_type: ResponseTypeOut;
    } & ({
        response_uri: string;
    } | {
        redirect_uri: string;
    });
    authResponse: string;
}
export declare const jarmAuthResponseSend: (input: JarmAuthResponseSendInput) => Promise<Response>;
export {};
//# sourceMappingURL=jarm-auth-response-send.d.ts.map