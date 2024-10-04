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
exports.resolveDidDocument = exports.mergeAllDidMethods = exports.getResolverUnion = exports.getResolver = void 0;
const did_auth_siop_1 = require("@sphereon/did-auth-siop");
const did_uni_client_1 = require("@sphereon/did-uni-client");
const did_resolver_1 = require("did-resolver");
const index_1 = require("./index");
function getResolver(opts) {
    if (opts && typeof opts.resolver === 'object') {
        return opts.resolver;
    }
    if (!opts || !opts.subjectSyntaxTypesSupported) {
        if (opts === null || opts === void 0 ? void 0 : opts.noUniversalResolverFallback) {
            throw Error(`No subject syntax types nor did methods configured for DID resolution, but fallback to universal resolver has been disabled`);
        }
        console.log(`Falling back to universal resolver as no resolve opts have been provided, or no subject syntax types supported are provided. It is wise to fix this`);
        return new did_uni_client_1.UniResolver();
    }
    const uniResolvers = [];
    if (opts.subjectSyntaxTypesSupported.indexOf(did_auth_siop_1.SubjectIdentifierType.DID) === -1) {
        const specificDidMethods = opts.subjectSyntaxTypesSupported.filter((sst) => sst.includes('did:'));
        if (!specificDidMethods.length) {
            throw new Error('No did method found.');
        }
        for (const didMethod of specificDidMethods) {
            const uniResolver = (0, did_uni_client_1.getUniResolver)((0, index_1.getMethodFromDid)(didMethod), { resolveUrl: opts.resolveUrl });
            uniResolvers.push(uniResolver);
        }
        return new did_resolver_1.Resolver(...uniResolvers);
    }
    else {
        if (opts === null || opts === void 0 ? void 0 : opts.noUniversalResolverFallback) {
            throw Error(`No subject syntax types nor did methods configured for DID resolution, but fallback to universal resolver has been disabled`);
        }
        console.log(`Falling back to universal resolver as no resolve opts have been provided, or no subject syntax types supported are provided. It is wise to fix this`);
        return new did_uni_client_1.UniResolver();
    }
}
exports.getResolver = getResolver;
/**
 * This method returns a resolver object in OP/RP
 * If the user of this library, configures OP/RP to have a customResolver, we will use that
 * If the user of this library configures OP/RP to use a custom resolver for any specific did method, we will use that
 * and in the end for the rest of the did methods, configured either with calling `addDidMethod` upon building OP/RP
 * (without any resolver configuration) or declaring in the subject_syntax_types_supported of the registration object
 * we will use universal resolver from Sphereon's DID Universal Resolver library
 * @param customResolver
 * @param subjectSyntaxTypesSupported
 * @param resolverMap
 */
function getResolverUnion(customResolver, subjectSyntaxTypesSupported, resolverMap) {
    if (customResolver) {
        return customResolver;
    }
    const fallbackResolver = customResolver ? customResolver : new did_uni_client_1.UniResolver();
    const uniResolvers = [];
    const subjectTypes = [];
    if (subjectSyntaxTypesSupported) {
        typeof subjectSyntaxTypesSupported === 'string'
            ? subjectTypes.push(subjectSyntaxTypesSupported)
            : subjectTypes.push(...subjectSyntaxTypesSupported);
    }
    if (subjectTypes.indexOf(did_auth_siop_1.SubjectSyntaxTypesSupportedValues.DID.valueOf()) !== -1) {
        return customResolver ? customResolver : new did_uni_client_1.UniResolver();
    }
    const specificDidMethods = subjectTypes.filter((sst) => !!sst && sst.startsWith('did:'));
    specificDidMethods.forEach((dm) => {
        let methodResolver;
        if (!resolverMap.has(dm) || resolverMap.get(dm) === null) {
            methodResolver = (0, did_uni_client_1.getUniResolver)((0, index_1.getMethodFromDid)(dm));
        }
        else {
            methodResolver = resolverMap.get(dm);
        }
        uniResolvers.push(methodResolver);
    });
    return subjectTypes.indexOf(did_auth_siop_1.SubjectSyntaxTypesSupportedValues.DID.valueOf()) !== -1
        ? new did_resolver_1.Resolver(...Object.assign({ fallbackResolver }, uniResolvers))
        : new did_resolver_1.Resolver(...uniResolvers);
}
exports.getResolverUnion = getResolverUnion;
function mergeAllDidMethods(subjectSyntaxTypesSupported, resolvers) {
    if (!Array.isArray(subjectSyntaxTypesSupported)) {
        subjectSyntaxTypesSupported = [subjectSyntaxTypesSupported];
    }
    const unionSubjectSyntaxTypes = new Set();
    subjectSyntaxTypesSupported.forEach((sst) => unionSubjectSyntaxTypes.add(sst));
    resolvers.forEach((_, didMethod) => unionSubjectSyntaxTypes.add((0, index_1.toSIOPRegistrationDidMethod)(didMethod)));
    return Array.from(unionSubjectSyntaxTypes);
}
exports.mergeAllDidMethods = mergeAllDidMethods;
function resolveDidDocument(did, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // todo: The accept is only there because did:key used by Veramo requires it. According to the spec it is optional. It should not hurt, but let's test
        const result = yield getResolver(Object.assign({}, opts)).resolve(did, { accept: 'application/did+ld+json' });
        if ((_a = result === null || result === void 0 ? void 0 : result.didResolutionMetadata) === null || _a === void 0 ? void 0 : _a.error) {
            throw Error(result.didResolutionMetadata.error);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!result.didDocument && result.id) {
            // todo: This looks like a bug. It seems that sometimes we get back a DID document directly instead of a did resolution results
            return result;
        }
        return result.didDocument;
    });
}
exports.resolveDidDocument = resolveDidDocument;
//# sourceMappingURL=DIDResolution.js.map