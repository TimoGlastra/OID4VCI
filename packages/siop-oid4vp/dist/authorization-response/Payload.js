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
exports.mergeOAuth2AndOpenIdInRequestPayload = exports.createResponsePayload = void 0;
const id_token_1 = require("../id-token");
const request_object_1 = require("../request-object");
const types_1 = require("../types");
const OpenID4VP_1 = require("./OpenID4VP");
const Opts_1 = require("./Opts");
const createResponsePayload = (authorizationRequest, responseOpts, idTokenPayload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, Opts_1.assertValidResponseOpts)(responseOpts);
    if (!authorizationRequest) {
        throw new Error(types_1.SIOPErrors.NO_REQUEST);
    }
    // If state was in request, it must be in response
    const state = yield authorizationRequest.getMergedProperty('state');
    const responsePayload = Object.assign(Object.assign(Object.assign(Object.assign({}, (responseOpts.accessToken && { access_token: responseOpts.accessToken, expires_in: responseOpts.expiresIn || 3600 })), (responseOpts.tokenType && { token_type: responseOpts.tokenType })), (responseOpts.refreshToken && { refresh_token: responseOpts.refreshToken })), { state });
    // vp tokens
    yield (0, OpenID4VP_1.putPresentationSubmissionInLocation)(authorizationRequest, responsePayload, responseOpts, idTokenPayload);
    if (idTokenPayload) {
        const idToken = yield id_token_1.IDToken.fromIDTokenPayload(idTokenPayload, responseOpts);
        responsePayload.id_token = yield idToken.jwt(responseOpts.jwtIssuer);
    }
    return responsePayload;
});
exports.createResponsePayload = createResponsePayload;
/**
 * Properties can be in oAUth2 and OpenID (JWT) style. If they are in both the OpenID prop takes precedence as they are signed.
 * @param payload
 * @param requestObject
 */
const mergeOAuth2AndOpenIdInRequestPayload = (payload, requestObject) => __awaiter(void 0, void 0, void 0, function* () {
    const payloadCopy = JSON.parse(JSON.stringify(payload));
    const requestObj = requestObject ? requestObject : yield request_object_1.RequestObject.fromAuthorizationRequestPayload(payload);
    if (!requestObj) {
        return payloadCopy;
    }
    const requestObjectPayload = yield requestObj.getPayload();
    return Object.assign(Object.assign({}, payloadCopy), requestObjectPayload);
});
exports.mergeOAuth2AndOpenIdInRequestPayload = mergeOAuth2AndOpenIdInRequestPayload;
//# sourceMappingURL=Payload.js.map