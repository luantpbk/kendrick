import './OrderRequirementDetail.css';
import React, { useEffect, useState } from 'react';
import { useAddPopup, useSetNotificationBadge } from 'src/state/application/hooks';
import {
  EnumDisplayConfig,
  EnumOrderRequirementProgressStatus,
  NoteByDay,
  NoteType,
  OrderRequirementDetailsItemType,
  OrderRequirementType,
} from 'src/api/models';
import useProfile from 'src/hooks/useProfile';
import { Navigate, useNavigate } from 'react-router';
import Images from 'src/assets/img';
import { NavLink, useParams } from 'react-router-dom';
import { useCapturePayment, useGeneratePaymentId, useGetOrderRequirementById } from 'src/api/orderRequirementApi';
import { useGetNote, usePostNote } from 'src/api/noteApi';
import { number2money } from 'src/utils/stringUtils';
import { PageContainer, PageHeader } from 'src/components/GlobalStyled';
import Products from 'src/components/Products/Products';
import Input from 'src/components/Input/Input';
import CartItem from 'src/components/CartItem/CartItem';
import { nanoid } from '@reduxjs/toolkit';
import ButtonComponent from 'src/components/ButtonComponent/ButtonComponent';
import useLogo from 'src/hooks/useLogo';
import Loading from 'src/components/Loading';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useTranslation } from 'react-i18next';

