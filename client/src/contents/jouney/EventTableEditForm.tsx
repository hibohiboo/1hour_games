import React, { FocusEventHandler, useEffect, useState } from 'react'
import {
  SubmitHandler,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  UseFormReturn,
} from 'react-hook-form'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import type { EventItem } from '@/domain/journey/types'
import { useAppSelector } from '@/store/hooks'
import { selectedEventTableById } from '@/store/selectors/eventTable'
import { selectedParagraphIdSelector } from '@/store/selectors/paragraph'
import { eventTablesSlice } from '@/store/slices'

type EditForm = {
  title: string
  events: EventItem[]
}
export type EventTableForm = EditForm & {
  paragraphId: string
}
const StyledTable = styled.table`
  border-collapse: collapse;
  margin: 20px;
  margin-top: 5px;
  th,
  td {
    border: solid 1px #fff;
    text-align: center;
  }
`
const StyledLabel = styled.label`
  display: block;
  background-color: var(--surface-color);
`
const StyledBaseDiv = styled.div`
  background-color: var(--base-color);
`
const CREATE_LABEL = '新規登録'
const EDIT_LABEL = '更新'
type SubmitForm = (data: EditForm) => void

const TableForm: React.FC<{
  formTitle: string
  events: EventItem[]
  setEvent: any
  submitForm: SubmitForm
  form: UseFormReturn<EditForm>
  submitLabel: typeof CREATE_LABEL | typeof EDIT_LABEL
}> = ({
  formTitle,
  events,
  setEvent,
  submitForm,
  submitLabel,
  form: {
    handleSubmit,
    register,
    formState: { errors },
  },
}) => {
  const onSubmit: SubmitHandler<EditForm> = (data) => {
    submitForm({ ...data, events: [...events] })
  }
  const addRows = () => {
    setEvent([...events, { order: events.length, text: '' }])
  }
  const upOrder = (index: number) => {
    if (index === 0) return
    const zenhan = index === 1 ? [] : events.slice(0, index - 1)
    const [pref, current, ...rest] = events.slice(index - 1)

    setEvent(
      [...zenhan, current, pref, ...rest].map((e, i) => ({
        ...e,
        order: i,
      })),
    )
  }
  const downOrder = (index: number) => {
    if (index === events.length - 1) return
    const zenhan = events.slice(0, index)
    const [current, next, ...rest] = events.slice(index)

    setEvent(
      [...zenhan, next, current, ...rest].map((e, i) => ({
        ...e,
        order: i,
      })),
    )
  }
  const setText = (e: any, s: string) => {
    setEvent(
      events.map((item) => (item.order === e.order ? { ...e, text: s } : item)),
    )
  }
  const deleteRow = (index: number) => {
    setEvent(
      events.filter((_, i) => i !== index).map((e, i) => ({ ...e, order: i })),
    )
  }

  return (
    <StyledBaseDiv>
      <h2>{formTitle}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledLabel>
          <div>タイトル</div>
          <input {...register('title', { required: true })} />
          {errors.title && <span>タイトルは必須です</span>}
        </StyledLabel>
        <button type="button" onClick={addRows} style={{ marginLeft: '20px' }}>
          行追加
        </button>
        <StyledTable>
          <thead>
            <tr>
              {/* <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
              <th>&nbsp;&nbsp;&nbsp;&nbsp;</th> */}
              <th>番号</th>
              <th>内容</th>
              <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {events
              .sort((a, b) => a.order - b.order)
              .map((e, i) => (
                <tr key={i}>
                  {/* <td>
                    <button type="button" onClick={() => upOrder(i)}>
                      ↑
                    </button>
                  </td>
                  <td>
                    <button type="button" onClick={() => downOrder(i)}>
                      ↓
                    </button>
                  </td> */}
                  <td>{e.order + 1}</td>
                  <td>
                    <textarea
                      rows={1}
                      cols={20}
                      value={e.text}
                      onChange={(ev) => setText(e, ev.target.value)}
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => deleteRow(i)}>
                      x
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </StyledTable>

        <input type="submit" value={submitLabel} />
      </form>
    </StyledBaseDiv>
  )
}
export const EventTableCreateForm: React.FC = () => {
  const dispatch = useDispatch()
  const form = useForm<EditForm>()
  const paragraphId = useAppSelector(selectedParagraphIdSelector)
  const [events, setEvent] = useState<EventItem[]>([])

  if (!paragraphId) return <></>

  const submitForm: SubmitForm = (data) => {
    dispatch(
      eventTablesSlice.actions.eventTableAdded({
        ...data,
        paragraphId,
      }),
    )
    form.reset()
    setEvent([])
  }
  return (
    <details style={{ padding: '10px' }}>
      <summary>表追加</summary>
      {TableForm({
        formTitle: '新規表作成',
        events,
        setEvent,
        submitForm,
        form,
        submitLabel: CREATE_LABEL,
      })}
    </details>
  )
}

const EditTableForm: React.FC<{
  formTitle: string
  formFieldArray: UseFieldArrayReturn<EditForm, 'events', 'eventId'>
  submitForm: SubmitForm
  form: UseFormReturn<EditForm>
}> = ({
  formTitle,
  formFieldArray,
  submitForm,
  form: {
    handleSubmit,
    register,
    formState: { errors },
  },
}) => {
  const onSubmit: SubmitHandler<EditForm> = (data) => {
    submitForm(data)
  }
  const submit = handleSubmit(onSubmit)
  const onBlur: FocusEventHandler<HTMLInputElement> = () => {
    submit()
  }
  const addRows = () => {
    formFieldArray.append({ order: formFieldArray.fields.length, text: '' })
  }

  const deleteRow = (index: number) => {
    formFieldArray.remove(index)
  }

  return (
    <StyledBaseDiv>
      <h2>{formTitle}</h2>

      <StyledLabel>
        <div>タイトル</div>
        <input {...register('title', { required: true, onBlur })} />
        {errors.title && <span>タイトルは必須です</span>}
      </StyledLabel>
      <button type="button" onClick={addRows} style={{ marginLeft: '20px' }}>
        行追加
      </button>
      <StyledTable>
        <thead>
          <tr>
            <th>番号</th>
            <th>内容</th>
            <th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {formFieldArray.fields.map((e, i) => (
            <tr key={i}>
              <td>{e.order + 1}</td>
              <td>
                <textarea
                  rows={1}
                  cols={20}
                  {...register(`events.${i}.text`, { onBlur })}
                />
              </td>
              <td>
                <button type="button" onClick={() => deleteRow(i)}>
                  x
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledBaseDiv>
  )
}

export const EventTableEditForm: React.FC = () => {
  const eventTable = useAppSelector(selectedEventTableById)
  const dispatch = useDispatch()
  const form = useForm<EditForm>()
  const formFieldArray = useFieldArray({
    control: form.control,
    name: 'events',
    keyName: 'eventId',
  })
  const { reset } = form
  useEffect(() => {
    if (eventTable) reset(eventTable)
  }, [eventTable, reset])
  if (!eventTable) return <></>

  const submitForm: SubmitForm = (data) => {
    dispatch(
      eventTablesSlice.actions.eventTableUpdate({
        ...data,
        paragraphId: eventTable.paragraphId,
        eventTableId: eventTable.eventTableId,
      }),
    )
  }

  return EditTableForm({
    formTitle: '表編集',
    formFieldArray,
    submitForm,
    form,
  })
}
