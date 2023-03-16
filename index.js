const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { createInitialData } = require('./src/utils/functions.js');

const {PORT} = process.env

conn.sync({ force: true}).then(() => {
  server.listen(PORT, () => {
    //createInitialData()
    console.log(`%s listening at port ${PORT}`); 
  });
});
