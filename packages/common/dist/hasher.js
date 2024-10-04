"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHasher = void 0;
const sha_js_1 = __importDefault(require("sha.js"));
const supportedAlgorithms = ['sha256', 'sha384', 'sha512'];
const defaultHasher = (data, algorithm) => {
    const sanitizedAlgorithm = algorithm.toLowerCase().replace(/[-_]/g, '');
    if (!supportedAlgorithms.includes(sanitizedAlgorithm)) {
        throw new Error(`Unsupported hashing algorithm ${algorithm}`);
    }
    return new Uint8Array((0, sha_js_1.default)(sanitizedAlgorithm)
        .update(data)
        .digest());
};
exports.defaultHasher = defaultHasher;
//# sourceMappingURL=hasher.js.map