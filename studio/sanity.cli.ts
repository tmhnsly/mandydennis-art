import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'jcjfnkhz',
    dataset: 'production'
  },
  deployment: {
    appId: 'gkcg3b5x3582sxcz44dgmr7b',
    autoUpdates: true,
  }
})
