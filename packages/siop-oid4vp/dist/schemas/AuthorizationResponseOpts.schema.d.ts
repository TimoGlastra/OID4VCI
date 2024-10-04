export declare const AuthorizationResponseOptsSchemaObj: {
    $id: string;
    $schema: string;
    $ref: string;
    definitions: {
        AuthorizationResponseOpts: {
            type: string;
            properties: {
                responseURI: {
                    type: string;
                };
                responseURIType: {
                    $ref: string;
                };
                registration: {
                    $ref: string;
                };
                version: {
                    $ref: string;
                };
                audience: {
                    type: string;
                };
                createJwtCallback: {
                    $ref: string;
                };
                jwtIssuer: {
                    $ref: string;
                };
                responseMode: {
                    $ref: string;
                };
                responseType: {
                    type: string;
                    items: {
                        $ref: string;
                    };
                    minItems: number;
                    maxItems: number;
                };
                expiresIn: {
                    type: string;
                };
                accessToken: {
                    type: string;
                };
                tokenType: {
                    type: string;
                };
                refreshToken: {
                    type: string;
                };
                presentationExchange: {
                    $ref: string;
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
        ResponseURIType: {
            type: string;
            enum: string[];
        };
        ResponseRegistrationOpts: {
            anyOf: ({
                type: string;
                properties: {
                    passBy: {
                        $ref: string;
                    };
                    reference_uri: {
                        type: string;
                    };
                    targets: {
                        $ref: string;
                    };
                    id_token_encrypted_response_alg: {
                        $ref: string;
                    };
                    id_token_encrypted_response_enc: {
                        $ref: string;
                    };
                    authorizationEndpoint: {
                        anyOf: ({
                            $ref: string;
                            type?: undefined;
                        } | {
                            type: string;
                            $ref?: undefined;
                        })[];
                    };
                    issuer: {
                        anyOf: ({
                            $ref: string;
                            type?: undefined;
                        } | {
                            type: string;
                            $ref?: undefined;
                        })[];
                    };
                    responseTypesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    scopesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    subjectTypesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    idTokenSigningAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    requestObjectSigningAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    subject_syntax_types_supported: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    tokenEndpoint: {
                        type: string;
                    };
                    userinfoEndpoint: {
                        type: string;
                    };
                    jwksUri: {
                        type: string;
                    };
                    registrationEndpoint: {
                        type: string;
                    };
                    responseModesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    grantTypesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    acrValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    idTokenEncryptionAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    idTokenEncryptionEncValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    userinfoSigningAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    userinfoEncryptionAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    userinfoEncryptionEncValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    requestObjectEncryptionAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    requestObjectEncryptionEncValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    tokenEndpointAuthMethodsSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    tokenEndpointAuthSigningAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    displayValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    claimTypesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    claimsSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    serviceDocumentation: {
                        type: string;
                    };
                    claimsLocalesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    uiLocalesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    claimsParameterSupported: {
                        type: string;
                    };
                    requestParameterSupported: {
                        type: string;
                    };
                    requestUriParameterSupported: {
                        type: string;
                    };
                    requireRequestUriRegistration: {
                        type: string;
                    };
                    opPolicyUri: {
                        type: string;
                    };
                    opTosUri: {
                        type: string;
                    };
                    client_id: {
                        type: string;
                    };
                    redirectUris: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    clientName: {
                        type: string;
                    };
                    tokenEndpointAuthMethod: {
                        type: string;
                    };
                    applicationType: {
                        type: string;
                    };
                    responseTypes: {
                        type: string;
                    };
                    grantTypes: {
                        type: string;
                    };
                    vpFormats: {
                        $ref: string;
                    };
                    logo_uri: {
                        type: string;
                    };
                    clientPurpose: {
                        type: string;
                    };
                    idTokenTypesSupported?: undefined;
                    vpFormatsSupported?: undefined;
                };
                required: string[];
            } | {
                type: string;
                properties: {
                    passBy: {
                        $ref: string;
                    };
                    reference_uri: {
                        type: string;
                    };
                    targets: {
                        $ref: string;
                    };
                    id_token_encrypted_response_alg: {
                        $ref: string;
                    };
                    id_token_encrypted_response_enc: {
                        $ref: string;
                    };
                    authorizationEndpoint: {
                        anyOf: ({
                            $ref: string;
                            type?: undefined;
                        } | {
                            type: string;
                            $ref?: undefined;
                        })[];
                    };
                    issuer: {
                        anyOf: ({
                            $ref: string;
                            type?: undefined;
                        } | {
                            type: string;
                            $ref?: undefined;
                        })[];
                    };
                    responseTypesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    scopesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    subjectTypesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    idTokenSigningAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    requestObjectSigningAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    subject_syntax_types_supported: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    tokenEndpoint: {
                        type: string;
                    };
                    userinfoEndpoint: {
                        type: string;
                    };
                    jwksUri: {
                        type: string;
                    };
                    registrationEndpoint: {
                        type: string;
                    };
                    responseModesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    grantTypesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    acrValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    idTokenEncryptionAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    idTokenEncryptionEncValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    userinfoSigningAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    userinfoEncryptionAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    userinfoEncryptionEncValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    requestObjectEncryptionAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    requestObjectEncryptionEncValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    tokenEndpointAuthMethodsSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    tokenEndpointAuthSigningAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    displayValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    claimTypesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    claimsSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    serviceDocumentation: {
                        type: string;
                    };
                    claimsLocalesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    uiLocalesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    claimsParameterSupported: {
                        type: string;
                    };
                    requestParameterSupported: {
                        type: string;
                    };
                    requestUriParameterSupported: {
                        type: string;
                    };
                    requireRequestUriRegistration: {
                        type: string;
                    };
                    opPolicyUri: {
                        type: string;
                    };
                    opTosUri: {
                        type: string;
                    };
                    client_id: {
                        type: string;
                    };
                    redirectUris: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    clientName: {
                        type: string;
                    };
                    tokenEndpointAuthMethod: {
                        type: string;
                    };
                    applicationType: {
                        type: string;
                    };
                    responseTypes: {
                        type: string;
                    };
                    grantTypes: {
                        type: string;
                    };
                    vpFormats: {
                        $ref: string;
                    };
                    logo_uri?: undefined;
                    clientPurpose?: undefined;
                    idTokenTypesSupported?: undefined;
                    vpFormatsSupported?: undefined;
                };
                required: string[];
            } | {
                type: string;
                properties: {
                    passBy: {
                        $ref: string;
                    };
                    reference_uri: {
                        type: string;
                    };
                    targets: {
                        $ref: string;
                    };
                    id_token_encrypted_response_alg: {
                        $ref: string;
                    };
                    id_token_encrypted_response_enc: {
                        $ref: string;
                    };
                    authorizationEndpoint: {
                        anyOf: ({
                            $ref: string;
                            type?: undefined;
                        } | {
                            type: string;
                            $ref?: undefined;
                        })[];
                    };
                    issuer: {
                        anyOf: ({
                            $ref: string;
                            type?: undefined;
                        } | {
                            type: string;
                            $ref?: undefined;
                        })[];
                    };
                    responseTypesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    scopesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    subjectTypesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    idTokenSigningAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    requestObjectSigningAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    subject_syntax_types_supported: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    tokenEndpoint: {
                        type: string;
                    };
                    userinfoEndpoint: {
                        type: string;
                    };
                    jwksUri: {
                        type: string;
                    };
                    registrationEndpoint: {
                        type: string;
                    };
                    responseModesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    grantTypesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    acrValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    idTokenEncryptionAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    idTokenEncryptionEncValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    userinfoSigningAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    userinfoEncryptionAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    userinfoEncryptionEncValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    requestObjectEncryptionAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    requestObjectEncryptionEncValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    tokenEndpointAuthMethodsSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    tokenEndpointAuthSigningAlgValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    displayValuesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    claimTypesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    claimsSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    serviceDocumentation: {
                        type: string;
                    };
                    claimsLocalesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    uiLocalesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                type: string;
                            };
                        } | {
                            type: string;
                            items?: undefined;
                        })[];
                    };
                    claimsParameterSupported: {
                        type: string;
                    };
                    requestParameterSupported: {
                        type: string;
                    };
                    requestUriParameterSupported: {
                        type: string;
                    };
                    requireRequestUriRegistration: {
                        type: string;
                    };
                    opPolicyUri: {
                        type: string;
                    };
                    opTosUri: {
                        type: string;
                    };
                    idTokenTypesSupported: {
                        anyOf: ({
                            type: string;
                            items: {
                                $ref: string;
                            };
                            $ref?: undefined;
                        } | {
                            $ref: string;
                            type?: undefined;
                            items?: undefined;
                        })[];
                    };
                    vpFormatsSupported: {
                        $ref: string;
                    };
                    client_id?: undefined;
                    redirectUris?: undefined;
                    clientName?: undefined;
                    tokenEndpointAuthMethod?: undefined;
                    applicationType?: undefined;
                    responseTypes?: undefined;
                    grantTypes?: undefined;
                    vpFormats?: undefined;
                    logo_uri?: undefined;
                    clientPurpose?: undefined;
                };
                required: string[];
            })[];
        };
        PassBy: {
            type: string;
            enum: string[];
        };
        PropertyTargets: {
            anyOf: ({
                $ref: string;
                type?: undefined;
                items?: undefined;
            } | {
                type: string;
                items: {
                    $ref: string;
                };
                $ref?: undefined;
            })[];
        };
        PropertyTarget: {
            type: string;
            enum: string[];
            description: string;
        };
        EncKeyAlgorithm: {
            type: string;
            const: string;
        };
        EncSymmetricAlgorithmCode: {
            type: string;
            const: string;
        };
        Schema: {
            type: string;
            enum: string[];
        };
        ResponseIss: {
            type: string;
            enum: string[];
        };
        ResponseType: {
            type: string;
            enum: string[];
        };
        Scope: {
            type: string;
            enum: string[];
        };
        SubjectType: {
            type: string;
            enum: string[];
        };
        SigningAlgo: {
            type: string;
            enum: string[];
        };
        ResponseMode: {
            type: string;
            enum: string[];
        };
        GrantType: {
            type: string;
            enum: string[];
        };
        AuthenticationContextReferences: {
            type: string;
            enum: string[];
        };
        TokenEndpointAuthMethod: {
            type: string;
            enum: string[];
        };
        ClaimType: {
            type: string;
            enum: string[];
        };
        Format: {
            type: string;
            properties: {
                jwt: {
                    $ref: string;
                };
                jwt_vc: {
                    $ref: string;
                };
                jwt_vc_json: {
                    $ref: string;
                };
                jwt_vp: {
                    $ref: string;
                };
                jwt_vp_json: {
                    $ref: string;
                };
                ldp: {
                    $ref: string;
                };
                ldp_vc: {
                    $ref: string;
                };
                ldp_vp: {
                    $ref: string;
                };
                di: {
                    $ref: string;
                };
                di_vc: {
                    $ref: string;
                };
                di_vp: {
                    $ref: string;
                };
                "vc+sd-jwt": {
                    $ref: string;
                };
                mso_mdoc: {
                    $ref: string;
                };
            };
            additionalProperties: boolean;
        };
        JwtObject: {
            type: string;
            properties: {
                alg: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
        LdpObject: {
            type: string;
            properties: {
                proof_type: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
        DiObject: {
            type: string;
            properties: {
                proof_type: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                cryptosuite: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
        SdJwtObject: {
            type: string;
            properties: {
                "sd-jwt_alg_values": {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                "kb-jwt_alg_values": {
                    type: string;
                    items: {
                        type: string;
                    };
                };
            };
            additionalProperties: boolean;
        };
        MsoMdocObject: {
            type: string;
            properties: {
                alg: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
        IdTokenType: {
            type: string;
            enum: string[];
        };
        SupportedVersion: {
            type: string;
            enum: number[];
        };
        CreateJwtCallback: {
            $ref: string;
        };
        "CreateJwtCallback<JwtIssuerWithContext>": {
            properties: {
                isFunction: {
                    type: string;
                    const: boolean;
                };
            };
        };
        JwtIssuer: {
            anyOf: {
                $ref: string;
            }[];
        };
        JwtIssuerDid: {
            type: string;
            properties: {
                method: {
                    type: string;
                    const: string;
                };
                options: {
                    type: string;
                    additionalProperties: {};
                    description: string;
                };
                didUrl: {
                    type: string;
                };
                alg: {
                    anyOf: ({
                        $ref: string;
                        type?: undefined;
                    } | {
                        type: string;
                        $ref?: undefined;
                    })[];
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
        JwtIssuerX5c: {
            type: string;
            properties: {
                method: {
                    type: string;
                    const: string;
                };
                options: {
                    type: string;
                    additionalProperties: {};
                    description: string;
                };
                alg: {
                    anyOf: ({
                        $ref: string;
                        type?: undefined;
                    } | {
                        type: string;
                        $ref?: undefined;
                    })[];
                };
                x5c: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                issuer: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
        JwtIssuerJwk: {
            type: string;
            properties: {
                method: {
                    type: string;
                    const: string;
                };
                options: {
                    type: string;
                    additionalProperties: {};
                    description: string;
                };
                alg: {
                    anyOf: ({
                        $ref: string;
                        type?: undefined;
                    } | {
                        type: string;
                        $ref?: undefined;
                    })[];
                };
                jwk: {
                    $ref: string;
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
        JWK: {
            type: string;
            properties: {
                kty: {
                    type: string;
                };
                crv: {
                    type: string;
                };
                x: {
                    type: string;
                };
                y: {
                    type: string;
                };
                e: {
                    type: string;
                };
                n: {
                    type: string;
                };
                alg: {
                    type: string;
                };
                d: {
                    type: string;
                };
                dp: {
                    type: string;
                };
                dq: {
                    type: string;
                };
                ext: {
                    type: string;
                };
                k: {
                    type: string;
                };
                key_ops: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                kid: {
                    type: string;
                };
                oth: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            d: {
                                type: string;
                            };
                            r: {
                                type: string;
                            };
                            t: {
                                type: string;
                            };
                        };
                        additionalProperties: boolean;
                    };
                };
                p: {
                    type: string;
                };
                q: {
                    type: string;
                };
                qi: {
                    type: string;
                };
                use: {
                    type: string;
                };
                x5c: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                x5t: {
                    type: string;
                };
                "x5t#S256": {
                    type: string;
                };
                x5u: {
                    type: string;
                };
            };
            additionalProperties: {};
        };
        JwtIssuerCustom: {
            type: string;
            properties: {
                method: {
                    type: string;
                    const: string;
                };
                options: {
                    type: string;
                    additionalProperties: {};
                    description: string;
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
        PresentationExchangeResponseOpts: {
            type: string;
            properties: {
                verifiablePresentations: {
                    type: string;
                    items: {
                        anyOf: {
                            $ref: string;
                        }[];
                    };
                };
                vpTokenLocation: {
                    $ref: string;
                };
                presentationSubmission: {
                    $ref: string;
                };
                restrictToFormats: {
                    $ref: string;
                };
                restrictToDIDMethods: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
        W3CVerifiablePresentation: {
            anyOf: {
                $ref: string;
            }[];
            description: string;
        };
        IVerifiablePresentation: {
            type: string;
            properties: {
                proof: {
                    anyOf: ({
                        $ref: string;
                        type?: undefined;
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            $ref: string;
                        };
                        $ref?: undefined;
                    })[];
                };
                id: {
                    type: string;
                };
                "@context": {
                    anyOf: ({
                        $ref: string;
                        type?: undefined;
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            $ref: string;
                        };
                        $ref?: undefined;
                    })[];
                };
                type: {
                    anyOf: ({
                        type: string;
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            type: string;
                        };
                    })[];
                };
                verifiableCredential: {
                    type: string;
                    items: {
                        $ref: string;
                    };
                };
                presentation_submission: {
                    $ref: string;
                };
                holder: {
                    type: string;
                };
                verifier: {
                    type: string;
                };
            };
            required: string[];
        };
        IProof: {
            type: string;
            properties: {
                type: {
                    anyOf: ({
                        $ref: string;
                        type?: undefined;
                    } | {
                        type: string;
                        $ref?: undefined;
                    })[];
                };
                created: {
                    type: string;
                };
                proofPurpose: {
                    anyOf: ({
                        $ref: string;
                        type?: undefined;
                    } | {
                        type: string;
                        $ref?: undefined;
                    })[];
                };
                verificationMethod: {
                    type: string;
                };
                challenge: {
                    type: string;
                };
                domain: {
                    type: string;
                };
                proofValue: {
                    type: string;
                };
                jws: {
                    type: string;
                };
                jwt: {
                    type: string;
                };
                mso_mdoc: {
                    type: string;
                };
                nonce: {
                    type: string;
                };
                requiredRevealStatements: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
            };
            required: string[];
        };
        IProofType: {
            type: string;
            enum: string[];
        };
        IProofPurpose: {
            type: string;
            enum: string[];
        };
        ICredentialContextType: {
            anyOf: ({
                type: string;
                properties: {
                    name: {
                        type: string;
                    };
                    did: {
                        type: string;
                    };
                };
            } | {
                type: string;
                properties?: undefined;
            })[];
        };
        W3CVerifiableCredential: {
            anyOf: {
                $ref: string;
            }[];
            description: string;
        };
        IVerifiableCredential: {
            type: string;
            properties: {
                proof: {
                    anyOf: ({
                        $ref: string;
                        type?: undefined;
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            $ref: string;
                        };
                        $ref?: undefined;
                    })[];
                };
                "@context": {
                    anyOf: ({
                        $ref: string;
                        type?: undefined;
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            $ref: string;
                        };
                        $ref?: undefined;
                    })[];
                };
                type: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                credentialSchema: {
                    anyOf: ({
                        $ref: string;
                        type?: undefined;
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            $ref: string;
                        };
                        $ref?: undefined;
                    })[];
                };
                issuer: {
                    anyOf: {
                        $ref: string;
                    }[];
                };
                issuanceDate: {
                    type: string;
                };
                credentialSubject: {
                    anyOf: ({
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                        };
                        items?: undefined;
                    } | {
                        type: string;
                        items: {
                            type: string;
                            properties: {
                                id: {
                                    type: string;
                                };
                            };
                        };
                        properties?: undefined;
                    })[];
                };
                expirationDate: {
                    type: string;
                };
                id: {
                    type: string;
                };
                credentialStatus: {
                    $ref: string;
                };
                description: {
                    type: string;
                };
                name: {
                    type: string;
                };
            };
            required: string[];
        };
        ICredentialSchemaType: {
            anyOf: ({
                $ref: string;
                type?: undefined;
            } | {
                type: string;
                $ref?: undefined;
            })[];
        };
        ICredentialSchema: {
            type: string;
            properties: {
                id: {
                    type: string;
                };
                type: {
                    type: string;
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
        IIssuerId: {
            type: string;
        };
        IIssuer: {
            type: string;
            properties: {
                id: {
                    type: string;
                };
            };
            required: string[];
        };
        ICredentialStatus: {
            type: string;
            properties: {
                id: {
                    type: string;
                };
                type: {
                    type: string;
                };
            };
            required: string[];
            additionalProperties: boolean;
        };
        CompactJWT: {
            type: string;
            description: string;
        };
        PresentationSubmission: {
            type: string;
            properties: {
                id: {
                    type: string;
                    description: string;
                };
                definition_id: {
                    type: string;
                    description: string;
                };
                descriptor_map: {
                    type: string;
                    items: {
                        $ref: string;
                    };
                    description: string;
                };
            };
            required: string[];
            additionalProperties: boolean;
            description: string;
        };
        Descriptor: {
            type: string;
            properties: {
                id: {
                    type: string;
                    description: string;
                };
                path: {
                    type: string;
                    description: string;
                };
                path_nested: {
                    $ref: string;
                };
                format: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
            additionalProperties: boolean;
            description: string;
        };
        CompactSdJwtVc: {
            type: string;
            description: string;
        };
        VPTokenLocation: {
            type: string;
            enum: string[];
        };
    };
};
//# sourceMappingURL=AuthorizationResponseOpts.schema.d.ts.map