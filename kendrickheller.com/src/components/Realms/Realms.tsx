import './Realms.css';
import React from 'react';
import { RealmType } from 'src/api/models';

interface IRealms {
  realms: RealmType[];
  selectedRealm?: RealmType;
  onSelect: (realm: RealmType) => void;
}


const Realms: React.FC<IRealms> = (props) => {

  const { realms, selectedRealm, onSelect } = props;

  //Main
  return (
    <div className={`realms-container`}>
      {realms.map((item, index) => {
        return (
          <div key={`realms${index}`}
            className={`realms-title ${item.productRealmId == selectedRealm?.productRealmId ? 'focus' : ''}`}
            onClick={() => onSelect(item)}
          >
            {item.productRealmName}
          </div>
        );
      })}
    </div>
  );
};

export default Realms;
