const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
        // console.log( req.userId);
        // console.log(req.headers);
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;
        
        let decodeData;
            // console.log(token);
            req.unauthorized = false;
            if (token && isCustomAuth) {
                decodeData = jwt.verify(token, "test");
                req.userId = decodeData?.id;
            } else {
                decodeData = jwt.decode(token);
                req.userId = decodeData?.sub;
            }

        // console.log( req.userId);
    next();
  } catch (error) {
    req.unauthorized = true;
    console.log(error);
  }
};

module.exports = auth;
