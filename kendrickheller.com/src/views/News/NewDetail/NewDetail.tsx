import './NewDetail.css';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  useGetAllComment,
  useGetNewsById,
  usePostNewComment,
} from 'src/api/backend-api';
import { useEffect, useState } from 'react';
import { CommentType, NewsType } from 'src/api/models';
import CommentComponent from 'src/components/CommentComponent/CommentComponent';
import InputComponent from 'src/components/InputComponent/InputComponent';
import useProfile from 'src/hooks/useProfile';
import { PageContainer, PageHeader } from 'src/components/GlobalStyled';
import { NavLink } from 'react-router-dom';

const NewDetail: React.FC = () => {
  //Value
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const newsId = Number(params.id);
  const profile = useProfile();

  //
  const [newsDisplay, setNewsDisplay] = useState<NewsType>();
  const [listComment, setListComment] = useState<CommentType[]>([]);
  const [commentValue, setCommentValue] = useState('');
  const [reloadFlag, setReloadFlag] = useState(false);

  //Function
  const getNewsById = useGetNewsById();
  const getAllComment = useGetAllComment();
  const postComment = usePostNewComment();

  const onPostComment = () => {
    const comment: CommentType = {
      newId: newsId,
      commentValue: commentValue,
    };
    postComment(comment)
      .then(() => {
        setReloadFlag(!reloadFlag);
        setCommentValue('');
      });
  };
  //End of function

  //Get news
  useEffect(() => {
    getNewsById(newsId)
      .then((data) => {
        setNewsDisplay(data);
      });
  }, [getNewsById, newsId, reloadFlag]);

  //Get comment
  useEffect(() => {
    if (newsDisplay) {
      getAllComment(newsDisplay.newId)
        .then((allComment) => {
          setListComment(allComment);
        });
    }
  }, [getAllComment, newsDisplay]);


  return (
    <PageContainer>
      <PageHeader>
        <NavLink to={'/'}>Home</NavLink>{` / `}<NavLink to={'/news'}>News</NavLink>{` / `}{newsDisplay?.newTitle}
      </PageHeader>
      <div className="news-value">
        <div dangerouslySetInnerHTML={{ __html: newsDisplay?.newValue }} />
        <div className="news-all-comment">
          <div className="news-comment-title">
            Comments{' (' + listComment.length + ')'}
          </div>
          {profile ? (
            <div className="add-comment-new-container p-2">
              <div>
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
            </div>
          ) : (
            <div className="add-comment-new-container">
              <span className="add-comment-new-btn-login" onClick={() => navigate(`/login`)}>Login</span>{' to comment'}
            </div>
          )}
          <div className="news-comment-value p-2">
            {listComment.map((comment: CommentType) => {
              return <CommentComponent comment={comment} />;
            })}
          </div>
        </div>
      </div>
    </PageContainer>



  );
};

export default NewDetail;
