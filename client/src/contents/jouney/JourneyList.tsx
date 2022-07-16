import React from 'react'
import format from 'date-fns/format'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { allJourneys } from '@/store/selectors/journey'
import {
  eventTablesSlice,
  journeysSlice,
  paragraphsSlice,
  previewSlice,
} from '@/store/slices'
import { uploadJourney } from '@/store/slices/journey'

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
const StyledSpan = styled.span`
  font-size: 0.8rem;
  padding-left: 1rem;
`

const StyledPublish = styled.span`
  border: solid 2px var(--green-color);
  font-size: 0.5rem;
  margin-left: 1rem;
  padding: 3px;
`

const Time: React.FC<{ time: number }> = ({ time }) => {
  return <StyledSpan>{format(time, 'yyyy-MM-dd HH:mm:ss')} 最終更新</StyledSpan>
}

const List: React.FC = () => {
  const journeys = useAppSelector(allJourneys)
  const dispatch = useAppDispatch()
  const edit = (id: string) => {
    dispatch(previewSlice.actions.resetJourneyId())
    dispatch(journeysSlice.actions.selectId(id))
  }
  const prev = (id: string) => {
    dispatch(journeysSlice.actions.resetId())
    dispatch(eventTablesSlice.actions.resetId())
    dispatch(paragraphsSlice.actions.resetId())
    dispatch(previewSlice.actions.setJourneyId(id))
  }
  const publish = (id: string) => {
    if (!window.confirm('シナリオを公開します。よろしいですか？')) return
    dispatch(uploadJourney(id))
  }
  if (journeys.length === 0) {
    return <p>シナリオは未作成です。</p>
  }
  return (
    <StyledUl>
      {journeys.map((v) => (
        <StyledLi key={v.journeyId}>
          <button
            onClick={() => {
              edit(v.journeyId)
            }}
            id={`buttion-${v.journeyId}`}
          >
            編集
          </button>
          <button
            onClick={() => {
              prev(v.journeyId)
            }}
          >
            プレビュー
          </button>
          <button
            onClick={() => {
              publish(v.journeyId)
            }}
          >
            公開
          </button>
          {v.isPublish && <StyledPublish>公開中</StyledPublish>}
          <StyledTitle title={v.summary}>{v.title}</StyledTitle>
          {/* <Time time={v.updatedAtEpoc} /> */}
        </StyledLi>
      ))}
    </StyledUl>
  )
}

const JourneyList: React.FC = () => {
  return (
    <div>
      <h2 style={{ paddingTop: 0, marginTop: 0 }}>シナリオ一覧</h2>
      <List />
    </div>
  )
}
export default JourneyList
