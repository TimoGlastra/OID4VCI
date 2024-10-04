"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwtBearerClientAssertion = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const ProofOfPossessionBuilder_1 = require("../ProofOfPossessionBuilder");
const createJwtBearerClientAssertion = (request, opts) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { asOpts, credentialIssuer } = opts;
    if (((_a = asOpts === null || asOpts === void 0 ? void 0 : asOpts.clientOpts) === null || _a === void 0 ? void 0 : _a.clientAssertionType) === 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer') {
        const { clientId = request.client_id, signCallbacks, alg } = asOpts.clientOpts;
        let { kid } = asOpts.clientOpts;
        if (!clientId) {
            return Promise.reject(Error(`Not client_id supplied, but client-assertion jwt-bearer requested.`));
        }
        else if (!kid) {
            return Promise.reject(Error(`No kid supplied, but client-assertion jwt-bearer requested.`));
        }
        else if (typeof (signCallbacks === null || signCallbacks === void 0 ? void 0 : signCallbacks.signCallback) !== 'function') {
            return Promise.reject(Error(`No sign callback supplied, but client-assertion jwt-bearer requested.`));
        }
        else if (!credentialIssuer) {
            return Promise.reject(Error(`No credential issuer supplied, but client-assertion jwt-bearer requested.`));
        }
        if (clientId.startsWith('http') && kid.includes('#')) {
            kid = kid.split('#')[1];
        }
        const jwt = {
            header: {
                typ: 'JWT',
                kid,
                alg: alg !== null && alg !== void 0 ? alg : 'ES256',
            },
            payload: {
                iss: clientId,
                sub: clientId,
                aud: credentialIssuer,
                jti: (0, oid4vc_common_1.uuidv4)(),
                exp: Math.floor(Date.now()) / 1000 + 60,
                iat: Math.floor(Date.now()) / 1000 - 60,
            },
        };
        const pop = yield ProofOfPossessionBuilder_1.ProofOfPossessionBuilder.fromJwt({
            jwt,
            callbacks: signCallbacks,
            version: (_b = opts.version) !== null && _b !== void 0 ? _b : oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13,
            mode: 'JWT',
        }).build();
        request.client_assertion_type = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';
        request.client_assertion = pop.jwt;
    }
});
exports.createJwtBearerClientAssertion = createJwtBearerClientAssertion;
//# sourceMappingURL=AccessTokenUtil.js.map