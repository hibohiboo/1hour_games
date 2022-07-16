import styled from 'styled-components'

export const StyledPrtClick = styled.div`
  &.cg-uicon {
    display: grid;
    place-items: center;
    position: relative;

    & > img {
      transform-origin: center;
      transition: 400ms ease-in-out;
    }

    & > img[data-click='true']:active {
      transform: scale(0.7);
      transition: 100ms ease-in-out;
    }

    &[data-pr='true']:active img {
      transform: scale(0.7);
      transition: 100ms ease-in-out;
    }
  }
  &.arrUi {
    margin-right: 0.4em;
  }
`
