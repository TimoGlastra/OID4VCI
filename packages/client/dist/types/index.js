"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG = void 0;
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const ssi_types_1 = require("@sphereon/ssi-types");
exports.LOG = oid4vci_common_1.VCI_LOGGERS.options('sphereon:oid4vci:client', { methods: [ssi_types_1.LogMethod.EVENT, ssi_types_1.LogMethod.DEBUG_PKG] }).get('sphereon:oid4vci:client');
//# sourceMappingURL=index.js.map