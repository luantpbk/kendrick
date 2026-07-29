import { prisma } from '@kendrickheller/core';
import translate from 'google-translate-api-x';
import fs from 'fs';
import path from 'path';

export class TranslationService {
    public static async getAll(
        size: number = 20,
        page: number = 0
    ) {
        const whereClause: any = {
            deleteFlg: 0
        };

        const [total, data] = await Promise.all([
            prisma.translation.count({ where: whereClause }),
            prisma.translation.findMany({
                where: whereClause,
                skip: (page > 0 ? page - 1 : 0) * size,
                take: size,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { count: total, items: data, page, size };
    }

    public static async getById(id: number) {
        return prisma.translation.findUnique({
            where: { translationId: BigInt(id) }
        });
    }

    public static async create(data: any) {
        return prisma.translation.create({
            data: { ...data }
        });
    }

    public static async update(id: number, data: any) {
        return prisma.translation.update({
            where: { translationId: BigInt(id) },
            data: { ...data }
        });
    }

    public static async delete(id: number) {
        return prisma.translation.update({
            where: { translationId: BigInt(id) },
            data: { deleteFlg: 1 }
        });
    }

    public static async autoTranslate(texts: string[]) {
        if (!texts || texts.length === 0) return [];
        
        // Find existing translations
        const existingTranslations = await prisma.translation.findMany({
            where: { code: { in: texts }, deleteFlg: 0 }
        });
        const existingCodes = existingTranslations.map(t => t.code);
        const newTexts = texts.filter(t => !existingCodes.includes(t));
        
        if (newTexts.length === 0) return [];

        const supportedLangs = ['en', 'jp', 'cn', 'fr', 'de', 'it', 'pt', 'et'];
        const results = [];

        for (const text of newTexts) {
            try {
                // We assume the source is 'vi' or auto-detect
                const translationRecord: any = {
                    code: text,
                    vi: text,
                    displayOrder: 1,
                    deleteFlg: 0
                };

                for (const lang of supportedLangs) {
                    try {
                        const targetLang = lang === 'cn' ? 'zh-CN' : lang === 'jp' ? 'ja' : lang;
                        const res = await translate(text, { to: targetLang });
                        translationRecord[lang] = res.text;
                    } catch (e) {
                        console.error(`Failed to translate "${text}" to ${lang}`, e);
                        translationRecord[lang] = text; // fallback to original
                    }
                }

                const saved = await prisma.translation.create({
                    data: translationRecord
                });
                results.push(saved);
            } catch (err) {
                console.error(`Failed to process auto translate for "${text}"`, err);
            }
        }

        // Generate files after auto translate
        await this.generateI18nFile();

        return results;
    }

    public static async generateI18nFile() {
        const translations = await prisma.translation.findMany({
            where: { deleteFlg: 0 }
        });

        const supportedLangs = ['vi', 'en', 'jp', 'cn', 'fr', 'de', 'it', 'pt', 'et'];
        const uploadsDir = process.env.UPLOAD_DIR 
            ? path.join(process.env.UPLOAD_DIR, 'i18n') 
            : path.join(process.cwd(), 'uploads/i18n');
        
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        for (const lang of supportedLangs) {
            const langObj: any = {};
            translations.forEach(item => {
                const val = (item as any)[lang];
                langObj[item.code] = val ? val : item.vi ? item.vi : item.code;
            });

            const langDir = path.join(uploadsDir, lang);
            if (!fs.existsSync(langDir)) {
                fs.mkdirSync(langDir, { recursive: true });
            }

            // Write 'translation' file (without extension because the frontend expects it this way)
            fs.writeFileSync(path.join(langDir, 'translation'), JSON.stringify(langObj, null, 2), 'utf-8');
        }

        return true;
    }
}
