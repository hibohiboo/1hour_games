import React from 'react'
import styled from 'styled-components'
import { CreateForm, EditForm } from '@/contents/jouney/EditForm'
import {
  EventTableCreateForm,
  EventTableEditForm,
} from '@/contents/jouney/EventTableEditForm'
import EventTableList from '@/contents/jouney/EventTableList'
import JourneyList from '@/contents/jouney/JourneyList'
import {
  ParagraphCreateForm,
  ParagraphEditForm,
} from '@/contents/jouney/ParagraphEditForm'
import ParagraphList from '@/contents/jouney/ParagraphList'
import { Preview } from '@/contents/jouney/Preview'

const Wrapper = styled.div`
  --txt-color: #fff; /* opacity 0.9 のときの #fffの値 */
  --oveflow-color: #010101; /* ブラックスミア防止に#000を避ける */
  --base-color: #1f2023;
  --surface-color: #27292d;
  --overlay-dark-color: #202f34;
  --overlay-light-color: #38384d;
  --green-color: #55c500;
  background-color: var(--oveflow-color);
  position: relative;
  width: 100%;
  min-height: 100%;
  padding-bottom: 100px;
`

const StyledDetails = styled.details`
  padding: 10px;
`
const Shell: React.FC = () => {
  return (
    <Wrapper>
      <CreateForm />

      <JourneyList />
      <EditForm />

      <ParagraphCreateForm />

      <ParagraphList />
      <ParagraphEditForm />
      <EventTableCreateForm />
      <EventTableList />
      <EventTableEditForm />
      <Preview />
    </Wrapper>
  )
}
export default Shell
