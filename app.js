const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUI = require('swagger-ui-express');
// const swaggerJsDoc = require('swagger-jsdoc');
const jsyaml = require('js-yaml');
const userRouter = require('./src/routes/userRoutes');
const organizationRouter = require('./src/routes/organizationRoutes');
const _serviceRouter = require('./src/routes/_serviceRoutes');
const _personnelRouter = require('./src/routes/_personnelRoutes');
const practitionerRouter = require('./src/routes/practitionerRoutes');
const practitionerRoleRouter = require('./src/routes/practitionerRoleRoutes');
const identifierRouter = require('./src/routes/identifierRoutes');
const healthcareServiceRouter = require('./src/routes/healthcareServiceRoutes');
const telecomRouter = require('./src/routes/telecomRoutes');
const addressRouter = require('./src/routes/addressRoutes');
const contactRouter = require('./src/routes/contactRoutes');
const locationRouter = require('./src/routes/locationRoutes');
const humanNameRouter = require('./src/routes/humanNameRoutes');
const AppError = require('./src/utils/appError');
const globalErrorHandler = require('./src/controller/errorController');
// const swaggerOptions = require('./src/swagger/swagger.yml');
const swaggerOptions = jsyaml.load(
  fs.readFileSync('./src/swagger/swagger.yaml', 'utf8')
);

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//middleware
//1) Global middleware

app.use(cors());

//body parser, reading data from body into req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // parses application/json

app.use(cookieParser());

//testing middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req);
  console.log(process.env.NODE_ENV);
  if (req.body) {
    console.log(req.body);
  }
  next();
});
//serving static files
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/organization', organizationRouter);
app.use('/api/v1/_service', _serviceRouter);
app.use('/api/v1/_personnel', _personnelRouter);
app.use('/api/v1/practitoner', practitionerRouter);
app.use('/api/v1/practitionerrole', practitionerRoleRouter);
app.use('/api/v1/identifier', identifierRouter);
app.use('/api/v1/telecom', telecomRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/location', locationRouter);
app.use('/api/v1/address', addressRouter);
app.use('/api/v1/humanname', humanNameRouter);
app.use('/api/v1/healthcareservice', healthcareServiceRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerOptions));
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerOptions));

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(`${__dirname}/public/`));
//   app.get(/.*/, (req, res) => res.sendFile(`${__dirname}/public/index.html`));
// }

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
