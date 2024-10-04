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
exports.validateJarmAuthResponseParams = exports.vJarmAuthResponseParams = exports.vJarmAuthResponseErrorParams = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const v = __importStar(require("valibot"));
exports.vJarmAuthResponseErrorParams = v.looseObject({
    error: v.string(),
    state: v.optional(v.string()),
    error_description: v.pipe(v.optional(v.string()), v.description('Text providing additional information, used to assist the client developer in understanding the error that occurred.')),
    error_uri: v.pipe(v.optional(v.pipe(v.string(), v.url())), v.description('A URI identifying a human-readable web page with information about the error, used to provide the client developer with additional information about the error')),
});
exports.vJarmAuthResponseParams = v.looseObject({
    state: v.optional(v.string()),
    /**
     * The issuer URL of the authorization server that created the response
     */
    iss: v.string(),
    /**
     * Expiration of the JWT
     */
    exp: v.number(),
    /**
     * The client_id of the client the response is intended for
     */
    aud: v.string(),
});
const validateJarmAuthResponseParams = (input) => {
    const { authRequestParams, authResponseParams } = input;
    // 2. The client obtains the state parameter from the JWT and checks its binding to the user agent. If the check fails, the client MUST abort processing and refuse the response.
    if (authRequestParams.state !== authResponseParams.state) {
        throw new Error(`State missmatch in jarm-auth-response. Expected '${authRequestParams.state}' received '${authRequestParams.state}'.`);
    }
    // 4. The client obtains the aud element from the JWT and checks whether it matches the client id the client used to identify itself in the corresponding authorization request. If the check fails, the client MUST abort processing and refuse the response.
    if (authRequestParams.client_id !== authResponseParams.aud) {
        throw new Error(`Invalid audience in jarm-auth-response. Expected '${authRequestParams.client_id}' received '${authResponseParams.aud}'.`);
    }
    // 5. The client checks the JWT's exp element to determine if the JWT is still valid. If the check fails, the client MUST abort processing and refuse the response.
    // 120 seconds clock skew
    if ((0, oid4vc_common_1.checkExp)({ exp: authResponseParams.exp })) {
        throw new Error(`The '${authRequestParams.state}' and the jarm-auth-response.`);
    }
};
exports.validateJarmAuthResponseParams = validateJarmAuthResponseParams;
//# sourceMappingURL=v-jarm-auth-response-params.js.map