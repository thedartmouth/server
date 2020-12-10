/**
 * Ensures that the authenticated identity matches that which the requested action will affect.
 * @param {String} requestedUserId
 * @param {Express.Request} req
 */
const requireSelf = (requestedUserId, req) => (res) => {
	const authenticatedUserId = req?.user?.id
	const isAdmin = req?.admin
	if (requestedUserId !== authenticatedUserId && isAdmin !== true)
		res.sendStatus(401)
}

export default requireSelf
