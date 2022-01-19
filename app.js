var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose               = require("mongoose"),
    flash                  =    require("connect-flash"),
    nodemailer             =    require("nodemailer"),
    session                  = require("express-session");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

//APP CONFIG
// mongoose.connect("mongodb://localhost:27017/ELECTIONS",{ useUnifiedTopology: true , useNewUrlParser: true});

mongoose.connect("mongodb+srv://apurv:apurv097@cluster0.ieqra.mongodb.net/<dbname>?retryWrites=true&w=majority" ,{ useUnifiedTopology: true , useNewUrlParser: true}).then(()=> {
	console.log("connected to db!")
}).catch(err => {
	console.log("error: ",err.message);
});

app.set("view engine","ejs");


app.use(require("express-session")({
	secret:"qwerxy",
	resave:false,
	saveUninitialized: false
}));


app.use(session({ cookie: { maxAge: 60000 }, 
                  secret: 'woot',
                  resave: false, 
                  saveUninitialized: false}));


app.use(flash());

//app.use(express.static("public"));
var alpha= "abcdefghijklmnpqrstuvwxyz";
var balpha= "ABCDEFGHIJKLMNPQRSTUVWXYZ";

function present(array,element){
 for(var i=0;i<array.length;i++){
	 if(array[i]===element){
		 return 1;
	 }
 }
	return 0;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function most(array){
var countarray=[];
var elearray=[];
var	presentarray=[];
var count=0;
for(var i=0; i < array.length; i++){
 count=0;
for(var j=0;j<array.length;j++){
 if(array[i]===array[j]){
count=count+1;
 }
} 
countarray.push(count);	//each element of array sent count given
}
var max=countarray[0];
for(var i=0;i<countarray.length;i++){
	if(countarray[i]>max){
	  max=countarray[i];
	}
}
 for(var i=0;i<countarray.length;i++){
	 if(countarray[i]===max){
	  if(present(presentarray,array[i])==0){
		 elearray.push(i);
		 presentarray.push(array[i]);
	 }
	 }	 
 }
return elearray;
}
var User1={};
var passk ;
var h=0;
var log = 0;
var UserSchema = new mongoose.Schema({
                                       Username: String,
                                        cr:String,
                                        gs:String
                                     });

var User=mongoose.model("User",UserSchema); //appears users in mongo collection
var EmailSchema = new mongoose.Schema({
	email:String,
	key: String
});
var Email=mongoose.model("Email",EmailSchema); //appears emails in mongo collection
 var str="";
 var arr1=[];


function checkid1(email){

 var k=0;
 for(var i=0;i<email.length;i++){
  
  if(email.charAt(i)=='@'){
   k=1;
 }
   if(k==1){
	str=str+""+email.charAt(i); 
 }

 }

 if(str==="@gmail.com" || "@iipe.ac.in"){
	 str="";
	 return 1;
 }
	else{
	str="";
	return 0;
	}
}

app.get("/",function(req,res){
	res.render("home");
});

app.get("/register",function(req,res){
	res.render("register",{message:req.flash("error"),success:req.flash("success")});
})

app.post("/email",function(req,res){
	h=0;
    if (checkid1(req.body.email)===1){
		
		Email.find({},function(err,emails){
			console.log(emails);
            for(var i=0;i<emails.length;i++){
				
	           if(emails[i].email===req.body.email){
                h=1;
	}
    }
			
		
		if(h===0){ var passkey=[];
			 passkey[0] = ""+getRandomInt(6)+""+getRandomInt(9)+""+alpha[getRandomInt(23)]+""+getRandomInt(9)+""+balpha[getRandomInt(23)];
			passkey[1] =  ""+alpha[getRandomInt(23)]+""+getRandomInt(9)+""+balpha[getRandomInt(23)]+""+getRandomInt(9)+""+alpha[getRandomInt(23)];
passkey[2] =         ""+getRandomInt(9)+""+balpha[getRandomInt(23)]+""+alpha[getRandomInt(23)]+""+getRandomInt(9)+""+alpha[getRandomInt(23)]+""+getRandomInt(23);
			passk= passkey[getRandomInt(2)];
		
		   Email.create({email:req.body.email,key:passk},function(err,Newemail){
		if(err){
			console.log(err)
		}
		else{
			console.log("kuch nahi chacha");
		}
})
	var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'apurvasuman@iipe.ac.in',
    pass: 'apurv097'
  }
});

var mailOptions = {
  from: 'apurvasuman@iipe.ac.in',
  to: req.body.email,
  subject: 'VERIFICATION',
  html: '<p>Hello, you have to use this confidential key to vote ,kindly do not share with anyone YOUR KEY IS:</p>'+passk 
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});	
			
	res.render("verify",{message:"",mes: "" });
		   }
	else{
	req.flash("error", "You are already registered kindly check your mail for key and go for the link given below in 3rd line");
	res.redirect("/register");
	}
	})
	}
	else{
	req.flash("error", "USE OFFICIAL ID ONLY");
	res.redirect("/register");
	}
	})
