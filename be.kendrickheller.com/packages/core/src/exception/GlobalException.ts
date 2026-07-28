import { IEnumError } from '../common/IEnumError';

export class GlobalException extends Error {
    public code: string;

    constructor(err: IEnumError, message?: string) {
        super(message || err.getMessage());
        this.code = err.getCode();
        this.name = 'GlobalException';
    }
}
