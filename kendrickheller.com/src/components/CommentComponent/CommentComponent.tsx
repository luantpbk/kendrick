import './CommentComponent.css';
import React, { useState, useEffect, useCallback } from 'react';
import { CommentType } from 'src/api/models';
import { useGetCommentByCommentId, usePostNewComment } from 'src/api/backend-api';
import InputComponent from '../InputComponent/InputComponent';
import { useNavigate, useParams } from 'react-router';
import useProfile from 'src/hooks/useProfile';
import { useAddPopup } from 'src/state/application/hooks';

interface IComment {
  comment: CommentType;
}

const CommentComponent: React.FC<IComment> = (props) => {
  //Value
  const profile = useProfile();
  const navigate = useNavigate();

  //State
  const [isLoadMore, setLoadMore] = useState(false);
  const [isRepsponse, setRepsponse] = useState(false);
  const [listComment, setListComment] = useState<CommentType[]>([]);
  const [commentValue, setCommentValue] = useState('');
  const [reloadFlag, setReloadFlag] = useState(false);

  //Function
  const getCommentByCommentId = useGetCommentByCommentId();
  const postComment = usePostNewComment();
  const addPopup = useAddPopup();

  const onRepsponse = useCallback(() => {
    if (profile) {
      setRepsponse(true);
      setLoadMore(true);
    } else {
      const url = `/login`;
      window.scrollTo(0, 0);
      navigate(url);
    }
  }, [navigate, profile]);


  const onPostComment = () => {
    const comment: CommentType = {
      newId: props.comment.newId,
      parentId: props.comment.commentId,
      commentValue: commentValue,
    };
    postComment(comment)
      .then(() => {
        setReloadFlag(!reloadFlag);
        setCommentValue('');
        setRepsponse(false);
      })
      .catch(() => {
        addPopup({
          txn: {
            success: false,
            summary: 'An error occurred.',
          },
        });
      });
  };

  //Get comment
  useEffect(() => {
    if (isLoadMore) {
      getCommentByCommentId(props.comment.commentId)
        .then((data) => {
          setListComment(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [getCommentByCommentId, isLoadMore, props.comment.commentId, reloadFlag]);

  return (
    <div className="comment-container p-0">
      <div>
        <div className="comment-avatar">
          <img src={props.comment.avataUrl} />
        </div>
        <div className="comment-value">
          <div> {props.comment.fullName} </div>
          <div>{props.comment.commentValue}</div>
        </div>
      </div>
      {isRepsponse && profile ? (
        <div className="comment-repsponse-value">
          <div className="add-comment-new-avatar">
            <img src={profile.info.avataUrl} />
          </div>
          <InputComponent
            isDisable={false}
            value={commentValue}
            name={'commentValue'}
            width={'calc(100% - 60px)'}
            height={'fit-content'}
            cols={2}
            inputType={'text-area'}
            onChange={setCommentValue}
            placeholder={'Write a public comment'}
            rightIcon='fas fa-paper-plane'
            rightAction={onPostComment}
          />
        </div>
      ) : (
        <div
          className="comment-repsponse-btn"
          onClick={() => {
            onRepsponse();
          }}
        >
          <i>Comment</i>
        </div>
      )}
      {isLoadMore ? (
        <div className="comment-repsponse-child">
          {listComment
            ? listComment.map((_comment) => {
              return <CommentComponent comment={_comment} />;
            })
            : null}
        </div>
      ) : null}
      {props.comment.commentLength > 0 && !isLoadMore ? (
        <div
          className="comment-repsponse-count"
          onClick={() => {
            setLoadMore(true);
          }}
        >
          <i className="fas fa-comment-dots"></i> See more comments
        </div>
      ) : null}
    </div>
  );
};

export default CommentComponent;
