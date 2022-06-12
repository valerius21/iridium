import { resolve } from 'path'

const r = (path: string) => resolve(__dirname, path)

export const alias: Record<string, string> = {
  '~': r('app'),
  '~/': r('./app'),
}
