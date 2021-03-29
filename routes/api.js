/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const ObjectID = require('mongodb').ObjectID

module.exports = function(app, collection) {

  app.route('/api/books')
    .get(function(req, res) {
      collection.find().toArray((err, col) => {
        if (err) return console.log(err)
        res.send(col)
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function(req, res) {
      let title = req.body.title;
      if (!title) return res.send('missing required field title')
      collection.insertOne({
        comments: [],
        title: title,
        commentcount: parseInt('0')
      }, (err, book) => {
        if (err) return console.log("can't insert book")
        res.json(book.ops[0])
      })
      //response will contain new book object including atleast _id and title
    })

    .delete(function(req, res) {
      collection.deleteMany({}, (err) => {
        if (err) return console.log(err)
        res.send('complete delete successful')
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function(req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      collection.findOne({ _id: ObjectID(bookid) }, (err, book) => {
        if (err) return console.log(err)
        if (!book) return res.send('no book exists')
        res.json(book)
      })
    })

    .post(function(req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) return res.send('missing required field comment')
      //json res format same as .get
      collection.findOneAndUpdate({ _id: ObjectID(bookid) },
        {
          $push: { comments: comment },
          $inc: { commentcount: 1 }
        }, (err, book) => {
          if (err) return console.log(err)
          if (!book) return res.send('no book exists')
          res.json(book)
        })
    })

    .delete(function(req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      collection.deleteOne({ _id: ObjectID(bookid) }, (err, book) => {
        if (err) return console.log(err)
        if (!book) return res.send('no book exists')
        res.send('delete successful')
      })
    });

};
