import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import type { EventTable } from '@/domain/journey/types'
import { UUID } from '@/domain/uuid/UUID'
import { RootState } from '..'
import { EventTableForm } from '@/contents/jouney/EventTableEditForm'

export const eventTablesAdapter = createEntityAdapter<EventTable>({
  selectId: (eventTable) => eventTable.eventTableId,
  sortComparer: (a, b) => a.order - b.order,
})

export const eventTableUp = createAsyncThunk<
  EventTable[],
  number,
  { state: RootState }
>('eventTables/eventTableUp', async (req, thunkAPI) => {
  const state = thunkAPI.getState()
  const eventTables = eventTablesAdapter
    .getSelectors()
    .selectAll(state.eventTables)
    .filter((p) => p.paragraphId === state.paragraphs.selectedId)
  if (req === 0) return eventTables
  const tmp = eventTables[req]
  eventTables[req] = eventTables[req - 1]
  eventTables[req - 1] = tmp
  return eventTables.map((e, i) => ({
    ...e,
    order: i,
  }))
})

export const eventTableDown = createAsyncThunk<
  EventTable[],
  number,
  { state: RootState }
>('eventTables/eventTableDown', async (req, thunkAPI) => {
  const state = thunkAPI.getState()
  const eventTables = eventTablesAdapter
    .getSelectors()
    .selectAll(state.eventTables)
    .filter((p) => p.paragraphId === state.paragraphs.selectedId)
  if (req === eventTables.length - 1) return eventTables
  const tmp = eventTables[req]
  eventTables[req] = eventTables[req + 1]
  eventTables[req + 1] = tmp
  return eventTables.map((e, i) => ({
    ...e,
    order: i,
  }))
})

type AddForm = EventTableForm
type UpdateForm = EventTableForm & { eventTableId: string }
export const eventTablesSlice = createSlice({
  name: 'eventTables',
  initialState: eventTablesAdapter.getInitialState<{ selectedId?: string }>({
    selectedId: undefined,
  }),
  reducers: {
    eventTableAdded(state, action: PayloadAction<AddForm>) {
      const { events, title, paragraphId } = action.payload

      const entity = {
        paragraphId,
        eventTableId: UUID.randomUUID(),
        events,
        title,
        createdAtEpoc: Date.now(),
        order: Date.now(),
      }
      eventTablesAdapter.addOne(state, entity)
    },
    eventTableUpdate(state, action: PayloadAction<UpdateForm>) {
      const { title, events, eventTableId } = action.payload
      const entity = {
        title,
        events,
      }
      eventTablesAdapter.updateOne(state, { id: eventTableId, changes: entity })
    },
    eventTableRemove(state, action: PayloadAction<string>) {
      eventTablesAdapter.removeOne(state, action.payload)
    },
    selectId(state, action: PayloadAction<string>) {
      state.selectedId = action.payload
    },
    resetId(state) {
      state.selectedId = undefined
    },
    eventTablesReceived(state, action) {
      eventTablesAdapter.setAll(state, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(eventTableUp.fulfilled, (state, action) => {
      eventTablesAdapter.setAll(state, action.payload)
    })
    builder.addCase(eventTableDown.fulfilled, (state, action) => {
      eventTablesAdapter.setAll(state, action.payload)
    })
  },
})
