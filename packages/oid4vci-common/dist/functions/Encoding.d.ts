import { DecodeURIAsJsonOpts, EncodeJsonAsURIOpts } from '../types';
/**
 * @type {(json: {[s:string]: never} | ArrayLike<never> | string | object, opts?: EncodeJsonAsURIOpts)} encodes a Json object into a URI
 * @param { {[s:string]: never} | ArrayLike<never> | string | object } json
 * @param {EncodeJsonAsURIOpts} [opts] Option to encode json as uri
 *          - urlTypeProperties: a list of properties of which the value is a URL
 *          - arrayTypeProperties: a list of properties which are an array
 */
export declare function convertJsonToURI(json: {
    [s: string]: never;
} | ArrayLike<never> | string | object, opts?: EncodeJsonAsURIOpts): string;
/**
 * @type {(uri: string, opts?: DecodeURIAsJsonOpts): unknown} convertURIToJsonObject converts an URI into a Json object decoding its properties
 * @param {string} uri
 * @param {DecodeURIAsJsonOpts} [opts]
 *          - requiredProperties: the required properties
 *          - arrayTypeProperties: properties that can show up more that once
 * @returns JSON object
 */
export declare function convertURIToJsonObject(uri: string, opts?: DecodeURIAsJsonOpts): unknown;
//# sourceMappingURL=Encoding.d.ts.map