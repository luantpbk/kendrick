import { uuidv4 } from '@firebase/util';
import React from 'react';
import './Printed.css';
import { PrintedItem } from './PrintedItem/PrintedItem';

interface IPrinted {
  values: string[];
}

const Printed: React.FC<IPrinted> = (props) => {
  return (
    <div className="printed-content">
      {props?.values?.map((value) => (
        <PrintedItem key={uuidv4()} value={value} />
      ))}
    </div>
  );
};

export default Printed;
