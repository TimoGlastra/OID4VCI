import { CreateDPoPClientOpts } from '@sphereon/oid4vc-common';
import { AccessTokenRequest, AccessTokenRequestOpts, AccessTokenResponse, AuthorizationServerOpts, DPoPResponseParams, EndpointMetadata, IssuerOpts, OpenIDResponse } from '@sphereon/oid4vci-common';
export declare class AccessTokenClientV1_0_11 {
    acquireAccessToken(opts: AccessTokenRequestOpts): Promise<OpenIDResponse<AccessTokenResponse, DPoPResponseParams>>;
    acquireAccessTokenUsingRequest({ accessTokenRequest, isPinRequired, metadata, asOpts, createDPoPOpts, issuerOpts, }: {
        accessTokenRequest: AccessTokenRequest;
        isPinRequired?: boolean;
        metadata?: EndpointMetadata;
        asOpts?: AuthorizationServerOpts;
        issuerOpts?: IssuerOpts;
        createDPoPOpts?: CreateDPoPClientOpts;
    }): Promise<OpenIDResponse<AccessTokenResponse, DPoPResponseParams>>;
    createAccessTokenRequest(opts: Omit<AccessTokenRequestOpts, 'createDPoPOpts'>): Promise<AccessTokenRequest>;
    private assertPreAuthorizedGrantType;
    private assertAuthorizationGrantType;
    private isPinRequiredValue;
    private assertNumericPin;
    private assertNonEmptyPreAuthorizedCode;
    private assertNonEmptyCodeVerifier;
    private assertNonEmptyCode;
    private validate;
    private sendAuthCode;
    static determineTokenURL({ asOpts, issuerOpts, metadata, }: {
        asOpts?: AuthorizationServerOpts;
        issuerOpts?: IssuerOpts;
        metadata?: EndpointMetadata;
    }): string;
    private static creatTokenURLFromURL;
    private throwNotSupportedFlow;
}
//# sourceMappingURL=AccessTokenClientV1_0_11.d.ts.map