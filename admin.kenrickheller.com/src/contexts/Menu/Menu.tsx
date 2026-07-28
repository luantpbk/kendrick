import React, { useEffect } from 'react';
import './Menu.css';
import { NavLink } from 'react-router-dom';
import ButtonNavLink from 'src/components/ButtonNavLink/ButtonNavLink';
import useProfile from 'src/hooks/useProfile';
import { useState } from 'react';
import { useAddPopup, useRemoveProfileInfo } from 'src/state/application/hooks';
import { EnumDisplayConfig, FunctionType, RolePermisionType } from 'src/api/models';
import { getFCMToken } from 'src/firebase';
import { useGetFunctionByUserId } from 'src/api/functionApi';
import { useDeleteFirebaseToken } from 'src/api/firebaseTokenApi';
import { uniqueId } from 'lodash';
import { BASE_SETTING_URL, BASE_WEB_URL } from 'src/constants';

interface IButtonNavLink {
  link?: string;
  activeClass?: string;
  iconName?: string;
  name?: string;
}

interface IMenuButtonLevel1 {
  mainButton: IButtonNavLink;
  buttonList: IButtonNavLink[];
}

enum EnumLevel {
  level_1 = 1,
  level_2 = 2,
}

window.addEventListener('contextmenu', (e) => e.preventDefault());

