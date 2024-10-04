"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExp = exports.decodeJwt = exports.decodeProtectedHeader = exports.isJwe = exports.isJws = exports.BASE64_URL_REGEX = exports.epochTime = exports.getNowSkewed = exports.parseJWT = void 0;
const jwt_decode_1 = require("jwt-decode");
function parseJWT(jwt) {
    const header = (0, jwt_decode_1.jwtDecode)(jwt, { header: true });
    const payload = (0, jwt_decode_1.jwtDecode)(jwt, { header: false });
    if (!payload || !header) {
        throw new Error('Jwt Payload and/or Header could not be parsed');
    }
    return { header, payload };
}
exports.parseJWT = parseJWT;
/**
 * The maximum allowed clock skew time in seconds. If an time based validation
 * is performed against current time (`now`), the validation can be of by the skew
 * time.
 *
 * See https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.5
 */
const DEFAULT_SKEW_TIME = 60;
function getNowSkewed(now, skewTime) {
    const _now = now ? now : epochTime();
    const _skewTime = skewTime ? skewTime : DEFAULT_SKEW_TIME;
    return {
        nowSkewedPast: _now - _skewTime,
        nowSkewedFuture: _now + _skewTime,
    };
}
exports.getNowSkewed = getNowSkewed;
/**
 * Returns the current unix timestamp in seconds.
 */
function epochTime() {
    return Math.floor(Date.now() / 1000);
}
exports.epochTime = epochTime;
exports.BASE64_URL_REGEX = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
const isJws = (jws) => {
    const jwsParts = jws.split('.');
    return jwsParts.length === 3 && jwsParts.every((part) => exports.BASE64_URL_REGEX.test(part));
};
exports.isJws = isJws;
const isJwe = (jwe) => {
    const jweParts = jwe.split('.');
    return jweParts.length === 5 && jweParts.every((part) => exports.BASE64_URL_REGEX.test(part));
};
exports.isJwe = isJwe;
const decodeProtectedHeader = (jwt) => {
    return (0, jwt_decode_1.jwtDecode)(jwt, { header: true });
};
exports.decodeProtectedHeader = decodeProtectedHeader;
const decodeJwt = (jwt) => {
    return (0, jwt_decode_1.jwtDecode)(jwt, { header: false });
};
exports.decodeJwt = decodeJwt;
const checkExp = (input) => {
    const { exp, now, clockSkew } = input;
    return exp < (now !== null && now !== void 0 ? now : Date.now() / 1000) - (clockSkew !== null && clockSkew !== void 0 ? clockSkew : 120);
};
exports.checkExp = checkExp;
//# sourceMappingURL=jwtUtils.js.map