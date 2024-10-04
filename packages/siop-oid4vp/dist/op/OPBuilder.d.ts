/// <reference types="node" />
import { EventEmitter } from 'events';
import { Hasher, IIssuerId } from '@sphereon/ssi-types';
import { PropertyTargets } from '../authorization-request';
import { PresentationSignCallback } from '../authorization-response';
import { ResponseIss, ResponseMode, ResponseRegistrationOpts, SupportedVersion, VerifyJwtCallback } from '../types';
import { CreateJwtCallback } from '../types/VpJwtIssuer';
import { OP } from './OP';
export declare class OPBuilder {
    expiresIn?: number;
    issuer?: IIssuerId | ResponseIss;
    responseMode?: ResponseMode;
    responseRegistration?: Partial<ResponseRegistrationOpts>;
    createJwtCallback?: CreateJwtCallback;
    verifyJwtCallback?: VerifyJwtCallback;
    presentationSignCallback?: PresentationSignCallback;
    supportedVersions?: SupportedVersion[];
    eventEmitter?: EventEmitter;
    hasher?: Hasher;
    withHasher(hasher: Hasher): OPBuilder;
    withIssuer(issuer: ResponseIss | string): OPBuilder;
    withExpiresIn(expiresIn: number): OPBuilder;
    withResponseMode(responseMode: ResponseMode): OPBuilder;
    withRegistration(responseRegistration: ResponseRegistrationOpts, targets?: PropertyTargets): OPBuilder;
    withCreateJwtCallback(createJwtCallback: CreateJwtCallback): OPBuilder;
    withVerifyJwtCallback(verifyJwtCallback: VerifyJwtCallback): OPBuilder;
    withSupportedVersions(supportedVersions: SupportedVersion[] | SupportedVersion | string[] | string): OPBuilder;
    addSupportedVersion(supportedVersion: string | SupportedVersion): OPBuilder;
    withPresentationSignCallback(presentationSignCallback: PresentationSignCallback): OPBuilder;
    withEventEmitter(eventEmitter?: EventEmitter): OPBuilder;
    build(): OP;
}
//# sourceMappingURL=OPBuilder.d.ts.map