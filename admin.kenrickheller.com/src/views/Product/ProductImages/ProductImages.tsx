import './ProductImages.css';
import React from 'react';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import ProductImportImages from './ProductImportImages/ProductImportImages';
import ProductImportAvatars from './ProductImportAvatars/ProductImportAvatars';


const ProductImages: React.FC = () => {
  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();

  const onImportProductImages = () => {
   
    addPopup({
      // view: {
      //   width: '700px',
      //   height: '150px',
      //   title: 'Import ảnh sản phẩm',
      //   isManualRemove: true,
      //   data: <ProductImportImages />,
      //   isContext: false,
      // },
    });
  };
  //End of function

  //Component
  const buttonComponent = () => {
    return (
      <div className="realm-import-excel_child mt-3">
        <button
          className="btn-add-realm m-3"
          onClick={() => {
            onImportProductImages();
          }}
        >
          Import ảnh sản phẩm
        </button>
      </div>
    );
  };
  //End of component

  //Main
  return <div className="realm-import-excel_contaier">{buttonComponent()}</div>;
};

export default ProductImages;
