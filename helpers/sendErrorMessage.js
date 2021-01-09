const sendErrorMsg =(error, req,res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    });
};


module.exports = sendErrorMsg;