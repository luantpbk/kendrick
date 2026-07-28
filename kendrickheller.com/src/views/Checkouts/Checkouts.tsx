import './Checkouts.css';
import React, { useEffect, useState } from 'react';
import {
  useAddPopup,
  useCleanCart,
  useGetCart,
  useSetNotificationBadge,
} from 'src/state/application/hooks';
import {
  CountryType,
  OrderRequirementDetailsItemType,
  OrderRequirementType,
  ReceiverInfoType,
} from 'src/api/models';
import { CartItemType } from 'src/state/application/models';
import { useDeleteReceiverInfo, useGetMyReceiverInfo, usePostReceiverInfo, usePutReceiverInfo } from 'src/api/receiverInfoApi';
import CartReceiverInfoComponent from 'src/components/CartReceiverInfoComponent/CartReceiverInfoComponent';
import useProfile from 'src/hooks/useProfile';
import { Navigate, useNavigate } from 'react-router';
import { usePostOrderRequirement } from 'src/api/orderRequirementApi';
import { useGetNotification } from 'src/api/notificationApi';
import { number2money } from 'src/utils/stringUtils';
import { PageContainer, PageHeader } from 'src/components/GlobalStyled';
import { NavLink } from 'react-router-dom';
import Cart from 'src/components/Cart/Cart';
import Input from 'src/components/Input/Input';
import SelectSearch from 'src/components/SelectSearch/SelectSearch';
import { useGetCountries } from 'src/api/countryApi ';
import ButtonComponent from 'src/components/ButtonComponent/ButtonComponent';
import { useTranslation } from 'react-i18next';

