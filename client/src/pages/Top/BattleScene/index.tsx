import React, { CSSProperties, useState } from 'react'
import styled from 'styled-components'
import { useKeyDown } from '@/hooks/useReactHooks'
const StyledWrapper = styled.div`
  padding: 20px;
`
const StyledWindow = styled.div`
  width: 300px;
  height: 150px;
  border: solid 2px #eee;
  padding: 10px;

  /* レトロゲームコンソール風の文字に */
  font-family: 'DotGothic16', sans-serif;
  white-space: pre-wrap;
  font-size: 16px;
  line-height: 1;

  /* 単純な描画領域として扱うため余分なイベントを無効化 */
  pointer-events: none;
  user-select: none;
`
const BattleScene: React.FC = () => {
  return (
    <StyledWrapper>
      <Battle
        playerData={monsters[monsterType.MONSTER_PLAYER]}
        monsterData={monsters[monsterType.MONSTER_BOSS]}
      />
    </StyledWrapper>
  )
}
const StyledControllerWrapper = styled.div`
  width: 300px;
  height: 150px;

  padding: 20px;
  padding-left: 50px;

  display: flex;
`
const StyledButton = styled.button`
  width: 110px;
  height: 110px;
  border-radius: 60px;
  border: solid 5px #eee;
  background-color: #f44;

  display: flex;
  justify-content: center;
  align-items: center;
`

const Controller: React.FC<{ selectCommand: (key: string) => void }> = ({
  selectCommand,
}) => {
  return (
    <StyledControllerWrapper>
      <div>
        <Triangle len={50} onClick={() => selectCommand('ArrowUp')} />
        <Triangle
          len={50}
          style={{ transform: 'rotate(-180deg)', display: 'block' }}
          onClick={() => selectCommand('ArrowDown')}
        />
      </div>
      <div style={{ paddingLeft: '50px' }}>
        <StyledButton onClick={() => selectCommand('Enter')}></StyledButton>
      </div>
    </StyledControllerWrapper>
  )
}

const Triangle: React.FC<{
  len: number
  style?: CSSProperties
  onClick?: () => void
}> = ({ len, style, onClick }) => {
  return (
    <svg width={`${len}`} height={`${len}`} style={style} onClick={onClick}>
      <path
        d={`M${len / 2} 0 L0 ${len} L${len} ${len} Z`}
        style={{ fill: '#999', stroke: 'white', strokeWidth: '3' }}
      ></path>
    </svg>
  )
}
const Battle: React.FC<{ monsterData: Character; playerData: Character }> = ({
  monsterData,
  playerData,
}) => {
  const [characters, setCharacters] = useState([playerData, monsterData])
  const player = characters[monsterType.MONSTER_PLAYER]
  const monster = characters[monsterType.MONSTER_SLIME]
  const {
    state: { message },
    selectCommand,
  } = useHooks(characters)
  return (
    <div>
      <StyledWindow>{`${player.name}
HP:${player.hp}/${player.maxHp} MP:${player.mp}/${player.maxMp}

${monster.hp > 0 ? monster.aa : ''} ( HP: ${monster.hp}/${monster.maxHp} )

${message}`}</StyledWindow>
      <Controller selectCommand={selectCommand} />
    </div>
  )
}
export default BattleScene
interface Character {
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  name: string
  aa: string
  command: Command
  target: number
  attack: number
}
const monsterType = {
  MONSTER_PLAYER: 0,
  MONSTER_SLIME: 1,
  MONSTER_BOSS: 2,
  MONSTER_MONSTER: 3,
} as const
const commands = {
  COMMAND_FIGHT: 0,
  COMMAND_SPELL: 1,
  COMMAND_RUN: 2,
  COMMAND_MAX: 3,
} as const
const commandNames = ['たたかう', 'じゅもん', 'にげる'] as const
const SPELL_COST = 3
type Command = typeof commands[keyof typeof commands]
const defaultMonster = {
  hp: 0,
  maxHp: 0,
  mp: 0,
  maxMp: 0,
  name: '',
  aa: '',
  command: commands.COMMAND_FIGHT,
  target: 0,
  attack: 0,
} as const
const monsters: readonly Character[] = [
  {
    ...defaultMonster,
    hp: 100,
    maxHp: 100,
    mp: 15,
    maxMp: 15,
    name: 'ゆうしゃ',
    attack: 30,
  },
  {
    ...defaultMonster,
    hp: 3,
    maxHp: 3,
    name: 'スライム',
    aa: `／・Д・＼
～～～～～`,
    attack: 2,
  },
  {
    ...defaultMonster,
    hp: 255,
    maxHp: 255,
    attack: 50,
    name: 'まおう',
    // eslint-disable-next-line no-irregular-whitespace
    aa: `　　Ａ＠Ａ
ψ（▼皿▼）ψ`,
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
    player,
  })
  const selectCommand = (key: string) => {
    switch (key) {
      case 'Enter': {
        const nextState = gen.next(false).value
        if (nextState) setState(nextState)
        return
      }
      case 'ArrowUp':
      case 'w': {
        state.player.command = ((state.player.command -
          1 +
          commands.COMMAND_MAX) %
          commands.COMMAND_MAX) as Command
        const nextState = gen.next(true).value
        if (nextState) {
          setState(nextState)
        }
        return
      }
      case 'ArrowDown':
      case 's': {
        state.player.command = ((state.player.command + 1) %
          commands.COMMAND_MAX) as Command
        const nextState = gen.next(true).value

        if (nextState) {
          setState(nextState)
        }
        return
      }
    }
  }

  useKeyDown(selectCommand)

  return { state, selectCommand }
}

function* battleLoop(characters: Character[]) {
  const [player, monster] = characters
  player.target = 1
  monster.target = 0

  while (true) {
    let commandSelecting = true
    while (commandSelecting) {
      commandSelecting = yield {
        message: `${selectCommandMessage(player.command, commandNames).join(
          '\n',
        )}`,
        player,
      }
    }
    for (const c of characters) {
      switch (c.command) {
        case commands.COMMAND_FIGHT: {
          yield { message: `${c.name} の攻撃！`, player }
          const damage = Math.floor(1 + Math.random() * c.attack)
          const target = characters[c.target]
          target.hp = target.hp - damage
          target.hp = target.hp < 0 ? 0 : target.hp
          yield {
            message: `${target.name} に${damage}のダメージ！`,
            player,
          }
          if (target.hp === 0) {
            return {
              message:
                player.name === 'ゆうしゃ'
                  ? 'あなたは しにました'
                  : `${target.name} をたおした！`,
              player,
            }
          }
          break
        }
        case commands.COMMAND_RUN: {
          return { message: `${player.name}は にげだした！`, player }
        }
        case commands.COMMAND_SPELL: {
          if (player.mp < SPELL_COST) {
            yield { message: `MPが たりない！`, player }
            break
          }
          player.mp -= SPELL_COST

          yield { message: `${player.name}は ヒールを となえた！`, player }
          player.hp = monsters[monsterType.MONSTER_PLAYER].maxHp
          yield { message: `${player.name}のきずが かいふくした！`, player }
        }
      }
    }
  }
}
