/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const ObjectID = require('mongodb').ObjectID

const invalidID = '6061d507d096450c2a1aaaaa'
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const expressionList = [
  'amazing',
  'stupid',
  'hillarious',
  'useless',
  'the best',
  'trash',
  'inspiring',
  'OK'
]

function getExpression(num) {
  return expressionList[num]
}

chai.use(chaiHttp);

suite('Functional Tests', async function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  
  * ----[END of EXAMPLE TEST]----


  */

  const newbook = {
    _id: new ObjectID().toString(),
    title: `Almanac no. ${getRandomInt(10000)}`,
    comment1: `I can't believe it's ${getRandomInt(1000)} years old!`,
    comment2: `This book is ${getExpression(getRandomInt(8))} !!` 
    }

  beforeEach(done => setTimeout(done, 500));

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            _id: newbook._id,
            title: newbook.title
          })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isObject(res.body)
            assert.property(res.body, '_id')
            assert.equal(res.body.title, newbook.title)
            done();
          })
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'missing required field title')
            done();
          })
      }); 

    });


     suite('GET /api/books => array of books', function() {

      test('Test GET /api/books', function(done) {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isArray(res.body)
            res.body.forEach(x => {
              assert.property(x, '_id')
              assert.property(x, 'title')
              assert.property(x, 'comments')
              assert.property(x, 'commentcount')
            })
            done();
          })
      });

    });


     suite('GET /api/books/[id] => book object with [id]', function() {

      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai.request(server)
          .get('/api/books/'+invalidID)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists')
            done();
          })
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .get('/api/books/'+ newbook._id)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body._id, newbook._id)
            assert.equal(res.body.title, newbook.title)
            done()
          })
      });

    });  
 
    
        suite('POST /api/books/[id] => add comment/expect book object with id', function(){
          
          test('Test POST /api/books/[id] with comment', function(done){
            chai.request(server)
              .post('/api/books/'+newbook._id)
              .send({
                comment: newbook.comment2
              })
              .end((err,res)=>{
                assert.equal(res.status, 200)
                assert.equal(res.body._id, newbook._id)
                assert.equal(res.body.title, newbook.title)
                assert.isArray(res.body.comments)
                assert.include(res.body.comments, newbook.comment2)
            done();
              })
          });
     
           test('Test POST /api/books/[id] without comment field', function(done){
            chai.request(server)
              .post('/api/books/'+newbook._id)
              .end((err,res)=>{
                assert.equal(res.status, 200)
                assert.equal(res.text, 'missing required field comment')
                done()
              })
          });
    
          test('Test POST /api/books/[id] with comment, id not in db', function(done){
            chai.request(server)
              .post('/api/books/'+invalidID)
              .send({
                comment: newbook.comment1
              })
              .end((err,res)=>{
                assert.equal(res.status, 200)
                assert.equal(res.text, 'no book exists')
                done()
              })
          }); 
          
        });
    
        suite('DELETE /api/books/[id] => delete book object id', function() {
    
          test('Test DELETE /api/books/[id] with valid id in db', function(done){
            chai.request(server)
              .delete('/api/books/'+newbook._id)
              .end((err,res)=>{
                assert.equal(res.status, 200)
                assert.equal(res.text, 'delete successful')
                done()
              })
          });
    
          test('Test DELETE /api/books/[id] with  id not in db', function(done){
            chai.request(server)
            .delete('/api/books/'+invalidID)
              .end((err,res)=>{
                assert.equal(res.status, 200)
                assert.equal(res.text, 'no book exists')
                done()
              })
          });
    
        });
    
     
  });

});