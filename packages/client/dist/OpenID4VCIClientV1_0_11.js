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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenID4VCIClientV1_0_11 = void 0;
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const debug_1 = __importDefault(require("debug"));
const AccessTokenClientV1_0_11_1 = require("./AccessTokenClientV1_0_11");
const AuthorizationCodeClientV1_0_11_1 = require("./AuthorizationCodeClientV1_0_11");
const CredentialOfferClientV1_0_11_1 = require("./CredentialOfferClientV1_0_11");
const CredentialRequestClientBuilderV1_0_11_1 = require("./CredentialRequestClientBuilderV1_0_11");
const MetadataClientV1_0_11_1 = require("./MetadataClientV1_0_11");
const ProofOfPossessionBuilder_1 = require("./ProofOfPossessionBuilder");
const functions_1 = require("./functions");
const debug = (0, debug_1.default)('sphereon:oid4vci');
class OpenID4VCIClientV1_0_11 {
    constructor({ credentialOffer, clientId, kid, alg, credentialIssuer, pkce, authorizationRequest, jwk, endpointMetadata, accessTokenResponse, authorizationRequestOpts, authorizationCodeResponse, authorizationURL, }) {
        var _a;
        const issuer = credentialIssuer !== null && credentialIssuer !== void 0 ? credentialIssuer : (credentialOffer ? (0, oid4vci_common_1.getIssuerFromCredentialOfferPayload)(credentialOffer.credential_offer) : undefined);
        if (!issuer) {
            throw Error('No credential issuer supplied or deduced from offer');
        }
        this._state = {
            credentialOffer,
            credentialIssuer: issuer,
            kid,
            alg,
            // TODO: We need to refactor this and always explicitly call createAuthorizationRequestUrl, so we can have a credential selection first and use the kid as a default for the client id
            clientId: (_a = clientId !== null && clientId !== void 0 ? clientId : (credentialOffer && (0, oid4vci_common_1.getClientIdFromCredentialOfferPayload)(credentialOffer.credential_offer))) !== null && _a !== void 0 ? _a : kid === null || kid === void 0 ? void 0 : kid.split('#')[0],
            pkce: Object.assign({ disabled: false, codeChallengeMethod: oid4vci_common_1.CodeChallengeMethod.S256 }, pkce),
            authorizationRequestOpts,
            authorizationCodeResponse,
            jwk,
            endpointMetadata,
            accessTokenResponse,
            authorizationURL,
        };
        // Running syncAuthorizationRequestOpts later as it is using the state
        if (!this._state.authorizationRequestOpts) {
            this._state.authorizationRequestOpts = this.syncAuthorizationRequestOpts(authorizationRequest);
        }
        debug(`Authorization req options: ${JSON.stringify(this._state.authorizationRequestOpts, null, 2)}`);
    }
    static fromCredentialIssuer(_a) {
        return __awaiter(this, arguments, void 0, function* ({ kid, alg, retrieveServerMetadata, clientId, credentialIssuer, pkce, authorizationRequest, createAuthorizationRequestURL, }) {
            const client = new OpenID4VCIClientV1_0_11({
                kid,
                alg,
                clientId: clientId !== null && clientId !== void 0 ? clientId : authorizationRequest === null || authorizationRequest === void 0 ? void 0 : authorizationRequest.clientId,
                credentialIssuer,
                pkce,
                authorizationRequest,
            });
            if (retrieveServerMetadata === undefined || retrieveServerMetadata) {
                yield client.retrieveServerMetadata();
            }
            if (createAuthorizationRequestURL === undefined || createAuthorizationRequestURL) {
                yield client.createAuthorizationRequestUrl({ authorizationRequest, pkce });
            }
            return client;
        });
    }
    static fromState(_a) {
        return __awaiter(this, arguments, void 0, function* ({ state }) {
            const clientState = typeof state === 'string' ? JSON.parse(state) : state;
            return new OpenID4VCIClientV1_0_11(clientState);
        });
    }
    static fromURI(_a) {
        return __awaiter(this, arguments, void 0, function* ({ uri, kid, alg, retrieveServerMetadata, clientId, pkce, createAuthorizationRequestURL, authorizationRequest, resolveOfferUri, }) {
            var _b;
            const credentialOfferClient = yield CredentialOfferClientV1_0_11_1.CredentialOfferClientV1_0_11.fromURI(uri, { resolve: resolveOfferUri });
            const client = new OpenID4VCIClientV1_0_11({
                credentialOffer: credentialOfferClient,
                kid,
                alg,
                clientId: (_b = clientId !== null && clientId !== void 0 ? clientId : authorizationRequest === null || authorizationRequest === void 0 ? void 0 : authorizationRequest.clientId) !== null && _b !== void 0 ? _b : credentialOfferClient.clientId,
                pkce,
                authorizationRequest,
            });
            if (retrieveServerMetadata === undefined || retrieveServerMetadata) {
                yield client.retrieveServerMetadata();
            }
            if (credentialOfferClient.supportedFlows.includes(oid4vci_common_1.AuthzFlowType.AUTHORIZATION_CODE_FLOW) &&
                (createAuthorizationRequestURL === undefined || createAuthorizationRequestURL)) {
                yield client.createAuthorizationRequestUrl({ authorizationRequest, pkce });
                debug(`Authorization Request URL: ${client._state.authorizationURL}`);
            }
            return client;
        });
    }
    /**
     * Allows you to create an Authorization Request URL when using an Authorization Code flow. This URL needs to be accessed using the front channel (browser)
     *
     * The Identity provider would present a login screen typically; after you authenticated, it would redirect to the provided redirectUri; which can be same device or cross-device
     * @param opts
     */
    createAuthorizationRequestUrl(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this._state.authorizationURL) {
                this.calculatePKCEOpts(opts === null || opts === void 0 ? void 0 : opts.pkce);
                this._state.authorizationRequestOpts = this.syncAuthorizationRequestOpts(opts === null || opts === void 0 ? void 0 : opts.authorizationRequest);
                if (!this._state.authorizationRequestOpts) {
                    throw Error(`No Authorization Request options present or provided in this call`);
                }
                // todo: Probably can go with current logic in MetadataClientV1_0_13 who will always set the authorization_endpoint when found
                //  handling this because of the support for v1_0-08
                if (((_a = this._state.endpointMetadata) === null || _a === void 0 ? void 0 : _a.credentialIssuerMetadata) &&
                    'authorization_endpoint' in this._state.endpointMetadata.credentialIssuerMetadata) {
                    this._state.endpointMetadata.authorization_endpoint = this._state.endpointMetadata.credentialIssuerMetadata.authorization_endpoint;
                }
                this._state.authorizationURL = yield (0, AuthorizationCodeClientV1_0_11_1.createAuthorizationRequestUrlV1_0_11)({
                    pkce: this._state.pkce,
                    endpointMetadata: this.endpointMetadata,
                    authorizationRequest: this._state.authorizationRequestOpts,
                    credentialOffer: this.credentialOffer,
                    credentialsSupported: Object.values(this.getCredentialsSupported()),
                });
            }
            return this._state.authorizationURL;
        });
    }
    retrieveServerMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            this.assertIssuerData();
            if (!this._state.endpointMetadata) {
                if (this.credentialOffer) {
                    this._state.endpointMetadata = yield MetadataClientV1_0_11_1.MetadataClientV1_0_11.retrieveAllMetadataFromCredentialOffer(this.credentialOffer);
                }
                else if (this._state.credentialIssuer) {
                    this._state.endpointMetadata = yield MetadataClientV1_0_11_1.MetadataClientV1_0_11.retrieveAllMetadata(this._state.credentialIssuer);
                }
                else {
                    throw Error(`Cannot retrieve issuer metadata without either a credential offer, or issuer value`);
                }
            }
            return this.endpointMetadata;
        });
    }
    calculatePKCEOpts(pkce) {
        this._state.pkce = (0, functions_1.generateMissingPKCEOpts)(Object.assign(Object.assign({}, this._state.pkce), pkce));
    }
    acquireAccessToken(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
            const { pin, clientId = (_a = this._state.clientId) !== null && _a !== void 0 ? _a : (_b = this._state.authorizationRequestOpts) === null || _b === void 0 ? void 0 : _b.clientId } = opts !== null && opts !== void 0 ? opts : {};
            let { redirectUri } = opts !== null && opts !== void 0 ? opts : {};
            if (opts === null || opts === void 0 ? void 0 : opts.authorizationResponse) {
                this._state.authorizationCodeResponse = Object.assign({}, (0, oid4vci_common_1.toAuthorizationResponsePayload)(opts.authorizationResponse));
            }
            else if (opts === null || opts === void 0 ? void 0 : opts.code) {
                this._state.authorizationCodeResponse = { code: opts.code };
            }
            const code = (_c = this._state.authorizationCodeResponse) === null || _c === void 0 ? void 0 : _c.code;
            if (opts === null || opts === void 0 ? void 0 : opts.codeVerifier) {
                this._state.pkce.codeVerifier = opts.codeVerifier;
            }
            this.assertIssuerData();
            if (clientId) {
                this._state.clientId = clientId;
            }
            if (!this._state.accessTokenResponse) {
                const accessTokenClient = new AccessTokenClientV1_0_11_1.AccessTokenClientV1_0_11();
                if (redirectUri && redirectUri !== ((_d = this._state.authorizationRequestOpts) === null || _d === void 0 ? void 0 : _d.redirectUri)) {
                    console.log(`Redirect URI mismatch between access-token (${redirectUri}) and authorization request (${(_e = this._state.authorizationRequestOpts) === null || _e === void 0 ? void 0 : _e.redirectUri}). According to the specification that is not allowed.`);
                }
                if (((_f = this._state.authorizationRequestOpts) === null || _f === void 0 ? void 0 : _f.redirectUri) && !redirectUri) {
                    redirectUri = this._state.authorizationRequestOpts.redirectUri;
                }
                const asOpts = Object.assign({}, opts === null || opts === void 0 ? void 0 : opts.asOpts);
                const kid = (_j = (_h = (_g = asOpts.clientOpts) === null || _g === void 0 ? void 0 : _g.kid) !== null && _h !== void 0 ? _h : this._state.kid) !== null && _j !== void 0 ? _j : (_l = (_k = this._state.authorizationRequestOpts) === null || _k === void 0 ? void 0 : _k.requestObjectOpts) === null || _l === void 0 ? void 0 : _l.kid;
                const clientAssertionType = (_o = (_m = asOpts.clientOpts) === null || _m === void 0 ? void 0 : _m.clientAssertionType) !== null && _o !== void 0 ? _o : (kid && clientId && typeof ((_q = (_p = asOpts.clientOpts) === null || _p === void 0 ? void 0 : _p.signCallbacks) === null || _q === void 0 ? void 0 : _q.signCallback) === 'function'
                    ? 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
                    : undefined);
                if (this.isEBSI() || (clientId && kid)) {
                    if (!clientId) {
                        throw Error(`Client id expected for EBSI`);
                    }
                    asOpts.clientOpts = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, asOpts.clientOpts), { clientId }), (kid && { kid })), (clientAssertionType && { clientAssertionType })), { signCallbacks: (_s = (_r = asOpts.clientOpts) === null || _r === void 0 ? void 0 : _r.signCallbacks) !== null && _s !== void 0 ? _s : (_u = (_t = this._state.authorizationRequestOpts) === null || _t === void 0 ? void 0 : _t.requestObjectOpts) === null || _u === void 0 ? void 0 : _u.signCallbacks });
                }
                const response = yield accessTokenClient.acquireAccessToken(Object.assign(Object.assign(Object.assign(Object.assign({ credentialOffer: this.credentialOffer, metadata: this.endpointMetadata, credentialIssuer: this.getIssuer(), pin }, (!this._state.pkce.disabled && { codeVerifier: this._state.pkce.codeVerifier })), { code,
                    redirectUri,
                    asOpts }), ((opts === null || opts === void 0 ? void 0 : opts.createDPoPOpts) && { createDPoPOpts: opts.createDPoPOpts })), ((opts === null || opts === void 0 ? void 0 : opts.additionalRequestParams) && { additionalParams: opts.additionalRequestParams })));
                if (response.errorBody) {
                    debug(`Access token error:\r\n${JSON.stringify(response.errorBody)}`);
                    throw Error(`Retrieving an access token from ${(_v = this._state.endpointMetadata) === null || _v === void 0 ? void 0 : _v.token_endpoint} for issuer ${this.getIssuer()} failed with status: ${response.origResponse.status}`);
                }
                else if (!response.successBody) {
                    debug(`Access token error. No success body`);
                    throw Error(`Retrieving an access token from ${(_w = this._state.endpointMetadata) === null || _w === void 0 ? void 0 : _w.token_endpoint} for issuer ${this.getIssuer()} failed as there was no success response body`);
                }
                this._state.accessTokenResponse = response.successBody;
                this._state.dpopResponseParams = response.params;
                this._state.accessToken = response.successBody.access_token;
            }
            return Object.assign(Object.assign({}, this.accessTokenResponse), (this.dpopResponseParams && { params: this.dpopResponseParams }));
        });
    }
    acquireCredentials(_a) {
        return __awaiter(this, arguments, void 0, function* ({ credentialTypes, context, proofCallbacks, format, kid, jwk, alg, jti, deferredCredentialAwait, deferredCredentialIntervalInMS, createDPoPOpts, }) {
            var _b, _c, _d;
            if ([jwk, kid].filter((v) => v !== undefined).length > 1) {
                throw new Error(oid4vci_common_1.KID_JWK_X5C_ERROR + `. jwk: ${jwk !== undefined}, kid: ${kid !== undefined}`);
            }
            if (alg)
                this._state.alg = alg;
            if (jwk)
                this._state.jwk = jwk;
            if (kid)
                this._state.kid = kid;
            const requestBuilder = this.credentialOffer
                ? CredentialRequestClientBuilderV1_0_11_1.CredentialRequestClientBuilderV1_0_11.fromCredentialOffer({
                    credentialOffer: this.credentialOffer,
                    metadata: this.endpointMetadata,
                })
                : CredentialRequestClientBuilderV1_0_11_1.CredentialRequestClientBuilderV1_0_11.fromCredentialIssuer({
                    credentialIssuer: this.getIssuer(),
                    credentialTypes,
                    metadata: this.endpointMetadata,
                    version: this.version(),
                });
            requestBuilder.withTokenFromResponse(this.accessTokenResponse);
            requestBuilder.withDeferredCredentialAwait(deferredCredentialAwait !== null && deferredCredentialAwait !== void 0 ? deferredCredentialAwait : false, deferredCredentialIntervalInMS);
            if ((_b = this.endpointMetadata) === null || _b === void 0 ? void 0 : _b.credentialIssuerMetadata) {
                const metadata = this.endpointMetadata.credentialIssuerMetadata;
                const types = Array.isArray(credentialTypes) ? credentialTypes : [credentialTypes];
                if (metadata.credentials_supported && Array.isArray(metadata.credentials_supported)) {
                    let typeSupported = false;
                    metadata.credentials_supported.forEach((supportedCredential) => {
                        const subTypes = (0, oid4vci_common_1.getTypesFromCredentialSupported)(supportedCredential);
                        if (subTypes.every((t, i) => types[i] === t) ||
                            (types.length === 1 && (types[0] === supportedCredential.id || subTypes.includes(types[0])))) {
                            typeSupported = true;
                        }
                    });
                    if (!typeSupported) {
                        console.log(`Not all credential types ${JSON.stringify(credentialTypes)} are present in metadata for ${this.getIssuer()}`);
                        // throw Error(`Not all credential types ${JSON.stringify(credentialTypes)} are supported by issuer ${this.getIssuer()}`);
                    }
                }
                else if (metadata.credentials_supported && !Array.isArray(metadata.credentials_supported)) {
                    const credentialsSupported = metadata.credentials_supported;
                    if (types.some((type) => !metadata.credentials_supported || !credentialsSupported[type])) {
                        throw Error(`Not all credential types ${JSON.stringify(credentialTypes)} are supported by issuer ${this.getIssuer()}`);
                    }
                }
                // todo: Format check? We might end up with some disjoint type / format combinations supported by the server
            }
            const credentialRequestClient = requestBuilder.build();
            const proofBuilder = ProofOfPossessionBuilder_1.ProofOfPossessionBuilder.fromAccessTokenResponse({
                accessTokenResponse: this.accessTokenResponse,
                callbacks: proofCallbacks,
                version: this.version(),
            })
                .withIssuer(this.getIssuer())
                .withAlg(this.alg);
            if (this._state.jwk) {
                proofBuilder.withJWK(this._state.jwk);
            }
            if (this._state.kid) {
                proofBuilder.withKid(this._state.kid);
            }
            if (this.clientId) {
                proofBuilder.withClientId(this.clientId);
            }
            if (jti) {
                proofBuilder.withJti(jti);
            }
            const response = yield credentialRequestClient.acquireCredentialsUsingProof({
                proofInput: proofBuilder,
                credentialTypes,
                context,
                format,
                createDPoPOpts,
            });
            this._state.dpopResponseParams = response.params;
            if (response.errorBody) {
                debug(`Credential request error:\r\n${JSON.stringify(response.errorBody)}`);
                throw Error(`Retrieving a credential from ${(_c = this._state.endpointMetadata) === null || _c === void 0 ? void 0 : _c.credential_endpoint} for issuer ${this.getIssuer()} failed with status: ${response.origResponse.status}`);
            }
            else if (!response.successBody) {
                debug(`Credential request error. No success body`);
                throw Error(`Retrieving a credential from ${(_d = this._state.endpointMetadata) === null || _d === void 0 ? void 0 : _d.credential_endpoint} for issuer ${this.getIssuer()} failed as there was no success response body`);
            }
            return Object.assign(Object.assign({}, response.successBody), (this.dpopResponseParams && { params: this.dpopResponseParams }));
        });
    }
    exportState() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.stringify(this._state);
        });
    }
    // FIXME: We really should convert <v11 to v12 objects first. Right now the logic doesn't map nicely and is brittle.
    // We should resolve IDs to objects first in case of strings.
    // When < v11 convert into a v12 object. When v12 object retain it.
    // Then match the object array on server metadata
    getCredentialsSupportedV11(restrictToInitiationTypes, format) {
        return (0, oid4vci_common_1.getSupportedCredentials)({
            issuerMetadata: this.endpointMetadata.credentialIssuerMetadata,
            version: this.version(),
            format: format,
            types: restrictToInitiationTypes ? this.getCredentialOfferTypes() : undefined,
        });
    }
    getCredentialsSupported(format) {
        return (0, oid4vci_common_1.getSupportedCredentials)({
            issuerMetadata: this.endpointMetadata.credentialIssuerMetadata,
            version: this.version(),
            format: format,
            types: undefined,
        });
    }
    getCredentialOfferTypes() {
        if (!this.credentialOffer) {
            return [];
        }
        else if (this.credentialOffer.version < oid4vci_common_1.OpenId4VCIVersion.VER_1_0_11) {
            const orig = this.credentialOffer.original_credential_offer;
            const types = typeof orig.credential_type === 'string' ? [orig.credential_type] : orig.credential_type;
            const result = [];
            result[0] = types;
            return result;
        }
        else if (this.credentialOffer.version < oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13) {
            return this.credentialOffer.credential_offer.credentials.map((c) => { var _a; return (_a = (0, oid4vci_common_1.getTypesFromObject)(c)) !== null && _a !== void 0 ? _a : []; });
        }
        // we don't support > V11
        throw Error(`This class only supports version 11 and lower! Version: ${this.version()}`);
    }
    issuerSupportedFlowTypes() {
        var _a, _b, _c, _d;
        return ((_b = (_a = this.credentialOffer) === null || _a === void 0 ? void 0 : _a.supportedFlows) !== null && _b !== void 0 ? _b : (((_d = (_c = this._state.endpointMetadata) === null || _c === void 0 ? void 0 : _c.credentialIssuerMetadata) === null || _d === void 0 ? void 0 : _d.authorization_endpoint) ? [oid4vci_common_1.AuthzFlowType.AUTHORIZATION_CODE_FLOW] : []));
    }
    isFlowTypeSupported(flowType) {
        return this.issuerSupportedFlowTypes().includes(flowType);
    }
    get authorizationURL() {
        return this._state.authorizationURL;
    }
    hasAuthorizationURL() {
        return !!this.authorizationURL;
    }
    get credentialOffer() {
        return this._state.credentialOffer;
    }
    version() {
        var _a, _b;
        return (_b = (_a = this.credentialOffer) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : oid4vci_common_1.OpenId4VCIVersion.VER_1_0_11;
    }
    get endpointMetadata() {
        this.assertServerMetadata();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._state.endpointMetadata;
    }
    get kid() {
        this.assertIssuerData();
        if (!this._state.kid) {
            throw new Error('No value for kid is supplied');
        }
        return this._state.kid;
    }
    get alg() {
        this.assertIssuerData();
        if (!this._state.alg) {
            throw new Error('No value for alg is supplied');
        }
        return this._state.alg;
    }
    set clientId(value) {
        this._state.clientId = value;
    }
    get clientId() {
        return this._state.clientId;
    }
    hasAccessTokenResponse() {
        return !!this._state.accessTokenResponse;
    }
    get accessTokenResponse() {
        this.assertAccessToken();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._state.accessTokenResponse;
    }
    get dpopResponseParams() {
        return this._state.dpopResponseParams;
    }
    getIssuer() {
        this.assertIssuerData();
        return this._state.credentialIssuer;
    }
    getAccessTokenEndpoint() {
        this.assertIssuerData();
        return this.endpointMetadata
            ? this.endpointMetadata.token_endpoint
            : AccessTokenClientV1_0_11_1.AccessTokenClientV1_0_11.determineTokenURL({ issuerOpts: { issuer: this.getIssuer() } });
    }
    getCredentialEndpoint() {
        this.assertIssuerData();
        return this.endpointMetadata ? this.endpointMetadata.credential_endpoint : `${this.getIssuer()}/credential`;
    }
    hasDeferredCredentialEndpoint() {
        return !!this.getAccessTokenEndpoint();
    }
    getDeferredCredentialEndpoint() {
        this.assertIssuerData();
        return this.endpointMetadata ? this.endpointMetadata.credential_endpoint : `${this.getIssuer()}/credential`;
    }
    /**
     * Too bad we need a method like this, but EBSI is not exposing metadata
     */
    isEBSI() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (this.credentialOffer &&
            ((_c = (_b = (_a = this.credentialOffer) === null || _a === void 0 ? void 0 : _a.credential_offer) === null || _b === void 0 ? void 0 : _b.credentials) === null || _c === void 0 ? void 0 : _c.find((cred) => 
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            typeof cred !== 'string' && 'trust_framework' in cred && 'name' in cred.trust_framework && cred.trust_framework.name.includes('ebsi')))) {
            return true;
        }
        // this.assertIssuerData();
        return (((_d = this.clientId) === null || _d === void 0 ? void 0 : _d.includes('ebsi')) ||
            ((_e = this._state.kid) === null || _e === void 0 ? void 0 : _e.includes('did:ebsi:')) ||
            this.getIssuer().includes('ebsi') ||
            ((_g = (_f = this.endpointMetadata.credentialIssuerMetadata) === null || _f === void 0 ? void 0 : _f.authorization_endpoint) === null || _g === void 0 ? void 0 : _g.includes('ebsi.eu')) ||
            ((_j = (_h = this.endpointMetadata.credentialIssuerMetadata) === null || _h === void 0 ? void 0 : _h.authorization_server) === null || _j === void 0 ? void 0 : _j.includes('ebsi.eu')));
    }
    assertIssuerData() {
        if (!this._state.credentialIssuer) {
            throw Error(`No credential issuer value present`);
        }
        else if (!this._state.credentialOffer && this._state.endpointMetadata && this.issuerSupportedFlowTypes().length === 0) {
            throw Error(`No issuance initiation or credential offer present`);
        }
    }
    assertServerMetadata() {
        if (!this._state.endpointMetadata) {
            throw Error('No server metadata');
        }
    }
    assertAccessToken() {
        if (!this._state.accessTokenResponse) {
            throw Error(`No access token present`);
        }
    }
    syncAuthorizationRequestOpts(opts) {
        var _a, _b;
        let authorizationRequestOpts = Object.assign(Object.assign({}, (_a = this._state) === null || _a === void 0 ? void 0 : _a.authorizationRequestOpts), opts);
        if (!authorizationRequestOpts) {
            // We only set a redirectUri if no options are provided.
            // Note that this only works for mobile apps, that can handle a code query param on the default openid-credential-offer deeplink.
            // Provide your own options if that is not desired!
            authorizationRequestOpts = { redirectUri: `${oid4vci_common_1.DefaultURISchemes.CREDENTIAL_OFFER}://` };
        }
        const clientId = (_b = authorizationRequestOpts.clientId) !== null && _b !== void 0 ? _b : this._state.clientId;
        // sync clientId
        this._state.clientId = clientId;
        authorizationRequestOpts.clientId = clientId;
        return authorizationRequestOpts;
    }
}
exports.OpenID4VCIClientV1_0_11 = OpenID4VCIClientV1_0_11;
//# sourceMappingURL=OpenID4VCIClientV1_0_11.js.map