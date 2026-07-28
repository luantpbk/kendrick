import { ApiService } from './ApiService';

export class InternalApiService {
    public static async getApi(router: string, methodId: number) {
        return ApiService.getApiByRouterAndMethod(router, methodId);
    }

    public static async getFunctions(id: number) {
        return ApiService.getApiFunctions(id);
    }
}
