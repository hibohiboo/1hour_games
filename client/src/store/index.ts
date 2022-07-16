import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import {
  initJourneyEntity,
  persistJourneyMiddleWare,
} from '@/domain/journey/repository'
import {
  authSlice,
  eventTablesSlice,
  journeysSlice,
  paragraphsSlice,
  previewSlice,
} from './slices'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    journeys: journeysSlice.reducer,
    paragraphs: paragraphsSlice.reducer,
    eventTables: eventTablesSlice.reducer,
    preview: previewSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistJourneyMiddleWare),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

// 初期値の復元
initJourneyEntity(store.dispatch)
