import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAddPopup } from 'src/state/application/hooks';
import styled from 'styled-components';

interface AvatarProps {
  blur?: () => void;
  change: (file: File) => void;
  fileError?: string;
  thumbAvatar: string;
  avatar: string;
}

const Avatar = (props: AvatarProps) => {
  const {
    blur,
    change,
    fileError,
    thumbAvatar,
    avatar
  } = props;

  const [isFullAvatar, setFullAvatar] = useState(false);
  const addPopup = useAddPopup();

  const onChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file.size > 5242880) {
      addPopup({
        error: { message: 'Ảnh tối đa 5MB', title: 'Đã có lỗi xảy ra!' },
      });
    } 
    change(file);
  }

  return (     
    <StyledAvatarWrapper>
      
      {isFullAvatar ? <StyledFullAvatar>
        <StyledCollapseAvatar  onClick={() => setFullAvatar(false)}><span className="material-icons" >clear</span></StyledCollapseAvatar>
        {avatar ? <StyledImage src={avatar}/> : null}
      </StyledFullAvatar> : null}
      <StyledAvatar>
        <StyledImage
          src={thumbAvatar}
          onClick={() => {
            if(avatar) setFullAvatar(true);
          }}
          alt=""
        />
      </StyledAvatar>
      <StyledUpload>
        <StyledInput
          type="file"
          onChange={onChange}
          onBlur={blur}
          title={'Chọn File'}
          id="upload-file"
        />
        <i className="fas fa-camera-retro"></i>
      </StyledUpload>

        
        {fileError? <StyledError>{fileError}</StyledError> : null}
    </StyledAvatarWrapper>


   
  );
};

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

const StyledCollapseAvatar = styled.div`
  z-index: inherit;
  width: 25px;
  height: 25px;
  position: absolute;
  right: 0px;
  top: 0px;
  cursor: pointer;
  color: red;
`

const StyledFullAvatar = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: fixed;
  object-fit: contain;
  background-color: #ebe9e9;
  z-index: 150;
`

const StyledAvatar = styled.div`
  width: 168px;
  height: 168px;
  cursor: pointer;
  overflow: hidden;
`;

const StyledError = styled.label`
  color: red;
  margin-left: 2px;
  margin: 0;
`

const StyledAvatarWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-bottom: 10px;
`;

const StyledUpload = styled.label`
  color: #348eed;
  position: absolute;
  bottom: 0px;
  transform: translate(460%, 40%);
  cursor: pointer;
`;

const StyledInput = styled.input`
  display: none
`;

export default Avatar;
