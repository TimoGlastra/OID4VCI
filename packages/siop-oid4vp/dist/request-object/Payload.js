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
exports.assertValidRequestObjectPayload = exports.createRequestObjectPayload = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const authorization_request_1 = require("../authorization-request");
const RequestRegistration_1 = require("../authorization-request/RequestRegistration");
const helpers_1 = require("../helpers");
const types_1 = require("../types");
const Opts_1 = require("./Opts");
const createRequestObjectPayload = (opts) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    (0, Opts_1.assertValidRequestObjectOpts)(opts.requestObject, false);
    if (!((_a = opts.requestObject) === null || _a === void 0 ? void 0 : _a.payload)) {
        return undefined; // No request object apparently
    }
    (0, Opts_1.assertValidRequestObjectOpts)(opts.requestObject, true);
    const payload = opts.requestObject.payload;
    const state = (0, helpers_1.getState)(payload.state);
    const registration = yield (0, RequestRegistration_1.createRequestRegistration)(opts.clientMetadata, opts);
    const claims = (0, authorization_request_1.createPresentationDefinitionClaimsProperties)(payload.claims);
    const metadataKey = opts.version >= types_1.SupportedVersion.SIOPv2_D11.valueOf() ? 'client_metadata' : 'registration';
    const clientId = (_b = payload.client_id) !== null && _b !== void 0 ? _b : (_c = registration.payload[metadataKey]) === null || _c === void 0 ? void 0 : _c.client_id;
    const now = Math.round(new Date().getTime() / 1000);
    const validInSec = 120; // todo config/option
    const iat = (_d = payload.iat) !== null && _d !== void 0 ? _d : now;
    const nbf = (_e = payload.nbf) !== null && _e !== void 0 ? _e : iat;
    const exp = (_f = payload.exp) !== null && _f !== void 0 ? _f : iat + validInSec;
    const aud = payload.aud;
    const jti = (_g = payload.jti) !== null && _g !== void 0 ? _g : (0, oid4vc_common_1.uuidv4)();
    return (0, helpers_1.removeNullUndefined)(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ response_type: (_h = payload.response_type) !== null && _h !== void 0 ? _h : types_1.ResponseType.ID_TOKEN, scope: payload.scope, 
        //TODO implement /.well-known/openid-federation support in the OP side to resolve the client_id (URL) and retrieve the metadata
        client_id: clientId, client_id_scheme: payload.client_id_scheme }, (payload.redirect_uri && { redirect_uri: payload.redirect_uri })), (payload.response_uri && { response_uri: payload.response_uri })), { response_mode: (_j = payload.response_mode) !== null && _j !== void 0 ? _j : types_1.ResponseMode.DIRECT_POST }), (payload.id_token_hint && { id_token_hint: payload.id_token_hint })), { registration_uri: registration.clientMetadataOpts.reference_uri, nonce: (0, helpers_1.getNonce)(state, payload.nonce), state }), registration.payload), { claims, presentation_definition_uri: payload.presentation_definition_uri, presentation_definition: payload.presentation_definition, client_metadata: payload.client_metadata, iat,
        nbf,
        exp,
        jti,
        aud }), ((_k = opts.additionalPayloadClaims) !== null && _k !== void 0 ? _k : {})));
});
exports.createRequestObjectPayload = createRequestObjectPayload;
const assertValidRequestObjectPayload = (verPayload) => {
    if (verPayload['registration_uri'] && verPayload['registration']) {
        throw new Error(`${types_1.SIOPErrors.REG_OBJ_N_REG_URI_CANT_BE_SET_SIMULTANEOUSLY}`);
    }
};
exports.assertValidRequestObjectPayload = assertValidRequestObjectPayload;
//# sourceMappingURL=Payload.js.map