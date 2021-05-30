import { getManager, EntityManager } from 'typeorm'
import { ns, ENTITY_MANAGER_KEY } from './Constants'

export function useTransaction(): EntityManager {
  return ns.runAndReturn(() => {
    const tsm = ns.get(ENTITY_MANAGER_KEY)
    if (tsm) return tsm
    return getManager()
  })
}
