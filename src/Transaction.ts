import { getManager } from 'typeorm'
import { Propagation } from './Propagetion'
import { IsolationLevel } from './IsolationLevel'
import { ns, ENTITY_MANAGER_KEY } from './Constants'
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 18)

export function Transaction(options?: {
  connectionName?: string | (() => string | undefined)
  propagation?: Propagation
  isolationLevel?: IsolationLevel
}) {
  options = options || { propagation: Propagation.REQUIRED }

  return function(_target: any, _propertyName: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
    const method = propertyDescriptor.value

    propertyDescriptor.value = async function(...args: any[]) {
      return ns.runAndReturn(() => {
        const lastTsm = ns.get(ENTITY_MANAGER_KEY)
        const run = async () => method.apply(this, [...args])

        /** 新建事务运行 */
        const runWithNewTransaction = async () => {
          const transactionCallback = async tsm => {
            return ns.runAndReturn(async () => {
              tsm.id = nanoid()
              try {
                ns.set(ENTITY_MANAGER_KEY, tsm)
                return await method.apply(this, args)
              } catch (err) {
                throw err
              } finally {
                ns.set(ENTITY_MANAGER_KEY, lastTsm)
              }
            })
          }

          if (options.isolationLevel) {
            return await getManager().transaction(options.isolationLevel, transactionCallback)
          } else {
            return await getManager().transaction(transactionCallback)
          }
        }

        /** 不使用事务运行 */
        const runWithNoTransaction = ns.runAndReturn(() => {
          return async () => {
            try {
              ns.set(ENTITY_MANAGER_KEY, getManager())
              return await method.apply(this, args)
            } catch (err) {
              throw err
            } finally {
              ns.set(ENTITY_MANAGER_KEY, lastTsm)
            }
          }
        })

        switch (options.propagation) {
          case Propagation.REQUIRED:
            if (lastTsm) {
              return run()
            } else {
              return runWithNewTransaction()
            }
          case Propagation.SUPPORTS:
            if (lastTsm) {
              return run()
            } else {
              return runWithNoTransaction()
            }
          case Propagation.MANDATORY:
            if (lastTsm) {
              return run()
            } else {
              throw Error('Transaction propagation：MANDATORY')
            }
          case Propagation.REQUIRES_NEW:
            return runWithNewTransaction()
          case Propagation.NOT_SUPPORTED:
            return runWithNoTransaction()
          case Propagation.NEVER:
            if (lastTsm) {
              throw Error('Transaction NEVER')
            } else {
              return runWithNoTransaction()
            }
          case Propagation.NESTED:
            return runWithNewTransaction()
        }
      })
    }

    return propertyDescriptor
  }
}
