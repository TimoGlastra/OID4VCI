"use strict";
/**
 * Experimental support not following the VCI spec to have the holder actually (re)sign the issued credential and return it to the issuer
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPERIMENTAL_SUBJECT_PROOF_MODE_ENABLED = void 0;
exports.EXPERIMENTAL_SUBJECT_PROOF_MODE_ENABLED = ((_a = process.env.EXPERIMENTAL_SUBJECT_PROOF_MODE) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) === 'true';
//# sourceMappingURL=holder-vci.js.map