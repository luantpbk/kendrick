import React, { useState, useEffect } from 'react';
import { ParameterType } from 'src/api/models';
import { useGetParameterById, useGetParameterByKey } from 'src/api/parameterApi';
import { useAddPopup } from 'src/state/application/hooks';

interface ISlideBarDetail {
  parameterId: number;
}

const ParameterSlideBar: React.FC<ISlideBarDetail> = (props) => {
  //Value
  const parameterId = props.parameterId;

  const [parameterHistory, setParameterHistory] = useState<ParameterType[]>(null);

  //Function
  const addPopup = useAddPopup();
  const getParameterById = useGetParameterById();
  const getParameterByKey = useGetParameterByKey();

  //useEffect
  useEffect(() => {
    getParameterById(parameterId)
      .then((r) => {
        getParameterByKey(r.parameterKey)
          .then((data) => {
            setParameterHistory(data);
          })
          .catch((error) => {
            addPopup({
              error: {
                title: 'Đã có lỗi xảy ra!',
                message: error.errorMessage,
              },
            });
          });
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra!',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getParameterById, getParameterByKey, parameterId]);

  //Main
  return (
    <div className="slide-bar-detail-container user">
      <div className="slide-bar-detail-form m-2">
        <div className="slide-bar-detail-title">LỊCH SỬ CẬP NHẬT</div>
      </div>
      <div className="slide-bar-price-container">
        <div className="slide-bar-sim-price-component">
          <div className="slide-bar-sim-price-date">Ngày hiệu lực</div>
          <div className="slide-bar-sim-price-price">Giá trị</div>
        </div>
        {parameterHistory
          ? parameterHistory.map((value, index: number) => {
              return (
                <div
                  className={`slide-bar-sim-price-component ${index % 2 == 0 ? 'chan' : 'le'}`}
                >
                  <div className="slide-bar-sim-price-date">{value.effectiveDate}</div>
                  <div className="slide-bar-sim-price-price">{value.parameterValue}</div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default ParameterSlideBar;
