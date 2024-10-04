"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuerMetadataBuilderV1_13 = void 0;
const CredentialSupportedBuilderV1_13_1 = require("./CredentialSupportedBuilderV1_13");
const DisplayBuilder_1 = require("./DisplayBuilder");
class IssuerMetadataBuilderV1_13 {
    constructor() {
        this.supportedBuilders = [];
        this.credentialConfigurationsSupported = {};
        this.displayBuilders = [];
        this.display = [];
    }
    withBatchCredentialEndpoint(batchCredentialEndpoint) {
        this.batchCredentialEndpoint = batchCredentialEndpoint;
        throw Error(`Not supported yet`);
    }
    withAuthorizationServers(authorizationServers) {
        this.authorizationServers = authorizationServers;
        return this;
    }
    withAuthorizationServer(authorizationServer) {
        if (this.authorizationServers === undefined) {
            this.authorizationServers = [];
        }
        this.authorizationServers.push(authorizationServer);
        return this;
    }
    withTokenEndpoint(tokenEndpoint) {
        this.tokenEndpoint = tokenEndpoint;
        return this;
    }
    withCredentialEndpoint(credentialEndpoint) {
        this.credentialEndpoint = credentialEndpoint;
        return this;
    }
    withCredentialIssuer(credentialIssuer) {
        this.credentialIssuer = credentialIssuer;
        return this;
    }
    newSupportedCredentialBuilder() {
        const builder = new CredentialSupportedBuilderV1_13_1.CredentialSupportedBuilderV1_13();
        this.addSupportedCredentialBuilder(builder);
        return builder;
    }
    addSupportedCredentialBuilder(supportedCredentialBuilder) {
        this.supportedBuilders.push(supportedCredentialBuilder);
        return this;
    }
    addCredentialConfigurationsSupported(id, supportedCredential) {
        this.credentialConfigurationsSupported[id] = supportedCredential;
        return this;
    }
    withIssuerDisplay(issuerDisplay) {
        this.display = Array.isArray(issuerDisplay) ? issuerDisplay : [issuerDisplay];
        return this;
    }
    addDisplay(display) {
        this.display.push(display);
    }
    addDisplayBuilder(displayBuilder) {
        this.displayBuilders.push(displayBuilder);
    }
    newDisplayBuilder() {
        const builder = new DisplayBuilder_1.DisplayBuilder();
        this.addDisplayBuilder(builder);
        return builder;
    }
    build() {
        if (!this.credentialIssuer) {
            throw Error('No credential issuer supplied');
        }
        else if (!this.credentialEndpoint) {
            throw Error('No credential endpoint supplied');
        }
        const credential_configurations_supported = this.credentialConfigurationsSupported;
        const configurationsEntryList = this.supportedBuilders.map((builder) => builder.build());
        configurationsEntryList.forEach((configRecord) => {
            Object.keys(configRecord).forEach((key) => {
                credential_configurations_supported[key] = configRecord[key];
            });
        });
        if (Object.keys(credential_configurations_supported).length === 0) {
            throw Error('No supported credentials supplied');
        }
        const display = [];
        display.push(...this.display);
        display.push(...this.displayBuilders.map((builder) => builder.build()));
        return Object.assign(Object.assign(Object.assign({ credential_issuer: this.credentialIssuer, credential_endpoint: this.credentialEndpoint, credential_configurations_supported }, (this.authorizationServers && { authorization_servers: this.authorizationServers })), (this.tokenEndpoint && { token_endpoint: this.tokenEndpoint })), (display.length > 0 && { display }));
    }
}
exports.IssuerMetadataBuilderV1_13 = IssuerMetadataBuilderV1_13;
//# sourceMappingURL=IssuerMetadataBuilderV1_13.js.map