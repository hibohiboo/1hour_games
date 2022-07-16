import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { Paragraph } from '@/domain/journey/types'
import { UUID } from '@/domain/uuid/UUID'
import { AppDispatch, RootState } from '..'
import { ParagrapForm } from '@/contents/jouney/ParagraphEditForm'

export const paragraphUp = createAsyncThunk<
  Paragraph[],
  number,
  { state: RootState; dispatch: AppDispatch }
>('paragraphs/paragraphUp', async (req, thunkAPI) => {
  const state = thunkAPI.getState()
  const paragraphs = paragraphsAdapter
    .getSelectors()
    .selectAll(state.paragraphs)
    .filter((p) => p.journeyId === state.journeys.selectedId)
  if (req === 0) return paragraphs
  const firstPart = req === 1 ? [] : paragraphs.slice(0, req - 1)
  const [pref, current, ...rest] = paragraphs.slice(req - 1)
  return [...firstPart, current, pref, ...rest].map((e, i) => ({
    ...e,
    order: i,
  }))
})

export const paragraphDown = createAsyncThunk<
  Paragraph[],
  number,
  { state: RootState }
>('paragraphs/paragraphDown', async (req, thunkAPI) => {
  const state = thunkAPI.getState()
  const paragraphs = paragraphsAdapter
    .getSelectors()
    .selectAll(state.paragraphs)
    .filter((p) => p.journeyId === state.journeys.selectedId)

  if (req === paragraphs.length - 1) return paragraphs
  const zenhan = paragraphs.slice(0, req)
  const [current, next, ...rest] = paragraphs.slice(req)
  return [...zenhan, next, current, ...rest].map((e, i) => ({
    ...e,
    order: i,
  }))
})

export const paragraphsAdapter = createEntityAdapter<Paragraph>({
  selectId: (paragraph) => paragraph.paragraphId,
  sortComparer: (a, b) => a.order - b.order,
})
type AddForm = ParagrapForm
type UpdateForm = ParagrapForm & { paragraphId: string }
export const paragraphsSlice = createSlice({
  name: 'paragraphs',
  initialState: paragraphsAdapter.getInitialState<{ selectedId?: string }>({
    selectedId: undefined,
  }),
  reducers: {
    paragraphAdded(state, action: PayloadAction<AddForm>) {
      const { title, text, journeyId } = action.payload

      const entity = {
        journeyId,
        paragraphId: UUID.randomUUID(),
        title,
        text,
        createdAtEpoc: Date.now(),
        order: Date.now(),
      }
      paragraphsAdapter.addOne(state, entity)
    },
    paragraphUpdate(state, action: PayloadAction<UpdateForm>) {
      const { title, text, paragraphId } = action.payload
      const entity = {
        title,
        text,
      }
      paragraphsAdapter.updateOne(state, { id: paragraphId, changes: entity })
    },
    paragraphRemove(state, action: PayloadAction<string>) {
      paragraphsAdapter.removeOne(state, action.payload)
    },
    selectId(state, action: PayloadAction<string>) {
      state.selectedId = action.payload
    },
    resetId(state) {
      state.selectedId = undefined
    },
    paragraphsReceived(state, action) {
      paragraphsAdapter.setAll(state, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(paragraphUp.fulfilled, (state, action) => {
      paragraphsAdapter.setAll(state, action.payload)
    })
    builder.addCase(paragraphDown.fulfilled, (state, action) => {
      paragraphsAdapter.setAll(state, action.payload)
    })
  },
})
