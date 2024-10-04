"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVerifyRequestOptsFromBuilderOrExistingOpts = exports.createResponseOptsFromBuilderOrExistingOpts = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const helpers_1 = require("../helpers");
const schemas_1 = require("../schemas");
const types_1 = require("../types");
const createResponseOptsFromBuilderOrExistingOpts = (opts) => {
    let responseOpts;
    if (opts.builder) {
        responseOpts = Object.assign({ registration: Object.assign({ issuer: opts.builder.issuer }, opts.builder.responseRegistration), expiresIn: opts.builder.expiresIn, jwtIssuer: responseOpts === null || responseOpts === void 0 ? void 0 : responseOpts.jwtIssuer, createJwtCallback: opts.builder.createJwtCallback, responseMode: opts.builder.responseMode }, ((responseOpts === null || responseOpts === void 0 ? void 0 : responseOpts.version)
            ? { version: responseOpts.version }
            : Array.isArray(opts.builder.supportedVersions) && opts.builder.supportedVersions.length > 0
                ? { version: opts.builder.supportedVersions[0] }
                : {}));
        if (!responseOpts.registration.passBy) {
            responseOpts.registration.passBy = types_1.PassBy.VALUE;
        }
        const languageTagEnabledFieldsNames = ['clientName', 'clientPurpose'];
        const languageTaggedFields = helpers_1.LanguageTagUtils.getLanguageTaggedProperties(opts.builder.responseRegistration, languageTagEnabledFieldsNames);
        languageTaggedFields.forEach((value, key) => {
            responseOpts.registration[key] = value;
        });
    }
    else {
        responseOpts = Object.assign({}, opts.responseOpts);
    }
    const valid = (0, schemas_1.AuthorizationResponseOptsSchema)(responseOpts);
    if (!valid) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        throw new Error('OP builder validation error: ' + JSON.stringify(schemas_1.AuthorizationResponseOptsSchema.errors));
    }
    return responseOpts;
};
exports.createResponseOptsFromBuilderOrExistingOpts = createResponseOptsFromBuilderOrExistingOpts;
const createVerifyRequestOptsFromBuilderOrExistingOpts = (opts) => {
    var _a;
    return opts.builder
        ? {
            verifyJwtCallback: opts.builder.verifyJwtCallback,
            hasher: (_a = opts.builder.hasher) !== null && _a !== void 0 ? _a : oid4vc_common_1.defaultHasher,
            verification: {},
            supportedVersions: opts.builder.supportedVersions,
            correlationId: undefined,
        }
        : opts.verifyOpts;
};
exports.createVerifyRequestOptsFromBuilderOrExistingOpts = createVerifyRequestOptsFromBuilderOrExistingOpts;
//# sourceMappingURL=Opts.js.map