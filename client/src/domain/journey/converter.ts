import { EventTable, Journey, Paragraph } from './types'

export const journeyToScenario = (
  journeyId: string,
  journeys: Journey[],
  paragraphs: Paragraph[],
  eventTables: EventTable[],
) => {
  const scenario = journeys.find((item) => item.journeyId === journeyId)
  if (!scenario) throw Error()
  const scenes = paragraphs
    .filter((item) => item.journeyId === journeyId)
    .map((item) => {
      const tables = eventTables.filter(
        (t) => t.paragraphId === item.paragraphId,
      )
      return { ...item, tables }
    })
  return { ...scenario, scenes }
}
