import React, { useState, useEffect } from 'react';
import { useMapApiToFunction } from 'src/api/apiServiceApi';
import { useGetFunctionListByModuleId } from 'src/api/functionApi';
import { FunctionType, ModuleType } from 'src/api/models';
import { useGetModule } from 'src/api/moduleApi';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import './MapFunctionDetail.css';

interface IMapFunctionDetail {
  apiId: number;
  reloadFunction: (...args: any[]) => any;
}

const MapFunctionDetail: React.FC<IMapFunctionDetail> = (props) => {
  //Value
  const apiId = props.apiId;

  //State
  const [moduleId, setModuleId] = useState<any>('null');
  const [moduleList, setModuleList] = useState<ModuleType[]>(null);

  const [functionList, setFunctionList] = useState<FunctionType[]>(null);
  const [functionId, setFunctionId] = useState<any>('null');

  const [displayOrder, setDisplayOrder] = useState(null);
  const [focusInput, setFocusInput] = useState(null);

  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const getFunctionByModuleId = useGetFunctionListByModuleId();
  const getModule = useGetModule();
  const mapFunction = useMapApiToFunction();

  const onMapFunction = () => {
    mapFunction(apiId, functionId, displayOrder)
      .then(() => {
       
        addPopup({
          txn: {
            success: true,
            summary: 'Map function thành công',
          },
        });
        props.reloadFunction();
      })
      .catch((error) => {
       
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  };

  //Component
  //1
  const displayOrderInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 1 ? 'focus-input' : ''} ${
            displayOrder ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Thứ tự hiển thị</div>
          <input
            type="text"
            value={displayOrder}
            onChange={(event) => {
              setDisplayOrder(event.target.value);
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

  const moduleIdInput = () => {
    return (
      <select
        value={moduleId}
        className="sim-option"
        onChange={(event) => {
          setModuleId(Number(event.target.value));
          event.preventDefault();
        }}
      >
        <option value={'null'}>Chọn module</option>
        {moduleList
          ? moduleList.map((value: ModuleType) => {
              return <option value={value.moduleId}>{value.moduleName}</option>;
            })
          : null}
      </select>
    );
  };

  const functionIdInput = () => {
    return (
      <select
        value={functionId}
        className="sim-option"
        onChange={(event) => {
          setFunctionId(Number(event.target.value));
          event.preventDefault();
        }}
      >
        <option value={'null'}>Chọn function</option>
        {functionList
          ? functionList.map((value: FunctionType) => {
              return <option value={value.functionId}>{value.functionName}</option>;
            })
          : null}
      </select>
    );
  };
  //End of component

  //useEffect
  useEffect(() => {
    getModule()
      .then((data) => {
        setModuleList(data);
      })
      .catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra',
            message: error.errorMessage,
          },
        });
      });
  }, [addPopup, getModule]);

  useEffect(() => {
    if (moduleId && moduleId !== 'null') {
      getFunctionByModuleId(moduleId)
        .then((data) => {
          setFunctionList(data);
        })
        .catch((error) => {
          addPopup({
            error: {
              title: 'Đã có lỗi xảy ra!',
              message: error.errorMessage,
            },
          });
        });
    }
  }, [addPopup, getFunctionByModuleId, moduleId]);

  //Main
  return (
    <div className="user-detail-container">
      <div className="user-detai-input map-function">
        <form>
          {moduleIdInput()}
          {functionIdInput()}
          {displayOrderInput()}
        </form>
      </div>
      <div className="module-detail-btn-container">
        <div
          className="module-detail-btn"
          onClick={() => {
            onMapFunction();
          }}
        >
          Thêm
        </div>
      </div>
    </div>
  );
};

export default MapFunctionDetail;
