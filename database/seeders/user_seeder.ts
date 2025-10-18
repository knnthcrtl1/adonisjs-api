import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class extends BaseSeeder {
  async run() {
    // Create a test admin user
    await User.create({
      fullName: 'Admin User',
      email: 'admin@tric.com',
      password: await hash.make('password123'),
      role: 'admin',
      phone: '+1234567890',
      status: 'active',
    })

    // Create a test driver
    await User.create({
      fullName: 'John Driver',
      email: 'driver@tric.com',
      password: await hash.make('password123'),
      role: 'driver',
      phone: '+1234567891',
      status: 'active',
    })

    // Create a test dispatcher
    await User.create({
      fullName: 'Jane Dispatcher',
      email: 'dispatcher@tric.com',
      password: await hash.make('password123'),
      role: 'dispatcher',
      phone: '+1234567892',
      status: 'active',
    })
  }
}