const OrderRequirementDetail: React.FC = () => {
  //Value
  const profile = useProfile();
  const navigate = useNavigate();
  const params = useParams<{ orderRequirementId: string }>();
  const orderRequirementId = Number(params.orderRequirementId);
  const { t, i18n } = useTranslation();
  //Receiver
  const [data, setData] = useState<OrderRequirementType>();
  const [subTotalMoney, setSubTotalMoney] = useState<number>(null);
  const [collapse, setCollapse] = useState(false);

  const [noteList, setNoteList] = useState<NoteByDay[]>([]);
  const [noteContent, setNoteContent] = useState('');
  const [reloadFlag, setReloadFlag] = useState<boolean>(false);
  const [loadingFlag, setLoadingFlag] = useState<boolean>(false);
  //End of state
  const logo = useLogo();
  //Function
  const addPopup = useAddPopup();
  const getOrderRequirementById = useGetOrderRequirementById();
  const getNote = useGetNote();
  const postNote = usePostNote();
  const generatePaymentId = useGeneratePaymentId();
  const capturePayment = useCapturePayment();

  const onPostNote = () => {
    if (orderRequirementId > 0 && noteContent != '') {
      const note: NoteType = {
        functionId: EnumDisplayConfig.Danh_sach_dat_hang,
        objectId: orderRequirementId,
        noteContent: noteContent,
      };
      setLoadingFlag(true);
      postNote(note, profile.info.userId)
        .then((res) => {
          addPopup({
            txn: {
              success: true,
              summary: 'Send successfully',
            },
          });
          setNoteContent('');
          const nNoteList = [...noteList];
          if (nNoteList.length == 0) {
            nNoteList.push({
              createdAt: (new Date()).toLocaleDateString("en-US"),
              list: [res]
            })
          } else {
            nNoteList[0].list.splice(0, 0, res);
          }
          setNoteList(nNoteList);
        })
        .catch((e) => {
          addPopup({
            error: {
              title: 'An error has occurred',
              message: e.errorMessage,
            },
          });
          setReloadFlag(!reloadFlag);
        })
        .finally(() => setLoadingFlag(false));
    }
  };
  //End of function




  //End of component

  useEffect(() => {
    if (orderRequirementId > 0) {
      setLoadingFlag(true);
      Promise.all([
        getOrderRequirementById(orderRequirementId),
        getNote(EnumDisplayConfig.Danh_sach_dat_hang, orderRequirementId)
      ]).then(([orderRes, noteRes]) => {
        console.log(orderRes.orderRequirementDetails);
        setData(orderRes)
        const subTotal = orderRes.orderRequirementDetails.reduce((total, detail) => total += (detail.quantity ?? 0) * (detail?.price ?? 0), 0);
        setSubTotalMoney(subTotal);
        console.log(subTotal);
        let createDay: string = undefined;
        const notes: NoteByDay[] = [];
        noteRes.forEach(item => {
          if (item.createdAt == createDay) {
            notes[notes.length - 1].list.push(item);
          } else {
            createDay = item.createdAt;
            const noteOfDay = {
              createdAt: createDay,
              list: [] as NoteType[]
            };
            noteOfDay.list.push(item);
            notes.push(noteOfDay);
          }
        })
        setNoteList(notes);
      }).catch((error) => {
        addPopup({
          error: {
            title: 'An error has occurred',
            message: error.errorMessage,
          },
        });
      }).finally(() => setLoadingFlag(false));
    } else {
      window.scrollTo(0, 0);
      navigate(-1);
    }
  }, [addPopup, getNote, getOrderRequirementById, navigate, orderRequirementId]);

  //Main
  return (profile ?
    <>
      <PageContainer>
        <PageHeader>
          <NavLink to={'/'}>{t("Home")}</NavLink>{` / `}<NavLink to={'/order-requirement'}>{t("Order list")}</NavLink>{` / `}{t("Order infomation")}
        </PageHeader>
        <div className="order-requirement-detail-container">
          <div className={`order-cart-info`}>
            <div className="order-cart-info-header">
              <div>{loadingFlag ? <Loading /> : <span className="material-icons order-cart-info-header-middle">shopping_cart</span>}<label className="order-cart-info-header-middle">{data?.orderRequirementDetails.length} {t("items")}</label> </div>
              <span className="material-icons order-cart-info-header-middle hidden" onClick={() => setCollapse(!collapse)}>{collapse ? 'arrow_drop_down' : 'arrow_drop_up'}</span>
            </div>
            <div className={collapse ? 'collapse' : 'uncollapse'}>
              {data?.orderRequirementDetails?.length > 0 ? data.orderRequirementDetails.map((detail, index) => {
                return (
                  <CartItem
                    key={`cartitem${index}`}
                    cartItem={{
                      productId: detail.productId,
                      quantity: detail.quantity,
                      option: detail.option,
                      key: nanoid(),
                      price: detail.price
                    }}
                    product={detail.product}
                    isDisable={true}
                  />
                );
              }) : null}
              <div className='order-money-title'><label>{t("Subtotal")}</label><span>{number2money(subTotalMoney ?? 0)}</span></div>
              <div className='order-money-title'><label>{t("Shipping fee")}</label><span>{number2money(data?.shipFee)}</span></div>
              <hr />
              <div className='order-total-title'><label> {t("Total")}</label><span>{number2money((subTotalMoney ?? 0) + (data?.shipFee ?? 0))}</span></div>
            </div>

          </div>
          <div className="order-delivery-info">
            <div>1. {t("Delivery address")}</div>
            <Input
              leftIcon='fas fa-user'
              placeholder={t('Fullname')}
              value={data?.receiverFullname}
              type="text"
              isDisabled={true}
            />
            <Input
              leftIcon='fas fa-phone'
              placeholder={t('Phone')}
              value={data?.receiverPhoneNumber}
              isDisabled={true}
              type="text"
            />
            <Input
              leftIcon='fab fa-facebook-f'
              rightIcon='fas fa-chevron-circle-right'
              rightAction={() => window.open(data?.receiverFacebook)}
              placeholder={t('Facebook')}
              value={data?.receiverFacebook}
              isDisabled={true}
              type="text"
            />
            <Input
              leftIcon='fab fa-product-hunt'
              placeholder={t('Postal code (optional)')}
              value={data?.receiverZipCode}
              isDisabled={true}
              type="text"
            />
            <Input
              leftIcon='fas fa-globe'
              placeholder={t('Country / region')}
              value={data?.receiverAddress1}
              isDisabled={true}
              type="text"
            />
            <Input
              leftIcon='fas fa-map-marker-alt'
              placeholder={t('City')}
              value={data?.receiverAddress2}
              isDisabled={true}
              type="text"
            />
            <Input
              leftIcon='fas fa-map-marked-alt'
              placeholder={t('Address')}
              value={data?.receiverAddress3}
              isDisabled={true}
              type="text"
            />
            <Input
              leftIcon='fas fa-building'
              placeholder={t('Apartment, suite, etc.')}
              value={data?.receiverAddress4}
              isDisabled={true}
              type="text"
            />
            <div>2. {t("Customer notes")}</div>

            <textarea
              className='order-note-checkout'
              value={data?.orderRequirementNote}
              placeholder={'Note...'}
              disabled={true}
              rows={3}
            />
          </div>
          <div className="order-receiver-info">
            <div className="cart-oder-title order-status">3. {t("Order status")}
              {data?.progressStatus == EnumOrderRequirementProgressStatus.Unpaid ? (
                <div style={{ color: 'orange' }}>
                  <i className="fas fa-spinner"></i>&ensp;
                  {t(EnumOrderRequirementProgressStatus[EnumOrderRequirementProgressStatus.Unpaid])}
                </div>
              ) : data?.progressStatus == EnumOrderRequirementProgressStatus.Paid ? (
                <div style={{ color: 'blue' }}>
                  <i className="fas fa-check-circle"></i>&ensp;
                  {t(EnumOrderRequirementProgressStatus[EnumOrderRequirementProgressStatus.Paid])}
                </div>
              ) : data?.progressStatus == EnumOrderRequirementProgressStatus.Shipping ? (
                <div style={{ color: 'green' }}>
                  <i className="fas fa-shipping-fast"></i>&ensp;
                  {t(EnumOrderRequirementProgressStatus[EnumOrderRequirementProgressStatus.Shipping])}
                </div>
              ) : data?.progressStatus == EnumOrderRequirementProgressStatus.Done ? (
                <div style={{ color: 'green' }}>
                  <i className="fas fa-clipboard-check"></i>&ensp;
                  {t(EnumOrderRequirementProgressStatus[EnumOrderRequirementProgressStatus.Done])}
                </div>
              ) : data?.progressStatus == EnumOrderRequirementProgressStatus.Error ? (
                <div style={{ color: 'red' }}>
                  <i className="fas fa-exclamation"></i>&ensp;
                  {t(EnumOrderRequirementProgressStatus[EnumOrderRequirementProgressStatus.Error])}
                </div>
              ) : null}
            </div>
            {data?.progressStatus == EnumOrderRequirementProgressStatus.Unpaid ? <PayPalButtons
              className='paypal-container'

              style={{
                shape: "rect",
                layout: "vertical",

              }}

              createOrder={async () => {
                try {
                  const id = await generatePaymentId(orderRequirementId);
                  console.log("create order ", id);
                  return id;
                } catch (error) {
                  console.error(error);
                  throw error;
                }
              }}
              onApprove={async (data, actions) => {
                const orderData = await capturePayment(data.orderID);
                const errorDetail = orderData?.details?.[0];
                if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                  // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                  return actions.restart();
                } else if (errorDetail) {
                  // (2) Other non-recoverable errors -> Show a failure message
                  addPopup({
                    error: {
                      title: 'An error has occurred',
                      message: `${errorDetail.description} (${orderData.debug_id})`,
                    },
                  });
                } else {
                  // (3) Successful transaction -> Show confirmation or thank you message
                  const transaction = orderData.purchase_units[0].payments.captures[0];
                  console.log(transaction);
                  addPopup({
                    txn: {
                      success: true,
                      summary: t(`Your order has been paid successfully. We will ship to you as soon as possible. Thank you!`),
                    },
                  });
                }
              }}
            /> : null}

            <div className="cart-oder-title">4. {t("Talk to support")}</div>

            <textarea
              className='order-note-checkout'
              placeholder={t('Enter the text of the exchange on the line')}
              value={noteContent}
              onChange={(event) => {
                setNoteContent(event.target.value);
              }}
              rows={3}
            />
            <ButtonComponent onClick={onPostNote} icon={'chat'} title='SEND' />
            <hr />
            {noteList.map((dayNotes, i) => {
              return (
                <div className="note-component" key={`note_${i}`}>
                  {dayNotes.list.map((note, index) => {
                    return (note.userId == profile.info.userId ?
                      <div className={`my-note-item`} key={`noteitem${index}`}>
                        {note.noteContent}
                      </div> : <div className={`note-item`} key={`noteitem${index}`}>
                        <img className="note-avatar" src={note.avataUrl ?? logo} alt="avatar" title='note.fullName' />
                        <div className="note-detail">{note.noteContent}</div>
                      </div>
                    );
                  })}
                  <div className="note-date">
                    <div className="note-line"></div>
                    <div className="note-datetime">{dayNotes.createdAt}</div>
                    <div className="note-line"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageContainer >

      <div className='related-products-title'>{t("RELATED PRODUCTS")}</div>
      <Products isHorizontally={true} />
    </>
    : <Navigate to="/auth-screen" />
  );
};

export default OrderRequirementDetail;
