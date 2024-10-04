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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHasher = exports.uuidv4 = exports.VCI_LOG_COMMON = exports.VCI_LOGGERS = void 0;
const ssi_types_1 = require("@sphereon/ssi-types");
exports.VCI_LOGGERS = ssi_types_1.Loggers.DEFAULT;
exports.VCI_LOG_COMMON = exports.VCI_LOGGERS.get('sphereon:oid4vci:common');
__exportStar(require("./jwt"), exports);
__exportStar(require("./dpop"), exports);
var uuid_1 = require("uuid");
Object.defineProperty(exports, "uuidv4", { enumerable: true, get: function () { return uuid_1.v4; } });
var hasher_1 = require("./hasher");
Object.defineProperty(exports, "defaultHasher", { enumerable: true, get: function () { return hasher_1.defaultHasher; } });
//# sourceMappingURL=index.js.map