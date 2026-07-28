import { useCallback, useState } from 'react';
import { ImageType } from 'src/api/models';
import styled from 'styled-components';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

interface ImageLibProps {
  onChoose?: (images: number[]) => void;
  images: ImageType[];
  disabled?: boolean;
  selected?: number[];
}

const ImageLib = (props: ImageLibProps) => {
  const { onChoose, images, selected: initialSelected, disabled } = props;

  const [selected, setSelected] = useState<number[]>(initialSelected ?? []);

  const onSelect = useCallback(
    (image: ImageType) => {
      if (selected.some((f) => f == image.fileId)) {
        setSelected(selected.filter((f) => f != image.fileId));
      } else {
        setSelected([...selected, image.fileId]);
      }
    },
    [selected],
  );

  return (
    <StyledImageWrapper>
      {images.map((image, index) => (
        <StyledImageContainer key={`imagelib${index}`}>
          <StyledCheckbox
            type="checkbox"
            checked={selected.some((f) => f == image.fileId)}
            onChange={() => onSelect(image)}
            disabled={disabled}
          />
          <StyledImage src={image.thumbUrl} alt={image.fileName} />
        </StyledImageContainer>
      ))}
      <ButtonComponent icon="save" title="ĐỒNG Ý" onClick={() => onChoose(selected)} />
    </StyledImageWrapper>
  );
};

const StyledImageWrapper = styled.div`
  max-width: 91vw;
  max-height: 91vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: auto;
  background: lightgray;
  margin: 0;
  padding: 0;
`;

const StyledImageContainer = styled.div`
  position: relative;
  width: 140px;
  margin: 1px;
`;

const StyledCheckbox = styled.input`
  position: absolute;
  top: 0;
  right: 0;
`;

const StyledImage = styled.img`
  width: 100%;
  object-fit: contain;
`;

export default ImageLib;
