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
      <button onClick={hooks.start}> 開始</button>
      <button onClick={hooks.stop}> 終了</button>
    </StyledWrapper>
  )
}
export default LifeGame

const useHooks = () => {
  const [gen] = useState(mainLoop())
  const [state, setState] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const nextState = React.useCallback(() => {
    const nextState = gen.next().value
    // console.log(nextState)
    if (nextState) setState(nextState)
  }, [setState, gen])

  useTimeout(100, isRunning, nextState)

  const start = () => {
    setIsRunning(true)
  }
  const stop = () => {
    setIsRunning(false)
  }
  return { state, nextState, start, stop }
}
const shallowCopy = (obj: any) => JSON.parse(JSON.stringify(obj))

function* mainLoop() {
  let f = shallowCopy(field)
  let loopCount = 0
  yield drawField(f)
  while (true) {
    f = stepSimuration(f)
    console.log(loopCount++)
    yield drawField(f)
  }
}
const FIELD_WIDTH = 12
const FIELD_HEIGHT = 12
const defaultField: number[][] = new Array(FIELD_HEIGHT).fill(
  new Array(FIELD_WIDTH).fill(0),
)
const seed = [
  // // グライダー
  // [0, 1, 0],
  // [0, 0, 1],
  // [1, 1, 1],
  // Rべんとみの
  [0, 1, 1],
  [1, 1, 0],
  [0, 1, 0],
]
const field = defaultField.map((row, y) =>
  row.map((col, x) => (seed[y] && seed[y][x]) || 0),
)

function stepSimuration(f: number[][]) {
  const nextField = shallowCopy(f)
  for (let y = 0; y < FIELD_HEIGHT; y++) {
    for (let x = 0; x < FIELD_WIDTH; x++) {
      const livingCellCount = getLivingCellsCountLoopField(x, y, f)

      if (livingCellCount <= 1) {
        nextField[y][x] = 0
      } else if (livingCellCount === 2) {
        nextField[y][x] = f[y][x]
      } else if (livingCellCount === 3) {
        // console.log(`${x},${y}:`, livingCellCount)
        nextField[y][x] = 1
      } else {
        nextField[y][x] = 0
      }
    }
  }
  return nextField
}
function drawField(field: number[][]) {
  let ret = ''
  for (let y = 0; y < FIELD_HEIGHT; y++) {
    for (let x = 0; x < FIELD_WIDTH; x++) {
      ret = `${ret}${field[y][x] ? '■' : '　'}`
    }
    ret = `${ret}${'\n'}`
  }
  return ret
}

function getLivingCellsCount(x: number, y: number): number {
  let count = 0
  // 隣接マスの確認
  for (let j = y - 1, lenY = y + 1; j <= lenY; j++) {
    if (j < 0 || j >= FIELD_HEIGHT) continue
    for (let i = x - 1, lenX = x + 1; i <= lenX; i++) {
      if (x < 0 || x >= FIELD_WIDTH) continue
      if (i === x && j === y) continue
      count += field[j][i]
    }
  }
  return count
}
function getLivingCellsCountLoopField(
  x: number,
  y: number,
  field: number[][],
): number {
  const FIELD_HEIGHT = field.length
  const FIELD_WIDTH = field[0].length
  let count = 0
  // 隣接マスの確認
  for (let j = y - 1, lenY = y + 1; j <= lenY; j++) {
    const roopedY = (FIELD_HEIGHT + j) % FIELD_HEIGHT
    for (let i = x - 1, lenX = x + 1; i <= lenX; i++) {
      const roopedX = (FIELD_WIDTH + i) % FIELD_WIDTH
      if (x === roopedX && y === roopedY) continue
      count += field[roopedY][roopedX]
    }
  }
  return count
}

const useAnimationFrame = (
  isRunning: boolean,
  callback: (t: number) => void,
) => {
  const reqIdRef = React.useRef(0)
  const loop = React.useCallback(
    (timestamp: number) => {
      if (isRunning) {
        reqIdRef.current = requestAnimationFrame(loop)
        callback(timestamp)
      }
    },
    [isRunning, callback],
  )

  React.useEffect(() => {
    reqIdRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(reqIdRef.current)
  }, [loop])
}

const useTimeout = (
  interval: number,
  isRunning: boolean,
  callback: () => void,
) => {
  const reqIdRef = React.useRef(0)
  const loop = React.useCallback(() => {
    if (isRunning) {
      callback()
    }
    reqIdRef.current = setTimeout(loop, interval) as any as number
  }, [isRunning, callback, interval])

  React.useEffect(() => {
    loop()
    return () => clearTimeout(reqIdRef.current)
  }, [loop])
}
