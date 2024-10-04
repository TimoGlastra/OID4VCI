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
exports.AccessTokenClient = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const ssi_types_1 = require("@sphereon/ssi-types");
const MetadataClientV1_0_13_1 = require("./MetadataClientV1_0_13");
const functions_1 = require("./functions");
const dpopUtil_1 = require("./functions/dpopUtil");
const types_1 = require("./types");
class AccessTokenClient {
    acquireAccessToken(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { asOpts, pin, codeVerifier, code, redirectUri, metadata, createDPoPOpts, customBody } = opts;
            const credentialOffer = opts.credentialOffer ? yield (0, oid4vci_common_1.assertedUniformCredentialOffer)(opts.credentialOffer) : undefined;
            const pinMetadata = credentialOffer && this.getPinMetadata(credentialOffer.credential_offer);
            const issuer = (_a = opts.credentialIssuer) !== null && _a !== void 0 ? _a : (credentialOffer ? (0, oid4vci_common_1.getIssuerFromCredentialOfferPayload)(credentialOffer.credential_offer) : metadata === null || metadata === void 0 ? void 0 : metadata.issuer);
            if (!issuer) {
                throw Error('Issuer required at this point');
            }
            const issuerOpts = {
                issuer,
            };
            return yield this.acquireAccessTokenUsingRequest({
                accessTokenRequest: yield this.createAccessTokenRequest({
                    credentialOffer,
                    asOpts,
                    codeVerifier,
                    code,
                    redirectUri,
                    pin,
                    credentialIssuer: issuer,
                    metadata,
                    additionalParams: opts.additionalParams,
                    pinMetadata,
                    customBody
                }),
                pinMetadata,
                metadata,
                asOpts,
                issuerOpts,
                createDPoPOpts: createDPoPOpts,
            });
        });
    }
    acquireAccessTokenUsingRequest(_a) {
        return __awaiter(this, arguments, void 0, function* ({ accessTokenRequest, 
        // pinMetadata,
        metadata, asOpts, issuerOpts, createDPoPOpts, }) {
            // Commented out, as it fails for b' funke flow
            // this.validate(accessTokenRequest, pinMetadata);
            const requestTokenURL = AccessTokenClient.determineTokenURL({
                asOpts,
                issuerOpts,
                metadata: metadata
                    ? metadata
                    : (issuerOpts === null || issuerOpts === void 0 ? void 0 : issuerOpts.fetchMetadata)
                        ? yield MetadataClientV1_0_13_1.MetadataClientV1_0_13.retrieveAllMetadata(issuerOpts.issuer, { errorOnNotFound: false })
                        : undefined,
            });
            const useDpop = (createDPoPOpts === null || createDPoPOpts === void 0 ? void 0 : createDPoPOpts.dPoPSigningAlgValuesSupported) && createDPoPOpts.dPoPSigningAlgValuesSupported.length > 0;
            let dPoP = useDpop ? yield (0, oid4vc_common_1.createDPoP)((0, oid4vc_common_1.getCreateDPoPOptions)(createDPoPOpts, requestTokenURL)) : undefined;
            let response = yield this.sendAuthCode(requestTokenURL, accessTokenRequest, dPoP ? { headers: { dpop: dPoP } } : undefined);
            let nextDPoPNonce = createDPoPOpts === null || createDPoPOpts === void 0 ? void 0 : createDPoPOpts.jwtPayloadProps.nonce;
            const retryWithNonce = (0, dpopUtil_1.shouldRetryTokenRequestWithDPoPNonce)(response);
            if (retryWithNonce.ok && createDPoPOpts) {
                createDPoPOpts.jwtPayloadProps.nonce = retryWithNonce.dpopNonce;
                dPoP = yield (0, oid4vc_common_1.createDPoP)((0, oid4vc_common_1.getCreateDPoPOptions)(createDPoPOpts, requestTokenURL));
                response = yield this.sendAuthCode(requestTokenURL, accessTokenRequest, dPoP ? { headers: { dpop: dPoP } } : undefined);
                const successDPoPNonce = response.origResponse.headers.get('DPoP-Nonce');
                nextDPoPNonce = successDPoPNonce !== null && successDPoPNonce !== void 0 ? successDPoPNonce : retryWithNonce.dpopNonce;
            }
            if (response.successBody && createDPoPOpts && response.successBody.token_type !== 'DPoP') {
                throw new Error('Invalid token type returned. Expected DPoP. Received: ' + response.successBody.token_type);
            }
            return Object.assign(Object.assign({}, response), (nextDPoPNonce && { params: { dpop: { dpopNonce: nextDPoPNonce } } }));
        });
    }
    createAccessTokenRequest(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const { asOpts, pin, codeVerifier, code, redirectUri, customBody } = opts;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const credentialOfferRequest = opts.credentialOffer ? yield (0, oid4vci_common_1.toUniformCredentialOfferRequest)(opts.credentialOffer) : undefined;
            const request = Object.assign({}, opts.additionalParams);
            if ((_a = asOpts === null || asOpts === void 0 ? void 0 : asOpts.clientOpts) === null || _a === void 0 ? void 0 : _a.clientId) {
                request.client_id = asOpts.clientOpts.clientId;
            }
            const credentialIssuer = (_d = (_b = opts.credentialIssuer) !== null && _b !== void 0 ? _b : (_c = credentialOfferRequest === null || credentialOfferRequest === void 0 ? void 0 : credentialOfferRequest.credential_offer) === null || _c === void 0 ? void 0 : _c.credential_issuer) !== null && _d !== void 0 ? _d : (_e = opts.metadata) === null || _e === void 0 ? void 0 : _e.issuer;
            yield (0, functions_1.createJwtBearerClientAssertion)(request, Object.assign(Object.assign({}, opts), { credentialIssuer }));
            // For b' funke flow
            if (customBody)
                return customBody;
            // Prefer AUTHORIZATION_CODE over PRE_AUTHORIZED_CODE_FLOW
            if (!credentialOfferRequest || credentialOfferRequest.supportedFlows.includes(oid4vci_common_1.AuthzFlowType.AUTHORIZATION_CODE_FLOW)) {
                request.grant_type = oid4vci_common_1.GrantTypes.AUTHORIZATION_CODE;
                request.code = code;
                request.redirect_uri = redirectUri;
                if (codeVerifier) {
                    request.code_verifier = codeVerifier;
                }
                return request;
            }
            if (credentialOfferRequest === null || credentialOfferRequest === void 0 ? void 0 : credentialOfferRequest.supportedFlows.includes(oid4vci_common_1.AuthzFlowType.PRE_AUTHORIZED_CODE_FLOW)) {
                this.assertAlphanumericPin(opts.pinMetadata, pin);
                request.user_pin = pin;
                request.tx_code = pin;
                request.grant_type = oid4vci_common_1.GrantTypes.PRE_AUTHORIZED_CODE;
                // we actually know it is there because of the isPreAuthCode call
                request[oid4vci_common_1.PRE_AUTH_CODE_LITERAL] = (_g = (_f = credentialOfferRequest === null || credentialOfferRequest === void 0 ? void 0 : credentialOfferRequest.credential_offer.grants) === null || _f === void 0 ? void 0 : _f[oid4vci_common_1.PRE_AUTH_GRANT_LITERAL]) === null || _g === void 0 ? void 0 : _g[oid4vci_common_1.PRE_AUTH_CODE_LITERAL];
                return request;
            }
            throw new Error('Credential offer request follows neither pre-authorized code nor authorization code flow requirements.');
        });
    }
    // All these methods are commented out because .validate is not called, and TS complains if the methods are not used
    // private assertPreAuthorizedGrantType(grantType: GrantTypes): void {
    //   if (GrantTypes.PRE_AUTHORIZED_CODE !== grantType) {
    //     throw new Error("grant type must be 'urn:ietf:params:oauth:grant-type:pre-authorized_code'");
    //   }
    // }
    // private assertAuthorizationGrantType(grantType: GrantTypes): void {
    //   if (GrantTypes.AUTHORIZATION_CODE !== grantType) {
    //     throw new Error("grant type must be 'authorization_code'");
    //   }
    // }
    getPinMetadata(requestPayload) {
        var _a, _b;
        if (!requestPayload) {
            throw new Error(oid4vci_common_1.TokenErrorResponse.invalid_request);
        }
        const issuer = (0, oid4vci_common_1.getIssuerFromCredentialOfferPayload)(requestPayload);
        const grantDetails = (_a = requestPayload.grants) === null || _a === void 0 ? void 0 : _a[oid4vci_common_1.PRE_AUTH_GRANT_LITERAL];
        const isPinRequired = (_b = !!(grantDetails === null || grantDetails === void 0 ? void 0 : grantDetails.tx_code)) !== null && _b !== void 0 ? _b : false;
        types_1.LOG.warning(`Pin required for issuer ${issuer}: ${isPinRequired}`);
        return {
            txCode: grantDetails === null || grantDetails === void 0 ? void 0 : grantDetails.tx_code,
            isPinRequired,
        };
    }
    assertAlphanumericPin(pinMeta, pin) {
        var _a, _b;
        if (pinMeta && pinMeta.isPinRequired) {
            let regex;
            if (pinMeta.txCode) {
                const { input_mode, length } = pinMeta.txCode;
                if (input_mode === 'numeric') {
                    // Create a regex for numeric input. If no length specified, allow any length of numeric input.
                    regex = length ? new RegExp(`^\\d{1,${length}}$`) : /^\d+$/;
                }
                else if (input_mode === 'text') {
                    // Create a regex for text input. If no length specified, allow any length of alphanumeric input.
                    regex = length ? new RegExp(`^[a-zA-Z0-9]{1,${length}}$`) : /^[a-zA-Z0-9]+$/;
                }
            }
            // Default regex for alphanumeric with no specific length limit if no input_mode is specified.
            regex = regex || /^[a-zA-Z0-9]+$|^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
            if (!pin || !regex.test(pin)) {
                types_1.LOG.warning(`Pin is not valid. Expected format: ${((_a = pinMeta === null || pinMeta === void 0 ? void 0 : pinMeta.txCode) === null || _a === void 0 ? void 0 : _a.input_mode) || 'alphanumeric'}, Length: up to ${((_b = pinMeta === null || pinMeta === void 0 ? void 0 : pinMeta.txCode) === null || _b === void 0 ? void 0 : _b.length) || 'any number of'} characters`);
                throw new Error('A valid pin must be present according to the specified transaction code requirements.');
            }
        }
        else if (pin) {
            types_1.LOG.warning('Pin set, whilst not required');
            throw new Error('Cannot set a pin when the pin is not required.');
        }
    }
    // private assertNonEmptyPreAuthorizedCode(accessTokenRequest: AccessTokenRequest): void {
    //   if (!accessTokenRequest[PRE_AUTH_CODE_LITERAL]) {
    //     LOG.warning(`No pre-authorized code present, whilst it is required`, accessTokenRequest);
    //     throw new Error('Pre-authorization must be proven by presenting the pre-authorized code. Code must be present.');
    //   }
    // }
    // private assertNonEmptyCodeVerifier(accessTokenRequest: AccessTokenRequest): void {
    //   if (!accessTokenRequest.code_verifier) {
    //     LOG.warning('No code_verifier present, whilst it is required', accessTokenRequest);
    //     throw new Error('Authorization flow requires the code_verifier to be present');
    //   }
    // }
    // private assertNonEmptyCode(accessTokenRequest: AccessTokenRequest): void {
    //   if (!accessTokenRequest.code) {
    //     LOG.warning('No code present, whilst it is required');
    //     throw new Error('Authorization flow requires the code to be present');
    //   }
    // }
    // Commented out becauase 
    // private validate(accessTokenRequest: AccessTokenRequest, pinMeta?: TxCodeAndPinRequired): void {
    //   if (accessTokenRequest.grant_type === GrantTypes.PRE_AUTHORIZED_CODE) {
    //     this.assertPreAuthorizedGrantType(accessTokenRequest.grant_type);
    //     this.assertNonEmptyPreAuthorizedCode(accessTokenRequest);
    //     this.assertAlphanumericPin(pinMeta, accessTokenRequest.tx_code ?? accessTokenRequest.user_pin);
    //   } else if (accessTokenRequest.grant_type === GrantTypes.AUTHORIZATION_CODE) {
    //     this.assertAuthorizationGrantType(accessTokenRequest.grant_type);
    //     this.assertNonEmptyCodeVerifier(accessTokenRequest);
    //     this.assertNonEmptyCode(accessTokenRequest);
    //   } else {
    //     this.throwNotSupportedFlow();
    //   }
    // }
    sendAuthCode(requestTokenURL, accessTokenRequest, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, oid4vci_common_1.formPost)(requestTokenURL, (0, oid4vci_common_1.convertJsonToURI)(accessTokenRequest, { mode: oid4vci_common_1.JsonURIMode.X_FORM_WWW_URLENCODED }), {
                customHeaders: (opts === null || opts === void 0 ? void 0 : opts.headers) ? opts.headers : undefined,
            });
        });
    }
    static determineTokenURL({ asOpts, issuerOpts, metadata, }) {
        if (!asOpts && !(metadata === null || metadata === void 0 ? void 0 : metadata.token_endpoint) && !issuerOpts) {
            throw new Error('Cannot determine token URL if no issuer, metadata and no Authorization Server values are present');
        }
        let url;
        if (asOpts && asOpts.as) {
            url = this.creatTokenURLFromURL(asOpts.as, asOpts === null || asOpts === void 0 ? void 0 : asOpts.allowInsecureEndpoints, asOpts.tokenEndpoint);
        }
        else if (metadata === null || metadata === void 0 ? void 0 : metadata.token_endpoint) {
            url = metadata.token_endpoint;
        }
        else {
            if (!(issuerOpts === null || issuerOpts === void 0 ? void 0 : issuerOpts.issuer)) {
                throw Error('Either authorization server options, a token endpoint or issuer options are required at this point');
            }
            url = this.creatTokenURLFromURL(issuerOpts.issuer, asOpts === null || asOpts === void 0 ? void 0 : asOpts.allowInsecureEndpoints, issuerOpts.tokenEndpoint);
        }
        if (!url || !ssi_types_1.ObjectUtils.isString(url)) {
            throw new Error('No authorization server token URL present. Cannot acquire access token');
        }
        types_1.LOG.debug(`Token endpoint determined to be ${url}`);
        return url;
    }
    static creatTokenURLFromURL(url, allowInsecureEndpoints, tokenEndpoint) {
        if (allowInsecureEndpoints !== true && url.startsWith('http:')) {
            throw Error(`Unprotected token endpoints are not allowed ${url}. Use the 'allowInsecureEndpoints' param if you really need this for dev/testing!`);
        }
        const hostname = url.replace(/https?:\/\//, '').replace(/\/$/, '');
        const endpoint = tokenEndpoint ? (tokenEndpoint.startsWith('/') ? tokenEndpoint : tokenEndpoint.substring(1)) : '/token';
        const scheme = url.split('://')[0];
        return `${scheme ? scheme + '://' : 'https://'}${hostname}${endpoint}`;
    }
}
exports.AccessTokenClient = AccessTokenClient;
//# sourceMappingURL=AccessTokenClient.js.map