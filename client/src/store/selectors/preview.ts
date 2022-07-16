import { createSelector } from '@reduxjs/toolkit'
import { journeyToScenario } from '@/domain/journey/converter'
import { RootState } from '..'
import { eventTableEntitiesSelector } from './eventTable'
import { journeyEntitySelector } from './journey'
import { paragraphEntitySelector } from './paragraph'

const priviewSelector = (state: RootState) => state.preview
const selectedPreviewIdSelector = createSelector(
  priviewSelector,
  (state) => state.selectedJourneyId,
)
// And then use the selectors to retrieve values
export const selectJourneyPlanSelector = createSelector(
  selectedPreviewIdSelector,
  journeyEntitySelector,
  paragraphEntitySelector,
  eventTableEntitiesSelector,
  (journeyId, journeys, paragraphs, eventTables) => {
    if (!journeyId) return undefined

    return journeyToScenario(journeyId, journeys, paragraphs, eventTables)
  },
)

export const selectJourneySelector = createSelector(
  selectJourneyPlanSelector,
  (journey) => {
    if (!journey) return undefined

    const scenes = journey.scenes.map((item) => {
      const selectedItems = item.tables.flatMap((item, idx) => {
        const length = item.events.length
        if (length === 0) return []
        // ~~: 整数化
        const selected = item.events[~~(Math.random() * length)]
        if (!selected) return []
        return {
          title: item.title,
          replaceText: `$${idx + 1}`,
          text: selected.text,
        }
      })
      const text = selectedItems.reduce((prev, cur) => {
        return prev.replaceAll(cur.replaceText, cur.text)
      }, item.text)
      return { ...item, text, selectedItems }
    })
    return { ...journey, scenes }
  },
)
