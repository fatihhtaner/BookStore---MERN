const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let decodedData;

        if(token) {
            decodedData = jwt.verify(token, process.env.SECRET_TOKEN);
            req.userId = decodedData?.id;
            req.userRole = decodedData?.role;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
            req.userRole = decodedData?.role;
            return res.status(401).json({message: 'Unauthorized'});
        }

        next();
    } catch (error) { 
        res.status(401).json({message: 'Unauthorized'})
    }
}

module.exports = auth;