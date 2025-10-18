import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class DashboardController {
  async index({ auth }: HttpContext) {
    // Ensure user is authenticated
    await auth.use('web').authenticate()

    // Get user statistics
    const totalUsers = await User.query().count('* as total')
    const activeUsers = await User.query().where('status', 'active').count('* as total')
    const drivers = await User.query().where('role', 'driver').count('* as total')
    const dispatchers = await User.query().where('role', 'dispatcher').count('* as total')
    const subAdmins = await User.query().where('role', 'sub-admin').count('* as total')
    const admins = await User.query().where('role', 'admin').count('* as total')

    // Get recent users
    const recentUsers = await User.query().orderBy('createdAt', 'desc').limit(5)

    // Get user stats by role
    const stats = {
      totalUsers: totalUsers[0].total,
      activeUsers: activeUsers[0].total,
      drivers: drivers[0].total,
      dispatchers: dispatchers[0].total,
      subAdmins: subAdmins[0].total,
      admins: admins[0].total,
      recentUsers,
    }

    // Return JSON response for now (since view provider is not configured)
    return {
      message: 'Dashboard accessed successfully',
      user: auth.user,
      stats,
    }
  }
}
