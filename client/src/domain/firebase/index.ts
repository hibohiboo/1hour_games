import { getAnalytics, logEvent } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  serverTimestamp as getServerTimestamp,
  Timestamp,
} from 'firebase/firestore/lite'
import { ReportHandler } from 'web-vitals'
import config from './config'
import { TimeStamp } from './types'

const firebaseApp = initializeApp(config)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)

export const serverTimestamp = getServerTimestamp
// createdAtがserializeではないオブジェクトなのでstringifyを経由することによりserialize化
export const toSerializeObject = (obj: any) => JSON.parse(JSON.stringify(obj))
export const toTimestamp = ({ seconds, nanoseconds }: TimeStamp) =>
  new Timestamp(Number(seconds), Number(nanoseconds))
// https://firebase.google.com/docs/analytics/get-started?hl=ja&platform=web

// web-vial用のハンドラを作成
const analytics = getAnalytics(firebaseApp)
export const sendToGoogleAnalytics: ReportHandler = ({ name, delta, id }) => {
  // Assumes the global `ga()` function exists, see:
  // https://developers.google.com/analytics/devguides/collection/analyticsjs
  logEvent(analytics, 'web_vitals', {
    eventCategory: 'Web Vitals',
    eventAction: name,
    eventLabel: id,
    eventValue: Math.round(name === 'CLS' ? delta * 1000 : delta),
    nonInteraction: true,
    transport: 'beacon',
  })
}
