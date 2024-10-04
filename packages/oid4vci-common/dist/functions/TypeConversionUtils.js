"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypesFromCredentialSupported = exports.getTypesFromAuthorizationDetails = exports.getTypesFromCredentialOffer = exports.getTypesFromObject = exports.getNumberOrUndefined = exports.isW3cCredentialSupported = void 0;
const index_1 = require("../index");
function isW3cCredentialSupported(supported) {
    return ['jwt_vc_json', 'jwt_vc_json-ld', 'ldp_vc', 'jwt_vc'].includes(supported.format);
}
exports.isW3cCredentialSupported = isW3cCredentialSupported;
const getNumberOrUndefined = (input) => {
    return input && !isNaN(+input) ? +input : undefined;
};
exports.getNumberOrUndefined = getNumberOrUndefined;
/**
 * The specs had many places where types could be expressed. This method ensures we get them in any way possible
 * @param subject
 */
function getTypesFromObject(subject) {
    if (subject === undefined) {
        return undefined;
    }
    else if (typeof subject === 'string') {
        return [subject];
    }
    else if ('credential_definition' in subject) {
        return getTypesFromObject(subject.credential_definition);
    }
    else if ('types' in subject && subject.types) {
        return Array.isArray(subject.types) ? subject.types : [subject.types];
    }
    else if ('type' in subject && subject.type) {
        return Array.isArray(subject.type) ? subject.type : [subject.type];
    }
    else if ('vct' in subject && subject.vct) {
        return [subject.vct];
    }
    else if ('doctype' in subject && subject.doctype) {
        return [subject.doctype];
    }
    index_1.VCI_LOG_COMMON.warning('Could not deduce credential types. Probably a failure down the line will happen!');
    return undefined;
}
exports.getTypesFromObject = getTypesFromObject;
function getTypesFromCredentialOffer(offer, opts) {
    const { configIdAsType = false } = Object.assign({}, opts);
    if ('credentials' in offer && Array.isArray(offer.credentials)) {
        return offer.credentials.map((cred) => getTypesFromObject(cred)).filter((cred) => cred !== undefined);
    }
    else if (configIdAsType && 'credential_configuration_ids' in offer && Array.isArray(offer.credential_configuration_ids)) {
        return offer.credential_configuration_ids.map((id) => [id]);
    }
    else if ('credential_offer' in offer && offer.credential_offer) {
        return getTypesFromCredentialOffer(offer.credential_offer, opts);
    }
    else if ('credential_type' in offer && offer.credential_type) {
        if (typeof offer.credential_type === 'string') {
            return [[offer.credential_type]];
        }
        else if (Array.isArray(offer.credential_type)) {
            return [offer.credential_type];
        }
    }
    index_1.VCI_LOG_COMMON.warning('Could not deduce credential types from offer. Probably a failure down the line will happen!');
    return undefined;
}
exports.getTypesFromCredentialOffer = getTypesFromCredentialOffer;
function getTypesFromAuthorizationDetails(authDetails, opts) {
    const { configIdAsType = false } = Object.assign({}, opts);
    if (typeof authDetails === 'string') {
        return [authDetails];
    }
    else if ('types' in authDetails && Array.isArray(authDetails.types)) {
        return authDetails.types;
    }
    else if (configIdAsType && authDetails.credential_configuration_id) {
        return [authDetails.credential_configuration_id];
    }
    return undefined;
}
exports.getTypesFromAuthorizationDetails = getTypesFromAuthorizationDetails;
function getTypesFromCredentialSupported(credentialSupported, opts) {
    var _a;
    let types = [];
    if (credentialSupported.format === 'jwt_vc_json' ||
        credentialSupported.format === 'jwt_vc' ||
        credentialSupported.format === 'jwt_vc_json-ld' ||
        credentialSupported.format === 'ldp_vc') {
        types = (_a = getTypesFromObject(credentialSupported)) !== null && _a !== void 0 ? _a : [];
    }
    else if (credentialSupported.format === 'vc+sd-jwt') {
        types = [credentialSupported.vct];
    }
    else if (credentialSupported.format === 'mso_mdoc') {
        types = [credentialSupported.doctype];
    }
    if (!types || types.length === 0) {
        throw Error('Could not deduce types from credential supported');
    }
    if (opts === null || opts === void 0 ? void 0 : opts.filterVerifiableCredential) {
        return types.filter((type) => type !== 'VerifiableCredential');
    }
    return types;
}
exports.getTypesFromCredentialSupported = getTypesFromCredentialSupported;
//# sourceMappingURL=TypeConversionUtils.js.map