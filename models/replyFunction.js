module.exports.replyFunction = replyFunction;

function replyFunction(status, data, reply) {

    switch (status) {
        case 200:
            reply.status(200).json({
                "message": "Success",
                "result": data
            });
            break;

        case 502:
            reply.status(502).json({
                "message": "Web Server TimeOut",
                "result": data
            });
            break;

        case 504:
            reply.status(504).json({
                "message": "API TimeOUT",
                "result": data
            });
            break;

        default:
            reply.status(404).json({
                "message": "Page Not Found",
                "result": data
            });
            break;
    }
}