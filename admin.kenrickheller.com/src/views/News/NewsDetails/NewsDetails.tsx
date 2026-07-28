import './NewsDetails.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Input from 'src/components/Input/Input';
import { useAddPopup, useRemovePopup } from 'src/state/application/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import ToolBar from 'src/components/ToolBar/ToolBar';
import { EnumAction, EventButton, ImageType } from 'src/api/models';
import { uniqueId } from 'lodash';
import MonacoEditor from '@monaco-editor/react';
import { Editor } from '@tinymce/tinymce-react';
import { EnumViewType } from 'src/common/enum/EnumViewType';
import { LEFT_MOUSE_BUTTON } from 'src/common/constant/Constant';
import Tabs from 'src/components/Tabs';
import {
  useGetNewsById,
  usePostNews,
  usePutNews,
  useGetNewsImage,
  useAddNewsImage,
  useDeleteNewsImage,
} from 'src/api/newsApi';
import { BASE_WEB_URL } from 'src/constants';

enum TabKey {
  Content,
  SourceCode,
}

const NewsDetails: React.FC = () => {
  //Function
  const getNewsById = useGetNewsById();
  const postNews = usePostNews();
  const putNews = usePutNews();
  const addPopup = useAddPopup();
  const removePopup = useRemovePopup();
  const navigate = useNavigate();
  //State
  const [avatar, setAvatar] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<number>(null);
  //State
  const [images, setImages] = useState<ImageType[] | null>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [maxImageIndex, setMaxImageIndex] = useState(0);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [tab, setTab] = useState(TabKey.Content);

  //Function
  const [isShowFullSizeImg2, setShowFullSizeImg2] = useState(false);
  const getNewsImage = useGetNewsImage();
  const addNewsImage = useAddNewsImage();
  const deleteNewsImage = useDeleteNewsImage();
  const editorRef = useRef(null);

  const tinyEditorRef = useRef(null);

  //Value
  const params = useParams<{ type: string; newId: string }>();
  const newId = Number(params.newId);
  const isAdd = Number(params.type) === EnumViewType.Edit && newId == 0;
  const isDisable = Number(params.type) == EnumViewType.View;

  useEffect(() => {
    if (!isAdd) {
      getNewsById(newId)
        .then((data) => {
          setAvatar(data.newAvatar);
          setTitle(data.newTitle);
          setValue(data.newValue);
          setDescription(data.description);
          setDisplayOrder(data.displayOrder);
        })
        .catch((error) => {
          isAdd
            ? null
            : addPopup({
                error: {
                  message: error.errorMessage,
                  title: 'Đã có lỗi xảy ra!',
                },
              });
        });
    }
    getNewsImage()
      .then((data) => {
        setImages(data);
        setMaxImageIndex(data.length - 1);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  }, [addPopup, getNewsById, getNewsImage, isAdd, newId, reloadFlag]);

  //Function Content

  function handleEditorDidMount(editor: unknown) {
    editorRef.current = editor;
  }

  const onAddNews = useCallback(() => {
    const pageValue =
      tab == TabKey.SourceCode
        ? editorRef.current.getValue()
        : tinyEditorRef.current.getContent();
    postNews(title, pageValue, avatar, description, displayOrder)
      .then((r) => {
        addPopup({
          txn: {
            success: true,
            summary: 'Thêm thành công!',
          },
        });
        setValue(r.newValue);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  }, [tab, postNews, title, avatar, description, displayOrder, removePopup, addPopup]);

  const onEditNews = useCallback(() => {
    const pageValue =
      tab == TabKey.SourceCode
        ? editorRef.current.getValue()
        : tinyEditorRef.current.getContent();
    putNews(newId, title, pageValue, avatar, description, displayOrder)
      .then((r) => {
        addPopup({
          txn: {
            success: true,
            summary: 'Sửa thành công',
          },
        });
        setValue(r.newValue);
      })
      .catch((error) => {
        addPopup({
          error: {
            message: error.errorMessage,
            title: 'Đã có lỗi xảy ra!',
          },
        });
      });
  }, [tab, putNews, newId, title, avatar, description, displayOrder, removePopup, addPopup]);

  //End of function
  //Function Image

  //Upload image
  const onAddImage = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size <= 55242880) {
        const formData = new FormData();
        formData.append('name', '');
        formData.append('file', event.target.files[0]);

        addNewsImage(formData)
          .then(() => {
            addPopup({
              txn: {
                success: true,
                summary: 'Upload ảnh thành công!',
              },
            });
            setReloadFlag(!reloadFlag);
          })
          .catch((error) => {
            addPopup({
              error: { message: error.errorMessage, title: 'Đã có lỗi xảy ra!' },
            });
          });
        addPopup({
          txn: {
            success: true,
            summary: 'Vui lòng chờ upload ảnh!',
          },
        });
      } else {
        addPopup({
          error: { message: 'Ảnh tối đa 5MB', title: 'Đã có lỗi xảy ra!' },
        });
      }
    }
  };

  const onShowFullSize = (name: string, isShow: boolean) => {
    if (name == 'img2') setShowFullSizeImg2(isShow);
  };

  const onDeleteNewsImage = () => {
    const onCancel = () => {
      console.log('cancel');
    };

    const onConfirm = () => {
      deleteNewsImage(images[imageIndex].fileId)
        .then(() => {
          addPopup({
            txn: {
              success: true,
              summary: 'Xóa ảnh thành công!',
            },
          });
          setImageIndex(0);
          setMaxImageIndex(maxImageIndex - 1);
          setReloadFlag(!reloadFlag);
        })
        .catch((error) => {
          addPopup({
            error: {
              message: error.errorMessage,
              title: 'Đã có lỗi xảy ra!',
            },
          });
          setImageIndex(0);
          setReloadFlag(!reloadFlag);
        });
      addPopup({
        txn: {
          success: true,
          summary: 'Đợi một chút!',
        },
      });
    };
    const listToDo: EventButton[] = [
      {
        name: 'Xác nhận',
        icon: 'check',
        actionType: EnumAction.Confirm,
        action: onConfirm,
        buttonClass: 'info',
        align: 'center',
      },
      {
        name: 'Hủy',
        icon: 'clear',
        actionType: EnumAction.Cancel,
        action: onCancel,
        buttonClass: 'info',
        align: 'center',
      },
    ];
    // addPopup(
    //   {
    //     confirm: {
    //       width: '25vw',
    //       height: '20vh',
    //       question: 'Bạn có chắc muốn xóa ảnh này?',
    //       listActionButton: listToDo,
    //     },
    //   },
    //   'delete-image',
    // );
  };

  const onBackToNews = (e: MouseEvent) => {
    if (e.button === LEFT_MOUSE_BUTTON) {
      navigate(-1);
    }
  };

  const onChangeEditMode = (e: MouseEvent) => {
    if (e.button === LEFT_MOUSE_BUTTON) {
      navigate(`${BASE_WEB_URL}/news/${EnumViewType.Edit}/id/${newId}`);
    }
  };

  //End of function

  const listEditToolButton: EventButton[] = [
    {
      name: 'Trở về',
      icon: 'arrow_back',
      actionType: EnumAction.View,
      buttonClass: 'info100 news-tool-btn',
      action: onBackToNews,
      align: 'center',
    },
    {
      name: 'Lưu',
      icon: 'add',
      actionType: isAdd ? EnumAction.Add : EnumAction.Edit,
      buttonClass: 'info news-tool-btn',
      action: isAdd ? onAddNews : onEditNews,
      align: 'center',
    },
    {
      name: 'Thêm ảnh',
      icon: 'cloud_upload',
      actionType: EnumAction.Add,
      buttonClass: 'info700 news-tool-btn cloud_upload-btn',
      action: onAddImage,
      align: 'center',
      file: true,
    },
  ];

  const listViewToolButton: EventButton[] = [
    {
      name: 'Trở về',
      icon: 'arrow_back',
      actionType: EnumAction.View,
      buttonClass: 'info100 news-tool-btn',
      action: onBackToNews,
      align: 'center',
    },
    {
      name: 'Sửa',
      icon: 'edit',
      actionType: EnumAction.Edit,
      buttonClass: 'info100 news-tool-btn',
      action: onChangeEditMode,
      align: 'center',
    },
  ];

  const tabs = [
    {
      title: 'Content',
      key: TabKey.Content,
      onClick: () => {
        if (tab == TabKey.SourceCode) {
          const content = editorRef.current.getValue();
          setValue(content);
        }
        setTab(TabKey.Content);
      },
    },
    {
      title: 'Source code',
      key: TabKey.SourceCode,
      onClick: () => {
        if (tab == TabKey.Content) {
          const content = tinyEditorRef.current.getContent();
          setValue(content);
        }
        setTab(TabKey.SourceCode);
      },
    },
  ];

  return (
    <div className="container-fluid">
      {/* <ToolBar
        toolbarName={'Trang thông tin'}
        listRightButton={isDisable ? listViewToolButton : listEditToolButton}
        width={'100%'}
        height={'50px'}
        backgroundColor={'#ebe9e9'}
        isPaging={false}
      /> */}
      <div className="row">
        <div className="col-12 news-image">
          <div className="container-fluid">
            <div className="row justify-content-center">
              {images.map((img: ImageType, index: number) => {
                return (
                  <div
                    key={uniqueId()}
                    className={`col-1 p-0 m-1 news-thumb-img-child ${
                      imageIndex === index ? 'focus-img' : ''
                    }`}
                    onClick={() => {
                      setImageIndex(index);
                    }}
                  >
                    <img className="img-item" src={img.thumbUrl} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-12 add-news-view">
          <div className="row">
            <div className="col-9 content">
              <div className="value-content">
                <div className="row content-row">
                  <div className="col-4">
                    <div className="add-news-child">
                      <span className="mr-2">Avatar:</span>
                      <Input disabled={isDisable} value={avatar} onChange={setAvatar} />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="add-news-child">
                      <span className="mr-2">
                        Tiêu đề:<span style={{ color: 'red' }}>*</span>
                      </span>
                      <Input disabled={isDisable} value={title} onChange={setTitle} />
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="add-news-child">
                      <span className="mr-2">
                        Thứ tự:<span style={{ color: 'red' }}>*</span>
                      </span>
                      <Input
                        disabled={isDisable}
                        value={displayOrder}
                        onChange={setDisplayOrder}
                      />
                    </div>
                  </div>
                </div>
                <div className="row content-row">
                  <div className="col-12">
                    <div className="add-news-child">
                      <span className="mr-2">Mô tả:</span>
                      <Input
                        disabled={isDisable}
                        value={description}
                        onChange={setDescription}
                      />
                    </div>
                  </div>
                </div>
                <div className="row content-row">
                  <div className="col-12">
                    <div className="add-news-child">
                      <span className="mr-2">
                        Nội dung:<span style={{ color: 'red' }}>*</span>
                      </span>

                      <Tabs activeTab={tab} tabs={tabs} />
                      <div className="tabs-content">
                        {tab == TabKey.SourceCode ? (
                          <MonacoEditor
                            height="90vh"
                            defaultLanguage="html"
                            value={value}
                            onMount={handleEditorDidMount}
                            options={{
                              readOnly: isDisable,
                            }}
                          />
                        ) : (
                          <Editor
                            disabled={isDisable}
                            apiKey={'9rjkn0nooxthjws4ylk4s6ogwe2x1ll74eozkdq1or2maa59'}
                            onInit={(evt, editor) => (tinyEditorRef.current = editor)}
                            initialValue={value}
                            init={{
                              height: '90vh',
                              menubar: true,
                              plugins: [
                                'link image code textcolor charmap preview anchor searchreplace visualblocks fullscreen insertdatetime media table code wordcount help align',
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount',
                              ],
                              toolbar:
                                'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'myButton | undo | redo | link | image | code | forecolor| backcolor |charmap |align |print | preview | anchor | view |searchreplace |visualblocks |fullscreen| insertdatetime |media |table |paste |help |wordcount' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                              content_style:
                                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-3 content">
              <div className="news-fullsize-img">
                {images.length > 0 ? (
                  <div
                    className="btn-nav-news-image back"
                    onClick={() => {
                      setImageIndex(imageIndex - 1 >= 0 ? imageIndex - 1 : maxImageIndex);
                    }}
                  >
                    <span className="material-icons">arrow_back_ios_new</span>
                  </div>
                ) : null}
                <div
                  className={`news-img-child center ${isShowFullSizeImg2 ? 'full-size' : ''}`}
                >
                  {images.length > 0 ? (
                    <div
                      className="btn-delete-news-image"
                      title="Xóa"
                      onClick={() => {
                        onDeleteNewsImage();
                      }}
                    >
                      <span className="material-icons">delete</span>
                    </div>
                  ) : null}
                  {images.length > 0 ? (
                    <div>
                      <div
                        className="btn-zoom-out-news-image"
                        title="Thu nhỏ"
                        onClick={() => {
                          onShowFullSize('img2', false);
                        }}
                      >
                        <span className="material-icons">close</span>
                      </div>
                      <img
                        onClick={() => {
                          onShowFullSize('img2', true);
                        }}
                        src={images[imageIndex].fileUrl}
                      />
                    </div>
                  ) : null}
                </div>
                {images.length > 0 ? (
                  <div
                    className="btn-nav-news-image next"
                    onClick={() => {
                      setImageIndex(imageIndex + 1 > maxImageIndex ? 0 : imageIndex + 1);
                    }}
                  >
                    <span className="material-icons">arrow_forward_ios</span>
                  </div>
                ) : null}
              </div>
              <p style={{ textAlign: 'center' }}>Link ảnh:</p>
              <p style={{ textAlign: 'center' }}>{images[imageIndex]?.fileUrl}</p>
              <p style={{ textAlign: 'center' }}>Link thumb:</p>
              <p style={{ textAlign: 'center' }}>{images[imageIndex]?.thumbUrl}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
