module.exports.replyFunction = replyFunction;

function replyFunction(status, data, reply) {
	switch (status) {
		case 200:
			reply.status(200).json({
				"code": 200,
				"message": "Success",
				"result": data
			})
			break;

		case 204:
			reply.status(204).json({
				"code": 204,
				"message": "No Data",
				"result": data
			})
			break;

		case 400:
			reply.status(204).json({
				"code": 400,
				"message": "Bad Request",
				"result": data
			})
			break;

		case 401:
			reply.status(401).json({
				"code": 401,
				"message": "Unauthorized",
				"result": data
			})
			break;

		case 409:
			reply.status(409).json({
				"code": 409,
				"message": "Conflict",
				"result": data
			})
			break;


		case 500:
			reply.status(500).json({
				"code": 500,
				"message": "Server Error",
				"result": data
			})
			break;

		case 502:
			reply.status(502).json({
				"code": 502,
				"message": "Bad Gateway",
				"result": data
			})
			break;

		case 503:
			reply.status(503).json({
				"code": 503,
				"message": "Service Unavailabe",
				"result": data
			})
			break;

		case 504:
			reply.status(504).json({
				"code": 504,
				"message": "Gateway Timeout",
				"result": data
			})
			break;

		default:
			reply.status(404).json({
				"code": 404,
				"message": "Page Not Found",
				"result": data
			})
			break;
	}
}