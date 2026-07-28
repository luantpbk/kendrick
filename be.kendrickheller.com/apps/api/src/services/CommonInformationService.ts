export class CommonInformationService {
    public static async getShipInfo(zipcode: string) {
        // Mock shipping info or query from a parameter table
        return {
            zipcode,
            shippingFee: 0,
            estimatedDays: 3,
            message: "Standard shipping"
        };
    }

    public static async getExchangeRate() {
        return {
            usdToVnd: 24000,
            yenToVnd: 160
        };
    }
}
