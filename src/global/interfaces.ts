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

export interface IPieChartConfig {
  apiEndpoint: string,
  title: string,
  description?: string,
  options: IPieChartOptions
}