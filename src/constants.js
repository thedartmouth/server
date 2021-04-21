import packageInfo from '../package.json'
import path from 'path'
import dotenv from 'dotenv'

export const dotenvConfig = dotenv.config({
	path: path.resolve(
		process.cwd(),
		`${
			process.env.DEPLOY_TAG === 'production'
				? 'prod'
				: process.env.DEPLOY_TAG === 'staging'
				? 'staging'
				: 'dev'
		}.env`
	),
})

export const MONGODB_URI =
	process.env.MONGODB_URI || packageInfo.localDatabaseURI
export const SELF_URL =
	process.env.NODE_ENV === 'development'
		? `localhost:${9090}`
		: packageInfo.productionURL
export const APP_URL =
	process.env.NODE_ENV === 'development'
		? `localhost:${8080}`
		: packageInfo.productionClientURL

export const USER_STRING = 'organization'

export const UNPROTECTED_USER_FIELDS = [
	// Need to be verified, TODO
	// 'email',
	// 'password',
]
