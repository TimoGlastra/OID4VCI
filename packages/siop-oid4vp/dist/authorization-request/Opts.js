"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeVerificationOpts = exports.assertValidAuthorizationRequestOpts = exports.assertValidVerifyAuthorizationRequestOpts = void 0;
const Opts_1 = require("../request-object/Opts");
const types_1 = require("../types");
const RequestRegistration_1 = require("./RequestRegistration");
const assertValidVerifyAuthorizationRequestOpts = (opts) => {
    if (!opts || !opts.verification || !opts.verifyJwtCallback) {
        throw new Error(types_1.SIOPErrors.VERIFY_BAD_PARAMS);
    }
    if (!opts.correlationId) {
        throw new Error('No correlation id found');
    }
};
exports.assertValidVerifyAuthorizationRequestOpts = assertValidVerifyAuthorizationRequestOpts;
const assertValidAuthorizationRequestOpts = (opts) => {
    var _a;
    if (!opts || !opts.requestObject || (!opts.payload && !opts.requestObject.payload) || (((_a = opts.payload) === null || _a === void 0 ? void 0 : _a.request_uri) && !opts.requestObject.payload)) {
        throw new Error(types_1.SIOPErrors.BAD_PARAMS);
    }
    (0, Opts_1.assertValidRequestObjectOpts)(opts.requestObject, false);
    (0, RequestRegistration_1.assertValidRequestRegistrationOpts)(opts['registration'] ? opts['registration'] : opts.clientMetadata);
};
exports.assertValidAuthorizationRequestOpts = assertValidAuthorizationRequestOpts;
const mergeVerificationOpts = (classOpts, requestOpts) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const presentationVerificationCallback = (_b = (_a = requestOpts.verification) === null || _a === void 0 ? void 0 : _a.presentationVerificationCallback) !== null && _b !== void 0 ? _b : (_c = classOpts.verification) === null || _c === void 0 ? void 0 : _c.presentationVerificationCallback;
    const replayRegistry = (_e = (_d = requestOpts.verification) === null || _d === void 0 ? void 0 : _d.replayRegistry) !== null && _e !== void 0 ? _e : (_f = classOpts.verification) === null || _f === void 0 ? void 0 : _f.replayRegistry;
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, classOpts.verification), requestOpts.verification), (presentationVerificationCallback && { presentationVerificationCallback })), (replayRegistry && { replayRegistry })), { revocationOpts: Object.assign(Object.assign(Object.assign({}, (_g = classOpts.verification) === null || _g === void 0 ? void 0 : _g.revocationOpts), (_h = requestOpts.verification) === null || _h === void 0 ? void 0 : _h.revocationOpts), { revocationVerificationCallback: (_l = (_k = (_j = requestOpts.verification) === null || _j === void 0 ? void 0 : _j.revocationOpts) === null || _k === void 0 ? void 0 : _k.revocationVerificationCallback) !== null && _l !== void 0 ? _l : (_o = (_m = classOpts === null || classOpts === void 0 ? void 0 : classOpts.verification) === null || _m === void 0 ? void 0 : _m.revocationOpts) === null || _o === void 0 ? void 0 : _o.revocationVerificationCallback }) });
};
exports.mergeVerificationOpts = mergeVerificationOpts;
//# sourceMappingURL=Opts.js.map