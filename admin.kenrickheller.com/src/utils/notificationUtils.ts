import { EnumDisplayConfig, EnumNotiTemplateKey } from 'src/api/models';
import { BASE_WEB_URL } from 'src/constants';

export const getNotificationUrl = (templateKey: string, notificationData: string) => {
  let url: string;
  let extendData;
  switch (templateKey) {
    case EnumNotiTemplateKey.NOTE:
      extendData = JSON.parse(notificationData);
      switch (extendData.functionId) {
        case EnumDisplayConfig.Danh_sach_dat_hang:
          url = `${BASE_WEB_URL}/order-requirement/${extendData.objectId}/view`;
          break;
        default:
          break;
      }
      break;
    case EnumNotiTemplateKey.CREATE_ORDER_REQUIREMENT:
      extendData = JSON.parse(notificationData);
      url = `${BASE_WEB_URL}/order-requirement/${extendData.orderRequirementId}/view`;
      break;
    default:
      break;
  }

  return url;
};
