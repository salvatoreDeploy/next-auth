type User = {
  permissions: string[]
  roles: string[]
}

type ValidateUserPermissionsParams = {
  user: User | undefined
  permissions?: string[]
  roles?: string[]
}

export function validateUserPermissions({ user, permissions = [], roles = [] }: ValidateUserPermissionsParams) {
  if (permissions?.length > 0) {

    const hasAllPermisisons = permissions.every(permission => {
      return user?.permissions.includes(permission)
    })

    if (!hasAllPermisisons) {
      return false
    }
  }

  if (roles?.length > 0) {
    const hasAllRoles = permissions.some(role => {
      return user?.permissions.includes(role)
    })

    if (!hasAllRoles) {
      return false
    }
  }

  return true
}