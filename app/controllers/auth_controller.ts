import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class AuthController {
  // Show login form
  async showLogin({ view, auth }: HttpContext) {
    // Return a simple HTML response with Tailwind CSS
    return view.render('auth/login')
  }

  // Handle login
  async login({ request, auth, response, session }: HttpContext) {
    // Validate input
    const loginSchema = vine.compile(
      vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(6),
      })
    )

    try {
      const data = await request.validateUsing(loginSchema)

      // Verify credentials
      const user = await User.verifyCredentials(data.email, data.password)

      // Login using session guard
      await auth.use('web').login(user)

      // Redirect to dashboard
      return response.redirect('/admin/dashboard')
    } catch (error) {
      // Store error in session
      session.flash('error', 'Invalid email or password')
      session.flashAll()

      return response.redirect().back()
    }
  }

  // Handle logout
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/admin/login')
  }
}
