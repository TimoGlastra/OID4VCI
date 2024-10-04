import { DPoPVerifyJwtCallback } from '@sphereon/oid4vc-common';
import { ITokenEndpointOpts, VcIssuer } from '@sphereon/oid4vci-issuer';
import { NextFunction, Request, Response } from 'express';
/**
 *
 * @param tokenExpiresIn
 * @param accessTokenSignerCallback
 * @param accessTokenIssuer
 * @param cNonceExpiresIn
 * @param issuer
 * @param interval
 */
export declare const handleTokenRequest: <T extends object>({ tokenExpiresIn, accessTokenEndpoint, accessTokenSignerCallback, accessTokenIssuer, cNonceExpiresIn, issuer, interval, dpop, }: Required<Pick<ITokenEndpointOpts, 'accessTokenIssuer' | 'cNonceExpiresIn' | 'interval' | 'accessTokenSignerCallback' | 'tokenExpiresIn'>> & {
    issuer: VcIssuer<T>;
    dpop?: {
        requireDPoP?: boolean;
        dPoPVerifyJwtCallback: DPoPVerifyJwtCallback;
    };
    accessTokenEndpoint?: string;
}) => (request: Request, response: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifyTokenRequest: <T extends object>({ preAuthorizedCodeExpirationDuration, issuer, }: Required<Pick<ITokenEndpointOpts, 'preAuthorizedCodeExpirationDuration'> & {
    issuer: VcIssuer<T>;
}>) => (request: Request, response: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=IssuerTokenEndpoint.d.ts.map