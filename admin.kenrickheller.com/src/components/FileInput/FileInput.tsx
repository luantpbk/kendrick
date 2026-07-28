import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

interface FileInputProps {
  title?: string;
  require?: boolean;
  blur?: () => void;
  change: (file: File) => void;
  fileError?: string
}

const FileInput = (props: FileInputProps) => {
  const {
    title,
    require,
    blur,
    change,
    fileError
  } = props;

  const [fileName, setFileName] = useState("Chưa chọn file")

  const onChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    setFileName(file.name);
    change(file);
  }

  return (
    
      
      <StyledInputWrapper>
          <StyledLabel htmlFor="upload-file">Chọn File <RequireSpan>*</RequireSpan></StyledLabel>
          <StyledInput
            type="file"
            onChange={onChange}
            onBlur={blur}
            title={'Chọn File'}
            id="upload-file"
          />
          {fileName? <StyledFileName>{fileName}</StyledFileName> : null}
          {fileError? <StyledError>{fileError}</StyledError> : null}
      </StyledInputWrapper>


   
  );
};

const RequireSpan = styled.span`
  color: red;
  margin-left: 2px;
`

const StyledLabel = styled.label`
  background: #dddcdc;
  padding: 5px 10px 5px 10px;
  color: #545353;
  margin: 0;
  font-weight: 500;
`


const StyledFileName = styled.label`
  padding: 5px 10px 5px 10px;
  margin: 0;
`

const StyledError = styled.label`
  color: red;
  margin-left: 2px;
  margin: 0;
`

const StyledInputWrapper = styled.div`
  border: 1px solid #dddcdc;
  padding: 0;
  border-radius: 5px;
  overflow: hidden;
`;


const StyledInput = styled.input`
  display: none
`;

export default FileInput;
