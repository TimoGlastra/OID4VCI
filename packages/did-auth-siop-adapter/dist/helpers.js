"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuppliedSignature = exports.isExternalSignature = exports.isInternalSignature = void 0;
const isInternalSignature = (object) => 'hexPrivateKey' in object && 'did' in object;
exports.isInternalSignature = isInternalSignature;
const isExternalSignature = (object) => 'signatureUri' in object && 'did' in object;
exports.isExternalSignature = isExternalSignature;
const isSuppliedSignature = (object) => 'signature' in object;
exports.isSuppliedSignature = isSuppliedSignature;
//# sourceMappingURL=helpers.js.map