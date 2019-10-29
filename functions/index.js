const functions = require('firebase-functions');

const express = require('express');

const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore(); // firestore db

// Prevent the app breaking from the upcoming behavioral changes of Date Objects
const settings = {
  timestampsInSnapshots: true
};

db.settings(settings);

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hi, I am Allen");
});

exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    const snapshot = await admin.database().ref('/messages').push({original: original});
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref.toString());
  });

  const api = express();

  api.use(function(err, req, res, next) {
    console.log(err.stack);

    res.set('Content-Type', 'application/json');
    
    res.status(500).send('Something broke!');
   
  });
  
  exports.api = functions.https.onRequest(api);
 
  api.post('/createSerial', (req, res) => {
    console.log("createSerial called");

    var token = req.get('mToken9527');

    if(token === null || !token.valueOf().match("9527")) {
        res.status(403).send("Forbidden");

        return;
    }

    res.set('Content-Type', 'application/json');

    var serial_number = req.body.serial_number;

    if(serial_number === null) {
        res.status(404).send("Certification not exist");

        return;
    }
    else if(typeof serial_number !== "string") {
        res.status(404).send("Certification not exist");

        return;
    }

    var docRef = db.collection('SerialManager').doc(req.body.serial_number);

    docRef.get()
    .then(doc => {
        if (!doc.exists) {        
            console.log('No such document!');

            res.se;

            return false;
        } else {
            var time = doc.data().expire_date;

            console.log('Certification expire time : ', time.toDate().valueOf());

            console.log('ServerTimeStamp : ', Date.now());

            if(time === null) {
              res.status(404).send("Expire_date not set");

              return false;
            }
            else if(time.toDate().valueOf() < Date.now()) {
              res.status(404).send("Verification fail");

              return false;
            }
            else {
              console.log('Document data:', doc.data().expire_date);

              res.status(200).send("Verification Success");
  
              return true;
            }
        }
    }).catch(error => {
       console.log('createSerial error : ', err.stack);

       res.status(404).send("Certification not exist");

       return;
    })

    // checkDoc.then(result => {
    //   if(result) {
    //     res.set('Content-Type', 'application/json');
  
  
    //     res.status(200).send("Certification Success");
    //   }
    //   else {
    //     res.set('Content-Type', 'application/json');
  
    //     res.status(404).send("Certification not exist or expired");
    //   }
    // })
  
    // var setAda = docRef.set({
    //   first: 'Ada',
    //   last: 'Lovelace',
    //   born: 1815
    // });
  });

 
  

