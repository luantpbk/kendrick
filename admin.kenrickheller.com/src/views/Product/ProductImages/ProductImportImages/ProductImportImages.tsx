import React, { useState } from 'react';
import { EnumDuplicateAction } from 'src/api/models';
import { useImportProductImages } from 'src/api/productApi';
import { useAddPopup, useRemovePopup, useReloadTable } from 'src/state/application/hooks';
import './ProductImportImages.css';

const ProductImportImages: React.FC = () => {
  //State
  const [file, setFile] = useState<any>(null);
  const [fileError, setFileError] = useState(null);
  const [duplicateAction, setDuplicateAction] = useState(null);
  const [duplicateActionError, setDuplicateActionError] = useState(null);

  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const reloadTable = useReloadTable();
  const importProductImages = useImportProductImages();

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

  //Validate
  const validateDuplicateAction = () => {
    let isContinue = true;

    if (!duplicateAction) {
      isContinue = false;
      setDuplicateActionError('Chưa chọn cách thức xử lý');
    } else setDuplicateActionError(null);

    return isContinue;
  };

  const onImportProductImages = () => {
    const isFile = validateFile();
    const isDuplicateAction = validateDuplicateAction();
    if (isFile && isDuplicateAction) {
      const formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append('file', file[i]);
      }

      importProductImages(formData, duplicateAction)
        .then((r) => {
         
          if (r) {
            addPopup({
              txn: {
                success: true,
                summary: 'Import ảnh sản phẩm thành công',
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
      // Thông báo đang tải ảnh
      showImportLoading();
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

  const showImportLoading = () => {
   
    addPopup({
      // view: {
      //   width: '700px',
      //   height: '150px',
      //   title: 'Import ảnh sản phẩm',
      //   isManualRemove: true,
      //   data: (
      //     <div className="import-loading">
      //       <i className="fas fa-spin fa-circle-notch"></i>
      //       <div className="import-loading-text">
      //         <p> Đang thực hiện tải lên ảnh sản phẩm.</p>
      //         <p>Công việc này có thể mất một chút thời gian, vui lòng chờ trong giây lát!</p>
      //       </div>
      //     </div>
      //   ),
      //   isContext: false,
      // },
    });
  };

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

  const duplicateActionOption = () => {
    return (
      <div>
        <select
          value={duplicateAction ? duplicateAction : 'default'}
          className="sim-price-detail-option"
          onChange={(event) => {
            if (event.target.value != 'default') {
              setDuplicateAction(event.target.value);
              event.preventDefault();
            }
          }}
          onBlur={() => {
            validateDuplicateAction();
          }}
        >
          <option value={'default'}>Xử lý nếu trùng lặp</option>
          <option value={EnumDuplicateAction.Ignore}>Bỏ qua</option>
          <option value={EnumDuplicateAction.Update}>Chèn thêm</option>
          <option value={EnumDuplicateAction.Error}>Báo lỗi</option>
        </select>
      </div>
    );
  };

  const duplicateActionComponent = () => {
    return (
      <div className="realm-import-excel_50">
        {duplicateActionOption()}
        <div style={{ color: 'red', paddingLeft: 2 }}>{duplicateActionError}</div>
      </div>
    );
  };

  const buttonComponent = () => {
    return (
      <div className="realm-import-excel_child mt-3">
        <button
          className="btn-add-realm"
          onClick={() => {
            onImportProductImages();
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
      <div>Tên ảnh đại diện chính là tên mã SP - VD: TL01</div>
      <div>
        Tên ảnh SP có cú pháp &lt;Mã SP&gt;{' '}
        <span className="material-icons space-bar">space_bar</span>
        &lt;Hậu tố&gt; - VD: TL01 (1)
      </div>
      <div className="realm-import-excel_child center">
        {fileComponent()}
        {duplicateActionComponent()}
      </div>
      {buttonComponent()}
    </div>
  );
};

export default ProductImportImages;
