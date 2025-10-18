import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class AuthController {
  // Show login form
  async showLogin({ response }: HttpContext) {
    // Return a simple HTML response for now
    return response.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Login - TRIC CMS</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body class="bg-light">
        <div class="container mt-5">
          <div class="row justify-content-center">
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h3 class="text-center">TRIC CMS - Admin Login</h3>
                </div>
                <div class="card-body">
                  <form method="POST" action="/admin/login">
                    <div class="mb-3">
                      <label for="email" class="form-label">Email</label>
                      <input type="email" class="form-control" id="email" name="email" required>
                    </div>
                    <div class="mb-3">
                      <label for="password" class="form-label">Password</label>
                      <input type="password" class="form-control" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Login</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `)
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
