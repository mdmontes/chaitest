const puppeteer = require("puppeteer");
require("dotenv").config();
const chai = require("chai");
chai.use(require('chai-json-schema'));
const expect = chai.expect;
const { server } = require("../app");

const firstEntryName = ['Mary'];
const firstEntryAge = ['9'];
const testNames = ['Fred', 'William', 'a', 'b', 'c', 'd', 'e', 'f', 'ge' ];
const testAges = ['10', '11', '12', '13', '14', '15', '16', '17', '9'];
const nextEntryName =['Jose']
const nextEntryAge = ['50']

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

chai.should();

(async () => {
  describe("Functional Tests with Puppeteer", function () {
    let browser = null;
    let page = null;
    before(async function () {
      this.timeout(5000);
      browser = await puppeteer.launch();
      page = await browser.newPage();
      await page.goto("http://localhost:3000");
    });
    after(async function () {
      this.timeout(5000);
      await browser.close();
      server.close();
      return;
    });
    describe("got to site", function () {
      it("should have completed a connection", function (done) {
        done();
      });
    });
    describe("people form", function () {
      this.timeout(5000);

      it("should have various elements", async function () {
        this.nameField = await page.$("input[name=name]");
        this.nameField.should.not.equal(null);
        this.ageField = await page.$("input[name=age]");
        this.ageField.should.not.equal(null);
        this.resultHandle = await page.$("#result");
        this.resultHandle.should.not.equal(null);
        this.addPerson = await page.$("#addPerson");
        this.addPerson.should.not.equal(null);
        this.personIndex = await page.$("#index");
        this.personIndex.should.not.equal(null);
        this.getPerson = await page.$("#getPerson");
        this.getPerson.should.not.equal(null);
        this.listPeople = await page.$("#listPeople");
        this.listPeople.should.not.equal(null);
      });

      it("should create a person record given name and age", async function () {
        await this.nameField.type(firstEntryName[0]);
        await this.ageField.type(firstEntryAge[0]);
        await this.addPerson.click();
        await sleep(200);
        const resultData = await (
          await this.resultHandle.getProperty("textContent")
        ).jsonValue();
        resultData.should.include("A person record was added");
        const { index } = JSON.parse(resultData);
        this.lastIndex = index;
        await page.$eval("#name", (el) => (el.value = "")); 
        await page.$eval("#age", (el) => (el.value = "")); 
      });

      it("should not create a person record without an age", async function () {
        // your code goes here.  Hint: to clear the age field, you need the line
        await page.$eval("#name", (el) => (el.value = "")); 
        await page.$eval("#age", (el) => (el.value = "")); 
        await this.nameField.type("Fred");
        await this.addPerson.click();
        await sleep(200);
        const resultData = await (
          await this.resultHandle.getProperty("textContent")
        ).jsonValue();
        resultData.should.include('Invalid Entry. Make sure that if you tried to ADD PERSON that you entered a NAME and an AGE. AGES cannot be less than 0');
      });

      it("should not create a person record with a negative age", async function () {
        await page.$eval("#name", (el) => (el.value = "")); 
        await page.$eval("#age", (el) => (el.value = ""));
        await this.nameField.type("Fred");
        await this.ageField.type("-10");
        await this.addPerson.click();
        await sleep(200);
        const resultData = await (
          await this.resultHandle.getProperty("textContent")
        ).jsonValue();
        resultData.should.include("Invalid Entry. Make sure that if you tried to ADD PERSON that you entered a NAME and an AGE. AGES cannot be less than 0");
        const { index } = JSON.parse(resultData);
        this.lastIndex = index;
        await page.$eval("#name", (el) => (el.value = "")); 
        await page.$eval("#age", (el) => (el.value = "")); 
      });

      it("should not create a person record without a name", async function () {
        // your code goes here.  Hint: to clear the age field, you need the line
        await page.$eval("#name", (el) => (el.value = "")); 
        await page.$eval("#age", (el) => (el.value = "")); 
        await this.ageField.type("10");
        await this.addPerson.click();
        await sleep(200);
        const resultData = await (
          await this.resultHandle.getProperty("textContent")
        ).jsonValue();
        resultData.should.include('Invalid Entry. Make sure that if you tried to ADD PERSON that you entered a NAME and an AGE. AGES cannot be less than 0')
      });

      it("should return the entries just created", async function () {
         // your code goes here
        await page.$eval("#name", (el) => (el.value = "")); 
        await page.$eval("#age", (el) => (el.value = "")); 
        for (let i = 0; i < testNames.length; i++){
          await this.nameField.type(testNames[i]);
          await this.ageField.type(testAges[i]);
          await this.addPerson.click();
          await sleep(200);
          await page.$eval("#name", (el) => (el.value = "")); 
          await page.$eval("#age", (el) => (el.value = ""));
         }
        await this.listPeople.click();
        await sleep(200);
        const resultData = await (await this.resultHandle.getProperty("textContent")).jsonValue();
        const resultData1 =JSON.parse(resultData);
        console.log(resultData1);
        expect(resultData1).to.have.keys("peopleArray");
        expect(resultData1.peopleArray).to.be.an("array");
        expect(resultData1.peopleArray.length).to.be.eql(testNames.length + 1);
        expect(resultData1.peopleArray[0].name).to.be.eql(firstEntryName[0]);
        expect(resultData1.peopleArray[0].age).to.deep.equal(parseInt(firstEntryAge[0]));
        for (let i = 0; i < testNames.length; i++){
          expect(resultData1.peopleArray[i+1].name).to.be.eql(testNames[i]);
          expect(resultData1.peopleArray[i+1].age).to.equal(parseInt(testAges[i]));
        };
      });

      it("should return the last entry", async function () {
         // your code goes here
        
        await this.nameField.type(nextEntryName[0]);
        await this.ageField.type(nextEntryAge[0]);
        await this.addPerson.click();
        await sleep(200);
        await page.$eval("#name", (el) => (el.value = "")); 
        await page.$eval("#age", (el) => (el.value = ""));
        await this.listPeople.click();
        await sleep(200);
        const resultData = await (await this.resultHandle.getProperty("textContent")).jsonValue();
        const resultData1 =JSON.parse(resultData);
        const lastIndex = resultData1.peopleArray.length-1;
        indexString = (resultData1.peopleArray[lastIndex].index).toString();
        this.personIndex.type(indexString);
        this.getPerson.click();
        await sleep(200);
        const resultPerson =await (await this.resultHandle.getProperty("textContent")).jsonValue();
        const resultPersonObj = JSON.parse(resultPerson);
        console.log(resultPersonObj)
        expect(resultPersonObj).to.have.keys("people");
        expect(resultPersonObj.people[0].name).to.be.eql(nextEntryName[0]);
        expect(resultPersonObj.people[0].age).to.deep.equal(parseInt(nextEntryAge[0]));
      });

      it("should return an error message if index is greater than available indeces", async function () {
        // your code goes here
       await page.$eval("#index", (el) => (el.value = "")); 
       await this.listPeople.click();
       await sleep(200);
       const resultData = await (await this.resultHandle.getProperty("textContent")).jsonValue();
       const resultData1 =JSON.parse(resultData);
       console.log(resultData1);
       const lastIndex = resultData1.peopleArray.length-1;
       console.log(`The last possible index within the people array is ${lastIndex}`);
       indexOutOfRange = (lastIndex+1).toString();
       console.log(`Test will attempt to obtain data for an out of range index ${indexOutOfRange}`);
       await this.personIndex.type(indexOutOfRange);
       await this.getPerson.click();
       await sleep(200);
       const resultPerson =await (await this.resultHandle.getProperty("textContent")).jsonValue();
       resultPerson.should.include('Invalid Entry. Make sure that INDEX is not less than 0, or that its greater than the array length');
     });

     it("should return an error message if index is greater than available indeces", async function () {
      // your code goes here
     await page.$eval("#index", (el) => (el.value = "")); 
     await this.personIndex.type('');
     await this.getPerson.click();
     await sleep(200);
     const resultPerson =await (await this.resultHandle.getProperty("textContent")).jsonValue();
     resultPerson.should.include('You cannot press the SHOW PERSON button without an index, or with an index = 0');
      });
    });
  });
})();
