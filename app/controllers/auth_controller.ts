import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class AuthController {
  // Show login form
  async showLogin({ response }: HttpContext) {
    // Return a simple HTML response with Tailwind CSS
    return response.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Login - TRIC CMS</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
          body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
        </style>
      </head>
      <body class="min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-md">
          <div class="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 text-center">
              <i class="fas fa-shield-alt text-5xl mb-4"></i>
              <h2 class="text-3xl font-bold mb-2">TRIC CMS</h2>
              <p class="text-indigo-100">Admin Login</p>
            </div>

            <!-- Form -->
            <div class="p-8">
              <form method="POST" action="/admin/login" class="space-y-6">
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-envelope mr-2"></i>Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="admin@example.com"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
                  />
                </div>

                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                    <i class="fas fa-lock mr-2"></i>Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
                  />
                </div>

                <button
                  type="submit"
                  class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transform hover:-translate-y-0.5 transition duration-200 shadow-lg"
                >
                  <i class="fas fa-sign-in-alt mr-2"></i>Sign In
                </button>
              </form>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-8 py-4 text-center text-gray-500 text-sm">
              &copy; 2025 TRIC CMS. All rights reserved.
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
