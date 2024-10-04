"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPBuilder = void 0;
const events_1 = require("events");
const types_1 = require("../types");
const OP_1 = require("./OP");
class OPBuilder {
    constructor() {
        this.responseMode = types_1.ResponseMode.DIRECT_POST;
        this.responseRegistration = {};
    }
    withHasher(hasher) {
        this.hasher = hasher;
        return this;
    }
    withIssuer(issuer) {
        this.issuer = issuer;
        return this;
    }
    withExpiresIn(expiresIn) {
        this.expiresIn = expiresIn;
        return this;
    }
    withResponseMode(responseMode) {
        this.responseMode = responseMode;
        return this;
    }
    withRegistration(responseRegistration, targets) {
        this.responseRegistration = Object.assign({ targets }, responseRegistration);
        return this;
    }
    /*//TODO registration object creation
    authorizationEndpoint?: Schema.OPENID | string;
    scopesSupported?: Scope[] | Scope;
    subjectTypesSupported?: SubjectType[] | SubjectType;
    idTokenSigningAlgValuesSupported?: SigningAlgo[] | SigningAlgo;
    requestObjectSigningAlgValuesSupported?: SigningAlgo[] | SigningAlgo;
  */
    withCreateJwtCallback(createJwtCallback) {
        this.createJwtCallback = createJwtCallback;
        return this;
    }
    withVerifyJwtCallback(verifyJwtCallback) {
        this.verifyJwtCallback = verifyJwtCallback;
        return this;
    }
    withSupportedVersions(supportedVersions) {
        const versions = Array.isArray(supportedVersions) ? supportedVersions : [supportedVersions];
        for (const version of versions) {
            this.addSupportedVersion(version);
        }
        return this;
    }
    addSupportedVersion(supportedVersion) {
        if (!this.supportedVersions) {
            this.supportedVersions = [];
        }
        if (typeof supportedVersion === 'string') {
            this.supportedVersions.push(types_1.SupportedVersion[supportedVersion]);
        }
        else {
            this.supportedVersions.push(supportedVersion);
        }
        return this;
    }
    withPresentationSignCallback(presentationSignCallback) {
        this.presentationSignCallback = presentationSignCallback;
        return this;
    }
    withEventEmitter(eventEmitter) {
        this.eventEmitter = eventEmitter !== null && eventEmitter !== void 0 ? eventEmitter : new events_1.EventEmitter();
        return this;
    }
    build() {
        /*if (!this.responseRegistration) {
          throw Error('You need to provide response registrations values')
        } else */ /*if (!this.withSignature) {
          throw Error('You need to supply withSignature values');
        } else */ if (!this.supportedVersions || this.supportedVersions.length === 0) {
            this.supportedVersions = [types_1.SupportedVersion.SIOPv2_D11, types_1.SupportedVersion.SIOPv2_ID1, types_1.SupportedVersion.JWT_VC_PRESENTATION_PROFILE_v1];
        }
        // We ignore the private visibility, as we don't want others to use the OP directly
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return new OP_1.OP({ builder: this });
    }
}
exports.OPBuilder = OPBuilder;
//# sourceMappingURL=OPBuilder.js.map