import { BASE_SETTING_URL, BASE_WEB_URL } from 'src/constants';
import Realm from 'src/views/Realm';
import Category from 'src/views/Category/Category';
import Product from 'src/views/Product/Product';
import Banner from 'src/views/Banner/Banner';
import AdvertisingBanner from 'src/views/AdvertisingBanner/AdvertisingBanner';
import Info from 'src/views/Info/Info';
import CompanyImage from 'src/views/CompanyImage/CompanyImage';
import StaticPageDetails from 'src/views/StaticPage/StaticPageDetails/StaticPageDetails';
import StaticPage from 'src/views/StaticPage/StaticPage';
import NewsDetails from 'src/views/News/NewsDetails/NewsDetails';
import News from 'src/views/News/News';
import OrderRequirementDetail from 'src/views/OrderRequirement/OrderRequirementDetail/OrderRequirementDetail';
import OrderRequirement from 'src/views/OrderRequirement/OrderRequirement';
import User from 'src/views/User/User';
import AccountBalanceList from 'src/views/AccountBalance/AccountBalanceList/AccountBalanceList';
import CustomerTypeScreen from 'src/views/CustomerTypeScreen/CustomerTypeScreen';
import UserCustomerTypeScreen from 'src/views/UserCustomerTypeScreen/UserCustomerTypeScreen';
import ReceiverInfo from 'src/views/ReceiverInfo/ReceiverInfo';
import AccountBalance from 'src/views/AccountBalance/AccountBalance';
import Store from 'src/views/Store/Store';
import Module from 'src/views/Module/Module';
import Role from 'src/views/Role/Role';
import ApiScreen from 'src/views/ApiScreen/ApiScreen';
import EmailTemplate from 'src/views/EmailTemplate/EmailTemplate';
import EmailTemplateDetail from 'src/views/EmailTemplate/EmailTemplateDetail/EmailTemplateDetail';
import PrintedTemplateDetail from 'src/views/PrintedTemplate/PrintedTemplateDetail/PrintedTemplateDetail';
import PrintedTemplate from 'src/views/PrintedTemplate/PrintedTemplate';
import NotificationTemplateDetail from 'src/views/NotificationTemplate/NotificationTemplateDetail/NotificationTemplateDetail';
import NotificationTemplate from 'src/views/NotificationTemplate/NotificationTemplate';
import Parameter from 'src/views/Parameter/Parameter';
import DashBoard from 'src/views/DashBoard';
import { Route, Routes, useNavigate } from 'react-router-dom';
import useProfile from 'src/hooks/useProfile';
import { useEffect } from 'react';
import ProductDetails from 'src/views/Product/ProductDetails/ProductDetails';
import Logo from 'src/views/Logo/Logo';
import Login from 'src/views/AuthScreen/Login/Login';
import ConfirmRegister from 'src/views/AuthScreen/ConfirmRegister/ConfirmRegister';
import ForgotPassword from 'src/views/AuthScreen/ForgotPassword/ForgotPassword';
import Register from 'src/views/AuthScreen/Register/Register';
import ConfirmForgotPassword from 'src/views/AuthScreen/ConfirmForgotPassword/ConfirmForgotPassword';
import Verify from 'src/views/AuthScreen/ChangePassword/ChangePassword';
import Translation from 'src/views/Translation/Translation';

