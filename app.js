const express= require("express");
const bodyParser= require("body-parser");
const app= new express();
const mailChimp= require("@mailchimp/mailchimp_marketing");
const https= require("https");
mailChimp.setConfig({apiKey:"3f51a5c86b784f5fdecae07576f7b2c4-us9",server:"us9"})

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})
//to use the static member files like css and images
app.use(express.static("public"));

//helps us to get the text from the input box
app.use(bodyParser.urlencoded({extended:true}));

//API key
// 3f51a5c86b784f5fdecae07576f7b2c4-us9
//list id
// 4bacb21fd9

app.post("/",function(req,res){
    const firstName= req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;
    //data object in js format
    const data ={
        members :[
            {
                email_address : email,
                status :"subscribed",
                merge_fields : {
                    FNAME: firstName,
                    LNAME:lastName
                }

            }
        ]
    };
    //converting data into JSON format
    const jsonData=JSON.stringify(data);
    //NOTE- in case of https we used, we wanted to get data, but here in this case we actually want
    //to post data to the mailchimp servers --> https.request

    const url= "https://us9.api.mailchimp.com/3.0/lists/4bacb21fd9";
    //to test for failure
//     const url= "https://us9.api.mailchimp.com/3.0/lists/4bacb21fd";

    const options= {
        method: "POST",
        auth: "adarsh9306:3f51a5c86b784f5fdecae07576f7b2c4-us9"
    }

    const request= https.request(url,options,function(response){
        response.on("data",function(data){
            let parsedData= JSON.parse(data);
            // console.log(JSON.parse(data));
            let status= response.statusCode;
            if(status===200) {
                res.sendFile(__dirname+"/success.html");
            }else {
                res.sendFile(__dirname+"/failure.html");
            }
        })
    })

    request.write(jsonData);
    request.end();

})
app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT ||3000,function(){
    console.log("Server is running at port 3000");
})
