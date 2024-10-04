"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createState = exports.getState = exports.toNonce = exports.getNonce = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const Encodings_1 = require("./Encodings");
function getNonce(state, nonce) {
    return nonce || toNonce(state);
}
exports.getNonce = getNonce;
function toNonce(input) {
    const buff = (0, oid4vc_common_1.defaultHasher)(input, 'sha256');
    return (0, Encodings_1.base64urlEncodeBuffer)(buff);
}
exports.toNonce = toNonce;
function getState(state) {
    return state || createState();
}
exports.getState = getState;
function createState() {
    return (0, oid4vc_common_1.uuidv4)();
}
exports.createState = createState;
//# sourceMappingURL=State.js.map