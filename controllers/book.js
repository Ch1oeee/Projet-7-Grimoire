const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
  Book.find()
  .then(books => res.status(200).json(books))
  .catch(error => res.status(400).json({ error }));
}

exports.createBook = (req, res, next) => {
  try {
    if (!req.body.book) {
      throw new Error('Le corps de la requête ne contient pas de données JSON.');
    }

    console.log('corps de la requete', req.body.book)

    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
      .then(() => { res.status(201).json({ message: 'Livre enregistré !' }) })
      .catch(error => { res.status(401).json({ error }) });
  } catch (error) {
    res.status(400).json({ error: 'Données JSON invalides.' });
  }
}

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(403).json({ message : ' Unauthorized request '});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Livre modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
}

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
  .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message : ' Unauthorized request '});
      } else {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              Book.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
          });
      }
  })
  .catch( error => {
      res.status(500).json({ error });
  });
}

exports.bestRating = (req, res, next) => {
  Book.find()
  .sort({averageRating: -1})
  .limit(3)
  .then(bestRatedBook => res.status(200).json(bestRatedBook))
  .catch(error => res.status(400).json({error}))
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(books => res.status(200).json(books))
      .catch(error => res.status(404).json({ error }));
}

exports.addRating = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
        book.ratings.push({
          userId: req.auth.userId,
          grade: req.body.rating
        });
        let totalRating = 0;
        for (let i = 0; i < book.ratings.length; i++) {
          let currentRating = book.ratings[i].grade;
          totalRating += currentRating;
        }
        book.averageRating = (totalRating / book.ratings.length).toFixed(1);
        console.log(book.averageRating)
        return book.save();
    })
    .then(book => {
      console.log('Livre noté:', book);
      res.status(201).json(book);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: '' });
    });
}; 
