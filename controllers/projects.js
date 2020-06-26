let express = require('express')
let db = require('../models')
let async = require('async');
let router = express.Router()

// POST /projects - create a new project
router.post('/', (req, res) => {
  db.project.create({
    name: req.body.name,
    githubLink: req.body.githubLink,
    deployLink: req.body.deployedLink,
    description: req.body.description
  })
  .then((project) => { // add existing categories
    console.log("About to start async section");
    if (req.body.categories){
      if (!Array.isArray(req.body.categories)){
        req.body.categories = [req.body.categories]; // if just one category is checked, form returns a string instead of an array - bad for iterating through!
      }
      async.forEach(req.body.categories, (categoryName, done) => {
        console.log("adding category " + categoryName);
        db.category.findOne({
          where: {
            name: categoryName
          }
        }).then(category => {
          project.addCategory(category).then(relationInfo1 => {
            console.log("Added " + category.name + " to " + project.name);
          })
        })
      })
    }
    console.log("Done with existing categories, starting new");
    if (req.body.newCategory){
      db.category.findOrCreate({
        where: {
          name: req.body.newCategory
        }
      }).then(([category, created]) => {
        project.addCategory(category).then(relationInfo2 => {
          console.log(`🕯🕯🕯🕯🕯🕯 added new category ${category.name} to ${project.name}`);
        })
      }) 
    }
  })
  .catch((error) => {
    console.log(`🧨🧨🧨🧨🧨 error: ${error}`);
    res.status(400).render('main/404')
  })
  res.redirect('/')
})

// GET /projects/new - display form for creating a new project
router.get('/new', (req, res) => {
  db.category.findAll({}).then(categories =>{
    console.log(`Retrieved ${categories.length} categories`);
    res.render('projects/new', {categories})
  })
})

// GET /projects/:id - display a specific project
router.get('/:id', (req, res) => {
  db.project.findOne({
    where: { id: req.params.id }
  })
  .then((project) => {
    if (!project) throw Error()
    res.render('projects/show', { project: project })
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

module.exports = router
