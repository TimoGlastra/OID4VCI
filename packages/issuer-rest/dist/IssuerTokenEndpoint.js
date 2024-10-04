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
exports.verifyTokenRequest = exports.handleTokenRequest = void 0;
const oid4vc_common_1 = require("@sphereon/oid4vc-common");
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const oid4vci_issuer_1 = require("@sphereon/oid4vci-issuer");
const ssi_express_support_1 = require("@sphereon/ssi-express-support");
/**
 *
 * @param tokenExpiresIn
 * @param accessTokenSignerCallback
 * @param accessTokenIssuer
 * @param cNonceExpiresIn
 * @param issuer
 * @param interval
 */
const handleTokenRequest = ({ tokenExpiresIn, // expiration in seconds
accessTokenEndpoint, accessTokenSignerCallback, accessTokenIssuer, cNonceExpiresIn, // expiration in seconds
issuer, interval, dpop, }) => {
    return (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        response.set({
            'Cache-Control': 'no-store',
            Pragma: 'no-cache',
        });
        if (request.body.grant_type !== oid4vci_common_1.GrantTypes.PRE_AUTHORIZED_CODE) {
            // Yes this is redundant, only here to remind us that we need to implement the auth flow as well
            return (0, ssi_express_support_1.sendErrorResponse)(response, 400, {
                error: oid4vci_common_1.TokenErrorResponse.invalid_request,
                error_description: oid4vci_common_1.PRE_AUTHORIZED_CODE_REQUIRED_ERROR,
            });
        }
        if (request.headers.authorization && request.headers.authorization.startsWith('DPoP ') && !request.headers.DPoP) {
            return (0, ssi_express_support_1.sendErrorResponse)(response, 400, {
                error: oid4vci_common_1.TokenErrorResponse.invalid_request,
                error_description: 'DPoP header is required',
            });
        }
        let dPoPJwk;
        if ((dpop === null || dpop === void 0 ? void 0 : dpop.requireDPoP) && !request.headers.dpop) {
            return (0, ssi_express_support_1.sendErrorResponse)(response, 400, {
                error: oid4vci_common_1.TokenErrorResponse.invalid_request,
                error_description: 'DPoP is required for requesting access tokens.',
            });
        }
        if (request.headers.dpop) {
            if (!dpop) {
                console.error('Received unsupported DPoP header. The issuer is not configured to work with DPoP. Provide DPoP options for it to work.');
                return (0, ssi_express_support_1.sendErrorResponse)(response, 400, {
                    error: oid4vci_common_1.TokenErrorResponse.invalid_request,
                    error_description: 'Received unsupported DPoP header.',
                });
            }
            try {
                const fullUrl = accessTokenEndpoint !== null && accessTokenEndpoint !== void 0 ? accessTokenEndpoint : request.protocol + '://' + request.get('host') + request.originalUrl;
                dPoPJwk = yield (0, oid4vc_common_1.verifyDPoP)({ method: request.method, headers: request.headers, fullUrl }, {
                    jwtVerifyCallback: dpop.dPoPVerifyJwtCallback,
                    expectAccessToken: false,
                    maxIatAgeInSeconds: undefined,
                });
            }
            catch (error) {
                return (0, ssi_express_support_1.sendErrorResponse)(response, 400, {
                    error: oid4vci_common_1.TokenErrorResponse.invalid_dpop_proof,
                    error_description: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
        try {
            const responseBody = yield (0, oid4vci_issuer_1.createAccessTokenResponse)(request.body, {
                credentialOfferSessions: issuer.credentialOfferSessions,
                accessTokenIssuer,
                cNonces: issuer.cNonces,
                cNonce: (0, oid4vc_common_1.uuidv4)(),
                accessTokenSignerCallback,
                cNonceExpiresIn,
                interval,
                tokenExpiresIn,
                dPoPJwk,
            });
            return response.status(200).json(responseBody);
        }
        catch (error) {
            return (0, ssi_express_support_1.sendErrorResponse)(response, 400, {
                error: oid4vci_common_1.TokenErrorResponse.invalid_request,
            }, error);
        }
    });
};
exports.handleTokenRequest = handleTokenRequest;
const verifyTokenRequest = ({ preAuthorizedCodeExpirationDuration, issuer, }) => {
    return (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, oid4vci_issuer_1.assertValidAccessTokenRequest)(request.body, {
                expirationDuration: preAuthorizedCodeExpirationDuration,
                credentialOfferSessions: issuer.credentialOfferSessions,
            });
        }
        catch (error) {
            if (error instanceof oid4vci_common_1.TokenError) {
                return (0, ssi_express_support_1.sendErrorResponse)(response, error.statusCode, {
                    error: error.responseError,
                    error_description: error.getDescription(),
                });
            }
            else {
                return (0, ssi_express_support_1.sendErrorResponse)(response, 400, { error: oid4vci_common_1.TokenErrorResponse.invalid_request, error_description: error.message }, error);
            }
        }
        return next();
    });
};
exports.verifyTokenRequest = verifyTokenRequest;
//# sourceMappingURL=IssuerTokenEndpoint.js.map