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
exports.PresentationExchange = void 0;
const pex_1 = require("@sphereon/pex");
const ssi_types_1 = require("@sphereon/ssi-types");
const helpers_1 = require("../helpers");
const types_1 = require("../types");
const types_2 = require("./types");
class PresentationExchange {
    constructor(opts) {
        this.allDIDs = opts.allDIDs;
        this.allVerifiableCredentials = opts.allVerifiableCredentials;
        this.pex = new pex_1.PEX({ hasher: opts.hasher });
    }
    /**
     * Construct presentation submission from selected credentials
     * @param presentationDefinition payload object received by the OP from the RP
     * @param selectedCredentials
     * @param presentationSignCallback
     * @param options
     */
    createVerifiablePresentation(presentationDefinition, selectedCredentials, presentationSignCallback, 
    // options2?: { nonce?: string; domain?: string, proofType?: IProofType, verificationMethod?: string, signatureKeyEncoding?: KeyEncoding },
    options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            if (!presentationDefinition) {
                throw new Error(types_1.SIOPErrors.REQUEST_CLAIMS_PRESENTATION_DEFINITION_NOT_VALID);
            }
            const signOptions = Object.assign(Object.assign({}, options), { presentationSubmissionLocation: pex_1.PresentationSubmissionLocation.EXTERNAL, proofOptions: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.proofOptions), { proofPurpose: (_b = (_a = options === null || options === void 0 ? void 0 : options.proofOptions) === null || _a === void 0 ? void 0 : _a.proofPurpose) !== null && _b !== void 0 ? _b : ssi_types_1.IProofPurpose.authentication, type: (_d = (_c = options === null || options === void 0 ? void 0 : options.proofOptions) === null || _c === void 0 ? void 0 : _c.type) !== null && _d !== void 0 ? _d : ssi_types_1.IProofType.EcdsaSecp256k1Signature2019 }), signatureOptions: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.signatureOptions), { 
                    // verificationMethod: options?.signatureOptions?.verificationMethod,
                    keyEncoding: (_f = (_e = options === null || options === void 0 ? void 0 : options.signatureOptions) === null || _e === void 0 ? void 0 : _e.keyEncoding) !== null && _f !== void 0 ? _f : pex_1.KeyEncoding.Hex }) });
            return yield this.pex.verifiablePresentationFrom(presentationDefinition, selectedCredentials, presentationSignCallback, signOptions);
        });
    }
    /**
     * This method will be called from the OP when we are certain that we have a
     * PresentationDefinition object inside our requestPayload
     * Finds a set of `VerifiableCredential`s from a list supplied to this class during construction,
     * matching presentationDefinition object found in the requestPayload
     * if requestPayload doesn't contain any valid presentationDefinition throws an error
     * if PEX library returns any error in the process, throws the error
     * returns the SelectResults object if successful
     * @param presentationDefinition object received by the OP from the RP
     * @param opts
     */
    selectVerifiableCredentialsForSubmission(presentationDefinition, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!presentationDefinition) {
                throw new Error(types_1.SIOPErrors.REQUEST_CLAIMS_PRESENTATION_DEFINITION_NOT_VALID);
            }
            else if (!this.allVerifiableCredentials || this.allVerifiableCredentials.length == 0) {
                throw new Error(`${types_1.SIOPErrors.COULD_NOT_FIND_VCS_MATCHING_PD}, no VCs were provided`);
            }
            const selectResults = this.pex.selectFrom(presentationDefinition, this.allVerifiableCredentials, Object.assign(Object.assign({}, opts), { holderDIDs: (_a = opts === null || opts === void 0 ? void 0 : opts.holderDIDs) !== null && _a !== void 0 ? _a : this.allDIDs, 
                // fixme limited disclosure
                limitDisclosureSignatureSuites: [] }));
            if (selectResults.areRequiredCredentialsPresent === pex_1.Status.ERROR) {
                throw new Error(`message: ${types_1.SIOPErrors.COULD_NOT_FIND_VCS_MATCHING_PD}, details: ${JSON.stringify(selectResults.errors)}`);
            }
            return selectResults;
        });
    }
    static assertValidPresentationSubmission(presentationSubmission) {
        const validationResult = pex_1.PEX.validateSubmission(presentationSubmission);
        if ((Array.isArray(validationResult) && validationResult[0].message != 'ok') ||
            (!Array.isArray(validationResult) && validationResult.message != 'ok')) {
            throw new Error(`${types_1.SIOPErrors.RESPONSE_OPTS_PRESENTATIONS_SUBMISSION_IS_NOT_VALID}, details ${JSON.stringify(validationResult)}`);
        }
    }
    /**
     * Finds a valid PresentationDefinition inside the given AuthenticationRequestPayload
     * throws exception if the PresentationDefinition is not valid
     * returns null if no property named "presentation_definition" is found
     * returns a PresentationDefinition if a valid instance found
     * @param authorizationRequestPayload object that can have a presentation_definition inside
     * @param version
     */
    static findValidPresentationDefinitions(authorizationRequestPayload, version) {
        return __awaiter(this, void 0, void 0, function* () {
            const allDefinitions = [];
            function extractDefinitionFromVPToken() {
                return __awaiter(this, void 0, void 0, function* () {
                    const vpTokens = (0, helpers_1.extractDataFromPath)(authorizationRequestPayload, '$..vp_token.presentation_definition').map((d) => d.value);
                    const vpTokenRefs = (0, helpers_1.extractDataFromPath)(authorizationRequestPayload, '$..vp_token.presentation_definition_uri');
                    if (vpTokens && vpTokens.length && vpTokenRefs && vpTokenRefs.length) {
                        throw new Error(types_1.SIOPErrors.REQUEST_CLAIMS_PRESENTATION_DEFINITION_BY_REF_AND_VALUE_NON_EXCLUSIVE);
                    }
                    if (vpTokens && vpTokens.length) {
                        vpTokens.forEach((vpToken) => {
                            if (allDefinitions.find((value) => value.definition.id === vpToken.id)) {
                                console.log(`Warning. We encountered presentation definition with id ${vpToken.id}, more then once whilst processing! Make sure your payload is valid!`);
                                return;
                            }
                            PresentationExchange.assertValidPresentationDefinition(vpToken);
                            allDefinitions.push({
                                definition: vpToken,
                                location: types_2.PresentationDefinitionLocation.CLAIMS_VP_TOKEN,
                                version,
                            });
                        });
                    }
                    else if (vpTokenRefs && vpTokenRefs.length) {
                        for (const vpTokenRef of vpTokenRefs) {
                            const pd = (yield (0, helpers_1.getWithUrl)(vpTokenRef.value));
                            if (allDefinitions.find((value) => value.definition.id === pd.id)) {
                                console.log(`Warning. We encountered presentation definition with id ${pd.id}, more then once whilst processing! Make sure your payload is valid!`);
                                return;
                            }
                            PresentationExchange.assertValidPresentationDefinition(pd);
                            allDefinitions.push({ definition: pd, location: types_2.PresentationDefinitionLocation.CLAIMS_VP_TOKEN, version });
                        }
                    }
                });
            }
            function addSingleToplevelPDToPDs(definition, version) {
                if (allDefinitions.find((value) => value.definition.id === definition.id)) {
                    console.log(`Warning. We encountered presentation definition with id ${definition.id}, more then once whilst processing! Make sure your payload is valid!`);
                    return;
                }
                PresentationExchange.assertValidPresentationDefinition(definition);
                allDefinitions.push({
                    definition,
                    location: types_2.PresentationDefinitionLocation.TOPLEVEL_PRESENTATION_DEF,
                    version,
                });
            }
            function extractDefinitionFromTopLevelDefinitionProperty(version) {
                return __awaiter(this, void 0, void 0, function* () {
                    const definitions = (0, helpers_1.extractDataFromPath)(authorizationRequestPayload, '$.presentation_definition');
                    const definitionsFromList = (0, helpers_1.extractDataFromPath)(authorizationRequestPayload, '$.presentation_definition[*]');
                    const definitionRefs = (0, helpers_1.extractDataFromPath)(authorizationRequestPayload, '$.presentation_definition_uri');
                    const definitionRefsFromList = (0, helpers_1.extractDataFromPath)(authorizationRequestPayload, '$.presentation_definition_uri[*]');
                    const hasPD = (definitions && definitions.length > 0) || (definitionsFromList && definitionsFromList.length > 0);
                    const hasPdRef = (definitionRefs && definitionRefs.length > 0) || (definitionRefsFromList && definitionRefsFromList.length > 0);
                    if (hasPD && hasPdRef) {
                        throw new Error(types_1.SIOPErrors.REQUEST_CLAIMS_PRESENTATION_DEFINITION_BY_REF_AND_VALUE_NON_EXCLUSIVE);
                    }
                    if (definitions && definitions.length > 0) {
                        definitions.forEach((definition) => {
                            addSingleToplevelPDToPDs(definition.value, version);
                        });
                    }
                    else if (definitionsFromList && definitionsFromList.length > 0) {
                        definitionsFromList.forEach((definition) => {
                            addSingleToplevelPDToPDs(definition.value, version);
                        });
                    }
                    else if (definitionRefs && definitionRefs.length > 0) {
                        for (const definitionRef of definitionRefs) {
                            const pd = yield (0, helpers_1.getWithUrl)(definitionRef.value);
                            addSingleToplevelPDToPDs(pd, version);
                        }
                    }
                    else if (definitionsFromList && definitionRefsFromList.length > 0) {
                        for (const definitionRef of definitionRefsFromList) {
                            const pd = yield (0, helpers_1.getWithUrl)(definitionRef.value);
                            addSingleToplevelPDToPDs(pd, version);
                        }
                    }
                });
            }
            if (authorizationRequestPayload) {
                if (!version || version < types_1.SupportedVersion.SIOPv2_D11) {
                    yield extractDefinitionFromVPToken();
                }
                yield extractDefinitionFromTopLevelDefinitionProperty();
            }
            return allDefinitions;
        });
    }
    static assertValidPresentationDefinitionWithLocations(definitionsWithLocations) {
        if (definitionsWithLocations && definitionsWithLocations.length > 0) {
            definitionsWithLocations.forEach((definitionWithLocation) => PresentationExchange.assertValidPresentationDefinition(definitionWithLocation.definition));
        }
    }
    static assertValidPresentationDefinition(presentationDefinition) {
        const validationResult = pex_1.PEX.validateDefinition(presentationDefinition);
        if ((Array.isArray(validationResult) && validationResult[0].message != 'ok') ||
            (!Array.isArray(validationResult) && validationResult.message != 'ok')) {
            throw new Error(`${types_1.SIOPErrors.REQUEST_CLAIMS_PRESENTATION_DEFINITION_NOT_VALID}`);
        }
    }
    static validatePresentationsAgainstDefinitions(definitions, vpPayloads, verifyPresentationCallback, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!definitions || !vpPayloads || (Array.isArray(vpPayloads) && vpPayloads.length === 0) || !definitions.length) {
                throw new Error(types_1.SIOPErrors.COULD_NOT_FIND_VCS_MATCHING_PD);
            }
            yield Promise.all(definitions.map((pd) => __awaiter(this, void 0, void 0, function* () { return yield PresentationExchange.validatePresentationsAgainstDefinition(pd.definition, vpPayloads, verifyPresentationCallback, opts); })));
        });
    }
    static validatePresentationsAgainstDefinition(definition, vpPayloads, verifyPresentationCallback, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pex = new pex_1.PEX({ hasher: opts === null || opts === void 0 ? void 0 : opts.hasher });
            const vpPayloadsArray = Array.isArray(vpPayloads) ? vpPayloads : [vpPayloads];
            let evaluationResults = undefined;
            if (opts === null || opts === void 0 ? void 0 : opts.presentationSubmission) {
                evaluationResults = pex.evaluatePresentation(definition, Array.isArray(vpPayloads) ? vpPayloads.map((wvp) => wvp.original) : vpPayloads.original, Object.assign(Object.assign({}, opts), { 
                    // We always have external presentation submissions here. Some older versions of OID4VP allow for submission in presentation,
                    // but in that case the submission will not be provided
                    presentationSubmissionLocation: pex_1.PresentationSubmissionLocation.EXTERNAL }));
            }
            else {
                for (const wvp of vpPayloadsArray) {
                    if (ssi_types_1.CredentialMapper.isWrappedW3CVerifiablePresentation(wvp) && wvp.presentation.presentation_submission) {
                        const presentationSubmission = wvp.presentation.presentation_submission;
                        evaluationResults = pex.evaluatePresentation(definition, wvp.original, Object.assign(Object.assign({}, opts), { presentationSubmission, presentationSubmissionLocation: pex_1.PresentationSubmissionLocation.PRESENTATION }));
                        const submission = evaluationResults.value;
                        // Found valid submission
                        if (evaluationResults.areRequiredCredentialsPresent && submission && submission.definition_id === definition.id)
                            break;
                    }
                }
            }
            if (!evaluationResults) {
                throw new Error(types_1.SIOPErrors.NO_PRESENTATION_SUBMISSION);
            }
            if (evaluationResults.areRequiredCredentialsPresent === pex_1.Status.ERROR || ((_a = evaluationResults.errors) === null || _a === void 0 ? void 0 : _a.length) || !evaluationResults.value) {
                throw new Error(`message: ${types_1.SIOPErrors.COULD_NOT_FIND_VCS_MATCHING_PD}, details: ${JSON.stringify(evaluationResults.errors)}`);
            }
            if (evaluationResults.value.definition_id !== definition.id) {
                throw new Error(`${types_1.SIOPErrors.PRESENTATION_SUBMISSION_DEFINITION_ID_DOES_NOT_MATCHING_DEFINITION_ID}. submission.definition_id: ${evaluationResults.value.definition_id}, definition.id: ${definition.id}`);
            }
            const presentationsToVerify = Array.isArray(evaluationResults.presentation) ? evaluationResults.presentation : [evaluationResults.presentation];
            // The verifyPresentationCallback function is mandatory for RP only,
            // So the behavior here is to bypass it if not present
            if (verifyPresentationCallback && evaluationResults.value !== undefined) {
                // Verify the signature of all VPs
                yield Promise.all(presentationsToVerify.map((presentation) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const verificationResult = yield verifyPresentationCallback(presentation, evaluationResults.value);
                        if (!verificationResult.verified) {
                            throw new Error(types_1.SIOPErrors.VERIFIABLE_PRESENTATION_SIGNATURE_NOT_VALID + verificationResult.reason ? `. ${verificationResult.reason}` : '');
                        }
                    }
                    catch (error) {
                        throw new Error(types_1.SIOPErrors.VERIFIABLE_PRESENTATION_SIGNATURE_NOT_VALID);
                    }
                })));
            }
            PresentationExchange.assertValidPresentationSubmission(evaluationResults.value);
            return evaluationResults;
        });
    }
}
exports.PresentationExchange = PresentationExchange;
//# sourceMappingURL=PresentationExchange.js.map