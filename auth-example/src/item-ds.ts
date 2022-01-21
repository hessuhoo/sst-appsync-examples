import { AppSyncResolverHandler } from 'aws-lambda'
import { AdminItem, Item, UserItem } from '../__generated/graphql-types'

export const handler: AppSyncResolverHandler<never, Item | UserItem | AdminItem | null> = async (
  event,
) => {
  console.log('auth example', event)
  switch (event.info.fieldName) {
    case 'getItem':
      return {
        id: 'ALL',
        message: 'visible to all',
        secretMessage: 'visible to admin',
      }
    case 'getUserItem':
      return {
        id: 'USER',
        userMessage: 'user',
      }
    case 'getAdminItem':
      return {
        id: 'ADMIN',
        adminMessage: 'admin',
      }
    default:
      throw Error(`unsupported query: ${event.info.fieldName}`)
  }
}
