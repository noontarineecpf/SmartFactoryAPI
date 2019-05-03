const Koa = require('koa')
const cors = require('@koa/cors')
const koaBody = require('koa-body')
const app = new Koa()


app.use(cors())
app.use(koaBody({
    multipart: true
}))
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit(err, ctx);
    }
});
app.use(require('./src/router'))
app.listen(3000)