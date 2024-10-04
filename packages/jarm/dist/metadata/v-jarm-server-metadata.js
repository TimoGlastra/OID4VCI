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
exports.vJarmServerMetadata = void 0;
const v = __importStar(require("valibot"));
/**
 * Authorization servers SHOULD publish the supported algorithms for signing and encrypting the JWT of an authorization response by utilizing OAuth 2.0 Authorization Server Metadata [RFC8414] parameters.
 */
exports.vJarmServerMetadata = v.object({
    authorization_signing_alg_values_supported: v.pipe(v.array(v.string()), v.description('JSON array containing a list of the JWS [RFC7515] signing algorithms (alg values) JWA [RFC7518] supported by the authorization endpoint to sign the response.')),
    authorization_encryption_alg_values_supported: v.pipe(v.array(v.string()), v.description('JSON array containing a list of the JWE [RFC7516] encryption algorithms (alg values) JWA [RFC7518] supported by the authorization endpoint to encrypt the response.')),
    authorization_encryption_enc_values_supported: v.pipe(v.array(v.string()), v.description('JSON array containing a list of the JWE [RFC7516] encryption algorithms (enc values) JWA [RFC7518] supported by the authorization endpoint to encrypt the response.')),
});
//# sourceMappingURL=v-jarm-server-metadata.js.map