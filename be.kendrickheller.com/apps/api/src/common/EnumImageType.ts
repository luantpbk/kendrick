export enum EnumImageType {
    ProductRealmImage = 0,
    ProductCategoryImage = 1,
    ProductImage = 2,
    ProductSerialImage = 3,
    Banner = 4,
    CompanyImage = 5,
    Logo = 6,
    AdvertisingBanner = 7,
    Other = 8
}

export const EnumImageTypeMap: Record<number, string> = {
    0: 'product_realm_image',
    1: 'product_category_image',
    2: 'product_image',
    3: 'product_serial_image',
    4: 'banner',
    5: 'company_image',
    6: 'logo',
    7: 'advertising_banner',
    8: 'other'
};
