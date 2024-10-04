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
exports.verifyRevocation = void 0;
const ssi_types_1 = require("@sphereon/ssi-types");
const types_1 = require("../types");
const verifyRevocation = (vpToken, revocationVerificationCallback, revocationVerification) => __awaiter(void 0, void 0, void 0, function* () {
    if (!vpToken) {
        throw new Error(`VP token not provided`);
    }
    if (!revocationVerificationCallback) {
        throw new Error(`Revocation callback not provided`);
    }
    const vcs = ssi_types_1.CredentialMapper.isWrappedSdJwtVerifiablePresentation(vpToken) || ssi_types_1.CredentialMapper.isWrappedMdocPresentation(vpToken)
        ? [vpToken.vcs[0]]
        : vpToken.presentation.verifiableCredential;
    for (const vc of vcs) {
        if (revocationVerification === types_1.RevocationVerification.ALWAYS ||
            (revocationVerification === types_1.RevocationVerification.IF_PRESENT && credentialHasStatus(vc))) {
            const result = yield revocationVerificationCallback(vc.original, originalTypeToVerifiableCredentialTypeFormat(vc.format));
            if (result.status === types_1.RevocationStatus.INVALID) {
                throw new Error(`Revocation invalid for vc. Error: ${result.error}`);
            }
        }
    }
});
exports.verifyRevocation = verifyRevocation;
function originalTypeToVerifiableCredentialTypeFormat(original) {
    const mapping = {
        'vc+sd-jwt': types_1.VerifiableCredentialTypeFormat.SD_JWT_VC,
        jwt: types_1.VerifiableCredentialTypeFormat.JWT_VC,
        jwt_vc: types_1.VerifiableCredentialTypeFormat.JWT_VC,
        ldp: types_1.VerifiableCredentialTypeFormat.LDP_VC,
        ldp_vc: types_1.VerifiableCredentialTypeFormat.LDP_VC,
        mso_mdoc: types_1.VerifiableCredentialTypeFormat.MSO_MDOC,
    };
    return mapping[original];
}
/**
 * Checks whether a wrapped verifiable credential has a status in the credential.
 * For w3c credentials it will check the presence of `credentialStatus` property
 * For SD-JWT it will check the presence of `status` property
 */
function credentialHasStatus(wrappedVerifiableCredential) {
    if (ssi_types_1.CredentialMapper.isWrappedSdJwtVerifiableCredential(wrappedVerifiableCredential)) {
        return wrappedVerifiableCredential.decoded.status !== undefined;
    }
    else {
        return wrappedVerifiableCredential.credential.credentialStatus !== undefined;
    }
}
//# sourceMappingURL=Revocation.js.map