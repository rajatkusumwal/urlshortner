var express=require("express");
var app=express();
var mongo=require("mongodb").MongoClient;
var Db=require("mongodb").Db;
var Server = require('mongodb').Server;
var validurl=require("valid-url");
var u=require('url');
var url="mongodb://localhost:27017/shorturl";
var count=0;

app.use(express.static(__dirname+'/public'));
console.log("Server is listening on 8080:......")

app.get('/new/*',function(req,res)
{
    var urlobj=u.parse(req.url,true);
    var urlpath=urlobj.pathname.toString();
    var val=urlpath.substring(5,urlpath.length);
    if(validurl.isUri(val))
    {
        mongo.connect(url,function(err,db){
        if(err) throw err;
        else
        {
            var jobj={
                'original_url':val,
                'short_url':"https://urlshortner-rajatkusumwal.c9users.io/"+count.toString()
            };
            res.send(JSON.stringify(jobj));
            count++;
            var collection=db.collection('urls');
            collection.insert(jobj,function(err,data){
                if(err) throw err;
                db.close();
            })}})
    }
    else
    {
        var jobj={"error":"Wrong url format, make sure you have a valid protocol and real site."}
        res.send(JSON.stringify(jobj));
    }
});

app.get('/:id',function(req,res){
    mongo.connect(url,function(err,db){
        if(err) throw err;
        else
        {
            var collection=db.collection('urls');
            collection.find({
                short_url: "https://urlshortner-rajatkusumwal.c9users.io/"+req.params.id.toString()
            }).toArray(function(err,docs){
                if(err) throw err;
                else
                {
                res.redirect(docs[0].original_url);
                db.close();
                }})
            
        }
    })
    
})
app.listen(process.env.PORT||8080);