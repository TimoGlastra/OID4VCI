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
exports.retrieveWellknown = void 0;
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('sphereon:openid4vci:openid-utils');
/**
 * Allows to retrieve information from a well-known location
 *
 * @param host The host
 * @param endpointType The endpoint type, currently supports OID4VCI, OIDC and OAuth2 endpoint types
 * @param opts Options, like for instance whether an error should be thrown in case the endpoint doesn't exist
 */
const retrieveWellknown = (host, endpointType, opts) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, oid4vci_common_1.getJson)(`${host.endsWith('/') ? host.slice(0, -1) : host}${endpointType}`, {
        exceptionOnHttpErrorStatus: opts === null || opts === void 0 ? void 0 : opts.errorOnNotFound,
    });
    if (result.origResponse.status >= 400) {
        // We only get here when error on not found is false
        debug(`host ${host} with endpoint type ${endpointType} status: ${result.origResponse.status}, ${result.origResponse.statusText}`);
    }
    return result;
});
exports.retrieveWellknown = retrieveWellknown;
//# sourceMappingURL=OpenIDUtils.js.map