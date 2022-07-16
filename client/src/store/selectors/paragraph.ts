import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '..'
import { paragraphsAdapter } from '../slices/paragraph'
import { selectedJourneyIdSelector } from './journey'

const paragraphsSelector = (state: RootState) => state.paragraphs
const paragraphsSelectors = paragraphsAdapter.getSelectors()

export const paragraphEntitySelector = createSelector(
  paragraphsSelector,
  paragraphsSelectors.selectAll,
)

// And then use the selectors to retrieve values
export const selectParagraphsSelector = createSelector(
  paragraphEntitySelector,
  selectedJourneyIdSelector,
  (entities, id) =>
    id
      ? Object.values(entities).flatMap((v) =>
          v?.journeyId === id ? v : [],
        ) || []
      : [],
)

// And then use the selectors to retrieve values
export const selectedParagraphById = (state: RootState) => {
  if (state.paragraphs.selectedId) {
    return paragraphsAdapter
      .getSelectors()
      .selectById(state.paragraphs, state.paragraphs.selectedId)
  }
  return undefined
}

export const selectedParagraphIdSelector = createSelector(
  paragraphsSelector,
  (state) => state.selectedId,
)

// export const selectedParagraphByJournalId = (state: RootState) => {
//   if (state.journeys.selectedId) {
//     return paragraphsAdapter
//       .getSelectors()
//       .selectAll(state.paragraphs)
//       .filter((v) => v.journeyId === state.journeys.selectedId)
//   }
//   return undefined
// }
