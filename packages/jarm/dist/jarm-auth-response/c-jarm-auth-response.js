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
exports.vOAuthAuthRequestGetParamsOut = exports.vAuthRequestParams = void 0;
const v = __importStar(require("valibot"));
const v_response_mode_registry_js_1 = require("../v-response-mode-registry.js");
const v_response_type_registry_js_1 = require("../v-response-type-registry.js");
exports.vAuthRequestParams = v.looseObject({
    state: v.optional(v.string()),
    response_mode: v.optional(v.union([v_response_mode_registry_js_1.vJarmResponseMode, v_response_mode_registry_js_1.vOpenid4vpJarmResponseMode])),
    client_id: v.string(),
    response_type: v_response_type_registry_js_1.vResponseType,
    client_metadata: v.looseObject({
        jwks: v.optional(v.object({
            keys: v.array(v.looseObject({ kid: v.optional(v.string()), kty: v.string() })),
        })),
        jwks_uri: v.optional(v.string()),
    }),
});
exports.vOAuthAuthRequestGetParamsOut = v.object({
    authRequestParams: exports.vAuthRequestParams,
});
//# sourceMappingURL=c-jarm-auth-response.js.map