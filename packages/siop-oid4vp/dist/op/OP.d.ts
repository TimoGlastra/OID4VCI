import { JarmClientMetadata, JarmServerMetadata } from '@sphereon/jarm';
import { JwtIssuer } from '@sphereon/oid4vc-common';
import { URI, VerifyAuthorizationRequestOpts } from '../authorization-request';
import { AuthorizationResponseOpts, AuthorizationResponseWithCorrelationId, PresentationExchangeResponseOpts } from '../authorization-response';
import { JwksMetadataParams } from '../helpers/extract-jwks';
import { AuthorizationResponsePayload, ParsedAuthorizationRequestURI, RegisterEventListener, RequestObjectPayload, ResponseIss, SupportedVersion, Verification, VerifiedAuthorizationRequest } from '../types';
import { OPBuilder } from './OPBuilder';
export declare class OP {
    private readonly _createResponseOptions;
    private readonly _verifyRequestOptions;
    private readonly _eventEmitter?;
    private constructor();
    /**
     * This method tries to infer the SIOP specs version based on the request payload.
     * If the version cannot be inferred or is not supported it throws an exception.
     * This method needs to be called to ensure the OP can handle the request
     * @param requestJwtOrUri
     * @param requestOpts
     */
    verifyAuthorizationRequest(requestJwtOrUri: string | URI, requestOpts?: {
        correlationId?: string;
        verification?: Verification;
    }): Promise<VerifiedAuthorizationRequest>;
    createAuthorizationResponse(verifiedAuthorizationRequest: VerifiedAuthorizationRequest, responseOpts: {
        jwtIssuer?: JwtIssuer;
        version?: SupportedVersion;
        correlationId?: string;
        audience?: string;
        issuer?: ResponseIss | string;
        verification?: Verification;
        presentationExchange?: PresentationExchangeResponseOpts;
    }): Promise<AuthorizationResponseWithCorrelationId>;
    static extractEncJwksFromClientMetadata(clientMetadata: JwksMetadataParams): Promise<import("../types").JWK>;
    submitAuthorizationResponse(authorizationResponse: AuthorizationResponseWithCorrelationId, createJarmResponse?: (opts: {
        authorizationResponsePayload: AuthorizationResponsePayload;
        requestObjectPayload: RequestObjectPayload;
    }) => Promise<{
        response: string;
    }>): Promise<Response>;
    /**
     * Create an Authentication Request Payload from a URI string
     *
     * @param encodedUri
     */
    parseAuthorizationRequestURI(encodedUri: string): Promise<ParsedAuthorizationRequestURI>;
    private newAuthorizationResponseOpts;
    private newVerifyAuthorizationRequestOpts;
    private emitEvent;
    addEventListener(register: RegisterEventListener): void;
    static fromOpts(responseOpts: AuthorizationResponseOpts, verifyOpts: VerifyAuthorizationRequestOpts): OP;
    static builder(): OPBuilder;
    get createResponseOptions(): AuthorizationResponseOpts;
    get verifyRequestOptions(): Partial<VerifyAuthorizationRequestOpts>;
    static validateJarmMetadata(input: {
        client_metadata: JarmClientMetadata;
        server_metadata: Partial<JarmServerMetadata>;
    }): {
        type: "signed";
        client_metadata: {
            authorization_encrypted_response_alg: never;
            authorization_encrypted_response_enc: never;
            authorization_signed_response_alg?: string;
        };
    } | {
        type: "encrypted";
        client_metadata: {
            authorization_signed_response_alg: never;
            authorization_encrypted_response_alg: string;
            authorization_encrypted_response_enc: string;
        };
    } | {
        type: "signed encrypted";
        client_metadata: {
            authorization_encrypted_response_alg: string;
            authorization_encrypted_response_enc: string;
            authorization_signed_response_alg?: string;
        };
    };
}
//# sourceMappingURL=OP.d.ts.map