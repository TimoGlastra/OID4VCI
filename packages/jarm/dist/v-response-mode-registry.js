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
exports.validateResponseMode = exports.getJarmDefaultResponseMode = exports.getDefaultResponseMode = exports.vResponseMode = exports.vOpenid4vpJarmResponseMode = exports.vOpenid4vpResponseMode = exports.vJarmResponseMode = void 0;
const v = __importStar(require("valibot"));
exports.vJarmResponseMode = v.picklist(['jwt', 'query.jwt', 'fragment.jwt', 'form_post.jwt']);
exports.vOpenid4vpResponseMode = v.picklist(['direct_post']);
/**
 *  * 'direct_post.jwt' The response is send as HTTP POST request using the application/x-www-form-urlencoded content type. The body contains a single parameter response which is the JWT encoded Response as defined in JARM 4.1
 */
exports.vOpenid4vpJarmResponseMode = v.picklist(['direct_post.jwt']);
/**
 *  The use of this parameter is NOT RECOMMENDED when the Response Mode that would be requested is the default mode specified for the Response Type.
 *  * 'query' In this mode, Authorization Response parameters are encoded in the query string added to the redirect_uri when redirecting back to the Client.
 *  * 'fragment' In this mode, Authorization Response parameters are encoded in the fragment added to the redirect_uri when redirecting back to the Client.
 *  * 'direct_post' the Authorization Response is send to an endpoint controlled by the Verifier via an HTTP POST request.
 */
exports.vResponseMode = v.pipe(v.picklist(['query', 'fragment', ...exports.vOpenid4vpResponseMode.options, ...exports.vJarmResponseMode.options, ...exports.vOpenid4vpJarmResponseMode.options]), v.description('Informs the Authorization Server of the mechanism to be used for returning parameters from the Authorization Endpoint.'));
const getDisAllowedResponseModes = (input) => {
    const { response_type } = input;
    switch (response_type) {
        case 'code token':
            return ['query'];
        case 'code id_token':
            return ['query'];
        case 'id_token token':
            return ['query'];
        case 'code id_token token':
            return ['query'];
    }
    return undefined;
};
const getDefaultResponseMode = (input) => {
    const { response_type } = input;
    switch (response_type) {
        case 'code':
        case 'none':
            return 'query';
        case 'token':
        case 'id_token':
        case 'code token':
        case 'code id_token':
        case 'id_token token':
        case 'code id_token token':
        case 'vp_token':
        case 'id_token vp_token':
            return 'fragment';
    }
};
exports.getDefaultResponseMode = getDefaultResponseMode;
const getJarmDefaultResponseMode = (input) => {
    const responseMode = (0, exports.getDefaultResponseMode)(input);
    switch (responseMode) {
        case 'query':
            return 'query.jwt';
        case 'fragment':
            return 'fragment.jwt';
    }
};
exports.getJarmDefaultResponseMode = getJarmDefaultResponseMode;
const validateResponseMode = (input) => {
    const disallowedResponseModes = getDisAllowedResponseModes(input);
    if (disallowedResponseModes === null || disallowedResponseModes === void 0 ? void 0 : disallowedResponseModes.includes(input.response_mode)) {
        throw new Error(`Response_type '${input.response_type}' is not compatible with response_mode '${input.response_mode}'.`);
    }
};
exports.validateResponseMode = validateResponseMode;
//# sourceMappingURL=v-response-mode-registry.js.map