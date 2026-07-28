import { ExtendDataModel, PopupList } from 'src/api/models';

export type ProfileInfo = {
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  birthday: string;
  email: string;
  fullName: string;
  loginName: string;
  telephone: string;
  address: string;
  avataUrl: string | null;
};

export type Profile = {
  accessToken: string;
  refreshToken: string;
  info?: ProfileInfo;
};

export interface OptionType {
  values: string[];
  images?: { [key: string]: number[] };
}

export interface OptionExtraType extends OptionType {
  title?: string;
  name: string;
}

export interface CartItemType {
  key?: string;
  productId?: number;
  quantity: number;
  option?: string;
  price?: number;
}

export interface ApplicationState {
  popupList: PopupList;
  profile: Profile;
  reloadFlag: boolean;
  cart: CartItemType[];
  notificationBadge: number;
  room: { roomId: string; extendData?: ExtendDataModel };
  chatUser: number;
  reloadChat: boolean;
}
