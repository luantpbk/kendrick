import { useCallback, useState } from 'react';
import React from 'react';
import './Tracking.css';
import { useAddPopup, useSetNotificationBadge } from 'src/state/application/hooks';
import useQuery from 'src/hooks/useQuery';
import { useEffect } from 'react';
import TrackingComponent from 'src/components/TrackingComponent/TrackingComponent';
import Images from 'src/assets/img';
import { useGetNotification } from 'src/api/notificationApi';
import useProfile from 'src/hooks/useProfile';

const Tracking: React.FC = () => {
  //Value
  const query = useQuery();
  const tid = query.get('tid');
  const profile = useProfile();

  //State
  const [trackingIdString, setTrackingIdString] = useState<string>(tid);
  const [trackingIdList, setTrackingIdList] = useState<string[]>([]);

  //Function
  const addPopup = useAddPopup();
  const getNotification = useGetNotification();
  const setNotificationBadge = useSetNotificationBadge();
  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingIdString(event.target.value);
  };

  const enterFunction = useCallback(
    (event) => {
      if (event.keyCode === 13) {
        //Do whatever when esc is pressed
        onOderTracking();
      }
    },
    [trackingIdString],
  );

  const onOderTracking = () => {
    if (trackingIdString !== '' && trackingIdString !== null) {
      const arr = trackingIdString.split(',');
      setTrackingIdList(arr);
    } else {
      addPopup({
        txn: {
          success: false,
          summary: 'Bạn chưa nhập Tracking ID',
        },
      });
      setTrackingIdList([]);
    }
  };
  //End of function

  useEffect(() => {
    document.addEventListener('keydown', enterFunction, false);
    return () => {
      document.removeEventListener('keydown', enterFunction, false);
    };
  }, [enterFunction]);

  useEffect(() => {
    if (trackingIdString !== null && trackingIdString !== '') {
      const arr = trackingIdString.split(',');
      setTrackingIdList(arr);
    } else {
      setTrackingIdList([]);
    }
  }, []);

  useEffect(() => {
    if (profile) {
      getNotification(1, 1)
        .then((data) => {
          setNotificationBadge(data.badge);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [getNotification, profile, setNotificationBadge]);

  //Main
  return (
    <div className="body tracking-container col-lg-11 col-12 p-0">
      <div className="tracking-title">Tracking</div>
      <div className="tracking-value-container pt-3 pb-3">
        <div className="tracking-input-container">
          <input
            className="tracking-input"
            type="text"
            value={trackingIdString}
            onChange={onChangeInput}
            placeholder="Mã phiếu gửi (Phân tách nhau bởi dấu , )"
          />
          <div
            className="tracking-btn"
            onClick={() => {
              onOderTracking();
            }}
          >
            Tìm kiếm
          </div>
        </div>
        {trackingIdList.length > 0 ? (
          trackingIdList.map((value, index) => {
            return <TrackingComponent key={index} trackingId={value} />;
          })
        ) : (
          <div className="trackingId-noData">
            Mã phiếu gửi (Tra nhiều bill bằng cách thêm dấu phẩy giữa các bill VD:
            392773302,392447363)
          </div>
        )}
        <img loading="lazy" className="tracking_no-code_img" src={Images.tracking} alt="tracking" />
      </div>
    </div>
  );
};

export default Tracking;
