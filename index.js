const Koa = require('koa')
const cors = require('@koa/cors')
const koaBody = require('koa-body')
const app = new Koa()


app.use(cors())
app.use(koaBody({
    multipart: true
}))
app.use(require('./src/router'))
app.listen(3000)
