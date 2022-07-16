import { Dispatch, Middleware } from '@reduxjs/toolkit'
import {
  eventTablesSlice,
  journeysSlice,
  paragraphsSlice,
  previewSlice,
} from '@/store/slices'
import { eventTableDown, eventTableUp } from '@/store/slices/eventTables'
import { uploadJourney } from '@/store/slices/journey'
import { paragraphDown, paragraphUp } from '@/store/slices/paragraph'
import { journeyToScenario } from './converter'

const JOURNEY_LOCAL_STORAGE_KEY = 'JOURNEY_LOcAL_STORAGE_KEY'
const SCENARIOS_LOCAL_STORAGE_KEY = 'SCENARIOS_LOCAL_STORAGE_KEY'
export const initJourneyEntity = (dispatch: Dispatch) => {
  const journeysJson = localStorage.getItem(JOURNEY_LOCAL_STORAGE_KEY)
  if (!journeysJson) return
  const json = JSON.parse(journeysJson)
  dispatch(journeysSlice.actions.journeysReceived(json.journeys))
  if (!json.paragraphs) return
  dispatch(paragraphsSlice.actions.paragraphsReceived(json.paragraphs))
  if (!json.eventTable) return
  dispatch(eventTablesSlice.actions.eventTablesReceived(json.eventTable))
}

export const persistJourneyMiddleWare: Middleware =
  (store) => (next) => (action) => {
    next(action)

    // ジャーニーが更新された時には保存する
    if (
      [
        journeysSlice.actions.journeyAdded.type,
        journeysSlice.actions.journeyUpdate.type,
        uploadJourney.fulfilled.type,
        paragraphsSlice.actions.paragraphAdded.type,
        paragraphsSlice.actions.paragraphUpdate.type,
        paragraphsSlice.actions.paragraphRemove.type,
        eventTablesSlice.actions.eventTableAdded.type,
        eventTablesSlice.actions.eventTableUpdate.type,
        eventTablesSlice.actions.eventTableRemove.type,
        paragraphUp.fulfilled.type,
        paragraphDown.fulfilled.type,
        eventTableUp.fulfilled.type,
        eventTableDown.fulfilled.type,
      ].includes(action.type)
    ) {
      const state = store.getState()
      const saveObject = {
        journeys: Object.values(state.journeys.entities),
        paragraphs: Object.values(state.paragraphs.entities),
        eventTable: Object.values(state.eventTables.entities),
      }
      localStorage.setItem(
        JOURNEY_LOCAL_STORAGE_KEY,
        JSON.stringify(saveObject),
      )
    }
    // プレビュー時にジャーナル記述用に保存
    if ([previewSlice.actions.setJourneyId.type].includes(action.type)) {
      const state = store.getState()

      const journeyId = state.preview.selectedJourneyId
      if (!journeyId) return

      const journeys = Object.values(state.journeys.entities) as any
      const paragraphs = Object.values(state.paragraphs.entities) as any
      const eventTables = Object.values(state.eventTables.entities) as any

      const scenario = journeyToScenario(
        journeyId,
        journeys,
        paragraphs,
        eventTables,
      )
      const beforeJson =
        localStorage.getItem(SCENARIOS_LOCAL_STORAGE_KEY) || '{}'
      const storage = JSON.parse(beforeJson)
      storage[journeyId] = scenario
      localStorage.setItem(SCENARIOS_LOCAL_STORAGE_KEY, JSON.stringify(storage))
    }
  }
