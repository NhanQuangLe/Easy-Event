const express = require("express");
const bodyParse = require("body-parser");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const mongoose = require("mongoose");
const grapthQLSchema = require("./graphql/schema/index");
const grapthQLResolver = require("./graphql/resolvers/index");
const isAuth = require('./middleware/is-auth')
const app = express();

app.use(bodyParse.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: grapthQLSchema,
    rootValue: grapthQLResolver,
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSSWORD}@main-cluster.dgrfjf2.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.MONGO_NAME}`
  )
  .then(() => {
    console.log("db connected successfully!");
    app.listen(8000);
    console.log("server started!");
  })
  .catch((err) => {
    console.log(err);
  });
