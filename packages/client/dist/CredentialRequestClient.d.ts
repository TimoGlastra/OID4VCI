import { CreateDPoPClientOpts } from '@sphereon/oid4vc-common';
import { CredentialRequestV1_0_13, CredentialRequestWithoutProofV1_0_13, CredentialResponse, DPoPResponseParams, OID4VCICredentialFormat, OpenId4VCIVersion, OpenIDResponse, ProofOfPossession, UniformCredentialRequest } from '@sphereon/oid4vci-common';
import { ExperimentalSubjectIssuance } from '@sphereon/oid4vci-common';
import { CredentialFormat, DIDDocument } from '@sphereon/ssi-types';
import { CredentialRequestClientBuilderV1_0_11 } from './CredentialRequestClientBuilderV1_0_11';
import { CredentialRequestClientBuilderV1_0_13 } from './CredentialRequestClientBuilderV1_0_13';
import { ProofOfPossessionBuilder } from './ProofOfPossessionBuilder';
export interface CredentialRequestOpts {
    deferredCredentialAwait?: boolean;
    deferredCredentialIntervalInMS?: number;
    credentialEndpoint: string;
    notificationEndpoint?: string;
    deferredCredentialEndpoint?: string;
    credentialTypes?: string[];
    credentialIdentifier?: string;
    format?: CredentialFormat | OID4VCICredentialFormat;
    proof: ProofOfPossession;
    token: string;
    version: OpenId4VCIVersion;
    subjectIssuance?: ExperimentalSubjectIssuance;
}
export type CreateCredentialRequestOpts<DIDDoc = DIDDocument> = {
    credentialIdentifier?: string;
    credentialTypes?: string | string[];
    context?: string[];
    format?: CredentialFormat | OID4VCICredentialFormat;
    subjectIssuance?: ExperimentalSubjectIssuance;
    version: OpenId4VCIVersion;
    additionalRequestClaims?: Record<string, unknown>;
};
export declare function buildProof<DIDDoc = DIDDocument>(proofInput: ProofOfPossessionBuilder<DIDDoc> | ProofOfPossession, opts: {
    version: OpenId4VCIVersion;
    cNonce?: string;
}): Promise<ProofOfPossession>;
export declare class CredentialRequestClient {
    private readonly _credentialRequestOpts;
    private _isDeferred;
    get credentialRequestOpts(): CredentialRequestOpts;
    isDeferred(): boolean;
    getCredentialEndpoint(): string;
    getDeferredCredentialEndpoint(): string | undefined;
    constructor(builder: CredentialRequestClientBuilderV1_0_13 | CredentialRequestClientBuilderV1_0_11);
    /**
     * Typically you should not use this method, as it omits a proof from the request.
     * There are certain issuers that in specific circumstances can do without this proof, because they have other means of user binding
     * like using DPoP together with an authorization code flow. These are however rare, so you should be using the acquireCredentialsUsingProof normally
     * @param opts
     */
    acquireCredentialsWithoutProof<DIDDoc = DIDDocument>(opts: {
        credentialIdentifier?: string;
        credentialTypes?: string | string[];
        context?: string[];
        format?: CredentialFormat | OID4VCICredentialFormat;
        subjectIssuance?: ExperimentalSubjectIssuance;
        createDPoPOpts?: CreateDPoPClientOpts;
    }): Promise<OpenIDResponse<CredentialResponse, DPoPResponseParams> & {
        access_token: string;
    }>;
    acquireCredentialsUsingProof<DIDDoc = DIDDocument>(opts: {
        proofInput: ProofOfPossessionBuilder<DIDDoc> | ProofOfPossession;
        credentialIdentifier?: string;
        credentialTypes?: string | string[];
        context?: string[];
        format?: CredentialFormat | OID4VCICredentialFormat;
        subjectIssuance?: ExperimentalSubjectIssuance;
        createDPoPOpts?: CreateDPoPClientOpts;
        additionalRequestClaims?: Record<string, unknown>;
        customBody?: Record<string, unknown>;
    }): Promise<OpenIDResponse<CredentialResponse, DPoPResponseParams> & {
        access_token: string;
    }>;
    acquireCredentialsUsingRequestWithoutProof(uniformRequest: UniformCredentialRequest, createDPoPOpts?: CreateDPoPClientOpts): Promise<OpenIDResponse<CredentialResponse, DPoPResponseParams> & {
        access_token: string;
    }>;
    acquireCredentialsUsingRequest(uniformRequest: UniformCredentialRequest, createDPoPOpts?: CreateDPoPClientOpts, customBody?: Record<string, unknown>): Promise<OpenIDResponse<CredentialResponse, DPoPResponseParams> & {
        access_token: string;
    }>;
    private acquireCredentialsUsingRequestImpl;
    acquireDeferredCredential(response: Pick<CredentialResponse, 'transaction_id' | 'acceptance_token' | 'c_nonce'>, opts?: {
        bearerToken?: string;
    }): Promise<OpenIDResponse<CredentialResponse> & {
        access_token: string;
    }>;
    createCredentialRequestWithoutProof<DIDDoc = DIDDocument>(opts: CreateCredentialRequestOpts<DIDDoc>): Promise<CredentialRequestWithoutProofV1_0_13>;
    createCredentialRequest<DIDDoc = DIDDocument>(opts: CreateCredentialRequestOpts<DIDDoc> & {
        proofInput: ProofOfPossessionBuilder<DIDDoc> | ProofOfPossession;
    }): Promise<CredentialRequestV1_0_13>;
    private createCredentialRequestImpl;
    private version;
}
//# sourceMappingURL=CredentialRequestClient.d.ts.map