import { CredentialConfigurationSupportedV1_0_13, IssuerMetadataV1_0_13, MetadataDisplay } from '@sphereon/oid4vci-common';
import { CredentialSupportedBuilderV1_13 } from './CredentialSupportedBuilderV1_13';
import { DisplayBuilder } from './DisplayBuilder';
export declare class IssuerMetadataBuilderV1_13 {
    credentialEndpoint: string | undefined;
    credentialIssuer: string | undefined;
    supportedBuilders: CredentialSupportedBuilderV1_13[];
    credentialConfigurationsSupported: Record<string, CredentialConfigurationSupportedV1_0_13>;
    displayBuilders: DisplayBuilder[];
    display: MetadataDisplay[];
    batchCredentialEndpoint?: string;
    authorizationServers?: string[];
    tokenEndpoint?: string;
    withBatchCredentialEndpoint(batchCredentialEndpoint: string): void;
    withAuthorizationServers(authorizationServers: string[]): this;
    withAuthorizationServer(authorizationServer: string): this;
    withTokenEndpoint(tokenEndpoint: string): this;
    withCredentialEndpoint(credentialEndpoint: string): IssuerMetadataBuilderV1_13;
    withCredentialIssuer(credentialIssuer: string): IssuerMetadataBuilderV1_13;
    newSupportedCredentialBuilder(): CredentialSupportedBuilderV1_13;
    addSupportedCredentialBuilder(supportedCredentialBuilder: CredentialSupportedBuilderV1_13): this;
    addCredentialConfigurationsSupported(id: string, supportedCredential: CredentialConfigurationSupportedV1_0_13): this;
    withIssuerDisplay(issuerDisplay: MetadataDisplay[] | MetadataDisplay): IssuerMetadataBuilderV1_13;
    addDisplay(display: MetadataDisplay): void;
    addDisplayBuilder(displayBuilder: DisplayBuilder): void;
    newDisplayBuilder(): DisplayBuilder;
    build(): IssuerMetadataV1_0_13;
}
//# sourceMappingURL=IssuerMetadataBuilderV1_13.d.ts.map