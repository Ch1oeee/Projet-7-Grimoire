const express = require('express');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get('/api/books', (req, res, next) => {
    const books = [
      {
        userId : 'oeihfzeomoihi',
        title : 'Hunger Games',
        author : 'Suzanne Collins',
        imageUrl : 'https://www.ecranlarge.com/uploads/image/001/165/hunger-games-affiche-francaise-1165297.jpg',
        year: 2015,
        genre: 'Fiction',
        ratings : [
            {
            userId : 'oeihfzeomoihi',
            grade : 5,
            }
            ],
            averageRating : 4,
      },
      
    ];
    res.status(200).json(books);
});


module.exports = app;