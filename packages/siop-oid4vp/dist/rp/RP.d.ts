import { JarmAuthResponseParams, JarmDirectPostJwtResponseParams } from '@sphereon/jarm';
import { JwtIssuer } from '@sphereon/oid4vc-common';
import { Hasher } from '@sphereon/ssi-types';
import { AuthorizationRequest, ClaimPayloadCommonOpts, CreateAuthorizationRequestOpts, RequestPropertyWithTargets, URI } from '../authorization-request';
import { PresentationDefinitionWithLocation, VerifyAuthorizationResponseOpts } from '../authorization-response';
import { AuthorizationResponsePayload, DecryptCompact, RegisterEventListener, RequestObjectPayload, ResponseURIType, SupportedVersion, Verification, VerifiedAuthorizationResponse } from '../types';
import { RPBuilder } from './RPBuilder';
import { IRPSessionManager } from './types';
export declare class RP {
    get sessionManager(): IRPSessionManager;
    private readonly _createRequestOptions;
    private readonly _verifyResponseOptions;
    private readonly _eventEmitter?;
    private readonly _sessionManager?;
    private constructor();
    static fromRequestOpts(opts: CreateAuthorizationRequestOpts): RP;
    static builder(opts?: {
        requestVersion?: SupportedVersion;
    }): RPBuilder;
    createAuthorizationRequest(opts: {
        correlationId: string;
        nonce: string | RequestPropertyWithTargets<string>;
        state: string | RequestPropertyWithTargets<string>;
        jwtIssuer?: JwtIssuer;
        claims?: ClaimPayloadCommonOpts | RequestPropertyWithTargets<ClaimPayloadCommonOpts>;
        version?: SupportedVersion;
        requestByReferenceURI?: string;
        responseURI?: string;
        responseURIType?: ResponseURIType;
    }): Promise<AuthorizationRequest>;
    createAuthorizationRequestURI(opts: {
        correlationId: string;
        nonce: string | RequestPropertyWithTargets<string>;
        state: string | RequestPropertyWithTargets<string>;
        jwtIssuer?: JwtIssuer;
        claims?: ClaimPayloadCommonOpts | RequestPropertyWithTargets<ClaimPayloadCommonOpts>;
        version?: SupportedVersion;
        requestByReferenceURI?: string;
        responseURI?: string;
        responseURIType?: ResponseURIType;
    }): Promise<URI>;
    signalAuthRequestRetrieved(opts: {
        correlationId: string;
        error?: Error;
    }): Promise<void>;
    static processJarmAuthorizationResponse(response: string, opts: {
        decryptCompact: DecryptCompact;
        getAuthRequestPayload: (input: JarmDirectPostJwtResponseParams | JarmAuthResponseParams) => Promise<{
            authRequestParams: RequestObjectPayload;
        }>;
    }): Promise<{
        authRequestParams: {
            response_type: string;
            client_metadata: {
                jwks?: {
                    keys: ({
                        kty: string;
                        kid?: string;
                    } & {
                        [key: string]: unknown;
                    })[];
                };
                jwks_uri?: string;
            } & {
                [key: string]: unknown;
            };
            client_id: string;
            state?: string;
            response_mode?: "direct_post.jwt" | "query.jwt" | "fragment.jwt" | "jwt" | "form_post.jwt";
        } & {
            [key: string]: unknown;
        };
        authResponseParams: {
            vp_token: string;
            presentation_submission: unknown;
            state?: string;
            iss?: string;
            exp?: number;
            aud?: string;
            nonce?: string;
        } & {
            [key: string]: unknown;
        };
        type: "signed" | "encrypted" | "signed encrypted";
    }>;
    verifyAuthorizationResponse(authorizationResponsePayload: AuthorizationResponsePayload, opts?: {
        correlationId?: string;
        hasher?: Hasher;
        audience?: string;
        state?: string;
        nonce?: string;
        verification?: Verification;
        presentationDefinitions?: PresentationDefinitionWithLocation | PresentationDefinitionWithLocation[];
    }): Promise<VerifiedAuthorizationResponse>;
    get createRequestOptions(): CreateAuthorizationRequestOpts;
    get verifyResponseOptions(): Partial<VerifyAuthorizationResponseOpts>;
    private newAuthorizationRequestOpts;
    private newVerifyAuthorizationResponseOpts;
    private emitEvent;
    addEventListener(register: RegisterEventListener): void;
}
//# sourceMappingURL=RP.d.ts.map