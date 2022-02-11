import { AppSyncResolverHandler } from 'aws-lambda'
import { Person, QueryGetPersonByIdArgs } from '../__generated/graphql-types'

const persons = [
  { id: 'aku', name: 'Aku' },
  { id: 'tupu', name: 'Tupu', parentId: 'aku' },
  { id: 'hupu', name: 'Hupu', parentId: 'aku' },
  { id: 'lupu', name: 'Lupu', parentId: 'aku' },

  { id: 'al', name: 'Al' },
  { id: 'bud', name: 'Bud', parentId: 'al' },
  { id: 'kelly', name: 'Kelly', parentId: 'al' },

  { id: 'mikki', name: 'Mikki', friendId: 'hessu' },
  { id: 'hessu', name: 'Hessu', friendId: 'mikki' },
]

export const handler: AppSyncResolverHandler<QueryGetPersonByIdArgs, Person | null> = async (
  event,
) => {
  const { request, ...rest } = event
  console.log('parent', { ...rest })
  const person = persons.find((p) => p.id === event.arguments.id)
  return person ? { ...person, dateTime: new Date().toISOString() } : null
}

export const kids: AppSyncResolverHandler<Record<string, string>, Person[]> = async (event) => {
  const { request, ...rest } = event
  console.log('kids', { ...rest })
  const dateTime = new Date().toISOString()
  return persons
    .filter((p) => p.parentId === event?.source?.id)
    .map((p) => ({
      ...p,
      dateTime,
    }))
}

export const friend: AppSyncResolverHandler<QueryGetPersonByIdArgs, Person | null> = async (
  event,
) => {
  const { request, ...rest } = event
  console.log('friend', { ...rest })
  const person = persons.find((p) => p.id === event?.source?.friendId)
  return person ? { ...person, dateTime: new Date().toISOString() } : null
}
