# User Management System - TRIC Service

## Overview

This guide explains the comprehensive user management system that has been implemented for the TRIC fleet management service. The system allows administrators to manage users with different roles (drivers, dispatchers, sub-admins, and admins).

## Features

### 1. **User CRUD Operations**

- ✅ Create new users with different roles
- ✅ View user details
- ✅ Edit user information
- ✅ Delete users (with self-deletion protection)
- ✅ List all users with filtering and pagination

### 2. **User Roles**

The system supports four user roles:

- **Admin**: Full system access
- **Sub-Admin**: Limited administrative access
- **Dispatcher**: Manages routes and assignments
- **Driver**: Basic access for drivers

### 3. **User Status**

Users can have three different statuses:

- **Active**: User can access the system
- **Inactive**: User account is temporarily disabled
- **Suspended**: User account is suspended

### 4. **Filtering & Search**

- Search by name, email, or phone number
- Filter by role
- Filter by status
- Pagination support (10 users per page)

## File Structure

```
app/
├── controllers/
│   └── admin/
│       ├── dashboard_controller.ts       # Dashboard with statistics
│       └── user_management_controller.ts # User CRUD operations
├── models/
│   └── user.ts                          # User model with helper methods
resources/
└── views/
    └── admin/
        ├── layout.edge                  # Global layout (Tailwind + Font Awesome)
        ├── dashboard.edge               # Dashboard view
        └── users/
            ├── index.edge               # User list with filters
            ├── create.edge              # Create user form
            ├── edit.edge                # Edit user form
            └── show.edge                # User details view
```

## Routes

All user management routes are prefixed with `/admin` and require authentication:

| Method    | Route                   | Action  | Description                 |
| --------- | ----------------------- | ------- | --------------------------- |
| GET       | `/admin/users`          | index   | List all users with filters |
| GET       | `/admin/users/create`   | create  | Show create user form       |
| POST      | `/admin/users`          | store   | Store new user              |
| GET       | `/admin/users/:id`      | show    | Show user details           |
| GET       | `/admin/users/:id/edit` | edit    | Show edit user form         |
| PUT/PATCH | `/admin/users/:id`      | update  | Update user                 |
| DELETE    | `/admin/users/:id`      | destroy | Delete user                 |
| GET       | `/admin/users/stats`    | stats   | Get user statistics         |

## User Model Helper Methods

The User model includes several helper methods for convenience:

### Role Checks

```typescript
user.isAdmin // Returns true if user is admin
user.isSubAdmin // Returns true if user is sub-admin
user.isDispatcher // Returns true if user is dispatcher
user.isDriver // Returns true if user is driver
```

### Status Checks

```typescript
user.isActive // Returns true if user is active
user.isInactive // Returns true if user is inactive
user.isSuspended // Returns true if user is suspended
```

### Display Helpers

```typescript
user.initials // Returns user initials (e.g., "JD" for John Doe)
user.displayName // Returns fullName or email
user.roleIcon // Returns Font Awesome icon class for role
user.statusIcon // Returns Font Awesome icon class for status
user.roleColor // Returns color name for role badge
user.statusColor // Returns color name for status badge
```

## Global Layout System

### Problem Solved

Previously, HTML head elements (Tailwind CSS and Font Awesome) were duplicated across multiple views, leading to:

- Code duplication
- Maintenance issues
- Inconsistent styling
- Larger file sizes

### Solution

Created a centralized layout system:

**`resources/views/admin/layout.edge`**

- Contains all HTML head elements (Tailwind CSS, Font Awesome)
- Includes sidebar navigation
- Includes header with user info
- Includes flash message display
- Provides content section for child views

**Child views** now simply extend the layout:

```edge
@layout('admin/layout')

  @section('title', 'Page Title')
    @section('page-title', 'Page Header')

      @section('content')
        <!-- Your content here -->
      @endsection
```

### Benefits

- ✅ Single source of truth for CSS/JS libraries
- ✅ Consistent UI across all admin pages
- ✅ Easy to update styles globally
- ✅ Reduced code duplication
- ✅ Better maintainability

## Usage Examples

### Creating a New User

1. Navigate to `/admin/users/create`
2. Fill in the form:
   - Full Name (required)
   - Email Address (required)
   - Password (required, min 6 characters)
   - Phone Number (optional)
   - Role (required)
   - Status (defaults to active)
3. Click "Create User"

### Editing a User

1. Navigate to `/admin/users`
2. Click the edit icon (pencil) next to the user
3. Update the desired fields
4. Leave password blank to keep current password
5. Click "Update User"

### Deleting a User

1. Navigate to `/admin/users`
2. Click the delete icon (trash) next to the user
3. Confirm the deletion
4. Note: You cannot delete your own account

### Filtering Users

On the user list page (`/admin/users`):

1. Use the search box to search by name, email, or phone
2. Select a role from the dropdown
3. Select a status from the dropdown
4. Click "Filter"

## Flash Messages

The system includes flash message support for user feedback:

- ✅ Success messages (green)
- ❌ Error messages (red)

Flash messages are displayed at the top of the page content area and automatically styled.

## Security Features

1. **Authentication Required**: All user management routes require authentication
2. **Self-Deletion Protection**: Users cannot delete their own account
3. **Email Uniqueness**: System prevents duplicate email addresses
4. **Password Hashing**: Passwords are automatically hashed using scrypt
5. **Validation**: All inputs are validated using VineJS

## Dashboard Statistics

The dashboard displays real-time statistics:

- Total Users
- Active Users
- Drivers Count
- Dispatchers Count
- Sub-Admins Count
- Admins Count
- Recent Users (last 5)

## Customization

### Adding New User Roles

1. Update the User model type definition:

```typescript
declare
role: 'admin' | 'sub-admin' | 'dispatcher' | 'driver' | 'new-role'
```

2. Update the validation schemas in the controller
3. Add the role to the dropdown options in views
4. Update helper methods if needed

### Changing Pagination

In `user_management_controller.ts`, change the second parameter:

```typescript
const users = await query.paginate(page, 20) // 20 users per page
```

### Customizing Colors

Edit the Tailwind config in `resources/views/admin/layout.edge`:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#your-color',
          // ...
        },
      },
    },
  },
}
```

## Troubleshooting

### Issue: Flash messages not showing

**Solution**: Ensure session middleware is enabled in `start/kernel.ts`

### Issue: Pagination not working

**Solution**: Check that the route includes query parameters: `?page=2`

### Issue: User creation fails

**Solution**: Check validation errors and ensure all required fields are filled

### Issue: Cannot delete user

**Solution**: Ensure you're not trying to delete your own account

## Future Enhancements

Potential improvements for the system:

- [ ] Bulk user operations (delete, status change)
- [ ] User import/export (CSV)
- [ ] Advanced permissions system
- [ ] User activity logs
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] User profile pictures/avatars
- [ ] Advanced search with date ranges
- [ ] Export user reports

## Support

For issues or questions, please refer to the AdonisJS documentation:

- [AdonisJS Documentation](https://docs.adonisjs.com)
- [Lucid ORM](https://docs.adonisjs.com/guides/database/introduction)
- [Edge Templates](https://docs.adonisjs.com/guides/views/introduction)
