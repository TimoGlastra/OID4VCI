import { CreateDPoPClientOpts } from '@sphereon/oid4vc-common';
import { CredentialResponse, DPoPResponseParams, OID4VCICredentialFormat, OpenId4VCIVersion, OpenIDResponse, ProofOfPossession, UniformCredentialRequest } from '@sphereon/oid4vci-common';
import { CredentialFormat } from '@sphereon/ssi-types';
import { CredentialRequestClientBuilderV1_0_11 } from './CredentialRequestClientBuilderV1_0_11';
import { ProofOfPossessionBuilder } from './ProofOfPossessionBuilder';
export interface CredentialRequestOptsV1_0_11 {
    deferredCredentialAwait?: boolean;
    deferredCredentialIntervalInMS?: number;
    credentialEndpoint: string;
    deferredCredentialEndpoint?: string;
    credentialTypes: string[];
    format?: CredentialFormat | OID4VCICredentialFormat;
    proof: ProofOfPossession;
    token: string;
    version: OpenId4VCIVersion;
}
export declare class CredentialRequestClientV1_0_11 {
    private readonly _credentialRequestOpts;
    private _isDeferred;
    get credentialRequestOpts(): CredentialRequestOptsV1_0_11;
    isDeferred(): boolean;
    getCredentialEndpoint(): string;
    getDeferredCredentialEndpoint(): string | undefined;
    constructor(builder: CredentialRequestClientBuilderV1_0_11);
    acquireCredentialsUsingProof<DIDDoc>(opts: {
        proofInput: ProofOfPossessionBuilder<DIDDoc> | ProofOfPossession;
        credentialTypes?: string | string[];
        context?: string[];
        format?: CredentialFormat | OID4VCICredentialFormat;
        createDPoPOpts?: CreateDPoPClientOpts;
    }): Promise<OpenIDResponse<CredentialResponse, DPoPResponseParams> & {
        access_token: string;
    }>;
    acquireCredentialsUsingRequest(uniformRequest: UniformCredentialRequest, createDPoPOpts?: CreateDPoPClientOpts): Promise<OpenIDResponse<CredentialResponse, DPoPResponseParams> & {
        access_token: string;
    }>;
    acquireDeferredCredential(response: Pick<CredentialResponse, 'transaction_id' | 'acceptance_token' | 'c_nonce'>, opts?: {
        bearerToken?: string;
    }): Promise<OpenIDResponse<CredentialResponse> & {
        access_token: string;
    }>;
    createCredentialRequest<DIDDoc>(opts: {
        proofInput: ProofOfPossessionBuilder<DIDDoc> | ProofOfPossession;
        credentialTypes?: string | string[];
        context?: string[];
        format?: CredentialFormat | OID4VCICredentialFormat;
        version: OpenId4VCIVersion;
    }): Promise<UniformCredentialRequest>;
    private version;
    private isV11OrHigher;
}
//# sourceMappingURL=CredentialRequestClientV1_0_11.d.ts.map