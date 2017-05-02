var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var multer=require('multer');
var fs=require("fs");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'nanban'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");    
} else {
    console.log("Error connecting database ... nn");    
}
});
var app = express();

var engines = require('consolidate');
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

var storage =multer.diskStorage({
  destination: function(req,fileToUpload,cb){
    cb(null,'public/images/');
  },
  filename: function(req,fileToUpload,cb){
    cb(null,fileToUpload.originalname);
  }
})

var upload = multer({storage: storage}).single('fileToUpload');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get("/register",function(req,res){
	res.render("register");
});
app.post("/register",function(req,res){
	//register page load
	var username=req.body.Username;
    var	password=req.body.PassWord;
    connection.query("INSERT INTO Register (`Email`, `Password`) VALUES ('" + username + "', '" +password + "')", function(err){
           if(err)console.log(err);
               else
               //res.json({"message":"succesfully Resistered"});
           		res.redirect("/");
           		//load login file or render login automatically.
});
});
app.get("/",function(req,res){
	res.render("login");
});
app.post("/login",function(req,res){
	//login pageload
var username=req.body.Username;
 var password=req.body.PassWord;

 //integrate the login page ui

 connection.query('select Email from Register where Email= "'+username+'" and Password="'+password+'"' ,function(err,result){
 	if(err){
 		res.send("Authendication fail");
 	}
 	else{
 	//res.send("succesfully login");
res.redirect("/home");}
 });
});
//when the memory button click

app.get("/memories",function(req,res){
  connection.query("select * from memories",function(err,result){
  res.render("memory",{data:result});//the data is the output.it is send to front end
});
});
//when the add button inside the memories click.in this api for upload the file and store into db
app.post('/memoriesadd',function(req,res){
  upload(req,res,function(err){
    var magic =["image/jpeg","image/png","image/jpg","image/JPG","image/PNG"];
              var image={
                imagename : req.file.filename,
                imagepath : req.file.path,
                imagesize : req.file.size,
                imagetype : req.file.mimetype

              }
              if(image.imagetype == magic[0] || image.imagetype == magic[1] || image.imagetype == magic[2] || image.imagetype == magic[3] || image.imagetype == magic[4]){
              connection.query("INSERT INTO memories VALUES ('" +image.imagepath+ "')",function(err,reult){
                res.redirect("/memories");
              });
          }
          else{
            res.redirect("/memories");
          }
          });
});


//it will happen when the profile button click


//here 4 buttons.each are all the post methods
app.get("/read",function(req,res){
  res.render("read");//the read.html has only one fiels.name will send to post method
});
app.post("/read",function(req,res){
var name=req.body.Username;//here get name from the home page search bar
connection.query('select * from student where name= "'+name+'"',function(err,data){
res.render("profile",{mydata:data});//the data will display to the front end
});
});
//it will happen when the edit button click

app.get("/edit",function(req,res){
  res.render("edit")//the edit.html file get the name,edit field, value
})
app.post("/edit",function(req,res){
  var name=req.body.name;
  var field=req.body.field;
  var value=req.body.value;
  connection.query('UPDATE student SET "'+field+ '" = "' + value + '" where name="'+name +'"',function(err){
if(err){
  res.send("error");
}
else{
  res.redirect("/read");
}
  });
});
//delete button click
app.get("/delete",function(req,res){
  res.render("delete");//in this delete.html has the name to be delete
});
app.post("/delete",function(req,res){
var name=req.body.name;
connection.query('delete from student where name="'+name+ '"',function(err){
  if(err){
    res.send("err");
  }
  else{
    res.redirect("/read");
  }
}); 
});


//home page to display the 
app.get("/home",function(req,res){
connection.query("select name,doj,imagename from student",function(err,result){
  console.log(result);
 res.render('index', {mydata: result}); //in front end the mydata.name is to be display.likewise doj,image
});   
});





app.get("/birthday",function(req,res){
var today = new Date();
var today=today.toISOString();
var date = new Date(today);
var today=date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
connection.query("select doj from student",function(err,rows,field){
for (var i = 0; i <rows.length; i++) {
  var d=rows[i].doj;
var mybirth=d.toISOString();
var date = new Date(mybirth);
var mybirth=date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();
if(mybirth==today){
   connection.query("select name,imagepath from student where doj='"+mybirth+"'",function(err,result){
    res.render("birthday",{data:result});//send to front end birthday boy details
       connection.query("select name from student where doj='"+mybirth+"'",function(err,name){
      connection.query("select phoneno from student ",function(err,rows,field){
        for(i=0;i<rows.length;i++){
              var no=rows[i].phoneno;

              var message="today is".concat(name);
              var message=message.concat("birthday");
              var url="https://control.msg91.com/api/sendhttp.php?authkey=93907AcKTgFOlx560e23a3&mobiles=";
  var add1=url.concat(no); 
  var add2="&message=";
  var add3=add1.concat(add2);
  var add4=add3.concat(message);
  var add5="&sender=indias&route=4";
  var final=add4.concat(add5);
  //install request..................
  request(final, function (error, response, body) {
});
}
});
});
    });
     

      }
    }
})
});

app.post("/birthdaywish",function(req,res){
  var phoneno=req.body.phoneno;
  var wish=req.body.wish;
  var fromname=req.body.fromname;
  var wish=wish.concat(fromname);
  var url="https://control.msg91.com/api/sendhttp.php?authkey=93907AcKTgFOlx560e23a3&mobiles=";
  var add1=url.concat(phoneno); 
  var add2="&message=";
  var add3=add1.concat(add2);
  var add4=add3.concat(wish);
  var add5="&sender=indias&route=4";
  var final=add4.concat(add5);
  //install request..................
  request(final, function (error, response, body) {
  res.render("birthday");
});
});

//search api............
//get the search name from the search bar call post(/read)

//when logout button click
app.get("/logout",function(req,res){
  res.redirect("/");
}) 
app.listen(3000);
