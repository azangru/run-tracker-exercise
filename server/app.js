import express from 'express';
import path from 'path';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';

import router from './routes';

let app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../dist')));

app.use('/api', router);

app.get('*', (req, res) => {
  res.render('index.ejs');
});

export default app;
