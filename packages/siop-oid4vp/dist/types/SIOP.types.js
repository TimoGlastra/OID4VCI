"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentType = exports.SupportedVersion = exports.RevocationVerification = exports.RevocationStatus = exports.isPresentation = exports.isVP = exports.isResponsePayload = exports.isRequestPayload = exports.isResponseOpts = exports.isRequestOpts = exports.RequestAud = exports.ResponseIss = exports.Schema = exports.SubjectType = exports.CredentialFormat = exports.SubjectSyntaxTypesSupportedValues = exports.SubjectIdentifierType = exports.ResponseType = exports.Scope = exports.TokenEndpointAuthMethod = exports.KeyCurve = exports.KeyType = exports.UrlEncodingFormat = exports.ProtocolFlow = exports.ResponseMode = exports.GrantType = exports.ResponseContext = exports.PassBy = exports.EncKeyAlgorithm = exports.EncSymmetricAlgorithmCode = exports.VerifiableCredentialTypeFormat = exports.VerifiablePresentationTypeFormat = exports.IdTokenType = exports.ClaimType = exports.AuthenticationContextReferences = exports.DEFAULT_EXPIRATION_TIME = void 0;
exports.DEFAULT_EXPIRATION_TIME = 10 * 60;
var AuthenticationContextReferences;
(function (AuthenticationContextReferences) {
    AuthenticationContextReferences["PHR"] = "phr";
    AuthenticationContextReferences["PHRH"] = "phrh";
})(AuthenticationContextReferences || (exports.AuthenticationContextReferences = AuthenticationContextReferences = {}));
var ClaimType;
(function (ClaimType) {
    ClaimType["NORMAL"] = "normal";
    ClaimType["AGGREGATED"] = "aggregated";
    ClaimType["DISTRIBUTED"] = "distributed";
})(ClaimType || (exports.ClaimType = ClaimType = {}));
var IdTokenType;
(function (IdTokenType) {
    IdTokenType["SUBJECT_SIGNED"] = "subject_signed";
    IdTokenType["ATTESTER_SIGNED"] = "attester_signed";
})(IdTokenType || (exports.IdTokenType = IdTokenType = {}));
var VerifiablePresentationTypeFormat;
(function (VerifiablePresentationTypeFormat) {
    VerifiablePresentationTypeFormat["JWT_VP"] = "jwt_vp";
    VerifiablePresentationTypeFormat["LDP_VP"] = "ldp_vp";
    VerifiablePresentationTypeFormat["SD_JWT_VC"] = "vc+sd-jwt";
    VerifiablePresentationTypeFormat["MSO_MDOC"] = "mso_mdoc";
})(VerifiablePresentationTypeFormat || (exports.VerifiablePresentationTypeFormat = VerifiablePresentationTypeFormat = {}));
var VerifiableCredentialTypeFormat;
(function (VerifiableCredentialTypeFormat) {
    VerifiableCredentialTypeFormat["LDP_VC"] = "ldp_vc";
    VerifiableCredentialTypeFormat["JWT_VC"] = "jwt_vc";
    VerifiableCredentialTypeFormat["SD_JWT_VC"] = "vc+sd-jwt";
    VerifiableCredentialTypeFormat["MSO_MDOC"] = "mso_mdoc";
})(VerifiableCredentialTypeFormat || (exports.VerifiableCredentialTypeFormat = VerifiableCredentialTypeFormat = {}));
var EncSymmetricAlgorithmCode;
(function (EncSymmetricAlgorithmCode) {
    EncSymmetricAlgorithmCode["XC20P"] = "XC20P";
})(EncSymmetricAlgorithmCode || (exports.EncSymmetricAlgorithmCode = EncSymmetricAlgorithmCode = {}));
var EncKeyAlgorithm;
(function (EncKeyAlgorithm) {
    EncKeyAlgorithm["ECDH_ES"] = "ECDH-ES";
})(EncKeyAlgorithm || (exports.EncKeyAlgorithm = EncKeyAlgorithm = {}));
var PassBy;
(function (PassBy) {
    PassBy["NONE"] = "NONE";
    PassBy["REFERENCE"] = "REFERENCE";
    PassBy["VALUE"] = "VALUE";
})(PassBy || (exports.PassBy = PassBy = {}));
var ResponseContext;
(function (ResponseContext) {
    ResponseContext["RP"] = "rp";
    ResponseContext["OP"] = "op";
})(ResponseContext || (exports.ResponseContext = ResponseContext = {}));
var GrantType;
(function (GrantType) {
    GrantType["AUTHORIZATION_CODE"] = "authorization_code";
    GrantType["IMPLICIT"] = "implicit";
})(GrantType || (exports.GrantType = GrantType = {}));
var ResponseMode;
(function (ResponseMode) {
    ResponseMode["FRAGMENT"] = "fragment";
    ResponseMode["FORM_POST"] = "form_post";
    ResponseMode["POST"] = "post";
    // Defined in openid4vp spec > 17 and replaces POST above
    // See https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-response-mode-direct_post
    ResponseMode["DIRECT_POST"] = "direct_post";
    ResponseMode["QUERY"] = "query";
    ResponseMode["DIRECT_POST_JWT"] = "direct_post.jwt";
    ResponseMode["QUERY_JWT"] = "query.jwt";
    ResponseMode["FRAGMENT_JWT"] = "fragment.jwt";
})(ResponseMode || (exports.ResponseMode = ResponseMode = {}));
var ProtocolFlow;
(function (ProtocolFlow) {
    ProtocolFlow["SAME_DEVICE"] = "same_device";
    ProtocolFlow["CROSS_DEVICE"] = "cross_device";
})(ProtocolFlow || (exports.ProtocolFlow = ProtocolFlow = {}));
var UrlEncodingFormat;
(function (UrlEncodingFormat) {
    UrlEncodingFormat["FORM_URL_ENCODED"] = "application/x-www-form-urlencoded";
})(UrlEncodingFormat || (exports.UrlEncodingFormat = UrlEncodingFormat = {}));
var KeyType;
(function (KeyType) {
    KeyType["EC"] = "EC";
})(KeyType || (exports.KeyType = KeyType = {}));
var KeyCurve;
(function (KeyCurve) {
    KeyCurve["SECP256k1"] = "secp256k1";
    KeyCurve["ED25519"] = "ed25519";
})(KeyCurve || (exports.KeyCurve = KeyCurve = {}));
var TokenEndpointAuthMethod;
(function (TokenEndpointAuthMethod) {
    TokenEndpointAuthMethod["CLIENT_SECRET_POST"] = "client_secret_post";
    TokenEndpointAuthMethod["CLIENT_SECRET_BASIC"] = "client_secret_basic";
    TokenEndpointAuthMethod["CLIENT_SECRET_JWT"] = "client_secret_jwt";
    TokenEndpointAuthMethod["PRIVATE_KEY_JWT"] = "private_key_jwt";
})(TokenEndpointAuthMethod || (exports.TokenEndpointAuthMethod = TokenEndpointAuthMethod = {}));
var Scope;
(function (Scope) {
    Scope["OPENID"] = "openid";
    Scope["OPENID_DIDAUTHN"] = "openid did_authn";
    //added based on the https://openid.net/specs/openid-connect-implicit-1_0.html#SelfIssuedDiscovery
    Scope["PROFILE"] = "profile";
    Scope["EMAIL"] = "email";
    Scope["ADDRESS"] = "address";
    Scope["PHONE"] = "phone";
})(Scope || (exports.Scope = Scope = {}));
var ResponseType;
(function (ResponseType) {
    ResponseType["ID_TOKEN"] = "id_token";
    ResponseType["VP_TOKEN"] = "vp_token";
})(ResponseType || (exports.ResponseType = ResponseType = {}));
var SubjectIdentifierType;
(function (SubjectIdentifierType) {
    SubjectIdentifierType["JKT"] = "jkt";
    SubjectIdentifierType["DID"] = "did";
})(SubjectIdentifierType || (exports.SubjectIdentifierType = SubjectIdentifierType = {}));
var SubjectSyntaxTypesSupportedValues;
(function (SubjectSyntaxTypesSupportedValues) {
    SubjectSyntaxTypesSupportedValues["DID"] = "did";
    SubjectSyntaxTypesSupportedValues["JWK_THUMBPRINT"] = "urn:ietf:params:oauth:jwk-thumbprint";
})(SubjectSyntaxTypesSupportedValues || (exports.SubjectSyntaxTypesSupportedValues = SubjectSyntaxTypesSupportedValues = {}));
var CredentialFormat;
(function (CredentialFormat) {
    CredentialFormat["JSON_LD"] = "w3cvc-jsonld";
    CredentialFormat["JWT"] = "jwt";
})(CredentialFormat || (exports.CredentialFormat = CredentialFormat = {}));
var SubjectType;
(function (SubjectType) {
    SubjectType["PUBLIC"] = "public";
    SubjectType["PAIRWISE"] = "pairwise";
})(SubjectType || (exports.SubjectType = SubjectType = {}));
var Schema;
(function (Schema) {
    Schema["OPENID"] = "openid:";
    Schema["OPENID_VC"] = "openid-vc:";
})(Schema || (exports.Schema = Schema = {}));
var ResponseIss;
(function (ResponseIss) {
    ResponseIss["SELF_ISSUED_V1"] = "https://self-issued.me";
    ResponseIss["SELF_ISSUED_V2"] = "https://self-issued.me/v2";
    ResponseIss["JWT_VC_PRESENTATION_V1"] = "https://self-issued.me/v2/openid-vc";
})(ResponseIss || (exports.ResponseIss = ResponseIss = {}));
var RequestAud;
(function (RequestAud) {
    RequestAud["SELF_ISSUED_V2"] = "https://self-issued.me/v2";
})(RequestAud || (exports.RequestAud = RequestAud = {}));
const isRequestOpts = (object) => 'requestBy' in object;
exports.isRequestOpts = isRequestOpts;
const isResponseOpts = (object) => 'did' in object;
exports.isResponseOpts = isResponseOpts;
const isRequestPayload = (object) => 'response_mode' in object && 'response_type' in object;
exports.isRequestPayload = isRequestPayload;
const isResponsePayload = (object) => 'iss' in object && 'aud' in object;
exports.isResponsePayload = isResponsePayload;
const isVP = (object) => 'presentation' in object;
exports.isVP = isVP;
const isPresentation = (object) => 'presentation_submission' in object;
exports.isPresentation = isPresentation;
var RevocationStatus;
(function (RevocationStatus) {
    RevocationStatus["VALID"] = "valid";
    RevocationStatus["INVALID"] = "invalid";
})(RevocationStatus || (exports.RevocationStatus = RevocationStatus = {}));
var RevocationVerification;
(function (RevocationVerification) {
    RevocationVerification["NEVER"] = "never";
    RevocationVerification["IF_PRESENT"] = "if_present";
    RevocationVerification["ALWAYS"] = "always";
})(RevocationVerification || (exports.RevocationVerification = RevocationVerification = {}));
var SupportedVersion;
(function (SupportedVersion) {
    SupportedVersion[SupportedVersion["SIOPv2_ID1"] = 70] = "SIOPv2_ID1";
    SupportedVersion[SupportedVersion["SIOPv2_D11"] = 110] = "SIOPv2_D11";
    SupportedVersion[SupportedVersion["SIOPv2_D12_OID4VP_D18"] = 180] = "SIOPv2_D12_OID4VP_D18";
    SupportedVersion[SupportedVersion["SIOPv2_D12_OID4VP_D20"] = 200] = "SIOPv2_D12_OID4VP_D20";
    SupportedVersion[SupportedVersion["JWT_VC_PRESENTATION_PROFILE_v1"] = 71] = "JWT_VC_PRESENTATION_PROFILE_v1";
})(SupportedVersion || (exports.SupportedVersion = SupportedVersion = {}));
var ContentType;
(function (ContentType) {
    ContentType["FORM_URL_ENCODED"] = "application/x-www-form-urlencoded";
    ContentType["UTF_8"] = "UTF-8";
})(ContentType || (exports.ContentType = ContentType = {}));
//# sourceMappingURL=SIOP.types.js.map