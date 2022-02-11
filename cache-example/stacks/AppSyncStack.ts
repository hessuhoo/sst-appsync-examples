import * as cdk from '@aws-cdk/core'

import * as sst from '@serverless-stack/resources'
import * as appsync from '@aws-cdk/aws-appsync'
import * as lambda from '@aws-cdk/aws-lambda'

export default class AppsyncCacheExampleStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props)

    // -> deploy appSyncApi & apiCache first then deploy resolvers that uses api caching
    const appSyncApi = new sst.AppSyncApi(this, 'CacheExampleAppSyncApi', {
      graphqlApi: {
        xrayEnabled: true,
        schema: 'src/schema.graphql',
      },
      defaultFunctionProps: {
        runtime: lambda.Runtime.NODEJS_14_X,
        timeout: cdk.Duration.seconds(10),
      },
      dataSources: {
        itemDS: 'src/item-ds.handler',
        itemsDS: 'src/item-ds.list',
        personDS: 'src/person-ds.handler',
        personKidsDS: 'src/person-ds.kids',
        personFriendDS: 'src/person-ds.friend',
      },
      resolvers: {
        'Query getPersonById': 'personDS',
      },
    })

    const apiId = appSyncApi.graphqlApi.apiId
    const ttl = cdk.Duration.seconds(30).toSeconds()

    const apiCache = new appsync.CfnApiCache(this, 'api-cache', {
      apiCachingBehavior: 'PER_RESOLVER_CACHING',
      apiId,
      ttl,
      type: 'SMALL',
      // the properties below are optional
      atRestEncryptionEnabled: false,
      transitEncryptionEnabled: false,
    })

    console.log('->', { apiId })

    const queryGetItemByIdResolver = new appsync.CfnResolver(
      this,
      'query-get-item-by-id-resolver',
      {
        apiId,
        fieldName: 'getItemById',
        typeName: 'Query',
        cachingConfig: {
          cachingKeys: ['$context.args.id'],
          ttl,
        },
        dataSourceName: appSyncApi.getDataSource('itemDS')?.name,
        kind: 'UNIT',
      },
    )
    queryGetItemByIdResolver.node.addDependency(apiCache, appSyncApi.graphqlApi)

    const listItemsResolver = new appsync.CfnResolver(this, 'query-list-items-resolver', {
      apiId,
      fieldName: 'listItems',
      typeName: 'Query',
      cachingConfig: {
        ttl,
      },
      dataSourceName: appSyncApi.getDataSource('itemsDS')?.name,
      kind: 'UNIT',
    })
    listItemsResolver.node.addDependency(apiCache, appSyncApi.graphqlApi)

    // Nested resolvers
    const personKidsResolver = new appsync.CfnResolver(this, 'person-kids-resolver', {
      apiId,
      fieldName: 'kids',
      typeName: 'Person',
      cachingConfig: {
        cachingKeys: ['$context.source.id'], // parent.id
        ttl: cdk.Duration.seconds(120).toSeconds(),
      },
      dataSourceName: appSyncApi.getDataSource('personKidsDS')?.name,
      kind: 'UNIT',
    })
    personKidsResolver.node.addDependency(apiCache, appSyncApi.graphqlApi)

    const personFriendResolver = new appsync.CfnResolver(this, 'person-friend-resolver', {
      apiId,
      fieldName: 'friend',
      typeName: 'Person',
      cachingConfig: {
        cachingKeys: ['$context.source.id', '$context.source.friendId'],
        ttl: cdk.Duration.seconds(120).toSeconds(),
      },
      dataSourceName: appSyncApi.getDataSource('personFriendDS')?.name,
      kind: 'UNIT',
    })
    personFriendResolver.node.addDependency(apiCache, appSyncApi.graphqlApi)

    // Show the endpoint in the output
    this.addOutputs({
      appSyncApiUrl: appSyncApi.url,
    })
  }
}
