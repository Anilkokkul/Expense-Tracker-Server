const express = require("express");
const admin = require("firebase-admin");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Routes = require("./routes");
const { db } = require("./db/db.connect");
db();
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(Routes);

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
