"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENTS = exports.NotificationStatusEventNames = exports.CredentialEventNames = exports.CredentialOfferEventNames = void 0;
const ssi_types_1 = require("@sphereon/ssi-types");
var CredentialOfferEventNames;
(function (CredentialOfferEventNames) {
    CredentialOfferEventNames["OID4VCI_OFFER_CREATED"] = "OID4VCI_OFFER_CREATED";
    CredentialOfferEventNames["OID4VCI_OFFER_EXPIRED"] = "OID4VCI_OFFER_EXPIRED";
    CredentialOfferEventNames["OID4VCI_OFFER_DELETED"] = "OID4VCI_OFFER_DELETED";
})(CredentialOfferEventNames || (exports.CredentialOfferEventNames = CredentialOfferEventNames = {}));
var CredentialEventNames;
(function (CredentialEventNames) {
    CredentialEventNames["OID4VCI_CREDENTIAL_ISSUED"] = "OID4VCI_CREDENTIAL_ISSUED";
})(CredentialEventNames || (exports.CredentialEventNames = CredentialEventNames = {}));
var NotificationStatusEventNames;
(function (NotificationStatusEventNames) {
    NotificationStatusEventNames["OID4VCI_NOTIFICATION_RECEIVED"] = "OID4VCI_NOTIFICATION_RECEIVED";
    NotificationStatusEventNames["OID4VCI_NOTIFICATION_PROCESSED"] = "OID4VCI_NOTIFICATION_PROCESSED";
})(NotificationStatusEventNames || (exports.NotificationStatusEventNames = NotificationStatusEventNames = {}));
exports.EVENTS = ssi_types_1.EventManager.instance();
//# sourceMappingURL=index.js.map