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
exports.CredentialRequestClientBuilderV1_0_13 = void 0;
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const CredentialOfferClient_1 = require("./CredentialOfferClient");
const CredentialRequestClient_1 = require("./CredentialRequestClient");
class CredentialRequestClientBuilderV1_0_13 {
    constructor() {
        this.deferredCredentialAwait = false;
        this.deferredCredentialIntervalInMS = 5000;
        this.credentialTypes = [];
    }
    static fromCredentialIssuer({ credentialIssuer, metadata, version, credentialIdentifier, credentialTypes, }) {
        var _a;
        const issuer = credentialIssuer;
        const builder = new CredentialRequestClientBuilderV1_0_13();
        builder.withVersion(version !== null && version !== void 0 ? version : oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13);
        builder.withCredentialEndpoint((_a = metadata === null || metadata === void 0 ? void 0 : metadata.credential_endpoint) !== null && _a !== void 0 ? _a : (issuer.endsWith('/') ? `${issuer}credential` : `${issuer}/credential`));
        if (metadata === null || metadata === void 0 ? void 0 : metadata.deferred_credential_endpoint) {
            builder.withDeferredCredentialEndpoint(metadata.deferred_credential_endpoint);
        }
        if (credentialIdentifier) {
            builder.withCredentialIdentifier(credentialIdentifier);
        }
        if (credentialTypes) {
            builder.withCredentialType(credentialTypes);
        }
        return builder;
    }
    static fromURI(_a) {
        return __awaiter(this, arguments, void 0, function* ({ uri, metadata }) {
            const offer = yield CredentialOfferClient_1.CredentialOfferClient.fromURI(uri);
            return CredentialRequestClientBuilderV1_0_13.fromCredentialOfferRequest(Object.assign(Object.assign({ request: offer }, offer), { metadata, version: offer.version }));
        });
    }
    static fromCredentialOfferRequest(opts) {
        var _a, _b, _c, _d;
        const { request, metadata } = opts;
        const version = (_b = (_a = opts.version) !== null && _a !== void 0 ? _a : request.version) !== null && _b !== void 0 ? _b : (0, oid4vci_common_1.determineSpecVersionFromOffer)(request.original_credential_offer);
        if (version < oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13) {
            throw new Error('Versions below v1.0.13 (draft 13) are not supported.');
        }
        const builder = new CredentialRequestClientBuilderV1_0_13();
        const issuer = (_c = (0, oid4vci_common_1.getIssuerFromCredentialOfferPayload)(request.credential_offer)) !== null && _c !== void 0 ? _c : metadata === null || metadata === void 0 ? void 0 : metadata.issuer;
        builder.withVersion(version);
        builder.withCredentialEndpoint((_d = metadata === null || metadata === void 0 ? void 0 : metadata.credential_endpoint) !== null && _d !== void 0 ? _d : (issuer.endsWith('/') ? `${issuer}credential` : `${issuer}/credential`));
        if (metadata === null || metadata === void 0 ? void 0 : metadata.deferred_credential_endpoint) {
            builder.withDeferredCredentialEndpoint(metadata.deferred_credential_endpoint);
        }
        const ids = request.credential_offer.credential_configuration_ids;
        // if there's only one in the offer, we pre-select it. if not, you should provide the credentialType
        if (ids.length && ids.length === 1) {
            builder.withCredentialIdentifier(ids[0]);
        }
        return builder;
    }
    static fromCredentialOffer({ credentialOffer, metadata, }) {
        return CredentialRequestClientBuilderV1_0_13.fromCredentialOfferRequest({
            request: credentialOffer,
            metadata,
            version: credentialOffer.version,
        });
    }
    withCredentialEndpointFromMetadata(metadata) {
        this.credentialEndpoint = metadata.credential_endpoint;
        return this;
    }
    withCredentialEndpoint(credentialEndpoint) {
        this.credentialEndpoint = credentialEndpoint;
        return this;
    }
    withDeferredCredentialEndpointFromMetadata(metadata) {
        this.deferredCredentialEndpoint = metadata.deferred_credential_endpoint;
        return this;
    }
    withDeferredCredentialEndpoint(deferredCredentialEndpoint) {
        this.deferredCredentialEndpoint = deferredCredentialEndpoint;
        return this;
    }
    withDeferredCredentialAwait(deferredCredentialAwait, deferredCredentialIntervalInMS) {
        this.deferredCredentialAwait = deferredCredentialAwait;
        this.deferredCredentialIntervalInMS = deferredCredentialIntervalInMS !== null && deferredCredentialIntervalInMS !== void 0 ? deferredCredentialIntervalInMS : 5000;
        return this;
    }
    withCredentialIdentifier(credentialIdentifier) {
        this.credentialIdentifier = credentialIdentifier;
        return this;
    }
    withCredentialType(credentialTypes) {
        this.credentialTypes = Array.isArray(credentialTypes) ? credentialTypes : [credentialTypes];
        return this;
    }
    withFormat(format) {
        this.format = format;
        return this;
    }
    withSubjectIssuance(subjectIssuance) {
        this.subjectIssuance = subjectIssuance;
        return this;
    }
    withToken(accessToken) {
        this.token = accessToken;
        return this;
    }
    withTokenFromResponse(response) {
        this.token = response.access_token;
        return this;
    }
    withVersion(version) {
        this.version = version;
        return this;
    }
    build() {
        if (!this.version) {
            this.withVersion(oid4vci_common_1.OpenId4VCIVersion.VER_1_0_11);
        }
        return new CredentialRequestClient_1.CredentialRequestClient(this);
    }
}
exports.CredentialRequestClientBuilderV1_0_13 = CredentialRequestClientBuilderV1_0_13;
//# sourceMappingURL=CredentialRequestClientBuilderV1_0_13.js.map