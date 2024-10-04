"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIDTokenPayload = void 0;
const authorization_response_1 = require("../authorization-response");
const Opts_1 = require("../authorization-response/Opts");
const SIOPSpecVersion_1 = require("../helpers/SIOPSpecVersion");
const types_1 = require("../types");
const createIDTokenPayload = (verifiedAuthorizationRequest, responseOpts) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    yield (0, Opts_1.assertValidResponseOpts)(responseOpts);
    const authorizationRequestPayload = yield verifiedAuthorizationRequest.authorizationRequest.mergedPayloads();
    const requestObject = verifiedAuthorizationRequest.requestObject;
    if (!authorizationRequestPayload) {
        throw new Error(types_1.SIOPErrors.VERIFY_BAD_PARAMS);
    }
    const payload = yield (0, authorization_response_1.mergeOAuth2AndOpenIdInRequestPayload)(authorizationRequestPayload, requestObject);
    const state = payload.state;
    const nonce = payload.nonce;
    const SEC_IN_MS = 1000;
    const rpSupportedVersions = (0, SIOPSpecVersion_1.authorizationRequestVersionDiscovery)(payload);
    const maxRPVersion = rpSupportedVersions.reduce((previous, current) => (current.valueOf() > previous.valueOf() ? current : previous), types_1.SupportedVersion.SIOPv2_D12_OID4VP_D18);
    if (responseOpts.version && rpSupportedVersions.length > 0 && !rpSupportedVersions.includes(responseOpts.version)) {
        throw Error(`RP does not support spec version ${responseOpts.version}, supported versions: ${rpSupportedVersions.toString()}`);
    }
    const opVersion = (_a = responseOpts.version) !== null && _a !== void 0 ? _a : maxRPVersion;
    const idToken = Object.assign(Object.assign({ 
        // fixme: ID11 does not use this static value anymore
        iss: (_c = (_b = responseOpts === null || responseOpts === void 0 ? void 0 : responseOpts.registration) === null || _b === void 0 ? void 0 : _b.issuer) !== null && _c !== void 0 ? _c : (opVersion === types_1.SupportedVersion.JWT_VC_PRESENTATION_PROFILE_v1 ? types_1.ResponseIss.JWT_VC_PRESENTATION_V1 : types_1.ResponseIss.SELF_ISSUED_V2), aud: responseOpts.audience || payload.client_id, iat: Math.round(Date.now() / SEC_IN_MS - 60 * SEC_IN_MS), exp: Math.round(Date.now() / SEC_IN_MS + (responseOpts.expiresIn || 600)) }, (payload.auth_time && { auth_time: payload.auth_time })), { nonce,
        state });
    return idToken;
});
exports.createIDTokenPayload = createIDTokenPayload;
//# sourceMappingURL=Payload.js.map