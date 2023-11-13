import { type Knex } from "knex";

export async function up(knex : Knex) : Promise<void> {
  await knex.schema.createTable("likes", table => {
    table.string("id", 50).primary();
    table.string("owner", 50).notNullable();
    table.string("comment_id", 50).notNullable();
    table.boolean("is_deleted").notNullable().defaultTo(false);

    table.foreign("owner").references("users.id").onDelete("CASCADE");
    table.foreign("comment_id").references("comments.id").onDelete("CASCADE");
  });
}

export async function down(knex : Knex) : Promise<void> {
  await knex.schema.table("likes", table => {
    table.dropForeign(["owner"]);
    table.dropForeign(["comment_id"]);
  });

  await knex.schema.dropTable("likes");
}

