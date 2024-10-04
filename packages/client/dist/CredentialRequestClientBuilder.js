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
exports.CredentialRequestClientBuilder = void 0;
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const CredentialOfferClient_1 = require("./CredentialOfferClient");
const CredentialRequestClientBuilderV1_0_11_1 = require("./CredentialRequestClientBuilderV1_0_11");
const CredentialRequestClientBuilderV1_0_13_1 = require("./CredentialRequestClientBuilderV1_0_13");
function isV1_0_13(builder) {
    return builder.withCredentialIdentifier !== undefined;
}
class CredentialRequestClientBuilder {
    constructor(builder) {
        this._builder = builder;
    }
    static fromCredentialIssuer({ credentialIssuer, metadata, version, credentialIdentifier, credentialTypes, }) {
        const specVersion = version !== null && version !== void 0 ? version : oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13;
        let builder;
        if (specVersion >= oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13) {
            builder = CredentialRequestClientBuilderV1_0_13_1.CredentialRequestClientBuilderV1_0_13.fromCredentialIssuer({
                credentialIssuer,
                metadata,
                version,
                credentialIdentifier,
                credentialTypes,
            });
        }
        else {
            if (!credentialTypes || credentialTypes.length === 0) {
                throw new Error('CredentialTypes must be provided for v1_0_11');
            }
            builder = CredentialRequestClientBuilderV1_0_11_1.CredentialRequestClientBuilderV1_0_11.fromCredentialIssuer({
                credentialIssuer,
                metadata,
                version,
                credentialTypes,
            });
        }
        return new CredentialRequestClientBuilder(builder);
    }
    static fromURI(_a) {
        return __awaiter(this, arguments, void 0, function* ({ uri, metadata }) {
            const offer = yield CredentialOfferClient_1.CredentialOfferClient.fromURI(uri);
            return CredentialRequestClientBuilder.fromCredentialOfferRequest(Object.assign(Object.assign({ request: offer }, offer), { metadata, version: offer.version }));
        });
    }
    static fromCredentialOfferRequest(opts) {
        var _a, _b;
        const { request } = opts;
        const version = (_b = (_a = opts.version) !== null && _a !== void 0 ? _a : request.version) !== null && _b !== void 0 ? _b : (0, oid4vci_common_1.determineSpecVersionFromOffer)(request.original_credential_offer);
        let builder;
        if (version < oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13) {
            builder = CredentialRequestClientBuilderV1_0_11_1.CredentialRequestClientBuilderV1_0_11.fromCredentialOfferRequest(opts);
        }
        else {
            builder = CredentialRequestClientBuilderV1_0_13_1.CredentialRequestClientBuilderV1_0_13.fromCredentialOfferRequest(opts);
        }
        return new CredentialRequestClientBuilder(builder);
    }
    static fromCredentialOffer({ credentialOffer, metadata, }) {
        const version = (0, oid4vci_common_1.determineSpecVersionFromOffer)(credentialOffer.credential_offer);
        let builder;
        if (version < oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13) {
            builder = CredentialRequestClientBuilderV1_0_11_1.CredentialRequestClientBuilderV1_0_11.fromCredentialOffer({
                credentialOffer,
                metadata,
            });
        }
        else {
            builder = CredentialRequestClientBuilderV1_0_13_1.CredentialRequestClientBuilderV1_0_13.fromCredentialOffer({
                credentialOffer,
                metadata,
            });
        }
        return new CredentialRequestClientBuilder(builder);
    }
    getVersion() {
        return this._builder.version;
    }
    withCredentialEndpointFromMetadata(metadata) {
        if (isV1_0_13(this._builder)) {
            this._builder.withCredentialEndpointFromMetadata(metadata);
        }
        else {
            this._builder.withCredentialEndpointFromMetadata(metadata);
        }
        return this;
    }
    withCredentialEndpoint(credentialEndpoint) {
        this._builder.withCredentialEndpoint(credentialEndpoint);
        return this;
    }
    withDeferredCredentialEndpointFromMetadata(metadata) {
        if (isV1_0_13(this._builder)) {
            this._builder.withDeferredCredentialEndpointFromMetadata(metadata);
        }
        else {
            this._builder.withDeferredCredentialEndpointFromMetadata(metadata);
        }
        return this;
    }
    withDeferredCredentialEndpoint(deferredCredentialEndpoint) {
        this._builder.withDeferredCredentialEndpoint(deferredCredentialEndpoint);
        return this;
    }
    withDeferredCredentialAwait(deferredCredentialAwait, deferredCredentialIntervalInMS) {
        this._builder.withDeferredCredentialAwait(deferredCredentialAwait, deferredCredentialIntervalInMS);
        return this;
    }
    withCredentialIdentifier(credentialIdentifier) {
        if (this._builder.version === undefined || this._builder.version < oid4vci_common_1.OpenId4VCIVersion.VER_1_0_13) {
            throw new Error('Version of spec should be equal or higher than v1_0_13');
        }
        this._builder.withCredentialIdentifier(credentialIdentifier);
        return this;
    }
    withCredentialType(credentialTypes) {
        this._builder.withCredentialType(credentialTypes);
        return this;
    }
    withFormat(format) {
        this._builder.withFormat(format);
        return this;
    }
    withSubjectIssuance(subjectIssuance) {
        this._builder.withSubjectIssuance(subjectIssuance);
        return this;
    }
    withToken(accessToken) {
        this._builder.withToken(accessToken);
        return this;
    }
    withTokenFromResponse(response) {
        this._builder.withTokenFromResponse(response);
        return this;
    }
    withVersion(version) {
        this._builder.withVersion(version);
        return this;
    }
    build() {
        return this._builder.build();
    }
}
exports.CredentialRequestClientBuilder = CredentialRequestClientBuilder;
//# sourceMappingURL=CredentialRequestClientBuilder.js.map