import mongoose, { Schema } from 'mongoose'

const schema = Schema({
  connectionId: String,
  httpHost: String,
  httpPort: Number,
  wsHost: String,
  wsPort: String,
  payload: Object
})

const Connection = mongoose.model('Connection', schema)

export default Connection
