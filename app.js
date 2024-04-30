require("dotenv").config();

const express = require("express");
const cors = require("cors");

const port = process.env.PORT;

const app = express();

app.use(express.json());
   
// Solve CORS
app.use(cors({ 
  credentials: true, 
  origin: [process.env.FRONT_URL, "http://localhost:3000"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
const router = require("./routes/Router");

app.use(router);

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});