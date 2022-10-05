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
  return (
    <StyledWrapper>
      <Battle
        playerData={monsters[monsterType.MONSTER_PLAYER]}
        monsterData={monsters[monsterType.MONSTER_SLIME]}
      />
    </StyledWrapper>
  )
}
const Battle: React.FC<{ monsterData: Character; playerData: Character }> = ({
  monsterData,
  playerData,
}) => {
  const [characters, setCharacters] = useState([playerData, monsterData])
  const player = characters[monsterType.MONSTER_PLAYER]
  const monster = characters[monsterType.MONSTER_SLIME]
  return (
    <StyledWindow>{`${player.name}
HP:${player.hp}/${player.maxHp} MP:${player.mp}/${player.maxMp}

${monster.aa} ( HP: ${monster.hp}/${monster.maxHp} )
`}</StyledWindow>
  )
}
export default Top
interface Character {
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  name: string
  aa: string
}
const monsterType = {
  MONSTER_PLAYER: 0,
  MONSTER_SLIME: 1,
  MONSTER_MONSTER: 2,
} as const
const monsters: readonly Character[] = [
  {
    hp: 15,
    maxHp: 15,
    mp: 15,
    maxMp: 15,
    name: 'ゆうしゃ',
    aa: '',
  },
  {
    hp: 3,
    maxHp: 3,
    mp: 0,
    maxMp: 0,
    name: 'スライム',
    aa: `／・Д・＼
～～～～～`,
  },
] as const

const useHooks = () => {
  const [characters, setCharacters] = useState(monsters)
  const init = () => {
    setCharacters(monsters)
  }
  return { characters }
}
