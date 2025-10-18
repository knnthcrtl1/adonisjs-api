import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class UserManagementController {
  // List all users with filtering
  async index({ auth, request, view }: HttpContext) {
    await auth.use('web').authenticate()

    const page = request.input('page', 1)
    const role = request.input('role', '')
    const status = request.input('status', '')
    const search = request.input('search', '')

    let query = User.query()

    // Apply filters
    if (role) {
      query = query.where('role', role)
    }
    if (status) {
      query = query.where('status', status)
    }
    if (search) {
      query = query.where((builder) => {
        builder
          .where('fullName', 'ilike', `%${search}%`)
          .orWhere('email', 'ilike', `%${search}%`)
          .orWhere('phone', 'ilike', `%${search}%`)
      })
    }

    const users = await query.paginate(page, 10)
    const usersPaginated = users.serialize()

    return view.render('admin/users/index', {
      users: usersPaginated.data,
      meta: usersPaginated.meta,
      filters: { role, status, search },
    })
  }

  // Show create user form
  async create({ auth, view }: HttpContext) {
    await auth.use('web').authenticate()

    return view.render('admin/users/create', {
      roles: ['admin', 'sub-admin', 'dispatcher', 'driver'],
      statuses: ['active', 'inactive', 'suspended'],
    })
  }

  // Store new user
  async store({ request, auth, response, session }: HttpContext) {
    await auth.use('web').authenticate()

    const userSchema = vine.compile(
      vine.object({
        fullName: vine.string().minLength(2),
        email: vine.string().email(),
        password: vine.string().minLength(6),
        role: vine.enum(['admin', 'sub-admin', 'dispatcher', 'driver']),
        phone: vine.string().optional(),
        status: vine.enum(['active', 'inactive', 'suspended']).optional(),
      })
    )

    try {
      const data = await request.validateUsing(userSchema)

      // Check if user already exists
      const existingUser = await User.findBy('email', data.email)
      if (existingUser) {
        session.flash('error', 'User with this email already exists')
        return response.redirect().back()
      }

      await User.create({
        ...data,
        status: data.status || 'active',
      })

      session.flash('success', 'User created successfully')
      return response.redirect().toRoute('admin.users.index')
    } catch (error) {
      session.flash('error', 'Failed to create user')
      return response.redirect().back()
    }
  }

  // Show user details
  async show({ params, auth, view }: HttpContext) {
    await auth.use('web').authenticate()

    const user = await User.findOrFail(params.id)

    return view.render('admin/users/show', {
      user,
    })
  }

  // Show edit user form
  async edit({ params, auth, view }: HttpContext) {
    await auth.use('web').authenticate()

    const user = await User.findOrFail(params.id)

    return view.render('admin/users/edit', {
      user,
      roles: ['admin', 'sub-admin', 'dispatcher', 'driver'],
      statuses: ['active', 'inactive', 'suspended'],
    })
  }

  // Update user
  async update({ params, request, auth, response, session }: HttpContext) {
    await auth.use('web').authenticate()

    const userSchema = vine.compile(
      vine.object({
        fullName: vine.string().minLength(2),
        email: vine.string().email(),
        password: vine.string().minLength(6).optional(),
        role: vine.enum(['admin', 'sub-admin', 'dispatcher', 'driver']),
        phone: vine.string().optional(),
        status: vine.enum(['active', 'inactive', 'suspended']),
      })
    )

    try {
      const data = await request.validateUsing(userSchema)
      const user = await User.findOrFail(params.id)

      // Check if email is being changed and if it already exists
      if (data.email !== user.email) {
        const existingUser = await User.findBy('email', data.email)
        if (existingUser) {
          session.flash('error', 'User with this email already exists')
          return response.redirect().back()
        }
      }

      // Only update password if provided
      const updateData = { ...data }
      if (!data.password) {
        delete updateData.password
      }

      user.merge(updateData)
      await user.save()

      session.flash('success', 'User updated successfully')
      return response.redirect().toRoute('admin.users.index')
    } catch (error) {
      session.flash('error', 'Failed to update user')
      return response.redirect().back()
    }
  }

  // Delete user
  async destroy({ params, auth, response, session }: HttpContext) {
    await auth.use('web').authenticate()

    try {
      const user = await User.findOrFail(params.id)

      // Prevent admin from deleting themselves
      if (user.id === auth.user?.id) {
        session.flash('error', 'You cannot delete your own account')
        return response.redirect().back()
      }

      await user.delete()

      session.flash('success', 'User deleted successfully')
      return response.redirect().toRoute('admin.users.index')
    } catch (error) {
      session.flash('error', 'Failed to delete user')
      return response.redirect().back()
    }
  }

  // Get user statistics
  async stats({ auth }: HttpContext) {
    await auth.use('web').authenticate()

    const totalUsers = await User.query().count('* as total')
    const activeUsers = await User.query().where('status', 'active').count('* as total')
    const drivers = await User.query().where('role', 'driver').count('* as total')
    const dispatchers = await User.query().where('role', 'dispatcher').count('* as total')
    const subAdmins = await User.query().where('role', 'sub-admin').count('* as total')

    return {
      totalUsers: totalUsers[0].$extras.total,
      activeUsers: activeUsers[0].$extras.total,
      drivers: drivers[0].$extras.total,
      dispatchers: dispatchers[0].$extras.total,
      subAdmins: subAdmins[0].$extras.total,
    }
  }
}
