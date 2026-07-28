import { IEnumError } from './IEnumError';

export class ErrorResponseDto {
    errorCode?: string;
    errorMessage?: string;

    constructor(err?: IEnumError, message?: string) {
        if (err) {
            this.errorCode = err.getCode();
            this.errorMessage = message || err.getMessage();
        } else if (message) {
            this.errorMessage = message;
        }
    }
}
