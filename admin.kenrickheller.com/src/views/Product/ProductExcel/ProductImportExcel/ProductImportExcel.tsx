import React, { useState, useEffect } from 'react';
import { useGetProductCategory } from 'src/api/productCategoryApi';
import { usePostSheetExcel } from 'src/api/fileApi';
import { ProductCategoryType, EnumDuplicateAction } from 'src/api/models';
import { useImportFullProductExcel, useImportProductExcel } from 'src/api/productApi';
import { useAddPopup, useRemovePopup, useReloadTable } from 'src/state/application/hooks';
import './ProductImportExcel.css';

interface IProductImportExcel {
  isFull: boolean;
}

const ProductImportExcel: React.FC<IProductImportExcel> = (props) => {
  //State
  const [file, setFile] = useState<any>(null);
  const [fileError, setFileError] = useState(null);

  const [productCategoryId, setProductCategoryId] = useState(null);
  const [productCategoryIdError, setProductCategoryIdError] = useState(null);
  const [productCategoryList, setProductCategoryList] = useState<ProductCategoryType[]>(null);

  const [sheetName, setSheetName] = useState(null);
  const [sheetNameError, setSheetNameError] = useState(null);

  const [fromRowNum, setFromRowNum] = useState(1);
  const [toRowNum, setToRowNum] = useState(1);

  const [duplicateAction, setDuplicateAction] = useState(null);
  const [duplicateActionError, setDuplicateActionError] = useState(null);

  const [focusInput, setFocusInput] = useState(null);
  const [sheetNameList, setSheetNameList] = useState<string[]>([]);
  //End of state

  //Function
  const getProductCategory = useGetProductCategory();
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const reloadTable = useReloadTable();

  const postSheetExcel = usePostSheetExcel();
  const importProductExcel = useImportProductExcel();
  const importFullProductExcel = useImportFullProductExcel();

  const onChooseFile = (event: any) => {
    const _file = event.target.files[0];
    setFile(_file);
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    postSheetExcel(formData)
      .then((data) => {
        setSheetNameList(data);
      })
      .catch((error) => {
        addPopup({
          error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
        });
      });
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

  const validateProductCategoryId = () => {
    let isContinue = true;

    if (!productCategoryId) {
      isContinue = false;
      setProductCategoryIdError('Chưa chọn danh mục sản phẩm');
    } else setProductCategoryIdError(null);

    return isContinue;
  };

  const validateSheetName = () => {
    let isContinue = true;

    if (!sheetName || sheetName == '') {
      isContinue = false;
      setSheetNameError('Chưa chọn sheetName');
    } else setSheetNameError(null);

    return isContinue;
  };

  const validateFile = () => {
    let isContinue = true;

    if (!file) {
      isContinue = false;
      setFileError('Chưa chọn file');
    } else setFileError(null);

    return isContinue;
  };
  //End of validate

  const onImportExcel = () => {
    const isSheetName = validateSheetName();
    const isFile = validateFile();
    const isDuplicateAction = validateDuplicateAction();
    const isProductCategoryId = validateProductCategoryId();

    if (isSheetName && isFile && isDuplicateAction && isProductCategoryId) {
      const formData = new FormData();
      formData.append('file', file);

      importProductExcel(
        formData,
        sheetName,
        fromRowNum,
        toRowNum,
        duplicateAction,
        productCategoryId,
      )
        .then((r) => {
          if (r) {
            addPopup({
              txn: {
                success: true,
                summary: 'Import thành công',
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

  const onImportFullExcel = () => {
    const isSheetName = validateSheetName();
    const isFile = validateFile();
    const isDuplicateAction = validateDuplicateAction();

    if (isSheetName && isFile && isDuplicateAction) {
      const formData = new FormData();
      formData.append('file', file);

      importFullProductExcel(formData, sheetName, fromRowNum, toRowNum, duplicateAction)
        .then((r) => {
          if (r) {
            addPopup({
              txn: {
                success: true,
                summary: 'Import thành công',
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
  const fromRowNumInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 1 ? 'focus-input' : ''} ${
            fromRowNum ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Từ dòng</div>
          <input
            type="number"
            value={fromRowNum}
            onChange={(event) => {
              setFromRowNum(Number(event.target.value));
            }}
            onFocus={() => {
              setFocusInput(1);
            }}
            onBlur={() => {
              setFocusInput(null);
            }}
            autoFocus={focusInput == 1}
          />
        </div>
      </>
    );
  };

  const toRowNumInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 2 ? 'focus-input' : ''} ${
            toRowNum ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Đến dòng</div>
          <input
            type="number"
            value={toRowNum}
            onChange={(event) => {
              setToRowNum(Number(event.target.value));
            }}
            onFocus={() => {
              setFocusInput(2);
            }}
            onBlur={() => {
              setFocusInput(null);
            }}
            autoFocus={focusInput == 2}
          />
        </div>
      </>
    );
  };

  const sheetNameOption = () => {
    return (
      <div>
        <div>
          <select
            value={sheetName}
            className="sim-price-detail-option"
            onChange={(event) => {
              if (event.target.value != 'default') {
                setSheetName(event.target.value);
                event.preventDefault();
              }
            }}
            onBlur={() => {
              validateSheetName();
            }}
          >
            <option value={'default'}>Chọn sheet</option>
            {sheetNameList
              ? sheetNameList.map((value) => {
                  return <option value={value}>{value}</option>;
                })
              : null}
          </select>
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{sheetNameError}</div>
      </div>
    );
  };

  const productCategoryIdOption = () => {
    return (
      <div>
        <div>
          <select
            value={productCategoryId}
            className="sim-price-detail-option"
            onChange={(event) => {
              if (event.target.value != 'default') {
                setProductCategoryId(event.target.value);
                event.preventDefault();
              }
            }}
            onBlur={() => {
              validateProductCategoryId();
            }}
          >
            <option value={'default'}>Chọn danh mục sản phẩm</option>
            {productCategoryList
              ? productCategoryList.map((value) => {
                  return (
                    <option value={value.productCategoryId}>{value.productCategoryName}</option>
                  );
                })
              : null}
          </select>
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{productCategoryIdError}</div>
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
          <option value={EnumDuplicateAction.Update}>Cập nhật</option>
          <option value={EnumDuplicateAction.Error}>Báo lỗi</option>
        </select>
      </div>
    );
  };

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
          />
          <div style={{ color: 'red', paddingLeft: 2 }}>{fileError}</div>
        </div>
      </div>
    );
  };

  const rowNumComponent = () => {
    return (
      <div className="realm-import-excel_50">
        <div>{fromRowNumInput()}</div>
        <div>{toRowNumInput()}</div>
      </div>
    );
  };

  const sheetNameAndProductCategoryIdComponent = (isFull: boolean) => {
    return (
      <div className="realm-import-excel_50">
        {sheetNameOption()}
        {isFull ? null : productCategoryIdOption()}
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
            props.isFull ? onImportFullExcel() : onImportExcel();
          }}
        >
          Import
        </button>
      </div>
    );
  };
  //End of component

  useEffect(() => {
    getProductCategory()
      .then((data) => {
        setProductCategoryList(data);
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
  }, [addPopup, getProductCategory]);

  //Main
  return (
    <div className="realm-import-excel_contaier">
      <div className="realm-import-excel_child">
        {fileComponent()}
        {rowNumComponent()}
      </div>
      <div className="realm-import-excel_child">
        {sheetNameAndProductCategoryIdComponent(props.isFull)}
        {duplicateActionComponent()}
      </div>
      {buttonComponent()}
    </div>
  );
};

export default ProductImportExcel;
