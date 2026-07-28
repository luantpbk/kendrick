import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import './PrintedItem.css';

interface IPrintedItem {
  value: string;
}

export const PrintedItem: React.FC<IPrintedItem> = (props) => {
  const printedRef = useRef();
  return (
    <div className="print-item">
      <ReactToPrint
        trigger={() => {
          // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
          // to the root node of the returned component as it will be overwritten.
          return (
            <button className="print-button">
              <span className="material-icons icon-print">print</span>
              <span>In</span>
            </button>
          );
        }}
        content={() => printedRef.current}
      />
      <div className="print-content" ref={printedRef}>
        <div
          dangerouslySetInnerHTML={{
            __html: props.value,
          }}
        />
      </div>
    </div>
  );
};
