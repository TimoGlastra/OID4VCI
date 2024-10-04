import { CreateDPoPClientOpts } from '@sphereon/oid4vc-common';
import { AccessTokenRequest, AccessTokenRequestOpts, AccessTokenResponse, AuthorizationServerOpts, DPoPResponseParams, EndpointMetadata, IssuerOpts, OpenIDResponse, TxCodeAndPinRequired } from '@sphereon/oid4vci-common';
export declare class AccessTokenClient {
    acquireAccessToken(opts: AccessTokenRequestOpts): Promise<OpenIDResponse<AccessTokenResponse, DPoPResponseParams>>;
    acquireAccessTokenUsingRequest({ accessTokenRequest, metadata, asOpts, issuerOpts, createDPoPOpts, }: {
        accessTokenRequest: AccessTokenRequest;
        pinMetadata?: TxCodeAndPinRequired;
        metadata?: EndpointMetadata;
        asOpts?: AuthorizationServerOpts;
        issuerOpts?: IssuerOpts;
        createDPoPOpts?: CreateDPoPClientOpts;
    }): Promise<OpenIDResponse<AccessTokenResponse, DPoPResponseParams>>;
    createAccessTokenRequest(opts: Omit<AccessTokenRequestOpts, 'createDPoPOpts'>): Promise<AccessTokenRequest>;
    private getPinMetadata;
    private assertAlphanumericPin;
    private sendAuthCode;
    static determineTokenURL({ asOpts, issuerOpts, metadata, }: {
        asOpts?: AuthorizationServerOpts;
        issuerOpts?: IssuerOpts;
        metadata?: EndpointMetadata;
    }): string;
    private static creatTokenURLFromURL;
}
//# sourceMappingURL=AccessTokenClient.d.ts.map