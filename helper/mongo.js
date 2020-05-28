import { MongoClient } from 'mongodb'
const state = {
  db: null
}

exports.connect = (url, done) => {
  if (state.db) return done()
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  client.connect(function (err, client) {
    if (err) return done(err)
    state.db = client.db()
    done()
  })
}

exports.get = () => state.db

exports.close = (done) => {
  if (state.db) {
    state.db.close(function (err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}
