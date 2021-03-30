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
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      collection.find().toArray((err, col) => {
        if (err) return console.log(err)
        res.send(col)
      })
    })

    .post(function(req, res) {
      //response will contain new book object including atleast _id and title
      let title = req.body.title;
      if (!title) return res.send('missing required field title')
      collection.insertOne({
        ... (req.body._id ? {_id: new ObjectID(req.body._id)}:{_id: new ObjectID()}),
        comments: [],
        title: title,
        commentcount: parseInt('0')
      }, (err, book) => {
        if (err) return console.log("can't insert book")
        res.json(book.ops[0])
      })
    })

    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
      collection.deleteMany({}, (err) => {
        if (err) return console.log(err)
        res.send('complete delete successful')
      })
    });

  app.route('/api/books/:id')
    .get(function(req, res) {
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let bookid = req.params.id;
      collection.findOne({ _id: ObjectID(bookid) }, (err, book) => {
        if (err) return console.log(err)
        if (!book) return res.send('no book exists')
        res.json(book)
      })
    })

    .post(function(req, res) {
      //json res format same as .get
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) return res.send('missing required field comment')
      collection.findOneAndUpdate({ _id: ObjectID(bookid) },
        {
          $push: { comments: comment },
          $inc: { commentcount: 1 }
        },{
          returnOriginal: false
        } ,(err, book) => {
          if (err) return console.log(err)
          // Book not found
          if (!book.value) return res.send('no book exists')
          // Book found
          res.json(book.value)
          
        })
    })

    .delete(function(req, res) {
      //if successful response will be 'delete successful'
      let bookid = req.params.id;
      collection.findOne({ _id: ObjectID(bookid) }, (err, book) => {
        if (err) return console.log(err)
        if (!book) return res.send('no book exists')
       collection.deleteOne({ _id: ObjectID(bookid) })
        res.send('delete successful')
      })
    });

};
