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
exports.extractJwksFromJwksMetadata = exports.fetchJwks = void 0;
const HttpUtils_1 = require("./HttpUtils");
/**
 * Fetches a JSON Web Key Set (JWKS) from the specified URI.
 *
 * @param jwksUri - The URI of the JWKS endpoint.
 * @returns A Promise that resolves to the JWKS object.
 * @throws Will throw an error if the fetch fails or if the response is not valid JSON.
 */
function fetchJwks(jwksUri) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const res = yield (0, HttpUtils_1.getJson)(jwksUri);
        return (_a = res.successBody) !== null && _a !== void 0 ? _a : undefined;
    });
}
exports.fetchJwks = fetchJwks;
/**
 * Extracts JSON Web Key Set (JWKS) from the provided metadata.
 * If a jwks field is provided, the JWKS will be extracted from the field.
 * If a jwks_uri is provided, the JWKS will be fetched from the URI.
 *
 * @param input - The metadata input to be validated and parsed.
 * @returns A promise that resolves to the extracted JWKS or undefined.
 * @throws {JoseJwksExtractionError} If the metadata format is invalid or no decryption key is found.
 */
const extractJwksFromJwksMetadata = (metadata) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let jwks = ((_a = metadata.jwks) === null || _a === void 0 ? void 0 : _a.keys[0]) ? metadata.jwks : undefined;
    if (!jwks && metadata.jwks_uri) {
        jwks = yield fetchJwks(metadata.jwks_uri);
    }
    return jwks;
});
exports.extractJwksFromJwksMetadata = extractJwksFromJwksMetadata;
//# sourceMappingURL=extract-jwks.js.map