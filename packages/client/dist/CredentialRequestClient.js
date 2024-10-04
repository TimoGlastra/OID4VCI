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
exports.CredentialRequestClient = void 0;
exports.buildProof = buildProof;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const debug_1 = __importDefault(require("debug"));
const ProofOfPossessionBuilder_1 = require("./ProofOfPossessionBuilder");
const dpopUtil_1 = require("./functions/dpopUtil");
const debug = (0, debug_1.default)('sphereon:oid4vci:credential');
function buildProof(proofInput, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if ('proof_type' in proofInput) {
            if (opts.cNonce) {
                throw Error(`Cnonce param is only supported when using a Proof of possession builder`);
            }
            return yield ProofOfPossessionBuilder_1.ProofOfPossessionBuilder.fromProof(proofInput, opts.version).build();
        }
        if (opts.cNonce) {
            proofInput.withAccessTokenNonce(opts.cNonce);
        }
        return yield proofInput.build();
    });
}
class CredentialRequestClient {
    get credentialRequestOpts() {
        return this._credentialRequestOpts;
    }
    isDeferred() {
        return this._isDeferred;
    }
    getCredentialEndpoint() {
        return this.credentialRequestOpts.credentialEndpoint;
    }
    getDeferredCredentialEndpoint() {
        return this.credentialRequestOpts.deferredCredentialEndpoint;
    }
    constructor(builder) {
        this._isDeferred = false;
        this._credentialRequestOpts = Object.assign({}, builder);
    }
    /**
     * Typically you should not use this method, as it omits a proof from the request.
     * There are certain issuers that in specific circumstances can do without this proof, because they have other means of user binding
     * like using DPoP together with an authorization code flow. These are however rare, so you should be using the acquireCredentialsUsingProof normally
     * @param opts
     */
    acquireCredentialsWithoutProof(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { credentialIdentifier, credentialTypes, format, context, subjectIssuance } = opts;
            const request = yield this.createCredentialRequestWithoutProof({
                credentialTypes,
                context,
                format,
                version: this.version(),
                credentialIdentifier,
                subjectIssuance,
            });
            return yield this.acquireCredentialsUsingRequestWithoutProof(request, opts.createDPoPOpts);
        });
    }
    acquireCredentialsUsingProof(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { credentialIdentifier, credentialTypes, proofInput, format, context, subjectIssuance, additionalRequestClaims, customBody } = opts;
            const request = yield this.createCredentialRequest({
                proofInput,
                credentialTypes,
                context,
                format,
                version: this.version(),
                credentialIdentifier,
                subjectIssuance,
                additionalRequestClaims
            });
            return yield this.acquireCredentialsUsingRequest(request, opts.createDPoPOpts, customBody);
        });
    }
    acquireCredentialsUsingRequestWithoutProof(uniformRequest, createDPoPOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.acquireCredentialsUsingRequestImpl(uniformRequest, createDPoPOpts);
        });
    }
    acquireCredentialsUsingRequest(uniformRequest, createDPoPOpts, customBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.acquireCredentialsUsingRequestImpl(uniformRequest, createDPoPOpts, customBody);
        });
    }
    acquireCredentialsUsingRequestImpl(uniformRequest, createDPoPOpts, customBody) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (this.version() < oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13) {
                throw new Error('Versions below v1.0.13 (draft 13) are not supported by the V13 credential request client.');
            }
            const request = (0, oid4vci_common_1.getCredentialRequestForVersion)(uniformRequest, this.version());
            const credentialEndpoint = this.credentialRequestOpts.credentialEndpoint;
            if (!(0, oid4vci_common_1.isValidURL)(credentialEndpoint)) {
                debug(`Invalid credential endpoint: ${credentialEndpoint}`);
                throw new Error(oid4vci_common_1.URL_NOT_VALID);
            }
            debug(`Acquiring credential(s) from: ${credentialEndpoint}`);
            debug(`request\n: ${JSON.stringify(request, null, 2)}`);
            const requestToken = this.credentialRequestOpts.token;
            let dPoP = createDPoPOpts ? yield (0, oid4vc_common_1.createDPoP)((0, oid4vc_common_1.getCreateDPoPOptions)(createDPoPOpts, credentialEndpoint, { accessToken: requestToken })) : undefined;
            let response = (yield (0, oid4vci_common_1.post)(credentialEndpoint, JSON.stringify(customBody !== null && customBody !== void 0 ? customBody : request), Object.assign({ bearerToken: requestToken }, (dPoP && { customHeaders: { dpop: dPoP } }))));
            let nextDPoPNonce = createDPoPOpts === null || createDPoPOpts === void 0 ? void 0 : createDPoPOpts.jwtPayloadProps.nonce;
            const retryWithNonce = (0, dpopUtil_1.shouldRetryResourceRequestWithDPoPNonce)(response);
            if (retryWithNonce.ok && createDPoPOpts) {
                createDPoPOpts.jwtPayloadProps.nonce = retryWithNonce.dpopNonce;
                dPoP = yield (0, oid4vc_common_1.createDPoP)((0, oid4vc_common_1.getCreateDPoPOptions)(createDPoPOpts, credentialEndpoint, { accessToken: requestToken }));
                response = (yield (0, oid4vci_common_1.post)(credentialEndpoint, JSON.stringify(customBody !== null && customBody !== void 0 ? customBody : request), Object.assign({ bearerToken: requestToken }, (createDPoPOpts && { customHeaders: { dpop: dPoP } }))));
                const successDPoPNonce = response.origResponse.headers.get('DPoP-Nonce');
                nextDPoPNonce = successDPoPNonce !== null && successDPoPNonce !== void 0 ? successDPoPNonce : retryWithNonce.dpopNonce;
            }
            this._isDeferred = (0, oid4vci_common_1.isDeferredCredentialResponse)(response);
            if (this.isDeferred() && this.credentialRequestOpts.deferredCredentialAwait && response.successBody) {
                response = yield this.acquireDeferredCredential(response.successBody, { bearerToken: this.credentialRequestOpts.token });
            }
            response.access_token = requestToken;
            if ((uniformRequest.credential_subject_issuance && response.successBody) || ((_a = response.successBody) === null || _a === void 0 ? void 0 : _a.credential_subject_issuance)) {
                if (JSON.stringify(uniformRequest.credential_subject_issuance) !== JSON.stringify((_b = response.successBody) === null || _b === void 0 ? void 0 : _b.credential_subject_issuance)) {
                    throw Error('Subject signing was requested, but issuer did not provide the options in its response');
                }
            }
            debug(`Credential endpoint ${credentialEndpoint} response:\r\n${JSON.stringify(response, null, 2)}`);
            return Object.assign(Object.assign({}, response), (nextDPoPNonce && { params: { dpop: { dpopNonce: nextDPoPNonce } } }));
        });
    }
    acquireDeferredCredential(response, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const transactionId = response.transaction_id;
            const bearerToken = (_a = response.acceptance_token) !== null && _a !== void 0 ? _a : opts === null || opts === void 0 ? void 0 : opts.bearerToken;
            const deferredCredentialEndpoint = this.getDeferredCredentialEndpoint();
            if (!deferredCredentialEndpoint) {
                throw Error(`No deferred credential endpoint supplied.`);
            }
            else if (!bearerToken) {
                throw Error(`No bearer token present and refresh for defered endpoint not supported yet`);
                // todo updated bearer token with new c_nonce
            }
            return yield (0, oid4vci_common_1.acquireDeferredCredential)({
                bearerToken,
                transactionId,
                deferredCredentialEndpoint,
                deferredCredentialAwait: this.credentialRequestOpts.deferredCredentialAwait,
                deferredCredentialIntervalInMS: this.credentialRequestOpts.deferredCredentialIntervalInMS,
            });
        });
    }
    createCredentialRequestWithoutProof(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createCredentialRequestImpl(opts);
        });
    }
    createCredentialRequest(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createCredentialRequestImpl(opts);
        });
    }
    createCredentialRequestImpl(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { proofInput, credentialIdentifier: credential_identifier, additionalRequestClaims } = opts;
            let proof = undefined;
            if (proofInput) {
                proof = yield buildProof(proofInput, opts);
            }
            if (credential_identifier) {
                if (opts.format || opts.credentialTypes || opts.context) {
                    throw Error(`You cannot mix credential_identifier with format, credential types and/or context`);
                }
                return Object.assign({ credential_identifier }, (proof && { proof }));
            }
            const format = (_a = opts.format) !== null && _a !== void 0 ? _a : this.credentialRequestOpts.format;
            if (!format) {
                throw Error(`Format of credential to be issued is missing`);
            }
            const typesSelection = (opts === null || opts === void 0 ? void 0 : opts.credentialTypes) && (typeof opts.credentialTypes === 'string' || opts.credentialTypes.length > 0)
                ? opts.credentialTypes
                : this.credentialRequestOpts.credentialTypes;
            if (!typesSelection) {
                throw Error(`Credential type(s) need to be provided`);
            }
            const types = Array.isArray(typesSelection) ? typesSelection : [typesSelection];
            if (types.length === 0) {
                throw Error(`Credential type(s) need to be provided`);
            }
            // TODO: we should move format specific logic
            if (format === 'jwt_vc_json' || format === 'jwt_vc') {
                return Object.assign(Object.assign({ credential_definition: {
                        type: types,
                    }, format }, (proof && { proof })), opts.subjectIssuance);
            }
            else if (format === 'jwt_vc_json-ld' || format === 'ldp_vc') {
                if (this.version() >= oid4vci_common_1.OpenId4VCIVersion.VER_1_0_12 && !opts.context) {
                    throw Error('No @context value present, but it is required');
                }
                return Object.assign(Object.assign(Object.assign({ format }, (proof && { proof })), opts.subjectIssuance), { credential_definition: {
                        type: types,
                        '@context': opts.context,
                    } });
            }
            else if (format === 'vc+sd-jwt') {
                if (types.length > 1) {
                    throw Error(`Only a single credential type is supported for ${format}`);
                }
                return Object.assign(Object.assign(Object.assign(Object.assign({ format }, (proof && { proof })), { vct: types[0] }), opts.subjectIssuance), (additionalRequestClaims !== null && additionalRequestClaims !== void 0 ? additionalRequestClaims : {}));
            }
            else if (format === 'mso_mdoc') {
                if (types.length > 1) {
                    throw Error(`Only a single credential type is supported for ${format}`);
                }
                return Object.assign(Object.assign(Object.assign({ format }, (proof && { proof })), { doctype: types[0] }), opts.subjectIssuance);
            }
            throw new Error(`Unsupported credential format: ${format}`);
        });
    }
    version() {
        var _a, _b;
        return (_b = (_a = this.credentialRequestOpts) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13;
    }
}
exports.CredentialRequestClient = CredentialRequestClient;
//# sourceMappingURL=CredentialRequestClient.js.map