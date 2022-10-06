import React, { useState } from 'react'
import styled from 'styled-components'
import { useKey } from '@/hooks/useReactHooks'
const StyledWrapper = styled.div`
  padding: 20px;
`
const StyledWindow = styled.div`
  width: 640px;
  height: 480px;
  font-family: 'DotGothic16', sans-serif;
  white-space: pre-wrap;
  border: solid 2px #eee;
  padding: 10px;
  font-size: 16px;
`
const Top: React.FC = () => {
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
  const { message } = useHooks(characters)
  return (
    <StyledWindow>{`${player.name}
HP:${player.hp}/${player.maxHp} MP:${player.mp}/${player.maxMp}

${monster.aa} ( HP: ${monster.hp}/${monster.maxHp} )

${message}`}</StyledWindow>
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
  command: Command
}
const monsterType = {
  MONSTER_PLAYER: 0,
  MONSTER_SLIME: 1,
  MONSTER_MONSTER: 2,
} as const
const commands = {
  COMMAND_FIGHT: 0,
  COMMAND_SPELL: 1,
  COMMAND_RUN: 2,
  COMMAND_MAX: 3,
} as const
const commandNames = ['たたかう', 'じゅもん', 'にげる'] as const
type Command = typeof commands[keyof typeof commands]
const defaultMonster = {
  hp: 0,
  maxHp: 0,
  mp: 0,
  maxMp: 0,
  name: '',
  aa: '',
  command: commands.COMMAND_FIGHT,
} as const
const monsters: readonly Character[] = [
  {
    ...defaultMonster,
    hp: 15,
    maxHp: 15,
    mp: 15,
    maxMp: 15,
    name: 'ゆうしゃ',
  },
  {
    ...defaultMonster,
    hp: 3,
    maxHp: 3,
    name: 'スライム',
    aa: `／・Д・＼
～～～～～`,
  },
] as const
const selectCommandMessage = (
  selectedCommand: Command,
  commands: readonly string[],
) => {
  return commands.map((c, index) =>
    // eslint-disable-next-line no-irregular-whitespace
    index === selectedCommand ? `＞${c}` : `　${c}`,
  )
}
const useHooks = (characters: Character[]) => {
  const [player, monster] = characters

  const [gen] = useState(battleLoop(characters))
  const [state, setState] = useState({
    message: `${monster.name} があらわれた！`,
  })

  useKey(['Enter', 'w', 's'], (key) => {
    switch (key) {
      case 'Enter': {
        const nextState = gen.next(false).value
        if (nextState) setState(nextState)
        return
      }
    }
  })

  return state
}

function* battleLoop(characters: Character[]) {
  const [player, monster] = characters

  while (true) {
    let commandSelecting = true
    while (commandSelecting) {
      commandSelecting = yield {
        message: `${selectCommandMessage(player.command, commandNames).join(
          '\n',
        )}`,
      }
    }
    for (const c of characters) {
      switch (c.command) {
        case commands.COMMAND_FIGHT:
          yield { message: `${c.name} の攻撃！`, commandSelecting }
      }
    }
  }
}
