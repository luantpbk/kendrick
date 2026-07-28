import { prisma } from '@kendrickheller/core';

export class CompanyInfoService {
    public static async getCompanyInfos(
        keyword?: string,
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        if (keyword) {
            whereClause.OR = [
                { company_info_title: { contains: keyword, mode: 'insensitive' } },
                { company_info_key: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        const data = await prisma.companyInfo.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        return data;
    }

    public static async getCompanyInfoById(id: number) {
        return prisma.companyInfo.findUnique({
            where: { companyInfoId: id }
        });
    }

    public static async getCompanyInfoByKey(key: string) {
        return prisma.companyInfo.findFirst({
            where: { companyInfoKey: key }
        });
    }

    public static async createCompanyInfo(data: any) {
        return prisma.companyInfo.create({
            data: { ...data }
        });
    }

    public static async updateCompanyInfo(id: number, data: any) {
        return prisma.companyInfo.update({
            where: { companyInfoId: id },
            data: { ...data }
        });
    }

    public static async deleteCompanyInfo(id: number) {
        return prisma.companyInfo.update({
            where: { companyInfoId: id },
            data: { deleteFlg: 1 }
        });
    }
}
