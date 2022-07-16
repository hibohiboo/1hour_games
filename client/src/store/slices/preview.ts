import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const previewSlice = createSlice({
  name: 'preview',
  initialState: { selectedJourneyId: undefined as undefined | string },
  reducers: {
    setJourneyId(state, action: PayloadAction<string>) {
      state.selectedJourneyId = action.payload
    },
    resetJourneyId(state) {
      state.selectedJourneyId = undefined
    },
  },
})
