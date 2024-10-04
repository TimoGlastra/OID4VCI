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
exports.getJwtVerifierWithContext = exports.getJwkVerifier = exports.getX5cVerifier = exports.getDidJwtVerifier = void 0;
const getDidJwtVerifier = (jwt, options) => {
    const { type } = options;
    if (!jwt.header.kid)
        throw new Error(`Received an invalid JWT. Missing kid header.`);
    if (!jwt.header.alg)
        throw new Error(`Received an invalid JWT. Missing alg header.`);
    if (!jwt.header.kid.includes('#')) {
        throw new Error(`Received an invalid JWT.. '${type}' contains an invalid kid header.`);
    }
    return { method: 'did', didUrl: jwt.header.kid, type: type, alg: jwt.header.alg };
};
exports.getDidJwtVerifier = getDidJwtVerifier;
const getIssuer = (type, payload) => {
    // For 'request-object' the `iss` value is not required so we map the issuer to client_id
    if (type === 'request-object') {
        if (!payload.client_id) {
            throw new Error('Missing required field client_id in request object JWT');
        }
        return payload.client_id;
    }
    if (typeof payload.iss !== 'string') {
        throw new Error(`Received an invalid JWT. '${type}' contains an invalid iss claim or it is missing.`);
    }
    return payload.iss;
};
const getX5cVerifier = (jwt, options) => {
    const { type } = options;
    if (!jwt.header.x5c)
        throw new Error(`Received an invalid JWT. Missing x5c header.`);
    if (!jwt.header.alg)
        throw new Error(`Received an invalid JWT. Missing alg header.`);
    if (!Array.isArray(jwt.header.x5c) || jwt.header.x5c.length === 0 || !jwt.header.x5c.every((cert) => typeof cert === 'string')) {
        throw new Error(`Received an invalid JWT.. '${type}' contains an invalid x5c header.`);
    }
    return {
        method: 'x5c',
        x5c: jwt.header.x5c,
        issuer: getIssuer(type, jwt.payload),
        type: type,
        alg: jwt.header.alg,
    };
};
exports.getX5cVerifier = getX5cVerifier;
const getJwkVerifier = (jwt, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = options;
    if (!jwt.header.jwk)
        throw new Error(`Received an invalid JWT.  Missing jwk header.`);
    if (!jwt.header.alg)
        throw new Error(`Received an invalid JWT. Missing alg header.`);
    if (typeof jwt.header.jwk !== 'object') {
        throw new Error(`Received an invalid JWT. '${type}' contains an invalid jwk header.`);
    }
    return { method: 'jwk', type, jwk: jwt.header.jwk, alg: jwt.header.alg };
});
exports.getJwkVerifier = getJwkVerifier;
const getJwtVerifierWithContext = (jwt, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { header, payload } = jwt;
    if ((_a = header.kid) === null || _a === void 0 ? void 0 : _a.startsWith('did:'))
        return (0, exports.getDidJwtVerifier)({ header, payload }, options);
    else if (jwt.header.x5c)
        return (0, exports.getX5cVerifier)({ header, payload }, options);
    else if (jwt.header.jwk)
        return (0, exports.getJwkVerifier)({ header, payload }, options);
    return { method: 'custom', type: options.type };
});
exports.getJwtVerifierWithContext = getJwtVerifierWithContext;
//# sourceMappingURL=JwtVerifier.js.map