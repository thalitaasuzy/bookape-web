var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://thalitasuzyr:thalitasuzyr@clustersuzy.p8ib9.mongodb.net/?retryWrites=true&w=majority&appName=ClusterSuzy";

MongoClient.connect(uri)
  .then((client) => {
    console.log("Conectado ao MongoDB Atlas!😎");
    const db = client.db('databasetest');
    app.locals.db = db;
  })
  .catch((err) => {
    console.log("Erro ao conectar ao MongoDB Atlas!😔")
  });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signInRouter = require('./routes/signIn');
var signUpRouter = require('./routes/signUp');
var bookInfoRouter = require('./routes/bookInfo');
var bookDetailsRouter = require('./routes/bookDetails');
var magicRouter = require('./routes/magic');
var searchBooksRouter = require('./routes/searchBooks');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json()); // Trata o express como JSON (body-parser)
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signIn', signInRouter);
app.use('/signUp', signUpRouter);
app.use('/bookInfo', bookInfoRouter);
app.use('/magic', magicRouter);
app.use('/searchBooks', searchBooksRouter);
app.use('/bookDetails', bookDetailsRouter);

// Rota para buscar os livros na Open Library API
app.get('/search', async (req, res) => {
  const title = req.query.title;
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      res.json(data); // Envia os dados de volta para o front-end
  } catch (error) {
      console.error('Erro ao buscar os livros:', error);
      res.status(500).json({ error: 'Erro ao buscar os livros' });
  }
});

// Rota para a página de detalhes do livro
app.get('/book/:key', async (req, res) => {
  const bookKey = req.params.key;
  const url = `https://openlibrary.org${bookKey}.json`;

  try {
      const response = await fetch(url);
      const book = await response.json();
      res.render('bookDetails', { book });
  } catch (error) {
      console.error('Erro ao buscar os detalhes do livro:', error);
      res.status(500).json({ error: 'Erro ao buscar os detalhes do livro' });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

