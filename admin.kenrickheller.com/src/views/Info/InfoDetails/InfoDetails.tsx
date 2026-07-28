import './InfoDetails.css';
import React, { useCallback, useEffect, useState } from 'react';
import Input from 'src/components/Input/Input';
import { useAddPopup } from 'src/state/application/hooks';
import {
  useGetCompanyInfoById,
  usePostCompanyInfo,
  usePutCompanyInfo,
} from 'src/api/companyInfo';


interface IInfoDetails {
  isDisable: boolean;
  companyInfoId: number;
  postProcess?: (...args: any[]) => void;
}

const InfoDetails: React.FC<IInfoDetails> = (props) => {
  const [companyInfoId, setCompanyInfoId] = useState<number>(props.companyInfoId);
  const [isDisable, setDisable] = useState<boolean>(props.isDisable);



  //Function
  const getCompanyInfoById = useGetCompanyInfoById();
  const postCompanyInfo = usePostCompanyInfo();
  const putCompanyInfo = usePutCompanyInfo();
  const addPopup = useAddPopup();

  //State
  const [key, setKey] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [value, setValue] = useState<string>();
  const [href, setHref] = useState<string>();
  const [displayOrder, setDisplayOrder] = useState<number>();

  useEffect(() => {
    if(companyInfoId) 
      getCompanyInfoById(companyInfoId).then((data) => {
        setKey(data.companyInfoKey);
        setTitle(data.companyInfoTitle);
        setValue(data.companyInfoValue);
        setHref(data.href);
        setDisplayOrder(data.displayOrder);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  }, [addPopup, companyInfoId, getCompanyInfoById]);

  const onSave = useCallback(() => {
    const isAdd = !companyInfoId;
    const api = isAdd? 
      postCompanyInfo(key, title, value, href, displayOrder) : 
      putCompanyInfo(companyInfoId, key, title, value, href, displayOrder);
    api.then((res) => {
      setCompanyInfoId(res.companyInfoId);
      setDisable(true);
      addPopup({
        txn: {
          success: true,
          summary: isAdd ? 'Thêm danh mục sản phẩm thành công' : 'Sửa danh mục sản phẩm thành công',
        }
      });
      if(props.postProcess) props.postProcess(res);
    }).catch((error) => addPopup({
      error: {
        message: error.errorMessage,
        title: 'Đã có lỗi xảy ra!',
      },
    }));

  }, [companyInfoId, key, title, value, href, displayOrder, addPopup]);

  return (
    <div className="container-fluid company-info-container">
      <div className='company-info-row'>
        <Input
          title='Từ khóa'
          require={true}
          disabled={isDisable}
          value={key}
          onChange={setKey}
        />
      </div>
      <div className='company-info-row'>
        <Input
          title='Tiêu đề'
          require={true}
          disabled={isDisable}
          value={title}
          onChange={setTitle}
        />
      </div>
      <div className='company-info-row'>
        <Input
          title='Giá trị'
          require={true}
          disabled={isDisable}
          value={value}
          onChange={setValue}
        />
      </div>
      <div className='company-info-row'>
        <Input
          title='Link (Đường dẫn)'
          require={true}
          disabled={isDisable}
          value={href}
          onChange={setHref}
        />
      </div>
      <div className='company-info-row'>
        <Input
          title='Thứ tự'
          require={true}
          disabled={isDisable}
          value={displayOrder}
          onChange={setDisplayOrder}
        />
      </div>
      <div className='company-info-row'>
        {isDisable ? null : (
          <button
            className="btn-add-company-info"
            onClick={onSave}
          >
            {!companyInfoId ? 'Thêm' : 'Lưu'}
          </button>
        )}
      </div>
    </div>
  );
};

export default InfoDetails;
