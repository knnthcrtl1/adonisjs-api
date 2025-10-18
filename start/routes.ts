/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Public routes
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Admin Panel routes (session-based authentication)
router
  .group(() => {
    // Public routes
    router.get('/login', '#controllers/auth_controller.showLogin')
    router.post('/login', '#controllers/auth_controller.login')

    // Protected routes - require session authentication
    router
      .group(() => {
        router.get('/dashboard', '#controllers/admin/dashboard_controller.index')
        router.post('/logout', '#controllers/auth_controller.logout')

        // User Management Routes
        router.resource('users', '#controllers/admin/user_management_controller')
        router.get('/users/stats', '#controllers/admin/user_management_controller.stats')
      })
      .use(middleware.auth({ guards: ['web'] }))
  })
  .prefix('/admin')
