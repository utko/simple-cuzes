const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.set('view engine', 'ejs');

var serviceAccount = require("./keys/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

app.get('/', (req, res) => {
  db.collection('books').get()
    .then((snapshot) => {
      let books = [];
      snapshot.forEach((doc) => {
        let book = doc.data();
        book.id = doc.id;
        books.push(book);
      });
      if (books.length === 0) {
        res.render('add-books.ejs');
      } else {
        res.render('index.ejs', { books: books });
      }
    })
    .catch((error) => {
      res.send(error.message);
    });
});

app.post('/books', (req, res) => {
  db.collection('books').add(req.body)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      res.send(error.message);
    });
});

app.listen(5000, () => console.log('App listening on port 5000'));
