import React from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectedJourneyIdSelector } from '@/store/selectors/journey'
import { selectParagraphsSelector } from '@/store/selectors/paragraph'
import { paragraphsSlice } from '@/store/slices'
import { paragraphDown, paragraphUp } from '@/store/slices/paragraph'

const StyledUl = styled.ul`
  background-color: var(--base-color);
  list-style-type: none;
`
const StyledLi = styled.li`
  display: flex;
  align-items: center;
`

const StyledTitle = styled.span`
  font-size: 1.5rem;
  padding-left: 1rem;
`

const List: React.FC = () => {
  const paragraphs = useAppSelector(selectParagraphsSelector)
  const dispatch = useAppDispatch()
  const edit = (id: string) => {
    dispatch(paragraphsSlice.actions.selectId(id))
  }
  const up = (index: number) => {
    dispatch(paragraphUp(index))
  }
  const down = (index: number) => {
    dispatch(paragraphDown(index))
  }
  const remove = (id: string) => {
    if (!window.confirm('削除しますか?')) return
    dispatch(paragraphsSlice.actions.paragraphRemove(id))
  }
  if (paragraphs.length === 0) {
    return <p>シーンは未作成です。</p>
  }
  return (
    <StyledUl>
      {paragraphs.map((v, i) => (
        <StyledLi key={v?.paragraphId}>
          <button type="button" onClick={() => up(i)}>
            ↑
          </button>
          <button type="button" onClick={() => down(i)}>
            ↓
          </button>
          <button
            onClick={() => {
              edit(v.paragraphId)
            }}
            id={`buttion-${v.journeyId}`}
          >
            編集
          </button>
          <StyledTitle title={v?.text}>{v.title}</StyledTitle>
          <button
            title="削除"
            type="button"
            onClick={() => remove(v.paragraphId)}
            style={{ marginLeft: '20px' }}
          >
            x
          </button>
        </StyledLi>
      ))}
    </StyledUl>
  )
}

const ParagraphList: React.FC = () => {
  const paragraphId = useAppSelector(selectedJourneyIdSelector)
  if (!paragraphId) return <></>
  return (
    <div>
      <h2 style={{ paddingTop: 0, marginTop: 0 }}>シーン一覧</h2>
      <List />
    </div>
  )
}
export default ParagraphList
