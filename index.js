const express = require('express')
require('dotenv').config()
const route = require('./routes/client/index.route.js')
const database = require('./config/database')
const app = express()
const port = process.env.PORT;
const adminRoute = require('./routes/admin/index.route.js')
var methodOverride = require('method-override')
var bodyParser = require('body-parser')


const flash = require('express-flash')
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// App local variables
const systemConfig = require("./config/system.js")
app.locals.prefixAdmin = systemConfig.prefixAdmin

database.connect();

app.use(express.static(`${__dirname}/public`))

app.set("views", `${__dirname}/views`)
app.set("view engine", "pug")

//flash
app.use(cookieParser('SFSDFSDFAFSD'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End flash
//end flash


route(app)

adminRoute(app)

  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
