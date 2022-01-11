import { AppSyncResolverHandler } from 'aws-lambda'

interface Arguments {
  message: string
}
interface Response extends Arguments {
  lambdaMessage: string
}

export const handler: AppSyncResolverHandler<Arguments, Response> = async (event) => {
  console.log('received event', event)
  return {
    message: event.arguments.message,
    lambdaMessage: 'hello from lambda',
  }
}
