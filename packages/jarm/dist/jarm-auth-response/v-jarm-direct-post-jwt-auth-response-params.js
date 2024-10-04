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
exports.jarmAuthResponseDirectPostValidateParams = exports.vJarmDirectPostJwtParams = void 0;
const v = __importStar(require("valibot"));
const v_jarm_auth_response_params_js_1 = require("./v-jarm-auth-response-params.js");
exports.vJarmDirectPostJwtParams = v.looseObject(Object.assign(Object.assign(Object.assign({}, v.omit(v_jarm_auth_response_params_js_1.vJarmAuthResponseParams, ['iss', 'aud', 'exp']).entries), v.partial(v.pick(v_jarm_auth_response_params_js_1.vJarmAuthResponseParams, ['iss', 'aud', 'exp'])).entries), { vp_token: v.string(), presentation_submission: v.unknown(), nonce: v.optional(v.string()) }));
const jarmAuthResponseDirectPostValidateParams = (input) => {
    const { authRequestParams, authResponseParams } = input;
    // 2. The client obtains the state parameter from the JWT and checks its binding to the user agent. If the check fails, the client MUST abort processing and refuse the response.
    if (authRequestParams.state !== authResponseParams.state) {
        throw new Error(`State missmatch between auth request '${authRequestParams.state}' and the jarm-auth-response.`);
    }
};
exports.jarmAuthResponseDirectPostValidateParams = jarmAuthResponseDirectPostValidateParams;
//# sourceMappingURL=v-jarm-direct-post-jwt-auth-response-params.js.map