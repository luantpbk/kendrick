import crypto from 'crypto';

export class RandomString {
    public static generate(length: number = 32): string {
        return crypto.randomBytes(length).toString('hex').substring(0, length);
    }
}
