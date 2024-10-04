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
exports.RP = void 0;
const jarm_1 = require("@sphereon/jarm");
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const authorization_request_1 = require("../authorization-request");
const Opts_1 = require("../authorization-request/Opts");
const authorization_response_1 = require("../authorization-response");
const helpers_1 = require("../helpers");
const types_1 = require("../types");
const Opts_2 = require("./Opts");
const RPBuilder_1 = require("./RPBuilder");
class RP {
    get sessionManager() {
        return this._sessionManager;
    }
    constructor(opts) {
        var _a, _b;
        // const claims = opts.builder?.claims || opts.createRequestOpts?.payload.claims;
        this._createRequestOptions = (0, Opts_2.createRequestOptsFromBuilderOrExistingOpts)(opts);
        this._verifyResponseOptions = Object.assign({}, (0, Opts_2.createVerifyResponseOptsFromBuilderOrExistingOpts)(opts));
        this._eventEmitter = (_a = opts.builder) === null || _a === void 0 ? void 0 : _a.eventEmitter;
        this._sessionManager = (_b = opts.builder) === null || _b === void 0 ? void 0 : _b.sessionManager;
    }
    static fromRequestOpts(opts) {
        return new RP({ createRequestOpts: opts });
    }
    static builder(opts) {
        return RPBuilder_1.RPBuilder.newInstance(opts === null || opts === void 0 ? void 0 : opts.requestVersion);
    }
    createAuthorizationRequest(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorizationRequestOpts = this.newAuthorizationRequestOpts(opts);
            return authorization_request_1.AuthorizationRequest.fromOpts(authorizationRequestOpts)
                .then((authorizationRequest) => {
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_REQUEST_CREATED_SUCCESS, {
                    correlationId: opts.correlationId,
                    subject: authorizationRequest,
                });
                return authorizationRequest;
            })
                .catch((error) => {
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_REQUEST_CREATED_FAILED, {
                    correlationId: opts.correlationId,
                    error,
                });
                throw error;
            });
        });
    }
    createAuthorizationRequestURI(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorizationRequestOpts = this.newAuthorizationRequestOpts(opts);
            return yield authorization_request_1.URI.fromOpts(authorizationRequestOpts)
                .then((uri) => __awaiter(this, void 0, void 0, function* () {
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_REQUEST_CREATED_SUCCESS, {
                    correlationId: opts.correlationId,
                    subject: yield authorization_request_1.AuthorizationRequest.fromOpts(authorizationRequestOpts),
                });
                return uri;
            }))
                .catch((error) => {
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_REQUEST_CREATED_FAILED, {
                    correlationId: opts.correlationId,
                    error,
                });
                throw error;
            });
        });
    }
    signalAuthRequestRetrieved(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sessionManager) {
                throw Error(`Cannot signal auth request retrieval when no session manager is registered`);
            }
            const state = yield this.sessionManager.getRequestStateByCorrelationId(opts.correlationId, true);
            void this.emitEvent((opts === null || opts === void 0 ? void 0 : opts.error) ? types_1.AuthorizationEvents.ON_AUTH_REQUEST_SENT_FAILED : types_1.AuthorizationEvents.ON_AUTH_REQUEST_SENT_SUCCESS, Object.assign(Object.assign({ correlationId: opts.correlationId }, (!(opts === null || opts === void 0 ? void 0 : opts.error) ? { subject: state.request } : {})), ((opts === null || opts === void 0 ? void 0 : opts.error) ? { error: opts.error } : {})));
        });
    }
    static processJarmAuthorizationResponse(response, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { decryptCompact, getAuthRequestPayload } = opts;
            const getParams = getAuthRequestPayload;
            const validatedResponse = yield (0, jarm_1.jarmAuthResponseDirectPostJwtValidate)({ response }, {
                openid4vp: { authRequest: { getParams } },
                jwe: { decryptCompact },
            });
            return validatedResponse;
        });
    }
    verifyAuthorizationResponse(authorizationResponsePayload, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const state = (opts === null || opts === void 0 ? void 0 : opts.state) || this.verifyResponseOptions.state;
            let correlationId = (opts === null || opts === void 0 ? void 0 : opts.correlationId) || state;
            let authorizationResponse;
            try {
                authorizationResponse = yield authorization_response_1.AuthorizationResponse.fromPayload(authorizationResponsePayload);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (error) {
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_RESPONSE_RECEIVED_FAILED, {
                    correlationId: correlationId !== null && correlationId !== void 0 ? correlationId : (0, oid4vc_common_1.uuidv4)(), // correlation id cannot be derived from state in payload possible, hence a uuid as fallback
                    subject: authorizationResponsePayload,
                    error,
                });
                throw error;
            }
            try {
                const verifyAuthenticationResponseOpts = yield this.newVerifyAuthorizationResponseOpts(authorizationResponse, Object.assign(Object.assign({}, opts), { correlationId }));
                correlationId = (_a = verifyAuthenticationResponseOpts.correlationId) !== null && _a !== void 0 ? _a : correlationId;
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_RESPONSE_RECEIVED_SUCCESS, {
                    correlationId,
                    subject: authorizationResponse,
                });
                const verifiedAuthorizationResponse = yield authorizationResponse.verify(verifyAuthenticationResponseOpts);
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_RESPONSE_VERIFIED_SUCCESS, {
                    correlationId,
                    subject: authorizationResponse,
                });
                return verifiedAuthorizationResponse;
            }
            catch (error) {
                void this.emitEvent(types_1.AuthorizationEvents.ON_AUTH_RESPONSE_VERIFIED_FAILED, {
                    correlationId,
                    subject: authorizationResponse,
                    error,
                });
                throw error;
            }
        });
    }
    get createRequestOptions() {
        return this._createRequestOptions;
    }
    get verifyResponseOptions() {
        return this._verifyResponseOptions;
    }
    newAuthorizationRequestOpts(opts) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        const nonceWithTarget = typeof opts.nonce === 'string'
            ? { propertyValue: opts.nonce, targets: authorization_request_1.PropertyTarget.REQUEST_OBJECT }
            : opts === null || opts === void 0 ? void 0 : opts.nonce;
        const stateWithTarget = typeof opts.state === 'string'
            ? { propertyValue: opts.state, targets: authorization_request_1.PropertyTarget.REQUEST_OBJECT }
            : opts === null || opts === void 0 ? void 0 : opts.state;
        const claimsWithTarget = (opts === null || opts === void 0 ? void 0 : opts.claims) && !('propertyValue' in opts.claims)
            ? { propertyValue: opts.claims, targets: authorization_request_1.PropertyTarget.REQUEST_OBJECT }
            : opts === null || opts === void 0 ? void 0 : opts.claims;
        const version = (_a = opts === null || opts === void 0 ? void 0 : opts.version) !== null && _a !== void 0 ? _a : this._createRequestOptions.version;
        if (!version) {
            throw Error(types_1.SIOPErrors.NO_REQUEST_VERSION);
        }
        const referenceURI = (_b = opts.requestByReferenceURI) !== null && _b !== void 0 ? _b : (_d = (_c = this._createRequestOptions) === null || _c === void 0 ? void 0 : _c.requestObject) === null || _d === void 0 ? void 0 : _d.reference_uri;
        let responseURIType = opts === null || opts === void 0 ? void 0 : opts.responseURIType;
        let responseURI = (_f = (_e = this._createRequestOptions.requestObject.payload) === null || _e === void 0 ? void 0 : _e.redirect_uri) !== null && _f !== void 0 ? _f : (_g = this._createRequestOptions.payload) === null || _g === void 0 ? void 0 : _g.redirect_uri;
        if (responseURI) {
            responseURIType = 'redirect_uri';
        }
        else {
            responseURI =
                (_k = (_h = opts.responseURI) !== null && _h !== void 0 ? _h : (_j = this._createRequestOptions.requestObject.payload) === null || _j === void 0 ? void 0 : _j.response_uri) !== null && _k !== void 0 ? _k : (_l = this._createRequestOptions.payload) === null || _l === void 0 ? void 0 : _l.response_uri;
            responseURIType = (_m = opts === null || opts === void 0 ? void 0 : opts.responseURIType) !== null && _m !== void 0 ? _m : 'response_uri';
        }
        if (!responseURI) {
            throw Error(`A response or redirect URI is required at this point`);
        }
        else {
            if (responseURIType === 'redirect_uri') {
                if ((_p = (_o = this._createRequestOptions) === null || _o === void 0 ? void 0 : _o.requestObject) === null || _p === void 0 ? void 0 : _p.payload) {
                    this._createRequestOptions.requestObject.payload.redirect_uri = responseURI;
                }
                if (!referenceURI && !((_q = this._createRequestOptions.payload) === null || _q === void 0 ? void 0 : _q.redirect_uri)) {
                    this._createRequestOptions.payload.redirect_uri = responseURI;
                }
            }
            else if (responseURIType === 'response_uri') {
                if ((_s = (_r = this._createRequestOptions) === null || _r === void 0 ? void 0 : _r.requestObject) === null || _s === void 0 ? void 0 : _s.payload) {
                    this._createRequestOptions.requestObject.payload.response_uri = responseURI;
                }
                if (!referenceURI && !((_t = this._createRequestOptions.payload) === null || _t === void 0 ? void 0 : _t.response_uri)) {
                    this._createRequestOptions.payload.response_uri = responseURI;
                }
            }
        }
        const newOpts = Object.assign(Object.assign({}, this._createRequestOptions), { version, additionalPayloadClaims: opts.additionalPayloadClaims });
        newOpts.requestObject = Object.assign(Object.assign({}, newOpts.requestObject), { jwtIssuer: opts.jwtIssuer });
        newOpts.requestObject.payload = (_u = newOpts.requestObject.payload) !== null && _u !== void 0 ? _u : {};
        newOpts.payload = (_v = newOpts.payload) !== null && _v !== void 0 ? _v : {};
        if (referenceURI) {
            if (newOpts.requestObject.passBy && newOpts.requestObject.passBy !== types_1.PassBy.REFERENCE) {
                throw Error(`Cannot pass by reference with uri ${referenceURI} when mode is ${newOpts.requestObject.passBy}`);
            }
            newOpts.requestObject.reference_uri = referenceURI;
            newOpts.requestObject.passBy = types_1.PassBy.REFERENCE;
        }
        const state = (0, helpers_1.getState)(stateWithTarget.propertyValue);
        if (stateWithTarget.propertyValue) {
            if ((0, Opts_2.isTargetOrNoTargets)(authorization_request_1.PropertyTarget.AUTHORIZATION_REQUEST, stateWithTarget.targets)) {
                newOpts.payload.state = state;
            }
            if ((0, Opts_2.isTargetOrNoTargets)(authorization_request_1.PropertyTarget.REQUEST_OBJECT, stateWithTarget.targets)) {
                newOpts.requestObject.payload.state = state;
            }
        }
        const nonce = (0, helpers_1.getNonce)(state, nonceWithTarget.propertyValue);
        if (nonceWithTarget.propertyValue) {
            if ((0, Opts_2.isTargetOrNoTargets)(authorization_request_1.PropertyTarget.AUTHORIZATION_REQUEST, nonceWithTarget.targets)) {
                newOpts.payload.nonce = nonce;
            }
            if ((0, Opts_2.isTargetOrNoTargets)(authorization_request_1.PropertyTarget.REQUEST_OBJECT, nonceWithTarget.targets)) {
                newOpts.requestObject.payload.nonce = nonce;
            }
        }
        if (claimsWithTarget === null || claimsWithTarget === void 0 ? void 0 : claimsWithTarget.propertyValue) {
            if ((0, Opts_2.isTargetOrNoTargets)(authorization_request_1.PropertyTarget.AUTHORIZATION_REQUEST, claimsWithTarget.targets)) {
                newOpts.payload.claims = Object.assign(Object.assign({}, newOpts.payload.claims), claimsWithTarget.propertyValue);
            }
            if ((0, Opts_2.isTargetOrNoTargets)(authorization_request_1.PropertyTarget.REQUEST_OBJECT, claimsWithTarget.targets)) {
                newOpts.requestObject.payload.claims = Object.assign(Object.assign({}, newOpts.requestObject.payload.claims), claimsWithTarget.propertyValue);
            }
        }
        return newOpts;
    }
    newVerifyAuthorizationResponseOpts(authorizationResponse, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            let correlationId = (_a = opts === null || opts === void 0 ? void 0 : opts.correlationId) !== null && _a !== void 0 ? _a : this._verifyResponseOptions.correlationId;
            let state = (_b = opts === null || opts === void 0 ? void 0 : opts.state) !== null && _b !== void 0 ? _b : this._verifyResponseOptions.state;
            let nonce = (_c = opts === null || opts === void 0 ? void 0 : opts.nonce) !== null && _c !== void 0 ? _c : this._verifyResponseOptions.nonce;
            if (this.sessionManager) {
                const resNonce = (yield authorizationResponse.getMergedProperty('nonce', {
                    consistencyCheck: false,
                    hasher: (_d = opts.hasher) !== null && _d !== void 0 ? _d : this._verifyResponseOptions.hasher,
                }));
                const resState = (yield authorizationResponse.getMergedProperty('state', {
                    consistencyCheck: false,
                    hasher: (_e = opts.hasher) !== null && _e !== void 0 ? _e : this._verifyResponseOptions.hasher,
                }));
                if (resNonce && !correlationId) {
                    correlationId = yield this.sessionManager.getCorrelationIdByNonce(resNonce, false);
                }
                if (!correlationId) {
                    correlationId = yield this.sessionManager.getCorrelationIdByState(resState, false);
                }
                if (!correlationId) {
                    correlationId = nonce;
                }
                const requestState = yield this.sessionManager.getRequestStateByCorrelationId(correlationId, false);
                if (requestState) {
                    const reqNonce = yield requestState.request.getMergedProperty('nonce');
                    const reqState = yield requestState.request.getMergedProperty('state');
                    nonce = nonce !== null && nonce !== void 0 ? nonce : reqNonce;
                    state = state !== null && state !== void 0 ? state : reqState;
                }
            }
            return Object.assign(Object.assign(Object.assign(Object.assign({}, this._verifyResponseOptions), { verifyJwtCallback: this._verifyResponseOptions.verifyJwtCallback }), opts), { correlationId, audience: (_g = (_f = opts === null || opts === void 0 ? void 0 : opts.audience) !== null && _f !== void 0 ? _f : this._verifyResponseOptions.audience) !== null && _g !== void 0 ? _g : this._createRequestOptions.payload.client_id, state,
                nonce, verification: (0, Opts_1.mergeVerificationOpts)(this._verifyResponseOptions, opts), presentationDefinitions: (_h = opts === null || opts === void 0 ? void 0 : opts.presentationDefinitions) !== null && _h !== void 0 ? _h : this._verifyResponseOptions.presentationDefinitions });
        });
    }
    emitEvent(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._eventEmitter) {
                try {
                    this._eventEmitter.emit(type, new types_1.AuthorizationEvent(payload));
                }
                catch (e) {
                    //Let's make sure events do not cause control flow issues
                    console.log(`Could not emit event ${type} for ${payload.correlationId} initial error if any: ${payload === null || payload === void 0 ? void 0 : payload.error}`);
                }
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
}
exports.RP = RP;
//# sourceMappingURL=RP.js.map