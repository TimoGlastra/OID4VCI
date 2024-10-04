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
exports.OP = void 0;
const jarm_1 = require("@sphereon/jarm");
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const authorization_request_1 = require("../authorization-request");
const Opts_1 = require("../authorization-request/Opts");
const authorization_response_1 = require("../authorization-response");
const helpers_1 = require("../helpers");
const SIOPSpecVersion_1 = require("../helpers/SIOPSpecVersion");
const extract_jwks_1 = require("../helpers/extract-jwks");
const types_1 = require("../types");
const OPBuilder_1 = require("./OPBuilder");
const Opts_2 = require("./Opts");
// The OP publishes the formats it supports using the vp_formats_supported metadata parameter as defined above in its "openid-configuration".
class OP {
    constructor(opts) {
        var _a;
        this._createResponseOptions = Object.assign({}, (0, Opts_2.createResponseOptsFromBuilderOrExistingOpts)(opts));
        this._verifyRequestOptions = Object.assign({}, (0, Opts_2.createVerifyRequestOptsFromBuilderOrExistingOpts)(opts));
        this._eventEmitter = (_a = opts.builder) === null || _a === void 0 ? void 0 : _a.eventEmitter;
    }
    /**
     * This method tries to infer the SIOP specs version based on the request payload.
     * If the version cannot be inferred or is not supported it throws an exception.
     * This method needs to be called to ensure the OP can handle the request
     * @param requestJwtOrUri
     * @param requestOpts
     */
    verifyAuthorizationRequest(requestJwtOrUri, requestOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            const correlationId = (requestOpts === null || requestOpts === void 0 ? void 0 : requestOpts.correlationId) || (0, oid4vc_common_1.uuidv4)();
            const authorizationRequest = yield authorization_request_1.AuthorizationRequest.fromUriOrJwt(requestJwtOrUri)
                .then((result) => {
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_REQUEST_RECEIVED_SUCCESS, { correlationId, subject: result });
                return result;
            })
                .catch((error) => {
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_REQUEST_RECEIVED_FAILED, {
                    correlationId,
                    subject: requestJwtOrUri,
                    error,
                });
                throw error;
            });
            return authorizationRequest
                .verify(this.newVerifyAuthorizationRequestOpts(Object.assign(Object.assign({}, requestOpts), { correlationId })))
                .then((verifiedAuthorizationRequest) => {
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_REQUEST_VERIFIED_SUCCESS, {
                    correlationId,
                    subject: verifiedAuthorizationRequest.authorizationRequest,
                });
                return verifiedAuthorizationRequest;
            })
                .catch((error) => {
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_REQUEST_VERIFIED_FAILED, {
                    correlationId,
                    subject: authorizationRequest,
                    error,
                });
                throw error;
            });
        });
    }
    createAuthorizationResponse(verifiedAuthorizationRequest, responseOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (verifiedAuthorizationRequest.correlationId &&
                (responseOpts === null || responseOpts === void 0 ? void 0 : responseOpts.correlationId) &&
                verifiedAuthorizationRequest.correlationId !== responseOpts.correlationId) {
                throw new Error(`Request correlation id ${verifiedAuthorizationRequest.correlationId} is different from option correlation id ${responseOpts.correlationId}`);
            }
            let version = responseOpts === null || responseOpts === void 0 ? void 0 : responseOpts.version;
            const rpSupportedVersions = (0, SIOPSpecVersion_1.authorizationRequestVersionDiscovery)(yield verifiedAuthorizationRequest.authorizationRequest.mergedPayloads());
            if (version && rpSupportedVersions.length > 0 && !rpSupportedVersions.includes(version)) {
                throw Error(`RP does not support spec version ${version}, supported versions: ${rpSupportedVersions.toString()}`);
            }
            else if (!version) {
                version = rpSupportedVersions.reduce((previous, current) => (current.valueOf() > previous.valueOf() ? current : previous), types_1.SupportedVersion.SIOPv2_ID1);
            }
            const correlationId = (_b = (_a = responseOpts === null || responseOpts === void 0 ? void 0 : responseOpts.correlationId) !== null && _a !== void 0 ? _a : verifiedAuthorizationRequest.correlationId) !== null && _b !== void 0 ? _b : (0, oid4vc_common_1.uuidv4)();
            try {
                // IF using DIRECT_POST, the response_uri takes precedence over the redirect_uri
                let responseUri = verifiedAuthorizationRequest.responseURI;
                if (((_c = verifiedAuthorizationRequest.payload) === null || _c === void 0 ? void 0 : _c.response_mode) === types_1.ResponseMode.DIRECT_POST) {
                    responseUri = (_d = verifiedAuthorizationRequest.authorizationRequestPayload.response_uri) !== null && _d !== void 0 ? _d : responseUri;
                }
                const response = yield authorization_response_1.AuthorizationResponse.fromVerifiedAuthorizationRequest(verifiedAuthorizationRequest, this.newAuthorizationResponseOpts(Object.assign(Object.assign({}, responseOpts), { version,
                    correlationId })), verifiedAuthorizationRequest.verifyOpts);
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_RESPONSE_CREATE_SUCCESS, {
                    correlationId,
                    subject: response,
                });
                return { correlationId, response, responseURI: responseUri };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (error) {
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_RESPONSE_CREATE_FAILED, {
                    correlationId,
                    subject: verifiedAuthorizationRequest.authorizationRequest,
                    error,
                });
                throw error;
            }
        });
    }
    static extractEncJwksFromClientMetadata(clientMetadata) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Currently no mechanisms are in place to deal with multiple 'enc' keys in the client metadata.
            // TODO: Maybe we should return all 'enc' keys in the client metadata. In addition the JWKS from the jwks_uri are not fetched if jwks are present.
            // TODO: Is that the expected behavior?
            const jwks = yield (0, extract_jwks_1.extractJwksFromJwksMetadata)(clientMetadata);
            const encryptionJwk = jwks === null || jwks === void 0 ? void 0 : jwks.keys.find((key) => key.use === 'enc');
            if (!encryptionJwk) {
                throw new Error('No encryption jwk could be extracted from the client metadata.');
            }
            return encryptionJwk;
        });
    }
    // TODO SK Can you please put some documentation on it?
    submitAuthorizationResponse(authorizationResponse, createJarmResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const { correlationId, response } = authorizationResponse;
            if (!correlationId) {
                throw Error('No correlation Id provided');
            }
            const isJarmResponseMode = (responseMode) => {
                return responseMode === types_1.ResponseMode.DIRECT_POST_JWT || responseMode === types_1.ResponseMode.QUERY_JWT || responseMode === types_1.ResponseMode.FRAGMENT_JWT;
            };
            const requestObjectPayload = yield ((_a = response.authorizationRequest.requestObject) === null || _a === void 0 ? void 0 : _a.getPayload());
            const responseMode = (_b = requestObjectPayload === null || requestObjectPayload === void 0 ? void 0 : requestObjectPayload.response_mode) !== null && _b !== void 0 ? _b : (_c = response.options) === null || _c === void 0 ? void 0 : _c.responseMode;
            if (!response ||
                (((_d = response.options) === null || _d === void 0 ? void 0 : _d.responseMode) &&
                    !(responseMode === types_1.ResponseMode.POST ||
                        responseMode === types_1.ResponseMode.FORM_POST ||
                        responseMode === types_1.ResponseMode.DIRECT_POST ||
                        isJarmResponseMode(responseMode)))) {
                throw new Error(types_1.SIOPErrors.BAD_PARAMS);
            }
            const payload = response.payload;
            const idToken = yield ((_e = response.idToken) === null || _e === void 0 ? void 0 : _e.payload());
            const responseUri = (_f = authorizationResponse.responseURI) !== null && _f !== void 0 ? _f : idToken === null || idToken === void 0 ? void 0 : idToken.aud;
            if (!responseUri) {
                throw Error('No response URI present');
            }
            if (isJarmResponseMode(responseMode)) {
                if (responseMode !== types_1.ResponseMode.DIRECT_POST_JWT) {
                    throw new Error('Only direct_post.jwt response mode is supported for JARM at the moment.');
                }
                let responseType;
                if (idToken && payload.vp_token) {
                    responseType = 'id_token vp_token';
                }
                else if (idToken) {
                    responseType = 'id_token';
                }
                else if (payload.vp_token) {
                    responseType = 'vp_token';
                }
                else {
                    throw new Error('No id_token or vp_token present in the response payload');
                }
                const { response } = yield createJarmResponse({
                    requestObjectPayload,
                    authorizationResponsePayload: payload,
                });
                return (0, jarm_1.jarmAuthResponseSend)({
                    authRequestParams: {
                        response_uri: responseUri,
                        response_mode: responseMode,
                        response_type: responseType,
                    },
                    authResponse: response,
                })
                    .then((result) => {
                    void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_RESPONSE_SENT_SUCCESS, { correlationId, subject: response });
                    return result;
                })
                    .catch((error) => {
                    void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_RESPONSE_SENT_FAILED, { correlationId, subject: response, error });
                    throw error;
                });
            }
            const authResponseAsURI = (0, helpers_1.encodeJsonAsURI)(payload, { arraysWithIndex: ['presentation_submission'] });
            return (0, helpers_1.post)(responseUri, authResponseAsURI, { contentType: types_1.ContentType.FORM_URL_ENCODED, exceptionOnHttpErrorStatus: true })
                .then((result) => {
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_RESPONSE_SENT_SUCCESS, { correlationId, subject: response });
                return result.origResponse;
            })
                .catch((error) => {
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_RESPONSE_SENT_FAILED, { correlationId, subject: response, error });
                throw error;
            });
        });
    }
    /**
     * Create an Authentication Request Payload from a URI string
     *
     * @param encodedUri
     */
    parseAuthorizationRequestURI(encodedUri) {
        return __awaiter(this, void 0, void 0, function* () {
            const { scheme, requestObjectJwt, authorizationRequestPayload, registrationMetadata } = yield authorization_request_1.URI.parseAndResolve(encodedUri);
            return {
                encodedUri,
                encodingFormat: types_1.UrlEncodingFormat.FORM_URL_ENCODED,
                scheme: scheme,
                requestObjectJwt,
                authorizationRequestPayload,
                registration: registrationMetadata,
            };
        });
    }
    newAuthorizationResponseOpts(opts) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const version = (_a = opts.version) !== null && _a !== void 0 ? _a : this._createResponseOptions.version;
        let issuer = (_b = opts.issuer) !== null && _b !== void 0 ? _b : (_d = (_c = this._createResponseOptions) === null || _c === void 0 ? void 0 : _c.registration) === null || _d === void 0 ? void 0 : _d.issuer;
        if (version === types_1.SupportedVersion.JWT_VC_PRESENTATION_PROFILE_v1) {
            issuer = types_1.ResponseIss.JWT_VC_PRESENTATION_V1;
        }
        else if (version === types_1.SupportedVersion.SIOPv2_ID1) {
            issuer = types_1.ResponseIss.SELF_ISSUED_V2;
        }
        if (!issuer) {
            throw Error(`No issuer value present. Either use IDv1, JWT VC Presentation profile version, or provide a DID as issuer value`);
        }
        // We are taking the whole presentationExchange object from a certain location
        const presentationExchange = (_e = opts.presentationExchange) !== null && _e !== void 0 ? _e : this._createResponseOptions.presentationExchange;
        const responseURI = (_f = opts.audience) !== null && _f !== void 0 ? _f : this._createResponseOptions.responseURI;
        return Object.assign(Object.assign(Object.assign(Object.assign({}, this._createResponseOptions), opts), (presentationExchange && { presentationExchange })), { registration: Object.assign(Object.assign({}, (_g = this._createResponseOptions) === null || _g === void 0 ? void 0 : _g.registration), { issuer }), responseURI, responseURIType: (_h = this._createResponseOptions.responseURIType) !== null && _h !== void 0 ? _h : (version < types_1.SupportedVersion.SIOPv2_D12_OID4VP_D18 && responseURI ? 'redirect_uri' : undefined) });
    }
    newVerifyAuthorizationRequestOpts(requestOpts) {
        const verification = Object.assign(Object.assign(Object.assign(Object.assign({}, this._verifyRequestOptions), { verifyJwtCallback: this._verifyRequestOptions.verifyJwtCallback }), requestOpts), { verification: (0, Opts_1.mergeVerificationOpts)(this._verifyRequestOptions, requestOpts), correlationId: requestOpts.correlationId });
        return verification;
    }
    emitEvent(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._eventEmitter) {
                this._eventEmitter.emit(type, new types_1.AuthorizationEvent(payload));
            }
        });
    }
    addEventListener(register) {
        if (!this._eventEmitter) {
            throw Error('Cannot add listeners if no event emitter is available');
        }
        const events = Array.isArray(register.event) ? register.event : [register.event];
        for (const event of events) {
            this._eventEmitter.addListener(event, register.listener);
        }
    }
    static fromOpts(responseOpts, verifyOpts) {
        return new OP({ responseOpts, verifyOpts });
    }
    static builder() {
        return new OPBuilder_1.OPBuilder();
    }
    get createResponseOptions() {
        return this._createResponseOptions;
    }
    get verifyRequestOptions() {
        return this._verifyRequestOptions;
    }
    static validateJarmMetadata(input) {
        return (0, jarm_1.jarmMetadataValidate)(input);
    }
}
exports.OP = OP;
//# sourceMappingURL=OP.js.map