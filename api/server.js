const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())


const postCharge = require('./stripe')
var serviceAccount = require('../src/serviceAccount.json');

const admin = require("firebase-admin");
const bodyParser = require('body-parser');
app.use(bodyParser.json())
//const router = express.Router()
var fcm = require('fcm-notification');
var FCM = new fcm('../src/serviceAccount.json');
app.post('/stripe/charge', postCharge)


// app.all('*', (_, res) =>
//   res.json({message: 'please make a POST request to /stripe/charge' })
// )

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dapify-c5ba4-default-rtdb.firebaseio.com",

});


app.get("/disable-user/:uid", async function(req, res) {
  if(req.params.uid){
    admin.auth().updateUser(req.params.uid, { disabled: true }).then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        res.send(userRecord);
        })
        .catch((error) => {
          res.send(error);
        });
  }else{
    res.send('Invalid User');
  }
  
});


app.post("/user-push-notification",async function(req, res) {
  console.log('checkdata');
  if(req.body){
    var Tokens = req.body.to;
    var message = {
     
      notification:{
        title : req.body.title,
        body : req.body.body,
        
      },
     
    };
    FCM.sendToMultipleToken(message, Tokens, function(err, response) {
        if(err){
            console.log('err--', err);
        }else {
            console.log('response-----', response);
            res.send({'notificationresponse': response});
        }
    })

  }else{
    res.send('Invalid User');
  }
  
});


app.listen(8000, () => {
  console.log("app listening on port 8000")
})