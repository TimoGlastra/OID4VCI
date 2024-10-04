import { JWK } from '@sphereon/oid4vc-common';
import { AccessTokenResponse, Alg, EndpointMetadata, Jwt, OpenId4VCIVersion, PoPMode, ProofOfPossession, ProofOfPossessionCallbacks, Typ } from '@sphereon/oid4vci-common';
export declare class ProofOfPossessionBuilder<DIDDoc = never> {
    private readonly proof?;
    private readonly callbacks?;
    private readonly version;
    private readonly mode;
    private kid?;
    private jwk?;
    private aud?;
    private clientId?;
    private issuer?;
    private jwt?;
    private alg?;
    private jti?;
    private cNonce?;
    private typ?;
    private constructor();
    static manual<DIDDoc>({ jwt, callbacks, version, mode, }: {
        jwt?: Jwt;
        callbacks: ProofOfPossessionCallbacks<DIDDoc>;
        version: OpenId4VCIVersion;
        mode?: PoPMode;
    }): ProofOfPossessionBuilder<DIDDoc>;
    static fromJwt<DIDDoc>({ jwt, callbacks, version, mode, }: {
        jwt: Jwt;
        callbacks: ProofOfPossessionCallbacks<DIDDoc>;
        version: OpenId4VCIVersion;
        mode?: PoPMode;
    }): ProofOfPossessionBuilder<DIDDoc>;
    static fromAccessTokenResponse<DIDDoc>({ accessTokenResponse, callbacks, version, mode, }: {
        accessTokenResponse: AccessTokenResponse;
        callbacks: ProofOfPossessionCallbacks<DIDDoc>;
        version: OpenId4VCIVersion;
        mode?: PoPMode;
    }): ProofOfPossessionBuilder<DIDDoc>;
    static fromProof<DIDDoc>(proof: ProofOfPossession, version: OpenId4VCIVersion): ProofOfPossessionBuilder<DIDDoc>;
    withAud(aud: string | string[]): this;
    withClientId(clientId: string): this;
    withKid(kid: string): this;
    withJWK(jwk: JWK): this;
    withIssuer(issuer: string): this;
    withAlg(alg: Alg | string): this;
    withJti(jti: string): this;
    withTyp(typ: Typ): this;
    withAccessTokenNonce(cNonce: string): this;
    withAccessTokenResponse(accessToken: AccessTokenResponse): this;
    withEndpointMetadata(endpointMetadata: EndpointMetadata): this;
    withJwt(jwt: Jwt): this;
    build(): Promise<ProofOfPossession>;
}
//# sourceMappingURL=ProofOfPossessionBuilder.d.ts.map