import { ExternalSignature, InternalSignature, NoSignature, SuppliedSignature } from './types/SIOP.types';
export declare const isInternalSignature: (object: InternalSignature | ExternalSignature | SuppliedSignature | NoSignature) => object is InternalSignature;
export declare const isExternalSignature: (object: InternalSignature | ExternalSignature | SuppliedSignature | NoSignature) => object is ExternalSignature;
export declare const isSuppliedSignature: (object: InternalSignature | ExternalSignature | SuppliedSignature | NoSignature) => object is SuppliedSignature;
//# sourceMappingURL=helpers.d.ts.map