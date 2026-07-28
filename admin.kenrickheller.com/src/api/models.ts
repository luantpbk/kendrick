export type StatisticType = 'price' | 'supply' | 'marketcap';

export type OptionType = {
  title: string;
  value: any;
  css?: any;
};

export enum EnumDataType {
  Text = 1,
  Int = 2,
  Date = 3,
  PhoneNumber = 4,
  Email = 5,
  Boolean = 6,
  Percentage = 7,
  BigInt = 8,
  JPY = 9,
  Month = 10,
  QuarterOfYear = 11,
  Year = 12,
  DateRange = 13,
  Image = 14,
  Option = 15,
  HTML = 16,
  Ratio = 17,
  Link = 18,
  Decimal = 19,
  USD = 20,
}

export type PopupContent = {
  txn?: {
    success: boolean;
    summary?: string;
  };
  error?: {
    message: string;
    title: string;
  };
  context?: {
    width?: string;
    height?: string;
    listActionButton: EventButton[];
    posX?: string;
    posY?: string;
  };
};

export type PopupList = Array<{
  key: string;
  //show: boolean;
  content: PopupContent;
  removeAfterMs: number | null;
}>;

export type ProfileInfo = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  birthday?: string;
  email?: string;
  fullName?: string;
  loginName?: string;
  telephone?: string;
  avata?: string;
  avataUrl?: string;
  password?: string;
  displayOrder?: number;
  groupId?: number;
  langId?: number;
  currentPassword?: string;
  confirmPassword?: string;
  mainAddress?: string;
  facebookId?: string;
  googleId?: string;
  appleId?: string;
  twitterId?: string;
  cmtnd?: string;
  cccd?: string;
  mobile?: string;
  sex?: null;
  occupation?: null;
  fbAccessToken?: string;
  googleAccessToken?: string;
  appleAccessToken?: string;
  cover?: string;
  loginNameHash?: string;
  refreshToken?: null;
  otp?: string;
};

export type Profile = {
  accessToken: string;
  refreshToken: string;
  info?: ProfileInfo;
};

export type PageData<T> = {
  count: number;
  items: T[];
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

export type NfcUser = {
  title: string;
  description: string;
  company: string;
  birthday: number;
  displayOrder: number;
};

export type NfcChannel = {
  nfcChannelId?: number;
  channelTypeId: number;
  personalUrl: string;
  displayOrder: number;
};

export type NfcInfo = {
  nfcId: number;
  nfcKey: string;
  thumbAvatar: string;
  nfcUser: NfcUser;
  nfcChannels: NfcChannel[];
};

export type RealmType = {
  productRealmId?: number;
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
  name?: string;
  icon: string;
  actionType: EnumAction;
  action?: (...args: any[]) => any;
  buttonClass?: string;
  align: string;
  file?: boolean;
};

//Category
export type ProductCategoryAttributeType = {
  productCategoryId?: number;
  attributeTitle?: string;
  attributeName?: string;
  isShowProduct?: number;
  isShowProductSerial?: number;
  isShowProductSerialDetail?: number;
  attribute?: ProductAttributeResultType;
};

export type ProductAttributeResultType = {
  attributeTitle?: string;
  attributeName?: string;
  attributeType?: number;
};

export type ProductCategoryType = {
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
  productId?: number;
  productCategory?: ProductCategoryType;
  productCategoryId?: number;
  productCode?: string;
  productName?: string;
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
  stopSelling?: boolean;
  hot?: boolean;
  optionPrice?: { [key: string]: number };
};

export enum EnumProductSerialStatus {
  Stocking = 1,
  Sold = 2,
}

export type ImageType = {
  fileId: number;
  fileTypeId: number;
  fileName: string;
  fileUrl: string;
  thumbUrl: string;
};

export type ProductGiftType = {
  productGiftId?: number;
  productId: number;
  productGiftValue: string;
};

//Product Serial
export type ProductSerialType = {
  productSerialId?: number;
  productId?: number;
  productCode?: string;
  productName?: string;
  option3?: string;
  price?: number;
  price2?: number;
  phoneNumber?: number;
  description1?: string;
  description2?: string;
  description3?: string;
  description4?: string;
  html1?: string;
  html2?: string;
  option1?: string;
  option2?: string;
  status?: number;
  thumbAvatar?: string;
  avatar?: string;
  images?: ImageType[];
  effectiveDate?: string;
  expirationDate?: string;
  displayOrder?: number;
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
};

//Company info
export type CompanyInfoType = {
  companyInfoId: number;
  companyInfoKey: string;
  companyInfoTitle: string;
  companyInfoValue: string;
  href?: string;
  displayOrder?: number;
};

//Static page
export type StaticPageType = {
  staticPageId: number;
  staticPageKey: string;
  staticPageTitle: string;
  vi: string;
  en: string;
  jp: string;
  de: string;
  fr: string;
  cn: string;
  it: string;
  pt: string;
  et: string;
  description: string;
  displayOrder?: number;
};

//Guide Page
export type GuidePageType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  guidePageId?: number;
  guidePageKey?: string;
  guidePageTitle?: string;
  guidePageValue?: string;
  description?: string;
  guideAvatar?: string;
};

