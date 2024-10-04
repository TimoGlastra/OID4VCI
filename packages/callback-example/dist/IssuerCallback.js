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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCredential = exports.getIssuerCallbackV1_0_13 = exports.getIssuerCallbackV1_0_11 = exports.generateDid = void 0;
const didKeyDriver = __importStar(require("@digitalcredentials/did-method-key"));
const ed25519_signature_2020_1 = require("@digitalcredentials/ed25519-signature-2020");
const ed25519_verification_key_2020_1 = require("@digitalcredentials/ed25519-verification-key-2020");
const security_document_loader_1 = require("@digitalcredentials/security-document-loader");
const vc_1 = __importDefault(require("@digitalcredentials/vc"));
// Example on how to generate a did:key to issue a verifiable credential
const generateDid = () => __awaiter(void 0, void 0, void 0, function* () {
    const didKD = didKeyDriver.driver();
    const { didDocument, keyPairs, methodFor } = yield didKD.generate();
    return { didDocument, keyPairs, methodFor };
});
exports.generateDid = generateDid;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIssuerCallbackV1_0_11 = (credential, keyPair, verificationMethod) => {
    if (!credential) {
        throw new Error('A credential needs to be provided');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_opts) => __awaiter(void 0, void 0, void 0, function* () {
        const documentLoader = (0, security_document_loader_1.securityLoader)().build();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const verificationKey = Array.from(keyPair.values())[0];
        const keys = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(Object.assign({}, verificationKey));
        const suite = new ed25519_signature_2020_1.Ed25519Signature2020({ key: keys });
        suite.verificationMethod = verificationMethod;
        return yield vc_1.default.issue({ credential, suite, documentLoader });
    });
};
exports.getIssuerCallbackV1_0_11 = getIssuerCallbackV1_0_11;
const getIssuerCallbackV1_0_13 = (credential, credentialRequest, keyPair, verificationMethod) => {
    if (!credential) {
        throw new Error('A credential needs to be provided');
    }
    return (_opts) => __awaiter(void 0, void 0, void 0, function* () {
        const documentLoader = (0, security_document_loader_1.securityLoader)().build();
        const verificationKey = Array.from(keyPair.values())[0];
        const keys = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(Object.assign({}, verificationKey));
        const suite = new ed25519_signature_2020_1.Ed25519Signature2020({ key: keys });
        suite.verificationMethod = verificationMethod;
        return yield vc_1.default.issue({ credential, suite, documentLoader });
    });
};
exports.getIssuerCallbackV1_0_13 = getIssuerCallbackV1_0_13;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const verifyCredential = (credential, keyPair, verificationMethod) => __awaiter(void 0, void 0, void 0, function* () {
    const documentLoader = (0, security_document_loader_1.securityLoader)().build();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const verificationKey = Array.from(keyPair.values())[0];
    const keys = yield ed25519_verification_key_2020_1.Ed25519VerificationKey2020.from(Object.assign({}, verificationKey));
    const suite = new ed25519_signature_2020_1.Ed25519Signature2020({ key: keys });
    suite.verificationMethod = verificationMethod;
    return yield vc_1.default.verifyCredential({ credential, suite, documentLoader });
});
exports.verifyCredential = verifyCredential;
//# sourceMappingURL=IssuerCallback.js.map