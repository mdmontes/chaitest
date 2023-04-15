const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server } = require("../app");

chai.use(chaiHttp);
chai.should();

const firstEntryName = ['Mary'];
const firstEntryAge = ['9'];
const testNames = ['Fred', 'William', 'a', 'b', 'c', 'd', 'e', 'f', 'ge' ];
const testAges = ['10', '11', '12', '13', '14', '15', '16', '17', '9'];
const nextEntryName =['Jose']
const nextEntryAge = ['50']
const lastEntryName =['Josb']
const lastEntryAge = ['100']
const nameArray = firstEntryName.concat(testNames,nextEntryName,lastEntryName)

describe("People", () => {
  after(() => {
    server.close();
  });
  describe("post /api/v1/people", () => {
    it("should not create a people entry without a name", (done) => {
      chai
        .request(app)
        .post("/api/v1/people")
        .send({ age: 10 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.eql({ error: "Please enter a name." });
          done();
        });
    });
    it("should create a people entry with valid input", (done) => {
      // your code goes here
      chai
        .request(app)
        .post("/api/v1/people")
        .send({ 
          name: lastEntryName[0],
          age: lastEntryAge })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.eql('A person record was added');
          done();
        });
    });
  });
  describe("get /api/v1/people", () => {
    it(`should return an array of person entries of length ${nameArray.length}`, (done) => {
      chai
      .request(app)
      .get("/api/v1/people")
      .end((err, res) => {
        res.should.have.status(200);
        const responseLength = res.body.peopleArray.length;
        responseLength.should.be.eql(nameArray.length);
        done();
      });
    });
  });
  describe("get /api/v1/people/:id", () => {
    it("should return the entry corresponding to the last person added.", (done) => {
      // your code goes here
      chai
      .request(app)
      .get(`/api/v1/people/${nameArray.length}`)
      .end((err, res) => {
        res.should.have.status(200);
        const responseArray = res.body;
        expect(responseArray).to.have.keys('people');
        expect(responseArray.people[0].name).to.be.eql(lastEntryName[0]);
        expect(responseArray.people[0].age).to.deep.equal(parseInt(lastEntryAge[0]));
        expect(responseArray.people[0].index).to.be.eql(nameArray.length-1);
        });
        done();
      });
    });
    it("should return an error if the index is >= the length of the array", (done) => {
      chai
      .request(app)
      .get(`/api/v1/people/${nameArray.length+1}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.include('Invalid Entry. Make sure that INDEX is not less than 0, or that its greater than the array length')
        });
        done();
    });
  })
