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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSIOPSpecVersionSupported = exports.authorizationRequestVersionDiscovery = void 0;
const schemas_1 = require("../schemas");
const schemaValidation_1 = require("../schemas/validation/schemaValidation");
const types_1 = require("../types");
const Errors_1 = __importDefault(require("../types/Errors"));
const validateJWTVCPresentationProfile = schemas_1.AuthorizationRequestPayloadVID1Schema;
function isJWTVC1Payload(authorizationRequest) {
    return (authorizationRequest.scope &&
        authorizationRequest.scope.toLowerCase().includes('openid') &&
        authorizationRequest.response_type &&
        authorizationRequest.response_type.toLowerCase().includes('id_token') &&
        authorizationRequest.response_mode &&
        authorizationRequest.response_mode.toLowerCase() === 'post' &&
        authorizationRequest.client_id &&
        authorizationRequest.client_id.toLowerCase().startsWith('did:') &&
        authorizationRequest.redirect_uri &&
        (authorizationRequest.registration_uri || authorizationRequest.registration) &&
        authorizationRequest.claims &&
        'vp_token' in authorizationRequest.claims);
}
function isID1Payload(authorizationRequest) {
    return (!authorizationRequest.client_metadata_uri &&
        !authorizationRequest.client_metadata &&
        !authorizationRequest.presentation_definition &&
        !authorizationRequest.presentation_definition_uri);
}
const authorizationRequestVersionDiscovery = (authorizationRequest) => {
    const versions = [];
    const authorizationRequestCopy = JSON.parse(JSON.stringify(authorizationRequest));
    const vd13Validation = (0, schemaValidation_1.AuthorizationRequestPayloadVD12OID4VPD20Schema)(authorizationRequestCopy);
    if (vd13Validation) {
        if (!authorizationRequestCopy.registration_uri &&
            !authorizationRequestCopy.registration &&
            !(authorizationRequestCopy.claims && 'vp_token' in authorizationRequestCopy.claims) &&
            authorizationRequestCopy.response_mode !== types_1.ResponseMode.POST // Post has been replaced by direct post
        ) {
            versions.push(types_1.SupportedVersion.SIOPv2_D12_OID4VP_D20);
        }
    }
    // todo: We could use v11 validation for v12 for now, as we do not differentiate in the schema at this point\
    const vd12Validation = (0, schemaValidation_1.AuthorizationRequestPayloadVD12OID4VPD18Schema)(authorizationRequestCopy);
    if (vd12Validation) {
        if (!authorizationRequestCopy.registration_uri &&
            !authorizationRequestCopy.registration &&
            !(authorizationRequestCopy.claims && 'vp_token' in authorizationRequestCopy.claims) &&
            authorizationRequestCopy.response_mode !== types_1.ResponseMode.POST // Post has been replaced by direct post
        ) {
            versions.push(types_1.SupportedVersion.SIOPv2_D12_OID4VP_D18);
        }
    }
    const vd11Validation = (0, schemas_1.AuthorizationRequestPayloadVD11Schema)(authorizationRequestCopy);
    if (vd11Validation) {
        if (!authorizationRequestCopy.registration_uri &&
            !authorizationRequestCopy.registration &&
            !(authorizationRequestCopy.claims && 'vp_token' in authorizationRequestCopy.claims) &&
            !authorizationRequestCopy.client_id_scheme && // introduced after v11
            !authorizationRequestCopy.response_uri &&
            authorizationRequestCopy.response_mode !== types_1.ResponseMode.DIRECT_POST // Direct post was used before v12 oid4vp18
        ) {
            versions.push(types_1.SupportedVersion.SIOPv2_D11);
        }
    }
    const jwtVC1Validation = validateJWTVCPresentationProfile(authorizationRequestCopy);
    if (jwtVC1Validation && isJWTVC1Payload(authorizationRequest)) {
        versions.push(types_1.SupportedVersion.JWT_VC_PRESENTATION_PROFILE_v1);
    }
    const vid1Validation = (0, schemas_1.AuthorizationRequestPayloadVID1Schema)(authorizationRequestCopy);
    if (vid1Validation && isID1Payload(authorizationRequest)) {
        versions.push(types_1.SupportedVersion.SIOPv2_ID1);
    }
    if (versions.length === 0) {
        throw new Error(Errors_1.default.SIOP_VERSION_NOT_SUPPORTED);
    }
    return versions;
};
exports.authorizationRequestVersionDiscovery = authorizationRequestVersionDiscovery;
const checkSIOPSpecVersionSupported = (payload, supportedVersions) => __awaiter(void 0, void 0, void 0, function* () {
    const versions = (0, exports.authorizationRequestVersionDiscovery)(payload);
    if (!supportedVersions || supportedVersions.length === 0) {
        return versions;
    }
    return supportedVersions.filter((version) => versions.includes(version));
});
exports.checkSIOPSpecVersionSupported = checkSIOPSpecVersionSupported;
//# sourceMappingURL=SIOPSpecVersion.js.map