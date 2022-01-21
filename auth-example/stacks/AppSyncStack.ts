import * as sst from '@serverless-stack/resources'
import * as appsync from '@aws-cdk/aws-appsync'
import * as iam from '@aws-cdk/aws-iam'
import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import { Duration } from '@aws-cdk/core'

export default class AppsyncAuthExampleStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props)

    const { account, region, stage, stackName } = this
    console.log('stack initiated', { account, region, stage, stackName })

    const lambdaAuthorizer = new sst.Function(this, 'lambda-authorizer', {
      handler: `src/lambda-authorizer.handler`,
      runtime: lambda.Runtime.NODEJS_14_X,
    })
    lambdaAuthorizer.addPermission('appsync-invoke-function', {
      action: 'lambda:InvokeFunction',
      principal: new iam.ServicePrincipal('appsync.amazonaws.com'),
    })

    const appSyncApi = new sst.AppSyncApi(this, 'appsync-api', {
      defaultFunctionProps: {
        runtime: lambda.Runtime.NODEJS_14_X,
        timeout: cdk.Duration.seconds(10),
        tracing: lambda.Tracing.ACTIVE,
      },
      graphqlApi: {
        xrayEnabled: true,
        schema: ['src/schema.graphql'],
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              expires: cdk.Expiration.after(cdk.Duration.days(365)),
            },
          },
          additionalAuthorizationModes: [
            {
              authorizationType: appsync.AuthorizationType.LAMBDA,
              lambdaAuthorizerConfig: {
                handler: lambdaAuthorizer,
                resultsCacheTtl: Duration.seconds(0),
              },
            },
          ],
        },
      },
      dataSources: {
        itemDS: 'src/item-ds.handler',
      },
      resolvers: {
        'Query getItem': 'itemDS',
        'Query getUserItem': 'itemDS',
        'Query getAdminItem': 'itemDS',
      },
    })

    const output: StackOutput = {
      appSyncApiUrl: appSyncApi.url,
      appSyncApiId: appSyncApi.graphqlApi.apiId,
      appSyncApiKey: appSyncApi.graphqlApi.apiKey || 'not-available',
      appSyncApiArn: appSyncApi.graphqlApi.arn,
      lambdaAuthorizerArn: lambdaAuthorizer.functionArn,
      lambdaAuthorizerFunctionName: lambdaAuthorizer.functionName,
      region,
      stackName,
      stage,
    }
    this.addOutputs(output)
    // Show the endpoint in the output
  }
}

type outputs = {
  [key: string]: string | cdk.CfnOutputProps
}

export interface StackOutput extends outputs {
  appSyncApiUrl: string
  appSyncApiId: string
  appSyncApiKey: string
  appSyncApiArn: string
  lambdaAuthorizerArn: string
  lambdaAuthorizerFunctionName: string
  region: string
  stackName: string
  stage: string
}
