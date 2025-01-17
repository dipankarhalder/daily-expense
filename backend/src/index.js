const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { routers, msg } = require('./constant');
const { envConfig } = require('./config');
const { RootApiRouter } = require('./routes');

const app = express();

app.use(morgan('dev'));
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routers.allRouters.base, RootApiRouter);

app.listen(envConfig.PORT, () => {
  console.log(`${msg.server.serveSuccess} ${envConfig.PORT}`);
});
