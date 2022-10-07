import React from 'react'
import styled from 'styled-components'
import BattleScene from './BattleScene'
import LifeGame from './LineGame'

const StyledWrapper = styled.div`
  padding: 0px;
`

const Top: React.FC = () => {
  return (
    <StyledWrapper>
      <BattleScene />
      <LifeGame />
    </StyledWrapper>
  )
}
export default Top
