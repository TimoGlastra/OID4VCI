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
exports.validateLinkedDomainWithDid = void 0;
const wellknown_dids_client_1 = require("@sphereon/wellknown-dids-client");
const types_1 = require("./../types/");
const DIDResolution_1 = require("./DIDResolution");
const DidJWT_1 = require("./DidJWT");
function getValidationErrorMessages(validationResult) {
    var _a;
    const messages = [];
    if (validationResult.message) {
        messages.push(validationResult.message);
    }
    if ((_a = validationResult === null || validationResult === void 0 ? void 0 : validationResult.endpointDescriptors) === null || _a === void 0 ? void 0 : _a.length) {
        for (const endpointDescriptor of validationResult.endpointDescriptors) {
            if (endpointDescriptor.message) {
                messages.push(endpointDescriptor.message);
            }
            if (endpointDescriptor.resources) {
                for (const resource of endpointDescriptor.resources) {
                    if (resource.message) {
                        messages.push(resource.message);
                    }
                }
            }
        }
    }
    return messages;
}
/**
 * @param validationErrorMessages
 * @return returns false if the messages received from wellknown-dids-client makes this invalid for CheckLinkedDomain.IF_PRESENT plus the message itself
 *                  and true for when we can move on
 */
function checkInvalidMessages(validationErrorMessages) {
    if (!validationErrorMessages || !validationErrorMessages.length) {
        return { status: false, message: 'linked domain is invalid.' };
    }
    const validMessages = [
        wellknown_dids_client_1.WDCErrors.PROPERTY_LINKED_DIDS_DOES_NOT_CONTAIN_ANY_DOMAIN_LINK_CREDENTIALS.valueOf(),
        wellknown_dids_client_1.WDCErrors.PROPERTY_LINKED_DIDS_NOT_PRESENT.valueOf(),
        wellknown_dids_client_1.WDCErrors.PROPERTY_TYPE_NOT_CONTAIN_VALID_LINKED_DOMAIN.valueOf(),
        wellknown_dids_client_1.WDCErrors.PROPERTY_SERVICE_NOT_PRESENT.valueOf(),
    ];
    for (const validationErrorMessage of validationErrorMessages) {
        if (!validMessages.filter((vm) => validationErrorMessage.includes(vm)).pop()) {
            return { status: false, message: validationErrorMessage };
        }
    }
    return { status: true };
}
function validateLinkedDomainWithDid(did, verification) {
    return __awaiter(this, void 0, void 0, function* () {
        const { checkLinkedDomain, resolveOpts, wellknownDIDVerifyCallback } = verification;
        if (checkLinkedDomain === types_1.CheckLinkedDomain.NEVER) {
            return;
        }
        const didDocument = yield (0, DIDResolution_1.resolveDidDocument)(did, Object.assign(Object.assign({}, resolveOpts), { subjectSyntaxTypesSupported: [(0, DidJWT_1.toSIOPRegistrationDidMethod)((0, DidJWT_1.getMethodFromDid)(did))] }));
        if (!didDocument) {
            throw Error(`Could not resolve DID: ${did}`);
        }
        if ((!didDocument.service || !didDocument.service.find((s) => s.type === 'LinkedDomains')) && checkLinkedDomain === types_1.CheckLinkedDomain.IF_PRESENT) {
            // No linked domains in DID document and it was optional. Let's cut it short here.
            return;
        }
        try {
            if (!wellknownDIDVerifyCallback) {
                return Promise.reject(Error('wellknownDIDVerifyCallback is required for checkWellKnownDid'));
            }
            const validationResult = yield checkWellKnownDid({ didDocument, verifyCallback: wellknownDIDVerifyCallback });
            if (validationResult.status === wellknown_dids_client_1.ValidationStatusEnum.INVALID) {
                const validationErrorMessages = getValidationErrorMessages(validationResult);
                const messageCondition = checkInvalidMessages(validationErrorMessages);
                if (checkLinkedDomain === types_1.CheckLinkedDomain.ALWAYS || (checkLinkedDomain === types_1.CheckLinkedDomain.IF_PRESENT && !messageCondition.status)) {
                    throw new Error(messageCondition.message ? messageCondition.message : validationErrorMessages[0]);
                }
            }
        }
        catch (err) {
            const messageCondition = checkInvalidMessages([err.message]);
            if (checkLinkedDomain === types_1.CheckLinkedDomain.ALWAYS || (checkLinkedDomain === types_1.CheckLinkedDomain.IF_PRESENT && !messageCondition.status)) {
                throw new Error(err.message);
            }
        }
    });
}
exports.validateLinkedDomainWithDid = validateLinkedDomainWithDid;
function checkWellKnownDid(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const verifier = new wellknown_dids_client_1.WellKnownDidVerifier({
            verifySignatureCallback: args.verifyCallback,
            onlyVerifyServiceDid: false,
        });
        return yield verifier.verifyDomainLinkage({ didDocument: args.didDocument });
    });
}
//# sourceMappingURL=LinkedDomainValidations.js.map