const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();

const authRouter = require('./routes/api/auth-router');
const drinksRouter = require('./routes/api/drinks-router');
const glassRouter = require('./routes/api/glass-router');
const ingredientsRouter = require('./routes/api/ingredients-router');
const ownRouter = require('./routes/api/own-router');
const favoriteRouter = require('./routes/api/favorite-router');
const searchRouter = require('./routes/api/search-router');
const popularRouter = require('./routes/api/popular-router');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument)); // backend-route
app.use('/users', authRouter);
app.use('/recipes', drinksRouter);
app.use('/search', searchRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/glass', glassRouter);
app.use('/own', ownRouter);
app.use('/favorite', favoriteRouter);
app.use('/popular-recipe', popularRouter);

app.use((req, res) => {
	res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
	const { status = 500, message = 'Server error' } = err;
	res.status(status).json({
		message
	});
});

module.exports = app;