const Menu: React.FC = () => {
  //Value
  const profile = useProfile();
  //const notiCount = useGetNotiCount();

  //Local state
  const [isShowNav, setIsShowNav] = useState(false);
  const [isShowNavLv2, setIsShowNavLv2] = useState(false);
  const [level, setLevel] = useState<EnumLevel>(EnumLevel.level_1);

  const [buttonList, setButtonList] = useState<IButtonNavLink[]>(null);
  const [buttonLv1List, setButtonLv1List] = useState<IMenuButtonLevel1[]>([]);
  const [focusInput, setFocusInput] = useState(null);

  const [functionList, setFunctionList] = useState<RolePermisionType[]>(null);

  //Function
  const getFunctionByUserId = useGetFunctionByUserId();
  const addPopup = useAddPopup();

  //Component
  const menuLevel1 = () => {
    return (
      <div
        className={`menu-nav responsive mini-size${
          isShowNav && level == EnumLevel.level_1 ? ' on-mini-size' : ''
        }`}
        id="menu-nav"
      >
        <div
          className="btn-close-nav"
          onClick={() => {
            setIsShowNav(false);
            setIsShowNavLv2(false);
          }}
        >
          <i className="fa fa-chevron-circle-right"></i>
        </div>
        <div className="menu-nav-container">
          <div className="menu-nav-logo">
            <div className="nav-logo">
              <NavLink to="/">
                <div>
                  <img src={profile.info.avataUrl} />
                </div>
              </NavLink>
            </div>
            <div>{profile.info.fullName}</div>
          </div>
          <div className="menu-nav-body" id="menu-nav-body">
            {buttonLv1List
              ? buttonLv1List.map((value: IMenuButtonLevel1, index: number) => {
                  return (
                    <div
                      key={`menulv1button${index}`}
                      onClick={() => {
                        setButtonList(value.buttonList);
                        setFocusInput(index);
                        setLevel(EnumLevel.level_2);
                        setIsShowNavLv2(true);
                      }}
                    >
                      <ButtonNavLink
                        iconName={value.mainButton.iconName}
                        name={value.mainButton.name}
                        isFocus={focusInput == index}
                      />
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    );
  };

  const menuLevel2 = () => {
    return (
      <div
        className={`menu-nav responsive mini-size${
          level == EnumLevel.level_2 && isShowNavLv2 ? ' on-mini-size' : ''
        }`}
        id="menu-nav-level-2"
      >
        <div
          className="btn-close-nav"
          onClick={() => {
            setIsShowNavLv2(false);
            setIsShowNav(false);
          }}
        >
          <i className="fa fa-chevron-circle-right"></i>
        </div>
        <div className="menu-nav-container">
          <div className="menu-nav-logo">
            <div
              className="btn-back-lv-1"
              onClick={() => {
                setLevel(EnumLevel.level_1);
                setButtonList(null);
                setIsShowNav(true);
                setIsShowNavLv2(false);
              }}
            >
              <i className="fas fa-arrow-left"></i>
              <span style={{ marginLeft: 5 }}>Trở lại</span>
            </div>
          </div>
          <div className="menu-nav-body">
            {buttonList
              ? buttonList.map((value: IButtonNavLink, index: number) => {
                  return (
                    <div
                      key={`menulv2button${index}`}
                      onClick={() => {
                        setIsShowNavLv2(false);
                        setIsShowNav(false);
                      }}
                    >
                      <ButtonNavLink
                        link={value.link}
                        activeClass={value.activeClass}
                        iconName={value.iconName}
                        name={value.name}
                        buttonClass={'info100'}
                      />
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    );
  };

  //End of component

  useEffect(() => {
    if (profile) {
      getFunctionByUserId(profile.info.userId)
        .then((data) => {
          const fList = data;
          const temp: RolePermisionType[] = [];

          fList.map((value) => {
            let isAdd = true;
            temp.map((v) => {
              if (v.functionId == value.functionId || value.actions.View == false) {
                isAdd = false;
              }
            });
            if (isAdd) {
              temp.push(value);
            }
          });

          setFunctionList(temp);
        })
        .catch((error) => {
          addPopup({
            error: {
              title: 'Đã có lỗi xảy ra!',
              message: error.errorMessage,
            },
          });
        });
    }
  }, [addPopup, getFunctionByUserId, profile]);

  useEffect(() => {
    if (profile && functionList) {
      //menu lv2
      const fList: FunctionType[] = functionList;
      const webButtonList: IButtonNavLink[] = [];

      const accountButtonList: IButtonNavLink[] = [];

      //menu lv1
      const mainWebButton: IButtonNavLink = {
        link: BASE_WEB_URL,
        activeClass: 'focus',
        iconName: 'public',
        name: 'Web',
      };
      const mainAccountButton: IButtonNavLink = {
        link: BASE_SETTING_URL,
        activeClass: 'focus',
        iconName: 'people_alt',
        name: 'Hệ thống',
      };
      //end of menu lv1
      webButtonList.push({
        link: BASE_WEB_URL + '/translation',
        activeClass: 'focus',
        iconName: 'translate',
        name: 'Bản dich đa ngôn ngữ',
      });
      for (let i = 0; i < fList.length; i++) {
        const fId = fList[i].functionId;
        if (fId == EnumDisplayConfig.Loai_san_pham) {
          const temp = {
            link: `${BASE_WEB_URL}/realm`,
            activeClass: 'focus',
            iconName: 'inventory_2',
            name: 'Loại sản phẩm',
          };
          webButtonList.push(temp);
        } else if (fId == EnumDisplayConfig.Danh_muc_san_pham) {
          const temp = {
            link: `${BASE_WEB_URL}/category`,
            activeClass: 'focus',
            iconName: 'category',
            name: 'Danh mục sản phẩm',
          };
          webButtonList.push(temp);
        } else if (fId == EnumDisplayConfig.San_pham) {
          const temp = {
            link: `${BASE_WEB_URL}/product`,
            activeClass: 'focus',
            iconName: 'laptop',
            name: 'Sản phẩm',
          };
          webButtonList.push(temp);
        } else if (fId == EnumDisplayConfig.Banner) {
          const temp = {
            link: BASE_WEB_URL + '/banner',
            activeClass: 'focus',
            iconName: 'collections',
            name: 'Banner',
          };
          webButtonList.push(temp);
        } else if (fId == EnumDisplayConfig.AdvertisingBanner) {
          const temp = {
            link: BASE_WEB_URL + '/advertising-banner',
            activeClass: 'focus',
            iconName: 'collections',
            name: 'Ảnh quảng cáo',
          };
          webButtonList.push(temp);
        } else if (fId == EnumDisplayConfig.Logo) {
          const temp = {
            link: BASE_WEB_URL + '/logo',
            activeClass: 'focus',
            iconName: 'collections',
            name: 'Logo',
          };
          webButtonList.push(temp);
        } else if (fId == EnumDisplayConfig.Thong_tin) {
          const temp = {
            link: `${BASE_WEB_URL}/info`,
            activeClass: 'focus',
            iconName: 'feed',
            name: 'Thông tin',
          };
          webButtonList.push(temp);
        } else if (fId == EnumDisplayConfig.Hinh_anh_cong_ty) {
          const temp = {
            link: `${BASE_WEB_URL}/company-image`,
            activeClass: 'focus',
            iconName: 'image',
            name: 'Hình ảnh công ty',
          };
          webButtonList.push(temp);
        } else if (fId == EnumDisplayConfig.Trang_thong_tin_tinh) {
          const temp = {
            link: `${BASE_WEB_URL}/static-page`,
            activeClass: 'focus',
            iconName: 'feed',
            name: 'Trang thông tin',
          };
          webButtonList.push(temp);
        } else if (fId == EnumDisplayConfig.Danh_sach_dat_hang) {
          const temp = {
            link: `${BASE_WEB_URL}/order-requirement`,
            activeClass: 'focus',
            iconName: 'local_mall',
            name: 'Danh sách đặt hàng',
          };
          webButtonList.push(temp);
        } else if (fId == EnumDisplayConfig.Tin_tuc) {
          const temp = {
            link: `${BASE_WEB_URL}/news`,
            activeClass: 'focus',
            iconName: 'feed',
            name: 'Tin tức',
          };
          webButtonList.push(temp);
        } else if (fId == EnumDisplayConfig.Quan_ly_tai_khoan) {
          const temp = {
            link: `${BASE_SETTING_URL}/user`,
            activeClass: 'focus',
            iconName: 'face',
            name: 'Danh sách tài khoản',
          };
          const temp1 = {
            link: `${BASE_SETTING_URL}/account-balance-list`,
            activeClass: 'focus',
            iconName: 'paid',
            name: 'Danh sách tài khoản tiền',
          };
          const temp2 = {
            link: `${BASE_SETTING_URL}/customer-type`,
            activeClass: 'focus',
            iconName: 'airline_seat_recline_extra',
            name: 'Danh sách loại khách hàng',
          };
          const temp3 = {
            link: `${BASE_SETTING_URL}/user-customer-type`,
            activeClass: 'focus',
            iconName: 'support_agent',
            name: 'Quản lý loại khách hàng',
          };
          const temp4 = {
            link: `${BASE_SETTING_URL}/receiver-info`,
            activeClass: 'focus',
            iconName: 'contact_mail',
            name: 'Địa chỉ nhận hàng',
          };
          const temp5 = {
            link: `${BASE_SETTING_URL}/store`,
            activeClass: 'focus',
            iconName: 'storefront',
            name: 'Địa chỉ kho',
          };
          accountButtonList.push(temp);
          accountButtonList.push(temp1);
          accountButtonList.push(temp2);
          accountButtonList.push(temp3);
          accountButtonList.push(temp4);
          accountButtonList.push(temp5);
        } else if (fId == EnumDisplayConfig.Cau_hinh_phan_quyen) {
          const temp1 = {
            link: `${BASE_SETTING_URL}/api`,
            activeClass: 'focus',
            iconName: 'webhook',
            name: 'API',
          };
          const temp2 = {
            link: `${BASE_SETTING_URL}/module`,
            activeClass: 'focus',
            iconName: 'view_module',
            name: 'Danh sách module',
          };
          accountButtonList.push(temp1);
          accountButtonList.push(temp2);
        } else if (fId == EnumDisplayConfig.Phan_quyen) {
          const temp = {
            link: `${BASE_SETTING_URL}/role`,
            activeClass: 'focus',
            iconName: 'rule',
            name: 'Danh sách nhóm quyền',
          };
          accountButtonList.push(temp);
        } else if (fId == EnumDisplayConfig.Mau_email) {
          const temp = {
            link: `${BASE_SETTING_URL}/email-template`,
            activeClass: 'focus',
            iconName: 'email',
            name: 'Mẫu email',
          };
          const temp1 = {
            link: `${BASE_SETTING_URL}/notification-template`,
            activeClass: 'focus',
            iconName: 'notifications',
            name: 'Mẫu thông báo',
          };
          const temp2 = {
            link: `${BASE_SETTING_URL}/parameter`,
            activeClass: 'focus',
            iconName: 'settings',
            name: 'Thiết lập hệ thống',
          };
          accountButtonList.push(temp);
          accountButtonList.push(temp1);
          accountButtonList.push(temp2);
        } else if (fId == EnumDisplayConfig.PrintedTemplate) {
          const temp = {
            link: `${BASE_SETTING_URL}/printed-template`,
            activeClass: 'focus',
            iconName: 'print',
            name: 'Mẫu in',
          };
          accountButtonList.push(temp);
        }
      }

      const btnList: IMenuButtonLevel1[] = [
        {
          mainButton: mainWebButton,
          buttonList: webButtonList,
        },

        {
          mainButton: mainAccountButton,
          buttonList: accountButtonList,
        },
      ];

      setButtonLv1List(btnList);
    }
  }, [functionList, profile]);

  //Main
  return (
    profile && (
      <div className="container-fluid">
        <div className="row justify-content-center">
          {menuLevel1()}
          {menuLevel2()}
          <div
            className={`btn-mini-size responsive mini-size${isShowNav ? ' on-mini-size' : ''}`}
            id="btn-show-nav"
            onClick={() => {
              setIsShowNav(true);
              setIsShowNavLv2(true);
            }}
          >
            <i className="fa fa-chevron-circle-right" />
          </div>
        </div>
      </div>
    )
  );
};

export default Menu;
