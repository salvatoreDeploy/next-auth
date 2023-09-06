import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

type UseCanParams = {
  permissions?: string[]
  roles?: string[]
}

export function useCan({ permissions = [], roles = [] }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext)


  if (!isAuthenticated) {
    return false
  }

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