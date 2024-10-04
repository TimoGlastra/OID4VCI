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
Object.defineProperty(exports, "__esModule", { value: true });
exports.vJarmClientMetadata = exports.vJarmClientMetadataSignEncrypt = exports.vJarmClientMetadataEncrypt = exports.vJarmClientMetadataSign = void 0;
const v = __importStar(require("valibot"));
exports.vJarmClientMetadataSign = v.object({
    authorization_signed_response_alg: v.pipe(v.optional(v.string()), // @default 'RS256'  This makes no sense with openid4vp if just encrypted can be specified
    v.description('JWA. If this is specified, the response will be signed using JWS and the configured algorithm. The algorithm none is not allowed.')),
    authorization_encrypted_response_alg: v.optional(v.never()),
    authorization_encrypted_response_enc: v.optional(v.never()),
});
exports.vJarmClientMetadataEncrypt = v.object({
    authorization_signed_response_alg: v.optional(v.never()),
    authorization_encrypted_response_alg: v.pipe(v.string(), v.description('JWE alg algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.')),
    authorization_encrypted_response_enc: v.pipe(v.optional(v.string(), 'A128CBC-HS256'), v.description('JWE enc algorithm JWA. If both signing and encryption are requested, the response will be signed then encrypted with the provided algorithm.')),
});
exports.vJarmClientMetadataSignEncrypt = v.object(Object.assign(Object.assign({}, v.pick(exports.vJarmClientMetadataSign, ['authorization_signed_response_alg']).entries), v.pick(exports.vJarmClientMetadataEncrypt, ['authorization_encrypted_response_alg', 'authorization_encrypted_response_enc']).entries));
/**
 * Clients may register their public encryption keys using the jwks_uri or jwks metadata parameters.
 */
exports.vJarmClientMetadata = v.union([exports.vJarmClientMetadataSign, exports.vJarmClientMetadataEncrypt, exports.vJarmClientMetadataSignEncrypt]);
//# sourceMappingURL=v-jarm-client-metadata.js.map