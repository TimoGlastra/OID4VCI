"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidPinNumber = exports.isPreAuthorizedCodeExpired = exports.createCredentialOfferURIv1_0_11 = exports.createCredentialOfferURI = exports.createCredentialOfferURIFromObject = exports.createCredentialOfferObjectv1_0_11 = exports.createCredentialOfferObject = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
function createCredentialOfferObject(issuerMetadata, 
// todo: probably it's wise to create another builder for CredentialOfferPayload that will generate different kinds of CredentialOfferPayload
opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if (!issuerMetadata && !(opts === null || opts === void 0 ? void 0 : opts.credentialOffer) && !(opts === null || opts === void 0 ? void 0 : opts.credentialOfferUri)) {
        throw new Error('You have to provide issuerMetadata or credentialOffer object for creating a deeplink');
    }
    const scheme = (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.scheme) === null || _a === void 0 ? void 0 : _a.replace('://', '')) !== null && _b !== void 0 ? _b : (((_c = opts === null || opts === void 0 ? void 0 : opts.baseUri) === null || _c === void 0 ? void 0 : _c.includes('://')) ? opts.baseUri.split('://')[0] : 'openid-credential-offer');
    let baseUri;
    if (opts === null || opts === void 0 ? void 0 : opts.baseUri) {
        baseUri = opts.baseUri;
    }
    else if (scheme.startsWith('http')) {
        if (issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credential_issuer) {
            baseUri = issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credential_issuer;
            if (!baseUri.startsWith(`${scheme}://`)) {
                throw Error(`scheme ${scheme} is different from base uri ${baseUri}`);
            }
        }
        else {
            throw Error(`A '${scheme}' scheme requires a URI to be present as baseUri`);
        }
    }
    else {
        baseUri = '';
    }
    baseUri = baseUri.replace(`${scheme}://`, '');
    const credential_offer_uri = (opts === null || opts === void 0 ? void 0 : opts.credentialOfferUri) ? `${scheme}://${baseUri}?credential_offer_uri=${opts === null || opts === void 0 ? void 0 : opts.credentialOfferUri}` : undefined;
    let credential_offer;
    if (opts === null || opts === void 0 ? void 0 : opts.credentialOffer) {
        credential_offer = Object.assign({}, opts.credentialOffer);
    }
    else {
        if (!(issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credential_configurations_supported)) {
            throw new Error('credential_configurations_supported is mandatory in the metadata');
        }
        credential_offer = {
            credential_issuer: issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credential_issuer,
            credential_configuration_ids: Object.keys(issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credential_configurations_supported),
        };
    }
    if (!credential_offer.grants) {
        credential_offer.grants = {};
    }
    if (opts === null || opts === void 0 ? void 0 : opts.preAuthorizedCode) {
        credential_offer.grants[oid4vci_common_1.PRE_AUTH_GRANT_LITERAL] = {
            'pre-authorized_code': opts.preAuthorizedCode,
            tx_code: (_e = ((_d = opts.grants) === null || _d === void 0 ? void 0 : _d[oid4vci_common_1.PRE_AUTH_GRANT_LITERAL]).tx_code) !== null && _e !== void 0 ? _e : undefined,
        };
    }
    else if (!((_g = (_f = credential_offer.grants) === null || _f === void 0 ? void 0 : _f.authorization_code) === null || _g === void 0 ? void 0 : _g.issuer_state)) {
        credential_offer.grants = {
            authorization_code: {
                issuer_state: (_h = opts === null || opts === void 0 ? void 0 : opts.issuerState) !== null && _h !== void 0 ? _h : (0, oid4vc_common_1.uuidv4)(),
            },
        };
    }
    // todo: check payload against issuer metadata. Especially strings in the credentials array: When processing, the Wallet MUST resolve this string value to the respective object.
    if (!credential_offer.grants) {
        credential_offer.grants = {};
    }
    if (opts === null || opts === void 0 ? void 0 : opts.preAuthorizedCode) {
        credential_offer.grants[oid4vci_common_1.PRE_AUTH_GRANT_LITERAL] = {
            'pre-authorized_code': opts.preAuthorizedCode,
            tx_code: opts.txCode,
        };
    }
    else if (!((_k = (_j = credential_offer.grants) === null || _j === void 0 ? void 0 : _j.authorization_code) === null || _k === void 0 ? void 0 : _k.issuer_state)) {
        credential_offer.grants = {
            authorization_code: {
                issuer_state: (_l = opts === null || opts === void 0 ? void 0 : opts.issuerState) !== null && _l !== void 0 ? _l : (0, oid4vc_common_1.uuidv4)(),
            },
        };
    }
    return { credential_offer, credential_offer_uri, scheme, baseUri, grants: credential_offer.grants };
}
exports.createCredentialOfferObject = createCredentialOfferObject;
function createCredentialOfferObjectv1_0_11(issuerMetadata, 
// todo: probably it's wise to create another builder for CredentialOfferPayload that will generate different kinds of CredentialOfferPayload
opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (!issuerMetadata && !(opts === null || opts === void 0 ? void 0 : opts.credentialOffer) && !(opts === null || opts === void 0 ? void 0 : opts.credentialOfferUri)) {
        throw new Error('You have to provide issuerMetadata or credentialOffer object for creating a deeplink');
    }
    const scheme = (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.scheme) === null || _a === void 0 ? void 0 : _a.replace('://', '')) !== null && _b !== void 0 ? _b : (((_c = opts === null || opts === void 0 ? void 0 : opts.baseUri) === null || _c === void 0 ? void 0 : _c.includes('://')) ? opts.baseUri.split('://')[0] : 'openid-credential-offer');
    let baseUri;
    if (opts === null || opts === void 0 ? void 0 : opts.baseUri) {
        baseUri = opts.baseUri;
    }
    else if (scheme.startsWith('http')) {
        if (issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credential_issuer) {
            baseUri = issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credential_issuer;
            if (!baseUri.startsWith(`${scheme}://`)) {
                throw Error(`scheme ${scheme} is different from base uri ${baseUri}`);
            }
        }
        else {
            throw Error(`A '${scheme}' scheme requires a URI to be present as baseUri`);
        }
    }
    else {
        baseUri = '';
    }
    baseUri = baseUri.replace(`${scheme}://`, '');
    const credential_offer_uri = (opts === null || opts === void 0 ? void 0 : opts.credentialOfferUri) ? `${scheme}://${baseUri}?credential_offer_uri=${opts === null || opts === void 0 ? void 0 : opts.credentialOfferUri}` : undefined;
    let credential_offer;
    if (opts === null || opts === void 0 ? void 0 : opts.credentialOffer) {
        credential_offer = Object.assign(Object.assign({}, opts.credentialOffer), { credentials: (_e = (_d = opts.credentialOffer) === null || _d === void 0 ? void 0 : _d.credentials) !== null && _e !== void 0 ? _e : issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credentials_supported });
    }
    else {
        credential_offer = {
            credential_issuer: issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credential_issuer,
            credentials: issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credentials_supported,
        };
    }
    // todo: check payload against issuer metadata. Especially strings in the credentials array: When processing, the Wallet MUST resolve this string value to the respective object.
    if (!credential_offer.grants) {
        credential_offer.grants = {};
    }
    if (opts === null || opts === void 0 ? void 0 : opts.preAuthorizedCode) {
        credential_offer.grants[oid4vci_common_1.PRE_AUTH_GRANT_LITERAL] = {
            'pre-authorized_code': opts.preAuthorizedCode,
            user_pin_required: (_f = opts.userPinRequired) !== null && _f !== void 0 ? _f : false,
        };
    }
    else if (!((_h = (_g = credential_offer.grants) === null || _g === void 0 ? void 0 : _g.authorization_code) === null || _h === void 0 ? void 0 : _h.issuer_state)) {
        credential_offer.grants = {
            authorization_code: {
                issuer_state: (_j = opts === null || opts === void 0 ? void 0 : opts.issuerState) !== null && _j !== void 0 ? _j : (0, oid4vc_common_1.uuidv4)(),
            },
        };
    }
    return { credential_offer, credential_offer_uri, scheme, baseUri, grants: credential_offer.grants };
}
exports.createCredentialOfferObjectv1_0_11 = createCredentialOfferObjectv1_0_11;
function createCredentialOfferURIFromObject(credentialOffer, opts) {
    var _a, _b, _c, _d, _e, _f;
    const scheme = (_d = (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.scheme) === null || _a === void 0 ? void 0 : _a.replace('://', '')) !== null && _b !== void 0 ? _b : (_c = credentialOffer === null || credentialOffer === void 0 ? void 0 : credentialOffer.scheme) === null || _c === void 0 ? void 0 : _c.replace('://', '')) !== null && _d !== void 0 ? _d : 'openid-credential-offer';
    let baseUri = (_f = (_e = opts === null || opts === void 0 ? void 0 : opts.baseUri) !== null && _e !== void 0 ? _e : credentialOffer === null || credentialOffer === void 0 ? void 0 : credentialOffer.baseUri) !== null && _f !== void 0 ? _f : '';
    if (baseUri.includes('://')) {
        baseUri = baseUri.split('://')[1];
    }
    if (scheme.startsWith('http') && baseUri === '') {
        throw Error(`Cannot use scheme '${scheme}' without providing a baseUri value`);
    }
    if (credentialOffer.credential_offer_uri) {
        if (credentialOffer.credential_offer_uri.includes('credential_offer_uri=')) {
            // discard the scheme. Apparently a URI is set and it already contains the actual uri, so assume that takes priority
            return credentialOffer.credential_offer_uri;
        }
        return `${scheme}://${baseUri}?credential_offer_uri=${credentialOffer.credential_offer_uri}`;
    }
    return `${scheme}://${baseUri}?credential_offer=${encodeURIComponent(JSON.stringify(credentialOffer.credential_offer))}`;
}
exports.createCredentialOfferURIFromObject = createCredentialOfferURIFromObject;
function createCredentialOfferURI(issuerMetadata, 
// todo: probably it's wise to create another builder for CredentialOfferPayload that will generate different kinds of CredentialOfferPayload
opts) {
    const credentialOffer = createCredentialOfferObject(issuerMetadata, opts);
    return createCredentialOfferURIFromObject(credentialOffer, opts);
}
exports.createCredentialOfferURI = createCredentialOfferURI;
function createCredentialOfferURIv1_0_11(issuerMetadata, 
// todo: probably it's wise to create another builder for CredentialOfferPayload that will generate different kinds of CredentialOfferPayload
opts) {
    const credentialOffer = createCredentialOfferObjectv1_0_11(issuerMetadata, opts);
    return createCredentialOfferURIFromObject(credentialOffer, opts);
}
exports.createCredentialOfferURIv1_0_11 = createCredentialOfferURIv1_0_11;
const isPreAuthorizedCodeExpired = (state, expirationDurationInSeconds) => {
    const now = +new Date();
    const expirationTime = state.createdAt + expirationDurationInSeconds * 1000;
    return now >= expirationTime;
};
exports.isPreAuthorizedCodeExpired = isPreAuthorizedCodeExpired;
const assertValidPinNumber = (pin, pinLength) => {
    if (pin && !RegExp(`[\\d\\D]{${pinLength !== null && pinLength !== void 0 ? pinLength : 6}}`).test(pin)) {
        throw Error(`${oid4vci_common_1.PIN_NOT_MATCH_ERROR}`);
    }
};
exports.assertValidPinNumber = assertValidPinNumber;
//# sourceMappingURL=CredentialOfferUtils.js.map