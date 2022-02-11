import { AppSyncResolverHandler } from 'aws-lambda'
import { Item } from '../__generated/graphql-types'

export const items = [
  {
    id: 'A',
    message: 'item A',
  },
  {
    id: 'B',
    message: 'item B',
  },
  {
    id: 'C',
    message: 'item C',
  },
]

export const handler: AppSyncResolverHandler<{ id: string }, Item | null> = async (event) => {
  console.log('item', event)
  const item = items.find((i) => i.id === event.arguments.id)
  return item ? { ...item, dateTime: new Date().toISOString() } : null
}

export const list: AppSyncResolverHandler<never, Item[]> = async (event) => {
  console.log('items', event)
  const dateTime = new Date().toISOString()
  return items.map((i) => ({ ...i, dateTime }))
}
