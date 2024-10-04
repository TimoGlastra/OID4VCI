"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.VcIssuer = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const oid4vci_common_2 = require("@sphereon/oid4vci-common");
const ssi_types_1 = require("@sphereon/ssi-types");
const functions_1 = require("./functions");
const state_manager_1 = require("./state-manager");
class VcIssuer {
    constructor(issuerMetadata, args) {
        var _a;
        this.setDefaultTokenEndpoint(issuerMetadata);
        this._issuerMetadata = issuerMetadata;
        this._defaultCredentialOfferBaseUri = args.defaultCredentialOfferBaseUri;
        this._credentialOfferSessions = args.credentialOfferSessions;
        this._cNonces = args.cNonces;
        this._uris = args.uris;
        this._credentialSignerCallback = args === null || args === void 0 ? void 0 : args.credentialSignerCallback;
        this._jwtVerifyCallback = args === null || args === void 0 ? void 0 : args.jwtVerifyCallback;
        this._credentialDataSupplier = args === null || args === void 0 ? void 0 : args.credentialDataSupplier;
        this._cNonceExpiresIn = ((_a = args === null || args === void 0 ? void 0 : args.cNonceExpiresIn) !== null && _a !== void 0 ? _a : (process.env.C_NONCE_EXPIRES_IN ? parseInt(process.env.C_NONCE_EXPIRES_IN) : 300));
    }
    getCredentialOfferSessionById(id) {
        if (!this.uris) {
            throw Error('Cannot lookup credential offer by id if URI state manager is not set');
        }
        return new state_manager_1.LookupStateManager(this.uris, this._credentialOfferSessions, 'uri').getAsserted(id);
    }
    createCredentialOfferURI(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            let preAuthorizedCode = undefined;
            let issuerState = undefined;
            const { grants, credential_configuration_ids } = opts;
            if (!(grants === null || grants === void 0 ? void 0 : grants.authorization_code) && !(grants === null || grants === void 0 ? void 0 : grants[oid4vci_common_1.PRE_AUTH_GRANT_LITERAL])) {
                throw Error(`No grant issuer state or pre-authorized code could be deduced`);
            }
            const credentialOfferPayload = Object.assign(Object.assign(Object.assign({}, (grants && { grants })), (credential_configuration_ids && { credential_configuration_ids: credential_configuration_ids !== null && credential_configuration_ids !== void 0 ? credential_configuration_ids : [] })), { credential_issuer: this.issuerMetadata.credential_issuer });
            if (grants === null || grants === void 0 ? void 0 : grants.authorization_code) {
                issuerState = grants === null || grants === void 0 ? void 0 : grants.authorization_code.issuer_state;
                if (!issuerState) {
                    issuerState = (0, oid4vc_common_1.uuidv4)();
                    grants.authorization_code.issuer_state = issuerState;
                }
            }
            let txCode;
            if (grants === null || grants === void 0 ? void 0 : grants[oid4vci_common_1.PRE_AUTH_GRANT_LITERAL]) {
                preAuthorizedCode = (_a = grants === null || grants === void 0 ? void 0 : grants[oid4vci_common_1.PRE_AUTH_GRANT_LITERAL]) === null || _a === void 0 ? void 0 : _a[oid4vci_common_1.PRE_AUTH_CODE_LITERAL];
                txCode = (_b = grants === null || grants === void 0 ? void 0 : grants[oid4vci_common_1.PRE_AUTH_GRANT_LITERAL]) === null || _b === void 0 ? void 0 : _b.tx_code;
                if (txCode !== undefined) {
                    if (!(txCode === null || txCode === void 0 ? void 0 : txCode.length)) {
                        txCode.length = (_c = opts.pinLength) !== null && _c !== void 0 ? _c : 4;
                    }
                    grants[oid4vci_common_1.PRE_AUTH_GRANT_LITERAL].tx_code = txCode;
                }
                if (!preAuthorizedCode) {
                    preAuthorizedCode = (0, oid4vc_common_1.uuidv4)();
                    grants[oid4vci_common_1.PRE_AUTH_GRANT_LITERAL][oid4vci_common_1.PRE_AUTH_CODE_LITERAL] = preAuthorizedCode;
                }
            }
            const baseUri = (_d = opts === null || opts === void 0 ? void 0 : opts.baseUri) !== null && _d !== void 0 ? _d : this.defaultCredentialOfferBaseUri;
            const credentialOfferObject = (0, functions_1.createCredentialOfferObject)(this._issuerMetadata, Object.assign(Object.assign({}, opts), { txCode, credentialOffer: credentialOfferPayload, baseUri,
                preAuthorizedCode,
                issuerState }));
            let userPin;
            // todo: Double check this can only happen in pre-auth flow and if so make sure to not do the below when in a state is present (authorized flow)
            if (txCode) {
                const pinLength = (_f = (_e = txCode.length) !== null && _e !== void 0 ? _e : opts.pinLength) !== null && _f !== void 0 ? _f : 4;
                userPin = ('' + Math.round((Math.pow(10, pinLength) - 1) * Math.random())).padStart(pinLength, '0');
                (0, functions_1.assertValidPinNumber)(userPin, pinLength);
            }
            const createdAt = +new Date();
            const lastUpdatedAt = createdAt;
            if (opts === null || opts === void 0 ? void 0 : opts.credentialOfferUri) {
                if (!this.uris) {
                    throw Error('No URI state manager set, whilst apparently credential offer URIs are being used');
                }
                yield this.uris.set(opts.credentialOfferUri, {
                    uri: opts.credentialOfferUri,
                    createdAt: createdAt,
                    preAuthorizedCode,
                    issuerState,
                });
            }
            const credentialOffer = yield (0, oid4vci_common_1.toUniformCredentialOfferRequest)({
                credential_offer: credentialOfferObject.credential_offer,
                credential_offer_uri: credentialOfferObject.credential_offer_uri,
            }, {
                version: oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13,
                resolve: false, // We are creating the object, so do not resolve
            });
            const status = oid4vci_common_1.IssueStatus.OFFER_CREATED;
            const session = Object.assign(Object.assign(Object.assign({ preAuthorizedCode,
                issuerState,
                createdAt,
                lastUpdatedAt,
                status, notification_id: (0, oid4vc_common_1.uuidv4)() }, (userPin && { txCode: userPin })), (opts.credentialDataSupplierInput && { credentialDataSupplierInput: opts.credentialDataSupplierInput })), { credentialOffer });
            if (preAuthorizedCode) {
                yield this.credentialOfferSessions.set(preAuthorizedCode, session);
            }
            // todo: check whether we could have the same value for issuer state and pre auth code if both are supported.
            if (issuerState) {
                yield this.credentialOfferSessions.set(issuerState, session);
            }
            const uri = (0, functions_1.createCredentialOfferURIFromObject)(credentialOffer, Object.assign(Object.assign({}, opts), { baseUri }));
            let qrCodeDataUri;
            if (opts.qrCodeOpts) {
                const { AwesomeQR } = yield Promise.resolve().then(() => __importStar(require('awesome-qr')));
                const qrCode = new AwesomeQR(Object.assign(Object.assign({}, opts.qrCodeOpts), { text: uri }));
                qrCodeDataUri = `data:image/png;base64,${(yield qrCode.draw()).toString('base64')}`;
            }
            oid4vci_common_2.EVENTS.emit(oid4vci_common_2.CredentialOfferEventNames.OID4VCI_OFFER_CREATED, {
                eventName: oid4vci_common_2.CredentialOfferEventNames.OID4VCI_OFFER_CREATED,
                id: (0, oid4vc_common_1.uuidv4)(),
                data: uri,
                initiator: '<unknown>',
                initiatorType: ssi_types_1.InitiatorType.EXTERNAL,
                system: ssi_types_1.System.OID4VCI,
                // todo: Issuer
                subsystem: ssi_types_1.SubSystem.API,
            });
            return Object.assign({ session,
                uri,
                qrCodeDataUri,
                txCode }, (userPin !== undefined && { userPin, pinLength: (_g = userPin === null || userPin === void 0 ? void 0 : userPin.length) !== null && _g !== void 0 ? _g : 0 }));
        });
    }
    /**
     * issueCredentialFromIssueRequest
     * @param opts issuerRequestParams
     *  - issueCredentialsRequest the credential request
     *  - issuerState the state of the issuer
     *  - jwtVerifyCallback callback that verifies the Proof of Possession JWT
     *  - issuerCallback callback to issue a Verifiable Credential
     *  - cNonce an existing c_nonce
     */
    issueCredential(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            /*if (!('credential_identifier' in opts.credentialRequest)) {
              throw new Error('credential request should be of spec version 1.0.13 or above')
            }*/
            const credentialRequest = opts.credentialRequest;
            let preAuthorizedCode;
            let issuerState;
            try {
                if (!('credential_identifier' in credentialRequest) && !credentialRequest.format) {
                    throw new Error('credential request should either have a credential_identifier or format and type');
                }
                if (credentialRequest.format && !this.isMetadataSupportCredentialRequestFormat(credentialRequest.format)) {
                    throw new Error(oid4vci_common_1.TokenErrorResponse.invalid_request);
                }
                const validated = yield this.validateCredentialRequestProof(Object.assign(Object.assign({}, opts), { tokenExpiresIn: (_a = opts.tokenExpiresIn) !== null && _a !== void 0 ? _a : 180 }));
                preAuthorizedCode = validated.preAuthorizedCode;
                issuerState = validated.issuerState;
                const { preAuthSession, authSession, cNonceState, jwtVerifyResult } = validated;
                const did = jwtVerifyResult.did;
                const jwk = jwtVerifyResult.jwk;
                const kid = jwtVerifyResult.kid;
                const newcNonce = opts.newCNonce ? opts.newCNonce : (0, oid4vc_common_1.uuidv4)();
                const newcNonceState = Object.assign(Object.assign({ cNonce: newcNonce, createdAt: +new Date() }, ((authSession === null || authSession === void 0 ? void 0 : authSession.issuerState) && { issuerState: authSession.issuerState })), (preAuthSession && { preAuthorizedCode: preAuthSession.preAuthorizedCode }));
                yield this.cNonces.set(newcNonce, newcNonceState);
                if (!opts.credential && this._credentialDataSupplier === undefined && opts.credentialDataSupplier === undefined) {
                    throw Error(`Either a credential needs to be supplied or a credentialDataSupplier`);
                }
                let credential;
                let format = credentialRequest.format;
                let signerCallback = opts.credentialSignerCallback;
                if (opts.credential) {
                    credential = opts.credential;
                }
                else {
                    const credentialDataSupplier = typeof opts.credentialDataSupplier === 'function' ? opts.credentialDataSupplier : this._credentialDataSupplier;
                    if (typeof credentialDataSupplier !== 'function') {
                        throw Error('Data supplier is mandatory if no credential is supplied');
                    }
                    const session = preAuthorizedCode && preAuthSession ? preAuthSession : authSession;
                    if (!session) {
                        throw Error('Either a preAuth or Auth session is required, none found');
                    }
                    const credentialOffer = session.credentialOffer;
                    if (!credentialOffer) {
                        throw Error('Credential Offer missing');
                    }
                    const credentialDataSupplierInput = (_b = opts.credentialDataSupplierInput) !== null && _b !== void 0 ? _b : session.credentialDataSupplierInput;
                    const result = yield credentialDataSupplier(Object.assign(Object.assign(Object.assign({}, cNonceState), { credentialRequest: opts.credentialRequest, credentialSupplierConfig: this._issuerMetadata.credential_supplier_config, credentialOffer /*todo: clientId: */ }), (credentialDataSupplierInput && { credentialDataSupplierInput })));
                    credential = result.credential;
                    if (result.format) {
                        format = result.format;
                    }
                    if (typeof result.signCallback === 'function') {
                        signerCallback = result.signCallback;
                    }
                }
                if (!credential) {
                    throw Error('A credential needs to be supplied at this point');
                }
                // Bind credential to the provided proof of possession
                if (ssi_types_1.CredentialMapper.isSdJwtDecodedCredentialPayload(credential) && (kid || jwk) && !credential.cnf) {
                    if (kid) {
                        credential.cnf = {
                            kid,
                        };
                    }
                    else if (jwk) {
                        credential.cnf = {
                            jwk,
                        };
                    }
                }
                if (did && !ssi_types_1.CredentialMapper.isSdJwtDecodedCredentialPayload(credential)) {
                    const credentialSubjects = Array.isArray(credential.credentialSubject) ? credential.credentialSubject : [credential.credentialSubject];
                    credentialSubjects.map((subject) => {
                        if (!subject.id) {
                            subject.id = did;
                        }
                        return subject;
                    });
                    credential.credentialSubject = Array.isArray(credential.credentialSubject) ? credentialSubjects : credentialSubjects[0];
                }
                let issuer = undefined;
                if (credential.iss) {
                    issuer = credential.iss;
                }
                else if (credential.issuer) {
                    if (typeof credential.issuer === 'string') {
                        issuer = credential.issuer;
                    }
                    else if (typeof credential.issuer === 'object' && 'id' in credential.issuer && typeof credential.issuer.id === 'string') {
                        issuer = credential.issuer.id;
                    }
                }
                const verifiableCredential = yield this.issueCredentialImpl({
                    credentialRequest: opts.credentialRequest,
                    format,
                    credential,
                    jwtVerifyResult,
                    issuer,
                }, signerCallback);
                // TODO implement acceptance_token (deferred response)
                // TODO update verification accordingly
                if (!verifiableCredential) {
                    // credential: OPTIONAL. Contains issued Credential. MUST be present when acceptance_token is not returned. MAY be a JSON string or a JSON object, depending on the Credential format. See Appendix E for the Credential format specific encoding requirements
                    throw new Error(oid4vci_common_1.CREDENTIAL_MISSING_ERROR);
                }
                // remove the previous nonce
                yield this.cNonces.delete(cNonceState.cNonce);
                let notification_id;
                if (preAuthorizedCode && preAuthSession) {
                    preAuthSession.lastUpdatedAt = +new Date();
                    preAuthSession.status = oid4vci_common_1.IssueStatus.CREDENTIAL_ISSUED;
                    notification_id = preAuthSession.notification_id;
                    yield this._credentialOfferSessions.set(preAuthorizedCode, preAuthSession);
                }
                else if (issuerState && authSession) {
                    // If both were set we used the pre auth flow above as well, hence the else if
                    authSession.lastUpdatedAt = +new Date();
                    authSession.status = oid4vci_common_1.IssueStatus.CREDENTIAL_ISSUED;
                    notification_id = authSession.notification_id;
                    yield this._credentialOfferSessions.set(issuerState, authSession);
                }
                const response = Object.assign({ credential: verifiableCredential, 
                    // format: credentialRequest.format,
                    c_nonce: newcNonce, c_nonce_expires_in: this._cNonceExpiresIn }, (notification_id && { notification_id }));
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const experimentalSubjectIssuance = opts.credentialRequest.credential_subject_issuance;
                if (experimentalSubjectIssuance === null || experimentalSubjectIssuance === void 0 ? void 0 : experimentalSubjectIssuance.subject_proof_mode) {
                    if (experimentalSubjectIssuance.subject_proof_mode !== 'proof_replace') {
                        throw Error('Only proof replace is supported currently');
                    }
                    response.transaction_id = authSession === null || authSession === void 0 ? void 0 : authSession.issuerState;
                    response.credential_subject_issuance = experimentalSubjectIssuance;
                }
                return response;
            }
            catch (error) {
                yield this.updateErrorStatus({ preAuthorizedCode, issuerState, error });
                throw error;
            }
        });
    }
    updateErrorStatus(_a) {
        return __awaiter(this, arguments, void 0, function* ({ preAuthorizedCode, error, issuerState, }) {
            if (preAuthorizedCode) {
                const preAuthSession = yield this._credentialOfferSessions.get(preAuthorizedCode);
                if (preAuthSession) {
                    preAuthSession.lastUpdatedAt = +new Date();
                    preAuthSession.status = oid4vci_common_1.IssueStatus.ERROR;
                    preAuthSession.error = error instanceof Error ? error.message : error === null || error === void 0 ? void 0 : error.toString();
                    yield this._credentialOfferSessions.set(preAuthorizedCode, preAuthSession);
                }
            }
            if (issuerState) {
                const authSession = yield this._credentialOfferSessions.get(issuerState);
                if (authSession) {
                    authSession.lastUpdatedAt = +new Date();
                    authSession.status = oid4vci_common_1.IssueStatus.ERROR;
                    authSession.error = error instanceof Error ? error.message : error === null || error === void 0 ? void 0 : error.toString();
                    yield this._credentialOfferSessions.set(issuerState, authSession);
                }
            }
        });
    }
    /*
      private async retrieveGrantsAndCredentialOfferSession(id: string): Promise<{
        clientId?: string;
        grants?: Grant,
        session: CredentialOfferSession
      }> {
        const session: CredentialOfferSession | undefined = await this._credentialOfferSessions.getAsserted(id)
        const clientId = session?.clientId
        const grants = session?.credentialOffer?.credential_offer?.grants
        if (!grants?.authorization_code?.issuer_state && !grants?.[PRE_AUTH_GRANT_LITERAL]?.[PRE_AUTH_CODE_LITERAL]) {
          throw new Error(GRANTS_MUST_NOT_BE_UNDEFINED)
        }
        return { session, clientId, grants }
      }*/
    validateCredentialRequestProof(_a) {
        return __awaiter(this, arguments, void 0, function* ({ credentialRequest, jwtVerifyCallback, tokenExpiresIn, }) {
            var _b, _c, _d, _e, _f, _g;
            let preAuthorizedCode;
            let issuerState;
            const supportedIssuanceFormats = ['jwt_vc_json', 'jwt_vc_json-ld', 'vc+sd-jwt', 'ldp_vc'];
            try {
                if (credentialRequest.format && !supportedIssuanceFormats.includes(credentialRequest.format)) {
                    throw Error(`Format ${credentialRequest.format} not supported yet`);
                }
                else if (typeof this._jwtVerifyCallback !== 'function' && typeof jwtVerifyCallback !== 'function') {
                    throw new Error(oid4vci_common_1.JWT_VERIFY_CONFIG_ERROR);
                }
                else if (!credentialRequest.proof) {
                    throw Error('Proof of possession is required. No proof value present in credential request');
                }
                const jwtVerifyResult = jwtVerifyCallback
                    ? yield jwtVerifyCallback(credentialRequest.proof)
                    : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        yield this._jwtVerifyCallback(credentialRequest.proof);
                const { didDocument, did, jwt } = jwtVerifyResult;
                const { header, payload } = jwt;
                const { iss, aud, iat, nonce } = payload;
                if (!nonce) {
                    throw Error('No nonce was found in the Proof of Possession');
                }
                const cNonceState = yield this.cNonces.getAsserted(nonce);
                preAuthorizedCode = cNonceState.preAuthorizedCode;
                issuerState = cNonceState.issuerState;
                const createdAt = cNonceState.createdAt;
                // The verify callback should set the correct values, but let's look at the JWT ourselves to to be sure
                const alg = (_b = jwtVerifyResult.alg) !== null && _b !== void 0 ? _b : header.alg;
                const kid = (_c = jwtVerifyResult.kid) !== null && _c !== void 0 ? _c : header.kid;
                const jwk = (_d = jwtVerifyResult.jwk) !== null && _d !== void 0 ? _d : header.jwk;
                const x5c = (_e = jwtVerifyResult.x5c) !== null && _e !== void 0 ? _e : header.x5c;
                const typ = header.typ;
                if (typ !== 'openid4vci-proof+jwt') {
                    throw Error(oid4vci_common_1.TYP_ERROR);
                }
                else if (!alg) {
                    throw Error(oid4vci_common_1.ALG_ERROR);
                }
                else if (!([kid, jwk, x5c].filter((x) => !!x).length === 1)) {
                    // only 1 is allowed, but need to look into whether jwk and x5c are allowed together
                    throw Error(oid4vci_common_1.KID_JWK_X5C_ERROR);
                }
                else if (kid && !did) {
                    if (!jwk && !x5c) {
                        // Make sure the callback function extracts the DID from the kid
                        throw Error(oid4vci_common_1.KID_DID_NO_DID_ERROR);
                    }
                    else {
                        // If JWK or x5c is present, log the information and proceed
                        console.log(`KID present but no DID, using JWK or x5c`);
                    }
                }
                else if (did && !didDocument) {
                    // Make sure the callback function does DID resolution when a did is present
                    throw Error(oid4vci_common_1.DID_NO_DIDDOC_ERROR);
                }
                const preAuthSession = preAuthorizedCode ? yield this.credentialOfferSessions.get(preAuthorizedCode) : undefined;
                const authSession = issuerState ? yield this.credentialOfferSessions.get(issuerState) : undefined;
                if (!preAuthSession && !authSession) {
                    throw Error('Either a pre-authorized code or issuer state needs to be present');
                }
                if (preAuthSession) {
                    if (!preAuthSession.preAuthorizedCode || preAuthSession.preAuthorizedCode !== preAuthorizedCode) {
                        throw Error('Invalid pre-authorized code');
                    }
                    preAuthSession.lastUpdatedAt = +new Date();
                    preAuthSession.status = oid4vci_common_1.IssueStatus.CREDENTIAL_REQUEST_RECEIVED;
                    yield this._credentialOfferSessions.set(preAuthorizedCode, preAuthSession);
                }
                if (authSession) {
                    if (!authSession.issuerState || authSession.issuerState !== issuerState) {
                        throw Error('Invalid issuer state');
                    }
                    authSession.lastUpdatedAt = +new Date();
                    authSession.status = oid4vci_common_1.IssueStatus.CREDENTIAL_REQUEST_RECEIVED;
                }
                // https://www.rfc-editor.org/rfc/rfc6749.html#section-3.2.1
                // A client MAY use the "client_id" request parameter to identify itself
                // when sending requests to the token endpoint.  In the
                // "authorization_code" "grant_type" request to the token endpoint, an
                // unauthenticated client MUST send its "client_id" to prevent itself
                // from inadvertently accepting a code intended for a client with a
                // different "client_id".  This protects the client from substitution of
                // the authentication code.  (It provides no additional security for the
                // protected resource.)
                if (!iss && ((_g = (_f = authSession === null || authSession === void 0 ? void 0 : authSession.credentialOffer.credential_offer) === null || _f === void 0 ? void 0 : _f.grants) === null || _g === void 0 ? void 0 : _g.authorization_code)) {
                    throw new Error(oid4vci_common_1.NO_ISS_IN_AUTHORIZATION_CODE_CONTEXT);
                }
                // iss: OPTIONAL (string). The value of this claim MUST be the client_id of the client making the credential request.
                // This claim MUST be omitted if the Access Token authorizing the issuance call was obtained from a Pre-Authorized Code Flow through anonymous access to the Token Endpoint.
                // TODO We need to investigate further what the comment above means, because it's not clear if the client or the user may be authorized anonymously
                // if (iss && grants && grants[PRE_AUTH_GRANT_LITERAL]) {
                //   throw new Error(ISS_PRESENT_IN_PRE_AUTHORIZED_CODE_CONTEXT)
                // }
                /*if (iss && iss !== clientId) {
                  throw new Error(ISS_MUST_BE_CLIENT_ID + `iss: ${iss}, client_id: ${clientId}`)
                }*/
                if (!aud || aud !== this._issuerMetadata.credential_issuer) {
                    throw new Error(oid4vci_common_1.AUD_ERROR);
                }
                if (!iat) {
                    throw new Error(oid4vci_common_1.IAT_ERROR);
                }
                else if (iat > Math.round(createdAt / 1000) + tokenExpiresIn) {
                    // createdAt is in milliseconds whilst iat and tokenExpiresIn are in seconds
                    throw new Error(oid4vci_common_1.IAT_ERROR);
                }
                // todo: Add a check of iat against current TS on server with a skew
                return { jwtVerifyResult, preAuthorizedCode, preAuthSession, issuerState, authSession, cNonceState };
            }
            catch (error) {
                yield this.updateErrorStatus({ preAuthorizedCode, issuerState, error });
                throw error;
            }
        });
    }
    isMetadataSupportCredentialRequestFormat(requestFormat) {
        if (!this._issuerMetadata.credential_configurations_supported) {
            return false;
        }
        for (const credentialSupported of Object.values(this._issuerMetadata['credential_configurations_supported'])) {
            if (!Array.isArray(requestFormat) && credentialSupported.format === requestFormat) {
                return true;
            }
            else if (Array.isArray(requestFormat)) {
                for (const format of requestFormat) {
                    if (credentialSupported.format === format) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    issueCredentialImpl(opts, issuerCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if ((!opts.credential && !opts.credentialRequest) || !this._credentialSignerCallback) {
                throw new Error(oid4vci_common_1.ISSUER_CONFIG_ERROR);
            }
            const credential = issuerCallback ? yield issuerCallback(opts) : yield this._credentialSignerCallback(opts);
            // TODO: Create builder
            oid4vci_common_2.EVENTS.emit(oid4vci_common_2.CredentialEventNames.OID4VCI_CREDENTIAL_ISSUED, {
                eventName: oid4vci_common_2.CredentialEventNames.OID4VCI_CREDENTIAL_ISSUED,
                id: (0, oid4vc_common_1.uuidv4)(),
                data: credential,
                // TODO: Format, request etc
                initiator: (_a = opts.issuer) !== null && _a !== void 0 ? _a : '<unknown>',
                initiatorType: ssi_types_1.InitiatorType.EXTERNAL,
                system: ssi_types_1.System.OID4VCI,
                subsystem: ssi_types_1.SubSystem.VC_ISSUER,
            });
            return credential;
        });
    }
    setDefaultTokenEndpoint(issuerMetadata) {
        if (!issuerMetadata.token_endpoint) {
            issuerMetadata.token_endpoint = `${issuerMetadata.credential_issuer}/token`;
        }
    }
    get credentialSignerCallback() {
        return this._credentialSignerCallback;
    }
    get jwtVerifyCallback() {
        return this._jwtVerifyCallback;
    }
    get credentialDataSupplier() {
        return this._credentialDataSupplier;
    }
    get uris() {
        return this._uris;
    }
    get cNonceExpiresIn() {
        return this._cNonceExpiresIn;
    }
    get credentialOfferSessions() {
        return this._credentialOfferSessions;
    }
    get cNonces() {
        return this._cNonces;
    }
    get defaultCredentialOfferBaseUri() {
        return this._defaultCredentialOfferBaseUri;
    }
    get issuerMetadata() {
        return this._issuerMetadata;
    }
}
exports.VcIssuer = VcIssuer;
//# sourceMappingURL=VcIssuer.js.map