"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ajv_1 = __importDefault(require("ajv"));
const standalone_1 = __importDefault(require("ajv/dist/standalone"));
const ts_json_schema_generator_1 = require("ts-json-schema-generator");
class CustomTypeFormatter {
    supportsType(type) {
        return type instanceof ts_json_schema_generator_1.FunctionType;
    }
    getDefinition() {
        // Return a custom schema for the function property.
        return {
            properties: {
                isFunction: {
                    type: 'boolean',
                    const: true,
                },
            },
        };
    }
    getChildren() {
        return [];
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function writeSchema(config) {
    const formatter = (0, ts_json_schema_generator_1.createFormatter)(config, (fmt) => {
        fmt.addTypeFormatter(new CustomTypeFormatter());
    });
    const program = (0, ts_json_schema_generator_1.createProgram)(config);
    const schema = new ts_json_schema_generator_1.SchemaGenerator(program, (0, ts_json_schema_generator_1.createParser)(program, config), formatter, config).createSchema(config.type);
    let schemaString = JSON.stringify(schema, null, 2);
    schemaString = correctSchema(schemaString);
    fs_1.default.writeFile(path_1.default.join(__dirname, config.outputPath), `export const ${config.schemaId}Obj = ${schemaString};`, (err) => {
        if (err) {
            throw err;
        }
    });
    return schema;
}
function generateValidationCode(schemas) {
    const ajv = new ajv_1.default({ schemas, code: { source: true, lines: true, esm: false }, allowUnionTypes: true, strict: false });
    const moduleCode = (0, standalone_1.default)(ajv);
    fs_1.default.writeFileSync(path_1.default.join(__dirname, '../schemas/validation/schemaValidation.js'), moduleCode);
}
function correctSchema(schemaString) {
    return schemaString.replace('"SuppliedSignature": {\n' +
        '      "type": "object",\n' +
        '      "properties": {\n' +
        '        "withSignature": {\n' +
        '          "properties": {\n' +
        '            "isFunction": {\n' +
        '              "type": "boolean",\n' +
        '              "const": true\n' +
        '            }\n' +
        '          }\n' +
        '        },\n' +
        '        "did": {\n' +
        '          "type": "string"\n' +
        '        },\n' +
        '        "kid": {\n' +
        '          "type": "string"\n' +
        '        }\n' +
        '      },\n' +
        '      "required": [\n' +
        '        "withSignature",\n' +
        '        "did",\n' +
        '        "kid"\n' +
        '      ],\n' +
        '      "additionalProperties": false\n' +
        '    },', '"SuppliedSignature": {\n' +
        '      "type": "object",\n' +
        '      "properties": {\n' +
        '        "did": {\n' +
        '          "type": "string"\n' +
        '        },\n' +
        '        "kid": {\n' +
        '          "type": "string"\n' +
        '        }\n' +
        '      },\n' +
        '      "required": [\n' +
        '        "did",\n' +
        '        "kid"\n' +
        '      ],\n' +
        '      "additionalProperties": true\n' +
        '    },');
}
/*
const requestOptsConf = {
  path: '../authorization-request/types.ts',
  tsconfig: 'tsconfig.json',
  type: 'CreateAuthorizationRequestOpts', // Or <type-name> if you want to generate schema for that one type only
  schemaId: 'CreateAuthorizationRequestOptsSchema',
  outputPath: '../../schemas/AuthorizationRequestOpts.schema.ts',
  // outputConstName: 'AuthorizationRequestOptsSchema',
  skipTypeCheck: true
};*/
const responseOptsConf = {
    path: '../authorization-response/types.ts',
    tsconfig: 'tsconfig.json',
    type: 'AuthorizationResponseOpts', // Or <type-name> if you want to generate schema for that one type only
    schemaId: 'AuthorizationResponseOptsSchema',
    outputPath: '../schemas/AuthorizationResponseOpts.schema.ts',
    // outputConstName: 'AuthorizationResponseOptsSchema',
    skipTypeCheck: true,
};
const rPRegistrationMetadataPayload = {
    path: '../types/SIOP.types.ts',
    tsconfig: 'tsconfig.json',
    type: 'RPRegistrationMetadataPayload',
    schemaId: 'RPRegistrationMetadataPayloadSchema',
    outputPath: '../schemas/RPRegistrationMetadataPayload.schema.ts',
    // outputConstName: 'RPRegistrationMetadataPayloadSchema',
    skipTypeCheck: true,
};
const discoveryMetadataPayload = {
    path: '../types/SIOP.types.ts',
    tsconfig: 'tsconfig.json',
    type: 'DiscoveryMetadataPayload',
    schemaId: 'DiscoveryMetadataPayloadSchema',
    outputPath: '../schemas/DiscoveryMetadataPayload.schema.ts',
    // outputConstName: 'DiscoveryMetadataPayloadSchema',
    skipTypeCheck: true,
};
const authorizationRequestPayloadVID1 = {
    path: '../types/SIOP.types.ts',
    tsconfig: 'tsconfig.json',
    type: 'AuthorizationRequestPayloadVID1', // Or <type-name> if you want to generate schema for that one type only
    schemaId: 'AuthorizationRequestPayloadVID1Schema',
    outputPath: '../schemas/AuthorizationRequestPayloadVID1.schema.ts',
    // outputConstName: 'AuthorizationRequestPayloadSchemaVID1',
    skipTypeCheck: true,
};
const authorizationRequestPayloadVD11 = {
    path: '../types/SIOP.types.ts',
    tsconfig: 'tsconfig.json',
    type: 'AuthorizationRequestPayloadVD11', // Or <type-name> if you want to generate schema for that one type only
    schemaId: 'AuthorizationRequestPayloadVD11Schema',
    outputPath: '../schemas/AuthorizationRequestPayloadVD11.schema.ts',
    // outputConstName: 'AuthorizationRequestPayloadSchemaVD11',
    skipTypeCheck: true,
};
const authorizationRequestPayloadVD12OID4VPD18 = {
    path: '../types/SIOP.types.ts',
    tsconfig: 'tsconfig.json',
    type: 'AuthorizationRequestPayloadVD12OID4VPD18', // Or <type-name> if you want to generate schema for that one type only
    schemaId: 'AuthorizationRequestPayloadVD12OID4VPD18Schema',
    outputPath: '../schemas/AuthorizationRequestPayloadVD12OID4VPD18.schema.ts',
    // outputConstName: 'AuthorizationRequestPayloadSchemaVD11',
    skipTypeCheck: true,
};
const authorizationRequestPayloadVD12OID4VPD20 = {
    path: '../types/SIOP.types.ts',
    tsconfig: 'tsconfig.json',
    type: 'AuthorizationRequestPayloadVD12OID4VPD20', // Or <type-name> if you want to generate schema for that one type only
    schemaId: 'AuthorizationRequestPayloadVD12OID4VPD20Schema',
    outputPath: '../schemas/AuthorizationRequestPayloadVD12OID4VPD20.schema.ts',
    // outputConstName: 'AuthorizationRequestPayloadSchemaVD11',
    skipTypeCheck: true,
};
const schemas = [
    writeSchema(authorizationRequestPayloadVID1),
    writeSchema(authorizationRequestPayloadVD11),
    writeSchema(authorizationRequestPayloadVD12OID4VPD18),
    writeSchema(authorizationRequestPayloadVD12OID4VPD20),
    // writeSchema(requestOptsConf),
    writeSchema(responseOptsConf),
    writeSchema(rPRegistrationMetadataPayload),
    writeSchema(discoveryMetadataPayload),
];
generateValidationCode(schemas);
//# sourceMappingURL=schemaGenerator.js.map