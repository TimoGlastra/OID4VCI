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
exports.getRequestObjectJwtVerifier = exports.getJwtVerifierWithContext = exports.getJwkVerifier = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const oid4vc_common_2 = require("@sphereon/oid4vc-common");
const oid4vc_common_3 = require("@sphereon/oid4vc-common");
const Errors_1 = __importDefault(require("./Errors"));
const getJwkVerifier = (jwt, jwkJwtVerifier) => __awaiter(void 0, void 0, void 0, function* () {
    if (jwkJwtVerifier.type !== 'id-token') {
        // TODO: check why ts is complaining if we return the jwkJwtVerifier directly
        return Object.assign(Object.assign({}, jwkJwtVerifier), { type: jwkJwtVerifier.type });
    }
    if (typeof jwt.payload.sub_jwk !== 'string') {
        throw new Error(`${Errors_1.default.INVALID_JWT} '${jwkJwtVerifier.type}' missing sub_jwk claim.`);
    }
    const jwkThumbPrintUri = jwt.payload.sub_jwk;
    const digestAlgorithm = yield (0, oid4vc_common_1.getDigestAlgorithmFromJwkThumbprintUri)(jwkThumbPrintUri);
    const selfComputedJwkThumbPrintUri = yield (0, oid4vc_common_1.calculateJwkThumbprintUri)(jwt.header.jwk, digestAlgorithm);
    if (selfComputedJwkThumbPrintUri !== jwkThumbPrintUri) {
        throw new Error(`${Errors_1.default.INVALID_JWT} '${jwkJwtVerifier.type}' contains an invalid sub_jwk claim.`);
    }
    return Object.assign(Object.assign({}, jwkJwtVerifier), { type: jwkJwtVerifier.type, jwkThumbprint: jwt.payload.sub_jwk });
});
exports.getJwkVerifier = getJwkVerifier;
const getJwtVerifierWithContext = (jwt, options) => __awaiter(void 0, void 0, void 0, function* () {
    const verifierWithContext = yield (0, oid4vc_common_2.getJwtVerifierWithContext)(jwt, options);
    if (verifierWithContext.method === 'jwk') {
        return (0, exports.getJwkVerifier)(jwt, verifierWithContext);
    }
    return verifierWithContext;
});
exports.getJwtVerifierWithContext = getJwtVerifierWithContext;
const getRequestObjectJwtVerifier = (jwt, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const type = 'request-object';
    const clientIdScheme = jwt.payload.client_id_scheme;
    const clientId = jwt.payload.client_id;
    if (!clientIdScheme) {
        return (0, exports.getJwtVerifierWithContext)(jwt, { type });
    }
    if (clientIdScheme === 'did') {
        return (0, oid4vc_common_1.getDidJwtVerifier)(jwt, { type });
    }
    else if (clientIdScheme === 'pre-registered') {
        // All validations must be done manually
        // The Verifier metadata is obtained using [RFC7591] or through out-of-band mechanisms.
        return (0, exports.getJwtVerifierWithContext)(jwt, { type });
    }
    else if (clientIdScheme === 'x509_san_dns' || clientIdScheme === 'x509_san_uri') {
        return (0, oid4vc_common_1.getX5cVerifier)(jwt, { type });
    }
    else if (clientIdScheme === 'redirect_uri') {
        if (jwt.payload.redirect_uri && jwt.payload.redirect_uri !== clientId) {
            throw new Error(Errors_1.default.INVALID_CLIENT_ID_MUST_MATCH_REDIRECT_URI);
        }
        const parts = options.raw.split('.');
        if (parts.length > 2 && parts[2]) {
            throw new Error(`${Errors_1.default.INVALID_JWT} '${type}' JWT must not be signed`);
        }
        return (0, exports.getJwtVerifierWithContext)(jwt, { type });
    }
    else if (clientIdScheme === 'verifier_attestation') {
        const verifierAttestationSubtype = 'verifier-attestation+jwt';
        if (!jwt.header.jwt) {
            throw new Error(Errors_1.default.MISSING_ATTESTATION_JWT_WITH_CLIENT_ID_SCHEME_ATTESTATION);
        }
        // TODO: is this correct? not 100% sure based on the spec
        if (jwt.header.typ !== verifierAttestationSubtype) {
            throw new Error(Errors_1.default.MISSING_ATTESTATION_JWT_TYP);
        }
        const attestationJwt = jwt.header.jwt;
        const { header: attestationHeader, payload: attestationPayload } = (0, oid4vc_common_3.parseJWT)(attestationJwt);
        if (attestationHeader.typ !== verifierAttestationSubtype ||
            attestationPayload.sub !== clientId ||
            !attestationPayload.iss ||
            typeof attestationPayload.iss !== 'string' ||
            !attestationPayload.exp ||
            typeof attestationPayload.exp !== 'number' ||
            typeof attestationPayload.cnf !== 'object' ||
            !attestationPayload.cnf ||
            !('jwk' in attestationPayload.cnf) ||
            typeof attestationPayload.cnf['jwk'] !== 'object') {
            throw new Error(Errors_1.default.BAD_VERIFIER_ATTESTATION);
        }
        if (attestationPayload.redirect_uris) {
            if (!Array.isArray(attestationPayload.redirect_uris) ||
                attestationPayload.redirect_uris.some((value) => typeof value !== 'string') ||
                !jwt.payload.redirect_uri ||
                !attestationPayload.redirect_uris.includes(jwt.payload.redirect_uri)) {
                throw new Error(Errors_1.default.BAD_VERIFIER_ATTESTATION_REDIRECT_URIS);
            }
        }
        const jwk = attestationPayload.cnf['jwk'];
        const alg = (_a = jwk.alg) !== null && _a !== void 0 ? _a : attestationHeader.alg;
        if (!alg) {
            throw new Error(`${Errors_1.default.INVALID_JWT} '${type}' JWT header is missing alg.`);
        }
        // The iss claim value of the Verifier Attestation JWT MUST identify a party the Wallet trusts for issuing Verifier Attestation JWTs.
        // If the Wallet cannot establish trust, it MUST refuse the request.
        return { method: 'jwk', type, jwk: attestationPayload.cnf['jwk'], alg };
    }
    else if (clientIdScheme === 'entity_id') {
        if (!clientId.startsWith('http')) {
            throw new Error(Errors_1.default.INVALID_REQUEST_OBJECT_ENTITY_ID_SCHEME_CLIENT_ID);
        }
        return { method: 'openid-federation', type, entityId: clientId };
    }
    throw new Error(Errors_1.default.INVALID_CLIENT_ID_SCHEME);
});
exports.getRequestObjectJwtVerifier = getRequestObjectJwtVerifier;
//# sourceMappingURL=VpJwtVerifier.js.map