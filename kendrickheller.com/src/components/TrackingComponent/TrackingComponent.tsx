import { useState } from 'react';
import React from 'react';
import { TrackingStatusType, TrackingType } from 'src/api/models';
import { useEffect } from 'react';
import { useGetOrderTracking } from 'src/api/backend-api';
import { useAddPopup } from 'src/state/application/hooks';
import './TrackingComponent.css';

interface ITrackingComponent {
  trackingId: string;
}
const TrackingComponent: React.FC<ITrackingComponent> = (props) => {
  //Value
  const trackingId = props.trackingId;

  //State
  const [trackingValue, setTrackingValue] = useState<TrackingType>(null);
  const [errorCode, setErrorCode] = useState<string>(null);

  //Function
  const getOrderTracking = useGetOrderTracking();
  const addPopup = useAddPopup();

  useEffect(() => {
    if (trackingId !== null && trackingId !== '') {
      getOrderTracking(trackingId)
        .then((data: TrackingType) => {
          setTrackingValue(data);
        })
        .catch((error) => {
          addPopup({
            txn: {
              success: false,
              summary: error.errorMessage,
            },
          });
          setErrorCode(error.errorMessage);
          setTrackingValue(null);
        });
    }
  }, [addPopup, getOrderTracking, trackingId]);

  //Main
  return trackingValue ? (
    <div className="tracking-wrapper">
      <div className="tracking-component-header">Mã vận đơn: {trackingId}</div>
      <div className="container-fluid tracking-detail-container">
        <div className="row justify-content-center">
          <div
            className={`col-lg-2 col-6 tracking-detail-child p-1 pt-3 pb-3${
              trackingValue.content.trackingDetail[0].status ? ' active' : ''
            }`}
          >
            <i className="fas fa-box-open"></i>
            <div>{trackingValue.content.trackingDetail[0].statusName}</div>
          </div>
          <div
            className={`col-lg-2 col-6 tracking-detail-child p-1 pt-3 pb-3${
              trackingValue.content.trackingDetail[1].status ? ' active' : ''
            }`}
          >
            <i className="fas fa-fighter-jet"></i>
            <div>{trackingValue.content.trackingDetail[1].statusName}</div>
          </div>
          <div
            className={`col-lg-2 col-6 tracking-detail-child p-1 pt-3 pb-3${
              trackingValue.content.trackingDetail[2].status ? ' active' : ''
            }`}
          >
            <i className="fas fa-recycle"></i>
            <div>{trackingValue.content.trackingDetail[2].statusName}</div>
          </div>
          <div
            className={`col-lg-2 col-6 tracking-detail-child p-1 pt-3 pb-3${
              trackingValue.content.trackingDetail[3].status ? ' active' : ''
            }`}
          >
            <i className="fas fa-shipping-fast"></i>
            <div>{trackingValue.content.trackingDetail[3].statusName}</div>
          </div>
          <div
            className={`col-lg-2 col-6 tracking-detail-child p-1 pt-3 pb-3${
              trackingValue.content.trackingDetail[4].status ? ' active' : ''
            }`}
          >
            <i className="fas fa-check-circle"></i>
            <div>{trackingValue.content.trackingDetail[4].statusName}</div>
          </div>
        </div>
      </div>
      <div className="tracking-status-container">
        {trackingValue.content.trackingStatus.map(
          (value: TrackingStatusType, index: number) => {
            return (
              <div className="tracking-status-child p-1">
                <div
                  className={`tracking-status-line ${
                    index == 0 || index + 1 == trackingValue.content.trackingStatus.length
                      ? 'half'
                      : ''
                  } ${
                    index == 0
                      ? 'first'
                      : index + 1 == trackingValue.content.trackingStatus.length
                      ? 'last'
                      : ''
                  } ${trackingValue.content.trackingStatus.length == 1 ? 'none' : ''}`}
                ></div>
                <div className="tracking-status-point-container">
                  <div className="tracking-status-point"></div>
                </div>
                <div className="tracking-status-component">
                  <div>{value.date}</div>
                  <div>{value.statusName}</div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  ) : errorCode ? (
    <div className="tracking-wrapper">
      <div className="tracking-component-header">Mã vận đơn: {trackingId}</div>
      <div className="container-fluid tracking-detail-container">LỖI: {errorCode}</div>
    </div>
  ) : (
    <div>Đang tải</div>
  );
};

export default TrackingComponent;
