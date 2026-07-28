export type StatisticType = 'price' | 'supply' | 'marketcap';

export type PopupContent = {
  txn?: {
    success: boolean;
    summary?: string;
  };
  error?: {
    message: string;
    title: string;
  };
  confirm?: {
    width?: string;
    height?: string;
    question: string;
    listActionButton: EventButton[];
    posX?: string;
    posY?: string;
  };
  context?: {
    width?: string;
    height?: string;
    listActionButton: EventButton[];
    posX?: string;
    posY?: string;
  };
};

export interface ExtendDataModel {
  functionId?: number;
  objectId?: number;
  url?: string;
  name: string;
  description?: string;
  message?: string;
}

export type PopupList = Array<{
  key: string;
  //show: boolean;
  content: PopupContent;
  removeAfterMs: number | null;
}>;

export enum EnumDataType {
  Text = 1,
  Int = 2,
  Date = 3,
  PhoneNumber = 4,
  Email = 5,
  Boolean = 6,
  Percentage = 7,
  BigInt = 8,
  Decimal = 9,
  Month = 10,
  QuarterOfYear = 11,
  Year = 12,
  DateRange = 13,
  Image = 14,
  Option = 15,
  HTML = 16,
}

export type PageData<T> = {
  count: number;
  items: T[];
};

export type CountryType = {
  countryId: number;
  countryName: string;
};

export type RealmType = {
  productRealmId: number;
  productRealmCode: string;
  productRealmName: string;
  displayOrder?: number;
  isHidden?: boolean;
  description?: string;
};

export type ChannelTypeInfo = {
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  displayOrder: number;
  channelTypeId: number;
  channelName: string;
  icon: string;
  channelUrl: string;
};

export enum EnumAction {
  View,
  Delete,
  Edit,
  Add,
  Confirm,
  Cancel,
}

export enum EnumFilter {
  all = '',
  stocking = '1',
  outOfStock = '2',
}

export type EventButton = {
  name: string;
  icon: string;
  actionType: EnumAction;
  action: (...args: any[]) => any;
  buttonClass: string;
  align: string;
};

//Category
export type CategoryAttributeType = {
  productCategoryAttributeId?: number;
  productCategoryId: number;
  attributeTitle: string;
  attributeName: string;
  attribute: AttributeType;
  isShowProduct: number;
  isShowProductSerial: number;
  isShowProductSerialDetail: number;
};

export type AttributeType = {
  attributeTitle?: string;
  attributeName?: string;
  attributeType?: number;
};

export type CategoryType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  productCategoryId?: number;
  productRealmId?: number;
  productCategoryCode?: string;
  productCategoryName?: string;
  thumbAvatar?: string;
  avatar?: string;
  productRealm?: RealmType;
};

//Product
export type ProductType = {
  productId: number;
  productCategoryId: number;
  productCode: string;
  productName: string;
  price?: number;
  price2?: number;
  description1?: string;
  description2?: string;
  description3?: string;
  description4?: string;
  html1?: string;
  html2?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  thumbAvatar?: string;
  avatar?: string;
  images?: ImageType[];
  introContent?: string;
  discountPercent?: number;
  displayOrder?: number;
  isHiddenSerial?: boolean;
  optionPrice?: { [key: string]: number };
};

export type ImageType = {
  fileId?: number;
  fileTypeId?: number;
  fileName?: string;
  fileUrl?: string;
  thumbUrl?: string;
};

//Company info
export type CompanyInfoType = {
  companyInfoId: number;
  companyInfoKey: string;
  companyInfoTitle: string;
  companyInfoValue: string;
  href: string;
};

export interface IDataBodyItem {
  keyword: string;
  page: number;
  size: number;
  title: string;
  listRealmIds?: number[];
  listCategoryIds?: number[];
  isHot?: boolean;
}

//Static page
export type StaticPageType = {
  staticPageId: number;
  staticPageKey: string;
  staticPageTitle: string;
  description: string;
  vi: string;
  en: string;
  jp: string;
  de: string;
  fr: string;
  cn: string;
  it: string;
  pt: string;
  et: string;
};

export type ProductGiftType = {
  productGiftId?: number;
  productId: number;
  productGiftValue: string;
};

//Order requirement
export type OrderRequirementDetailsItemType = {
  orderRequirementDetailId?: number;
  productId?: number;
  product?: ProductType;
  quantity?: number;
  price?: number;
  option?: string;
};

export enum EnumOrderRequirementProgressStatus {
  Unpaid = 1,
  Paid = 2,
  Shipping = 3,
  Done = 4,
  Error = 5,
}

export type OrderRequirementType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  orderRequirementId?: number;
  userId?: number;
  userName?: string;
  receiverFullname?: string;
  receiverPhoneNumber?: string;
  receiverZipCode?: string;
  receiverAddress1?: string;
  receiverAddress2?: string;
  receiverAddress3?: string;
  receiverAddress4?: string;
  receiverFacebook?: string;
  receiverZalo?: string;
  distance?: number;
  shipFee?: number;
  trackingCode?: string;
  orderRequirementNote?: string;
  paymentMethod?: number;
  progressStatus?: EnumOrderRequirementProgressStatus; //TODO
  orderRequirementDetails?: OrderRequirementDetailsItemType[];
};

