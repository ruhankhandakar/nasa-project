// Node Imports
const http = require('http');

require('dotenv').config();

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launces.model');
const { mongoConnect } = require('./services/mongo');

// Server startup
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

async function startServer() {
  // await loadPlanetsData();

  await mongoConnect();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
  });
}

startServer();
