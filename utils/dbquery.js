/* eslint-disable no-useless-catch */
const { dbhost, dbuser, dbpassword, dbdatabase } = require('../mariadb.json');

const dbquery = (queryString, args) => {
	const mariadb = require('mariadb');
	const pool = mariadb.createPool({
		host: dbhost,
		user: dbuser,
		password: dbpassword,
		database: dbdatabase,
		connectionLimit: 5,
	});

	async function asyncFunction() {
		let conn;
		try {
			conn = await pool.getConnection();
			return (await conn.query(queryString, args));
		}
		catch (err) {
			throw err;
		}
		finally {
			if (conn) conn.end();
		}
	}
	return asyncFunction().then(rows => {
		pool.end();
		return rows;
	});
};

exports.dbquery = dbquery;