const AppRouters: React.FC = () => {
  //Value
  const profile = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) navigate('/auth');
  }, [navigate, profile]);

  //Main
  return (
    <Routes>
      <Route path="/auth/confirm-register" element={<ConfirmRegister />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/confirm-forgot-password" element={<ConfirmForgotPassword />} />
      <Route path="/auth/change-password" element={<Verify />} />
      <Route path="/auth" element={<Login />} />

      <Route path="/" element={<DashBoard />} />
      <Route key={'route-realm'} path={`${BASE_WEB_URL}/realm`} element={<Realm />} />
      <Route key={'route-category'} path={`${BASE_WEB_URL}/category`} element={<Category />} />
      <Route key={'route-product'} path={`${BASE_WEB_URL}/product`} element={<Product />} />
      <Route
        key={'route-product-detail'}
        path={`${BASE_WEB_URL}/product/:productId`}
        element={<ProductDetails isDisable={true} />}
      />
      <Route key={'route-banner'} path={`${BASE_WEB_URL}/banner`} element={<Banner />} />
      <Route
        key={'route-banner'}
        path={`${BASE_WEB_URL}/advertising-banner`}
        element={<AdvertisingBanner />}
      />
      <Route
        key={'route-translation'}
        path={`${BASE_WEB_URL}/translation`}
        element={<Translation />}
      />
      <Route key={'route-logo'} path={`${BASE_WEB_URL}/logo`} element={<Logo />} />
      <Route key={'route-info'} path={`${BASE_WEB_URL}/info`} element={<Info />} />
      <Route
        key={'route-company-image'}
        path={`${BASE_WEB_URL}/company-image`}
        element={<CompanyImage />}
      />
      <Route
        key={'route-static-page-details'}
        path={`${BASE_WEB_URL}/static-page/:type/id/:staticPageId`}
        element={<StaticPageDetails />}
      />
      <Route
        key={'route-static-page'}
        path={`${BASE_WEB_URL}/static-page`}
        element={<StaticPage />}
      />
      <Route
        key={'route-news-details'}
        path={`${BASE_WEB_URL}/news/:type/id/:newId`}
        element={<NewsDetails />}
      />
      <Route key={'route-news'} path={`${BASE_WEB_URL}/news`} element={<News />} />
      <Route
        path={`${BASE_WEB_URL}/order-requirement/:orderRequirementId/:type`}
        element={<OrderRequirementDetail />}
      />
      <Route
        key={'route-order-requirement'}
        path={`${BASE_WEB_URL}/order-requirement`}
        element={<OrderRequirement />}
      />
      <Route key={'route-user'} path={`${BASE_SETTING_URL}/user`} element={<User />} />
      <Route
        key={'route-account-balance-list'}
        path={`${BASE_SETTING_URL}/account-balance-list`}
        element={<AccountBalanceList />}
      />
      <Route
        key={'route-customer-type'}
        path={`${BASE_SETTING_URL}/customer-type`}
        element={<CustomerTypeScreen />}
      />
      <Route
        key={'route-user-customer-type'}
        path={`${BASE_SETTING_URL}/user-customer-type`}
        element={<UserCustomerTypeScreen />}
      />
      <Route
        key={'route-receiver-info'}
        path={`${BASE_SETTING_URL}/receiver-info`}
        element={<ReceiverInfo />}
      />
      <Route key={'route-store'} path={`${BASE_SETTING_URL}/store`} element={<Store />} />
      <Route
        key={'route-account-balance'}
        path={`${BASE_SETTING_URL}/account-balance`}
        element={<AccountBalance />}
      />
      <Route key={'route-module'} path={`${BASE_SETTING_URL}/module`} element={<Module />} />
      <Route key={'route-role'} path={`${BASE_SETTING_URL}/role`} element={<Role />} />
      <Route key={'route-role'} path={`${BASE_SETTING_URL}/api`} element={<ApiScreen />} />
      <Route
        key={'route-email-template-detail'}
        path={`${BASE_SETTING_URL}/email-template/:type/id/:emailTemplateId`}
        element={<EmailTemplateDetail />}
      />
      <Route
        key={'route-email-template'}
        path={`${BASE_SETTING_URL}/email-template`}
        element={<EmailTemplate />}
      />
      <Route
        key={'route-printed-template-detail'}
        path={`${BASE_SETTING_URL}/printed-template/:type/id/:printedTemplateId`}
        element={<PrintedTemplateDetail />}
      />
      <Route
        key={'route-printed-template'}
        path={`${BASE_SETTING_URL}/printed-template`}
        element={<PrintedTemplate />}
      />
      <Route
        key={'route-notification-template-detail'}
        path={`${BASE_SETTING_URL}/notification-template/:type/id/:notificationTemplateId`}
        element={<NotificationTemplateDetail />}
      />
      <Route
        key={'route-notification-template'}
        path={`${BASE_SETTING_URL}/notification-template`}
        element={<NotificationTemplate />}
      />
      <Route
        key={'route-parameter'}
        path={`${BASE_SETTING_URL}/parameter`}
        element={<Parameter />}
      />
    </Routes>
  );
};

export default AppRouters;
