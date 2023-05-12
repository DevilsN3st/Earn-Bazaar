
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      let type = req.params.type;
      let path = `public/${type}`;
      callback(null, path);
    },
    filename: (req, file, callback) => {
      callback(null, req.body.name);
    },
  });


  module.exports = {storage};