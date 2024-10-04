import { DigestAlgorithm } from '../types';
import { JWK } from '.';
export declare function calculateJwkThumbprint(jwk: JWK, digestAlgorithm?: DigestAlgorithm): Promise<string>;
export declare function getDigestAlgorithmFromJwkThumbprintUri(uri: string): Promise<DigestAlgorithm>;
export declare function calculateJwkThumbprintUri(jwk: JWK, digestAlgorithm?: DigestAlgorithm): Promise<string>;
//# sourceMappingURL=JwkThumbprint.d.ts.map