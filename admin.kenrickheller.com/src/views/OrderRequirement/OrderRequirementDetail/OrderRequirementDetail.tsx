import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetShipInfoByZipcode } from 'src/api/commonInfomationApi';
import {
  EnumAction,
  EnumDisplayConfig,
  EnumOrderRequirementProgressStatus,
  EnumOrderRequirementProgressStatusTitle,
  EnumProductSerialStatus,
  EnumReceiveTime,
  EnumReceiveTimeTitle,
  EventButton,
  OrderRequirementDetailsItemType,
  OrderRequirementType,
  ProductType,
  ProfileInfo,
} from 'src/api/models';
import {
  useGetOrderRequirementById,
  usePostOrderRequirementForAdmin,
  usePostOrderRequirementForCollaborator,
  usePutOrderRequirementForAdmin,
  usePutOrderRequirementForCollaborator,
} from 'src/api/orderRequirementApi';
import { useGetQRCode } from 'src/api/qrApi';
import { ADMIN, SALE } from 'src/common/constant/Constant';
import OrderRequirementPreviewComponent from 'src/components/OrderRequirementPreviewComponent/OrderRequirementPreviewComponent';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { BASE_WEB_URL } from 'src/constants';
import { useAddPopup } from 'src/state/application/hooks';
import './OrderRequirementDetail.css';
import { normalizationZipcode } from 'src/utils/stringUtils';
import { EnumViewType } from 'src/common/enum/EnumViewType';
import Input from 'src/components/Input';
import SelectBoxComponent from 'src/components/SelectBoxComponent/SelectBoxComponent';
import Note from '../../../components/Note/Note';
import ContactList from 'src/components/ContactList/ContactList';
import ButtonComponent from 'src/components/ButtonComponent/ButtonComponent';
import ProductList from 'src/components/ProductList/ProductList';
import { useGetProductSerial } from 'src/api/productSerialApi';
import useModal from 'src/hooks/useModal';
import QRCode from 'src/components/QRCode/QRCode';
import useProfile from 'src/hooks/useProfile';

interface IOrderRequirementDetail {
  orderRequirementId?: number;
  isDisable?: boolean;
  isSlide?: boolean;
  isPopup?: boolean;
  isAdmin?: boolean;
  postProcess?: (...args: any[]) => void;
}

