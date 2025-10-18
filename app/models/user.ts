import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 'admin' | 'sub-admin' | 'dispatcher' | 'driver'

  @column()
  declare phone: string | null

  @column()
  declare status: 'active' | 'inactive' | 'suspended'

  @column()
  declare avatar: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Access tokens for API authentication
  static accessTokens = DbAccessTokensProvider.forModel(User)

  // Helper methods
  get isAdmin(): boolean {
    return this.role === 'admin'
  }

  get isSubAdmin(): boolean {
    return this.role === 'sub-admin'
  }

  get isDispatcher(): boolean {
    return this.role === 'dispatcher'
  }

  get isDriver(): boolean {
    return this.role === 'driver'
  }

  get isActive(): boolean {
    return this.status === 'active'
  }

  get isInactive(): boolean {
    return this.status === 'inactive'
  }

  get isSuspended(): boolean {
    return this.status === 'suspended'
  }

  get initials(): string {
    if (!this.fullName) return this.email.charAt(0).toUpperCase()
    return this.fullName
      .split(' ')
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  get displayName(): string {
    return this.fullName || this.email
  }

  get roleIcon(): string {
    switch (this.role) {
      case 'admin':
        return 'fa-crown'
      case 'sub-admin':
        return 'fa-user-shield'
      case 'dispatcher':
        return 'fa-headset'
      case 'driver':
        return 'fa-id-card'
      default:
        return 'fa-user'
    }
  }

  get statusIcon(): string {
    switch (this.status) {
      case 'active':
        return 'fa-check-circle'
      case 'inactive':
        return 'fa-pause-circle'
      case 'suspended':
        return 'fa-ban'
      default:
        return 'fa-question-circle'
    }
  }

  get statusColor(): string {
    switch (this.status) {
      case 'active':
        return 'green'
      case 'inactive':
        return 'gray'
      case 'suspended':
        return 'red'
      default:
        return 'gray'
    }
  }

  get roleColor(): string {
    switch (this.role) {
      case 'admin':
        return 'red'
      case 'sub-admin':
        return 'purple'
      case 'dispatcher':
        return 'blue'
      case 'driver':
        return 'green'
      default:
        return 'gray'
    }
  }
}
