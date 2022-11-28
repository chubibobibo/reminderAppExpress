
//npm install express, ejs, method-override, uuid, jquery,

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
app.use(express.urlencoded({ extended: true }));
const { v4: uuidv4 } = require('uuid');
app.set('views engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


//array mimicking a database
let reminders = [
    {
        title: 'get some food',
        details: 'get food at the newrby market',
        time: '09:00',
        id: uuidv4(),
    },
    {
        title: 'bring pet to the vet',
        details: 'the vet is dr.rererere',
        time: '10:30',
        id: uuidv4(),
    },
]

//rendering the index page that has a form to enter a new reminder
//rendering the array with it to be used in our index.ejs
app.get('/index', (req, res) => {
    res.render('index.ejs')
})

app.get('/index/allReminders', (req, res) => {
    res.render('allReminders.ejs', { reminders })

})

//showing all reminders
//problem:form was not parsing: soln:checked form tag in index.ejs there was a typo with method='POST'
app.post('/index/allReminders', (req, res) => {
    const { title, details, time } = req.body
    reminders.push({ details, title, time, id: uuidv4() })
    console.log(req.body)
    res.redirect('/index/allReminders')

})



//showing the reminders by their id's
//add links in allReminders.ejs in every items with their id's
//to look for the specific id, you have to compare it to the array/db
//problem: specificId is not defined: soln = enclose in curly brackets when rendering specificId
app.get('/index/allReminders/:id', (req, res) => {
    const { id } = req.params
    const specificId = reminders.find(f => f.id === id)
    res.render('reminderDetails.ejs', { specificId })//use specificId to get all details of the specific item depending on the id specified in allReminders.ejs
})

//updating the items by their specific id

//will be using.post now to get the data from new form then change the item contents/values
//in editReminder.ejs-form-use method override and change post to patch for updating
//problem: values are not updating: soln= use <button> instead of <a>href to save changes, make sure that you use app.patch instead of post, and make sure to use method override in the editreminder.ejs file

//we need the specific id to affect the changes to only one item depending on the item clicked
app.patch('/index/allReminders/:id/', (req, res) => {
    const { id } = req.params;
    const specificId3 = reminders.find(f => f.id === id);
    const { editTitle, editDetails, editTime } = req.body
    //updating the item in the array is just using the compared id(specificId3) to access the old value then replacing it with the value from the req.body(editTitle, editDetails, editTime)
    specificId3.title = editTitle
    specificId3.details = editDetails
    specificId3.time = editTime
    res.redirect('/index/allReminders')

})
//use .get first because we are not changing anything yet, just rendering the editReminder.ejs
//include :id before edit because we need a specific item to be edited
//always compare :id params to array id/ db
//problem: values are being erased when updating only certain fields: soln= provide a value= to every input incase said input is not going to be updated
app.get('/index/allReminders/:id/editReminder', (req, res) => {
    const { id } = req.params;
    const specificId2 = reminders.find(f => f.id === id)
    res.render('editReminder.ejs', { specificId2 })
})


//create a way to delete items in the array
//don't need to create a new page. we will use an existing page to create a form and use overridemethod delete and a button. in this app we used allReminders.ejs and reminderDetails.ejs to have the delete button iside the form
//specify method override to DELETE
//parsing the id then using it to filter the items that is not equal to it into a new array
app.delete('/index/allReminders/:id', (req, res) => {
    const { id } = req.params
    //id's that are not equal to the provided id from params id will be saved to a new array
    const newArray = reminders.filter(filteredId => filteredId.id !== id)
    reminders = newArray
    res.redirect('/index/allReminders')
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})


