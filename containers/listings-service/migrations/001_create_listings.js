exports.up = function(knex) {
  return knex.schema.createTable('listings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('tenant_id').notNullable().references('id').inTable('tenants');
    table.uuid('owner_id').notNullable().references('id').inTable('users');
    table.uuid('company_id').references('id').inTable('companies');
    table.uuid('category_id').references('id').inTable('categories');
    table.string('title').notNullable();
    table.text('description');
    table.decimal('price', 12, 2).defaultTo(0);
    table.string('currency', 3).defaultTo('LYD');
    table.string('price_type').defaultTo('FIXED');
    table.string('city');
    table.string('status').defaultTo('ACTIVE');
    table.integer('view_count').defaultTo(0);
    table.string('image');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('listings');
};
