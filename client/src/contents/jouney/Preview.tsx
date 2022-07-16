import React from 'react'
import styled from 'styled-components'
import { useAppSelector } from '@/store/hooks'
import {
  selectJourneyPlanSelector,
  selectJourneySelector,
} from '@/store/selectors/preview'

const StyledTable = styled.table`
  border-collapse: collapse;
  margin: 20px;
  margin-top: 5px;
  th,
  td {
    border: solid 1px #fff;
    text-align: center;
    padding: 10px 20px;
  }
`

const PrivewJourneyPlan: React.FC = () => {
  const prev = useAppSelector(selectJourneyPlanSelector)

  if (!prev) return <></>

  return (
    <section>
      <h1>{prev.title}</h1>
      <p style={{ whiteSpace: 'pre-line' }}>{prev.summary}</p>
      {prev.scenes.map((scene) => (
        <section key={scene.paragraphId}>
          <h2>{scene.title}</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{scene.text}</p>
          {scene.tables.map((table, i) => {
            return (
              <div key={table.eventTableId}>
                <h3>
                  ${i + 1}&nbsp;&nbsp;{table.title}
                </h3>
                <StyledTable>
                  <thead>
                    <tr>
                      <th>番号</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.events.map((e, i) => (
                      <tr key={i}>
                        <td>{e.order + 1}</td>
                        <td>{e.text}</td>
                      </tr>
                    ))}
                  </tbody>
                </StyledTable>
              </div>
            )
          })}
        </section>
      ))}
    </section>
  )
}

const PrivewJourne: React.FC = () => {
  const prev = useAppSelector(selectJourneySelector)

  if (!prev) return <></>

  return (
    <section>
      <h1>{prev.title}</h1>
      <p style={{ whiteSpace: 'pre-line' }}>{prev.summary}</p>
      {prev.scenes.map((scene) => (
        <section key={scene.paragraphId}>
          <h2>{scene.title}</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{scene.text}</p>
        </section>
      ))}
    </section>
  )
}

export const Preview: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <PrivewJourneyPlan />
      <PrivewJourne />
    </div>
  )
}
