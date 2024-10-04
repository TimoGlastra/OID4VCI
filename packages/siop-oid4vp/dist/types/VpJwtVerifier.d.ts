import { CustomJwtVerifier, DidJwtVerifier, JwkJwtVerifier as JwkJwtVerifierBase, JwtHeader, JwtPayload, OpenIdFederationJwtVerifier, VerifyJwtCallbackBase, X5cJwtVerifier } from '@sphereon/oid4vc-common';
import { JwtType } from '@sphereon/oid4vc-common';
import { RequestObjectPayload } from './SIOP.types';
type JwkJwtVerifier = (JwkJwtVerifierBase & {
    type: 'id-token';
    jwkThumbprint: string;
}) | (JwkJwtVerifierBase & {
    type: 'request-object' | 'verifier-attestation' | 'dpop';
    jwkThumbprint?: never;
});
export type JwtVerifier = DidJwtVerifier | X5cJwtVerifier | CustomJwtVerifier | JwkJwtVerifier | OpenIdFederationJwtVerifier;
export declare const getJwkVerifier: (jwt: {
    header: JwtHeader;
    payload: JwtPayload;
}, jwkJwtVerifier: JwkJwtVerifierBase) => Promise<JwkJwtVerifier>;
export declare const getJwtVerifierWithContext: (jwt: {
    header: JwtHeader;
    payload: JwtPayload;
}, options: {
    type: JwtType;
}) => Promise<JwtVerifier>;
export declare const getRequestObjectJwtVerifier: (jwt: {
    header: JwtHeader;
    payload: RequestObjectPayload;
}, options: {
    raw: string;
}) => Promise<JwtVerifier>;
export type VerifyJwtCallback = VerifyJwtCallbackBase<JwtVerifier>;
export {};
//# sourceMappingURL=VpJwtVerifier.d.ts.map