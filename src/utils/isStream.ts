import * as stream from 'stream'

const isStream = (obj) => {
  return obj instanceof stream.Stream
}

export default isStream
