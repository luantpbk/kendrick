/* eslint-disable @typescript-eslint/no-empty-function */
import { uniqueId } from 'lodash';
import React, { createContext, memo, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface SlideBarContext {
  content?: SlideBarInfo;
  onPresent: (content: React.FC<any>, props: object, title?: string) => void;
  onDismiss: () => void;
}

export const Context = createContext<SlideBarContext>({
  onPresent: () => {},
  onDismiss: () => {},
});

interface SlideBarInfo {
  content?: React.FC;
  props: object;
}

interface SlideBarProps {
  children: React.ReactNode
}

const SlideBarProvider: React.FC<SlideBarProps> = ({ children }) => {
  const [slideBar, setSlideBar] = useState<SlideBarInfo>();
  const [visible, setVisible] = useState(true);

  const present = (slideBar: SlideBarInfo) => {
    setSlideBar(slideBar);
  };


  const handlePresent = useCallback(
    (slideBarContent: React.FC, props: object) => {
      present({content: slideBarContent, props: {...props, isSlide: true} });
    }, [],
  );

  const handleDismiss = useCallback(() => {
    setSlideBar(undefined);
  }, [slideBar]);

  return (
    <Context.Provider
      value={{
        content: slideBar,
        onPresent: handlePresent,
        onDismiss: handleDismiss,
      }}
    >
      {children}
      {slideBar? (
        <>
         <StyledSlideBarWrapper visible={visible} key={`slideBar`}>
            <slideBar.content {...slideBar.props}/>
          </StyledSlideBarWrapper>
          <StyledSlideBarColapse visible={visible} onClick={() => setVisible(!visible)}>
            <i className={`fas ${visible? 'fa-chevron-circle-right' : 'fa-chevron-circle-left'}`}></i>
          </StyledSlideBarColapse>
        </>
       
       
      ) : null}
      
    </Context.Provider>
  );
};

const StyledSlideBarWrapper = styled.div<{visible: boolean}>`
  ${({visible}) => (visible? '' : 'display: none;')}
  width: min(90vw, max(380px, 50vw), 600px);
  height: 100vh;
  position: fixed;
  z-index: 1;
  top: 0;
  right:0;
  transition: 0.5s;
  background-color: white;
  box-shadow: grey 0px 0px 6px 1px;
  border-radius: 5px 0px 0px 5px;
  border: 1px solid lightgray;
`;

const StyledSlideBarColapse = styled.div<{visible: boolean}>`
  position: fixed;
  right: ${({visible}) => (visible? 'calc( min(90vw, max(380px, 50vw), 600px) - 40px)' : '5px')};
  bottom: 5px;
  font-size: 35px;
  cursor: pointer;
  color: black;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  z-index: 2;
`


export default memo(SlideBarProvider);

/*btn */
// .btn-close-slide-bar {
//   position: absolute;
//   bottom: 0;
//   font-size: 35px;
//   cursor: pointer;
//   background-color: black;
//   color: white;
//   width: 40px;
//   height: 40px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 5px;
// }
// .btn-show-slide-bar {
//   position: absolute;
//   bottom: 0;
//   right: 0;
//   font-size: 35px;
//   cursor: pointer;
//   background-color: black;
//   color: white;
//   width: 40px;
//   height: 40px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 5px;
// }
// .btn-show-slide-bar.hidden {
//   position: absolute;
//   display: none;
// }