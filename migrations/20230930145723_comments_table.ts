import { type Knex } from "knex";

export async function up(knex : Knex) : Promise<void> {
	await knex.schema.createTable("comments", table => {
		table.string("id", 50).primary();
		table.text("content").notNullable();
		table.string("owner", 50).notNullable();
		table.string("thread_id", 50).notNullable();
		table.boolean("is_deleted").notNullable().defaultTo(false);
		table
			.timestamp("date", {useTz: true, precision: 6})
			.defaultTo(knex.fn.now(6));

		table.foreign("owner").references("users.id").onDelete("CASCADE");
		table.foreign("thread_id").references("threads.id").onDelete("CASCADE");
	});
}

export async function down(knex : Knex) : Promise<void> {
	await knex.schema.table("comments", table => {
		table.dropForeign(["owner"]);
		table.dropForeign(["thread_id"]);
	});

	await knex.schema.dropTable("comments");
}
