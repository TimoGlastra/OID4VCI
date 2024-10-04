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
exports.createAccessTokenResponse = exports.assertValidAccessTokenRequest = exports.isValidGrant = exports.generateAccessToken = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const functions_1 = require("../functions");
const generateAccessToken = (opts) => __awaiter(void 0, void 0, void 0, function* () {
    const { dPoPJwk, accessTokenIssuer, alg, accessTokenSignerCallback, tokenExpiresIn, preAuthorizedCode } = opts;
    // JWT uses seconds for iat and exp
    const iat = new Date().getTime() / 1000;
    const exp = iat + tokenExpiresIn;
    const cnf = dPoPJwk ? { cnf: { jkt: yield (0, oid4vc_common_1.calculateJwkThumbprint)(dPoPJwk, 'sha256') } } : undefined;
    const jwt = {
        header: { typ: 'JWT', alg: alg !== null && alg !== void 0 ? alg : oid4vci_common_1.Alg.ES256 },
        payload: Object.assign(Object.assign(Object.assign({ iat,
            exp, iss: accessTokenIssuer }, cnf), (preAuthorizedCode && { preAuthorizedCode })), { 
            // Protected resources simultaneously supporting both the DPoP and Bearer schemes need to update how the
            // evaluation process is performed for bearer tokens to prevent downgraded usage of a DPoP-bound access token.
            // Specifically, such a protected resource MUST reject a DPoP-bound access token received as a bearer token per [RFC6750].
            token_type: dPoPJwk ? 'DPoP' : 'Bearer' }),
    };
    return yield accessTokenSignerCallback(jwt);
});
exports.generateAccessToken = generateAccessToken;
const isValidGrant = (assertedState, grantType) => {
    var _a, _b, _c, _d;
    if ((_b = (_a = assertedState.credentialOffer) === null || _a === void 0 ? void 0 : _a.credential_offer) === null || _b === void 0 ? void 0 : _b.grants) {
        // TODO implement authorization_code
        return (Object.keys((_d = (_c = assertedState.credentialOffer) === null || _c === void 0 ? void 0 : _c.credential_offer) === null || _d === void 0 ? void 0 : _d.grants).includes(oid4vci_common_1.GrantTypes.PRE_AUTHORIZED_CODE) &&
            grantType === oid4vci_common_1.GrantTypes.PRE_AUTHORIZED_CODE);
    }
    return false;
};
exports.isValidGrant = isValidGrant;
const assertValidAccessTokenRequest = (request, opts) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    const { credentialOfferSessions, expirationDuration } = opts;
    // Only pre-auth supported for now
    if (request.grant_type !== oid4vci_common_1.GrantTypes.PRE_AUTHORIZED_CODE) {
        throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_grant, oid4vci_common_1.UNSUPPORTED_GRANT_TYPE_ERROR);
    }
    // Pre-auth flow
    if (!request[oid4vci_common_1.PRE_AUTH_CODE_LITERAL]) {
        throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_request, oid4vci_common_1.PRE_AUTHORIZED_CODE_REQUIRED_ERROR);
    }
    const credentialOfferSession = yield credentialOfferSessions.getAsserted(request[oid4vci_common_1.PRE_AUTH_CODE_LITERAL]);
    credentialOfferSession.status = oid4vci_common_1.IssueStatus.ACCESS_TOKEN_REQUESTED;
    credentialOfferSession.lastUpdatedAt = +new Date();
    yield credentialOfferSessions.set(request[oid4vci_common_1.PRE_AUTH_CODE_LITERAL], credentialOfferSession);
    if (!(0, exports.isValidGrant)(credentialOfferSession, request.grant_type)) {
        throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_grant, oid4vci_common_1.UNSUPPORTED_GRANT_TYPE_ERROR);
    }
    /*
   invalid_request:
   the Authorization Server does not expect a PIN in the pre-authorized flow but the client provides a PIN
    */
    if (!((_c = (_b = (_a = credentialOfferSession.credentialOffer.credential_offer) === null || _a === void 0 ? void 0 : _a.grants) === null || _b === void 0 ? void 0 : _b[oid4vci_common_1.GrantTypes.PRE_AUTHORIZED_CODE]) === null || _c === void 0 ? void 0 : _c.tx_code) &&
        request.tx_code &&
        !request.user_pin) {
        // >= v13
        throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_request, oid4vci_common_1.USER_PIN_NOT_REQUIRED_ERROR);
    }
    else if (!((_f = (_e = (_d = credentialOfferSession.credentialOffer.credential_offer) === null || _d === void 0 ? void 0 : _d.grants) === null || _e === void 0 ? void 0 : _e[oid4vci_common_1.GrantTypes.PRE_AUTHORIZED_CODE]) === null || _f === void 0 ? void 0 : _f.user_pin_required) &&
        request.user_pin &&
        !request.tx_code) {
        // <= v12
        throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_request, oid4vci_common_1.USER_PIN_NOT_REQUIRED_ERROR);
    }
    /*
    invalid_request:
    the Authorization Server expects a PIN in the pre-authorized flow but the client does not provide a PIN
     */
    if (
    // >= v13
    !!((_j = (_h = (_g = credentialOfferSession.credentialOffer.credential_offer) === null || _g === void 0 ? void 0 : _g.grants) === null || _h === void 0 ? void 0 : _h[oid4vci_common_1.GrantTypes.PRE_AUTHORIZED_CODE]) === null || _j === void 0 ? void 0 : _j.tx_code) &&
        !request.tx_code) {
        if (request.user_pin) {
            throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_request, oid4vci_common_1.USER_PIN_TX_CODE_SPEC_ERROR);
        }
        throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_request, oid4vci_common_1.USER_PIN_REQUIRED_ERROR);
    }
    else if (
    // <= v12
    ((_m = (_l = (_k = credentialOfferSession.credentialOffer.credential_offer) === null || _k === void 0 ? void 0 : _k.grants) === null || _l === void 0 ? void 0 : _l[oid4vci_common_1.GrantTypes.PRE_AUTHORIZED_CODE]) === null || _m === void 0 ? void 0 : _m.user_pin_required) &&
        !((_q = (_p = (_o = credentialOfferSession.credentialOffer.credential_offer) === null || _o === void 0 ? void 0 : _o.grants) === null || _p === void 0 ? void 0 : _p[oid4vci_common_1.GrantTypes.PRE_AUTHORIZED_CODE]) === null || _q === void 0 ? void 0 : _q.tx_code) &&
        !request.user_pin) {
        if (request.tx_code) {
            throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_request, oid4vci_common_1.USER_PIN_TX_CODE_SPEC_ERROR);
        }
        throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_request, oid4vci_common_1.USER_PIN_REQUIRED_ERROR);
    }
    if ((0, functions_1.isPreAuthorizedCodeExpired)(credentialOfferSession, expirationDuration)) {
        throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_grant, oid4vci_common_1.EXPIRED_PRE_AUTHORIZED_CODE);
    }
    else if (request[oid4vci_common_1.PRE_AUTH_CODE_LITERAL] !==
        ((_u = (_t = (_s = (_r = credentialOfferSession.credentialOffer) === null || _r === void 0 ? void 0 : _r.credential_offer) === null || _s === void 0 ? void 0 : _s.grants) === null || _t === void 0 ? void 0 : _t[oid4vci_common_1.GrantTypes.PRE_AUTHORIZED_CODE]) === null || _u === void 0 ? void 0 : _u[oid4vci_common_1.PRE_AUTH_CODE_LITERAL])) {
        throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_grant, oid4vci_common_1.INVALID_PRE_AUTHORIZED_CODE);
    }
    /*
    invalid_grant:
    the Authorization Server expects a PIN in the pre-authorized flow but the client provides the wrong PIN
    the End-User provides the wrong Pre-Authorized Code or the Pre-Authorized Code has expired
     */
    if (request.tx_code) {
        const txCodeOffer = (_x = (_w = (_v = credentialOfferSession.credentialOffer.credential_offer) === null || _v === void 0 ? void 0 : _v.grants) === null || _w === void 0 ? void 0 : _w[oid4vci_common_1.GrantTypes.PRE_AUTHORIZED_CODE]) === null || _x === void 0 ? void 0 : _x.tx_code;
        if (!txCodeOffer) {
            throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_request, oid4vci_common_1.USER_PIN_NOT_REQUIRED_ERROR);
        }
        else if (txCodeOffer.input_mode === 'text') {
            if (!RegExp(`[\\D]{${txCodeOffer.length}`).test(request.tx_code)) {
                throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_grant, `${oid4vci_common_1.PIN_VALIDATION_ERROR} ${txCodeOffer.length}`);
            }
        }
        else {
            if (!RegExp(`[\\d]{${txCodeOffer.length}}`).test(request.tx_code)) {
                throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_grant, `${oid4vci_common_1.PIN_VALIDATION_ERROR} ${txCodeOffer.length}`);
            }
        }
        if (request.tx_code !== credentialOfferSession.txCode) {
            throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_grant, oid4vci_common_1.PIN_NOT_MATCH_ERROR);
        }
    }
    else if (request.user_pin) {
        if (!/[\\d]{1,8}/.test(request.user_pin)) {
            throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_grant, `${oid4vci_common_1.PIN_VALIDATION_ERROR} 1-8`);
        }
        else if (request.user_pin !== credentialOfferSession.txCode) {
            throw new oid4vci_common_1.TokenError(400, oid4vci_common_1.TokenErrorResponse.invalid_grant, oid4vci_common_1.PIN_NOT_MATCH_ERROR);
        }
    }
    return { preAuthSession: credentialOfferSession };
});
exports.assertValidAccessTokenRequest = assertValidAccessTokenRequest;
const createAccessTokenResponse = (request, opts) => __awaiter(void 0, void 0, void 0, function* () {
    var _y;
    const { dPoPJwk, credentialOfferSessions, cNonces, cNonceExpiresIn, tokenExpiresIn, accessTokenIssuer, accessTokenSignerCallback, interval } = opts;
    // Pre-auth flow
    const preAuthorizedCode = request[oid4vci_common_1.PRE_AUTH_CODE_LITERAL];
    const cNonce = (_y = opts.cNonce) !== null && _y !== void 0 ? _y : (0, oid4vc_common_1.uuidv4)();
    yield cNonces.set(cNonce, { cNonce, createdAt: +new Date(), preAuthorizedCode });
    const access_token = yield (0, exports.generateAccessToken)({
        tokenExpiresIn,
        accessTokenSignerCallback,
        preAuthorizedCode,
        accessTokenIssuer,
        dPoPJwk,
    });
    const response = {
        access_token,
        token_type: dPoPJwk ? 'DPoP' : 'bearer',
        expires_in: tokenExpiresIn,
        c_nonce: cNonce,
        c_nonce_expires_in: cNonceExpiresIn,
        authorization_pending: false,
        interval,
    };
    const credentialOfferSession = yield credentialOfferSessions.getAsserted(preAuthorizedCode);
    credentialOfferSession.status = oid4vci_common_1.IssueStatus.ACCESS_TOKEN_CREATED;
    credentialOfferSession.lastUpdatedAt = +new Date();
    yield credentialOfferSessions.set(preAuthorizedCode, credentialOfferSession);
    return response;
});
exports.createAccessTokenResponse = createAccessTokenResponse;
//# sourceMappingURL=index.js.map