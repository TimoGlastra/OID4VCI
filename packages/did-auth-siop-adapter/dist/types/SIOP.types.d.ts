import { SigningAlgo } from '@sphereon/oid4vc-common';
import { VerifyCallback as WellknownDIDVerifyCallback } from '@sphereon/wellknown-dids-client';
import { JWTVerifyOptions } from 'did-jwt';
import { Resolvable } from 'did-resolver';
export declare enum CheckLinkedDomain {
    NEVER = "never",// We don't want to verify Linked domains
    IF_PRESENT = "if_present",// If present, did-auth-siop will check the linked domain, if exist and not valid, throws an exception
    ALWAYS = "always"
}
export interface InternalSignature {
    hexPrivateKey: string;
    did: string;
    alg: SigningAlgo;
    kid?: string;
    customJwtSigner?: Signer;
}
export interface SuppliedSignature {
    signature: (data: string | Uint8Array) => Promise<EcdsaSignature | string>;
    alg: SigningAlgo;
    did: string;
    kid: string;
}
export interface NoSignature {
    hexPublicKey: string;
    did: string;
    kid?: string;
}
export interface ExternalSignature {
    signatureUri: string;
    did: string;
    authZToken: string;
    hexPublicKey?: string;
    alg: SigningAlgo;
    kid?: string;
}
export declare enum VerificationMode {
    INTERNAL = 0,
    EXTERNAL = 1
}
export interface EcdsaSignature {
    r: string;
    s: string;
    recoveryParam?: number | null;
}
export type Signer = (data: string | Uint8Array) => Promise<EcdsaSignature | string>;
export interface Verification {
    checkLinkedDomain?: CheckLinkedDomain;
    wellknownDIDVerifyCallback?: WellknownDIDVerifyCallback;
    resolveOpts: ResolveOpts;
}
export type InternalVerification = Verification;
export interface ExternalVerification extends Verification {
    verifyUri: string;
    authZToken?: string;
}
export interface ResolveOpts {
    jwtVerifyOpts?: JWTVerifyOptions;
    resolver?: Resolvable;
    resolveUrl?: string;
    noUniversalResolverFallback?: boolean;
    subjectSyntaxTypesSupported?: string[];
}
//# sourceMappingURL=SIOP.types.d.ts.map