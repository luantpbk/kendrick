import { useEffect, useState } from 'react';
import { ImageType } from 'src/api/models';
import useModal from 'src/hooks/useModal';
import styled from 'styled-components';
import ImageLib from '../ImageLib';

interface OptionInfoProps {
  width?: string;
  title?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  value?: string;
  images: ImageType[];
}

const OptionInfo = (props: OptionInfoProps) => {
  const { width, title, disabled, onChange, value, images } = props;

  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<{ [option: string]: number[] }>({});

  const imageModal = useModal(ImageLib);
  useEffect(() => {
    if (value) {
      const data = JSON.parse(value);
      setOptions(data?.values ?? []);
      setSelected(data?.images ?? {});
    }
  }, [images, value]);

  return (
    <StyledOptionWrapper
      width={width}
      onBlur={() => {
        const result = {
          values: options,
          images: selected,
        };
        onChange(JSON.stringify(result));
      }}
    >
      {title ? (
        <StyledTitle>
          {title}
          {require ? <RequireSpan>*</RequireSpan> : null}
        </StyledTitle>
      ) : null}
      <StyledOptionContainer width={width}>
        {options.map((option, index) => (
          <StyledOption key={`option${index}`}>
            {!disabled && (
              <StyledClearIcon
                className="material-icons"
                onClick={() => {
                  console.log(option, selected);
                  setOptions(options.filter((o) => o != option));

                  if (option in selected) {
                    const nSelected = { ...selected };
                    delete nSelected[option];
                    setSelected({ ...nSelected });
                  }
                }}
              >
                clear
              </StyledClearIcon>
            )}

            <StyledOptionInput
              disabled={disabled}
              value={option}
              onChange={(event) => {
                options[index] = (event.target as HTMLInputElement).value;
                setOptions([...options]);
              }}
            />
            <StyledConfigIcon
              className="material-icons"
              hasConfig={selected[option]?.length > 0}
              onClick={() => {
                imageModal.handlePresent(
                  {
                    images: images,
                    selected: selected[option],
                    disabled: disabled,
                    onChoose: (images: number[]) => {
                      const nSelected = { ...selected };
                      nSelected[option] = images;
                      setSelected(nSelected);
                      imageModal.handleDismiss();
                    },
                  },
                  'CHỌN ẢNH',
                );
              }}
            >
              settings
            </StyledConfigIcon>
          </StyledOption>
        ))}
        {!disabled && (
          <span className="material-icons " onClick={() => setOptions([...options, ''])}>
            add_circle
          </span>
        )}
      </StyledOptionContainer>
    </StyledOptionWrapper>
  );
};

const StyledConfigIcon = styled.span<{ hasConfig: boolean }>`
  background: white;
  color: ${({ hasConfig }) => (hasConfig ? '#256cb8' : 'gray')};
  font-size: 12px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  cursor: pointer;
  margin: auto;
`;

const StyledClearIcon = styled.span`
  position: absolute;
  top: -2px;
  left: -3px;
  color: white;
  background-color: #f13838;
  font-size: 12px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  cursor: pointer;
`;

const RequireSpan = styled.span`
  color: red;
  margin-left: 2px;
`;

const StyledOptionWrapper = styled.fieldset<{ width?: string }>`
  border: 1px solid #dddcdc;
  flex: 1;
  width: ${({ width }) => (width ? width : 'fit-content')};
  padding: 0 10px 0px 10px;
  border-radius: 5px;
`;

const StyledTitle = styled.legend`
  font-size: medium;
  margin-bottom: -5px;
  padding: 0 5px 3px 5px;
  width: fit-content;
`;

const StyledOptionContainer = styled.div<{ width?: string }>`
  display: flex;
  flex-direction: row;
  height: 30px;
  width: 100%;
  overflow-x: auto;
  min-width: ${({ width }) => (width ? `calc(${width} - 20px)` : '240px')};
  max-width: 80vw;
`;

const StyledOption = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  background: #256cb8;
  padding: 0 2px;
  border-radius: 3px;
  margin: 2px 3px;
`;

const StyledOptionInput = styled.input`
  width: 40px;
  text-align: center;
  border: none;
  color: white;
  background: transparent;
`;

export default OptionInfo;
