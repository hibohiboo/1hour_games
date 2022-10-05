import React, { useState } from 'react'
import styled from 'styled-components'
const StyledWrapper = styled.div`
  padding: 20px;
`
const StyledWindow = styled.div`
  width: 640px;
  height: 480px;
  font-family: 'DotGothic16', sans-serif;
  white-space: pre-wrap;
`
const Top: React.FC = () => {
  const { characters } = useHooks()
  const player = characters[monsterType.MONSTER_PLAYER]
  return (
    <StyledWrapper>
      <StyledWindow>{`${player.name}
HP: ${player.hp} MP:${player.mp}/${player.maxMp}
      
      `}</StyledWindow>
    </StyledWrapper>
  )
}

export default Top
interface Character {
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  name: string
}
const monsterType = {
  MONSTER_PLAYER: 0,
  MONSTER_MONSTER: 2,
} as const
const monsters: Character[] = [
  {
    hp: 15,
    maxHp: 15,
    mp: 15,
    maxMp: 15,
    name: 'ゆうしゃ',
  },
]
const init = () => {}
const useHooks = () => {
  const [characters, setCharacters] = useState(monsters)
  const init = () => {
    setCharacters(monsters)
  }
  return { characters }
}
