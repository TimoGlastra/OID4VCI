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
exports.IDToken = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const Opts_1 = require("../authorization-response/Opts");
const types_1 = require("../types");
const Payload_1 = require("./Payload");
class IDToken {
    constructor(jwt, payload, responseOpts) {
        this._jwt = jwt;
        this._payload = payload;
        this._responseOpts = responseOpts;
    }
    static fromVerifiedAuthorizationRequest(verifiedAuthorizationRequest, responseOpts, verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorizationRequestPayload = verifiedAuthorizationRequest.authorizationRequestPayload;
            if (!authorizationRequestPayload) {
                throw new Error(types_1.SIOPErrors.NO_REQUEST);
            }
            const idToken = new IDToken(null, yield (0, Payload_1.createIDTokenPayload)(verifiedAuthorizationRequest, responseOpts), responseOpts);
            if (verifyOpts) {
                yield idToken.verify(verifyOpts);
            }
            return idToken;
        });
    }
    static fromIDToken(idTokenJwt, verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!idTokenJwt) {
                throw new Error(types_1.SIOPErrors.NO_JWT);
            }
            const idToken = new IDToken(idTokenJwt, undefined);
            if (verifyOpts) {
                yield idToken.verify(verifyOpts);
            }
            return idToken;
        });
    }
    static fromIDTokenPayload(idTokenPayload, responseOpts, verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!idTokenPayload) {
                throw new Error(types_1.SIOPErrors.NO_JWT);
            }
            const idToken = new IDToken(null, idTokenPayload, responseOpts);
            if (verifyOpts) {
                yield idToken.verify(verifyOpts);
            }
            return idToken;
        });
    }
    payload() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._payload) {
                if (!this._jwt) {
                    throw new Error(types_1.SIOPErrors.NO_JWT);
                }
                const { header, payload } = this.parseAndVerifyJwt();
                this._header = header;
                this._payload = payload;
            }
            return this._payload;
        });
    }
    jwt(_jwtIssuer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._jwt) {
                if (!this.responseOpts) {
                    throw Error(types_1.SIOPErrors.BAD_IDTOKEN_RESPONSE_OPTS);
                }
                const jwtIssuer = _jwtIssuer
                    ? Object.assign(Object.assign({}, _jwtIssuer), { type: 'id-token', authorizationResponseOpts: this.responseOpts }) : { method: 'custom', type: 'id-token', authorizationResponseOpts: this.responseOpts };
                if (jwtIssuer.method === 'custom') {
                    this._jwt = yield this.responseOpts.createJwtCallback(jwtIssuer, { header: {}, payload: this._payload });
                }
                else if (jwtIssuer.method === 'did') {
                    const did = jwtIssuer.didUrl.split('#')[0];
                    this._payload.sub = did;
                    const issuer = this._responseOpts.registration.issuer || this._payload.iss;
                    if (!issuer || !(issuer.includes(types_1.ResponseIss.SELF_ISSUED_V2) || issuer === this._payload.sub)) {
                        throw new Error(types_1.SIOPErrors.NO_SELF_ISSUED_ISS);
                    }
                    if (!this._payload.iss) {
                        this._payload.iss = issuer;
                    }
                    const header = { kid: jwtIssuer.didUrl, alg: jwtIssuer.alg, typ: 'JWT' };
                    this._jwt = yield this.responseOpts.createJwtCallback(Object.assign(Object.assign({}, jwtIssuer), { type: 'id-token' }), { header, payload: this._payload });
                }
                else if (jwtIssuer.method === 'x5c') {
                    this._payload.iss = jwtIssuer.issuer;
                    this._payload.sub = jwtIssuer.issuer;
                    const header = { x5c: jwtIssuer.x5c, typ: 'JWT' };
                    this._jwt = yield this._responseOpts.createJwtCallback(jwtIssuer, { header, payload: this._payload });
                }
                else if (jwtIssuer.method === 'jwk') {
                    const jwkThumbprintUri = yield (0, oid4vc_common_1.calculateJwkThumbprintUri)(jwtIssuer.jwk);
                    this._payload.sub = jwkThumbprintUri;
                    this._payload.iss = jwkThumbprintUri;
                    this._payload.sub_jwk = jwtIssuer.jwk;
                    const header = { jwk: jwtIssuer.jwk, alg: jwtIssuer.jwk.alg, typ: 'JWT' };
                    this._jwt = yield this._responseOpts.createJwtCallback(jwtIssuer, { header, payload: this._payload });
                }
                else {
                    throw new Error(`JwtIssuer method '${jwtIssuer.method}' not implemented`);
                }
                const { header, payload } = this.parseAndVerifyJwt();
                this._header = header;
                this._payload = payload;
            }
            return this._jwt;
        });
    }
    parseAndVerifyJwt() {
        const { header, payload } = (0, oid4vc_common_1.parseJWT)(this._jwt);
        this.assertValidResponseJWT({ header, payload });
        const idTokenPayload = payload;
        return { header, payload: idTokenPayload };
    }
    /**
     * Verifies a SIOP ID Response JWT on the RP Side
     *
     * @param idToken ID token to be validated
     * @param verifyOpts
     */
    verify(verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Opts_1.assertValidVerifyOpts)(verifyOpts);
            if (!this._jwt) {
                throw new Error(types_1.SIOPErrors.NO_JWT);
            }
            const parsedJwt = (0, oid4vc_common_1.parseJWT)(this._jwt);
            this.assertValidResponseJWT(parsedJwt);
            const idTokenPayload = parsedJwt.payload;
            const jwtVerifier = yield (0, types_1.getJwtVerifierWithContext)(parsedJwt, { type: 'id-token' });
            const verificationResult = yield verifyOpts.verifyJwtCallback(jwtVerifier, Object.assign(Object.assign({}, parsedJwt), { raw: this._jwt }));
            if (!verificationResult) {
                throw Error(types_1.SIOPErrors.ERROR_VERIFYING_SIGNATURE);
            }
            this.assertValidResponseJWT({ header: parsedJwt.header, verPayload: idTokenPayload, audience: verifyOpts.audience });
            // Enforces verifyPresentationCallback function on the RP side,
            if (!(verifyOpts === null || verifyOpts === void 0 ? void 0 : verifyOpts.verification.presentationVerificationCallback)) {
                throw new Error(types_1.SIOPErrors.VERIFIABLE_PRESENTATION_VERIFICATION_FUNCTION_MISSING);
            }
            return {
                jwt: this._jwt,
                payload: Object.assign({}, idTokenPayload),
                verifyOpts,
            };
        });
    }
    static verify(idTokenJwt, verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            const idToken = yield IDToken.fromIDToken(idTokenJwt, verifyOpts);
            const verifiedIdToken = yield idToken.verify(verifyOpts);
            return Object.assign({}, verifiedIdToken);
        });
    }
    assertValidResponseJWT(opts) {
        if (!opts.header) {
            throw new Error(types_1.SIOPErrors.BAD_PARAMS);
        }
        if (opts.payload) {
            if (!opts.payload.iss || !(opts.payload.iss.includes(types_1.ResponseIss.SELF_ISSUED_V2) || opts.payload.iss.startsWith('did:'))) {
                throw new Error(`${types_1.SIOPErrors.NO_SELF_ISSUED_ISS}, got: ${opts.payload.iss}`);
            }
        }
        if (opts.verPayload) {
            if (!opts.verPayload.nonce) {
                throw Error(types_1.SIOPErrors.NO_NONCE);
                // No need for our own expiration check. DID jwt already does that
                /*} else if (!opts.verPayload.exp || opts.verPayload.exp < Date.now() / 1000) {
                throw Error(SIOPErrors.EXPIRED);
                /!*} else if (!opts.verPayload.iat || opts.verPayload.iat > (Date.now() / 1000)) {
                                  throw Error(SIOPErrors.EXPIRED);*!/
                // todo: Add iat check
        
               */
            }
            if ((opts.verPayload.aud && !opts.audience) || (!opts.verPayload.aud && opts.audience)) {
                throw Error(types_1.SIOPErrors.NO_AUDIENCE);
            }
            else if (opts.audience && opts.audience != opts.verPayload.aud) {
                throw Error(types_1.SIOPErrors.INVALID_AUDIENCE);
            }
            else if (opts.nonce && opts.nonce != opts.verPayload.nonce) {
                throw Error(types_1.SIOPErrors.BAD_NONCE);
            }
        }
    }
    get header() {
        return this._header;
    }
    get responseOpts() {
        return this._responseOpts;
    }
    isSelfIssued() {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield this.payload();
            return payload.iss === types_1.ResponseIss.SELF_ISSUED_V2 || (payload.sub !== undefined && payload.sub === payload.iss);
        });
    }
}
exports.IDToken = IDToken;
//# sourceMappingURL=IDToken.js.map