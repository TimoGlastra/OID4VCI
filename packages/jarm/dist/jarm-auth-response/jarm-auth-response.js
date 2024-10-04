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
exports.jarmAuthResponseDirectPostJwtValidate = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const v = __importStar(require("valibot"));
const v_jarm_auth_response_params_js_1 = require("./v-jarm-auth-response-params.js");
const v_jarm_direct_post_jwt_auth_response_params_js_1 = require("./v-jarm-direct-post-jwt-auth-response-params.js");
const parseJarmAuthResponseParams = (schema, responseParams) => {
    if (v.is(v_jarm_auth_response_params_js_1.vJarmAuthResponseErrorParams, responseParams)) {
        const errorResponseJson = JSON.stringify(responseParams, undefined, 2);
        throw new Error(`Received error response from authorization server. '${errorResponseJson}'`);
    }
    return v.parse(schema, responseParams);
};
const decryptJarmAuthResponse = (input, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { response } = input;
    const responseProtectedHeader = (0, oid4vc_common_1.decodeProtectedHeader)(response);
    if (!responseProtectedHeader.kid) {
        throw new Error(`Jarm JWE is missing the protected header field 'kid'.`);
    }
    const { plaintext } = yield ctx.jwe.decryptCompact({
        jwe: response,
        jwk: { kid: responseProtectedHeader.kid },
    });
    return plaintext;
});
/**
 * Validate a JARM direct_post.jwt compliant authentication response
 * * The decryption key should be resolvable using the the protected header's 'kid' field
 * * The signature verification jwk should be resolvable using the jws protected header's 'kid' field and the payload's 'iss' field.
 */
const jarmAuthResponseDirectPostJwtValidate = (input, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { response } = input;
    const responseIsEncrypted = (0, oid4vc_common_1.isJwe)(response);
    const decryptedResponse = responseIsEncrypted ? yield decryptJarmAuthResponse(input, ctx) : response;
    const responseIsSigned = (0, oid4vc_common_1.isJws)(decryptedResponse);
    if (!responseIsEncrypted && !responseIsSigned) {
        throw new Error('Jarm Auth Response must be either encrypted, signed, or signed and encrypted.');
    }
    let authResponseParams;
    let authRequestParams;
    if (responseIsSigned) {
        throw new Error('Signed JARM responses are not supported.');
        //const jwsProtectedHeader = decodeProtectedHeader(decryptedResponse);
        //const jwsPayload = decodeJwt(decryptedResponse);
        //const schema = v.required(vJarmDirectPostJwtParams, ['iss', 'aud', 'exp']);
        //const responseParams = parseJarmAuthResponseParams(schema, jwsPayload);
        //({ authRequestParams } = await ctx.openid4vp.authRequest.getParams(responseParams));
        //if (!jwsProtectedHeader.kid) {
        //throw new Error(`Jarm JWS is missing the protected header field 'kid'.`);
        //}
        //await ctx.jose.jws.verifyJwt({
        //jws: decryptedResponse,
        //jwk: { kid: jwsProtectedHeader.kid, kty: 'auto' },
        //});
        //authResponseParams = responseParams;
    }
    else {
        const jsonResponse = JSON.parse(decryptedResponse);
        authResponseParams = parseJarmAuthResponseParams(v_jarm_direct_post_jwt_auth_response_params_js_1.vJarmDirectPostJwtParams, jsonResponse);
        ({ authRequestParams } = yield ctx.openid4vp.authRequest.getParams(authResponseParams));
    }
    (0, v_jarm_direct_post_jwt_auth_response_params_js_1.jarmAuthResponseDirectPostValidateParams)({
        authRequestParams,
        authResponseParams,
    });
    let type;
    if (responseIsSigned && responseIsEncrypted)
        type = 'signed encrypted';
    else if (responseIsEncrypted)
        type = 'encrypted';
    else
        type = 'signed';
    return {
        authRequestParams,
        authResponseParams,
        type,
    };
});
exports.jarmAuthResponseDirectPostJwtValidate = jarmAuthResponseDirectPostJwtValidate;
//# sourceMappingURL=jarm-auth-response.js.map