app.get("/verify",function(req,res){
	res.render("verify",{message:req.flash("error") });
})
app.post("/verify",function(req,res){
	var mailid = req.body.nam ;
	var erp = 0;
	var er = 0;
	Email.find({},function(err,emails){
		if(err){res.send("some error occured")}
		else{
            for(var i=0;i<emails.length;i++){
				
	           if(emails[i].email===mailid){ 
	               if(emails[i].key === req.body.key){
		            console.log("matched");
		          res.render("poll",{mail:mailid});}else{
					  req.flash("error", "Sorry, your key is wrong or if you are sure about the info given kindly contact us to solve your problem");
					res.redirect("verify") }       }
				else{ erp=erp+1;
				}
				
				
			}}
		if(erp==emails.length){ req.flash("error", "Email is not registered ,no mail is sent to this mail");
					res.redirect("verify")  }
		
	})
		
}) 
var valor;
var usercount;

app.post("/submit",function(req,res){	
User1.gs=req.body.gs;
User1.cr=req.body.cr;
User1.Username=req.body.user;
var Add=new User(User1);
Add.save(function(err,NewUser){if(err){console.log("error at saving");}else
	User.find({},function(err,founduser){
 var valor = checkForRepeatation(NewUser,founduser);
console.log("return value of usercount is  "+valor);
		if(valor==1){
			req.flash("success","Your reponses were recorded, thanks for voting");
			res.redirect("/register");
					 
}
else if (valor>1){console.log("got a user second time");
		    User.findByIdAndRemove(NewUser._id,function(err){if(err){console.log("error at findbyidnremove")}else{
				console.log("removed a fake id")}})	
				req.flash("error", "You were trying to vote again, your responses will not be recorded");  
	            res.redirect("/register");
				  
}
})		
})

							   
})

app.get("/final2124",function(req,res){
    var sendGS=[];
	var sendCR=[];
	var gs1=[];
    var cr1=[] ;
 User.find({},function(err,foundUser){
	 foundUser.forEach(function(FU){
		
		 gs1.push(FU.gs);
		 cr1.push(FU.cr);
		  }
		  )
	     console.log(cr1);
	     console.log(gs1);
	var mostoccurGS=most(gs1);
	for(var i=0;i<mostoccurGS.length;i++){
		sendGS.push(gs1[mostoccurGS[i]]);
	}
	var mostoccurCR=most(cr1); 
	for(var i=0;i<mostoccurCR.length;i++){
		sendCR.push(cr1[mostoccurCR[i]]);
	}
	res.render("final",{
		mogs:sendGS,
		mocr:sendCR
	                   })
    
	 })	
})

app.post("/remove",function(req,res){
	Email.find({},function(err,emails){
		console.log(emails);
		console.log(emails[0].id+" and "+emails[0].email);
		
		Email.findByIdAndRemove(emails[0]._id,function(err){
			if(err){res.send("error");}
		else{res.send("removed");}
		})
	})
});

app.get("/log",function(req, res){
	res.render("login",{message:"This login page is for election managing commitee only ,if you are a voter kindly go for register"});
})

app.get("*",function(req, res){
	res.send("Your link is invalid, check your link or contact the provider");
})

	function checkForRepeatation(N,f){
		console.log("function called")
		console.log(typeof(f.length));
		console.log(f.length);
		console.log(N.Username);
		console.log("type of f0.username is "+typeof(f[0].Username));
		console.log("f[0].username is "+f[0].Username);
		var len = f.length - 1 ;
		var usercount = 0;
		console.log("till here usercount is 0");
		for(var i =0;i<f.length;i++){
			if(N.Username === f[i].Username ){ usercount = usercount + 1;
											  console.log("usercount becomes "+usercount);
											  if(usercount>1){return usercount}
											  else if (i === len){
			                                             return usercount;  }
											  
										  }
			
		} 	
	}
//  function  isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){return next();}
// 	else{
// 		res.redirect("/login");
// 		}
// }

var port = process.env.PORT || 7000;
app.listen(port,function(){
	console.log("Election server is running at port 7000");
});
