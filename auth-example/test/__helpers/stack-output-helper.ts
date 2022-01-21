import { readFileSync } from 'fs'
import { StackOutput } from '../../stacks/AppSyncStack'

export interface DevStageConfig<T> {
  [stageName: string]: T
}

const configDirPath = './__generated'

interface StackOutputFileContent {
  [stageSame: string]: StackOutput
}

const parseStackOutput = <T>(filePath: string): T => {
  try {
    const outputContent = readFileSync(filePath).toString('utf-8')
    const rawConfig = JSON.parse(outputContent) as StackOutputFileContent
    const stageName = Object.keys(rawConfig)[0]
    return {
      ...rawConfig[stageName],
    } as unknown as T
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Cannot read stack output')
    throw e
  }
}

const getStackOutput = (): StackOutput => {
  return parseStackOutput(`${configDirPath}/stack-output.json`)
}

export const StackOutputHelper = { getStackOutput }
