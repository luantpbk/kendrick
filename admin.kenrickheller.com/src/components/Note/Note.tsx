import React, { useState, useEffect } from 'react';
import { EnumDisplayConfig, NoteType } from 'src/api/models';
import { useGetNote, usePostNote } from 'src/api/noteApi';
import { useGetOrderRequirementById } from 'src/api/orderRequirementApi';
import { useAddPopup } from 'src/state/application/hooks';
import './Note.css';

interface INote {
  objectId?: number;
  functionId?: number;
  recordUserId?: number;
}

type NoteByDay = {
  createdAt: string;
  list: NoteType[];
};

const Note: React.FC<INote> = (props) => {

  const [objectId, setObjectId] = useState<number>();
  const [functionId, setFunctionId] = useState<number>();
  const [recordUserId, setRecordUserId] = useState<number>();

  useEffect(() => {
    setObjectId(props.objectId);
    setFunctionId(props.functionId);
    setRecordUserId(props.recordUserId);
  }, [props.objectId, props.functionId, props.recordUserId])

  //State
  const [noteList, setNoteList] = useState<NoteByDay[]>([]);
  const [noteContent, setNoteContent] = useState<string>();
  const [reloadFlag, setReloadFlag] = useState(false);
  //End of state

  //Function
  const addPopup = useAddPopup();
  const getNote = useGetNote();
  const postNote = usePostNote();
  const getOrderRequirementById = useGetOrderRequirementById();

  const onPostNote = () => {
    const note: NoteType = {
      functionId: functionId,
      objectId: objectId,
      noteContent: noteContent,
    };
    postNote(note, recordUserId)
      .then(() => {
        addPopup({
          txn: {
            success: true,
            summary: 'Gửi thành công!',
          },
        });
        setNoteContent('');
        setReloadFlag(!reloadFlag);
      })
      .catch((e) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra!',
            message: e.errorMessage,
          },
        });
        setReloadFlag(!reloadFlag);
      });
  };


  //useEffect
  useEffect(() => {
    if (objectId) {
      getNote(functionId, objectId).then((data) => {
        let createDay: string = undefined;
        const notes: NoteByDay[] = [];
        data.forEach(item => {
          if (item.createdAt == createDay) {
            notes[notes.length - 1].list.push(item);
          } else {
            createDay = item.createdAt;
            const noteOfDay = {
              createdAt: createDay,
              list: [] as NoteType[]
            };
            noteOfDay.list.push(item);
            notes.push(noteOfDay);
          }
        })
        setNoteList(notes);
      }).catch((error) => {
        addPopup({
          error: {
            title: 'Đã có lỗi xảy ra!',
            message: error.errorMessage,
          },
        });
      });
    }
  }, [addPopup, getNote, functionId, objectId, reloadFlag]);


  //Main
  return (
    <div className="note-container">
      <div className="note-title">TRAO ĐỔI</div>
      <textarea
        className="note-input"
        value={noteContent}
        onChange={(e) => {
          setNoteContent(e.target.value);
        }}
      />
      <button
        className="note-btn"
        onClick={(e) => {
          onPostNote();
        }}
      >
        Gửi
      </button>
      {noteList.map((v) => {
        return (
          <div className="note-component">
            <div className="note-date">
              <div className="note-line">line</div>
              <div>{v.createdAt}</div>
              <div className="note-line">line</div>
            </div>
            {v.list.map((item) => {
              return (
                <div className="note-item">
                  <div className="note-item-avt">
                    {item.avataUrl ? (
                      <img src={item.avataUrl} alt="avatar" />
                    ) : (
                      <div className="no-avt"></div>
                    )}
                  </div>
                  <div className="note-detail">
                    <div>
                      <b>{item.fullName}</b>
                    </div>
                    <div>{item.noteContent}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Note;
