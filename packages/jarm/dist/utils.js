"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendQueryParams = appendQueryParams;
exports.appendFragmentParams = appendFragmentParams;
exports.assertValueSupported = assertValueSupported;
function appendQueryParams(input) {
    const { url, params } = input;
    // Append the new query parameters from the params object
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, encodeURIComponent(value));
    }
    return url;
}
function appendFragmentParams(input) {
    const { url, fragments } = input;
    // Convert existing fragment to an object and remove the leading '#'
    const fragmentParams = new URLSearchParams(url.hash.slice(1)); // Remove the leading '#' from the fragment
    // Append the new fragments from the fragments object
    for (const [key, value] of Object.entries(fragments)) {
        fragmentParams.append(key, encodeURIComponent(value));
    }
    // Rebuild the fragment string and assign it to the URL
    url.hash = fragmentParams.toString();
    return url;
}
function assertValueSupported(input) {
    const { required, error, supported, actual } = input;
    const intersection = supported.find((value) => value === actual);
    if (required && !intersection)
        throw error;
    return intersection;
}
//# sourceMappingURL=utils.js.map