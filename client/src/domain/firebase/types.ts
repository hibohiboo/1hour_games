export interface TimeStamp {
  seconds: number | string
  nanoseconds: number | string
}

interface UploadUser {
  uid: string
}
interface StoreInfo {
  id: string
  updatedAt: TimeStamp
  createdAt: TimeStamp
}
export type StoreBase = UploadUser & StoreInfo
