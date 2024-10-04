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
exports.OID4VCIServer = void 0;
const oid4vci_issuer_1 = require("@sphereon/oid4vci-issuer");
const express_1 = __importDefault(require("express"));
const oid4vci_api_functions_1 = require("./oid4vci-api-functions");
function buildVCIFromEnvironment() {
    const credentialsSupported = new oid4vci_issuer_1.CredentialSupportedBuilderV1_13()
        .withCredentialSigningAlgValuesSupported(process.env.credential_signing_alg_values_supported)
        .withCryptographicBindingMethod(process.env.cryptographic_binding_methods_supported)
        .withFormat(process.env.credential_supported_format)
        .withCredentialName(process.env.credential_supported_name_1)
        .withCredentialDefinition({
        type: [process.env.credential_supported_1_definition_type_1, process.env.credential_supported_1_definition_type_2],
        // TODO: setup credentialSubject here from env
        // credentialSubject
    })
        .withCredentialSupportedDisplay({
        name: process.env.credential_display_name,
        locale: process.env.credential_display_locale,
        logo: {
            url: process.env.credential_display_logo_url,
            alt_text: process.env.credential_display_logo_alt_text,
        },
        background_color: process.env.credential_display_background_color,
        text_color: process.env.credential_display_text_color,
    })
        .addCredentialSubjectPropertyDisplay(process.env.credential_subject_display_key1, {
        name: process.env.credential_subject_display_key1_name,
        locale: process.env.credential_subject_display_key1_locale,
    })
        .build();
    return new oid4vci_issuer_1.VcIssuerBuilder()
        .withTXCode({ length: process.env.user_pin_length, input_mode: process.env.user_pin_input_mode })
        .withAuthorizationServers(process.env.authorization_server)
        .withCredentialEndpoint(process.env.credential_endpoint)
        .withCredentialIssuer(process.env.credential_issuer)
        .withIssuerDisplay({
        name: process.env.issuer_name,
        locale: process.env.issuer_locale,
    })
        .withCredentialConfigurationsSupported(credentialsSupported)
        .withInMemoryCredentialOfferState()
        .withInMemoryCNonceState()
        .build();
}
class OID4VCIServer {
    constructor(expressSupport, opts /*If not supplied as argument, it will be fully configured from environment variables*/) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        this.authRequestsData = new Map();
        this._baseUrl = new URL((_e = (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.baseUrl) !== null && _a !== void 0 ? _a : process.env.BASE_URL) !== null && _b !== void 0 ? _b : (_d = (_c = opts === null || opts === void 0 ? void 0 : opts.issuer) === null || _c === void 0 ? void 0 : _c.issuerMetadata) === null || _d === void 0 ? void 0 : _d.credential_issuer) !== null && _e !== void 0 ? _e : 'http://localhost');
        this._expressSupport = expressSupport;
        this._app = expressSupport.express;
        this._router = express_1.default.Router();
        this._issuer = (opts === null || opts === void 0 ? void 0 : opts.issuer) ? opts.issuer : buildVCIFromEnvironment();
        (0, oid4vci_api_functions_1.pushedAuthorizationEndpoint)(this.router, this.issuer, this.authRequestsData);
        (0, oid4vci_api_functions_1.getMetadataEndpoint)(this.router, this.issuer);
        if (((_g = (_f = opts === null || opts === void 0 ? void 0 : opts.endpointOpts) === null || _f === void 0 ? void 0 : _f.createCredentialOfferOpts) === null || _g === void 0 ? void 0 : _g.enabled) !== false || process.env.CREDENTIAL_OFFER_ENDPOINT_EBALBED === 'true') {
            (0, oid4vci_api_functions_1.createCredentialOfferEndpoint)(this.router, this.issuer, (_h = opts === null || opts === void 0 ? void 0 : opts.endpointOpts) === null || _h === void 0 ? void 0 : _h.createCredentialOfferOpts);
        }
        (0, oid4vci_api_functions_1.getCredentialOfferEndpoint)(this.router, this.issuer, (_j = opts === null || opts === void 0 ? void 0 : opts.endpointOpts) === null || _j === void 0 ? void 0 : _j.getCredentialOfferOpts);
        (0, oid4vci_api_functions_1.getCredentialEndpoint)(this.router, this.issuer, Object.assign(Object.assign({}, (_k = opts === null || opts === void 0 ? void 0 : opts.endpointOpts) === null || _k === void 0 ? void 0 : _k.tokenEndpointOpts), { baseUrl: this.baseUrl }));
        this.assertAccessTokenHandling();
        if (!this.isTokenEndpointDisabled((_l = opts === null || opts === void 0 ? void 0 : opts.endpointOpts) === null || _l === void 0 ? void 0 : _l.tokenEndpointOpts)) {
            (0, oid4vci_api_functions_1.accessTokenEndpoint)(this.router, this.issuer, Object.assign(Object.assign({}, (_m = opts === null || opts === void 0 ? void 0 : opts.endpointOpts) === null || _m === void 0 ? void 0 : _m.tokenEndpointOpts), { baseUrl: this.baseUrl }));
        }
        if (this.isStatusEndpointEnabled((_o = opts === null || opts === void 0 ? void 0 : opts.endpointOpts) === null || _o === void 0 ? void 0 : _o.getStatusOpts)) {
            (0, oid4vci_api_functions_1.getIssueStatusEndpoint)(this.router, this.issuer, Object.assign(Object.assign({}, (_p = opts === null || opts === void 0 ? void 0 : opts.endpointOpts) === null || _p === void 0 ? void 0 : _p.getStatusOpts), { baseUrl: this.baseUrl }));
        }
        this._app.use((0, oid4vci_api_functions_1.getBasePath)(this.baseUrl), this._router);
    }
    get app() {
        return this._app;
    }
    /*public get server(): http.Server | undefined {
      return this._server
    }*/
    get router() {
        return this._router;
    }
    get issuer() {
        return this._issuer;
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._expressSupport) {
                throw Error('Cannot stop server is the REST API is only a router of an existing express app');
            }
            yield this._expressSupport.stop();
        });
    }
    isTokenEndpointDisabled(tokenEndpointOpts) {
        return (tokenEndpointOpts === null || tokenEndpointOpts === void 0 ? void 0 : tokenEndpointOpts.tokenEndpointDisabled) === true || process.env.TOKEN_ENDPOINT_DISABLED === 'true';
    }
    isStatusEndpointEnabled(statusEndpointOpts) {
        return (statusEndpointOpts === null || statusEndpointOpts === void 0 ? void 0 : statusEndpointOpts.enabled) !== false || process.env.STATUS_ENDPOINT_ENABLED === 'false';
    }
    assertAccessTokenHandling(tokenEndpointOpts) {
        const authServer = this.issuer.issuerMetadata.authorization_servers;
        if (this.isTokenEndpointDisabled(tokenEndpointOpts)) {
            if (!authServer) {
                throw Error(`No Authorization Server (AS) is defined in the issuer metadata and the token endpoint is disabled. An AS or token endpoints needs to be present`);
            }
            console.log('Token endpoint disabled by configuration');
        }
        else {
            if (authServer) {
                throw Error(`A Authorization Server (AS) was already enabled in the issuer metadata (${authServer}). Cannot both have an AS and enable the token endpoint at the same time `);
            }
        }
    }
    get baseUrl() {
        return this._baseUrl;
    }
}
exports.OID4VCIServer = OID4VCIServer;
//# sourceMappingURL=OID4VCIServer.js.map