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
exports.calculateJwkThumbprintUri = exports.getDigestAlgorithmFromJwkThumbprintUri = exports.calculateJwkThumbprint = void 0;
const u8a = __importStar(require("uint8arrays"));
const hasher_1 = require("../hasher");
const check = (value, description) => {
    if (typeof value !== 'string' || !value) {
        throw Error(`${description} missing or invalid`);
    }
};
function calculateJwkThumbprint(jwk, digestAlgorithm) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!jwk || typeof jwk !== 'object') {
            throw new TypeError('JWK must be an object');
        }
        const algorithm = digestAlgorithm !== null && digestAlgorithm !== void 0 ? digestAlgorithm : 'sha256';
        if (algorithm !== 'sha256' && algorithm !== 'sha384' && algorithm !== 'sha512') {
            throw new TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
        }
        let components;
        switch (jwk.kty) {
            case 'EC':
                check(jwk.crv, '"crv" (Curve) Parameter');
                check(jwk.x, '"x" (X Coordinate) Parameter');
                check(jwk.y, '"y" (Y Coordinate) Parameter');
                components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y };
                break;
            case 'OKP':
                check(jwk.crv, '"crv" (Subtype of Key Pair) Parameter');
                check(jwk.x, '"x" (Public Key) Parameter');
                components = { crv: jwk.crv, kty: jwk.kty, x: jwk.x };
                break;
            case 'RSA':
                check(jwk.e, '"e" (Exponent) Parameter');
                check(jwk.n, '"n" (Modulus) Parameter');
                components = { e: jwk.e, kty: jwk.kty, n: jwk.n };
                break;
            case 'oct':
                check(jwk.k, '"k" (Key Value) Parameter');
                components = { k: jwk.k, kty: jwk.kty };
                break;
            default:
                throw Error('"kty" (Key Type) Parameter missing or unsupported');
        }
        return u8a.toString((0, hasher_1.defaultHasher)(JSON.stringify(components), algorithm), 'base64url');
    });
}
exports.calculateJwkThumbprint = calculateJwkThumbprint;
function getDigestAlgorithmFromJwkThumbprintUri(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const match = uri.match(/^urn:ietf:params:oauth:jwk-thumbprint:sha-(\w+):/);
        if (!match) {
            throw new Error(`Invalid JWK thumbprint URI structure ${uri}`);
        }
        const algorithm = `sha${match[1]}`;
        if (algorithm !== 'sha256' && algorithm !== 'sha384' && algorithm !== 'sha512') {
            throw new Error(`Invalid JWK thumbprint URI digest algorithm ${uri}`);
        }
        return algorithm;
    });
}
exports.getDigestAlgorithmFromJwkThumbprintUri = getDigestAlgorithmFromJwkThumbprintUri;
function calculateJwkThumbprintUri(jwk_1) {
    return __awaiter(this, arguments, void 0, function* (jwk, digestAlgorithm = 'sha256') {
        const thumbprint = yield calculateJwkThumbprint(jwk, digestAlgorithm);
        return `urn:ietf:params:oauth:jwk-thumbprint:sha-${digestAlgorithm.slice(-3)}:${thumbprint}`;
    });
}
exports.calculateJwkThumbprintUri = calculateJwkThumbprintUri;
//# sourceMappingURL=JwkThumbprint.js.map