import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "src/components/Header/Header";
import CompanyImage from "src/components/CompanyImage/CompanyImage";
import ChatConsultation from "src/components/ChatConsultation/ChatConsultation";
import Footer from "src/components/Footer/Footer";
import Chat from "src/components/Chat/Chat";

const Login = React.lazy(() => import("src/views/AuthScreen/Login/Login"));
const Checkouts = React.lazy(() => import("src/views/Checkouts/Checkouts"));
const Home = React.lazy(() => import("src/views/Home/Home"));
const News = React.lazy(() => import("src/views/News/News"));
const OrderRequirement = React.lazy(() => import("src/views/OrderRequirement/OrderRequirement"));
const OrderRequirementDetail = React.lazy(() => import("src/views/OrderRequirement/OrderRequirementDetail/OrderRequirementDetail"));
const ProductCategory = React.lazy(() => import("src/views/ProductCategory/ProductCategory"));
const ProductDetail = React.lazy(() => import("src/views/ProductDetail/ProductDetail"));
const StaticPage = React.lazy(() => import("src/views/StaticPage/StaticPage"));
const Tracking = React.lazy(() => import("src/views/Tracking/Tracking"));
const Notification = React.lazy(() => import('src/views/Notification/Notification'));
const NewDetail = React.lazy(() => import("src/views/News/NewDetail/NewDetail"));
import useProfile from "src/hooks/useProfile";
import styled from "styled-components";

const AppRouters: React.FC = () => {

  //State
  const [consultationAvailable, setConsultationAvailable] = useState(true);
  const location = useLocation();
  const [isAuth, setAuth] = useState(true);
  const profile = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes("auth-screen")) {
      setAuth(true);
      if (profile) navigate('/');
    } else {
      setAuth(false);
    }

  }, [location, navigate, profile])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location, location.pathname])

  //Main
  return (
    <>
      {!isAuth && <Header />}
      <PageContent>
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>Loading...</div>}>
          <Routes>
            <Route path="/auth-screen" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/product-category" element={<ProductCategory />} />
            <Route path="/product-detail/:productId" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkouts />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/order-requirement" element={<OrderRequirement />} />
            <Route path="/order-requirement/:orderRequirementId" element={<OrderRequirementDetail />} />
            <Route path="/static-page/:key" element={<StaticPage />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewDetail />} />
            <Route path="/tracking" element={<Tracking />} />
          </Routes>
        </Suspense>

        {consultationAvailable ? <ChatConsultation /> : null}
        {!isAuth && <Chat setConsultationAvailable={setConsultationAvailable} />}
        {!isAuth && <CompanyImage />}
        {!isAuth && <Footer />}
      </PageContent>
    </>

  );
};

export default AppRouters;

export const PageContent = styled.div`
  // max-height: calc(100vh - 100px);
`;
