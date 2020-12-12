export class UserValidationError extends Error {
	constructor(...params) {
		// Pass remaining arguments (including vendor specific ones) to parent constructor
		super(...params)

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UserValidationError)
		}

		this.name = 'UserValidationError'
	}
}

export const errorHandlerMiddleware = (err, req, res, next) => {
	if (res.headersSent) {
		return next(err)
	}
	if (!(err instanceof UserValidationError)) {
		res.status(500).send(err.message)
		next()
	} else if (err.message === 'invalid credentials') {
		res.status(401).send(err.message)
		next()
	} else next()
}
