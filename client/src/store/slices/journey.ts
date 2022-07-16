import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { myFetch } from '@/domain/http/fetch'
import { journeyToScenario } from '@/domain/journey/converter'
import { EventTable, Journey, Paragraph } from '@/domain/journey/types'
import { UUID } from '@/domain/uuid/UUID'
import { RootState } from '..'
import { JourneyEditForm } from '@/contents/jouney/EditForm'

export const uploadJourney = createAsyncThunk<
  string,
  string,
  { state: RootState }
>('uploadJourney', async (id, thunkAPI) => {
  const state = thunkAPI.getState()
  const scenario = journeyToScenario(
    id,
    Object.values(state.journeys.entities) as Journey[],
    Object.values(state.paragraphs.entities) as Paragraph[],
    Object.values(state.eventTables.entities) as EventTable[],
  )

  await myFetch(`/v1/api/solo-journal/scenario/${scenario.journeyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...scenario,
      uid: state.auth.uid,
    }),
  })
  alert('シナリオを公開しました。')

  return id
})

export const jouneysAdapter = createEntityAdapter<Journey>({
  selectId: (journey) => journey.journeyId,
  sortComparer: (a, b) => b.updatedAtEpoc - a.updatedAtEpoc,
})
type AddForm = JourneyEditForm
type UpdateForm = JourneyEditForm & { journeyId: string }

export const journeysSlice = createSlice({
  name: 'journeys',
  initialState: jouneysAdapter.getInitialState<{ selectedId?: string }>({
    selectedId: undefined,
  }),
  reducers: {
    journeyAdded: {
      reducer(state, action: PayloadAction<Journey>) {
        jouneysAdapter.addOne(state, action.payload)
      },
      prepare(form: AddForm) {
        const { title, summary } = form
        const now = Date.now()
        const entity = {
          journeyId: UUID.randomUUID(),
          title,
          summary,
          updatedAtEpoc: now,
          createdAtEpoc: now,
          isPublish: false,
        }
        return { payload: entity }
      },
    },
    journeyUpdate: {
      reducer(
        state,
        action: PayloadAction<UpdateForm & { updatedAtEpoc: number }>,
      ) {
        jouneysAdapter.updateOne(state, {
          id: action.payload.journeyId,
          changes: action.payload,
        })
      },
      prepare(form: UpdateForm) {
        const { title, summary, journeyId } = form
        const entity = {
          journeyId,
          title,
          summary,
          updatedAtEpoc: Date.now(),
        }
        return { payload: entity }
      },
    },
    selectId(state, action: PayloadAction<string>) {
      state.selectedId = action.payload
    },
    resetId(state) {
      state.selectedId = undefined
    },
    journeysReceived(state, action) {
      jouneysAdapter.setAll(state, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadJourney.fulfilled, (state, action) => {
      jouneysAdapter.updateOne(state, {
        id: action.payload,
        changes: { isPublish: true },
      })
    })
  },
})
