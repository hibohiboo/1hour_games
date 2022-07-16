import React, { FocusEventHandler } from 'react'
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useAppSelector } from '@/store/hooks'
import { selectedJourneyIdSelector } from '@/store/selectors/journey'
import { selectedParagraphById } from '@/store/selectors/paragraph'
import { paragraphsSlice } from '@/store/slices'

type EditForm = {
  title: string
  text: string
}
export type ParagrapForm = EditForm & {
  journeyId: string
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
type SubmitForm = (data: EditForm) => void

const ParagraphForm: React.FC<{
  formTitle: string
  submitForm: SubmitForm
  form: UseFormReturn<EditForm>
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
  const onSubmit: SubmitHandler<EditForm> = (data) => {
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
          <div>本文</div>
          <textarea {...register('text')} rows={5} cols={50} />
        </StyledLabel>
        {CREATE_LABEL === submitLabel && (
          <p>本文中の$x(例、$1)には表の内容がランダムで入ります。</p>
        )}
        <input type="submit" value={submitLabel} />
      </form>
    </StyledBaseDiv>
  )
}
export const ParagraphCreateForm: React.FC = () => {
  const dispatch = useDispatch()
  const form = useForm<EditForm>()
  const journeyId = useAppSelector(selectedJourneyIdSelector)
  if (!journeyId) return <></>

  const submitForm: SubmitForm = (data) => {
    dispatch(paragraphsSlice.actions.paragraphAdded({ ...data, journeyId }))
    form.reset()
  }
  return (
    <details style={{ padding: '10px' }}>
      <summary>シーン追加</summary>
      {ParagraphForm({
        formTitle: '新規シーン作成',
        submitForm,
        form,
        submitLabel: CREATE_LABEL,
      })}
    </details>
  )
}

const PEditForm: React.FC<{
  formTitle: string
  submitForm: SubmitForm
  form: UseFormReturn<EditForm>
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
  const onSubmit: SubmitHandler<EditForm> = (data) => {
    submitForm(data)
  }
  const onBlur: FocusEventHandler<HTMLInputElement> = () => {
    handleSubmit(onSubmit)()
  }

  return (
    <StyledBaseDiv>
      <h2>{formTitle}</h2>
      <StyledLabel>
        <div>タイトル</div>
        <input {...register('title', { required: true, onBlur })} />
        {errors.title && <span>タイトルは必須です</span>}
      </StyledLabel>
      <StyledLabel>
        <div>本文</div>
        <textarea {...register('text', { onBlur })} rows={5} cols={50} />
      </StyledLabel>
      {CREATE_LABEL === submitLabel && (
        <p>本文中の$x(例、$1)には表の内容がランダムで入ります。</p>
      )}
    </StyledBaseDiv>
  )
}

export const ParagraphEditForm: React.FC = () => {
  const paragraph = useAppSelector(selectedParagraphById)
  const dispatch = useDispatch()
  const form = useForm<EditForm>()
  if (!paragraph) return <></>
  form.setValue('text', paragraph.text)
  form.setValue('title', paragraph.title)

  const submitForm: SubmitForm = (data) => {
    dispatch(
      paragraphsSlice.actions.paragraphUpdate({
        ...data,
        paragraphId: paragraph.paragraphId,
        journeyId: paragraph.journeyId,
      }),
    )
  }
  return PEditForm({
    formTitle: `編集 - ${paragraph.title}`,
    submitForm,
    form,
    submitLabel: EDIT_LABEL,
  })
}
