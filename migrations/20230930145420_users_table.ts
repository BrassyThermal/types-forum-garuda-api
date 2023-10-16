import { type Knex } from "knex";

export async function up(knex : Knex) : Promise<void> {
	await knex.schema.createTable("users", table => {
		table.string("id", 50).primary();
		table.string("username", 50).notNullable().unique();
		table.text("password").notNullable();
		table.text("fullname").notNullable();
		table
			.timestamp("created_at", {useTz: true, precision: 6})
			.defaultTo(knex.fn.now(6));
		table
			.timestamp("updated_at", {useTz: true, precision: 6})
			.defaultTo(knex.fn.now(6));
	});
}

export async function down(knex : Knex) : Promise<void> {
	await knex.schema.dropTable("users");
}
