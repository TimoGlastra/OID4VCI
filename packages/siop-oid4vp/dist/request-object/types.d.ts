import { JwtIssuer } from '@sphereon/oid4vc-common';
import { ClaimPayloadCommonOpts, RequestObjectPayloadOpts } from '../authorization-request';
import { ObjectBy } from '../types';
import { CreateJwtCallback } from '../types/VpJwtIssuer';
export interface RequestObjectOpts<CT extends ClaimPayloadCommonOpts> extends ObjectBy {
    payload?: RequestObjectPayloadOpts<CT>;
    createJwtCallback: CreateJwtCallback;
    jwtIssuer: JwtIssuer;
}
//# sourceMappingURL=types.d.ts.map