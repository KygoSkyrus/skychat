const http = require("http");
const express = require("express");
const bodyParser = require('body-parser')
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

app.use(bodyParser.json())


// FIREBASE ADMIN 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const firestore = admin.firestore();

app.post('/api/doesUserExist', (req, res) => {
  try {
    const { username, email } = req.body;
    // console.log('user', username)

    const usersRef = firestore.collection('users');
    let query;
    if (username) {
      query = usersRef.where('username', '==', username);
    } else if (email) {
      query = usersRef.where('email', '==', email);
    }

    query.get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('User not found.');
          res.json({ userFound: false, message: "" })
        } else {
          const userDoc = snapshot.docs[0];
          console.log('User found:', userDoc.data());
          res.json({ userFound: true, message: "Username already exists! Please try a different one." })
        }
      })
  } catch (error) {
    console.error('Error fetching user:', error);
    res.json({ userFound: false, message: "Error fetching user. Internal server error!" })
  }
})


server.listen(port, () => console.log(`server is running at ${port}`));