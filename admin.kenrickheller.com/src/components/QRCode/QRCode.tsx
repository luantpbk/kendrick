import React, { useEffect, useState } from 'react';
import './QRCode.css';
import { useGetQRCode } from 'src/api/qrApi';
import { useAddPopup } from 'src/state/application/hooks';
import Loading from '../Loading/Loading';

interface IQRCode {
  url: string;
  isPopup?: boolean;
}

const QRCode: React.FC<IQRCode> = (props) => {
  const getQRCode = useGetQRCode();
  const addPopup = useAddPopup();
  const [blob, setBlob] = useState<Blob>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getQRCode({
      content: props.url,
    })
      .then((blob: Blob) => {
        setBlob(blob);
      })
      .catch((error) => {
        addPopup({
          error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
        });
      })
      .finally(() => setIsLoading(false));
  }, [addPopup, getQRCode, props.url])

  return (
    <div className="qr-popup">
      {isLoading && <Loading color='gray' size='40px'/>}
      {!isLoading && blob? <img src={URL.createObjectURL(blob)} /> : null}
    </div>
  );
};

export default QRCode;
