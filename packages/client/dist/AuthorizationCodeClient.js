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
exports.createAuthorizationRequestUrl = void 0;
exports.createSignedAuthRequestWhenNeeded = createSignedAuthRequestWhenNeeded;
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const debug_1 = __importDefault(require("debug"));
const ProofOfPossessionBuilder_1 = require("./ProofOfPossessionBuilder");
const debug = (0, debug_1.default)('sphereon:oid4vci');
function createSignedAuthRequestWhenNeeded(requestObject, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        if (opts.requestObjectMode === oid4vci_common_1.CreateRequestObjectMode.REQUEST_URI) {
            throw Error(`Request Object Mode ${opts.requestObjectMode} is not supported yet`);
        }
        else if (opts.requestObjectMode === oid4vci_common_1.CreateRequestObjectMode.REQUEST_OBJECT) {
            if (typeof ((_a = opts.signCallbacks) === null || _a === void 0 ? void 0 : _a.signCallback) !== 'function') {
                throw Error(`No request object sign callback found, whilst request object mode was set to ${opts.requestObjectMode}`);
            }
            else if (!opts.kid) {
                throw Error(`No kid found, whilst request object mode was set to ${opts.requestObjectMode}`);
            }
            let client_metadata;
            if (opts.clientMetadata || opts.jwksUri) {
                client_metadata = (_b = opts.clientMetadata) !== null && _b !== void 0 ? _b : {};
                if (opts.jwksUri) {
                    client_metadata['jwks_uri'] = opts.jwksUri;
                }
            }
            let authorization_details = requestObject['authorization_details'];
            if (typeof authorization_details === 'string') {
                authorization_details = JSON.parse(requestObject.authorization_details);
            }
            if (!requestObject.aud && opts.aud) {
                requestObject.aud = opts.aud;
            }
            const iss = (_d = (_c = requestObject.iss) !== null && _c !== void 0 ? _c : opts.iss) !== null && _d !== void 0 ? _d : requestObject.client_id;
            const jwt = {
                header: { alg: 'ES256', kid: opts.kid, typ: 'JWT' },
                payload: Object.assign(Object.assign(Object.assign({}, requestObject), { iss, authorization_details }), (client_metadata && { client_metadata })),
            };
            const pop = yield ProofOfPossessionBuilder_1.ProofOfPossessionBuilder.fromJwt({
                jwt,
                callbacks: opts.signCallbacks,
                version: oid4vci_common_1.OpenId4VCIVersion.VER_1_0_11,
                mode: 'JWT',
            }).build();
            requestObject['request'] = pop.jwt;
        }
    });
}
function filterSupportedCredentials(credentialOffer, credentialsSupported) {
    if (!credentialOffer.credential_configuration_ids || !credentialsSupported) {
        return [];
    }
    return Object.entries(credentialsSupported)
        .filter((entry) => { var _a; return (_a = credentialOffer.credential_configuration_ids) === null || _a === void 0 ? void 0 : _a.includes(entry[0]); })
        .map((entry) => {
        return Object.assign(Object.assign({}, entry[1]), { configuration_id: entry[0] });
    });
}
const createAuthorizationRequestUrl = (_a) => __awaiter(void 0, [_a], void 0, function* ({ pkce, endpointMetadata, authorizationRequest, credentialOffer, credentialConfigurationSupported, clientId, version, headers }) {
    var _b, _c, _d, _e;
    function removeDisplayAndValueTypes(obj) {
        const newObj = Object.assign({}, obj);
        for (const prop in newObj) {
            if (['display', 'value_type'].includes(prop)) {
                delete newObj[prop];
            }
            else if (typeof newObj[prop] === 'object') {
                newObj[prop] = removeDisplayAndValueTypes(newObj[prop]);
            }
        }
        return newObj;
    }
    const { redirectUri, requestObjectOpts = { requestObjectMode: oid4vci_common_1.CreateRequestObjectMode.NONE } } = authorizationRequest;
    const client_id = clientId !== null && clientId !== void 0 ? clientId : authorizationRequest.clientId;
    // Authorization server metadata takes precedence
    const authorizationMetadata = (_b = endpointMetadata.authorizationServerMetadata) !== null && _b !== void 0 ? _b : endpointMetadata.credentialIssuerMetadata;
    let { authorizationDetails } = authorizationRequest;
    const parMode = (authorizationMetadata === null || authorizationMetadata === void 0 ? void 0 : authorizationMetadata.require_pushed_authorization_requests)
        ? oid4vci_common_1.PARMode.REQUIRE
        : ((_c = authorizationRequest.parMode) !== null && _c !== void 0 ? _c : (client_id ? oid4vci_common_1.PARMode.AUTO : oid4vci_common_1.PARMode.NEVER));
    // Scope and authorization_details can be used in the same authorization request
    // https://datatracker.ietf.org/doc/html/draft-ietf-oauth-rar-23#name-relationship-to-scope-param
    if (!authorizationRequest.scope && !authorizationDetails) {
        if (!credentialOffer) {
            throw Error('Please provide a scope or authorization_details if no credential offer is present');
        }
        if ('credentials' in credentialOffer.credential_offer) {
            throw new Error('CredentialOffer format is wrong.');
        }
        const ver = (_d = version !== null && version !== void 0 ? version : (0, oid4vci_common_1.determineSpecVersionFromOffer)(credentialOffer.credential_offer)) !== null && _d !== void 0 ? _d : oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13;
        const creds = ver === oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13
            ? filterSupportedCredentials(credentialOffer.credential_offer, credentialConfigurationSupported)
            : [];
        authorizationDetails = creds.flatMap((cred) => {
            var _a;
            const locations = [(_a = credentialOffer === null || credentialOffer === void 0 ? void 0 : credentialOffer.credential_offer.credential_issuer) !== null && _a !== void 0 ? _a : endpointMetadata.issuer];
            // TODO: credential_configuration_id seems to always be defined?
            const credential_configuration_id = cred.configuration_id;
            const format = credential_configuration_id ? undefined : cred.format;
            if (!credential_configuration_id && !cred.format) {
                throw Error('format is required in authorization details');
            }
            // SD-JWT VC
            const vct = cred.format === 'vc+sd-jwt' ? cred.vct : undefined;
            const doctype = cred.format === 'mso_mdoc' ? cred.doctype : undefined;
            // W3C credentials have a credential definition, the rest does not
            let credential_definition = undefined;
            if ((0, oid4vci_common_1.isW3cCredentialSupported)(cred)) {
                credential_definition = Object.assign(Object.assign({}, cred.credential_definition), { 
                    // type: OPTIONAL. Array as defined in Appendix A.1.1.2. This claim contains the type values the Wallet requests authorization for at the Credential Issuer. It MUST be present if the claim format is present in the root of the authorization details object. It MUST not be present otherwise.
                    // It meens we have a config_id, already mapping it to an explicit format and types
                    type: format ? cred.credential_definition.type : undefined, credentialSubject: cred.credential_definition.credentialSubject
                        ? removeDisplayAndValueTypes(cred.credential_definition.credentialSubject)
                        : undefined });
            }
            return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ type: 'openid_credential', locations }, (credential_definition && { credential_definition })), (credential_configuration_id && { credential_configuration_id })), (format && { format })), (vct && { vct, claims: cred.claims ? removeDisplayAndValueTypes(cred.claims) : undefined })), (doctype && { doctype, claims: cred.claims ? removeDisplayAndValueTypes(cred.claims) : undefined }));
        });
        if (!authorizationDetails || authorizationDetails.length === 0) {
            throw Error(`Could not create authorization details from credential offer. Please pass in explicit details`);
        }
    }
    if (!(endpointMetadata === null || endpointMetadata === void 0 ? void 0 : endpointMetadata.authorization_endpoint)) {
        throw Error('Server metadata does not contain authorization endpoint');
    }
    const parEndpoint = authorizationMetadata === null || authorizationMetadata === void 0 ? void 0 : authorizationMetadata.pushed_authorization_request_endpoint;
    let queryObj = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ response_type: oid4vci_common_1.ResponseType.AUTH_CODE }, (!pkce.disabled && {
        code_challenge_method: (_e = pkce.codeChallengeMethod) !== null && _e !== void 0 ? _e : oid4vci_common_1.CodeChallengeMethod.S256,
        code_challenge: pkce.codeChallenge,
    })), { authorization_details: JSON.stringify(handleAuthorizationDetails(endpointMetadata, authorizationDetails)) }), (redirectUri && { redirect_uri: redirectUri })), (client_id && { client_id })), ((credentialOffer === null || credentialOffer === void 0 ? void 0 : credentialOffer.issuerState) && { issuer_state: credentialOffer.issuerState })), { scope: authorizationRequest.scope });
    if (!parEndpoint && parMode === oid4vci_common_1.PARMode.REQUIRE) {
        throw Error(`PAR mode is set to required by Authorization Server does not support PAR!`);
    }
    else if (parEndpoint && parMode !== oid4vci_common_1.PARMode.NEVER) {
        debug(`USING PAR with endpoint ${parEndpoint}`);
        const parResponse = yield (0, oid4vci_common_1.formPost)(parEndpoint, (0, oid4vci_common_1.convertJsonToURI)(queryObj, {
            mode: oid4vci_common_1.JsonURIMode.X_FORM_WWW_URLENCODED,
            uriTypeProperties: ['client_id', 'request_uri', 'redirect_uri', 'scope', 'authorization_details', 'issuer_state'],
        }), { contentType: 'application/x-www-form-urlencoded', accept: 'application/json', customHeaders: headers });
        if (parResponse.errorBody || !parResponse.successBody) {
            if (parMode === oid4vci_common_1.PARMode.REQUIRE) {
                throw Error(`PAR error: ${parResponse.origResponse.statusText}`);
            }
            debug('Falling back to regular request URI, since PAR failed', JSON.stringify(parResponse.errorBody));
        }
        else {
            debug(`PAR response: ${JSON.stringify(parResponse.successBody, null, 2)}`);
            queryObj = { /*response_type: ResponseType.AUTH_CODE,*/ client_id, request_uri: parResponse.successBody.request_uri };
        }
    }
    yield createSignedAuthRequestWhenNeeded(queryObj, Object.assign(Object.assign({}, requestObjectOpts), { aud: endpointMetadata.authorization_server }));
    debug(`Object that will become query params: ` + JSON.stringify(queryObj, null, 2));
    const url = (0, oid4vci_common_1.convertJsonToURI)(queryObj, {
        baseUrl: endpointMetadata.authorization_endpoint,
        uriTypeProperties: ['client_id', 'request_uri', 'redirect_uri', 'scope', 'authorization_details', 'issuer_state'],
        // arrayTypeProperties: ['authorization_details'],
        mode: oid4vci_common_1.JsonURIMode.X_FORM_WWW_URLENCODED,
        // We do not add the version here, as this always needs to be form encoded
    });
    debug(`Authorization Request URL: ${url}`);
    return url;
});
exports.createAuthorizationRequestUrl = createAuthorizationRequestUrl;
const handleAuthorizationDetails = (endpointMetadata, authorizationDetails) => {
    if (authorizationDetails) {
        if (typeof authorizationDetails === 'string') {
            // backwards compat for older versions of the lib
            return authorizationDetails;
        }
        if (Array.isArray(authorizationDetails)) {
            return authorizationDetails
                .filter((value) => typeof value !== 'string')
                .map((value) => handleLocations(endpointMetadata, typeof value === 'string' ? value : Object.assign({}, value)));
        }
        else {
            return handleLocations(endpointMetadata, Object.assign({}, authorizationDetails));
        }
    }
    return authorizationDetails;
};
const handleLocations = (endpointMetadata, authorizationDetails) => {
    var _a;
    if (typeof authorizationDetails === 'string') {
        // backwards compat for older versions of the lib
        return authorizationDetails;
    }
    if (authorizationDetails && (((_a = endpointMetadata.credentialIssuerMetadata) === null || _a === void 0 ? void 0 : _a.authorization_server) || endpointMetadata.authorization_endpoint)) {
        if (authorizationDetails.locations) {
            if (Array.isArray(authorizationDetails.locations)) {
                authorizationDetails.locations.push(endpointMetadata.issuer);
            }
            else {
                authorizationDetails.locations = [authorizationDetails.locations, endpointMetadata.issuer];
            }
        }
        else {
            authorizationDetails.locations = [endpointMetadata.issuer];
        }
    }
    return authorizationDetails;
};
//# sourceMappingURL=AuthorizationCodeClient.js.map