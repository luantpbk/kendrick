import React, { useState, useEffect } from 'react';
import { BusinessType, UserCustomerType } from 'src/api/models';
import {
  useGetBusinessTypeList,
  useGetUserCustomerTypeById,
  useGetUserCustomerTypeByUserIdAndBusinessType,
} from 'src/api/userCustomerTypeApi';
import { useAddPopup } from 'src/state/application/hooks';
import './UserCustomerTypeSlideBar.css';

interface ISlideBarDetail {
  userCustomerTypeId: number;
}

const UserCustomerTypeSlideBar: React.FC<ISlideBarDetail> = (props) => {
  //Value
  const userCustomerTypeId = props.userCustomerTypeId;

  //State
  const [userId, setUserId] = useState(null);
  const [userCustomerTypeHistory, setUserCustomerTypeHistory] =
    useState<UserCustomerType[]>(null);
  const [businessTypeList, setBusinessTypeList] = useState<BusinessType[]>([]);

  //Function
  const addPopup = useAddPopup();
  const getUserCustomerTypeById = useGetUserCustomerTypeById();
  const getBusinessTypeList = useGetBusinessTypeList();
  const getUserCustomerTypeByUserIdAndBusinessType =
    useGetUserCustomerTypeByUserIdAndBusinessType();

  //useEffect
  useEffect(() => {
    getUserCustomerTypeById(userCustomerTypeId)
      .then((r) => {
        setUserId(r.userId);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra!',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getUserCustomerTypeById, userCustomerTypeId]);

  useEffect(() => {
    getBusinessTypeList()
      .then((data) => {
        setBusinessTypeList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [getBusinessTypeList]);

  //Main
  return (
    <div className="slide-bar-detail-container user">
      <div className="slide-bar-detail-form m-2">
        <div className="slide-bar-detail-title">LỊCH SỬ CẬP NHẬT</div>
      </div>
      <div className="slide-bar-price-container">
        <div className="slide-bar-sim-price-component">
          <div className="slide-bar-sim-price-date">Ngày hiệu lực</div>
          <div className="slide-bar-sim-price-price">Loại</div>
        </div>
        {userCustomerTypeHistory
          ? userCustomerTypeHistory.map((value, index: number) => {
              return (
                <div
                  className={`slide-bar-sim-price-component ${index % 2 == 0 ? 'chan' : 'le'}`}
                >
                  <div className="slide-bar-sim-price-date">{value.effectiveDate}</div>
                  <div className="slide-bar-sim-price-price">
                    {value.customerType.customerTypeTitle}
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default UserCustomerTypeSlideBar;
