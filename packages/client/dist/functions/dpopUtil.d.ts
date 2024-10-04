import { OpenIDResponse } from 'oid4vci-common';
export type RetryRequestWithDPoPNonce = {
    ok: true;
    dpopNonce: string;
} | {
    ok: false;
};
export declare function shouldRetryTokenRequestWithDPoPNonce(response: OpenIDResponse<unknown, unknown>): RetryRequestWithDPoPNonce;
export declare function shouldRetryResourceRequestWithDPoPNonce(response: OpenIDResponse<unknown, unknown>): RetryRequestWithDPoPNonce;
//# sourceMappingURL=dpopUtil.d.ts.map