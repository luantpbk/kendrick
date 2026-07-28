import { prisma } from '@kendrickheller/core';

export class TrackingService {
    public static async track(data: any) {
        // Just return true for now, or save to a log/analytics table
        return true;
    }
}
