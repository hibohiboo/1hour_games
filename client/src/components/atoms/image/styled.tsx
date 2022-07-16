import styled from 'styled-components'

export const StyledImageCont = styled.div.attrs(() => ({
  className: 'cg-imageCont' as string,
}))`
  position: relative;
  display: grid;
  place-items: center;
  width: auto;
  height: auto;

  &[data-back='true'] {
    background-position: center;
    background-size: cover;
  }

  img[data-free='false'] {
    max-width: 100%;
    max-height: 100%;
  }

  &.rounded {
    overflow: hidden;
  }
`
