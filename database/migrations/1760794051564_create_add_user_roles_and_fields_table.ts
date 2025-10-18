import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('role', ['admin', 'sub-admin', 'dispatcher', 'driver']).defaultTo('driver')
      table.string('phone').nullable()
      table.enum('status', ['active', 'inactive', 'suspended']).defaultTo('active')
      table.string('avatar').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role')
      table.dropColumn('phone')
      table.dropColumn('status')
      table.dropColumn('avatar')
    })
  }
}
