import { AccessTokenRequest, AccessTokenRequestOpts, OpenId4VCIVersion } from '@sphereon/oid4vci-common';
export declare const createJwtBearerClientAssertion: (request: Partial<AccessTokenRequest>, opts: AccessTokenRequestOpts & {
    version?: OpenId4VCIVersion;
}) => Promise<void>;
//# sourceMappingURL=AccessTokenUtil.d.ts.map