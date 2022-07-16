import styled from 'styled-components'

export const StyledFloatTab = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  transition: all ease-in-out 200ms;
  transform-origin: center;
  display: flex;
  flex-direction: column;

  &.cg-notrans {
    transition: none !important;
  }
  &.cg-z9900 {
    z-index: 9900 !important;
  }

  & .cg-closeBtn {
    border-radius: 0 6px 0 0;
  }
  & .cg-toolbar {
    border-radius: 6px 6px 0 0;
  }
  & .cg-windowScreen {
    border-radius: 0 0 6px 6px;
  }

  &[data-size='full'] {
    border-radius: 0;
    .cg-closeBtn,
    .cg-toolbar,
    .cg-windowScreen {
      border-radius: 0;
    }
  }

  &[data-size='cstm'] {
    filter: none;
  }

  &[data-hide='true'] {
    top: 0;
    left: 0;
    transform: scale(0.8);
    opacity: 0;
    pointer-events: none;
  }

  &[data-max='false'] {
    top: calc(100% + 10px);
    transform: scale(0.6);
    transform-origin: bottom;
    opacity: 0;
    pointer-events: none;
  }

  &[data-size='mini'] {
    top: 10%;
    left: 20%;
    width: 60%;
    height: 80%;
  }
`
