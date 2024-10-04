import { JWK } from '@sphereon/oid4vc-common';
import { PoPMode } from '..';
import { Jwt, JWTVerifyCallback, JwtVerifyResult, ProofOfPossession, ProofOfPossessionCallbacks, Typ } from '../types';
/**
 *
 *  - proofOfPossessionCallback: JWTSignerCallback
 *    Mandatory if you want to create (sign) ProofOfPossession
 *  - proofOfPossessionVerifierCallback?: JWTVerifyCallback
 *    If exists, verifies the ProofOfPossession
 *  - proofOfPossessionCallbackArgs: ProofOfPossessionCallbackArgs
 *    arguments needed for signing ProofOfPossession
 *    - proofOfPossessionCallback: JWTSignerCallback
 *      Mandatory to create (sign) ProofOfPossession
 *    - proofOfPossessionVerifierCallback?: JWTVerifyCallback
 *      If exists, verifies the ProofOfPossession
 * @param popMode
 * @param callbacks
 * @param jwtProps
 * @param existingJwt
 *  - Optional, clientId of the party requesting the credential
 */
export declare const createProofOfPossession: <DIDDoc>(popMode: PoPMode, callbacks: ProofOfPossessionCallbacks<DIDDoc>, jwtProps?: JwtProps, existingJwt?: Jwt) => Promise<ProofOfPossession>;
export declare const isJWS: (token: string) => boolean;
export declare const extractBearerToken: (authorizationHeader?: string) => string | undefined;
export declare const validateJWT: (jwt?: string, opts?: {
    kid?: string;
    accessTokenVerificationCallback?: JWTVerifyCallback<never>;
}) => Promise<JwtVerifyResult<any>>;
export interface JwtProps {
    typ?: Typ;
    kid?: string;
    jwk?: JWK;
    x5c?: string[];
    aud?: string | string[];
    issuer?: string;
    clientId?: string;
    alg?: string;
    jti?: string;
    nonce?: string;
}
//# sourceMappingURL=ProofUtil.d.ts.map