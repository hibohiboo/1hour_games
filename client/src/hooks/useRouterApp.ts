import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/domain/firebase'
import { useAppSelector } from '@/store/hooks'
import { isUserAuthenticatedSelector } from '@/store/selectors/auth'
import { login } from '@/store/slices/auth'
import type { AppDispatch } from '@/store'

const useRouterApp = () => {
  const authenticated = useAppSelector(isUserAuthenticatedSelector)
  const dispatch = useDispatch<AppDispatch>()

  const refresh = useCallback(
    async (uid) => {
      const userData = {
        uid,
      }
      return dispatch(login(userData))
    },
    [dispatch],
  )
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        dispatch(login({}))
      }
      if (authenticated) return
      if (user) {
        return await refresh(user.uid)
      }
    })
  }, [dispatch, refresh, authenticated])
  return { authenticated }
}

export default useRouterApp
