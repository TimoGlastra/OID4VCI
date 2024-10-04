"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidVerifyOpts = exports.assertValidResponseOpts = void 0;
const types_1 = require("../types");
const assertValidResponseOpts = (opts) => {
    if (!(opts === null || opts === void 0 ? void 0 : opts.createJwtCallback)) {
        throw new Error(types_1.SIOPErrors.BAD_PARAMS);
    }
};
exports.assertValidResponseOpts = assertValidResponseOpts;
const assertValidVerifyOpts = (opts) => {
    if (!(opts === null || opts === void 0 ? void 0 : opts.verification) || !opts.verifyJwtCallback) {
        throw new Error(types_1.SIOPErrors.VERIFY_BAD_PARAMS);
    }
};
exports.assertValidVerifyOpts = assertValidVerifyOpts;
//# sourceMappingURL=Opts.js.map