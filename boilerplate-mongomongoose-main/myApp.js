require('dotenv').config();


let Person;
let mongoose = require("mongoose")

let uri = process.env.MONGO_URI

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let peopleSchema = mongoose.Schema({
  name : {type: String, required: true},
  age : Number,
  favoriteFoods  : [String]
})

Person = mongoose.model('Person', peopleSchema)


const createAndSavePerson = (done) => {
  let jon = new Person({name: 'Jon', age : 134, favoriteFoods: ['seblak', 'dorogdog']})

  jon.save((err, data) => {
    if (err){
      console.log(err)
    }else{
      done(null, data)
    }
  })
};

let arrayOfPeople = [
  {name: 'Jon', age : 134, favoriteFoods: ['seblak', 'dorogdog']},
  {name: 'Jon2', age : 11, favoriteFoods: ['seblak']},
  {name: 'Jon3', age : 56, favoriteFoods: ['dorogdog', 'cikur']}
]

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, createdPeople) => {
    if (err){
      console.log(err)
    }else{
      done(null, createdPeople);
    }
  })
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, (err, arrayOfPeople) => {
    if(err){
      console.log(err)
    }else{
      done(null, arrayOfPeople);
    }
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, data) => {
    if(err){
      console.log(err)
    }else{
      done(null, data);
    }
  })
};

const findPersonById = (personId, done) => {
  Person.findById({_id: personId}, (err, data) => {
    if(err){
      console.log(err)
    }else{
      done(null, data);
    }
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById({_id: personId}, (err, personData) => {
    if(err){
      console.log(err)
    }else{
      personData.favoriteFoods.push(foodToAdd)
      personData.save((err, newPersondata) => {
        if (err){
          console.log(err)
        }else{
          done(null, newPersondata)
        }
      })
    }
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new:true}, (err, updatedData) => {
    if(err){
      console.log(err)
    }else{
      done(null, updatedData);
    }
  }) 
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove({_id: personId}, (err, removedData) => {
    if(err){
      console.log(err)
    }else{
      done(null, removedData);
    }
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({name: nameToRemove}, (err, outcome) => {
    if(err){
      console.log(err)
    }else{
      done(null, outcome);
    }
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({favoriteFoods: foodToSearch})
  .sort({name: 'asc'})
  .limit(2)
  .select('-age')
  .exec((err, data)=>{
    if(err){
      console.log(err)
    }else{
      done(null, data);
    }
  })

};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
