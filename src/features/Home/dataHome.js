import {
  processColor
} from 'react-native';
import R from 'assets/R';

export const dataSetsBarChart = [
  {
    values: [12],
    label: 'Huy luong',
    config: {
      drawValues: false,
      colors: [processColor('#A60014')],
    }
  },
  {
    values: [17],
    label: 'Cho ky',
    config: {
      drawValues: false,
      colors: [processColor('#F39C12')],
    }
  },
  {
    values: [23],
    label: 'Chua ky',
    config: {
      drawValues: false,
      colors: [processColor(R.colors.colorMain)],
    }
  },
]
export const valuesTT = [
  { value: 12, label: 'Da duyet' },
  { value: 4, label: 'Chua duyet' },
  { value: 4, label: 'Tu choi' }
]

export const valuesDNTT = [
  { value: 12, label: 'Da duyet' },
  { value: 12, label: 'Chua duyet' },
  { value: 8, label: 'Tu choi' }
]

export const valuesDT = [
  { value: 3, label: 'Da duyet' },
  { value: 1, label: 'Chua duyet' },
  { value: 1, label: 'Tu choi' }
]
export const dataTT = {
  dataSets: [{
    values: valuesTT,
    label: '',
    config: {
      colors: [processColor(R.colors.colorMain), processColor('#F39C12'), processColor('#A60014')],
      drawValues: false,
      sliceSpace: 3,
      selectionShift: 10,
    }
  }],
}
export const dataDNTT = {
  dataSets: [{
    values: valuesDNTT,
    label: '',
    config: {
      colors: [processColor(R.colors.colorMain), processColor('#F39C12'), processColor('#A60014')],
      drawValues: false,
      sliceSpace: 1,
      selectionShift: 0,
    }
  }],
}

export const dataDNCT = [
  { data1: 30, data2: 5, data3: 10 },
  { data1: 10.7, data2: 2, data3: 0 },
  { data1: 15, data2: 0, data3: 2 },
  { data1: 12, data2: 2, data3: 4 },
]
export const dataDNCTMUnit = [
  { data1: 17, data2: 10, data3: 18 },
  { data1: 10.7, data2: 4, data3: 0 },
  { data1: 15, data2: 0, data3: 7 },
  { data1: 12, data2: 2, data3: 10 },
]
export const dataHTHT = [
  { data1: 30, data2: 5, data3: 10 },
  { data1: 10.7, data2: 2, data3: 0 },
  { data1: 15, data2: 0, data3: 2 },
  { data1: 12, data2: 2, data3: 4 },
]
export const dataHTHTUnit = [
  { data1: 17, data2: 10, data3: 18 },
  { data1: 10.7, data2: 4, data3: 0 },
  { data1: 15, data2: 0, data3: 7 },
  { data1: 12, data2: 2, data3: 10 },
]
