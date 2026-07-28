import './CategoryDisplayOption.css';
import React from 'react';
import { useState } from 'react';
import { ProductAttributeResultType, ProductCategoryAttributeType } from 'src/api/models';
import { useEffect } from 'react';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import CopyDisplayOption from '../CopyDisplayOption/CopyDisplayOption';
import { uniqueId } from 'lodash';
import {
  useGetAttributeList,
  useGetProductCategoryDisplayOption,
  usePutProductCategoryDisplayOption,
} from 'src/api/productCategoryApi';
import Input from 'src/components/Input';
import styled from 'styled-components';
import SelectBoxComponent from 'src/components/SelectBoxComponent/SelectBoxComponent';
import Checkbox from 'src/components/Checkbox';
import useModal from 'src/hooks/useModal';

interface ICategoryDisplayOption {
  productCategoryId: number;
}

const CategoryDisplayOption: React.FC<ICategoryDisplayOption> = (props) => {

  //State
  const [options, setOptions] = useState<ProductCategoryAttributeType[]>([]);
  const [attributeList, setAttributeList] = useState<ProductAttributeResultType[]>([]);
  const [refreshFlg, setRefreshFlg] = useState(false);

  //Functiion
  const getProductCategoryDisplayOption = useGetProductCategoryDisplayOption();
  const putCategoryDisplayOption = usePutProductCategoryDisplayOption();
  const addPopup = useAddPopup();
  const getAttributeList = useGetAttributeList();
const copyModal = useModal(CopyDisplayOption);


  const onSaveConfig = () => {
    putCategoryDisplayOption(props.productCategoryId, options)
      .then(() => {
        addPopup({
          txn: {
            success: true,
            summary: 'Thay đổi danh thuộc tính thành công!',
          },
        });
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        }, undefined, true);
      });
  };


  //End of component

  useEffect(() => {
    getProductCategoryDisplayOption(props.productCategoryId)
      .then((data) => {
        setOptions(data);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  }, [addPopup, getProductCategoryDisplayOption, props.productCategoryId, refreshFlg]);

  useEffect(() => {
    getAttributeList()
      .then((data) => {
        setAttributeList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [getAttributeList]);

  //Main
  return (
    <div className="display-option-container">
      
      <table className="display-option-table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Mã code</th>
            <th>D.sách SP</th>
            <th>Option</th>
            <th>Th.số KT</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, index: number) => {
            return (
              <tr key={`categorydisplayconfig${index}`} className={`${index % 2 == 0 ? 'even-row' : 'odd-row'}`}>
                <td>
                  <StyledInput>
                    <Input
                      width='140px'
                      require={true}
                      disabled={false}
                      value={option.attributeTitle}
                      onChange={(value) => {
                        option.attributeTitle = value;
                        setOptions([...options]);
                      }}
                    />
                  </StyledInput>
                </td>
                <td> 
                  <StyledInput>
                    <SelectBoxComponent
                      width='140px'
                      onChange={(value) => {
                        option.attributeName = value;
                        setOptions([...options]);
                      }}
                      isDisable={false}
                      placeholder={'Chọn loại sản phẩm'}
                      value={option.attributeName}
                      data={attributeList}
                      valueType={'attributeName'}
                      titleType={'attributeTitle'}
                    />
                  </StyledInput>
                </td>
                <td>
                  <div style={{margin: '0 auto', width: 'fit-content'}}>
                    <Checkbox 
                      value={option.isShowProduct == 1} 
                      disabled={false} 
                      onChange={(value) => {
                        option.isShowProduct = value? 1 : 0;
                        setOptions([...options]);
                      }} 
                    />
                  </div>
                </td>
                <td>
                  <div style={{margin: '0 auto', width: 'fit-content'}}>
                    <Checkbox 
                      value={option.isShowProductSerial == 1} 
                      disabled={false} 
                      onChange={(value) => {
                        option.isShowProductSerial = value? 1 : 0;
                        setOptions([...options]);
                      }} 
                    />
                  </div>
                </td>
                <td>  
                  <div style={{margin: '0 auto', width: 'fit-content'}}>
                    <Checkbox 
                      value={option.isShowProductSerialDetail == 1} 
                      disabled={false} 
                      onChange={(value) => {
                        option.isShowProductSerialDetail = value? 1 : 0;
                        setOptions([...options]);
                      }} 
                    />
                  </div>
                </td>
                <td>
                  <div className='delete-config' onClick={() => {
                    setOptions(options.filter(o => o !== option));
                  }}>
                    <span className="material-icons">delete</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="display-option-btn">
        <div className="add-config" onClick={() => {
          setOptions([...options, {
            productCategoryId: props.productCategoryId,
            attributeTitle: attributeList[0].attributeTitle,
            attributeName: attributeList[0].attributeName,
            isShowProduct: 0,
            isShowProductSerial: 0,
            isShowProductSerialDetail: 0,
          }]);
        }}>
          <span className="material-icons">add</span>Thêm
        </div>
        <div className="coppy-config" onClick={() => {
          copyModal.handlePresent({
            toId: props.productCategoryId,
            refresh: () => setRefreshFlg(!refreshFlg)
          }, 'SAO CHÉP CẤU HÌNH HIỂN THỊ')
        }}>
          <span className="material-icons">file_copy</span>Sao chép
        </div>
        <div className="save-config" onClick={onSaveConfig}>
          <span className="material-icons">save</span>Lưu lại
        </div>
      </div>
    </div>
  );
};

export default CategoryDisplayOption;


const StyledInput = styled.div`
  background: white;
  border-radius: 5px;
`;