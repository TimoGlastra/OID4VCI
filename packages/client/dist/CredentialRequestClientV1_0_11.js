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
exports.CredentialRequestClientV1_0_11 = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const debug_1 = __importDefault(require("debug"));
const CredentialRequestClient_1 = require("./CredentialRequestClient");
const dpopUtil_1 = require("./functions/dpopUtil");
const debug = (0, debug_1.default)('sphereon:oid4vci:credential');
class CredentialRequestClientV1_0_11 {
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
    acquireCredentialsUsingProof(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { credentialTypes, proofInput, format, context } = opts;
            const request = yield this.createCredentialRequest({ proofInput, credentialTypes, context, format, version: this.version() });
            return yield this.acquireCredentialsUsingRequest(request, opts.createDPoPOpts);
        });
    }
    acquireCredentialsUsingRequest(uniformRequest, createDPoPOpts) {
        return __awaiter(this, void 0, void 0, function* () {
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
            let response = (yield (0, oid4vci_common_1.post)(credentialEndpoint, JSON.stringify(request), {
                bearerToken: requestToken,
                customHeaders: Object.assign({}, (createDPoPOpts && { dpop: dPoP })),
            }));
            let nextDPoPNonce = createDPoPOpts === null || createDPoPOpts === void 0 ? void 0 : createDPoPOpts.jwtPayloadProps.nonce;
            const retryWithNonce = (0, dpopUtil_1.shouldRetryResourceRequestWithDPoPNonce)(response);
            if (retryWithNonce.ok && createDPoPOpts) {
                createDPoPOpts.jwtPayloadProps.nonce = retryWithNonce.dpopNonce;
                dPoP = yield (0, oid4vc_common_1.createDPoP)((0, oid4vc_common_1.getCreateDPoPOptions)(createDPoPOpts, credentialEndpoint, { accessToken: requestToken }));
                response = (yield (0, oid4vci_common_1.post)(credentialEndpoint, JSON.stringify(request), {
                    bearerToken: requestToken,
                    customHeaders: Object.assign({}, (createDPoPOpts && { dpop: dPoP })),
                }));
                const successDPoPNonce = response.origResponse.headers.get('DPoP-Nonce');
                nextDPoPNonce = successDPoPNonce !== null && successDPoPNonce !== void 0 ? successDPoPNonce : retryWithNonce.dpopNonce;
            }
            this._isDeferred = (0, oid4vci_common_1.isDeferredCredentialResponse)(response);
            if (this.isDeferred() && this.credentialRequestOpts.deferredCredentialAwait && response.successBody) {
                response = yield this.acquireDeferredCredential(response.successBody, { bearerToken: this.credentialRequestOpts.token });
            }
            response.access_token = requestToken;
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
    createCredentialRequest(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { proofInput } = opts;
            const formatSelection = (_a = opts.format) !== null && _a !== void 0 ? _a : this.credentialRequestOpts.format;
            if (!formatSelection) {
                throw Error(`Format of credential to be issued is missing`);
            }
            const format = (0, oid4vci_common_1.getUniformFormat)(formatSelection);
            const typesSelection = (opts === null || opts === void 0 ? void 0 : opts.credentialTypes) && (typeof opts.credentialTypes === 'string' || opts.credentialTypes.length > 0)
                ? opts.credentialTypes
                : this.credentialRequestOpts.credentialTypes;
            const types = Array.isArray(typesSelection) ? typesSelection : [typesSelection];
            if (types.length === 0) {
                throw Error(`Credential type(s) need to be provided`);
            }
            // FIXME: this is mixing up the type (as id) from v8/v9 and the types (from the vc.type) from v11
            else if (!this.isV11OrHigher() && types.length !== 1) {
                throw Error('Only a single credential type is supported for V8/V9');
            }
            const proof = yield (0, CredentialRequestClient_1.buildProof)(proofInput, opts);
            // TODO: we should move format specific logic
            if (format === 'jwt_vc_json' || format === 'jwt_vc') {
                return {
                    types,
                    format,
                    proof,
                };
            }
            else if (format === 'jwt_vc_json-ld' || format === 'ldp_vc') {
                if (this.version() >= oid4vci_common_1.OpenId4VCIVersion.VER_1_0_12 && !opts.context) {
                    throw Error('No @context value present, but it is required');
                }
                return {
                    format,
                    proof,
                    // Ignored because v11 does not have the context value, but it is required in v12
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    credential_definition: Object.assign({ types }, (opts.context && { '@context': opts.context })),
                };
            }
            else if (format === 'vc+sd-jwt') {
                if (types.length > 1) {
                    throw Error(`Only a single credential type is supported for ${format}`);
                }
                return {
                    format,
                    proof,
                    vct: types[0],
                };
            }
            else if (format === 'mso_mdoc') {
                if (types.length > 1) {
                    throw Error(`Only a single credential type is supported for ${format}`);
                }
                return {
                    format,
                    proof,
                    doctype: types[0],
                };
            }
            throw new Error(`Unsupported format: ${format}`);
        });
    }
    version() {
        var _a, _b;
        return (_b = (_a = this.credentialRequestOpts) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : oid4vci_common_1.OpenId4VCIVersion.VER_1_0_11;
    }
    isV11OrHigher() {
        return this.version() >= oid4vci_common_1.OpenId4VCIVersion.VER_1_0_11;
    }
}
exports.CredentialRequestClientV1_0_11 = CredentialRequestClientV1_0_11;
//# sourceMappingURL=CredentialRequestClientV1_0_11.js.map