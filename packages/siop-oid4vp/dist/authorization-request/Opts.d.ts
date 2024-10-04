import { Verification } from '../types';
import { CreateAuthorizationRequestOpts, VerifyAuthorizationRequestOpts } from './types';
export declare const assertValidVerifyAuthorizationRequestOpts: (opts: VerifyAuthorizationRequestOpts) => void;
export declare const assertValidAuthorizationRequestOpts: (opts: CreateAuthorizationRequestOpts) => void;
export declare const mergeVerificationOpts: (classOpts: {
    verification?: Verification;
}, requestOpts: {
    correlationId: string;
    verification?: Verification;
}) => {
    revocationOpts: {
        revocationVerificationCallback: import("../types").RevocationVerificationCallback;
        revocationVerification: import("../types").RevocationVerification;
    };
    replayRegistry: import("..").IRPSessionManager;
    presentationVerificationCallback: import("..").PresentationVerificationCallback;
};
//# sourceMappingURL=Opts.d.ts.map