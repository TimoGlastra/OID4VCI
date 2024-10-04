"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidVerifiablePresentations = exports.putPresentationSubmissionInLocation = exports.createPresentationSubmission = exports.extractPresentationsFromAuthorizationResponse = exports.verifyPresentations = exports.extractNonceFromWrappedVerifiablePresentation = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const pex_1 = require("@sphereon/pex");
const ssi_types_1 = require("@sphereon/ssi-types");
const helpers_1 = require("../helpers");
const types_1 = require("../types");
const PresentationExchange_1 = require("./PresentationExchange");
const types_2 = require("./types");
function extractNonceFromWrappedVerifiablePresentation(wrappedVp) {
    var _a;
    // SD-JWT uses kb-jwt for the nonce
    if (ssi_types_1.CredentialMapper.isWrappedSdJwtVerifiablePresentation(wrappedVp)) {
        // SD-JWT uses kb-jwt for the nonce
        // TODO: replace this once `kbJwt.payload` is available on the decoded sd-jwt (pr in ssi-sdk)
        // If it doesn't end with ~, it contains a kbJwt
        if (!wrappedVp.presentation.compactSdJwtVc.endsWith('~')) {
            const kbJwt = wrappedVp.presentation.compactSdJwtVc.split('~').pop();
            const { payload } = (0, oid4vc_common_1.parseJWT)(kbJwt);
            return payload.nonce;
        }
        // No kb-jwt means no nonce (error will be handled later)
        return undefined;
    }
    if (wrappedVp.format === 'jwt_vp') {
        return wrappedVp.decoded.nonce;
    }
    // For LDP-VP a challenge is also fine
    if (wrappedVp.format === 'ldp_vp') {
        const w3cPresentation = wrappedVp.decoded;
        const proof = Array.isArray(w3cPresentation.proof) ? w3cPresentation.proof[0] : w3cPresentation.proof;
        return (_a = proof.nonce) !== null && _a !== void 0 ? _a : proof.challenge;
    }
    return undefined;
}
exports.extractNonceFromWrappedVerifiablePresentation = extractNonceFromWrappedVerifiablePresentation;
const verifyPresentations = (authorizationResponse, verifyOpts) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const presentations = yield (0, exports.extractPresentationsFromAuthorizationResponse)(authorizationResponse, { hasher: verifyOpts.hasher });
    const presentationDefinitions = verifyOpts.presentationDefinitions
        ? Array.isArray(verifyOpts.presentationDefinitions)
            ? verifyOpts.presentationDefinitions
            : [verifyOpts.presentationDefinitions]
        : [];
    let idPayload;
    if (authorizationResponse.idToken) {
        idPayload = yield authorizationResponse.idToken.payload();
    }
    // todo: Probably wise to check against request for the location of the submission_data
    const presentationSubmission = (_b = (_a = idPayload === null || idPayload === void 0 ? void 0 : idPayload._vp_token) === null || _a === void 0 ? void 0 : _a.presentation_submission) !== null && _b !== void 0 ? _b : authorizationResponse.payload.presentation_submission;
    yield (0, exports.assertValidVerifiablePresentations)({
        presentationDefinitions,
        presentations,
        verificationCallback: verifyOpts.verification.presentationVerificationCallback,
        opts: {
            presentationSubmission,
            restrictToFormats: verifyOpts.restrictToFormats,
            restrictToDIDMethods: verifyOpts.restrictToDIDMethods,
            hasher: verifyOpts.hasher,
        },
    });
    // If there are no presentations, and the `assertValidVerifiablePresentations` did not fail
    // it means there's no oid4vp response and also not requested
    if (Array.isArray(presentations) && presentations.length === 0) {
        return null;
    }
    const presentationsArray = Array.isArray(presentations) ? presentations : [presentations];
    const nonces = new Set(presentationsArray.map(extractNonceFromWrappedVerifiablePresentation));
    if (presentationsArray.length > 0 && nonces.size !== 1) {
        throw Error(`${nonces.size} nonce values found for ${presentationsArray.length}. Should be 1`);
    }
    // Nonce may be undefined
    const nonce = Array.from(nonces)[0];
    if (typeof nonce !== 'string') {
        throw new Error('Expected all presentations to contain a nonce value');
    }
    const revocationVerification = ((_c = verifyOpts.verification) === null || _c === void 0 ? void 0 : _c.revocationOpts)
        ? verifyOpts.verification.revocationOpts.revocationVerification
        : types_1.RevocationVerification.IF_PRESENT;
    if (revocationVerification !== types_1.RevocationVerification.NEVER) {
        if (!((_d = verifyOpts.verification.revocationOpts) === null || _d === void 0 ? void 0 : _d.revocationVerificationCallback)) {
            throw Error(`Please provide a revocation callback as revocation checking of credentials and presentations is not disabled`);
        }
        for (const vp of presentationsArray) {
            yield (0, helpers_1.verifyRevocation)(vp, verifyOpts.verification.revocationOpts.revocationVerificationCallback, revocationVerification);
        }
    }
    return { nonce, presentations: presentationsArray, presentationDefinitions, submissionData: presentationSubmission };
});
exports.verifyPresentations = verifyPresentations;
const extractPresentationsFromAuthorizationResponse = (response, opts) => __awaiter(void 0, void 0, void 0, function* () {
    if (!response.payload.vp_token)
        return [];
    if (Array.isArray(response.payload.vp_token)) {
        return response.payload.vp_token.map((vp) => ssi_types_1.CredentialMapper.toWrappedVerifiablePresentation(vp, { hasher: opts === null || opts === void 0 ? void 0 : opts.hasher }));
    }
    return ssi_types_1.CredentialMapper.toWrappedVerifiablePresentation(response.payload.vp_token, { hasher: opts === null || opts === void 0 ? void 0 : opts.hasher });
});
exports.extractPresentationsFromAuthorizationResponse = extractPresentationsFromAuthorizationResponse;
const createPresentationSubmission = (verifiablePresentations, opts) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    let submission_data;
    for (const verifiablePresentation of verifiablePresentations) {
        const wrappedPresentation = ssi_types_1.CredentialMapper.toWrappedVerifiablePresentation(verifiablePresentation);
        let submission = ssi_types_1.CredentialMapper.isWrappedW3CVerifiablePresentation(wrappedPresentation) &&
            ((_f = (_e = wrappedPresentation.presentation.presentation_submission) !== null && _e !== void 0 ? _e : wrappedPresentation.decoded.presentation_submission) !== null && _f !== void 0 ? _f : (typeof wrappedPresentation.original !== 'string' && wrappedPresentation.original.presentation_submission));
        if (typeof submission === 'string') {
            submission = JSON.parse(submission);
        }
        if (!submission && (opts === null || opts === void 0 ? void 0 : opts.presentationDefinitions)) {
            console.log(`No submission_data in VPs and not provided. Will try to deduce, but it is better to create the submission data beforehand`);
            for (const definitionOpt of opts.presentationDefinitions) {
                const definition = 'definition' in definitionOpt ? definitionOpt.definition : definitionOpt;
                const result = new pex_1.PEX().evaluatePresentation(definition, wrappedPresentation.original, {
                    generatePresentationSubmission: true,
                    presentationSubmissionLocation: pex_1.PresentationSubmissionLocation.EXTERNAL,
                });
                if (result.areRequiredCredentialsPresent) {
                    submission = result.value;
                    break;
                }
            }
        }
        if (!submission) {
            throw Error('Verifiable Presentation has no submission_data, it has not been provided separately, and could also not be deduced');
        }
        // let's merge all submission data into one object
        if (!submission_data) {
            submission_data = submission;
        }
        else {
            // We are pushing multiple descriptors into one submission_data, as it seems this is something which is assumed in OpenID4VP, but not supported in Presentation Exchange (a single VP always has a single submission_data)
            Array.isArray(submission_data.descriptor_map)
                ? submission_data.descriptor_map.push(...submission.descriptor_map)
                : (submission_data.descriptor_map = [...submission.descriptor_map]);
        }
    }
    if (typeof submission_data === 'string') {
        submission_data = JSON.parse(submission_data);
    }
    return submission_data;
});
exports.createPresentationSubmission = createPresentationSubmission;
const putPresentationSubmissionInLocation = (authorizationRequest, responsePayload, resOpts, idTokenPayload) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l, _m;
    const version = yield authorizationRequest.getSupportedVersion();
    const idTokenType = yield authorizationRequest.containsResponseType(types_1.ResponseType.ID_TOKEN);
    const authResponseType = yield authorizationRequest.containsResponseType(types_1.ResponseType.VP_TOKEN);
    // const requestPayload = await authorizationRequest.mergedPayloads();
    if (!resOpts.presentationExchange) {
        return;
    }
    else if (resOpts.presentationExchange.verifiablePresentations.length === 0) {
        throw Error('Presentation Exchange options set, but no verifiable presentations provided');
    }
    if (!resOpts.presentationExchange.presentationSubmission &&
        (!resOpts.presentationExchange.verifiablePresentations || resOpts.presentationExchange.verifiablePresentations.length === 0)) {
        throw Error(`Either a presentationSubmission or verifiable presentations are needed at this point`);
    }
    const submissionData = (_g = resOpts.presentationExchange.presentationSubmission) !== null && _g !== void 0 ? _g : (yield (0, exports.createPresentationSubmission)(resOpts.presentationExchange.verifiablePresentations, {
        presentationDefinitions: yield authorizationRequest.getPresentationDefinitions(),
    }));
    const location = (_j = (_h = resOpts.presentationExchange) === null || _h === void 0 ? void 0 : _h.vpTokenLocation) !== null && _j !== void 0 ? _j : (idTokenType && version < types_1.SupportedVersion.SIOPv2_D11 ? types_2.VPTokenLocation.ID_TOKEN : types_2.VPTokenLocation.AUTHORIZATION_RESPONSE);
    switch (location) {
        case types_2.VPTokenLocation.TOKEN_RESPONSE: {
            throw Error('Token response for VP token is not supported yet');
        }
        case types_2.VPTokenLocation.ID_TOKEN: {
            if (!idTokenPayload) {
                throw Error('Cannot place submission data _vp_token in id token if no id token is present');
            }
            else if (version >= types_1.SupportedVersion.SIOPv2_D11) {
                throw Error(`This version of the OpenID4VP spec does not allow to store the vp submission data in the ID token`);
            }
            else if (!idTokenType) {
                throw Error(`Cannot place vp token in ID token as the RP didn't provide an "openid" scope in the request`);
            }
            if ((_k = idTokenPayload._vp_token) === null || _k === void 0 ? void 0 : _k.presentation_submission) {
                if (submissionData !== idTokenPayload._vp_token.presentation_submission) {
                    throw Error('Different submission data was provided as an option, but exising submission data was already present in the id token');
                }
            }
            else {
                if (!idTokenPayload._vp_token) {
                    idTokenPayload._vp_token = { presentation_submission: submissionData };
                }
                else {
                    idTokenPayload._vp_token.presentation_submission = submissionData;
                }
            }
            break;
        }
        case types_2.VPTokenLocation.AUTHORIZATION_RESPONSE: {
            if (!authResponseType) {
                throw Error('Cannot place vp token in Authorization Response as there is no vp_token scope in the auth request');
            }
            if (responsePayload.presentation_submission) {
                if (submissionData !== responsePayload.presentation_submission) {
                    throw Error('Different submission data was provided as an option, but exising submission data was already present in the authorization response');
                }
            }
            else {
                responsePayload.presentation_submission = submissionData;
            }
        }
    }
    responsePayload.vp_token =
        ((_l = resOpts.presentationExchange) === null || _l === void 0 ? void 0 : _l.verifiablePresentations.length) === 1
            ? resOpts.presentationExchange.verifiablePresentations[0]
            : (_m = resOpts.presentationExchange) === null || _m === void 0 ? void 0 : _m.verifiablePresentations;
});
exports.putPresentationSubmissionInLocation = putPresentationSubmissionInLocation;
const assertValidVerifiablePresentations = (args) => __awaiter(void 0, void 0, void 0, function* () {
    if ((!args.presentationDefinitions || args.presentationDefinitions.filter((a) => a.definition).length === 0) &&
        (!args.presentations || (Array.isArray(args.presentations) && args.presentations.filter((vp) => vp.presentation).length === 0))) {
        return;
    }
    PresentationExchange_1.PresentationExchange.assertValidPresentationDefinitionWithLocations(args.presentationDefinitions);
    const presentationsWithFormat = args.presentations;
    if (args.presentationDefinitions &&
        args.presentationDefinitions.length &&
        (!presentationsWithFormat || (Array.isArray(presentationsWithFormat) && presentationsWithFormat.length === 0))) {
        throw new Error(types_1.SIOPErrors.AUTH_REQUEST_EXPECTS_VP);
    }
    else if ((!args.presentationDefinitions || args.presentationDefinitions.length === 0) &&
        presentationsWithFormat &&
        ((Array.isArray(presentationsWithFormat) && presentationsWithFormat.length > 0) || !Array.isArray(presentationsWithFormat))) {
        throw new Error(types_1.SIOPErrors.AUTH_REQUEST_DOESNT_EXPECT_VP);
    }
    else if (args.presentationDefinitions && !args.opts.presentationSubmission) {
        throw new Error(`No presentation submission present. Please use presentationSubmission opt argument!`);
    }
    else if (args.presentationDefinitions && presentationsWithFormat) {
        yield PresentationExchange_1.PresentationExchange.validatePresentationsAgainstDefinitions(args.presentationDefinitions, presentationsWithFormat, args.verificationCallback, args.opts);
    }
});
exports.assertValidVerifiablePresentations = assertValidVerifiablePresentations;
//# sourceMappingURL=OpenID4VP.js.map