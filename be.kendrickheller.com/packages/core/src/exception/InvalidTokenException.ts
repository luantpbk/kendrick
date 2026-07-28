export class InvalidTokenException extends Error {
    public code: string;

    constructor(message: string = 'Invalid or expired token') {
        super(message);
        this.code = 'INVALID_TOKEN';
        this.name = 'InvalidTokenException';
    }
}
