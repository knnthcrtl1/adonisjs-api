import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ auth }: HttpContext) {
    // Ensure user is authenticated
    await auth.use('web').authenticate()

    // Get some basic stats
    const stats = {
      totalUsers: 0, // You can add actual user count here
      totalPosts: 0, // You can add actual post count here
      totalViews: 0, // You can add actual view count here
    }

    // Return JSON response for now (since view provider is not configured)
    return {
      message: 'Dashboard accessed successfully',
      user: auth.user,
      stats,
    }
  }
}
