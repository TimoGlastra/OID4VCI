import { JWK, JwtHeader, JwtPayload, SigningAlgo } from '..';
import { JwtProtectionMethod, JwtType } from './jwtUtils';
export interface JwtVerifierBase {
    type: JwtType;
    method: JwtProtectionMethod;
}
export interface DidJwtVerifier extends JwtVerifierBase {
    method: 'did';
    alg: SigningAlgo | string;
    didUrl: string;
}
export interface X5cJwtVerifier extends JwtVerifierBase {
    method: 'x5c';
    alg: SigningAlgo | string;
    /**
     *
     * Array of base64-encoded certificate strings in the DER-format.
     *
     * The certificate containing the public key corresponding to the key used to digitally sign the JWS MUST be the first certificate.
     */
    x5c: Array<string>;
    /**
     * The jwt issuer
     */
    issuer: string;
}
export interface OpenIdFederationJwtVerifier extends JwtVerifierBase {
    method: 'openid-federation';
    /**
     * The OpenId federation Entity
     */
    entityId: string;
}
export interface JwkJwtVerifier extends JwtVerifierBase {
    method: 'jwk';
    alg: SigningAlgo | string;
    jwk: JWK;
}
export interface CustomJwtVerifier extends JwtVerifierBase {
    method: 'custom';
}
export type JwtVerifier = DidJwtVerifier | X5cJwtVerifier | CustomJwtVerifier | JwkJwtVerifier | OpenIdFederationJwtVerifier;
export declare const getDidJwtVerifier: (jwt: {
    header: JwtHeader;
    payload: JwtPayload;
}, options: {
    type: JwtType;
}) => DidJwtVerifier;
export declare const getX5cVerifier: (jwt: {
    header: JwtHeader;
    payload: JwtPayload;
}, options: {
    type: JwtType;
}) => X5cJwtVerifier;
export declare const getJwkVerifier: (jwt: {
    header: JwtHeader;
    payload: JwtPayload;
}, options: {
    type: JwtType;
}) => Promise<JwkJwtVerifier>;
export declare const getJwtVerifierWithContext: (jwt: {
    header: JwtHeader;
    payload: JwtPayload;
}, options: {
    type: JwtType;
}) => Promise<JwtVerifier>;
export type VerifyJwtCallbackBase<T extends JwtVerifier> = (jwtVerifier: T, jwt: {
    header: JwtHeader;
    payload: JwtPayload;
    raw: string;
}) => Promise<boolean>;
//# sourceMappingURL=JwtVerifier.d.ts.map