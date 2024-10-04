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
exports.RequestObject = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const Opts_1 = require("../authorization-request/Opts");
const helpers_1 = require("../helpers");
const types_1 = require("../types");
const Opts_2 = require("./Opts");
const Payload_1 = require("./Payload");
class RequestObject {
    constructor(opts, payload, jwt) {
        this.opts = opts ? RequestObject.mergeOAuth2AndOpenIdProperties(opts) : undefined;
        this.payload = payload;
        this.jwt = jwt;
    }
    /**
     * Create a request object that typically is used as a JWT on RP side, typically this method is called automatically when creating an Authorization Request, but you could use it directly!
     *
     * @param authorizationRequestOpts Request Object options to build a Request Object
     * @remarks This method is used to generate a SIOP request Object.
     * First it generates the request object payload, and then it a signed JWT can be accessed on request.
     *
     * Normally you will want to use the Authorization Request class. That class creates a URI that includes the JWT from this class in the URI
     * If you do use this class directly, you can call the `convertRequestObjectToURI` afterwards to get the URI.
     * Please note that the Authorization Request allows you to differentiate between OAuth2 and OpenID parameters that become
     * part of the URI and which become part of the Request Object. If you generate a URI based upon the result of this class,
     * the URI will be constructed based on the Request Object only!
     */
    static fromOpts(authorizationRequestOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, Opts_1.assertValidAuthorizationRequestOpts)(authorizationRequestOpts);
            const createJwtCallback = authorizationRequestOpts.requestObject.createJwtCallback; // We copy the signature separately as it can contain a function, which would be removed in the merge function below
            const jwtIssuer = authorizationRequestOpts.requestObject.jwtIssuer; // We copy the signature separately as it can contain a function, which would be removed in the merge function below
            const requestObjectOpts = RequestObject.mergeOAuth2AndOpenIdProperties(authorizationRequestOpts);
            const mergedOpts = Object.assign(Object.assign({}, authorizationRequestOpts), { requestObject: Object.assign(Object.assign(Object.assign({}, authorizationRequestOpts.requestObject), requestObjectOpts), { createJwtCallback, jwtIssuer }) });
            return new RequestObject(mergedOpts, yield (0, Payload_1.createRequestObjectPayload)(mergedOpts));
        });
    }
    static fromJwt(requestObjectJwt) {
        return __awaiter(this, void 0, void 0, function* () {
            return requestObjectJwt ? new RequestObject(undefined, undefined, requestObjectJwt) : undefined;
        });
    }
    static fromPayload(requestObjectPayload, authorizationRequestOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            return new RequestObject(authorizationRequestOpts, requestObjectPayload);
        });
    }
    static fromAuthorizationRequestPayload(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const requestObjectJwt = ((_a = payload.request) !== null && _a !== void 0 ? _a : payload.request_uri) ? yield (0, helpers_1.fetchByReferenceOrUseByValue)(payload.request_uri, payload.request, true) : undefined;
            return requestObjectJwt ? yield RequestObject.fromJwt(requestObjectJwt) : undefined;
        });
    }
    toJwt() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!this.jwt) {
                if (!this.opts) {
                    throw Error(types_1.SIOPErrors.BAD_PARAMS);
                }
                else if (!this.payload) {
                    return undefined;
                }
                this.removeRequestProperties();
                if (this.payload.registration_uri) {
                    delete this.payload.registration;
                }
                (0, Payload_1.assertValidRequestObjectPayload)(this.payload);
                const jwtIssuer = this.opts.jwtIssuer
                    ? Object.assign(Object.assign({}, this.opts.jwtIssuer), { type: 'request-object' }) : { method: 'custom', type: 'request-object' };
                if (jwtIssuer.method === 'custom') {
                    this.jwt = yield this.opts.createJwtCallback(jwtIssuer, { header: {}, payload: this.payload });
                }
                else if (jwtIssuer.method === 'did') {
                    const did = jwtIssuer.didUrl.split('#')[0];
                    this.payload.iss = (_a = this.payload.iss) !== null && _a !== void 0 ? _a : did;
                    this.payload.sub = (_b = this.payload.sub) !== null && _b !== void 0 ? _b : did;
                    this.payload.client_id = (_c = this.payload.client_id) !== null && _c !== void 0 ? _c : did;
                    this.payload.client_id_scheme = 'did';
                    const header = { kid: jwtIssuer.didUrl, alg: jwtIssuer.alg, typ: 'JWT' };
                    this.jwt = yield this.opts.createJwtCallback(jwtIssuer, { header, payload: this.payload });
                }
                else if (jwtIssuer.method === 'x5c') {
                    this.payload.iss = jwtIssuer.issuer;
                    const header = { x5c: jwtIssuer.x5c, typ: 'JWT', alg: jwtIssuer.alg };
                    this.jwt = yield this.opts.createJwtCallback(jwtIssuer, { header, payload: this.payload });
                }
                else if (jwtIssuer.method === 'jwk') {
                    if (!this.payload.client_id) {
                        throw new Error('Please provide a client_id for the RP');
                    }
                    const header = { jwk: jwtIssuer.jwk, typ: 'JWT', alg: jwtIssuer.jwk.alg };
                    this.jwt = yield this.opts.createJwtCallback(jwtIssuer, { header, payload: this.payload });
                }
                else {
                    throw new Error(`JwtIssuer method '${jwtIssuer.method}' not implemented`);
                }
            }
            return this.jwt;
        });
    }
    getPayload() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.payload) {
                if (!this.jwt) {
                    return undefined;
                }
                this.payload = (0, helpers_1.removeNullUndefined)((0, oid4vc_common_1.parseJWT)(this.jwt).payload);
                this.removeRequestProperties();
                if (this.payload.registration_uri) {
                    delete this.payload.registration;
                }
                else if (this.payload.registration) {
                    delete this.payload.registration_uri;
                }
            }
            (0, Payload_1.assertValidRequestObjectPayload)(this.payload);
            return this.payload;
        });
    }
    assertValid() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options) {
                (0, Opts_2.assertValidRequestObjectOpts)(this.options, false);
            }
            (0, Payload_1.assertValidRequestObjectPayload)(yield this.getPayload());
        });
    }
    get options() {
        return this.opts;
    }
    removeRequestProperties() {
        if (this.payload) {
            // https://openid.net/specs/openid-connect-core-1_0.html#RequestObject
            // request and request_uri parameters MUST NOT be included in Request Objects.
            delete this.payload.request;
            delete this.payload.request_uri;
        }
    }
    static mergeOAuth2AndOpenIdProperties(opts) {
        var _a, _b, _c;
        if (!opts) {
            throw Error(types_1.SIOPErrors.BAD_PARAMS);
        }
        const isAuthReq = opts['requestObject'] !== undefined;
        const mergedOpts = JSON.parse(JSON.stringify(opts));
        const createJwtCallback = (_a = opts['requestObject']) === null || _a === void 0 ? void 0 : _a.createJwtCallback;
        if (createJwtCallback) {
            mergedOpts.requestObject.createJwtCallback = createJwtCallback;
        }
        const jwtIssuer = (_b = opts['requestObject']) === null || _b === void 0 ? void 0 : _b.jwtIssuer;
        if (createJwtCallback) {
            mergedOpts.requestObject.jwtIssuer = jwtIssuer;
        }
        (_c = mergedOpts === null || mergedOpts === void 0 ? void 0 : mergedOpts.request) === null || _c === void 0 ? true : delete _c.requestObject;
        return isAuthReq ? mergedOpts.requestObject : mergedOpts;
    }
}
exports.RequestObject = RequestObject;
//# sourceMappingURL=RequestObject.js.map