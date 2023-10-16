import { type Knex } from "knex";

export async function up(knex : Knex) : Promise<void> {
	await knex.schema.createTable("authentications", table => {
		table.text("token").notNullable();
	});
}

export async function down(knex : Knex) : Promise<void> {
	await knex.schema.dropTable("authentications");
}
