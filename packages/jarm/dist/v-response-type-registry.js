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
exports.vResponseType = exports.vTransformedResponseTypes = exports.openid4vpResponseTypes = exports.oAuthMRTEPResponseTypes = exports.oAuthResponseTypes = void 0;
const v = __importStar(require("valibot"));
exports.oAuthResponseTypes = v.picklist(['code', 'token']);
// NOTE: MAKE SURE THAT THE RESPONSE TYPES ARE SORTED CORRECTLY
exports.oAuthMRTEPResponseTypes = v.picklist(['none', 'id_token', 'code token', 'code id_token', 'id_token token', 'code id_token token']);
exports.openid4vpResponseTypes = v.picklist(['vp_token', 'id_token vp_token']);
exports.vTransformedResponseTypes = v.picklist([
    ...exports.openid4vpResponseTypes.options,
    ...exports.oAuthResponseTypes.options,
    ...exports.oAuthMRTEPResponseTypes.options,
]);
exports.vResponseType = v.pipe(v.string(), v.transform((val) => val.split(' ').sort().join(' ')), exports.vTransformedResponseTypes);
//# sourceMappingURL=v-response-type-registry.js.map