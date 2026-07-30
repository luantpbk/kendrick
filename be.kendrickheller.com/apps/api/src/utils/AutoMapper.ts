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
    public static mapToPrisma<T = any>(
        modelName: string, 
        data: any, 
        isCreate: boolean = false,
        options: { ignoredFields?: string[], customMapping?: Record<string, (val: any) => any> } = {}
    ): T {
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
        
        const ignoredFields = options.ignoredFields || [];
        const customMapping = options.customMapping || {};

        for (const [key, value] of Object.entries(data)) {
            // 1. Check if explicitly ignored
            if (ignoredFields.includes(key)) {
                continue;
            }

            // 2. Check for custom mapping function
            if (customMapping[key]) {
                sanitized[key] = customMapping[key](value);
                continue;
            }

            // Find the corresponding field in the schema
            const field = fields.find(f => f.name === key);

            // 3. Filter out unknown fields (or relations if not an object array)
            if (!field) {
                continue;
            }

            if (field.kind === 'object') {
                if (value !== null && typeof value === 'object') {
                    sanitized[key] = value;
                }
                continue;
            }

            // 4. Handle null/undefined values
            if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
                if (field.isId && field.hasDefaultValue) {
                    continue;
                }
                sanitized[key] = null;
                continue;
            }

            // 5. Type casting based on Prisma schema type
            let parsedValue: any = value;

            if (field.type === 'Int' || field.type === 'Float' || field.type === 'Decimal') {
                if (typeof value === 'string') {
                    if (value.trim() === '') {
                        parsedValue = null;
                    } else {
                        const parsed = Number(value);
                        if (!isNaN(parsed)) {
                            parsedValue = parsed;
                        } else {
                            continue; // Ignore field if invalid number
                        }
                    }
                } else if (typeof value === 'boolean') {
                    parsedValue = value ? 1 : 0;
                }
            } else if (field.type === 'BigInt') {
                if (typeof value === 'string' || typeof value === 'number') {
                    if (typeof value === 'string' && value.trim() === '') {
                        parsedValue = null;
                    } else {
                        try {
                            parsedValue = BigInt(value);
                        } catch (e) {
                            continue; // Ignore field if invalid BigInt
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
                        } else {
                            continue; // Ignore field if invalid Date
                        }
                    }
                }
            } else if (field.type === 'String') {
                if (typeof value === 'object') {
                    // Implicit custom mapping for Object to String (like optionPrice)
                    parsedValue = JSON.stringify(value);
                } else if (typeof value !== 'string') {
                    parsedValue = String(value);
                }
            }

            if (parsedValue === null && field.hasDefaultValue && isCreate) {
                continue; 
            }

            sanitized[key] = parsedValue;
        }

        // 6. Default handles (like deleteFlg)
        if (isCreate) {
            const hasDeleteFlg = fields.some(f => f.name === 'deleteFlg');
            if (hasDeleteFlg && (sanitized.deleteFlg === undefined || sanitized.deleteFlg === null)) {
                sanitized.deleteFlg = 0;
            }
        }

        return sanitized as T;
    }
}
