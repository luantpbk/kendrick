import React, { useState } from 'react';
import { useImportProductCategoryExcel } from 'src/api/productCategoryApi';
import { usePostSheetExcel } from 'src/api/fileApi';
import { EnumDuplicateAction } from 'src/api/models';
import { useAddPopup, useRemovePopup, useReloadTable } from 'src/state/application/hooks';
import 'src/share/ImportExcel.css';
import FileInput from 'src/components/FileInput';
import SelectBoxComponent from 'src/components/SelectBoxComponent/SelectBoxComponent';
import Input from 'src/components/Input';

const CategoryImportExcel: React.FC = () => {
  //Function
  const addPopup = useAddPopup();
  const reloadTable = useReloadTable();

  const postSheetExcel = usePostSheetExcel();
  const importProductCategoryExcel = useImportProductCategoryExcel();

  //State
  const [file, setFile] = useState<any>(null);
  const [fileError, setFileError] = useState(null);

  const [sheetName, setSheetName] = useState(null);
  const [sheetNameError, setSheetNameError] = useState(null);

  const [fromRowNum, setFromRowNum] = useState(1);
  const [toRowNum, setToRowNum] = useState(1);

  const [duplicateAction, setDuplicateAction] = useState(null);
  const [duplicateActionError, setDuplicateActionError] = useState(null);

  const [sheetNameList, setSheetNameList] = useState<string[]>([]);
  //End of state

  //Function
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

    if (isSheetName && isFile && isDuplicateAction) {
      const formData = new FormData();
      formData.append('file', file);

      importProductCategoryExcel(formData, sheetName, fromRowNum, toRowNum, duplicateAction)
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

  //Main
  return (
    <div className="import-excel-container">
      <div className='import-excel-info'>
        <FileInput 
          change={onChooseFile}
          blur={validateFile}
          fileError={fileError}
        />
      </div>
      <div className='import-excel-info'>
        <SelectBoxComponent
          width='100%'
          onChange={(value) => {
            setSheetName(value);
            validateSheetName();
          }}
          isDisable={false}
          require={true}
          name={'select-sheet'}
          placeholder={'Chọn Sheet'}
          value={sheetName}
          data={sheetNameList}
          valueType={''}
          titleType={''}
        />
        <div className='error-label'>{sheetNameError}</div>
      </div>
      <div className='import-excel-info'>
        <SelectBoxComponent
          width='100%'
          onChange={(value) => {
            setDuplicateAction(value);
            validateDuplicateAction();
          }}
          isDisable={false}
          name={'select-duplicate'}
          placeholder={'Xử lý nếu trùng'}
          value={duplicateAction}
          data={[
            {value: EnumDuplicateAction.Ignore, title: 'Bỏ qua'},
            {value: EnumDuplicateAction.Update, title: 'Cập nhật'},
            {value: EnumDuplicateAction.Error, title: 'Báo lỗi'},
          ]}
          valueType={'value'}
          titleType={'title'}
        />
        <div className='error-label'>{duplicateActionError}</div>
      </div>
      <div className='import-excel-info'>
        <Input  
          title='Từ dòng'
          require={true}
          disabled={false}
          value={fromRowNum}
          onChange={setFromRowNum}
          type='number'
        />
        <Input  
          title='Đến dòng'
          require={true}
          disabled={false}
          value={toRowNum}
          onChange={setToRowNum}
          type='number'
        />
      </div>
      <div className="import-excel-info">
        <button
          className="btn-import"
          onClick={() => {
            onImportExcel();
          }}
        >
          Import
        </button>
      </div>
    </div>
  );
};

export default CategoryImportExcel;
