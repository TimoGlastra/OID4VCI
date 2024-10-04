import { Request } from 'express';
export declare const validateRequestBody: ({ required, conditional, body, }: {
    required?: string[];
    conditional?: string[];
    body: Pick<Request, 'body'>;
}) => void;
//# sourceMappingURL=expressUtils.d.ts.map