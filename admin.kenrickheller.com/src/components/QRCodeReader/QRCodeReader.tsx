import React, { useState } from 'react';
import './QRCodeReader.css';
import { QrReader } from 'react-qr-reader';
import { useAddPopup } from 'src/state/application/hooks';

interface IQRCodeReader {
  readQR?: (...arg: any[]) => void
}

const QRCodeReader: React.FC<IQRCodeReader> = (props) => {
  const addPopup = useAddPopup();
  const USER = "user";
  const ENVIROMENT = "environment";
  const [facingMode, setFacingMode] = useState<"environment" | "user">(ENVIROMENT);
  
  return (
    <div className="qrcode-reader-content">
      <QrReader
        onResult={(result: any) => {
          if (result) {
            const value = result?.text;
            addPopup({txn: {success: true, summary: `Đã nhận mã ${value}`}});
            if(props.readQR) props.readQR(value);
          }
        }}
        scanDelay={1000}
        constraints={{facingMode: facingMode}}
        containerStyle={{
          width: '400px',
          height: '400px',
          maxWidth: '80vw',
          maxHeight: '80vh'
        }}
      />
      <div className="switch-camera" onClick={() => setFacingMode(facingMode == USER? ENVIROMENT : USER)}>
        <span className="material-icons">sync</span>
      </div>
    </div>
  );
};

export default QRCodeReader;