//Order requirement
export enum EnumReceiveTime {
  Any = 1,
  Morning = 2,
  Twelve_Fifteen = 3,
  Fifteen_Eightteen = 4,
  Eightteen_TwentyOne = 5,
}

export enum EnumReceiveTimeTitle {
  Any = 'Giờ bất kì',
  Morning = 'Trong buổi sáng',
  Twelve_Fifteen = '12h-15h',
  Fifteen_Eightteen = '15h-18h',
  Eightteen_TwentyOne = '18h-21h',
}

export type OrderRequirementDetailsItemType = {
  orderRequirementDetailId?: number;
  productSerialId?: number;
  productSerial?: ProductSerialType;
  productId?: number;
  quantity?: number;
  product?: ProductType;
  price?: number;
  extraAmount?: number;
};

//TODO
export enum EnumOrderRequirementProgressStatus {
  Waiting = 1,
  Sent = 2,
  Received = 3,
  Error = 4,
}

//TODO
export enum EnumOrderRequirementProgressStatusTitle {
  Waiting = 'Chờ gửi',
  Sent = 'Đã gửi',
  Received = 'Đã nhận',
  Error = 'Lỗi gửi',
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
  discount?: number;
  receiverTime1?: EnumReceiveTime;
  receiverDate1?: string;
  receiverTime2?: EnumReceiveTime;
  receiverDate2?: string;
  trackingCode?: string;
  orderRequirementNote?: string;
  paymentMethod?: number;
  progressStatus?: EnumOrderRequirementProgressStatus;
  orderRequirementDetails?: OrderRequirementDetailsItemType[];
};

//News
export type NewsType = {
  newId?: number;
  newAvatar?: string;
  newTitle?: string;
  newValue?: string;
  description?: string;
  displayOrder?: number;
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

//Customer type
export type BusinessType = {
  businessType: number;
  businessTypeTitle: string;
};

export type CustomerType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  customerTypeId?: number;
  customerTypeCode?: string;
  customerTypeTitle?: string;
  feePercent?: number;
  salesTarget?: number;
  discountPercent?: number;
};

export type UserCustomerType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  userCustomerTypeId?: number;
  customerTypeId?: number;
  userId?: number;
  businessType?: number;
  businessTypeTitle?: string;
  effectiveDate?: string;
  customerType?: CustomerType;
  user?: ProfileInfo;
};

//Module
export type ModuleType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  functionId?: number;
  moduleId?: number;
  moduleName?: string;
  description?: string;
};

//Function
export type FunctionType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  functionId?: number;
  moduleId?: number;
  functionName?: string;
  description?: string;
};

//Role
export type RoleType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  roleId?: number;
  roleName?: string;
  roleType?: number;
  description?: string;
};

export enum EnumActionType {
  View = 1,
  Add = 2,
  Edit = 4,
  Delete = 8,
  Confirm = 16,
  All = 32,
}

export type RolePermisionType = {
  roleId?: number;
  functionId?: number;
  permision?: number;
  actions?: {
    View?: boolean;
    Add?: boolean;
    Confirm?: boolean;
    Edit?: boolean;
    Delete?: boolean;
  };
};

//API service
export enum EnumHttpMethod {
  GET = 1,
  POST = 2,
  PUT = 3,
  DELETE = 4,
}

export type ApiType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  apiId?: number;
  router?: string;
  methodId?: EnumHttpMethod;
  actionTypeId?: EnumActionType;
};

export type MapApiType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  apiId?: number;
  functionId?: number;
};

//Display
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
  AdvertisingBanner = 29,
  PrintedTemplate = 30,
}

export enum EnumModuleId {
  SYSTEM = 1,
  WEB = 2,
  SIM = 3,
}
export const DataTypeList = [
  {
    value: EnumDataType.BigInt,
    title: 'BigInt',
  },
  {
    value: EnumDataType.Boolean,
    title: 'Boolean',
  },
  {
    value: EnumDataType.Date,
    title: 'Date',
  },
  {
    value: EnumDataType.DateRange,
    title: 'DateRange',
  },
  {
    value: EnumDataType.Decimal,
    title: 'Decimal',
  },
  {
    value: EnumDataType.Email,
    title: 'Email',
  },
  {
    value: EnumDataType.HTML,
    title: 'HTML',
  },
  {
    value: EnumDataType.Image,
    title: 'Image',
  },
  {
    value: EnumDataType.Int,
    title: 'Int',
  },
  {
    value: EnumDataType.JPY,
    title: 'JPY',
  },
  {
    value: EnumDataType.Link,
    title: 'Link',
  },
  {
    value: EnumDataType.Month,
    title: 'Month',
  },
  {
    value: EnumDataType.Option,
    title: 'Option',
  },
  {
    value: EnumDataType.Percentage,
    title: 'Percentage',
  },
  {
    value: EnumDataType.PhoneNumber,
    title: 'PhoneNumber',
  },
  {
    value: EnumDataType.QuarterOfYear,
    title: 'QuarterOfYear',
  },
  {
    value: EnumDataType.Ratio,
    title: 'Ratio',
  },
  {
    value: EnumDataType.Text,
    title: 'Text',
  },
  {
    value: EnumDataType.USD,
    title: 'USD',
  },
  {
    value: EnumDataType.Year,
    title: 'Year',
  },
];

