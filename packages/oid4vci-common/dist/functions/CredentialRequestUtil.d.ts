import { CredentialRequest, CredentialRequestV1_0_08, CredentialRequestV1_0_11, CredentialRequestV1_0_13, OpenId4VCIVersion, UniformCredentialRequest } from '../types';
export declare function getTypesFromRequest(credentialRequest: CredentialRequest, opts?: {
    filterVerifiableCredential: boolean;
}): string[];
export declare function getCredentialRequestForVersion(credentialRequest: UniformCredentialRequest, version: OpenId4VCIVersion): UniformCredentialRequest | CredentialRequestV1_0_08 | CredentialRequestV1_0_11 | CredentialRequestV1_0_13;
//# sourceMappingURL=CredentialRequestUtil.d.ts.map