export type EventItem = {
  text: string
  order: number
}
export type Journey = {
  journeyId: string
  title: string
  summary: string
  createdAtEpoc: number
  updatedAtEpoc: number
  isPublish: boolean
}
export type Paragraph = {
  journeyId: string
  paragraphId: string
  title: string
  text: string
  createdAtEpoc: number
  order: number
}
export type EventTable = {
  paragraphId: string
  eventTableId: string
  title: string
  events: EventItem[]
  createdAtEpoc: number
  order: number
}
