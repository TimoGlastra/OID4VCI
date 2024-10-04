import { JwtIssuer } from '@sphereon/oid4vc-common';
import { IPresentationDefinition, PresentationSignCallBackParams } from '@sphereon/pex';
import { Format } from '@sphereon/pex-models';
import { CompactSdJwtVc, Hasher, PresentationSubmission, W3CVerifiablePresentation } from '@sphereon/ssi-types';
import { ResponseMode, ResponseRegistrationOpts, ResponseType, ResponseURIType, SupportedVersion, VerifiablePresentationWithFormat, Verification } from '../types';
import { CreateJwtCallback } from '../types/VpJwtIssuer';
import { VerifyJwtCallback } from '../types/VpJwtVerifier';
import { AuthorizationResponse } from './AuthorizationResponse';
export interface AuthorizationResponseOpts {
    responseURI?: string;
    responseURIType?: ResponseURIType;
    registration?: ResponseRegistrationOpts;
    version?: SupportedVersion;
    audience?: string;
    createJwtCallback: CreateJwtCallback;
    jwtIssuer?: JwtIssuer;
    responseMode?: ResponseMode;
    responseType?: [ResponseType];
    expiresIn?: number;
    accessToken?: string;
    tokenType?: string;
    refreshToken?: string;
    presentationExchange?: PresentationExchangeResponseOpts;
}
export interface PresentationExchangeResponseOpts {
    verifiablePresentations: Array<W3CVerifiablePresentation | CompactSdJwtVc>;
    vpTokenLocation?: VPTokenLocation;
    presentationSubmission?: PresentationSubmission;
    restrictToFormats?: Format;
    restrictToDIDMethods?: string[];
}
export interface PresentationExchangeRequestOpts {
    presentationVerificationCallback?: PresentationVerificationCallback;
}
export interface PresentationDefinitionPayloadOpts {
    presentation_definition?: IPresentationDefinition;
    presentation_definition_uri?: string;
}
export interface PresentationDefinitionWithLocation {
    version?: SupportedVersion;
    location: PresentationDefinitionLocation;
    definition: IPresentationDefinition;
}
export interface VerifiablePresentationWithSubmissionData extends VerifiablePresentationWithFormat {
    vpTokenLocation: VPTokenLocation;
    submissionData: PresentationSubmission;
}
export declare enum PresentationDefinitionLocation {
    CLAIMS_VP_TOKEN = "claims.vp_token",
    TOPLEVEL_PRESENTATION_DEF = "presentation_definition"
}
export declare enum VPTokenLocation {
    AUTHORIZATION_RESPONSE = "authorization_response",
    ID_TOKEN = "id_token",
    TOKEN_RESPONSE = "token_response"
}
export type PresentationVerificationResult = {
    verified: boolean;
    reason?: string;
};
export type PresentationVerificationCallback = (args: W3CVerifiablePresentation | CompactSdJwtVc, presentationSubmission: PresentationSubmission) => Promise<PresentationVerificationResult>;
export type PresentationSignCallback = (args: PresentationSignCallBackParams) => Promise<W3CVerifiablePresentation | CompactSdJwtVc>;
export interface VerifyAuthorizationResponseOpts {
    correlationId: string;
    verification: Verification;
    verifyJwtCallback: VerifyJwtCallback;
    hasher?: Hasher;
    nonce?: string;
    state?: string;
    presentationDefinitions?: PresentationDefinitionWithLocation | PresentationDefinitionWithLocation[];
    audience?: string;
    restrictToFormats?: Format;
    restrictToDIDMethods?: string[];
}
export interface AuthorizationResponseWithCorrelationId {
    responseURI: string;
    response: AuthorizationResponse;
    correlationId: string;
}
//# sourceMappingURL=types.d.ts.map