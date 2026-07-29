import React, { useCallback, useEffect, useState } from 'react';
import { TranslationType } from 'src/api/models';

import { useAddPopup } from 'src/state/application/hooks';
import './TranslationDetail.css';
import Input from 'src/components/Input';
import ButtonComponent from 'src/components/ButtonComponent/ButtonComponent';
import { useGetTranslationById, usePostTranslation, usePutTranslation } from 'src/api/translationApi';

interface ITranslationDetail {
  translationId: number;
  isDisable: boolean;
  isPopup?: boolean;
  postProcess?: (...args: any[]) => void;
}

const TranslationDetail: React.FC<ITranslationDetail> = (props) => {
  //Function
  const postTranslation = usePostTranslation();
  const putTranslation = usePutTranslation();
  const getTranslationById = useGetTranslationById();
  const addPopup = useAddPopup();

  //State
  const [translationId, settranslationId] = useState<number>(props.translationId);
  const [isDisable, setDisable] = useState<boolean>(props.isDisable);
  const [code, setCode] = useState<string>();
  const [codeError, setCodeError] = useState<string>();
  const [vi, setVi] = useState<string>();
  const [en, setEn] = useState<string>();
  const [jp, setJp] = useState<string>();
  const [fr, setFr] = useState<string>();
  const [de, setDe] = useState<string>();
  const [cn, setCn] = useState<string>();
  const [it, setIt] = useState<string>();
  const [et, setEt] = useState<string>();
  const [pt, setPt] = useState<string>();
  const [displayOrder, setDisplayOrder] = useState<number>();

  //Init
  useEffect(() => {
    if (translationId) {
      getTranslationById(translationId)
        .then((data) => {
          setCode(data.code);
          setVi(data.vi);
          setEn(data.en);
          setJp(data.jp);
          setFr(data.fr);
          setDe(data.de);
          setCn(data.cn);
          setIt(data.it);
          setPt(data.pt);
          setEt(data.et);
          setDisplayOrder(data.displayOrder);
        })
        .catch((error) => {
          addPopup({
            error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
          });
        });
    }
  }, [addPopup, getTranslationById, translationId]);

  const validateCode = () => {
    setCodeError(code && code != '' ? undefined : 'Chưa nhập mã');
    return code && code != '';
  };

  const onSave = () =>
    new Promise((resolve, reject) => {
      if (validateCode()) {
        const body: TranslationType = {
          translationId: translationId,
          displayOrder: displayOrder,
          code: code,
          vi: vi,
          en: en,
          jp: jp,
          fr: fr,
          de: de,
          cn: cn,
          it: it,
          et: et,
          pt: pt
        };
        const isAdd = !props.translationId;
        const api = isAdd ? postTranslation(body) : putTranslation(body);
        api
          .then((res: TranslationType) => {
            settranslationId(res.translationId);
            setDisable(true);
            resolve(true);
            if (props.postProcess) props.postProcess(res);
          })
          .catch((error) => {
            addPopup({
              error: {
                message: error.errorMessage,
                title: 'Đã có lỗi xảy ra, vui lòng thử lại!',
              },
            });
            reject(false);
          });
      } else {
        addPopup(
          {
            error: {
              title: 'Chưa nhập đủ thông tin',
              message: `${codeError ?? ''}
            ${codeError ?? ''}`,
            },
          },
          undefined,
          false,
          3000,
        );
        reject(false);
      }
    });
  //End of function

  return (
    <div className="container-fluid translation-detail-container">
      <div className="translation-detail-row">
        <Input title="Mã" require={true} value={code} onChange={setCode} disabled={isDisable} />
      </div>
      <div className="translation-detail-row">
        <Input title="Tiếng Việt" value={vi} onChange={setVi} disabled={isDisable} />
      </div>
      <div className="translation-detail-row">
        <Input title="Tiếng Anh" value={en} onChange={setEn} disabled={isDisable} />
      </div>
      <div className="translation-detail-row">
        <Input title="Tiếng Nhật" value={jp} onChange={setJp} disabled={isDisable} />
      </div>
      <div className="translation-detail-row">
        <Input title="Tiếng Pháp" value={fr} onChange={setFr} disabled={isDisable} />
      </div>
      <div className="translation-detail-row">
        <Input title="Tiếng Đức" value={de} onChange={setDe} disabled={isDisable} />
      </div>
      <div className="translation-detail-row">
        <Input title="Tiếng Trung" value={cn} onChange={setCn} disabled={isDisable} />
      </div>
      <div className="translation-detail-row">
        <Input title="Tiếng Ý" value={it} onChange={setIt} disabled={isDisable} />
      </div>
      <div className="translation-detail-row">
        <Input title="Tiếng BĐN" value={pt} onChange={setPt} disabled={isDisable} />
      </div>
      <div className="translation-detail-row">
        <Input title="Tiếng TBN" value={et} onChange={setEt} disabled={isDisable} />
      </div>
      <div className="translation-detail-row">
        <Input
          title="Thứ tự"
          disabled={isDisable}
          value={displayOrder}
          onChange={setDisplayOrder}
        />
      </div>

      {isDisable ? null : (
        <ButtonComponent
          icon="save"
          title={!translationId ? 'THÊM' : 'LƯU'}
          onClick={onSave}
          loader={true}
        />
      )}
    </div>
  );
};

export default TranslationDetail;
