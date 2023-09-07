const Book = require('../models/Book')

exports.getAllBooks = (req, res, next) => {
  Book.find()
  .then(books => res.status(200).json(books))
  .catch(error => res.status(400).json({ error }));
}

exports.createBook = (req, res, next) => {
  try {
    // Vérifiez si req.body.books n'est pas vide
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
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
}

exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(books => res.status(200).json(books))
      .catch(error => res.status(404).json({ error }));
}

