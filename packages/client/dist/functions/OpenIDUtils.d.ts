import { OpenIDResponse, WellKnownEndpoints } from '@sphereon/oid4vci-common';
/**
 * Allows to retrieve information from a well-known location
 *
 * @param host The host
 * @param endpointType The endpoint type, currently supports OID4VCI, OIDC and OAuth2 endpoint types
 * @param opts Options, like for instance whether an error should be thrown in case the endpoint doesn't exist
 */
export declare const retrieveWellknown: <T>(host: string, endpointType: WellKnownEndpoints, opts?: {
    errorOnNotFound?: boolean;
}) => Promise<OpenIDResponse<T>>;
//# sourceMappingURL=OpenIDUtils.d.ts.map