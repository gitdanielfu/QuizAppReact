import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router/route.js';
import user_routes from './router/user_router.js';
import session from 'express-session';
import passport from 'passport';


/** import connection file */
import connect from './database/conn.js';
import passportConfig from './config/passport.js'; 

const app = express()


/** app middlewares */
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
config();


/** application port */
const port = process.env.PORT || 8080;

/** routes */
app.use('/api', router) /** apis */
app.use('/user', user_routes) /** user apis */


app.get('/', (req, res) => {
    try {
        res.json("Get Request")
    } catch (error) {
        res.json(error)
    }
})

//Initialize session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {},
})
);

passportConfig(passport); // Initialize passport configuration

// require('./config/passport.js')(passport);
app.use(passport.initialize());
app.use(passport.session());


/** start server only when we have valid connection */
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`)
        })
    } catch (error) {
        console.log("Cannot connect to the server");
    }
}).catch(error => {
    console.log("Invalid Database Connection");
})