export type HtmlSimpleParameterType = {
  parameterName: string;
  description?: string;
  dataType: EnumDataType;
};

export type HtmlColumnsType = {
  columnTitle?: string;
  columnName?: string;
  dataType?: EnumDataType;
  columnCss?: string;
  cellCss?: string;
};

export type HtmlTableParameterType = {
  tableName?: string;
  columns: HtmlColumnsType[];
  tableCss?: string;
  rowCss?: string;
};

export type EmailTemplateType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  emailTemplateId?: number;
  emailTemplateKey?: string;
  emailTemplateTitle?: string;
  emailTemplateValue?: string;
  emailSimpleParameter?: HtmlSimpleParameterType[];
  emailTableParameter?: HtmlTableParameterType[];
  description?: string;
};

//Printed Template
export type PrintedTemplateType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  printedTemplateId?: number;
  printedTemplateKey?: string;
  printedTemplateTitle?: string;
  printedTemplateValue?: string;
  printedSimpleParameter?: HtmlSimpleParameterType[];
  printedTableParameter?: HtmlTableParameterType[];
  description?: string;
};

export type NotificationTemplateType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  notificationTemplateId?: number;
  notificationTemplateKey?: string;
  notificationTemplateTitle?: string;
  vi: string;
  en: string;
  jp: string;
  de: string;
  fr: string;
  cn: string;
  it: string;
  pt: string;
  et: string;
  notificationParameter?: HtmlSimpleParameterType[];
  description?: string;
};

//Note
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

export type EmailType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  emailId?: number;
  emailTemplateId?: number;
  emailTemplateKey?: string;
  emailTitle?: string;
  emailValue?: string;
  receiver?: string;
  description?: string;
};

//send sim price to user
export type SendSimPriceToUserType = {
  fromDate: string;
  userIds: number[];
};

//Noti
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

export type FirebaseTokenType = {
  firebaseTokenId: number;
  userName: string;
  deviceId: string;
  firebaseToken: string;
};

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

//Parameter
export enum EnumParameterDataType {
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
}

export type ParameterEnumType = {
  parameterTitle?: string;
  parameterKey?: string;
  dataType?: EnumParameterDataType;
};

export type ParameterType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  parameterId?: number;
  parameterTitle?: string;
  parameterKey?: string;
  parameterValue?: string;
  effectiveDate?: string;
};

//Account balance
export type AccountBalanceType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  accountHistoryId?: number;
  userId?: number;
  accountActionType?: number;
  moneyAmount?: number;
  note?: string;
  accountActionTitle?: string;
  coefficient?: number;
  data?: string;
};

export type AccountBalanceMoneyType = {
  userId: number;
  moneyAmount: number;
  note?: string;
};

export type AccountBalanceListType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  userId?: number;
  moneyAmount?: number;
  user?: ProfileInfo;
};

//PurchaseAccount
export type PurchaseAccountType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  purchaseAccountId?: number;
  userId?: number;
  userName?: string;
  email?: string;
  purchasePage?: string;
  accountName?: string;
  accountPassword?: string;
  description?: string;
  note?: string;
};

//Store
export type StoreType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  storeId?: number;
  storeCode?: string;
  storeTitle?: string;
  longitude?: number;
  latitude?: number;
};

//Address
export type ShipInfoType = {
  pref: string;
  city: string;
  town: string;

  distance: number;
  shipFee: number;
};

//Excel
export enum EnumDuplicateAction {
  Ignore = 1,
  Update = 2,
  Error = 3,
}

export type ImportExcelDataType = {
  sheetName: string;
  fromRowNum: number;
  toRowNum: number;
  duplicateAction: EnumDuplicateAction;
};

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
};

export type MessageType = {
  messageId: number;
  roomId: string;
  userId: number;
  messageValue: string;
  messageType: number;
};

export type TranslationType = {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
  translationId?: number;
  code?: string;
  vi?: string;
  en?: string;
  jp?: string;
  fr?: string;
  de?: string;
  cn?: string;
  it?: string;
  et?: string;
  pt?: string;
};