//News
export type NewsType = {
  displayOrder?: number;
  newId?: number;
  newAvatar?: string;
  newTitle?: string;
  newValue?: string;
  description?: string;
  commentLength?: number;
};

//Comment
export type CommentType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  commentId?: number;
  newId?: number;
  parentId?: number;
  commentValue?: string;
  commentLength?: number;
  avataUrl?: string;
  fullName?: string;
};

//Service
export type ServiceType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  serviceId?: number;
  serviceCode?: string;
  serviceName?: string;
  staticPageKey?: string;
};

//Tracking
export type TrackingStatusType = {
  trackingID?: string;
  statusName?: string;
  note?: string;
  date?: string;
};

export type TrackingDetailType = {
  trackingID?: string;
  statusID?: number;
  statusName?: string;
  status?: boolean;
};

export type TrackingType = {
  status?: number;
  message?: string;
  content?: {
    trackingDetail?: TrackingDetailType[];
    trackingStatus?: TrackingStatusType[];
  };
};

//Address
export type ShipInfoType = {
  pref: string;
  city: string;
  town: string;

  distance: number;
  shipFee: number;
};

//Receiver info
export type ReceiverInfoType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  receiverInfoId?: number;
  userId?: number;
  fullname?: string;
  phoneNumber?: string;
  zipCode?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  facebook?: string;
  zalo?: string;
  defaultFlg?: number;
};

//Change password
export type ChangePasswordResult = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  userId?: number;
  birthday?: string;
  email: string;
  fullName?: string;
  groupId?: number;
  langId?: number;
  loginName?: string;
  password?: string;
  currentPassword?: string;
  confirmPassword?: string;
  telephone?: string | number;
  mainAddress?: string;
  facebookId?: string;
  googleId?: string;
  twitterId?: string;
  cmtnd?: null;
  cccd?: null;
  mobile?: null;
  avata?: null;
  avataUrl?: string;
  sex?: string;
  occupation?: string;
  fbAccessToken?: string;
  googleAccessToken?: string;
  cover?: string;
  loginNameHash?: string;
  refreshToken?: string;
};

//Notification
export enum EnumNotificationStatus {
  Wait = 0,
  Seen = 1,
  Read = 2,
}

export enum EnumNotiTemplateKey {
  REPORT_SIM_ERROR = 'REPORT_SIM_ERROR',
  STOP_SERVICE = 'STOP_SERVICE',
  NOTE = 'NOTE',
  CREATE_PRODUCT_ORDER = 'CREATE_PRODUCT_ORDER',
  CREATE_SHIP_ORDER = 'CREATE_SHIP_ORDER',
  UPDATE_PRODUCT_ORDER = 'UPDATE_PRODUCT_ORDER',
  UPDATE_SHIP_ORDER = 'UPDATE_SHIP_ORDER',
  CREATE_ORDER_REQUIREMENT = 'CREATE_ORDER_REQUIREMENT',
  CHAT = 'CHAT',
}

export type NotificationType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  notificationId?: number;
  notificationTitle?: string;
  notificationValue?: string;
  receiverId?: number;
  notificationTemplateId?: number;
  notificationTemplateKey?: EnumNotiTemplateKey;
  status?: EnumNotificationStatus;
  fullName?: string;
  avataUrl?: string;
  notificationData?: string;
};

export type MyNotificationType = {
  data: PageData<NotificationType>;
  badge: number;
};

export enum EnumDisplayConfig {
  Loai_san_pham = 2,
  Danh_muc_san_pham = 3,
  San_pham = 4,
  Dich_vu = 5,
  Banner = 6,
  Logo = 7,
  Thong_tin = 8,
  Hinh_anh_cong_ty = 9,
  Trang_thong_tin_tinh = 10,
  Danh_sach_dat_hang = 11,
  Tin_tuc = 12,
  Quan_ly_tai_khoan = 1,
  Cau_hinh_phan_quyen = 21,
  Phan_quyen = 22,
  Sim_order = 13,
  Sim_da_ban = 14,
  Lich_su_bang_gia = 23,
  Mau_email = 24,
  Cong_no = 25,
  ProductOrder = 26,
  ShipOrder = 27,
  PurchaseAccount = 28,
}

//Note
export type NoteByDay = {
  createdAt: string;
  list: NoteType[];
};

export type NoteType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  noteId?: number;
  userId?: number;
  functionId?: number;
  objectId?: number;
  noteContent?: string;
  avataUrl?: string;
  fullName?: string;
};

export interface LooseObject {
  [key: string]: any;
}

export type RoomUserType = {
  roomId: string;
  userId: number;
  fullName: string;
  avatarUrl: string;
  status: number;
};

export enum EnumChatStatus {
  Waiting = 0,
  Sent = 1,
}

export type RoomType = {
  roomId: string;
  roomName: string;
  roomType: number;
  roomUsers: RoomUserType[];
  isCollapse?: boolean;
  extendData?: ExtendDataModel;
};

export type MessageType = {
  messageId: number;
  roomId: string;
  userId: number;
  messageValue: string;
  messageType: number;
};
