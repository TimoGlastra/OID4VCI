import { CreateJwtCallback, JWK, JwtIssuerJwk, SigningAlgo, VerifyJwtCallbackBase } from './../jwt';
export declare const dpopTokenRequestNonceError = "use_dpop_nonce";
export interface DPoPJwtIssuerWithContext extends JwtIssuerJwk {
    type: 'dpop';
    dPoPSigningAlgValuesSupported?: string[];
}
export type DPoPJwtPayloadProps = {
    htu: string;
    iat: number;
    htm: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT' | 'PATCH';
    ath?: string;
    nonce?: string;
    jti: string;
};
export type DPoPJwtHeaderProps = {
    typ: 'dpop+jwt';
    alg: SigningAlgo;
    jwk: JWK;
};
export type CreateDPoPJwtPayloadProps = Omit<DPoPJwtPayloadProps, 'iat' | 'jti' | 'ath'> & {
    accessToken?: string;
};
export interface CreateDPoPOpts<JwtPayloadProps = CreateDPoPJwtPayloadProps> {
    createJwtCallback: CreateJwtCallback<DPoPJwtIssuerWithContext>;
    jwtIssuer: Omit<JwtIssuerJwk, 'method' | 'type'>;
    jwtPayloadProps: Record<string, unknown> & JwtPayloadProps;
    dPoPSigningAlgValuesSupported?: (string | SigningAlgo)[];
}
export type CreateDPoPClientOpts = CreateDPoPOpts<Omit<CreateDPoPJwtPayloadProps, 'htm' | 'htu'>>;
export declare function getCreateDPoPOptions(createDPoPClientOpts: CreateDPoPClientOpts, endPointUrl: string, resourceRequestOpts?: {
    accessToken: string;
}): CreateDPoPOpts;
export declare function createDPoP(options: CreateDPoPOpts): Promise<string>;
export type DPoPVerifyJwtCallback = VerifyJwtCallbackBase<JwtIssuerJwk & {
    type: 'dpop';
}>;
export interface DPoPVerifyOptions {
    expectedNonce?: string;
    acceptedAlgorithms?: (string | SigningAlgo)[];
    maxIatAgeInSeconds?: number;
    expectAccessToken?: boolean;
    jwtVerifyCallback: DPoPVerifyJwtCallback;
    now?: number;
}
export declare function verifyDPoP(request: {
    headers: Record<string, string | string[] | undefined>;
    fullUrl: string;
} & Pick<Request, 'method'>, options: DPoPVerifyOptions): Promise<JWK>;
/**
 * DPoP verifications for resource requests
 * For Bearer token compatibility jwt's must have a token_type claim
 * The access token itself must be validated before using this method
 * If the token_type is not DPoP, then the request is not a DPoP request
 * and we don't need to verify the DPoP proof
 */
export declare function verifyResourceDPoP(request: {
    headers: Record<string, string | string[] | undefined>;
    fullUrl: string;
} & Pick<Request, 'method'>, options: Omit<DPoPVerifyOptions, 'expectAccessToken'>): Promise<JWK | undefined>;
//# sourceMappingURL=DPoP.d.ts.map