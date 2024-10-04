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
exports.jarmMetadataValidate = exports.vJarmMetadataValidateOut = exports.vJarmAuthResponseValidateMetadataInput = void 0;
const v = __importStar(require("valibot"));
const v_jarm_client_metadata_js_1 = require("../metadata/v-jarm-client-metadata.js");
const v_jarm_server_metadata_js_1 = require("../metadata/v-jarm-server-metadata.js");
const utils_js_1 = require("../utils.js");
exports.vJarmAuthResponseValidateMetadataInput = v.object({
    client_metadata: v_jarm_client_metadata_js_1.vJarmClientMetadata,
    server_metadata: v.partial(v_jarm_server_metadata_js_1.vJarmServerMetadata),
});
exports.vJarmMetadataValidateOut = v.variant('type', [
    v.object({
        type: v.literal('signed'),
        client_metadata: v_jarm_client_metadata_js_1.vJarmClientMetadataSign,
    }),
    v.object({
        type: v.literal('encrypted'),
        client_metadata: v_jarm_client_metadata_js_1.vJarmClientMetadataEncrypt,
    }),
    v.object({
        type: v.literal('signed encrypted'),
        client_metadata: v_jarm_client_metadata_js_1.vJarmClientMetadataSignEncrypt,
    }),
]);
const jarmMetadataValidate = (vJarmMetadataValidate) => {
    var _a, _b, _c;
    const { client_metadata, server_metadata } = vJarmMetadataValidate;
    const { authorization_encrypted_response_alg, authorization_encrypted_response_enc, authorization_signed_response_alg } = client_metadata;
    (0, utils_js_1.assertValueSupported)({
        supported: (_a = server_metadata.authorization_signing_alg_values_supported) !== null && _a !== void 0 ? _a : [],
        actual: authorization_signed_response_alg,
        required: !!authorization_signed_response_alg,
        error: new Error('Invalid authorization_signed_response_alg'),
    });
    (0, utils_js_1.assertValueSupported)({
        supported: (_b = server_metadata.authorization_encryption_alg_values_supported) !== null && _b !== void 0 ? _b : [],
        actual: authorization_encrypted_response_alg,
        required: !!authorization_encrypted_response_alg,
        error: new Error('Invalid authorization_encrypted_response_alg'),
    });
    (0, utils_js_1.assertValueSupported)({
        supported: (_c = server_metadata.authorization_encryption_enc_values_supported) !== null && _c !== void 0 ? _c : [],
        actual: authorization_encrypted_response_enc,
        required: !!authorization_encrypted_response_enc,
        error: new Error('Invalid authorization_encrypted_response_enc'),
    });
    if (authorization_signed_response_alg && authorization_encrypted_response_alg && authorization_encrypted_response_enc) {
        return {
            type: 'signed encrypted',
            client_metadata: {
                authorization_signed_response_alg,
                authorization_encrypted_response_alg,
                authorization_encrypted_response_enc,
            },
        };
    }
    else if (authorization_signed_response_alg && !authorization_encrypted_response_alg && !authorization_encrypted_response_enc) {
        return {
            type: 'signed',
            client_metadata: { authorization_signed_response_alg },
        };
    }
    else if (!authorization_signed_response_alg && authorization_encrypted_response_alg && authorization_encrypted_response_enc) {
        return {
            type: 'encrypted',
            client_metadata: { authorization_encrypted_response_alg, authorization_encrypted_response_enc },
        };
    }
    else {
        throw new Error(`Invalid jarm client_metadata combination`);
    }
};
exports.jarmMetadataValidate = jarmMetadataValidate;
//# sourceMappingURL=jarm-validate-metadata.js.map