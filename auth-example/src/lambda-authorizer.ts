import { AppSyncAuthorizerHander } from 'aws-lambda'

type ResolverContext = { authorizationToken: string; role: string }

export const handler: AppSyncAuthorizerHander<ResolverContext> = async (event) => {
  const { authorizationToken } = event
  console.log(`event >`, JSON.stringify(event, null, 2))

  switch (authorizationToken) {
    case 'user':
      return {
        isAuthorized: true,
        resolverContext: {
          authorizationToken,
          role: 'USER',
        },
        // `arn:aws:appsync:${process.env.AWS_REGION}:${accountId}:apis/${apiId}/types/Event/fields/comments`,
        deniedFields: ['Query.getAdminItem', 'Item.secretMessage'],
        // ttlOverride: 10,
      }
    case 'admin':
      return {
        isAuthorized: true,
        resolverContext: {
          authorizationToken,
          role: 'ADMIN',
        },
      }
    default:
      return {
        isAuthorized: false,
      }
  }
}
