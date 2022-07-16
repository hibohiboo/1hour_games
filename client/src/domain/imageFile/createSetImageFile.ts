import * as validate from './validate'
export const createSetImageFile =
  (setFile: (f: File) => void, setPrevUrl: (s: string) => void) =>
  async (file: File) => {
    if (!(await validate.validImageFile(file))) {
      return
    }
    const reader = new FileReader()
    reader.onloadend = async () => {
      setFile(file)
      if (reader.result) {
        setPrevUrl(reader.result.toString())
      }
    }

    reader.readAsDataURL(file)
  }
