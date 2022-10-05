import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { authSlice } from './slices'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(persistJourneyMiddleWare),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

// // 初期値の復元
// initJourneyEntity(store.dispatch)
