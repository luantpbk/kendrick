import { prisma } from '@kendrickheller/core';

export class CountryService {
    public static async getCountries(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.countryName = { contains: keyword, mode: 'insensitive' };
        }

        const [total, data] = await Promise.all([
            prisma.country.count({ where: whereClause }),
            prisma.country.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getCountryById(id: number) {
        return prisma.country.findUnique({
            where: { countryId: id }
        });
    }

    public static async createCountry(data: any) {
        return prisma.country.create({
            data: { ...data }
        });
    }

    public static async updateCountry(id: number, data: any) {
        return prisma.country.update({
            where: { countryId: id },
            data: { ...data }
        });
    }

    public static async deleteCountry(id: number) {
        return prisma.country.update({
            where: { countryId: id },
            data: { deleteFlg: 1 }
        });
    }
}
