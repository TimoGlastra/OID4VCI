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
exports.AuthorizationResponse = void 0;
const authorization_request_1 = require("../authorization-request");
const Opts_1 = require("../authorization-request/Opts");
const id_token_1 = require("../id-token");
const types_1 = require("../types");
const OpenID4VP_1 = require("./OpenID4VP");
const Opts_2 = require("./Opts");
const Payload_1 = require("./Payload");
class AuthorizationResponse {
    constructor({ authorizationResponsePayload, idToken, responseOpts, authorizationRequest, }) {
        this._authorizationRequest = authorizationRequest;
        this._options = responseOpts;
        this._idToken = idToken;
        this._payload = authorizationResponsePayload;
    }
    /**
     * Creates a SIOP Response Object
     *
     * @param requestObject
     * @param responseOpts
     * @param verifyOpts
     */
    static fromRequestObject(requestObject, responseOpts, verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Opts_1.assertValidVerifyAuthorizationRequestOpts)(verifyOpts);
            (0, Opts_2.assertValidResponseOpts)(responseOpts);
            if (!requestObject || !requestObject.startsWith('ey')) {
                throw new Error(types_1.SIOPErrors.NO_JWT);
            }
            const authorizationRequest = yield authorization_request_1.AuthorizationRequest.fromUriOrJwt(requestObject);
            return AuthorizationResponse.fromAuthorizationRequest(authorizationRequest, responseOpts, verifyOpts);
        });
    }
    static fromPayload(authorizationResponsePayload, responseOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!authorizationResponsePayload) {
                throw new Error(types_1.SIOPErrors.NO_RESPONSE);
            }
            if (responseOpts) {
                (0, Opts_2.assertValidResponseOpts)(responseOpts);
            }
            const idToken = authorizationResponsePayload.id_token ? yield id_token_1.IDToken.fromIDToken(authorizationResponsePayload.id_token) : undefined;
            return new AuthorizationResponse({
                authorizationResponsePayload,
                idToken,
                responseOpts,
            });
        });
    }
    static fromAuthorizationRequest(authorizationRequest, responseOpts, verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Opts_2.assertValidResponseOpts)(responseOpts);
            if (!authorizationRequest) {
                throw new Error(types_1.SIOPErrors.NO_REQUEST);
            }
            const verifiedRequest = yield authorizationRequest.verify(verifyOpts);
            return yield AuthorizationResponse.fromVerifiedAuthorizationRequest(verifiedRequest, responseOpts, verifyOpts);
        });
    }
    static fromVerifiedAuthorizationRequest(verifiedAuthorizationRequest, responseOpts, verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Opts_2.assertValidResponseOpts)(responseOpts);
            if (!verifiedAuthorizationRequest) {
                throw new Error(types_1.SIOPErrors.NO_REQUEST);
            }
            const authorizationRequest = verifiedAuthorizationRequest.authorizationRequest;
            // const merged = verifiedAuthorizationRequest.authorizationRequest.requestObject, verifiedAuthorizationRequest.requestObject);
            // const presentationDefinitions = await PresentationExchange.findValidPresentationDefinitions(merged, await authorizationRequest.getSupportedVersion());
            const presentationDefinitions = JSON.parse(JSON.stringify(verifiedAuthorizationRequest.presentationDefinitions));
            const wantsIdToken = yield authorizationRequest.containsResponseType(types_1.ResponseType.ID_TOKEN);
            const hasVpToken = yield authorizationRequest.containsResponseType(types_1.ResponseType.VP_TOKEN);
            const idToken = wantsIdToken ? yield id_token_1.IDToken.fromVerifiedAuthorizationRequest(verifiedAuthorizationRequest, responseOpts) : undefined;
            const idTokenPayload = idToken ? yield idToken.payload() : undefined;
            const authorizationResponsePayload = yield (0, Payload_1.createResponsePayload)(authorizationRequest, responseOpts, idTokenPayload);
            const response = new AuthorizationResponse({
                authorizationResponsePayload,
                idToken,
                responseOpts,
                authorizationRequest,
            });
            if (hasVpToken) {
                const wrappedPresentations = yield (0, OpenID4VP_1.extractPresentationsFromAuthorizationResponse)(response, {
                    hasher: verifyOpts.hasher,
                });
                yield (0, OpenID4VP_1.assertValidVerifiablePresentations)({
                    presentationDefinitions,
                    presentations: wrappedPresentations,
                    verificationCallback: verifyOpts.verification.presentationVerificationCallback,
                    opts: Object.assign(Object.assign({}, responseOpts.presentationExchange), { hasher: verifyOpts.hasher }),
                });
            }
            return response;
        });
    }
    verify(verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // Merge payloads checks for inconsistencies in properties which are present in both the auth request and request object
            const merged = yield this.mergedPayloads({
                consistencyCheck: true,
                hasher: verifyOpts.hasher,
            });
            if (verifyOpts.state && merged.state !== verifyOpts.state) {
                throw Error(types_1.SIOPErrors.BAD_STATE);
            }
            const verifiedIdToken = yield ((_a = this.idToken) === null || _a === void 0 ? void 0 : _a.verify(verifyOpts));
            const oid4vp = yield (0, OpenID4VP_1.verifyPresentations)(this, verifyOpts);
            // Gather all nonces
            const allNonces = new Set();
            if (oid4vp)
                allNonces.add(oid4vp.nonce);
            if (verifiedIdToken)
                allNonces.add(verifiedIdToken.payload.nonce);
            if (merged.nonce)
                allNonces.add(merged.nonce);
            const firstNonce = Array.from(allNonces)[0];
            if (allNonces.size !== 1 || typeof firstNonce !== 'string') {
                throw new Error('both id token and VPs in vp token if present must have a nonce, and all nonces must be the same');
            }
            if (verifyOpts.nonce && firstNonce !== verifyOpts.nonce) {
                throw Error(types_1.SIOPErrors.BAD_NONCE);
            }
            const state = (_b = merged.state) !== null && _b !== void 0 ? _b : verifiedIdToken === null || verifiedIdToken === void 0 ? void 0 : verifiedIdToken.payload.state;
            if (!state) {
                throw Error('State is required');
            }
            return Object.assign(Object.assign({ authorizationResponse: this, verifyOpts, nonce: firstNonce, state, correlationId: verifyOpts.correlationId }, (this.idToken && { idToken: verifiedIdToken })), (oid4vp && { oid4vpSubmission: oid4vp }));
        });
    }
    get authorizationRequest() {
        return this._authorizationRequest;
    }
    get payload() {
        return this._payload;
    }
    get options() {
        return this._options;
    }
    get idToken() {
        return this._idToken;
    }
    getMergedProperty(key, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const merged = yield this.mergedPayloads(opts);
            return merged[key];
        });
    }
    mergedPayloads(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let nonce = this._payload.nonce;
            if ((_a = this._payload) === null || _a === void 0 ? void 0 : _a.vp_token) {
                const presentations = yield (0, OpenID4VP_1.extractPresentationsFromAuthorizationResponse)(this, opts);
                // We do not verify them, as that is done elsewhere. So we simply can take the first nonce
                if (!nonce) {
                    nonce = (0, OpenID4VP_1.extractNonceFromWrappedVerifiablePresentation)(Array.isArray(presentations) ? presentations[0] : presentations);
                }
            }
            const idTokenPayload = yield ((_b = this.idToken) === null || _b === void 0 ? void 0 : _b.payload());
            if ((opts === null || opts === void 0 ? void 0 : opts.consistencyCheck) !== false && idTokenPayload) {
                Object.entries(idTokenPayload).forEach((entry) => {
                    if (typeof entry[0] === 'string' && this.payload[entry[0]] && this.payload[entry[0]] !== entry[1]) {
                        throw Error(`Mismatch in Authorization Request and Request object value for ${entry[0]}`);
                    }
                });
            }
            if (!nonce && this._idToken) {
                nonce = (yield this._idToken.payload()).nonce;
            }
            return Object.assign(Object.assign(Object.assign({}, this.payload), idTokenPayload), { nonce });
        });
    }
}
exports.AuthorizationResponse = AuthorizationResponse;
//# sourceMappingURL=AuthorizationResponse.js.map