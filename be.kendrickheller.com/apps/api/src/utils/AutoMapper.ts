import { Prisma } from '@prisma/client';

export class AutoMapper {
    /**
     * Map a raw payload object to a clean Prisma object.
     * This mimics the Java AutoMapper by:
     * 1. Filtering out unknown fields.
     * 2. Automatically casting types (String -> Number/BigInt/Boolean).
     * 3. Handling null/undefined on ID fields (allowing auto-increment to work).
     * 4. Supplying defaults where appropriate (e.g., deleteFlg = 0 on create).
     * 
     * @param modelName The name of the Prisma model (e.g. 'Product', 'ProductCategory')
     * @param data The raw incoming payload
     * @param isCreate Boolean indicating if this is a create operation (to apply create defaults)
     */
    public static mapToPrisma<T = any>(modelName: string, data: any, isCreate: boolean = false): T {
        if (!data || typeof data !== 'object') {
            return data;
        }

        // Get the model metadata from Prisma DMMF (Document Object Model)
        const model = Prisma.dmmf.datamodel.models.find(m => m.name === modelName);
        if (!model) {
            console.warn(`[AutoMapper] Model ${modelName} not found in Prisma Schema. Returning raw data.`);
            return data as T;
        }

        const sanitized: any = {};
        const fields = model.fields;

        for (const [key, value] of Object.entries(data)) {
            // Find the corresponding field in the schema
            const field = fields.find(f => f.name === key);

            // 1. Filter out unknown fields (or relations if not an object array)
            // If the field doesn't exist, we just ignore it (strip it out)
            if (!field) {
                continue;
            }

            // If it's a relation (kind = 'object'), we might want to keep it if it's explicitly formatted for Prisma nested writes.
            // For simplicity, we just pass relation objects through as-is if they are objects.
            if (field.kind === 'object') {
                if (value !== null && typeof value === 'object') {
                    sanitized[key] = value;
                }
                continue;
            }

            // 2. Handle null/undefined values
            // If value is NaN (which serialize to null in JSON, but just in case), handle it
            if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
                // If it's an ID field with autoincrement, we MUST omit it completely so DB generates it
                if (field.isId && field.hasDefaultValue) {
                    continue;
                }
                
                // Otherwise, pass null through (unless it's required, Prisma will throw, which is correct)
                sanitized[key] = null;
                continue;
            }

            // 3. Type casting based on Prisma schema type
            let parsedValue: any = value;

            if (field.type === 'Int' || field.type === 'Float' || field.type === 'Decimal') {
                if (typeof value === 'string') {
                    // Check for empty string
                    if (value.trim() === '') {
                        parsedValue = null;
                    } else {
                        const parsed = Number(value);
                        if (!isNaN(parsed)) {
                            parsedValue = parsed;
                        }
                    }
                } else if (typeof value === 'boolean') {
                    parsedValue = value ? 1 : 0;
                }
            } else if (field.type === 'BigInt') {
                if (typeof value === 'string' || typeof value === 'number') {
                    // Check for empty string
                    if (typeof value === 'string' && value.trim() === '') {
                        parsedValue = null;
                    } else {
                        try {
                            parsedValue = BigInt(value);
                        } catch (e) {
                            // fallback if invalid
                        }
                    }
                } else if (typeof value === 'boolean') {
                    parsedValue = BigInt(value ? 1 : 0);
                }
            } else if (field.type === 'Boolean') {
                if (typeof value === 'string') {
                    parsedValue = value.toLowerCase() === 'true' || value === '1';
                } else if (typeof value === 'number') {
                    parsedValue = value === 1;
                }
            } else if (field.type === 'DateTime') {
                if (typeof value === 'string') {
                    if (value.trim() === '') {
                        parsedValue = null;
                    } else {
                        const date = new Date(value);
                        if (!isNaN(date.getTime())) {
                            parsedValue = date;
                        }
                    }
                }
            } else if (field.type === 'String') {
                if (typeof value !== 'string' && typeof value !== 'object') {
                    parsedValue = String(value);
                }
            }

            // If it was meant to be casted to a number but resulted in null because it was empty,
            // and the field is required, we should let Prisma throw, or omit it. 
            // Prisma expects omitted fields if it has a default. We will just set it to null.
            if (parsedValue === null && field.hasDefaultValue && isCreate) {
                continue; // omit so it gets the default
            }

            sanitized[key] = parsedValue;
        }

        // 4. Default handles (like deleteFlg)
        if (isCreate) {
            const hasDeleteFlg = fields.some(f => f.name === 'deleteFlg');
            if (hasDeleteFlg && (sanitized.deleteFlg === undefined || sanitized.deleteFlg === null)) {
                sanitized.deleteFlg = 0; // Default to 0
            }
        }

        return sanitized as T;
    }
}
