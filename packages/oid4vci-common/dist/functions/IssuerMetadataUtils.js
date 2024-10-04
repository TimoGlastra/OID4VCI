"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIssuerName = exports.getIssuerDisplays = exports.credentialSupportedV8ToV13 = exports.credentialsSupportedV8ToV13 = exports.getSupportedCredential = exports.determineVersionsFromIssuerMetadata = exports.getSupportedCredentials = void 0;
const index_1 = require("../index");
const types_1 = require("../types");
function getSupportedCredentials(opts) {
    const { version = types_1.OpenId4VCIVersion.VER_1_0_13, types } = opts !== null && opts !== void 0 ? opts : {};
    if (types && Array.isArray(types)) {
        if (version < types_1.OpenId4VCIVersion.VER_1_0_13) {
            return types.flatMap((typeSet) => getSupportedCredential(Object.assign(Object.assign({}, opts), { version, types: typeSet })));
        }
        else {
            return types
                .map((typeSet) => {
                return getSupportedCredential(Object.assign(Object.assign({}, opts), { version, types: typeSet }));
            })
                .reduce((acc, result) => {
                Object.assign(acc, result);
                return acc;
            }, {});
        }
    }
    return getSupportedCredential(opts ? Object.assign(Object.assign({}, opts), { types: undefined }) : undefined);
}
exports.getSupportedCredentials = getSupportedCredentials;
function determineVersionsFromIssuerMetadata(issuerMetadata) {
    const versions = new Set();
    if ('authorization_server' in issuerMetadata) {
        versions.add(types_1.OpenId4VCIVersion.VER_1_0_11);
    }
    else if ('authorization_servers' in issuerMetadata) {
        versions.add(types_1.OpenId4VCIVersion.VER_1_0_13);
    }
    if (versions.size === 0) {
        // The above checks where already very specific and only applicable to single versions we support, so let's skip if we encounter them
        if ('credential_configurations_supported' in issuerMetadata) {
            versions.add(types_1.OpenId4VCIVersion.VER_1_0_13);
        }
        else if ('credentials_supported' in issuerMetadata) {
            if (typeof issuerMetadata.credentials_supported === 'object') {
                versions.add(types_1.OpenId4VCIVersion.VER_1_0_08);
            }
            else {
                versions.add(types_1.OpenId4VCIVersion.VER_1_0_09).add(types_1.OpenId4VCIVersion.VER_1_0_11);
            }
        }
    }
    if (versions.size === 0) {
        versions.add(types_1.OpenId4VCIVersion.VER_UNKNOWN);
    }
    return Array.from(versions).sort().reverse(); // highest version first
}
exports.determineVersionsFromIssuerMetadata = determineVersionsFromIssuerMetadata;
function getSupportedCredential(opts) {
    var _a, _b;
    const { issuerMetadata, types, format, version = types_1.OpenId4VCIVersion.VER_1_0_13 } = opts !== null && opts !== void 0 ? opts : {};
    let credentialConfigurationsV11 = undefined;
    let credentialConfigurationsV13 = undefined;
    if (version < types_1.OpenId4VCIVersion.VER_1_0_12 ||
        ((issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credential_configurations_supported) === undefined && (issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credentials_supported))) {
        if ((issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credentials_supported) && !Array.isArray(issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credentials_supported)) {
            // The current code duplication and logic is such a mess, that we re-adjust the object to the proper type again
            credentialConfigurationsV11 = [];
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Object.entries(issuerMetadata.credentials_supported).forEach(([id, supported]) => {
                if (!supported.id) {
                    supported.id = id;
                }
                credentialConfigurationsV11 === null || credentialConfigurationsV11 === void 0 ? void 0 : credentialConfigurationsV11.push(supported);
            });
        }
        else {
            credentialConfigurationsV11 = (_a = issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credentials_supported) !== null && _a !== void 0 ? _a : [];
        }
    }
    else {
        credentialConfigurationsV13 =
            (_b = issuerMetadata === null || issuerMetadata === void 0 ? void 0 : issuerMetadata.credential_configurations_supported) !== null && _b !== void 0 ? _b : {};
    }
    if (!issuerMetadata || (!issuerMetadata.credential_configurations_supported && !issuerMetadata.credentials_supported)) {
        index_1.VCI_LOG_COMMON.warning(`No credential issuer metadata or supported credentials found for issuer}`);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return version < types_1.OpenId4VCIVersion.VER_1_0_13 ? credentialConfigurationsV11 : credentialConfigurationsV13;
    }
    const normalizedTypes = Array.isArray(types) ? types : types ? [types] : [];
    const normalizedFormats = Array.isArray(format) ? format : format ? [format] : [];
    function filterMatchingConfig(config) {
        let isTypeMatch = normalizedTypes.length === 0;
        const types = (0, index_1.getTypesFromObject)(config);
        if (!isTypeMatch) {
            if (normalizedTypes.length === 1 && config.id === normalizedTypes[0]) {
                isTypeMatch = true;
            }
            else if (types) {
                isTypeMatch = normalizedTypes.every((type) => types.includes(type));
            }
            else {
                if ((0, index_1.isW3cCredentialSupported)(config) && 'credential_definition' in config) {
                    isTypeMatch = normalizedTypes.every((type) => config.credential_definition.type.includes(type));
                }
                else if ((0, index_1.isW3cCredentialSupported)(config) && 'type' in config && Array.isArray(config.type)) {
                    isTypeMatch = normalizedTypes.every((type) => config.type.includes(type));
                }
                else if ((0, index_1.isW3cCredentialSupported)(config) && 'types' in config) {
                    isTypeMatch = normalizedTypes.every((type) => { var _a; return (_a = config.types) === null || _a === void 0 ? void 0 : _a.includes(type); });
                }
            }
        }
        const isFormatMatch = normalizedFormats.length === 0 || normalizedFormats.includes(config.format);
        return isTypeMatch && isFormatMatch ? config : undefined;
    }
    if (credentialConfigurationsV13) {
        return Object.entries(credentialConfigurationsV13).reduce((filteredConfigs, [id, config]) => {
            if (filterMatchingConfig(config)) {
                filteredConfigs[id] = config;
                // Added to enable support < 13. We basically assign the
                if (!config.id) {
                    config.id = id;
                }
            }
            return filteredConfigs;
        }, {});
    }
    else if (credentialConfigurationsV11) {
        return credentialConfigurationsV11.filter((config) => filterMatchingConfig(config));
    }
    throw Error(`Either < v11 configurations or V13 configurations should have been filtered at this point`);
}
exports.getSupportedCredential = getSupportedCredential;
function credentialsSupportedV8ToV13(supportedV8) {
    const credentialConfigsSupported = {};
    Object.entries(supportedV8).flatMap((entry) => {
        const type = entry[0];
        const supportedV8 = entry[1];
        Object.assign(credentialConfigsSupported, credentialSupportedV8ToV13(type, supportedV8));
    });
    return credentialConfigsSupported;
}
exports.credentialsSupportedV8ToV13 = credentialsSupportedV8ToV13;
function credentialSupportedV8ToV13(key, supportedV8) {
    const credentialConfigsSupported = {};
    Object.entries(supportedV8.formats).map((entry) => {
        const format = entry[0];
        const credentialSupportBrief = entry[1];
        if (typeof format !== 'string') {
            throw Error(`Unknown format received ${JSON.stringify(format)}`);
        }
        const credentialConfigSupported = Object.assign(Object.assign({ format: format, display: supportedV8.display }, credentialSupportBrief), { credentialSubject: supportedV8.claims });
        credentialConfigsSupported[key] = credentialConfigSupported;
    });
    return credentialConfigsSupported;
}
exports.credentialSupportedV8ToV13 = credentialSupportedV8ToV13;
function getIssuerDisplays(metadata, opts) {
    var _a, _b;
    const matchedDisplays = (_b = (_a = metadata.display) === null || _a === void 0 ? void 0 : _a.filter((item) => !(opts === null || opts === void 0 ? void 0 : opts.prefLocales) || opts.prefLocales.length === 0 || (item.locale && opts.prefLocales.includes(item.locale)) || !item.locale)) !== null && _b !== void 0 ? _b : [];
    return matchedDisplays.sort((item) => { var _a; return (item.locale ? ((_a = opts === null || opts === void 0 ? void 0 : opts.prefLocales.indexOf(item.locale)) !== null && _a !== void 0 ? _a : 1) : Number.MAX_VALUE); });
}
exports.getIssuerDisplays = getIssuerDisplays;
/**
 * TODO check again when WAL-617 is done to replace how we get the issuer name.
 */
function getIssuerName(url, credentialIssuerMetadata) {
    if (credentialIssuerMetadata) {
        const displays = credentialIssuerMetadata ? getIssuerDisplays(credentialIssuerMetadata) : [];
        for (const display of displays) {
            if (display.name) {
                return display.name;
            }
        }
    }
    return url;
}
exports.getIssuerName = getIssuerName;
//# sourceMappingURL=IssuerMetadataUtils.js.map