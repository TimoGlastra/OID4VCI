import { CredentialRequest, CredentialRequestV1_0_11 } from '@sphereon/oid4vci-common';
import { CredentialIssuanceInput } from '@sphereon/oid4vci-issuer';
import { CompactSdJwtVc, W3CVerifiableCredential } from '@sphereon/ssi-types';
export declare const generateDid: () => Promise<{
    didDocument: any;
    keyPairs: any;
    methodFor: any;
}>;
export declare const getIssuerCallbackV1_0_11: (credential: CredentialIssuanceInput, keyPair: any, verificationMethod: string) => (_opts: {
    credentialRequest?: CredentialRequestV1_0_11;
    credential?: CredentialIssuanceInput;
}) => Promise<W3CVerifiableCredential | CompactSdJwtVc>;
export declare const getIssuerCallbackV1_0_13: (credential: CredentialIssuanceInput, credentialRequest: CredentialRequest, keyPair: any, verificationMethod: string) => (_opts: {
    credentialRequest: CredentialRequest;
    credential: CredentialIssuanceInput;
    format?: string;
    jwtVerifyResult: any;
}) => Promise<W3CVerifiableCredential | CompactSdJwtVc>;
export declare const verifyCredential: (credential: W3CVerifiableCredential, keyPair: any, verificationMethod: string) => Promise<any>;
//# sourceMappingURL=IssuerCallback.d.ts.map