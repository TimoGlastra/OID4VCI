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
exports.fetchByReferenceOrUseByValue = exports.getWithUrl = exports.post = exports.formPost = exports.getJson = void 0;
const cross_fetch_1 = require("cross-fetch");
const debug_1 = __importDefault(require("debug"));
const types_1 = require("../types");
const debug = (0, debug_1.default)('sphereon:siopv2:http');
const getJson = (URL, opts) => __awaiter(void 0, void 0, void 0, function* () {
    return yield siopFetch(URL, undefined, Object.assign({ method: 'GET' }, opts));
});
exports.getJson = getJson;
const formPost = (url, body, opts) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, exports.post)(url, body, (opts === null || opts === void 0 ? void 0 : opts.contentType) ? Object.assign({}, opts) : Object.assign({ contentType: types_1.ContentType.FORM_URL_ENCODED }, opts));
});
exports.formPost = formPost;
const post = (url, body, opts) => __awaiter(void 0, void 0, void 0, function* () {
    return yield siopFetch(url, body, Object.assign({ method: 'POST' }, opts));
});
exports.post = post;
const siopFetch = (url, body, opts) => __awaiter(void 0, void 0, void 0, function* () {
    if (!url || url.toLowerCase().startsWith('did:')) {
        throw Error(`Invalid URL supplied. Expected a http(s) URL. Recieved: ${url}`);
    }
    const headers = (opts === null || opts === void 0 ? void 0 : opts.customHeaders) ? opts.customHeaders : {};
    if (opts === null || opts === void 0 ? void 0 : opts.bearerToken) {
        headers['Authorization'] = `Bearer ${opts.bearerToken}`;
    }
    const method = (opts === null || opts === void 0 ? void 0 : opts.method) ? opts.method : body ? 'POST' : 'GET';
    const accept = (opts === null || opts === void 0 ? void 0 : opts.accept) ? opts.accept : 'application/json';
    headers['Content-Type'] = (opts === null || opts === void 0 ? void 0 : opts.contentType) ? opts.contentType : method !== 'GET' ? 'application/json' : undefined;
    headers['Accept'] = accept;
    const payload = {
        method,
        headers,
        body,
    };
    debug(`START fetching url: ${url}`);
    if (body) {
        debug(`Body:\r\n${JSON.stringify(body)}`);
    }
    debug(`Headers:\r\n${JSON.stringify(payload.headers)}`);
    const origResponse = yield (0, cross_fetch_1.fetch)(url, payload);
    const clonedResponse = origResponse.clone();
    const success = origResponse && origResponse.status >= 200 && origResponse.status < 400;
    const textResponseBody = yield clonedResponse.text();
    const isJSONResponse = (accept === 'application/json' || origResponse.headers.get('Content-Type') === 'application/json') && textResponseBody.trim().startsWith('{');
    const responseBody = isJSONResponse ? JSON.parse(textResponseBody) : textResponseBody;
    if (success || (opts === null || opts === void 0 ? void 0 : opts.exceptionOnHttpErrorStatus)) {
        debug(`${success ? 'success' : 'error'} status: ${clonedResponse.status}, body:\r\n${JSON.stringify(responseBody)}`);
    }
    else {
        console.warn(`${success ? 'success' : 'error'} status: ${clonedResponse.status}, body:\r\n${JSON.stringify(responseBody)}`);
    }
    if (!success && (opts === null || opts === void 0 ? void 0 : opts.exceptionOnHttpErrorStatus)) {
        const error = JSON.stringify(responseBody);
        throw new Error(error === '{}' ? '{"error": "not found"}' : error);
    }
    debug(`END fetching url: ${url}`);
    return {
        origResponse,
        successBody: success ? responseBody : undefined,
        errorBody: !success ? responseBody : undefined,
    };
});
const getWithUrl = (url, textResponse) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    const response = yield (0, cross_fetch_1.fetch)(url);
    if (response.status >= 400) {
        return Promise.reject(Error(`${types_1.SIOPErrors.RESPONSE_STATUS_UNEXPECTED} ${response.status}:${response.statusText} URL: ${url}`));
    }
    if (textResponse === true) {
        return (yield response.text());
    }
    return yield response.json();
    /*} catch (e) {
      return Promise.reject(Error(`${(e as Error).message}`));
    }*/
});
exports.getWithUrl = getWithUrl;
const fetchByReferenceOrUseByValue = (referenceURI, valueObject, textResponse) => __awaiter(void 0, void 0, void 0, function* () {
    let response = valueObject;
    if (referenceURI) {
        try {
            response = yield (0, exports.getWithUrl)(referenceURI, textResponse);
        }
        catch (e) {
            console.log(e);
            throw new Error(`${types_1.SIOPErrors.REG_PASS_BY_REFERENCE_INCORRECTLY}: ${e.message}, URL: ${referenceURI}`);
        }
    }
    return response;
});
exports.fetchByReferenceOrUseByValue = fetchByReferenceOrUseByValue;
//# sourceMappingURL=HttpUtils.js.map