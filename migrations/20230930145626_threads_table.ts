import { type Knex } from "knex";

export async function up(knex : Knex) : Promise<void> {
	await knex.schema.createTable("threads", table => {
		table.string("id", 50).primary();
		table.string("title", 50).notNullable();
		table.text("body").notNullable();
		table.string("owner", 50).notNullable();
		table
			.timestamp("date", {useTz: true, precision: 6})
			.defaultTo(knex.fn.now(6));

		table.foreign("owner").references("users.id").onDelete("CASCADE");
	});
}

export async function down(knex : Knex) : Promise<void> {
	await knex.schema.table("threads", table => {
		table.dropForeign(["owner"]);
	});

	await knex.schema.dropTable("threads");
}