const OrderRequirementDetail: React.FC<IOrderRequirementDetail> = (props) => {
  const lstStatus = [
    {
      value: EnumOrderRequirementProgressStatus.Waiting,
      title: EnumOrderRequirementProgressStatusTitle.Waiting,
      css: { color: '#3a3131' },
    },
    {
      value: EnumOrderRequirementProgressStatus.Sent,
      title: EnumOrderRequirementProgressStatusTitle.Sent,
      css: { color: 'blue' },
    },
    {
      value: EnumOrderRequirementProgressStatus.Received,
      title: EnumOrderRequirementProgressStatusTitle.Received,
      css: { color: 'green' },
    },
    {
      value: EnumOrderRequirementProgressStatus.Error,
      title: EnumOrderRequirementProgressStatusTitle.Error,
      css: { color: 'red' },
    },
  ];

  const params = useParams<{ role: string; type: string; orderRequirementId: string }>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [orderRequirementId, setOrderRequirementId] = useState<number>();
  const [orderRequirement, setOrderRequirement] = useState<OrderRequirementType>();
  const [isDisable, setIsDisable] = useState(true);

  const navigate = props.isSlide || props.isPopup ? undefined : useNavigate();
  const profile = useProfile();

  const [createdAt, setCreateAt] = useState<string>();
  const [userId, setUserId] = useState<number>();
  const [userIdError, setUserIdError] = useState<string>();
  const [receiverFullname, setReceiverFullname] = useState<string>();
  const [receiverFullnameError, setReceiverFullnameError] = useState<string>();
  const [receiverPhoneNumber, setReceiverPhoneNumber] = useState<string>();
  const [receiverFacebook, setReceiverFacebook] = useState<string>();
  const [receiverZalo, setReceiverZalo] = useState<string>();
  const [orderRequirementNote, setOrderRequirementNote] = useState<string>();
  const [iconX, setIconX] = useState(0);
  const [iconY, setIconY] = useState(0);
  const [discount, setDiscount] = useState<number>();

  const receiveTimes = [
    {
      value: EnumReceiveTime.Any,
      title: EnumReceiveTimeTitle.Any,
    },
    {
      value: EnumReceiveTime.Morning,
      title: EnumReceiveTimeTitle.Morning,
    },
    {
      value: EnumReceiveTime.Twelve_Fifteen,
      title: EnumReceiveTimeTitle.Twelve_Fifteen,
    },
    {
      value: EnumReceiveTime.Fifteen_Eightteen,
      title: EnumReceiveTimeTitle.Fifteen_Eightteen,
    },
    {
      value: EnumReceiveTime.Eightteen_TwentyOne,
      title: EnumReceiveTimeTitle.Eightteen_TwentyOne,
    },
  ];

  const [progressStatus, setProgressStatus] = useState<EnumOrderRequirementProgressStatus>(
    EnumOrderRequirementProgressStatus.Waiting,
  );

  const [orderRequirementDetail, setOrderRequirementDetail] = useState<
    OrderRequirementDetailsItemType[]
  >([]);
  const [userName, setUserName] = useState<string>();
  const [isShowUserList, setIsShowUserList] = useState(false);
  const [isChooseProduct, setChooseProduct] = useState(false);
  //End of state

  //Function
  const addPopup = useAddPopup();
  const getOrderRequirementById = useGetOrderRequirementById();
  const putOrderRequirementForAdmin = usePutOrderRequirementForAdmin();
  const postOrderRequirementForAdmin = usePostOrderRequirementForAdmin();
  const putOrderRequirementForCollaborator = usePutOrderRequirementForCollaborator();
  const postOrderRequirementForCollaborator = usePostOrderRequirementForCollaborator();

  const getProductSerial = useGetProductSerial();
  const getShipInfo = useGetShipInfoByZipcode();

  const qrModal = useModal(QRCode);

  useEffect(() => {
    setOrderRequirementId(props.orderRequirementId || Number(params.orderRequirementId));
    setIsDisable(Number(params.type) == EnumViewType.View || props.isDisable);
    setIsAdmin(params.role == ADMIN || props.isAdmin);
    if (!props.orderRequirementId) setUserId(profile.info.userId);
  }, [
    props.orderRequirementId,
    params.orderRequirementId,
    props.isDisable,
    params.type,
    props.isAdmin,
    params.role,
    profile.info.userId,
  ]);

  const onChangeEditMode = (e: MouseEvent) => {
    navigate(
      `${BASE_WEB_URL}/order-requirement/${isAdmin ? ADMIN : SALE}/${orderRequirementId}/${
        EnumViewType.Edit
      }`,
    );
  };

  //Validate
  const validateReceiverFullname = () => {
    setReceiverFullnameError(
      receiverFullname && receiverFullname != '' ? undefined : 'Chưa nhập tên người nhận hàng',
    );
    return receiverFullname && receiverFullname != '';
  };

  const calcTotal = () => {
    let sum = 0;
    if (orderRequirementDetail) {
      orderRequirementDetail.forEach((detail) => {
        sum +=
          (Number(detail.price ?? 0) + Number(detail.extraAmount ?? 0)) *
          Number(detail.quantity ?? 0);
      });
    }
    sum -= Number(discount ?? 0);
    return sum;
  };

  //Validate
  const validateUserId = () => {
    let isContinue = true;

    if (!userId) {
      isContinue = false;
      setUserIdError('Chưa chọn người đặt hàng');
    } else setUserIdError(null);

    return isContinue;
  };

  //TODO
  const onSave = () =>
    new Promise((resolve, reject) => {
      const isReceiverFullname = validateReceiverFullname();
      const isUserId = validateUserId();
      if (isReceiverFullname && isUserId) {
        const orderRequirement: OrderRequirementType = {
          orderRequirementId: orderRequirementId,
          userId: userId,
          receiverFullname: receiverFullname,
          receiverPhoneNumber: receiverPhoneNumber,
          receiverFacebook: receiverFacebook,
          receiverZalo: receiverZalo,
          orderRequirementNote: orderRequirementNote,
          progressStatus: progressStatus,
          discount: discount,
          orderRequirementDetails: orderRequirementDetail,
        };
        if (calcTotal() < 0) {
          addPopup({
            error: {
              title: 'Hóa đơn không hợp lệ',
              message: 'Tổng tiền không hợp lệ. Vui lòng kiểm tra lại',
            },
          });
          reject(false);
          return;
        }
        const api = orderRequirementId
          ? isAdmin
            ? putOrderRequirementForAdmin
            : putOrderRequirementForCollaborator
          : isAdmin
          ? postOrderRequirementForAdmin
          : postOrderRequirementForCollaborator;
        api(orderRequirement)
          .then((res) => {
            setOrderRequirementId(res.orderRequirementId);
            addPopup({
              txn: {
                success: true,
                summary: orderRequirementId ? 'Sửa đơn thành công' : 'Tạo đơn hàng thành công',
              },
            });
            if (props.postProcess) props.postProcess(res);
            resolve(true);
          })
          .catch((error) => {
            addPopup({
              error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
            });
            reject(false);
          });
      } else {
        addPopup({
          txn: {
            success: false,
            summary: 'Chưa nhập đủ thông tin',
          },
        });
        reject(false);
      }
    });

  const onShowQRCode = (url: string) => {
    if (url?.length > 0)
      qrModal.handlePresent(
        {
          url: url,
        },
        'ZALO',
      );
  };

  const openLink = (url: string) => {
    window.open(url);
  };

  useEffect(() => {
    if (orderRequirementId) {
      getOrderRequirementById(orderRequirementId)
        .then((data) => {
          setOrderRequirement(data);
          setProgressStatus(data.progressStatus);
          setCreateAt(data.createdAt);
          setUserId(data.userId);
          setUserName(data.userName);
          setOrderRequirementDetail(data.orderRequirementDetails);
          setReceiverFullname(data.receiverFullname);
          setReceiverPhoneNumber(data.receiverPhoneNumber);
          setReceiverFacebook(data.receiverFacebook);
          setReceiverZalo(data.receiverZalo);
          setDiscount(data.discount);
          setOrderRequirementNote(data.orderRequirementNote);
        })
        .catch((error) => {
          console.log('order requirement tab error');
          console.log(error);
          addPopup({
            error: {
              title: 'Đã có lỗi xảy ra',
              message: error.errorMessage,
            },
          });
        });
    }
  }, [addPopup, getOrderRequirementById, orderRequirementId]);

  //Toolbar
  const listButton: EventButton[] = [
    {
      name: 'Sửa',
      icon: 'edit',
      actionType: EnumAction.View,
      buttonClass: 'info100 tool-btn',
      action: onChangeEditMode,
      align: 'center',
    },
  ];

  //Main
  return (
    <>
      {props.isSlide || props.isPopup ? null : (
        <ToolBar
          toolbarName={`${userName} - ${createdAt}`}
          listRightButton={isDisable ? listButton : []}
          width={'100%'}
          backgroundColor={'#ebe9e9'}
          isPaging={false}
          isBack={true}
        />
      )}
      <div className={`order-requirement-container ${props.isPopup ? 'popup' : ''}`}>
        {isAdmin && (
          <div className="order-requirement-row">
            <Input
              width="320px"
              title="Người đặt hàng"
              require={true}
              disabled={isDisable}
              value={userName}
              error={userIdError}
            />
            {!isDisable && (
              <div className="i-tooltip order-guide">
                <span
                  className="material-icons info-guide"
                  onClick={() => setIsShowUserList(true)}
                  ref={(el) => {
                    if (el) {
                      const boundingClient = el.getBoundingClientRect();
                      setIconX(boundingClient.left);
                      setIconY(
                        boundingClient.y +
                          boundingClient.height -
                          (props.isPopup ? window.innerHeight / 10 - 20 : 0),
                      );
                      console.log('position ', boundingClient);
                    }
                  }}
                >
                  account_circle
                </span>
                <span className="tooltiptext">Chọn người đặt hàng</span>
              </div>
            )}
            {isShowUserList ? (
              <ContactList
                iconX={iconX}
                iconY={iconY}
                onHidden={() => setIsShowUserList(false)}
                onSelect={(user: ProfileInfo) => {
                  setUserId(user.userId);
                  setUserName(user.fullName);
                  setIsShowUserList(false);
                }}
              />
            ) : null}
          </div>
        )}
        <div className="order-requirement-row">
          <Input
            width="320px"
            title="Người nhận"
            require={true}
            disabled={isDisable}
            value={receiverFullname}
            onChange={setReceiverFullname}
            error={receiverFullnameError}
          />
        </div>
        <div className="order-requirement-row">
          <Input
            width="320px"
            title="SĐT người nhận"
            require={false}
            disabled={isDisable}
            value={receiverPhoneNumber}
            onChange={setReceiverPhoneNumber}
          />
        </div>
        <div className="order-requirement-row">
          <Input
            width="320px"
            title="Facebook"
            require={false}
            disabled={isDisable}
            value={receiverFacebook}
            onChange={setReceiverFacebook}
            inputPadding="3px 10px 3px 3px"
          />
          <div className="i-tooltip order-guide">
            <span
              className="material-icons info-guide"
              onClick={() => openLink(receiverFacebook)}
            >
              launch
            </span>
            <span className="tooltiptext">Truy cập Facebook</span>
          </div>
        </div>
        <div className="order-requirement-row">
          <Input
            width="320px"
            title="Zalo"
            require={false}
            disabled={isDisable}
            value={receiverZalo}
            onChange={setReceiverZalo}
            inputPadding="3px 30px 3px 3px"
          />
          <div className="i-tooltip order-qr-scan">
            <span
              className="material-icons qr-scan-icon"
              onClick={() => onShowQRCode(receiverZalo)}
            >
              qr_code
            </span>
            <span className="tooltiptext">Hiển thị QRCode thông tin Zalo</span>
          </div>
          <div className="i-tooltip order-guide">
            <span className="material-icons info-guide" onClick={() => openLink(receiverZalo)}>
              launch
            </span>
            <span className="tooltiptext">Truy cập Zalo</span>
          </div>
        </div>

        <div className="order-requirement-row">
          <Input
            width="320px"
            title="Ghi chú khách hàng"
            require={false}
            disabled={isDisable}
            value={orderRequirementNote}
            onChange={setOrderRequirementNote}
          />
        </div>
        <div className="order-requirement-row">
          <label>Danh sách sản phẩm</label>
          {!isDisable && (
            <div className="i-tooltip add-order">
              <span
                className="material-icons"
                onClick={() => setChooseProduct(!isChooseProduct)}
              >
                add_circle
              </span>
              <span className="tooltiptext">Chọn người đặt hàng</span>
            </div>
          )}
          {isChooseProduct ? (
            <ProductList
              onHidden={() => setChooseProduct(false)}
              onSelect={(product: ProductType) => {
                if (orderRequirementDetail.some((o) => o.productId == product.productId)) {
                  addPopup({
                    error: {
                      title: 'Sản phẩm đã tồn tại',
                      message: 'Sản phẩm đã tồn tại. Vui lòng kiểm tra lại!',
                    },
                  });
                  return;
                }

                if (product.isHiddenSerial) {
                  setOrderRequirementDetail([
                    ...orderRequirementDetail,
                    {
                      product: product,
                      productId: product.productId,
                      quantity: 1,
                      price: product.price,
                    },
                  ]);
                } else {
                  getProductSerial(
                    product.productId,
                    '',
                    1,
                    1,
                    EnumProductSerialStatus.Stocking,
                  ).then((r) => {
                    if (r.items.length == 1) {
                      setOrderRequirementDetail([
                        ...orderRequirementDetail,
                        {
                          product: product,
                          productSerial: r.items[0],
                          productId: product.productId,
                          productSerialId: r.items[0].productSerialId,
                          quantity: 1,
                          price: r.items[0].price,
                        },
                      ]);
                    } else {
                      addPopup({
                        error: {
                          title: 'Sản phẩm đã hết',
                          message:
                            'Sản phẩm không còn mã nào trong kho. Vui lòng kiểm tra lại!',
                        },
                      });
                      return;
                    }
                  });
                }
                setChooseProduct(false);
              }}
            />
          ) : null}
        </div>
        {orderRequirementDetail
          ? orderRequirementDetail.map((value, index) => {
              const currentSoldQuantity = orderRequirement
                ? orderRequirement.orderRequirementDetails.find(
                    (od) => od.orderRequirementDetailId == value.orderRequirementDetailId,
                  )?.quantity ?? 0
                : 0;
              return (
                <OrderRequirementPreviewComponent
                  key={`orderrequirementdetail${index}`}
                  isAdmin={isAdmin}
                  isDisable={
                    isDisable ||
                    (!isAdmin && progressStatus != EnumOrderRequirementProgressStatus.Waiting)
                  }
                  detail={value}
                  onChangeQuantity={(quantity) => {
                    value.quantity = quantity;
                    setOrderRequirementDetail([...orderRequirementDetail]);
                  }}
                  onMinusQuantity={() => {
                    value.quantity--;
                    setOrderRequirementDetail([...orderRequirementDetail]);
                  }}
                  onPlusQuantity={() => {
                    value.quantity++;
                    setOrderRequirementDetail([...orderRequirementDetail]);
                  }}
                  onChangeExtraAmount={(extraAmount) => {
                    value.extraAmount = extraAmount;
                    setOrderRequirementDetail([...orderRequirementDetail]);
                  }}
                  onChangePrice={(price) => {
                    value.price = price;
                    setOrderRequirementDetail([...orderRequirementDetail]);
                  }}
                  onDelete={() =>
                    setOrderRequirementDetail(orderRequirementDetail.filter((o) => o != value))
                  }
                  currentSoldQuantity={currentSoldQuantity}
                />
              );
            })
          : null}

        <div className="order-requirement-row">
          <SelectBoxComponent
            width="100%"
            require={true}
            onChange={setProgressStatus}
            isDisable={isDisable || !isAdmin}
            placeholder={'Trạng thái đơn hàng'}
            value={progressStatus}
            data={lstStatus}
            valueType={'value'}
            titleType={'title'}
          />
        </div>

        <div className="order-requirement-row">
          <Input
            width="100%"
            title="Giảm giá"
            require={true}
            disabled={isDisable}
            value={discount}
            type="number"
            onChange={setDiscount}
          />
        </div>
        <div className="order-requirement-row text-right">
          <span>Tổng tiền: </span>
          <span style={{ color: 'red' }}>{calcTotal()}</span>
        </div>
        <div className="order-requirement-row">
          {isDisable ? null : (
            <ButtonComponent icon="save" title={'LƯU'} onClick={onSave} loader={true} />
          )}
        </div>
        {orderRequirementId > 0 ? (
          <Note
            objectId={orderRequirementId}
            functionId={EnumDisplayConfig.Danh_sach_dat_hang}
            recordUserId={userId}
          />
        ) : null}
      </div>
    </>
  );
};

export default OrderRequirementDetail;
