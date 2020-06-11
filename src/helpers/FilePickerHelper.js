import DocumentPicker from 'react-native-document-picker';
import { popupOk } from '../config';
/**
 * This function to help you pick file from your devices
 * and return array files picked ed: [{path...},{path...}]
 */
export const FilePickerHelper = async () => {
  try {
    const results = await DocumentPicker.pickMultiple({
      type: [DocumentPicker.types.allFiles],
    });
    return results
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else {
      popupOk('Thông báo', 'Lỗi không thể chọn file')
    }
    return null
  }
}
