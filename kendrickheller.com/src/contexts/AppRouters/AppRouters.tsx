import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "src/views/AuthScreen/Login/Login";
import Checkouts from "src/views/Checkouts/Checkouts";
import Home from "src/views/Home/Home";
import News from "src/views/News/News";
import OrderRequirement from "src/views/OrderRequirement/OrderRequirement";
import OrderRequirementDetail from "src/views/OrderRequirement/OrderRequirementDetail/OrderRequirementDetail";
import ProductCategory from "src/views/ProductCategory/ProductCategory";
import ProductDetail from "src/views/ProductDetail/ProductDetail";
import StaticPage from "src/views/StaticPage/StaticPage";
import Tracking from "src/views/Tracking/Tracking";
import Notification from 'src/views/Notification/Notification';
import Header from "src/components/Header/Header";
import CompanyImage from "src/components/CompanyImage/CompanyImage";
import ChatConsultation from "src/components/ChatConsultation/ChatConsultation";
import Footer from "src/components/Footer/Footer";
import { useEffect, useState } from "react";
import Chat from "src/components/Chat/Chat";
import useProfile from "src/hooks/useProfile";
import NewDetail from "src/views/News/NewDetail/NewDetail";
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
