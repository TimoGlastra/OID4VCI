"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRetryTokenRequestWithDPoPNonce = shouldRetryTokenRequestWithDPoPNonce;
exports.shouldRetryResourceRequestWithDPoPNonce = shouldRetryResourceRequestWithDPoPNonce;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
function shouldRetryTokenRequestWithDPoPNonce(response) {
    if (!response.errorBody || response.errorBody.error !== oid4vc_common_1.dpopTokenRequestNonceError) {
        return { ok: false };
    }
    const dPoPNonce = response.origResponse.headers.get('DPoP-Nonce');
    if (!dPoPNonce) {
        throw new Error('Missing required DPoP-Nonce header.');
    }
    return { ok: true, dpopNonce: dPoPNonce };
}
function shouldRetryResourceRequestWithDPoPNonce(response) {
    if (!response.errorBody || response.origResponse.status !== 401) {
        return { ok: false };
    }
    const wwwAuthenticateHeader = response.origResponse.headers.get('WWW-Authenticate');
    if (!(wwwAuthenticateHeader === null || wwwAuthenticateHeader === void 0 ? void 0 : wwwAuthenticateHeader.includes(oid4vc_common_1.dpopTokenRequestNonceError))) {
        return { ok: false };
    }
    const dPoPNonce = response.origResponse.headers.get('DPoP-Nonce');
    if (!dPoPNonce) {
        throw new Error('Missing required DPoP-Nonce header.');
    }
    return { ok: true, dpopNonce: dPoPNonce };
}
//# sourceMappingURL=dpopUtil.js.map