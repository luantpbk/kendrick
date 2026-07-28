export enum EnumFileType {
    Image = 1,
    Document = 2,
    Audio = 3,
    Video = 4,
    Other = 5
}

export const EnumFileTypeMap: Record<number, string> = {
    1: 'images',
    2: 'documents',
    3: 'audios',
    4: 'videos',
    5: 'other'
};
