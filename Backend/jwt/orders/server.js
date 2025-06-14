const {connect} = require('./database/database.js')
const orders = require('./controller/controller.js')
const {authenticate} = require ('./middleware/authentication.js')
const express = require ('express')
const morgan = require ('morgan')
const port = 3003
const app = express ()

// no templating engine

// middleware
app.use(express.json())
app.use(morgan(':method :url| Status: :status | Time: :response-time ms| Date: :date[clf]'))

//connect to database
const start = async () => {
    try{
        await connect()
        app.listen(port, () =>{
            console.log(`Server is listening on port ${port}`)
        })
    }catch(error){
        console.error(`Unable to connect to server! Error: ${error.message}`)
    }
}

start()

// login routes
app.post('/login', orders.loginUser)
// logout route
app.post('/logout', orders.logoutUser)
// signup route
app.post('/signup', orders.signup)
// deleteUser route
app.delete('/user/:username', orders.deleteUser)

// regular routes
app.post('/orders/new', authenticate, orders.create)  // post method to create a new order
app.get('/orders', orders.getAll) // get method to get all orders
app.patch('/orders/:id', orders.update) // patch method to update an order
app.delete ('/orders/:id' , orders.deleteOrder) // delete method to delete an order
app.get('/orders/:name', orders.getByName) // get method to fetch an order by name

// global handler
app.use((err,req,res,next) =>{
    console.error(`Something went wrong! \n Strack Trace: ${err.stack}`)
    res.status(404).send(`Resource Not Found`)
})
