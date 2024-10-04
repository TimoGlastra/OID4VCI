"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialSupportedBuilderV1_13 = void 0;
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
class CredentialSupportedBuilderV1_13 {
    withFormat(credentialFormat) {
        this.format = credentialFormat;
        return this;
    }
    withCredentialName(credentialName) {
        this.credentialName = credentialName;
        return this;
    }
    withCredentialDefinition(credentialDefinition) {
        if (!credentialDefinition.type) {
            throw new Error('credentialDefinition should contain a type array');
        }
        this.credentialDefinition = credentialDefinition;
        return this;
    }
    withScope(scope) {
        this.scope = scope;
        return this;
    }
    addCryptographicBindingMethod(method) {
        if (!Array.isArray(method)) {
            this.cryptographicBindingMethodsSupported = this.cryptographicBindingMethodsSupported
                ? [...this.cryptographicBindingMethodsSupported, method]
                : [method];
        }
        else {
            this.cryptographicBindingMethodsSupported = this.cryptographicBindingMethodsSupported
                ? [...this.cryptographicBindingMethodsSupported, ...method]
                : method;
        }
        return this;
    }
    withCryptographicBindingMethod(method) {
        this.cryptographicBindingMethodsSupported = Array.isArray(method) ? method : [method];
        return this;
    }
    addCredentialSigningAlgValuesSupported(algValues) {
        if (!Array.isArray(algValues)) {
            this.credentialSigningAlgValuesSupported = this.credentialSigningAlgValuesSupported
                ? [...this.credentialSigningAlgValuesSupported, algValues]
                : [algValues];
        }
        else {
            this.credentialSigningAlgValuesSupported = this.credentialSigningAlgValuesSupported
                ? [...this.credentialSigningAlgValuesSupported, ...algValues]
                : algValues;
        }
        return this;
    }
    withCredentialSigningAlgValuesSupported(algValues) {
        this.credentialSigningAlgValuesSupported = Array.isArray(algValues) ? algValues : [algValues];
        return this;
    }
    addProofTypesSupported(keyProofType, proofType) {
        if (!this.proofTypesSupported) {
            this.proofTypesSupported = {};
        }
        this.proofTypesSupported[keyProofType] = proofType;
        return this;
    }
    withProofTypesSupported(proofTypesSupported) {
        this.proofTypesSupported = proofTypesSupported;
        return this;
    }
    addCredentialSupportedDisplay(credentialDisplay) {
        if (!Array.isArray(credentialDisplay)) {
            this.display = this.display ? [...this.display, credentialDisplay] : [credentialDisplay];
        }
        else {
            this.display = this.display ? [...this.display, ...credentialDisplay] : credentialDisplay;
        }
        return this;
    }
    withCredentialSupportedDisplay(credentialDisplay) {
        this.display = Array.isArray(credentialDisplay) ? credentialDisplay : [credentialDisplay];
        return this;
    }
    withCredentialSubject(credentialSubject) {
        this.credentialSubject = credentialSubject;
        return this;
    }
    addCredentialSubjectPropertyDisplay(subjectProperty, issuerCredentialSubjectDisplay) {
        if (!this.credentialSubject) {
            this.credentialSubject = {};
        }
        this.credentialSubject[subjectProperty] = issuerCredentialSubjectDisplay;
        return this;
    }
    build() {
        if (!this.format) {
            throw new Error(oid4vci_common_1.TokenErrorResponse.invalid_request);
        }
        const credentialSupported = {
            format: this.format,
        };
        if (!this.credentialDefinition) {
            throw new Error('credentialDefinition is required');
        }
        credentialSupported.credential_definition = this.credentialDefinition;
        if (this.scope) {
            credentialSupported.scope = this.scope;
        }
        if (!this.credentialName) {
            throw new Error('A unique credential name is required');
        }
        //TODO: right now commented out all the special handlings for sd-jwt
        /*
        // SdJwtVc has a different format
        if (isFormat(credentialSupported, 'vc+sd-jwt')) {
          if (this.types.length > 1) {
            throw new Error('Only one type is allowed for vc+sd-jwt')
          }
          credentialSupported.vct = this.types[0]
        }
        // And else would work here, but this way we get the correct typing
        else if (isNotFormat(credentialSupported, 'vc+sd-jwt')) {
          credentialSupported.types = this.types
    
          if (this.credentialSubject) {
            credentialSupported.credentialSubject = this.credentialSubject
          }
        }*/
        if (this.credentialSigningAlgValuesSupported) {
            credentialSupported.credential_signing_alg_values_supported = this.credentialSigningAlgValuesSupported;
        }
        if (this.cryptographicBindingMethodsSupported) {
            credentialSupported.cryptographic_binding_methods_supported = this.cryptographicBindingMethodsSupported;
        }
        if (this.display) {
            credentialSupported.display = this.display;
        }
        const supportedConfiguration = {};
        supportedConfiguration[this.credentialName] = credentialSupported;
        return supportedConfiguration;
    }
}
exports.CredentialSupportedBuilderV1_13 = CredentialSupportedBuilderV1_13;
//# sourceMappingURL=CredentialSupportedBuilderV1_13.js.map