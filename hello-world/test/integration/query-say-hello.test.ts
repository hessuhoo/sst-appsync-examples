import { StackOutputHelper } from '../__helpers/stack-output-helper'
import axios from 'axios'

const QUERY_TEMPLATE = `
        query SayHello($message: String!) {
          sayHello(message: $message) {
            message
            lambdaMessage
          }
        }
      `
describe('Query sayHello', () => {
  describe('success', () => {
    it('when response says hello to you', async () => {
      const { appSyncApiUrl, appSyncApiKey } = StackOutputHelper.getStackOutput()

      const gqlPayload = {
        query: QUERY_TEMPLATE,
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

  describe('unauthorized', () => {
    it('when apikey is invalid', async () => {
      const { appSyncApiUrl } = StackOutputHelper.getStackOutput()

      const gqlPayload = {
        query: QUERY_TEMPLATE,
        variables: {
          message: 'testing',
        },
      }

      await axios
        .post(appSyncApiUrl, gqlPayload, { headers: { 'x-api-key': 'foobar' } })
        .then(() => {
          fail('should never end up here')
        })
        .catch((e) => {
          expect(e.response.status).toStrictEqual(401)
          expect(e.response.data).toStrictEqual({
            errors: [
              {
                errorType: 'UnauthorizedException',
                message: 'You are not authorized to make this call.',
              },
            ],
          })
        })
    })
  })
})
