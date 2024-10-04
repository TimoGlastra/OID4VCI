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
exports.createDidJwtAdapter = exports.verfiyDidJwtAdapter = void 0;
const did_1 = require("./did");
const types_1 = require("./types");
const verfiyDidJwtAdapter = (jwtVerifier, jwt, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if (jwtVerifier.method === 'did') {
        const audience = (_d = (_c = (_b = (_a = options === null || options === void 0 ? void 0 : options.verification) === null || _a === void 0 ? void 0 : _a.resolveOpts) === null || _b === void 0 ? void 0 : _b.jwtVerifyOpts) === null || _c === void 0 ? void 0 : _c.audience) !== null && _d !== void 0 ? _d : (0, did_1.getAudience)(jwt.raw);
        yield (0, did_1.verifyDidJWT)(jwt.raw, options.resolver, Object.assign(Object.assign({}, (_f = (_e = options.verification) === null || _e === void 0 ? void 0 : _e.resolveOpts) === null || _f === void 0 ? void 0 : _f.jwtVerifyOpts), { audience }));
        if (jwtVerifier.type === 'request-object' && ((_g = jwt.payload.client_id) === null || _g === void 0 ? void 0 : _g.startsWith('did:'))) {
            const authorizationRequestPayload = jwt.payload;
            if (((_h = options.verification) === null || _h === void 0 ? void 0 : _h.checkLinkedDomain) && options.verification.checkLinkedDomain != types_1.CheckLinkedDomain.NEVER) {
                if (!authorizationRequestPayload.client_id) {
                    return Promise.reject(Error('missing client_id from AuthorizationRequestPayload'));
                }
                yield (0, did_1.validateLinkedDomainWithDid)(authorizationRequestPayload.client_id, options.verification);
            }
            else if (!((_j = options.verification) === null || _j === void 0 ? void 0 : _j.checkLinkedDomain) && options.verification.wellknownDIDVerifyCallback) {
                if (!authorizationRequestPayload.client_id) {
                    return Promise.reject(Error('missing client_id from AuthorizationRequestPayload'));
                }
                yield (0, did_1.validateLinkedDomainWithDid)(authorizationRequestPayload.client_id, options.verification);
            }
        }
        if (jwtVerifier.type === 'id-token') {
            const issuerDid = (0, did_1.getSubDidFromPayload)(jwt.payload);
            if (((_k = options.verification) === null || _k === void 0 ? void 0 : _k.checkLinkedDomain) && options.verification.checkLinkedDomain != types_1.CheckLinkedDomain.NEVER) {
                yield (0, did_1.validateLinkedDomainWithDid)(issuerDid, options.verification);
            }
            else if (!((_l = options.verification) === null || _l === void 0 ? void 0 : _l.checkLinkedDomain) && options.verification.wellknownDIDVerifyCallback) {
                yield (0, did_1.validateLinkedDomainWithDid)(issuerDid, options.verification);
            }
        }
        return true;
    }
    throw new Error('Invalid use of the did-auth-siop create jwt adapter');
});
exports.verfiyDidJwtAdapter = verfiyDidJwtAdapter;
const createDidJwtAdapter = (signature, jwtIssuer, jwt) => __awaiter(void 0, void 0, void 0, function* () {
    if (jwtIssuer.method === 'did') {
        const issuer = jwtIssuer.didUrl.split('#')[0];
        jwt.payload.issuer = issuer;
        if (jwtIssuer.type === 'request-object') {
            return yield (0, did_1.signRequestObjectPayload)(jwt.payload, signature);
        }
        else if (jwtIssuer.type === 'id-token') {
            return yield (0, did_1.signIDTokenPayload)(jwt.payload, signature);
        }
    }
    throw new Error('Invalid use of the did-auth-siop create jwt adapter');
});
exports.createDidJwtAdapter = createDidJwtAdapter;
//# sourceMappingURL=DidJwtAdapter.js.map