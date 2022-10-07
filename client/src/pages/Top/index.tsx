import React from 'react'
import styled from 'styled-components'
import BattleScene from './BattleScene'
import LifeGame from './LineGame'

const StyledWrapper = styled.div`
  padding-bottom: 50px;
`
const StyledSection = styled.section`
  h1 {
    font-size: 1.2rem;
  }
  h2 {
    font-size: 1rem;
  }
  max-width: 400px;
`
const Top: React.FC = () => {
  return (
    <StyledWrapper>
      <StyledSection>
        <h1>【第1章】RPGの戦闘シーン</h1>
        <h2>回復呪文を軸とした、ラスボスとの激闘！</h2>
        <p>
          圧勝する勇者。しかしそこに降臨した魔王に歯が立たず、「にげる」コマンドを実装して逃げてしまう…
          このまま引き下がれないと、「じゅもん」コマンドを実装し、再び魔王に挑むが果たして…
          勇者の運命や如何に？！
        </p>
        <BattleScene />
      </StyledSection>

      <StyledSection>
        <h1>【第2章】ライフゲーム</h1>
        <h2>神秘的な生命シミュレーション</h2>
        <p>
          生命の「繁殖」、過疎や過密による「死滅」を再現する、見て楽しむシミュレーションゲームです。世代を進める方法として、キーボードを押す毎に進める方法と、リアルタイムに自動で進める方法を実装します。任意のパターンを、フィールドの任意の場所にコピーする処理も実装します。本章の最後では、世界中で発見された興味深いパターンを紹介します。
        </p>
        <LifeGame />
      </StyledSection>
    </StyledWrapper>
  )
}
export default Top
