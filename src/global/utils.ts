import { DataSource } from "@scom/scom-chart-data-source-setup";
import { BigNumber } from '@ijstech/eth-wallet';
import { IFormatNumberOptions, IFetchDataOptions } from "./interfaces";

export const formatNumber = (num: number, options?: { format?: string, decimals?: number, percentValues?: boolean }) => {
  if (num === null) return '-';
  const { decimals, format, percentValues } = options || {};
  if (percentValues) {
    return `${formatNumberWithSeparators(num, { precision: 2 })}%`;
  }
  if (format) {
    return formatNumberByFormat(num, format);
  }
  const absNum = Math.abs(num);
  if (absNum >= 1000000000) {
    return formatNumberWithSeparators((num / 1000000000), { precision: decimals || 3 }) + 'B';
  }
  if (absNum >= 1000000) {
    return formatNumberWithSeparators((num / 1000000), { precision: decimals || 3 }) + 'M';
  }
  if (absNum >= 1000) {
    return formatNumberWithSeparators((num / 1000), { precision: decimals || 3 }) + 'K';
  }
  if (absNum < 0.0000001) {
    return formatNumberWithSeparators(num, { precision: 0 });
  }
  if (absNum < 0.00001) {
    return formatNumberWithSeparators(num, { precision: 6 });
  }
  if (absNum < 0.001) {
    return formatNumberWithSeparators(num, { precision: 4 });
  }
  if (absNum < 1) {
    return formatNumberWithSeparators(num, { precision: 4 });
  }
  return formatNumberWithSeparators(num, { precision: 2 });
}

export const formatNumberByFormat = (num: number, format: string, separators?: boolean) => {
  if (!format) return formatNumberWithSeparators(num, { precision: 0 });
  const decimalPlaces = format.split('.')[1] ? format.split('.')[1].length : 0;
  if (format.includes('%')) {
    return formatNumberWithSeparators((num * 100), { precision: decimalPlaces }) + '%';
  }
  const currencySymbol = format.indexOf('$') !== -1 ? '$' : '';
  const roundedNum = formatNumberWithSeparators(num, { precision: decimalPlaces });
  if (separators || !(format.includes('m') || format.includes('a'))) {
    return format.indexOf('$') === 0 ? `${currencySymbol}${roundedNum}` : `${roundedNum}${currencySymbol}`;
  }
  const parts = roundedNum.split('.');
  const decimalPart = parts.length > 1 ? parts[1] : '';
  const integerPart = formatNumber(parseInt(parts[0].replace(/,/g, '')), { decimals: decimalPart.length });
  return `${currencySymbol}${integerPart}`;
}

export const formatNumberWithSeparators = (value: number | string | BigNumber, options: IFormatNumberOptions): string => {
  let bigValue: BigNumber;
  if (value instanceof BigNumber) {
    bigValue = value;
  }
  else {
    bigValue = new BigNumber(value);
  }

  if (bigValue.isNaN() || !bigValue.isFinite()) {
    return '0';
  }

  if (options.precision || options.precision === 0) {
    let outputStr = '';
    if (bigValue.gte(1)) {
      outputStr = bigValue.toFormat(options.precision, options.roundingMode || BigNumber.ROUND_HALF_CEIL);
    }
    else {
      outputStr = bigValue.toNumber().toLocaleString('en-US', { maximumSignificantDigits: options.precision || 2 });
    }
    if (outputStr.length > 18) {
      outputStr = outputStr.substring(0, 18) + '...';
    }
    return outputStr;
  }

  return bigValue.toFormat();
}

export const callAPI = async (options: IFetchDataOptions) => {
  if (!options.dataSource) return [];
  try {
    let apiEndpoint = '';
    switch (options.dataSource) {
      case DataSource.Dune:
        apiEndpoint = `/dune/query/${options.queryId}`;
        break;
      case DataSource.Custom:
        apiEndpoint = options.apiEndpoint;
        break;
    }
    if (!apiEndpoint) return [];
    const response = await fetch(apiEndpoint);
    const jsonData = await response.json();
    return jsonData.result.rows || [];
  } catch { }
  return [];
}