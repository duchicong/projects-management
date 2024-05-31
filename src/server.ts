import 'tsconfig-paths/register';
import express, { json, urlencoded } from 'express';
import configViewEngine from 'config/viewEngine';
import { env } from 'config/env';
import morgan from 'morgan';
import apisRoutes from 'router/api';
import connectDB from 'config/database';
// import cors from 'cors';
import { setHeaderResponse } from 'middlewares/headers.middleware';

const app = express()
const port = env.PORT;

app.use(morgan('combined'))

// config cors
// app.use(cors({ }))
app.use(setHeaderResponse)

// config template engine
configViewEngine(app, __dirname);

/**
 * @description config request.body data 
 * @note alway before init routes
*/
app.use(json()) // for json
/**
 * parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
 * The “extended” syntax allows for rich objects and arrays to be encoded into the URL-encoded format,
 * allowing for a JSON-like experience with URL-encoded.
 * */ 
app.use(urlencoded({ extended: true }))

// init routes
app.use('/api/v1/', apisRoutes);

// handle not found
app.use((req, res) => {
  res.render('404.ejs')
})

connectDB();
// app.use(express.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
