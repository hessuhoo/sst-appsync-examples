import * as lambda from '@aws-cdk/aws-lambda'
import * as cdk from '@aws-cdk/core'
import * as sst from '@serverless-stack/resources'

export default class AppSyncStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props)

    const { account, region, stage, stackName } = this

    console.log('stack initiated', { account, region, stage, stackName })

    const appSyncApi = new sst.AppSyncApi(this, 'appsync-api', {
      defaultFunctionProps: {
        runtime: lambda.Runtime.NODEJS_14_X,
        timeout: cdk.Duration.seconds(10),
        tracing: lambda.Tracing.ACTIVE,
      },
      graphqlApi: {
        xrayEnabled: true,
        schema: ['src/schema.graphql'],
      },
      dataSources: {
        helloLambdaDS: 'src/hello-lambda-ds.handler',
      },
      resolvers: {
        'Query sayHello': 'helloLambdaDS',
      },
    })

    // Show the endpoint in the output

    const output: StackOutput = {
      appSyncApiUrl: appSyncApi.url,
      appSyncApiId: appSyncApi.graphqlApi.apiId,
      appSyncApiKey: appSyncApi.graphqlApi.apiKey || 'not-available',
      appSyncApiArn: appSyncApi.graphqlApi.arn,
      region,
      stackName,
      stage,
    }
    this.addOutputs(output)
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
  region: string
  stackName: string
  stage: string
}
