import React, { useState, useEffect } from 'react';
import { ModuleType } from 'src/api/models';
import { useGetModuleById, usePostModule, usePutModule } from 'src/api/moduleApi';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import './ModuleDetail.css';

export enum EnumModuleDetailConfig {
  view = 1,
  add = 2,
  edit = 3,
  change_pass = 4,
}

interface IModuleDetail {
  config: EnumModuleDetailConfig;
  moduleId?: number;
  reloadFunction: (...args: any[]) => any;
}

const ModuleDetail: React.FC<IModuleDetail> = (props) => {
  //Value
  const config = props.config;
  const moduleId = props.moduleId;

  //State
  const [moduleName, setModuleName] = useState(null);
  const [moduleNameError, setModuleNameError] = useState(null);

  const [description, setDescription] = useState(null);
  const [displayOrder, setDisplayOrder] = useState(null);

  const [focusInput, setFocusInput] = useState(null);

  //Function
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const postModule = usePostModule();
  const putModule = usePutModule();
  const getModuleById = useGetModuleById();

  const onAddModule = () => {
    const temp: ModuleType = {
      displayOrder: displayOrder,
      moduleName: moduleName,
      description: description,
    };
    postModule(temp)
      .then(() => {
       
        addPopup({
          txn: {
            success: true,
            summary: 'Thêm module thành công',
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

  const onEditModule = () => {
    if (moduleId) {
      const temp: ModuleType = {
        displayOrder: displayOrder,
        moduleName: moduleName,
        description: description,
        moduleId: moduleId,
      };
      putModule(temp)
        .then(() => {
         
          addPopup({
            txn: {
              success: true,
              summary: 'Sửa module thành công',
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
    } else {
      addPopup({
        txn: {
          success: false,
          summary: 'Đã có lỗi xảy ra',
        },
      });
    }
  };

  //Validate
  const validateModuleName = () => {
    let isContinue = true;
    if (!moduleName || moduleName == '') {
      isContinue = false;
      setModuleNameError('Chưa nhập tên module');
    } else setModuleNameError(null);
    return isContinue;
  };

  //Component
  //1
  const moduleNameInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 1 ? 'focus-input' : ''} ${
            moduleName ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Module Name</div>
          <input
            type="text"
            value={moduleName}
            onChange={(event) => {
              setModuleName(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(1);
            }}
            onBlur={() => {
              validateModuleName();
              setFocusInput(null);
            }}
            autoFocus={focusInput == 1}
          />
        </div>
        <div style={{ color: 'red', paddingLeft: 2 }}>{moduleNameError}</div>
      </>
    );
  };

  //2
  const descriptionInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 2 ? 'focus-input' : ''} ${
            description ? 'validate-input' : ''
          }`}
        >
          <div className="add-order-input-title">Description</div>
          <input
            type="text"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            onFocus={() => {
              setFocusInput(2);
            }}
            onBlur={() => {
              setFocusInput(null);
            }}
            autoFocus={focusInput == 3}
          />
        </div>
      </>
    );
  };

  //3
  const displayOrderInput = () => {
    return (
      <>
        <div
          className={`add-order-input ${focusInput == 3 ? 'focus-input' : ''} ${
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
              setFocusInput(3);
            }}
            onBlur={() => {
              setFocusInput(null);
            }}
            autoFocus={focusInput == 3}
          />
        </div>
      </>
    );
  };
  //End of component

  useEffect(() => {
    if (moduleId) {
      getModuleById(moduleId)
        .then((data) => {
          setModuleName(data.moduleName);
          setDescription(data.description);
          setDisplayOrder(data.displayOrder);
        })
        .catch((error) => {
          addPopup({
            error: {
              title: 'Đã có lỗi xảy ra',
              message: error.errorMessage,
            },
          });
        });
    }
  }, [addPopup, getModuleById, moduleId]);

  //Main
  return (
    <div className="user-detail-container">
      <div className="user-detai-input">
        <form>
          {moduleNameInput()}
          {descriptionInput()}
          {displayOrderInput()}
        </form>
      </div>
      <div className="module-detail-btn-container">
        {config == EnumModuleDetailConfig.add ? (
          <div
            className="module-detail-btn"
            onClick={() => {
              onAddModule();
            }}
          >
            Thêm
          </div>
        ) : config == EnumModuleDetailConfig.edit ? (
          <div
            className="module-detail-btn"
            onClick={() => {
              onEditModule();
            }}
          >
            Sửa
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ModuleDetail;
