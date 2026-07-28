import { prisma } from '@kendrickheller/core';

export class NoteService {
    public static async getNotes(
        size: number = 20,
        page: number = 0,
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        const [total, data] = await Promise.all([
            prisma.note.count({ where: whereClause }),
            prisma.note.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getNoteById(id: number) {
        return prisma.note.findUnique({
            where: { noteId: id }
        });
    }

    public static async createNote(data: any) {
        return prisma.note.create({
            data: { ...data }
        });
    }

    public static async updateNote(id: number, data: any) {
        return prisma.note.update({
            where: { noteId: id },
            data: { ...data }
        });
    }

    public static async deleteNote(id: number) {
        return prisma.note.update({
            where: { noteId: id },
            data: { deleteFlg: 1 }
        });
    }
}
