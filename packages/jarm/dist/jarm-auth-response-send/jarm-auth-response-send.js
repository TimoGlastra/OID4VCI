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
exports.jarmAuthResponseSend = void 0;
const utils_js_1 = require("../utils.js");
const v_response_mode_registry_js_1 = require("../v-response-mode-registry.js");
const jarmAuthResponseSend = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { authRequestParams, authResponse } = input;
    const responseEndpoint = 'response_uri' in authRequestParams ? new URL(authRequestParams.response_uri) : new URL(authRequestParams.redirect_uri);
    const responseMode = authRequestParams.response_mode && authRequestParams.response_mode !== 'jwt'
        ? authRequestParams.response_mode
        : (0, v_response_mode_registry_js_1.getJarmDefaultResponseMode)(authRequestParams);
    (0, v_response_mode_registry_js_1.validateResponseMode)({
        response_type: authRequestParams.response_type,
        response_mode: responseMode,
    });
    switch (responseMode) {
        case 'direct_post.jwt':
            return handleDirectPostJwt(responseEndpoint, authResponse);
        case 'query.jwt':
            return handleQueryJwt(responseEndpoint, authResponse);
        case 'fragment.jwt':
            return handleFragmentJwt(responseEndpoint, authResponse);
        case 'form_post.jwt':
            throw new Error('Not implemented. form_post.jwt is not yet supported.');
    }
});
exports.jarmAuthResponseSend = jarmAuthResponseSend;
function handleDirectPostJwt(responseEndpoint, responseJwt) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(responseEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `response=${responseJwt}`,
        });
        return response;
    });
}
function handleQueryJwt(responseEndpoint, responseJwt) {
    return __awaiter(this, void 0, void 0, function* () {
        const responseUrl = (0, utils_js_1.appendQueryParams)({
            url: responseEndpoint,
            params: { response: responseJwt },
        });
        const response = yield fetch(responseUrl, { method: 'POST' });
        return response;
    });
}
function handleFragmentJwt(responseEndpoint, responseJwt) {
    return __awaiter(this, void 0, void 0, function* () {
        const responseUrl = (0, utils_js_1.appendFragmentParams)({
            url: responseEndpoint,
            fragments: { response: responseJwt },
        });
        const response = yield fetch(responseUrl, { method: 'POST' });
        return response;
    });
}
//# sourceMappingURL=jarm-auth-response-send.js.map