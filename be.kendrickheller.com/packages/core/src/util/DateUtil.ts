export class DateUtil {
    public static getCurrentDate(): Date {
        return new Date();
    }

    public static format(date: Date, format: string = 'YYYY-MM-DD'): string {
        // Basic placeholder implementation
        return date.toISOString().split('T')[0];
    }
}
