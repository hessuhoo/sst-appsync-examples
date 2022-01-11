import { StackOutputHelper } from '../__helpers/stack-output-helper'
import axios from 'axios'

describe('Query sayHello', () => {
  it('should receive hello message', async () => {
    const { appSyncApiUrl, appSyncApiKey } = StackOutputHelper.getStackOutput()

    const gqlPayload = {
      query: `
        query SayHello($message: String!) {
          sayHello(message: $message) {
            message
            lambdaMessage
          }
        }
      `,
      variables: {
        message: 'testing',
      },
    }

    const response = await axios
      .post(appSyncApiUrl, gqlPayload, { headers: { 'x-api-key': appSyncApiKey } })
      .then(({ data }) => data.data.sayHello)

    expect(response).toStrictEqual({ lambdaMessage: 'hello from lambda', message: 'testing' })
  })
})
