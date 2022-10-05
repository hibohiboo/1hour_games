import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '..'
import { eventTablesAdapter } from '../../../../tmp/eventTables'
import { selectedParagraphIdSelector } from './paragraph'

const eventTablesSelector = (state: RootState) => state.eventTables
const eventTablesSelectors = eventTablesAdapter.getSelectors()

export const eventTableEntitiesSelector = createSelector(
  eventTablesSelector,
  eventTablesSelectors.selectAll,
)

// And then use the selectors to retrieve values
export const selecteventTablesSelector = createSelector(
  eventTableEntitiesSelector,
  selectedParagraphIdSelector,
  (entities, id) =>
    id
      ? Object.values(entities).flatMap((v) =>
          v?.paragraphId === id ? v : [],
        ) || []
      : [],
)

// And then use the selectors to retrieve values
export const selectedEventTableById = (state: RootState) => {
  if (state.eventTables.selectedId) {
    return eventTablesAdapter
      .getSelectors()
      .selectById(state.eventTables, state.eventTables.selectedId)
  }
  return undefined
}

const totalSelector = createSelector(
  eventTablesSelector,
  eventTablesSelectors.selectTotal,
)

export const replaceTextSelector = createSelector(
  totalSelector,
  (total) => `$${total + 1}`,
)
export const selectedEventTableIdSelector = createSelector(
  eventTablesSelector,
  (state) => state.selectedId,
)
