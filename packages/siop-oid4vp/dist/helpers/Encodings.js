"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64urlEncodeBuffer = exports.fromBase64 = exports.base64ToHexString = exports.encodeJsonAsURI = exports.decodeUriAsJson = void 0;
const qs_1 = require("qs");
const ua8 = __importStar(require("uint8arrays"));
const types_1 = require("../types");
function decodeUriAsJson(uri) {
    var _a, _b;
    if (!uri) {
        throw new Error(types_1.SIOPErrors.BAD_PARAMS);
    }
    const queryString = uri.replace(/^([a-zA-Z][a-zA-Z0-9-_]*:\/\/.*[?])/, '');
    if (!queryString) {
        throw new Error(types_1.SIOPErrors.BAD_PARAMS);
    }
    const parts = (0, qs_1.parse)(queryString, { plainObjects: true, depth: 10, parameterLimit: 5000, ignoreQueryPrefix: true });
    const vpToken = (_a = parts === null || parts === void 0 ? void 0 : parts.claims) === null || _a === void 0 ? void 0 : _a['vp_token'];
    const descriptors = (_b = vpToken === null || vpToken === void 0 ? void 0 : vpToken.presentation_definition) === null || _b === void 0 ? void 0 : _b['input_descriptors']; // FIXME?
    if (descriptors && Array.isArray(descriptors)) {
        // Whenever we have a [{'uri': 'str1'}, 'uri': 'str2'] qs changes this to {uri: ['str1','str2']} which means schema validation fails. So we have to fix that
        vpToken.presentation_definition['input_descriptors'] = descriptors.map((descriptor) => {
            if (Array.isArray(descriptor.schema)) {
                descriptor.schema = descriptor.schema.flatMap((val) => {
                    if (typeof val === 'string') {
                        return { uri: val };
                    }
                    else if (typeof val === 'object' && Array.isArray(val.uri)) {
                        return val.uri.map((uri) => ({ uri: uri }));
                    }
                    return val;
                });
            }
            return descriptor;
        });
    }
    const json = {};
    for (const key in parts) {
        const value = parts[key];
        if (!value) {
            continue;
        }
        const isBool = typeof value == 'boolean';
        const isNumber = typeof value == 'number';
        const isString = typeof value == 'string';
        if (isBool || isNumber) {
            json[decodeURIComponent(key)] = value;
        }
        else if (isString) {
            const decoded = decodeURIComponent(value);
            if (decoded.startsWith('{') && decoded.endsWith('}')) {
                json[decodeURIComponent(key)] = JSON.parse(decoded);
            }
            else {
                json[decodeURIComponent(key)] = decoded;
            }
        }
    }
    return JSON.parse(JSON.stringify(json));
}
exports.decodeUriAsJson = decodeUriAsJson;
function encodeJsonAsURI(json, _opts) {
    var _a;
    if (typeof json === 'string') {
        return encodeJsonAsURI(JSON.parse(json));
    }
    const results = [];
    function encodeAndStripWhitespace(key) {
        return encodeURIComponent(key.replace(' ', ''));
    }
    for (const [key, value] of Object.entries(json)) {
        if (!value) {
            continue;
        }
        const isBool = typeof value == 'boolean';
        const isNumber = typeof value == 'number';
        const isString = typeof value == 'string';
        const isArray = Array.isArray(value);
        let encoded;
        if (isBool || isNumber) {
            encoded = `${encodeAndStripWhitespace(key)}=${value}`;
        }
        else if (isString) {
            encoded = `${encodeAndStripWhitespace(key)}=${encodeURIComponent(value)}`;
        }
        else if (isArray && ((_a = _opts === null || _opts === void 0 ? void 0 : _opts.arraysWithIndex) === null || _a === void 0 ? void 0 : _a.includes(key))) {
            encoded = `${encodeAndStripWhitespace(key)}=${(0, qs_1.stringify)(value, { arrayFormat: 'brackets' })}`;
        }
        else {
            encoded = `${encodeAndStripWhitespace(key)}=${encodeURIComponent(JSON.stringify(value))}`;
        }
        results.push(encoded);
    }
    return results.join('&');
}
exports.encodeJsonAsURI = encodeJsonAsURI;
function base64ToHexString(input, encoding) {
    return ua8.toString(ua8.fromString(input, encoding !== null && encoding !== void 0 ? encoding : 'base64url'), 'base16');
}
exports.base64ToHexString = base64ToHexString;
function fromBase64(base64) {
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
exports.fromBase64 = fromBase64;
function base64urlEncodeBuffer(buf) {
    return fromBase64(buf.toString('base64'));
}
exports.base64urlEncodeBuffer = base64urlEncodeBuffer;
//# sourceMappingURL=Encodings.js.map