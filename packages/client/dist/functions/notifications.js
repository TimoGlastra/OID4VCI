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
exports.sendNotification = sendNotification;
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const types_1 = require("../types");
function sendNotification(credentialRequestOpts, request, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        types_1.LOG.info(`Sending status notification event '${request.event}' for id ${request.notification_id}`);
        if (!credentialRequestOpts.notificationEndpoint) {
            throw Error(`Cannot send notification when no notification endpoint is provided`);
        }
        const token = accessToken !== null && accessToken !== void 0 ? accessToken : credentialRequestOpts.token;
        const response = yield (0, oid4vci_common_1.post)(credentialRequestOpts.notificationEndpoint, JSON.stringify(request), Object.assign({}, (token && { bearerToken: token })));
        const error = ((_a = response.errorBody) === null || _a === void 0 ? void 0 : _a.error) !== undefined;
        const result = {
            error,
            response: error ? response.errorBody : undefined,
        };
        if (error) {
            types_1.LOG.warning(`Notification endpoint returned an error for event '${request.event}' and id ${request.notification_id}: ${response.errorBody}`);
        }
        else {
            types_1.LOG.debug(`Notification endpoint returned success for event '${request.event}' and id ${request.notification_id}`);
        }
        return result;
    });
}
//# sourceMappingURL=notifications.js.map