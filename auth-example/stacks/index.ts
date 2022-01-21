import AppSyncStack from './AppSyncStack'
import * as sst from '@serverless-stack/resources'
import * as lambda from '@aws-cdk/aws-lambda'

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: lambda.Runtime.NODEJS_14_X,
  })

  new AppSyncStack(app, 'appsync-stack')
  // Add more stacks
}
