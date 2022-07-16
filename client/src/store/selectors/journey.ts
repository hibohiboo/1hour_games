import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '..'
import { jouneysAdapter } from '../slices/journey'

export const journeySelector = (state: RootState) => state.journeys
const journeysSelectors =
  jouneysAdapter.getSelectors<RootState>(journeySelector)

// And then use the selectors to retrieve values
export const allJourneys = journeysSelectors.selectAll
// And then use the selectors to retrieve values
export const selectedJourneyById = (state: RootState) => {
  if (state.journeys.selectedId) {
    return jouneysAdapter
      .getSelectors()
      .selectById(state.journeys, state.journeys.selectedId)
  }
  return undefined
}

export const selectedJourneyIdSelector = createSelector(
  journeySelector,
  (state) => state.selectedId,
)

export const journeyEntitySelector = createSelector(
  journeySelector,
  jouneysAdapter.getSelectors().selectAll,
)
