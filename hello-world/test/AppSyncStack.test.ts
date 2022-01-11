import { expect, haveResource } from '@aws-cdk/assert'
import * as sst from '@serverless-stack/resources'
import AppSyncStack from '../stacks/AppSyncStack'

test('Test Stack', () => {
  const app = new sst.App()
  // WHEN
  const stack = new AppSyncStack(app, 'test-stack')
  // THEN
  expect(stack).to(haveResource('AWS::Lambda::Function'))
})
