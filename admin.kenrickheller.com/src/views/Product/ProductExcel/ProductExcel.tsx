import './ProductExcel.css';
import React from 'react';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import {
  useDownLoadFullProductExcelTemplate,
  useDownLoadProductExcelTemplate,
  useExportProductExcel,
} from 'src/api/productApi';
import ProductImportExcel from './ProductImportExcel/ProductImportExcel';


const ProductExcel: React.FC = () => {
  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();

  const downLoadProductExcelTemplate = useDownLoadProductExcelTemplate();
  const downLoadFullProductExcelTemplate = useDownLoadFullProductExcelTemplate();
  const exportProductExcel = useExportProductExcel();

  const onDownloadProductExcelTemplate = () => {
   
    downLoadProductExcelTemplate()
      .then((data) => {
        console.log(data);
        const productRealmTemplate = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = productRealmTemplate;
        tempLink.setAttribute('download', 'product-template.xlsx');
        tempLink.click();
      })
      .catch((error) => {
        console.log(error);
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  };

  const onDownloadFullProductExcelTemplate = () => {
   
    downLoadFullProductExcelTemplate()
      .then((data) => {
        console.log(data);
        const productRealmTemplate = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = productRealmTemplate;
        tempLink.setAttribute('download', 'product-template.xlsx');
        tempLink.click();
      })
      .catch((error) => {
        console.log(error);
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  };

  const onExportProductExcel = () => {
   
    exportProductExcel()
      .then((data) => {
        console.log(data);
        const productRealmTemplate = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = productRealmTemplate;
        tempLink.setAttribute('download', 'products.xlsx');
        tempLink.click();
      })
      .catch((error) => {
        console.log(error);
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  };

  const onImportProductExcel = () => {
   
    addPopup({
      // view: {
      //   width: '800px',
      //   height: '380px',
      //   title: 'Import Product',
      //   isManualRemove: true,
      //   data: <ProductImportExcel isFull={false} />,
      //   isContext: false,
      // },
    });
  };

  const onImportFullProductExcel = () => {
   
    addPopup({
      // view: {
      //   width: '800px',
      //   height: '380px',
      //   title: 'Import Product',
      //   isManualRemove: true,
      //   data: <ProductImportExcel isFull={true} />,
      //   isContext: false,
      // },
    });
  };
  //End of function

  //Component
  const buttonComponent = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <button
              className="btn-add-realm m-3 bg-success"
              onClick={() => {
                onExportProductExcel();
              }}
            >
              Export DS sản phẩm
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <button
              className="btn-add-realm m-3"
              onClick={() => {
                onDownloadProductExcelTemplate();
              }}
            >
              Download template
            </button>
          </div>
          <div className="col-sm-6">
            <button
              className="btn-add-realm m-3"
              onClick={() => {
                onImportProductExcel();
              }}
            >
              Import DS sản phẩm
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <button
              className="btn-add-realm m-3"
              onClick={() => {
                onDownloadFullProductExcelTemplate();
              }}
            >
              Download template tổng hợp
            </button>
          </div>
          <div className="col-sm-6">
            <button
              className="btn-add-realm m-3"
              onClick={() => {
                onImportFullProductExcel();
              }}
            >
              Import DS sản phẩm tổng hợp
            </button>
          </div>
        </div>
      </div>
    );
  };
  //End of component

  //Main
  return <div className="realm-import-excel_contaier">{buttonComponent()}</div>;
};

export default ProductExcel;
