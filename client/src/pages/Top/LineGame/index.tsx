import React, { useState } from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div``
const StyledConsole = styled.div`
  width: 640px;
  height: 480px;
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

const LifeGame: React.FC = () => {
  const hooks = useHooks()
  return (
    <StyledWrapper>
      <StyledConsole>{hooks.state}</StyledConsole>
      <button onClick={hooks.nextState}> 次の世代</button>
    </StyledWrapper>
  )
}
export default LifeGame

const useHooks = () => {
  const [gen] = useState(mainLoop())
  const [state, setState] = useState<string>(gen.next().value || '')
  const nextState = () => {
    const nextState = gen.next().value
    console.log(nextState)
    if (nextState) setState(nextState)
  }

  return { state, nextState }
}

function* mainLoop() {
  while (true) {
    yield drawField()
  }
}
const FIELD_WIDTH = 3
const FIELD_HEIGHT = 3
const field = [
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 1],
]
function drawField() {
  let ret = ''
  for (let y = 0; y < FIELD_HEIGHT; y++) {
    for (let x = 0; x < FIELD_WIDTH; x++) {
      ret = `${ret}${field[y][x] ? '■' : '　'}`
    }
    ret = `${ret}${'\n'}`
  }
  return ret
}
