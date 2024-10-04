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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJWT = exports.extractBearerToken = exports.isJWS = exports.createProofOfPossession = void 0;
const debug_1 = __importDefault(require("debug"));
const jwt_decode_1 = require("jwt-decode");
const __1 = require("..");
const types_1 = require("../types");
const debug = (0, debug_1.default)('sphereon:openid4vci:common');
/**
 *
 *  - proofOfPossessionCallback: JWTSignerCallback
 *    Mandatory if you want to create (sign) ProofOfPossession
 *  - proofOfPossessionVerifierCallback?: JWTVerifyCallback
 *    If exists, verifies the ProofOfPossession
 *  - proofOfPossessionCallbackArgs: ProofOfPossessionCallbackArgs
 *    arguments needed for signing ProofOfPossession
 *    - proofOfPossessionCallback: JWTSignerCallback
 *      Mandatory to create (sign) ProofOfPossession
 *    - proofOfPossessionVerifierCallback?: JWTVerifyCallback
 *      If exists, verifies the ProofOfPossession
 * @param popMode
 * @param callbacks
 * @param jwtProps
 * @param existingJwt
 *  - Optional, clientId of the party requesting the credential
 */
const createProofOfPossession = (popMode, callbacks, jwtProps, existingJwt) => __awaiter(void 0, void 0, void 0, function* () {
    if (!callbacks.signCallback) {
        debug(`no jwt signer callback or arguments supplied!`);
        throw new Error(types_1.BAD_PARAMS);
    }
    const jwtPayload = createJWT(popMode, jwtProps, existingJwt);
    const jwt = yield callbacks.signCallback(jwtPayload, jwtPayload.header.kid);
    const proof = {
        proof_type: 'jwt',
        jwt,
    };
    try {
        partiallyValidateJWS(jwt);
        if (callbacks.verifyCallback) {
            debug(`Calling supplied verify callback....`);
            yield callbacks.verifyCallback({ jwt, kid: jwtPayload.header.kid });
            debug(`Supplied verify callback return success result`);
        }
    }
    catch (_a) {
        debug(`JWS was not valid`);
        throw new Error(types_1.JWS_NOT_VALID);
    }
    debug(`Proof of Possession JWT:\r\n${jwt}`);
    return proof;
});
exports.createProofOfPossession = createProofOfPossession;
const partiallyValidateJWS = (jws) => {
    if (jws.split('.').length !== 3 || !jws.startsWith('ey')) {
        throw new Error(types_1.JWS_NOT_VALID);
    }
};
const isJWS = (token) => {
    try {
        partiallyValidateJWS(token);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.isJWS = isJWS;
const extractBearerToken = (authorizationHeader) => {
    var _a;
    return authorizationHeader ? (_a = /Bearer (.*)/i.exec(authorizationHeader)) === null || _a === void 0 ? void 0 : _a[1] : undefined;
};
exports.extractBearerToken = extractBearerToken;
const validateJWT = (jwt, opts) => __awaiter(void 0, void 0, void 0, function* () {
    if (!jwt) {
        throw Error('No JWT was supplied');
    }
    if (!(opts === null || opts === void 0 ? void 0 : opts.accessTokenVerificationCallback)) {
        __1.VCI_LOG_COMMON.warning(`No access token verification callback supplied. Access tokens will not be verified, except for a very basic check`);
        partiallyValidateJWS(jwt);
        const header = (0, jwt_decode_1.jwtDecode)(jwt, { header: true });
        const payload = (0, jwt_decode_1.jwtDecode)(jwt, { header: false });
        return Object.assign(Object.assign({ jwt: { header, payload } }, header), payload);
    }
    else {
        return yield opts.accessTokenVerificationCallback({ jwt, kid: opts.kid });
    }
});
exports.validateJWT = validateJWT;
const createJWT = (mode, jwtProps, existingJwt) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const aud = mode === 'pop'
        ? getJwtProperty('aud', true, jwtProps === null || jwtProps === void 0 ? void 0 : jwtProps.issuer, (_a = existingJwt === null || existingJwt === void 0 ? void 0 : existingJwt.payload) === null || _a === void 0 ? void 0 : _a.aud)
        : getJwtProperty('aud', false, jwtProps === null || jwtProps === void 0 ? void 0 : jwtProps.aud, (_b = existingJwt === null || existingJwt === void 0 ? void 0 : existingJwt.payload) === null || _b === void 0 ? void 0 : _b.aud);
    const iss = mode === 'pop'
        ? getJwtProperty('iss', false, jwtProps === null || jwtProps === void 0 ? void 0 : jwtProps.clientId, (_c = existingJwt === null || existingJwt === void 0 ? void 0 : existingJwt.payload) === null || _c === void 0 ? void 0 : _c.iss)
        : getJwtProperty('iss', false, jwtProps === null || jwtProps === void 0 ? void 0 : jwtProps.issuer, (_d = existingJwt === null || existingJwt === void 0 ? void 0 : existingJwt.payload) === null || _d === void 0 ? void 0 : _d.iss);
    const client_id = mode === 'JWT' ? getJwtProperty('client_id', false, jwtProps === null || jwtProps === void 0 ? void 0 : jwtProps.clientId, (_e = existingJwt === null || existingJwt === void 0 ? void 0 : existingJwt.payload) === null || _e === void 0 ? void 0 : _e.client_id) : undefined;
    const jti = getJwtProperty('jti', false, jwtProps === null || jwtProps === void 0 ? void 0 : jwtProps.jti, (_f = existingJwt === null || existingJwt === void 0 ? void 0 : existingJwt.payload) === null || _f === void 0 ? void 0 : _f.jti);
    const typ = getJwtProperty('typ', true, jwtProps === null || jwtProps === void 0 ? void 0 : jwtProps.typ, (_g = existingJwt === null || existingJwt === void 0 ? void 0 : existingJwt.header) === null || _g === void 0 ? void 0 : _g.typ, 'openid4vci-proof+jwt');
    const nonce = getJwtProperty('nonce', false, jwtProps === null || jwtProps === void 0 ? void 0 : jwtProps.nonce, (_h = existingJwt === null || existingJwt === void 0 ? void 0 : existingJwt.payload) === null || _h === void 0 ? void 0 : _h.nonce); // Officially this is required, but some implementations don't have it
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const alg = getJwtProperty('alg', false, jwtProps === null || jwtProps === void 0 ? void 0 : jwtProps.alg, (_j = existingJwt === null || existingJwt === void 0 ? void 0 : existingJwt.header) === null || _j === void 0 ? void 0 : _j.alg, 'ES256');
    const kid = getJwtProperty('kid', false, jwtProps === null || jwtProps === void 0 ? void 0 : jwtProps.kid, (_k = existingJwt === null || existingJwt === void 0 ? void 0 : existingJwt.header) === null || _k === void 0 ? void 0 : _k.kid);
    const jwk = getJwtProperty('jwk', false, jwtProps === null || jwtProps === void 0 ? void 0 : jwtProps.jwk, (_l = existingJwt === null || existingJwt === void 0 ? void 0 : existingJwt.header) === null || _l === void 0 ? void 0 : _l.jwk);
    const x5c = getJwtProperty('x5c', false, jwtProps === null || jwtProps === void 0 ? void 0 : jwtProps.x5c, existingJwt === null || existingJwt === void 0 ? void 0 : existingJwt.header.x5c);
    const jwt = Object.assign({}, existingJwt);
    const now = +new Date();
    const jwtPayload = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (aud && { aud })), { iat: (_o = (_m = jwt.payload) === null || _m === void 0 ? void 0 : _m.iat) !== null && _o !== void 0 ? _o : Math.floor(now / 1000) - 60, exp: (_q = (_p = jwt.payload) === null || _p === void 0 ? void 0 : _p.exp) !== null && _q !== void 0 ? _q : (Math.floor(now / 1000) + 10) * 60, nonce }), (client_id && { client_id })), (iss && { iss })), (jti && { jti }));
    const jwtHeader = Object.assign(Object.assign(Object.assign({ typ,
        alg }, (kid && { kid })), (jwk && { jwk })), (x5c && { x5c }));
    return {
        payload: Object.assign(Object.assign({}, jwt.payload), jwtPayload),
        header: Object.assign(Object.assign({}, jwt.header), jwtHeader),
    };
};
const getJwtProperty = (propertyName, required, option, jwtProperty, defaultValue) => {
    if ((typeof option === 'string' || Array.isArray(option)) && option && jwtProperty && option !== jwtProperty) {
        throw Error(`Cannot have a property '${propertyName}' with value '${option}' and different JWT value '${jwtProperty}' at the same time`);
    }
    let result = (jwtProperty ? jwtProperty : option);
    if (!result) {
        if (required) {
            throw Error(`No ${propertyName} property provided either in a JWT or as option`);
        }
        result = defaultValue;
    }
    return result;
};
//# sourceMappingURL=ProofUtil.js.map