const Checkouts: React.FC = () => {
  //Value
  const cart = useGetCart();
  const profile = useProfile();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  //Receiver
  const [receiverFullName, setReceiverFullName] = useState<string>('');
  const [receiverFullnameError, setReceiverFullnameError] = useState(null);

  const [receiverPhoneNumber, setReceiverPhoneNumber] = useState<string>('');

  const [receiverZipCode, setReceiverZipCode] = useState<string>('');

  const [receiverAddress1, setReceiverAddress1] = useState<string>('');
  const [receiverAddress1Error, setReceiverAddress1Error] = useState(null);
  const [receiverAddress2, setReceiverAddress2] = useState<string>('');
  const [receiverAddress3, setReceiverAddress3] = useState<string>('');
  const [receiverAddress4, setReceiverAddress4] = useState<string>('');
  const [receiverAddressError, setReceiverAddressError] = useState(null);

  const [receiverFacebook, setReceiverFacebook] = useState<string>('');
  const [receiverContactError, setReceiverContactError] = useState(null);

  const [orderRequirementNote, setOrderRequirementNote] = useState<string>('');

  const [receiverInfoList, setReceiverInfoList] = useState<ReceiverInfoType[]>([]);

  const [shipFee, setShipFee] = useState<number>();
  const [totalMoney, setTotalMoney] = useState(0);

  const [checkReceiverId, setCheckReceiverId] = useState<number>();

  const [collapse, setCollapse] = useState(false);
  const [contries, setCountries] = useState<CountryType[]>([]);
  //End of state

  //Function
  const getMyReceiverInfo = useGetMyReceiverInfo();
  const postOrderRequirement = usePostOrderRequirement();
  const addPopup = useAddPopup();
  const cleanCart = useCleanCart();
  const getCountries = useGetCountries();
  const postReceiverInfo = usePostReceiverInfo();
  const putReceiverInfo = usePutReceiverInfo();
  const deleteReceiverInfo = useDeleteReceiverInfo();

  const checkFuncReceiver = (item: ReceiverInfoType) => {
    setCheckReceiverId(item.receiverInfoId);
    setReceiverFullName(item.fullname);
    setReceiverPhoneNumber(item.phoneNumber);
    setReceiverZipCode(item.zipCode);
    setReceiverAddress1(item.address1);
    setReceiverAddress2(item.address2);
    setReceiverAddress3(item.address3);
    setReceiverAddress4(item.address4);
    setReceiverFacebook(item.facebook);

  };

  const onPostReceiverInfo = () => {
    if (validateReceiverFullName()
      && validateReceiverContact()
      && validateReceiver1Address()
      && validateReceiverAddress()) {
      const receiverInfo: ReceiverInfoType = {
        fullname: receiverFullName,
        phoneNumber: receiverPhoneNumber,
        zipCode: receiverZipCode,
        address1: receiverAddress1,
        address2: receiverAddress2,
        address3: receiverAddress3,
        address4: receiverAddress4,
        facebook: receiverFacebook,
        userId: profile.info.userId
      };
      postReceiverInfo(receiverInfo)
        .then((res) => {
          setReceiverInfoList([...receiverInfoList, res]);
          setCheckReceiverId(res.receiverInfoId);
          setReceiverFullName(res.fullname);
          setReceiverPhoneNumber(res.phoneNumber);
          setReceiverZipCode(res.zipCode);
          setReceiverAddress1(res.address1);
          setReceiverAddress2(res.address2);
          setReceiverAddress3(res.address3);
          setReceiverAddress4(res.address4);
          setReceiverFacebook(res.facebook);
          addPopup({
            txn: {
              success: true,
              summary: 'Create new delivery address successfully',
            },
          });
        })
        .catch((error) => {
          addPopup({
            error: {
              message: error.message,
              title: 'Create new delivery address failed',
            },
          });
        });
    }
  };

  const onPutReceiverInfo = () => {
    if (validateReceiverFullName()
      && validateReceiverContact()
      && validateReceiver1Address()
      && validateReceiverAddress()) {
      const receiverInfo: ReceiverInfoType = {
        fullname: receiverFullName,
        phoneNumber: receiverPhoneNumber,
        zipCode: receiverZipCode,
        address1: receiverAddress1,
        address2: receiverAddress2,
        address3: receiverAddress3,
        address4: receiverAddress4,
        facebook: receiverFacebook,
        receiverInfoId: checkReceiverId,
        userId: profile.info.userId
      };
      putReceiverInfo(receiverInfo)
        .then((res) => {
          const indx = receiverInfoList.findIndex(r => r.receiverInfoId == checkReceiverId);
          receiverInfoList[indx] = res;
          setReceiverInfoList([...receiverInfoList]);
          setReceiverFullName(res.fullname);
          setReceiverPhoneNumber(res.phoneNumber);
          setReceiverZipCode(res.zipCode);
          setReceiverAddress1(res.address1);
          setReceiverAddress2(res.address2);
          setReceiverAddress3(res.address3);
          setReceiverAddress4(res.address4);
          setReceiverFacebook(res.facebook);
          addPopup({
            txn: {
              success: true,
              summary: 'Change new delivery address successfully',
            },
          });
        })
        .catch((error) => {
          addPopup({
            error: {
              message: error.message,
              title: 'Change new delivery address failed',
            },
          });
        });
    }
  };

  const onDeleteReceiverInfo = () => {
    deleteReceiverInfo(checkReceiverId).then(() => {
      const nReceiverInfos = receiverInfoList.filter(r => r.receiverInfoId != checkReceiverId);
      setCheckReceiverId(undefined);
      setReceiverInfoList([...nReceiverInfos]);
    });
  };


  //Validate
  const validateReceiverFullName = () => {
    const bOk = receiverFullName && receiverFullName != '';
    setReceiverFullnameError(!bOk ? t('Customer name not entered') : undefined);
    return bOk;
  };

  const validateReceiverAddress = () => {
    const bOk =
      (receiverAddress2 && receiverAddress2 != '') ||
      (receiverAddress3 && receiverAddress3 != '') ||
      (receiverAddress4 && receiverAddress4 != '');
    setReceiverAddressError(!bOk ? t('No shipping address entered') : undefined);
    return bOk;
  };

  const validateReceiver1Address = () => {
    if (!receiverAddress1) {
      setReceiverAddress1Error(t('Country / region field can\'t be empty'));
      return false;
    } else if (!contries.some(c => c.countryName == receiverAddress1)) {
      setReceiverAddress1Error(t('Country / region not exist in support list'));
      return false;
    } else {
      setReceiverAddress1Error(undefined);
      setShipFee(0);
      return true;
    }
  };

  const validateReceiverContact = () => {
    const bOk =
      (receiverPhoneNumber && receiverPhoneNumber != '') ||
      (receiverFacebook && receiverFacebook != '');
    setReceiverContactError(
      !bOk ? t('Did not enter contact information, please  enter phone number or facebook info') : undefined,
    );
    return bOk;
  };
  //End of validate

  const onPostOrderRequirement = () => new Promise((resolve, reject) => {
    const isReceiverFullname = validateReceiverFullName();
    const isReceiverAddress = validateReceiverAddress();
    const isReceiverContact = validateReceiverContact();
    if (isReceiverFullname && isReceiverAddress && isReceiverContact) {
      if (shipFee != -1) {
        const orderRequirementDetails: OrderRequirementDetailsItemType[] = [];
        cart.map((item: CartItemType) => {
          const detail: OrderRequirementDetailsItemType = {
            productId: item.productId,
            option: item.option != "{}" ? item.option : undefined,
            quantity: item.quantity
          };
          orderRequirementDetails.push(detail);
        });
        const oderRequirement: OrderRequirementType = {
          receiverFullname: receiverFullName,
          receiverPhoneNumber: receiverPhoneNumber,
          receiverZipCode: receiverZipCode,
          receiverAddress1: receiverAddress1,
          receiverAddress2: receiverAddress2,
          receiverAddress3: receiverAddress3,
          receiverAddress4: receiverAddress4,
          receiverFacebook: receiverFacebook,
          orderRequirementNote: orderRequirementNote,
          orderRequirementDetails: orderRequirementDetails,
        };

        postOrderRequirement(oderRequirement)
          .then((res) => {
            cleanCart();
            resolve(res);
          })
          .catch((error) => {
            addPopup({
              error: {
                message: error.errorMessage,
                title: 'An error has occurred',
              },
            });
            reject(false);
          });
      } else {
        addPopup({
          txn: {
            success: false,
            summary: 'Delivery address cannot be shipped.',
          },
        });
        reject(false);
      }
    } else {
      addPopup({
        txn: {
          success: false,
          summary: 'Please enter enough information.',
        },
      });
      reject(false);
    }
  });
  //End of function


  useEffect(() => {
    getMyReceiverInfo().then((data) => setReceiverInfoList(data));
    getCountries().then((res) => setCountries(res));
  }, [getMyReceiverInfo]);

  //Main
  return (
    profile ? cart.length > 0 ?
      <PageContainer>
        <PageHeader>
          <NavLink to={'/'}>{t("Home")}</NavLink>{` / `}{t("Checkout")}
        </PageHeader>
        <div className="checkout-container">
          <div className={`cart-info`}>
            <div className="cart-info-header">
              <div><span className="material-icons cart-info-header-middle">shopping_cart</span><label className="cart-info-header-middle">{cart.length} {t("items")}</label> </div>
              <span className="material-icons cart-info-header-middle" onClick={() => setCollapse(!collapse)}>{collapse ? 'arrow_drop_down' : 'arrow_drop_up'}</span>
            </div>
            <div className={collapse ? 'collapse' : 'uncollapse'}>
              <Cart ref={(el: any) => {
                if (el) setTotalMoney(el.getSubTotal());
              }} />
              <div className='money-title'><label>{t("Shipping fee")}</label><span>{shipFee !== undefined ? number2money(shipFee) : t('Calculated affter entering delivery address')}</span></div>
              <hr />
              <div className='total-title'><label>{t("Total")}</label><span>{number2money(totalMoney)}</span></div>
            </div>

          </div>
          <div className="delivery">
            <div className="receiver-info">
              {receiverInfoList.length > 0 && <label>{t("Choose one of the addresses below or enter your delivery information")}</label>}
              <div className="receiver-info-list">
                {receiverInfoList.map((value, index) => {
                  return (
                    <CartReceiverInfoComponent
                      key={`receiveritem${index}`}
                      data={value}
                      checked={value.receiverInfoId == checkReceiverId}
                      checkFunc={() => checkFuncReceiver(value)}
                    />
                  );
                })}
              </div>
              {checkReceiverId ? <label className='delete-address' onClick={onDeleteReceiverInfo}>{t("Delete delivery address")}</label> : null}
            </div>
            <div className="delivery-info">
              <div className="delivery-address">
                <div>1. {t("Delivery address")}</div>
                <Input
                  leftIcon='fas fa-user'
                  placeholder={t('Fullname')}
                  value={receiverFullName}
                  errorMessage={receiverFullnameError}
                  type="text"
                  onChange={setReceiverFullName}
                  onBlur={validateReceiverFullName}
                />
                <Input
                  leftIcon='fas fa-phone'
                  placeholder={t('Phone')}
                  value={receiverPhoneNumber}
                  errorMessage={receiverContactError}
                  type="text"
                  onChange={setReceiverPhoneNumber}
                  onBlur={validateReceiverContact}
                />
                <Input
                  leftIcon='fab fa-facebook-f'
                  rightIcon='fas fa-info-circle'
                  rightAction={() => window.open('/static-page/FACEBOOK_INFO_GUIDE')}
                  placeholder='Facebook'
                  value={receiverFacebook}
                  errorMessage={receiverContactError}
                  type="text"
                  onChange={setReceiverFacebook}
                  onBlur={validateReceiverContact}
                />
                <Input
                  leftIcon='fab fa-product-hunt'
                  placeholder={t('Postal code (optional)')}
                  value={receiverZipCode}
                  type="text"
                  onChange={setReceiverZipCode}
                />
                <SelectSearch
                  leftIcon='fas fa-globe'
                  placeholder={t('Country / region')}
                  value={receiverAddress1}
                  errorMessage={receiverAddress1Error}
                  data={contries}
                  valueType={'countryName'}
                  titleType={'countryName'}
                  onChange={setReceiverAddress1}
                  validator={validateReceiver1Address}
                />
                <Input
                  leftIcon='fas fa-map-marker-alt'
                  placeholder={t('City')}
                  value={receiverAddress2}
                  errorMessage={receiverAddressError}
                  type="text"
                  onChange={setReceiverAddress2}
                  onBlur={validateReceiverAddress}
                />
                <Input
                  leftIcon='fas fa-map-marked-alt'
                  placeholder={t('Address')}
                  value={receiverAddress3}
                  errorMessage={receiverAddressError}
                  type="text"
                  onChange={setReceiverAddress3}
                  onBlur={validateReceiverAddress}
                />
                <Input
                  leftIcon='fas fa-building'
                  placeholder={t('Apartment, suite, etc.')}
                  value={receiverAddress4}
                  errorMessage={receiverAddressError}
                  type="text"
                  onChange={setReceiverAddress4}
                  onBlur={validateReceiverAddress}
                />
                <label className='save-address' onClick={checkReceiverId ? onPutReceiverInfo : onPostReceiverInfo}>{t("Save delivery address")}</label>
              </div>
              <div className="delivery-time">
                <div>2. {t("Customer notes")}</div>

                <textarea
                  className='note-checkout'
                  value={orderRequirementNote}
                  onChange={(event) => setOrderRequirementNote(event.target.value)}
                  placeholder={t('Note...')}
                  rows={3}
                />

                <ButtonComponent onClick={onPostOrderRequirement} icon={'shopping_cart_checkout'} title={t('PURCHASE')} loader={true} callback={(res) => navigate(`/order-requirement/${res.orderRequirementId}`)} />
              </div>
            </div>
          </div>

        </div>
      </PageContainer >
      : <Navigate to="/" />
      : <Navigate to="/auth-screen" />
  );

};

export default Checkouts;
