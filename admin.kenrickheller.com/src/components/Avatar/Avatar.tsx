import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAddPopup } from 'src/state/application/hooks';
import styled from 'styled-components';
import useModal from 'src/hooks/useModal';
import ImageLibraryModal from '../ImageLibraryModal/ImageLibraryModal';
import { ImageType } from 'src/api/models';

interface AvatarProps {
  blur?: () => void;
  change: (file: File) => void;
  fileError?: string;
  thumbAvatar: string;
  avatar: string;
  onChooseFromLibrary?: (image: ImageType) => void;
}

const Avatar = (props: AvatarProps) => {
  const {
    blur,
    change,
    fileError,
    thumbAvatar,
    avatar,
    onChooseFromLibrary
  } = props;

  const [isFullAvatar, setFullAvatar] = useState(false);
  const addPopup = useAddPopup();
  const imageLibraryModal = useModal(ImageLibraryModal);

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
        <i className="fas fa-camera-retro" title="Tải ảnh lên"></i>
      </StyledUpload>
      {onChooseFromLibrary && (
        <StyledLibraryUpload onClick={() => {
          imageLibraryModal.handlePresent({
            onDismiss: imageLibraryModal.handleDismiss,
            onSelect: onChooseFromLibrary
          })
        }}>
          <span className="material-icons" title="Chọn từ thư viện">photo_library</span>
        </StyledLibraryUpload>
      )}

        
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
  transform: translate(250%, 40%);
  cursor: pointer;
  background: white;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const StyledLibraryUpload = styled.div`
  color: #348eed;
  position: absolute;
  bottom: 0px;
  transform: translate(400%, 40%);
  cursor: pointer;
  background: white;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledInput = styled.input`
  display: none
`;

export default Avatar;
