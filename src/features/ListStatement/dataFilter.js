import R from 'assets/R';

export const listField = [
  {
    title: 'Loại tờ trình',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.PICKER,
    value: '',
    data: R.strings.local.LOAI_TO_TRINH
  },
  {
    title: 'Người duyệt',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.AUTOCOMPLETESEARCH,
    value: '',
    data: R.strings.local.LOAI_TO_TRINH,
    placeholder: 'Tìm người duyệt',
  },
  {
    title: 'Ngày lập',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.DATEPICKER,
    value: '',
    data: [],
    placeholder: 'Ngày lập tờ trình',
  },
  {
    title: 'Trạng thái duyệt',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.CHECKBOX,
    value: '',
    data: []
  },
]
