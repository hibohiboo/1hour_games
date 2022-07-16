import React, { FocusEventHandler } from 'react'
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useAppSelector } from '@/store/hooks'
import { selectedJourneyById } from '@/store/selectors/journey'
import { journeysSlice } from '@/store/slices'
export type JourneyEditForm = {
  title: string
  summary: string
}

const StyledLabel = styled.label`
  display: block;
  background-color: var(--surface-color);
`
const StyledBaseDiv = styled.div`
  background-color: var(--base-color);
`

const CREATE_LABEL = '新規登録'
const EDIT_LABEL = '更新'
type SubmitForm = (data: JourneyEditForm) => void
const JournalForm: React.FC<{
  formTitle: string
  submitForm: SubmitForm
  form: UseFormReturn<JourneyEditForm>
  submitLabel: typeof CREATE_LABEL | typeof EDIT_LABEL
}> = ({
  formTitle,
  submitForm,
  submitLabel,
  form: {
    handleSubmit,
    register,
    formState: { errors },
  },
}) => {
  const onSubmit: SubmitHandler<JourneyEditForm> = (data) => {
    submitForm(data)
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
        <StyledLabel>
          <div>概要</div>
          <textarea {...register('summary')} rows={5} cols={50} />
        </StyledLabel>

        <input type="submit" value={submitLabel} />
      </form>
    </StyledBaseDiv>
  )
}
export const CreateForm: React.FC = () => {
  const dispatch = useDispatch()
  const form = useForm<JourneyEditForm>()

  const submitForm: SubmitForm = (data) => {
    dispatch(journeysSlice.actions.journeyAdded(data))
    form.reset()
  }
  return (
    <details style={{ padding: '10px' }}>
      <summary>シナリオ追加</summary>
      {JournalForm({
        formTitle: '新規シナリオ作成',
        submitForm,
        form,
        submitLabel: CREATE_LABEL,
      })}
    </details>
  )
}

const JournalEditForm: React.FC<{
  formTitle: string
  submitForm: SubmitForm
  form: UseFormReturn<JourneyEditForm>
}> = ({
  formTitle,
  submitForm,
  form: {
    handleSubmit,
    register,
    formState: { errors },
  },
}) => {
  const onSubmit: SubmitHandler<JourneyEditForm> = (data) => {
    submitForm(data)
  }
  const onBlur: FocusEventHandler<HTMLInputElement> = () => {
    handleSubmit(onSubmit)()
  }
  return (
    <StyledBaseDiv>
      <h2>{formTitle}</h2>
      <form>
        <StyledLabel>
          <div>タイトル</div>
          <input {...register('title', { required: true, onBlur })} />
          {errors.title && <span>タイトルは必須です</span>}
        </StyledLabel>
        <StyledLabel>
          <div>概要</div>
          <textarea {...register('summary', { onBlur })} rows={5} cols={50} />
        </StyledLabel>
      </form>
    </StyledBaseDiv>
  )
}

export const EditForm: React.FC = () => {
  const journey = useAppSelector(selectedJourneyById)
  const dispatch = useDispatch()
  const form = useForm<JourneyEditForm>()
  if (!journey) return <></>
  form.setValue('summary', journey.summary)
  form.setValue('title', journey.title)

  const submitForm: SubmitForm = (data) => {
    dispatch(
      journeysSlice.actions.journeyUpdate({
        ...data,
        journeyId: journey.journeyId,
      }),
    )
  }
  return JournalEditForm({
    formTitle: `編集 - ${journey.title}`,
    submitForm,
    form,
  })
}
