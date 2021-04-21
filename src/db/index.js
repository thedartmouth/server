import { Pool } from 'pg'
import path from 'path'
import dotenv from 'dotenv'

export const dotenvConfig = dotenv.config({
	path: path.resolve(
		process.cwd(),
		`${
			process.env.DEPLOY_TAG === 'prod'
				? 'prod'
				: process.env.DEPLOY_TAG === 'staging'
				? 'staging'
				: 'dev'
		}.env`
	),
})

const pool = new Pool({
	...(process.env.DEPLOY_TAG !== 'prod'
		? {
				user: process.env.PGUSER,
				password: process.env.PGPASSWORD,
				host: process.env.PGHOST,
				database: process.env.PGDATABASE,
				port: process.env.PGPORT,
		  }
		: { connectionString: process.env.DATABASE_URL }),
	ssl: {
		rejectUnauthorized: false,
	},
})

const query = async (text, params) => {
	// const start = Date.now()
	const res = await pool.query(text, params)
	// const duration = Date.now() - start
	// console.log('executed query', { text, duration, rows: res.rowCount })
	return res
}

const getClient = async () => {
	const client = await pool.connect()
	const query = client.query
	const release = client.release
	// set a timeout of 5 seconds, after which we will log this client's last query
	const timeout = setTimeout(() => {
		console.error('A client has been checked out for more than 5 seconds!')
		console.error(
			`The last executed query on this client was: ${client.lastQuery}`
		)
	}, 5000)
	// monkey patch the query method to keep track of the last query executed
	client.query = (...args) => {
		client.lastQuery = args
		return query.apply(client, args)
	}
	client.release = () => {
		// clear our timeout
		clearTimeout(timeout)
		// set the methods back to their old un-monkey-patched version
		client.query = query
		client.release = release
		return release.apply(client)
	}
	return client
}

export { query, getClient }
