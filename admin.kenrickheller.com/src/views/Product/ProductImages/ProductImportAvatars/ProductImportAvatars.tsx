import React, { useState } from 'react';

import { useImportProductAvatars } from 'src/api/productApi';
import { useAddPopup, useRemovePopup, useReloadTable } from 'src/state/application/hooks';
import './ProductImportAvatars.css';

const ProductImportAvatars: React.FC = () => {
  //State
  const [file, setFile] = useState<any>(null);
  const [fileError, setFileError] = useState(null);

  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const reloadTable = useReloadTable();
  const importProductAvatars = useImportProductAvatars();

  const onChooseFile = (event: any) => {
    const _file = event.target.files;
    if (_file) {
      setFile(_file);
    }
  };

  //Validate
  const validateFile = () => {
    let isContinue = true;

    if (!file) {
      isContinue = false;
      setFileError('Chưa chọn file');
    } else setFileError(null);

    return isContinue;
  };

  const onImportProductAvatars = () => {
    const isFile = validateFile();

    if (isFile) {
      const formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append('file', file[i]);
      }

      importProductAvatars(formData)
        .then((r) => {
          if (r) {
            addPopup({
              txn: {
                success: true,
                summary: 'Import avatar sản phẩm thành công',
              },
            });
          } else {
            addPopup({
              txn: {
                success: false,
                summary: 'Import thất bại',
              },
            });
          }
          reloadTable();
        })
        .catch((error) => {
          addPopup({
            error: {
              title: 'Đã có lỗi xảy ra',
              message: error.errorMessage,
            },
          });
          reloadTable();
        });
      
      
    } else {
      addPopup({
        txn: {
          success: false,
          summary: 'Chưa nhập đủ thông tin',
        },
      });
    }
  };
  //End of function

  //Component
  const fileComponent = () => {
    return (
      <div className="realm-import-excel_50">
        <div>
          <input
            type="file"
            onChange={(event) => {
              onChooseFile(event);
            }}
            onBlur={() => {
              validateFile();
            }}
            multiple
          />
          <div style={{ color: 'red', paddingLeft: 2 }}>{fileError}</div>
        </div>
      </div>
    );
  };

  const noteComponent = () => {
    return (
      <div className="realm-import-excel_50">
        <div>
          <>
            <div className={`add-order-input validate-input`}>
              <div className="add-order-input-title">Chú ý</div>
              <input type="text" value={'Tên ảnh là mã SP'} disabled={true} />
            </div>
          </>
        </div>
      </div>
    );
  };

  const buttonComponent = () => {
    return (
      <div className="realm-import-excel_child mt-3">
        <button
          className="btn-add-realm"
          onClick={() => {
            onImportProductAvatars();
          }}
        >
          Import
        </button>
      </div>
    );
  };
  //End of component

  //Main
  return (
    <div className="realm-import-excel_contaier">
      <div className="realm-import-excel_child center">
        {fileComponent()}
        {noteComponent()}
      </div>
      {buttonComponent()}
    </div>
  );
};

export default ProductImportAvatars;
