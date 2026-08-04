import './Header.css';
import { useState } from 'react';
import React from 'react';
import InputComponent from '../InputComponent/InputComponent';
import { useEffect } from 'react';
import { useGetProduct } from 'src/api/backend-api';
import { ProductType } from 'src/api/models';
import {
  useGetCart,
  useGetnotificationBadge,
  useRemoveProfileInfo,
} from 'src/state/application/hooks';
import LazyLoad from 'react-lazyload';
import { useLocation, useNavigate } from 'react-router';
import useProfile from 'src/hooks/useProfile';
import { NavLink } from 'react-router-dom';
import useLogo from 'src/hooks/useLogo';
import Cart from '../Cart/Cart';
import SlideBar from '../SlideBar';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  //Define
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useProfile();
  const cart = useGetCart();
  const notificationBadge = useGetnotificationBadge();
  const logo = useLogo();
  const [isCartVisible, setCartVisible] = useState(false);
  const [language, setLanguage] = useState<string>();
  const [isShowAccountPopup, setShowAccountPopup] = useState(false);
  const [showBagFlg, setShowBagFlg] = useState(true);

  useEffect(() => {
    setShowBagFlg(!location.pathname.includes("checkout") && !location.pathname.includes("order-requirement/"));
  }, [location])

  const { t, i18n } = useTranslation();

  //Function
  const removeProfileInfo = useRemoveProfileInfo();


  useEffect(() => {
    setLanguage(i18n.language);
  }, [])

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
      localStorage.setItem('KENDRICKHELLER_I18N_LANGUAGE', language);
    }
  }, [language])

  const onLogOut = () => {
    window.scrollTo(0, 0);
    removeProfileInfo();
    setShowAccountPopup(false);
  };

  const flags = {
    "en": "flag-icon-en",
    "fr": "flag-icon-fr",
    "de": "flag-icon-de",
    "it": "flag-icon-it",
    "pt": "flag-icon-pt",
    "et": "flag-icon-et",
    "cn": "flag-icon-cn",
    "jp": "flag-icon-jp",
    "vi": "flag-icon-vn",
  }

  return (
    <div className="header-container" id="header">
      <div className="nav-pc-header-top">
        <div className="nav-pc-header-top_left">
          <div className="nav-pc-header-top-child hidden-small"><div onClick={() => {
            window.scrollTo(0, 0);
            navigate('/');
          }}>{t("Kendrick Heller")}</div></div>
          {/* <i className="fab fa-facebook-f nav-pc-header-top-child m-1 p-0" onClick={() => window.open("https://facebook.com")} />
          <i className="fab fa-tiktok nav-pc-header-top-child m-1 p-0" onClick={() => window.open("https://titok.com")} /> */}
        </div>
        <div className="nav-pc-header-top_right">

          {showBagFlg && <div className="nav-pc-header-top-child" onClick={() => setCartVisible(true)} title={t("Bag")}>
            <i className="fas fa-shopping-bag"></i>
            <div className='hidden-small'> {t("Bag")}</div>
            {cart && cart.length > 0 ? <div>({cart.length})</div> : null}
          </div>}

          {profile ? <>
            <div style={{ color: 'lightgray' }}> | </div>
            <div className="nav-pc-header-top-child" onClick={() => window.open("/notification")} title={t("Notification")}>
              <i className="fas fa-bell" style={{ color: 'white' }} title={t("Notification")} ></i>
              <div className='hidden-small'>{t("Notification")}</div>
              {notificationBadge ? <div>({notificationBadge})</div> : null}
            </div>

            <div className="nav-pc-header-top-child" onClick={() => window.open("/order-requirement")} title={t("Orders")}>
              <i className="fas fa-list" style={{ color: 'white' }} title={t("Orders")} ></i>
              <div className='hidden-small'>{t("Orders")}</div>
            </div>

          </> : null}

          <div style={{ color: 'lightgray' }}> | </div>

          {!profile ? <>
            <i className="fas fa-user" style={{ color: 'white', marginLeft: '5px' }} /><div className="nav-pc-header-top-child" onClick={() => {
              window.scrollTo(0, 0);
              navigate(`/auth-screen`);
            }} title={t("Login")} >{t("Login")}</div>
          </> : <>
            <img className='account-img' onClick={() => setShowAccountPopup(!isShowAccountPopup)} src={profile.info.avataUrl} title="Account" />
            <div className="nav-pc-header-top-child" onClick={onLogOut} title={t("Logout")}>{t("Logout")}</div>
          </>}


          <div className="flag-dropdown">
            <span className={`flag-icon ${flags[language]}`} onClick={() => setLanguage("en")}>&#8203;</span>
            <div className="flag-dropdown-content">
              {Object.entries(flags).map(([key, value]) => <span key={key} className={`flag-icon ${value}`} onClick={() => setLanguage(key)}>&#8203;</span>)}
            </div>
          </div>
        </div>
      </div>
      <div className="header-top">
        <div className="logo" onClick={() => {
          window.scrollTo(0, 0);
          navigate('/');
        }}><img width="180" height="42" src={logo || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} alt="logo" /></div>

      </div>
      <SlideBar visible={isCartVisible} changeVisible={setCartVisible}>
        <div className="cart-header">
          <div><span className="material-icons cart-header-middle">shopping_cart</span><label className="cart-header-middle">{cart.length} {t("items")}</label> </div>
          <span className="material-icons cart-header-middle" onClick={() => setCartVisible(false)}>clear</span>
        </div>
        <Cart />
        <ButtonComponent onClick={() => {
          setCartVisible(false);
          window.scrollTo(0, 0);
          navigate('/checkout');
        }} icon={'shopping_cart_checkout'} title={t("CHECKOUT")} color='white' colorhover='lightgray' />
      </SlideBar>
    </div>
  );
};

export default Header;
