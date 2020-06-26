var db = require('./models');
/*
db.category.create({
    name: 'Dojo'
}).then(function(category) {
    console.log(category.id);
})
*/

/*
db.project.create({
    name: 'Wilana Calc 3',
    description: "coop treasurer assistant app"
}).then(function(category) {
    console.log(category.id);
})
*/

db.project.findOne({
    where: { id: 1 },
    include: [db.category]
}).then(function(project) {
    console.log(project.categories); //checks to make sure project has a categories key
    project.addCategory(2).then(function(category){  // this is different from lab notes.  addCategory only seems to accept a category id (2) instead of an object like {name: 'blahblah'}
        console.log(category.id);
    })

})