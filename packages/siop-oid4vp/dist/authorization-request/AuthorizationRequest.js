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
exports.AuthorizationRequest = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const PresentationExchange_1 = require("../authorization-response/PresentationExchange");
const helpers_1 = require("../helpers");
const SIOPSpecVersion_1 = require("../helpers/SIOPSpecVersion");
const request_object_1 = require("../request-object");
const types_1 = require("../types");
const Opts_1 = require("./Opts");
const Payload_1 = require("./Payload");
const URI_1 = require("./URI");
class AuthorizationRequest {
    constructor(payload, requestObject, opts, uri) {
        this._options = opts;
        this._payload = (0, helpers_1.removeNullUndefined)(payload);
        this._requestObject = requestObject;
        this._uri = uri;
    }
    static fromUriOrJwt(jwtOrUri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!jwtOrUri) {
                throw Error(types_1.SIOPErrors.NO_REQUEST);
            }
            return typeof jwtOrUri === 'string' && jwtOrUri.startsWith('ey')
                ? yield AuthorizationRequest.fromJwt(jwtOrUri)
                : yield AuthorizationRequest.fromURI(jwtOrUri);
        });
    }
    static fromPayload(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!payload) {
                throw Error(types_1.SIOPErrors.NO_REQUEST);
            }
            const requestObject = yield request_object_1.RequestObject.fromAuthorizationRequestPayload(payload);
            return new AuthorizationRequest(payload, requestObject);
        });
    }
    static fromOpts(opts, requestObject) {
        return __awaiter(this, void 0, void 0, function* () {
            // todo: response_uri/redirect_uri is not hooked up from opts!
            if (!opts || !opts.requestObject) {
                throw Error(types_1.SIOPErrors.BAD_PARAMS);
            }
            (0, Opts_1.assertValidAuthorizationRequestOpts)(opts);
            const requestObjectArg = opts.requestObject.passBy !== types_1.PassBy.NONE ? (requestObject ? requestObject : yield request_object_1.RequestObject.fromOpts(opts)) : undefined;
            const requestPayload = (opts === null || opts === void 0 ? void 0 : opts.payload) ? yield (0, Payload_1.createAuthorizationRequestPayload)(opts, requestObjectArg) : undefined;
            return new AuthorizationRequest(requestPayload, requestObjectArg, opts);
        });
    }
    get payload() {
        return this._payload;
    }
    get requestObject() {
        return this._requestObject;
    }
    get options() {
        return this._options;
    }
    hasRequestObject() {
        return this.requestObject !== undefined;
    }
    getSupportedVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.version) {
                return this.options.version;
            }
            else if (((_c = (_b = this._uri) === null || _b === void 0 ? void 0 : _b.encodedUri) === null || _c === void 0 ? void 0 : _c.startsWith(types_1.Schema.OPENID_VC)) || ((_e = (_d = this._uri) === null || _d === void 0 ? void 0 : _d.scheme) === null || _e === void 0 ? void 0 : _e.startsWith(types_1.Schema.OPENID_VC))) {
                return types_1.SupportedVersion.JWT_VC_PRESENTATION_PROFILE_v1;
            }
            return (yield this.getSupportedVersionsFromPayload())[0];
        });
    }
    getSupportedVersionsFromPayload() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const mergedPayload = Object.assign(Object.assign({}, this.payload), (yield ((_a = this.requestObject) === null || _a === void 0 ? void 0 : _a.getPayload())));
            return (0, SIOPSpecVersion_1.authorizationRequestVersionDiscovery)(mergedPayload);
        });
    }
    uri() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._uri) {
                this._uri = yield URI_1.URI.fromAuthorizationRequest(this);
            }
            return this._uri;
        });
    }
    /**
     * Verifies a SIOP Request JWT on OP side
     *
     * @param opts
     */
    verify(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Opts_1.assertValidVerifyAuthorizationRequestOpts)(opts);
            let requestObjectPayload = undefined;
            const jwt = yield this.requestObjectJwt();
            const parsedJwt = jwt ? (0, oid4vc_common_1.parseJWT)(jwt) : undefined;
            if (parsedJwt) {
                requestObjectPayload = parsedJwt.payload;
                const jwtVerifier = yield (0, types_1.getRequestObjectJwtVerifier)(Object.assign(Object.assign({}, parsedJwt), { payload: requestObjectPayload }), { raw: jwt });
                const result = yield opts.verifyJwtCallback(jwtVerifier, Object.assign(Object.assign({}, parsedJwt), { raw: jwt }));
                if (!result) {
                    throw Error(types_1.SIOPErrors.ERROR_VERIFYING_SIGNATURE);
                }
                // verify the verifier attestation
                if (requestObjectPayload.client_id_scheme === 'verifier_attestation') {
                    const jwtVerifier = yield (0, types_1.getJwtVerifierWithContext)(parsedJwt, { type: 'verifier-attestation' });
                    const result = yield opts.verifyJwtCallback(jwtVerifier, Object.assign(Object.assign({}, parsedJwt), { raw: jwt }));
                    if (!result) {
                        throw Error(types_1.SIOPErrors.ERROR_VERIFYING_SIGNATURE);
                    }
                }
                if (this.hasRequestObject() && !this.payload.request_uri) {
                    // Put back the request object as that won't be present yet
                    this.payload.request = jwt;
                }
            }
            // AuthorizationRequest.assertValidRequestObject(origAuthenticationRequest);
            // We use the orig request for default values, but the JWT payload contains signed request object properties
            const mergedPayload = Object.assign(Object.assign({}, this.payload), (requestObjectPayload ? requestObjectPayload : {}));
            if (opts.state && mergedPayload.state !== opts.state) {
                throw new Error(`${types_1.SIOPErrors.BAD_STATE} payload: ${mergedPayload.state}, supplied: ${opts.state}`);
            }
            else if (opts.nonce && mergedPayload.nonce !== opts.nonce) {
                throw new Error(`${types_1.SIOPErrors.BAD_NONCE} payload: ${mergedPayload.nonce}, supplied: ${opts.nonce}`);
            }
            const registrationPropertyKey = mergedPayload['registration'] || mergedPayload['registration_uri'] ? 'registration' : 'client_metadata';
            let registrationMetadataPayload;
            if (mergedPayload[registrationPropertyKey] || mergedPayload[`${registrationPropertyKey}_uri`]) {
                registrationMetadataPayload = yield (0, helpers_1.fetchByReferenceOrUseByValue)(mergedPayload[`${registrationPropertyKey}_uri`], mergedPayload[registrationPropertyKey]);
                (0, Payload_1.assertValidRPRegistrationMedataPayload)(registrationMetadataPayload);
                // TODO: We need to do something with the metadata probably
            }
            // When the response_uri parameter is present, the redirect_uri Authorization Request parameter MUST NOT be present. If the redirect_uri Authorization Request parameter is present when the Response Mode is direct_post, the Wallet MUST return an invalid_request Authorization Response error.
            let responseURIType;
            let responseURI;
            if (mergedPayload.redirect_uri && mergedPayload.response_uri) {
                throw new Error(`${types_1.SIOPErrors.INVALID_REQUEST}, redirect_uri cannot be used together with response_uri`);
            }
            else if (mergedPayload.redirect_uri) {
                responseURIType = 'redirect_uri';
                responseURI = mergedPayload.redirect_uri;
            }
            else if (mergedPayload.response_uri) {
                responseURIType = 'response_uri';
                responseURI = mergedPayload.response_uri;
            }
            else if (mergedPayload.client_id_scheme === 'redirect_uri' && mergedPayload.client_id) {
                responseURIType = 'redirect_uri';
                responseURI = mergedPayload.client_id;
            }
            else {
                throw new Error(`${types_1.SIOPErrors.INVALID_REQUEST}, redirect_uri or response_uri is needed`);
            }
            // TODO: we need to verify somewhere that if response_mode is direct_post, that the response_uri may be present,
            // BUT not both redirect_uri and response_uri. What is the best place to do this?
            const presentationDefinitions = yield PresentationExchange_1.PresentationExchange.findValidPresentationDefinitions(mergedPayload, yield this.getSupportedVersion());
            return {
                jwt,
                payload: parsedJwt === null || parsedJwt === void 0 ? void 0 : parsedJwt.payload,
                issuer: parsedJwt === null || parsedJwt === void 0 ? void 0 : parsedJwt.payload.iss,
                responseURIType,
                responseURI,
                clientIdScheme: mergedPayload.client_id_scheme,
                correlationId: opts.correlationId,
                authorizationRequest: this,
                verifyOpts: opts,
                presentationDefinitions,
                registrationMetadataPayload,
                requestObject: this.requestObject,
                authorizationRequestPayload: this.payload,
                versions: yield this.getSupportedVersionsFromPayload(),
            };
        });
    }
    static verify(requestOrUri, verifyOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Opts_1.assertValidVerifyAuthorizationRequestOpts)(verifyOpts);
            const authorizationRequest = yield AuthorizationRequest.fromUriOrJwt(requestOrUri);
            return yield authorizationRequest.verify(verifyOpts);
        });
    }
    requestObjectJwt() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield ((_a = this.requestObject) === null || _a === void 0 ? void 0 : _a.toJwt());
        });
    }
    static fromJwt(jwt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!jwt) {
                throw Error(types_1.SIOPErrors.BAD_PARAMS);
            }
            const requestObject = yield request_object_1.RequestObject.fromJwt(jwt);
            const payload = Object.assign({}, (yield requestObject.getPayload()));
            // Although this was a RequestObject we instantiate it as AuthzRequest and then copy in the JWT as the request Object
            payload.request = jwt;
            return new AuthorizationRequest(Object.assign({}, payload), requestObject);
        });
    }
    static fromURI(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uri) {
                throw Error(types_1.SIOPErrors.BAD_PARAMS);
            }
            const uriObject = typeof uri === 'string' ? yield URI_1.URI.fromUri(uri) : uri;
            const requestObject = yield request_object_1.RequestObject.fromJwt(uriObject.requestObjectJwt);
            return new AuthorizationRequest(uriObject.authorizationRequestPayload, requestObject, undefined, uriObject);
        });
    }
    toStateInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const requestObject = yield this.requestObject.getPayload();
            return {
                client_id: this.options.clientMetadata.client_id,
                iat: (_a = requestObject.iat) !== null && _a !== void 0 ? _a : this.payload.iat,
                nonce: (_b = requestObject.nonce) !== null && _b !== void 0 ? _b : this.payload.nonce,
                state: this.payload.state,
            };
        });
    }
    containsResponseType(singleType) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseType = yield this.getMergedProperty('response_type');
            return (responseType === null || responseType === void 0 ? void 0 : responseType.includes(singleType)) === true;
        });
    }
    getMergedProperty(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const merged = yield this.mergedPayloads();
            return merged[key];
        });
    }
    mergedPayloads() {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.assign(Object.assign({}, this.payload), (this.requestObject && (yield this.requestObject.getPayload())));
        });
    }
    getPresentationDefinitions(version) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PresentationExchange_1.PresentationExchange.findValidPresentationDefinitions(yield this.mergedPayloads(), version);
        });
    }
}
exports.AuthorizationRequest = AuthorizationRequest;
//# sourceMappingURL=AuthorizationRequest.js.map