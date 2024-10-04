"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyResourceDPoP = exports.verifyDPoP = exports.createDPoP = exports.getCreateDPoPOptions = exports.dpopTokenRequestNonceError = void 0;
const jwt_decode_1 = require("jwt-decode");
const u8a = __importStar(require("uint8arrays"));
const uuid_1 = require("uuid");
const hasher_1 = require("../hasher");
const jwt_1 = require("./../jwt");
exports.dpopTokenRequestNonceError = 'use_dpop_nonce';
function getCreateDPoPOptions(createDPoPClientOpts, endPointUrl, resourceRequestOpts) {
    const htu = endPointUrl.split('?')[0].split('#')[0];
    return Object.assign(Object.assign({}, createDPoPClientOpts), { jwtPayloadProps: Object.assign(Object.assign(Object.assign({}, createDPoPClientOpts.jwtPayloadProps), { htu, htm: 'POST' }), (resourceRequestOpts && { accessToken: resourceRequestOpts.accessToken })) });
}
exports.getCreateDPoPOptions = getCreateDPoPOptions;
function createDPoP(options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { createJwtCallback, jwtIssuer, jwtPayloadProps, dPoPSigningAlgValuesSupported } = options;
        if (jwtPayloadProps.accessToken && (((_a = jwtPayloadProps.accessToken) === null || _a === void 0 ? void 0 : _a.startsWith('DPoP ')) || ((_b = jwtPayloadProps.accessToken) === null || _b === void 0 ? void 0 : _b.startsWith('Bearer ')))) {
            throw new Error('expected access token without scheme');
        }
        const ath = jwtPayloadProps.accessToken ? u8a.toString((0, hasher_1.defaultHasher)(jwtPayloadProps.accessToken, 'sha256'), 'base64url') : undefined;
        return createJwtCallback({ method: 'jwk', type: 'dpop', alg: jwtIssuer.alg, jwk: jwtIssuer.jwk, dPoPSigningAlgValuesSupported }, {
            header: Object.assign(Object.assign({}, jwtIssuer), { typ: 'dpop+jwt', alg: jwtIssuer.alg, jwk: jwtIssuer.jwk }),
            payload: Object.assign(Object.assign(Object.assign({}, jwtPayloadProps), { iat: (0, jwt_1.epochTime)(), jti: (0, uuid_1.v4)() }), (ath && { ath })),
        });
    });
}
exports.createDPoP = createDPoP;
function verifyDPoP(request, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        // There is not more than one DPoP HTTP request header field.
        const dpop = request.headers['dpop'];
        if (!dpop || typeof dpop !== 'string') {
            throw new Error('missing or invalid dpop header. Expected compact JWT');
        }
        // The DPoP HTTP request header field value is a single and well-formed JWT.
        const { header: dPoPHeader, payload: dPoPPayload } = (0, jwt_1.parseJWT)(dpop);
        // Ensure all required header claims are present
        if (dPoPHeader.typ !== 'dpop+jwt' || !dPoPHeader.alg || !dPoPHeader.jwk || typeof dPoPHeader.jwk !== 'object' || dPoPHeader.jwk.d) {
            throw new Error('invalid_dpop_proof. Invalid header claims');
        }
        // Ensure all required payload claims are present
        if (!dPoPPayload.htm || !dPoPPayload.htu || !dPoPPayload.iat || !dPoPPayload.jti) {
            throw new Error('invalid_dpop_proof. Missing required claims');
        }
        // Validate alg is supported
        if ((options === null || options === void 0 ? void 0 : options.acceptedAlgorithms) && !options.acceptedAlgorithms.includes(dPoPHeader.alg)) {
            throw new Error(`invalid_dpop_proof. Invalid 'alg' claim '${dPoPHeader.alg}'. Only ${options.acceptedAlgorithms.join(', ')} are supported.`);
        }
        // Validate nonce if provided
        if (((options === null || options === void 0 ? void 0 : options.expectedNonce) && !dPoPPayload.nonce) || dPoPPayload.nonce !== options.expectedNonce) {
            throw new Error('invalid_dpop_proof. Nonce mismatch');
        }
        // Verify JWT signature
        try {
            const verificationResult = yield options.jwtVerifyCallback({
                method: 'jwk',
                type: 'dpop',
                jwk: dPoPHeader.jwk,
                alg: dPoPHeader.alg,
            }, {
                header: dPoPHeader,
                payload: dPoPPayload,
                raw: dpop,
            });
            if (!verificationResult) {
                throw new Error('invalid_dpop_proof. Invalid JWT signature');
            }
        }
        catch (error) {
            throw new Error('invalid_dpop_proof. Invalid JWT signature. ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
        // Validate htm claim
        if (dPoPPayload.htm !== request.method) {
            throw new Error(`invalid_dpop_proof. Invalid htm claim. Must match request method '${request.method}'`);
        }
        // The htu claim matches the HTTP URI value for the HTTP request in which the JWT was received, ignoring any query and fragment parts.
        const currentUri = request.fullUrl.split('?')[0].split('#')[0];
        if (dPoPPayload.htu !== currentUri) {
            throw new Error('invalid_dpop_proof. Invalid htu claim');
        }
        // Validate nonce if provided
        if ((options.expectedNonce && dPoPPayload.nonce !== options.expectedNonce) || (!options.expectedNonce && dPoPPayload.nonce)) {
            throw new Error('invalid_dpop_proof. Nonce mismatch');
        }
        // Validate iat claim
        const { nowSkewedPast, nowSkewedFuture } = (0, jwt_1.getNowSkewed)(options.now);
        if (
        // iat claim is too far in the future
        nowSkewedPast - ((_a = options.maxIatAgeInSeconds) !== null && _a !== void 0 ? _a : 60) > dPoPPayload.iat ||
            // iat claim is too old
            nowSkewedFuture + ((_b = options.maxIatAgeInSeconds) !== null && _b !== void 0 ? _b : 60) < dPoPPayload.iat) {
            // 5 minute window
            throw new Error('invalid_dpop_proof. Invalid iat claim');
        }
        // If access token is present, validate ath claim
        const authorizationHeader = request.headers.authorization;
        if (!options.expectAccessToken && authorizationHeader) {
            throw new Error('invalid_dpop_proof. Received an unexpected authorization header.');
        }
        if (options.expectAccessToken) {
            if (!dPoPPayload.ath) {
                throw new Error('invalid_dpop_proof. Missing expected ath claim.');
            }
            // validate that the DPOP proof is made for the provided access token
            if (!authorizationHeader || typeof authorizationHeader !== 'string' || !authorizationHeader.startsWith('DPoP ')) {
                throw new Error('invalid_dpop_proof. Invalid authorization header.');
            }
            const accessToken = authorizationHeader.replace('DPoP ', '');
            const expectedAth = u8a.toString((0, hasher_1.defaultHasher)(accessToken, 'sha256'), 'base64url');
            if (dPoPPayload.ath !== expectedAth) {
                throw new Error('invalid_dpop_proof. Invalid ath claim');
            }
            // validate that the access token is signed with the same key as the DPOP proof
            const accessTokenPayload = (0, jwt_decode_1.jwtDecode)(accessToken, { header: false });
            if (!((_c = accessTokenPayload.cnf) === null || _c === void 0 ? void 0 : _c.jkt)) {
                throw new Error('invalid_dpop_proof. Access token is missing the jkt claim');
            }
            const thumprint = yield (0, jwt_1.calculateJwkThumbprint)(dPoPHeader.jwk, 'sha256');
            if (((_d = accessTokenPayload.cnf) === null || _d === void 0 ? void 0 : _d.jkt) !== thumprint) {
                throw new Error('invalid_dpop_proof. JwkThumbprint mismatch');
            }
        }
        // If all validations pass, return the dpop jwk
        return dPoPHeader.jwk;
    });
}
exports.verifyDPoP = verifyDPoP;
/**
 * DPoP verifications for resource requests
 * For Bearer token compatibility jwt's must have a token_type claim
 * The access token itself must be validated before using this method
 * If the token_type is not DPoP, then the request is not a DPoP request
 * and we don't need to verify the DPoP proof
 */
function verifyResourceDPoP(request, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!request.headers.authorization || typeof request.headers.authorization !== 'string') {
            throw new Error('Received an invalid resource request. Missing authorization header.');
        }
        const tokenPayload = (0, jwt_decode_1.jwtDecode)(request.headers.authorization, { header: false });
        const tokenType = tokenPayload.token_type;
        if (tokenType !== 'DPoP') {
            return;
        }
        return verifyDPoP(request, Object.assign(Object.assign({}, options), { expectAccessToken: true }));
    });
}
exports.verifyResourceDPoP = verifyResourceDPoP;
//# sourceMappingURL=DPoP.js.map