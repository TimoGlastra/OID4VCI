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
exports.ProofOfPossessionBuilder = void 0;
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
class ProofOfPossessionBuilder {
    constructor({ proof, callbacks, jwt, accessTokenResponse, version, mode = 'pop', }) {
        this.mode = 'pop';
        this.mode = mode;
        this.proof = proof;
        this.callbacks = callbacks;
        this.version = version;
        if (jwt) {
            this.withJwt(jwt);
        }
        else {
            this.withTyp(version < oid4vci_common_1.OpenId4VCIVersion.VER_1_0_11 || mode === 'JWT' ? 'JWT' : 'openid4vci-proof+jwt');
        }
        if (accessTokenResponse) {
            this.withAccessTokenResponse(accessTokenResponse);
        }
    }
    static manual({ jwt, callbacks, version, mode = 'JWT', }) {
        return new ProofOfPossessionBuilder({ callbacks, jwt, version, mode });
    }
    static fromJwt({ jwt, callbacks, version, mode = 'pop', }) {
        return new ProofOfPossessionBuilder({ callbacks, jwt, version, mode });
    }
    static fromAccessTokenResponse({ accessTokenResponse, callbacks, version, mode = 'pop', }) {
        return new ProofOfPossessionBuilder({ callbacks, accessTokenResponse, version, mode });
    }
    static fromProof(proof, version) {
        return new ProofOfPossessionBuilder({ proof, version });
    }
    withAud(aud) {
        this.aud = aud;
        return this;
    }
    withClientId(clientId) {
        this.clientId = clientId;
        return this;
    }
    withKid(kid) {
        this.kid = kid;
        return this;
    }
    withJWK(jwk) {
        this.jwk = jwk;
        return this;
    }
    withIssuer(issuer) {
        this.issuer = issuer;
        return this;
    }
    withAlg(alg) {
        this.alg = alg;
        return this;
    }
    withJti(jti) {
        this.jti = jti;
        return this;
    }
    withTyp(typ) {
        if (this.mode === 'pop' && this.version >= oid4vci_common_1.OpenId4VCIVersion.VER_1_0_11) {
            if (!!typ && typ !== 'openid4vci-proof+jwt') {
                throw Error(`typ must be openid4vci-proof+jwt for version 1.0.11 and up. Provided: ${typ}`);
            }
        }
        else {
            if (!!typ && typ !== 'JWT') {
                throw Error(`typ must be jwt for version 1.0.10 and below. Provided: ${typ}`);
            }
        }
        this.typ = typ;
        return this;
    }
    withAccessTokenNonce(cNonce) {
        this.cNonce = cNonce;
        return this;
    }
    withAccessTokenResponse(accessToken) {
        if (accessToken.c_nonce) {
            this.withAccessTokenNonce(accessToken.c_nonce);
        }
        return this;
    }
    withEndpointMetadata(endpointMetadata) {
        this.withIssuer(endpointMetadata.issuer);
        return this;
    }
    withJwt(jwt) {
        if (!jwt) {
            throw new Error(oid4vci_common_1.NO_JWT_PROVIDED);
        }
        this.jwt = jwt;
        if (!jwt.header) {
            throw Error(`No JWT header present`);
        }
        else if (!jwt.payload) {
            throw Error(`No JWT payload present`);
        }
        if (jwt.header.kid) {
            this.withKid(jwt.header.kid);
        }
        if (jwt.header.typ) {
            this.withTyp(jwt.header.typ);
        }
        if (!this.typ && this.version >= oid4vci_common_1.OpenId4VCIVersion.VER_1_0_11) {
            this.withTyp('openid4vci-proof+jwt');
        }
        this.withAlg(jwt.header.alg);
        if (Array.isArray(jwt.payload.aud)) {
            // Rather do this than take the first value, as it might be very hard to figure out why something is failing
            throw Error('We cannot handle multiple aud values currently');
        }
        if (jwt.payload) {
            if (jwt.payload.iss)
                this.mode === 'pop' ? this.withClientId(jwt.payload.iss) : this.withIssuer(jwt.payload.iss);
            if (jwt.payload.aud)
                this.mode === 'pop' ? this.withIssuer(jwt.payload.aud) : this.withAud(jwt.payload.aud);
            if (jwt.payload.jti)
                this.withJti(jwt.payload.jti);
            if (jwt.payload.nonce)
                this.withAccessTokenNonce(jwt.payload.nonce);
        }
        return this;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.proof) {
                return Promise.resolve(this.proof);
            }
            else if (this.callbacks) {
                return yield (0, oid4vci_common_1.createProofOfPossession)(this.mode, this.callbacks, Object.assign({ typ: (_a = this.typ) !== null && _a !== void 0 ? _a : (this.version < oid4vci_common_1.OpenId4VCIVersion.VER_1_0_11 || this.mode === 'JWT' ? 'JWT' : 'openid4vci-proof+jwt'), kid: this.kid, jwk: this.jwk, jti: this.jti, alg: this.alg, aud: this.aud, issuer: this.issuer, clientId: this.clientId }, (this.cNonce && { nonce: this.cNonce })), this.jwt);
            }
            throw new Error(oid4vci_common_1.PROOF_CANT_BE_CONSTRUCTED);
        });
    }
}
exports.ProofOfPossessionBuilder = ProofOfPossessionBuilder;
//# sourceMappingURL=ProofOfPossessionBuilder.js.map