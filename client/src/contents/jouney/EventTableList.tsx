import React from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selecteventTablesSelector } from '@/store/selectors/eventTable'
import { selectedJourneyIdSelector } from '@/store/selectors/journey'
import { eventTablesSlice } from '@/store/slices'
import { eventTableDown, eventTableUp } from '@/store/slices/eventTables'

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

const Table: React.FC = () => {
  const eventTable = useAppSelector(selecteventTablesSelector)
  const dispatch = useAppDispatch()
  const edit = (id: string) => {
    dispatch(eventTablesSlice.actions.selectId(id))
  }
  const up = (i: number) => {
    dispatch(eventTableUp(i))
  }
  const down = (i: number) => {
    dispatch(eventTableDown(i))
  }
  const remove = (id: string) => {
    if (!window.confirm('削除しますか?')) return
    dispatch(eventTablesSlice.actions.eventTableRemove(id))
  }
  return (
    <StyledUl>
      {eventTable.map((v, i) => (
        <StyledLi key={v.eventTableId}>
          <button type="button" onClick={() => up(i)}>
            ↑
          </button>
          <button type="button" onClick={() => down(i)}>
            ↓
          </button>
          <button
            onClick={() => {
              edit(v.eventTableId)
            }}
            id={`buttion-${v.eventTableId}`}
          >
            編集
          </button>
          <StyledTitle title={v.title}>
            ${i + 1}&nbsp;&nbsp;{v.title}
          </StyledTitle>
          <button
            title="削除"
            type="button"
            onClick={() => remove(v.eventTableId)}
            style={{ marginLeft: '20px' }}
          >
            x
          </button>
        </StyledLi>
      ))}
    </StyledUl>
  )
}

const EventTableList: React.FC = () => {
  const paragraphId = useAppSelector(selectedJourneyIdSelector)
  if (!paragraphId) return <></>
  return (
    <div>
      <Table />
    </div>
  )
}
export default EventTableList
