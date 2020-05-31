const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
var main=require('./main');
main.init();
const app = new Koa();

app.use(bodyParser());
// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});
router.get("/create",async(ctx,next)=>{
    if(main.getLength()<=0){
        main.create();
        ctx.response.body="创建成功。";
    }
    else{
        ctx.response.body="你已经创建过一条链，若要重新创建链，请先删除当前链。";
    }
});
router.get("/showAll",async(ctx,next)=>{
    var all=main.showAll();
    ctx.response.body=JSON.stringify(all,"","\t");
});
router.get("/add/:data",async(ctx,next)=>{
    if(main.getLength()<=0){
        ctx.response.body="请先创建一条链，再添加交易。"
    }
    else{
        var data=ctx.params.data;
        main.add(data);
        ctx.response.body="交易成功。";
    }
});
router.get("/clean",async(ctx,next)=>{
    if(main.getLength()<=0){
        ctx.response.body="当前没有生成任何链。"
    }
    else{
        main.clean();
        ctx.response.body="当前链已被删除。"
    }
});
app.use(router.routes());
app.listen(3000);
console.log('app started at port 3000');