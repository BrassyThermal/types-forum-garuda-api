import dotenv from "dotenv";
import type { Knex } from "knex";

dotenv.config();

const config : Record<string, Knex.Config> = {
	test: {
		client: "pg",
		connection: {
			host: process.env.PGHOST_TEST,
			port: parseInt(process.env.PGPORT_TEST as string),
			user: process.env.PGUSER_TEST,
			database: process.env.PGDATABASE_TEST,
			password: process.env.PGPASSWORD_TEST,
		},
		migrations: {
			directory: "./migrations",
			extension: "ts",
		},
	},

	production: {
		client: "pg",
		connection: {
			host: process.env.PGHOST,
			port: parseInt(process.env.PGPORT as string),
			user: process.env.PGUSER,
			database: process.env.PGDATABASE,
			password: process.env.PGPASSWORD,
		},
	},
};

module.exports = config;
