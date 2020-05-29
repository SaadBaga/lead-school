const config = {
  development: {
    mongo: {
        user: process.env.MONGOUSER,
        password: process.env.MONGOPWD,
        database: "test",
        url: process.env.MONGOURL
    }
  }
}
export default config
