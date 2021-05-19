const express = require("express");
const morgan = require("morgan");
const admin = require("firebase-admin");
const cors = require("cors");

const serviceAccount = require("./config/ServiceAccountKey.json");

// Init firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// Logger
app.use(morgan("tiny"));

// Middleware
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(cors());

// Create custom token

const uid = "u1d-th4t-n3v3r-w4s";

app.get("/", (req, res) => {
  return res.send("Home Page");
});

app.post("/verify-token", (req, res) => {
  const { idToken } = req.body;

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      admin
        .auth()
        .createCustomToken(decodedToken.uid)
        .then((customToken) => {
          return res.json({ customToken });
        })
        .catch((error) => {
          console.log("Error creating custom token: ", error);
        });
    })
    .catch((error) => {
      throw error;
      console.error(error);
    });

  return;
});

// Listen

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
