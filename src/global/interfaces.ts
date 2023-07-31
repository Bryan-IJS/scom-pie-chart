export interface IPieChartOptions {
  xColumn?: string,
  yColumn?: string,
  serieName?: string,
  legend?: {
    show?: boolean,
    scroll?: boolean,
    position?: 'top' | 'bottom' | 'left' | 'right' // top, bottom: horizontal -- left, right: vertical
  },
  showDataLabels?: boolean,
  numberFormat?: string,
  valuesOptions?: {
    name: string,
    color: string
  }[]
}

export enum ModeType {
  LIVE = 'Live',
  SNAPSHOT = 'Snapshot'
}

export interface IPieChartConfig {
  apiEndpoint: string,
  title: string,
  description?: string,
  options: IPieChartOptions,
  file?: {
    cid?: string,
    name?: string
  },
  mode?: ModeType
}