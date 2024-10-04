import { JwtIssuerWithContext } from '@sphereon/did-auth-siop';
import { JwtVerifier } from '@sphereon/did-auth-siop';
import { JwtHeader, JwtPayload } from '@sphereon/oid4vc-common';
import { Resolvable } from 'did-resolver';
import { ExternalSignature, ExternalVerification, InternalSignature, InternalVerification, SuppliedSignature } from './types';
export declare const verfiyDidJwtAdapter: (jwtVerifier: JwtVerifier, jwt: {
    header: JwtHeader;
    payload: JwtPayload;
    raw: string;
}, options: {
    verification: InternalVerification | ExternalVerification;
    resolver: Resolvable;
}) => Promise<boolean>;
export declare const createDidJwtAdapter: (signature: InternalSignature | ExternalSignature | SuppliedSignature, jwtIssuer: JwtIssuerWithContext, jwt: {
    header: JwtHeader;
    payload: JwtPayload;
}) => Promise<string>;
//# sourceMappingURL=DidJwtAdapter.d.ts.map