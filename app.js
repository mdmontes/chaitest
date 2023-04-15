const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
app.use(express.json());

let peopleArray = [];
let peopleObject = {};
let responseIndex = 0;

app.all("/api/v1/*", (req, res) => {
  // res.json({ error: "That route is not implemented." });
  const {name, age} = req.body;
  const {0: index} = req.params;
  indexParamStrArray = index.split('/')
  indexParam = parseInt(indexParamStrArray[1])
  // console.log(`the people array lenght is ${peopleArray.length}`)
  
  if(indexParam>peopleArray.length-1||indexParam<0){
    res.status(400).json('Invalid Entry. Make sure that INDEX is not less than 0, or that its greater than the array length')
  }
  else if(indexParam>=0){
    peopleArray.forEach(element => {
      if(indexParam === element.index){
        // console.log(`There was a match`);
        singleperson =[]
        singleperson.push(element)
        res.json({people: singleperson})
      } 
  })}
  else if(age<=0 || name===''){
    res.status(400).json('Invalid Entry. Make sure that if you tried to ADD PERSON that you entered a NAME and an AGE. AGES cannot be less than 0')
  }
  else if (!age||! name){
    if (req.method=="GET"){
      res.json({peopleArray})
    } else {
      if(!age){
        res.status(400).json({error: 'Please enter an age.'})
      } else{
        res.status(400).json({error: 'Please enter a name.'})}
    }
  }
  else if(age || name){
    // peopleObject.push(req.body);
    Object.assign(peopleObject,{
      name: name,
      age: age,
      index: responseIndex});
    peopleArray.push(peopleObject);
    // res.json({people: peopleArray})
    res.json('A person record was added')
    peopleObject ={}
    responseIndex+=1
  }
  }
);

const server = app.listen(3000, () => {
  console.log("listening on port 3000...");
});

module.exports =  { app, server }