import { JwtHeader, JwtPayload } from '..';
export type JwtType = 'id-token' | 'request-object' | 'verifier-attestation' | 'dpop';
export type JwtProtectionMethod = 'did' | 'x5c' | 'jwk' | 'openid-federation' | 'custom';
export declare function parseJWT<Header = JwtHeader, Payload = JwtPayload>(jwt: string): {
    header: NonNullable<Header>;
    payload: NonNullable<Payload>;
};
export declare function getNowSkewed(now?: number, skewTime?: number): {
    nowSkewedPast: number;
    nowSkewedFuture: number;
};
/**
 * Returns the current unix timestamp in seconds.
 */
export declare function epochTime(): number;
export declare const BASE64_URL_REGEX: RegExp;
export declare const isJws: (jws: string) => boolean;
export declare const isJwe: (jwe: string) => boolean;
export declare const decodeProtectedHeader: (jwt: string) => import("jwt-decode").JwtHeader;
export declare const decodeJwt: (jwt: string) => JwtPayload;
export declare const checkExp: (input: {
    exp: number;
    now?: number;
    clockSkew?: number;
}) => boolean;
//# sourceMappingURL=jwtUtils.d.ts.map