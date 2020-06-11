import React, { Component } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker'
import R from '../../assets/R';
import { WIDTHXD, HEIGHTXD, getFontXD } from '../../config';
import { showAlert, TYPE } from '../DropdownAlert'
import { FilePickerHelper } from '../../helpers/FilePickerHelper';
import moment from 'moment';


/**
 * Modal to choose attachment, control via ref props
 * Ex: <ModalAttachment ref={ref => this.fileModal = ref} />
 * Then you can call this.fileModal.show() or this.fileModal.dismiss()
 * Set callbacks via props
 *
 * @method show Show modal to choose attachment from camera, photo, file
 * @method dismiss Hide modal
 * @callback onCapturePhoto Callback when capture photo success, params will be images
 * @callback onChoosePhoto Callback when choose photo success, params will be images
 * @callback onChooseFile Callback when choose file success, params will be files
 * @param type Type of file attack
 * @param fileName Name of file attack
 * @param fileSize Size of file attack
 * @param uri path of file attack
 */


const typeFiles = ['.XLS', '.XLSX', '.DOC', '.DOCX', '.PDF', '.PNG', '.JPG', '.BMP']

export default class ModalAttachment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false
    }
  }

  show = () => {
    this.setState({ modalVisible: true });
  }

  dismiss = () => {
    this.setState({ modalVisible: false });
  }

  // to avoid crash app on ios because file name is null, use try catch to return true in this case
  _checkTypeFile = (file) => {
    try {
      let result = false
      if (typeof (file) === 'object' && file.length >= 0) {
        file.map((item, index) => {
          if (typeFiles.includes((file[index].name.substring(file[index].name.indexOf('.'))).toUpperCase())) result = true
          else showAlert(TYPE.WARN, 'Thông báo', 'Định dạng file không hỗ trợ')
        })
      } else {
        let extension = (file.fileName.substring(file.fileName.indexOf('.'))).toUpperCase()
        if (typeFiles.includes(extension)) result = true
        else showAlert(TYPE.WARN, 'Thông báo', 'Định dạng file không hỗ trợ')
      }
      return result
    } catch (error) {
      return true;
    }
  }

  _getOutputFileAttack = (response) => {
    if (!response.didCancel) {
      if (this._checkTypeFile(response)) {
        let data = null
        if (typeof (response) === 'object' && response.length >= 0) {
          data = response.map(item => ({ name: item.name, size: item.size, uri: item.uri, type: item.type }))
        } else {
          data = { name: response.fileName ? response.fileName : `IMAGE_${moment().format('YYYYMMDDHHmmss')}.JPG`, size: response.fileSize, uri: response.uri, type: response.type }
        }
        return data
      }
    }
  }

  _capturePhoto = () => {
    ImagePicker.launchCamera({ noData: true }, (response => {
      const imgRes = this._getOutputFileAttack(response);
      if (!imgRes) return;
      if (response) this.props.onCapturePhoto && this.props.onCapturePhoto(imgRes);
    }))
  }

  _choosePhoto = async () => {
    ImagePicker.launchImageLibrary({ noData: true }, (response) => {
      if (response && response.name !== null) {
      } this.props.onChoosePhoto && this.props.onChoosePhoto(this._getOutputFileAttack(response));
    })
  }

  _chooseFile = async () => {
    if (Platform.OS === 'android') {
      if (this._requestFileManagerPermission()) {
        const response = await this._filePickerManager()
        if (response) this.props.onChooseFile && this.props.onChooseFile(this._getOutputFileAttack(response));
      }
    } else {
      const response = await this._filePickerManager()
      if (response) this.props.onChooseFile && this.props.onChooseFile(this._getOutputFileAttack(response));
    }
  }

  _filePickerManager = async () => {
    const response = await FilePickerHelper()
    return response
  }

  _requestFileManagerPermission = async () => {
    let result = false
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Truy cập File',
          message: 'Phần Mềm Tài chính muốn truy cập vào trong bộ nhớ thiết bị của bạn',
          buttonPositive: 'OK',
          buttonNegative: 'Từ chối'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        result = true
      } else {
        showAlert(TYPE.WARN, 'Thông báo', 'Không thể chọn file')
      }
    } catch (error) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Ứng dụng không có quyền truy cập bộ nhớ')
    }
    return result
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setState({ modalVisible: false })
        }}
      >
        <TouchableWithoutFeedback onPress={() => this.setState({ modalVisible: false })}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{
                paddingHorizontal: WIDTHXD(70),
                paddingTop: HEIGHTXD(50),
                paddingBottom: HEIGHTXD(30),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              >
                <View style={{
                  width: WIDTHXD(33.35)
                }}
                />
                <Text style={styles.modalText}>Chọn nguồn lấy dữ liệu</Text>
                <TouchableOpacity
                  hitSlop={{ top: 20, bottom: 20, left: 50, right: 20 }}
                  onPress={() => this.setState({ modalVisible: false })}
                >
                  <Ionicons
                    name="md-close"
                    size={WIDTHXD(60)}
                    color="#000000aa"
                  />
                </TouchableOpacity>
              </View>
              <View style={{
                borderTopWidth: 1,
                borderTopColor: '#efefef',
                flexDirection: 'row',
                paddingHorizontal: WIDTHXD(70),
                paddingBottom: HEIGHTXD(140),
                paddingTop: HEIGHTXD(60),
                justifyContent: 'space-around'
              }}
              >
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.dismiss();
                    setTimeout(() => this._capturePhoto(), 500);
                  }}
                >
                  <Image
                    source={R.images.img_camera}
                    style={styles.image_button}
                  />
                  <Text style={styles.text_button}>Chụp ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.dismiss();
                    setTimeout(() => this._choosePhoto(), 500);
                  }}
                >
                  <Image
                    source={R.images.img_gallery}
                    style={styles.image_button}
                  />
                  <Text style={styles.text_button}>Thư viện ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.dismiss();
                    setTimeout(() => this._chooseFile(), 500);
                  }}
                >
                  <Image
                    source={R.images.img_file}
                    style={styles.image_button}
                  />
                  <Text style={styles.text_button}>Đính kèm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#00000022',
  },
  modalView: {
    backgroundColor: R.colors.white,
    width: '100%',
    borderRadius: WIDTHXD(50),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  text_modal_filter: {
    color: R.colors.colorNameBottomMenu,
    fontWeight: 'bold',
    fontSize: getFontXD(48),
    textAlign: 'center',
    paddingVertical: HEIGHTXD(60),
    marginTop: HEIGHTXD(10)
  },
  modalText: {
    textAlign: 'center',
    fontSize: getFontXD(48),
    color: R.colors.colorNameBottomMenu,
    fontFamily: R.fonts.RobotoMedium,
    flex: 1
  },
  text_button: {
    fontSize: getFontXD(38),
    color: R.colors.colorNameBottomMenu,
    fontFamily: R.fonts.RobotoRegular,
    marginTop: HEIGHTXD(30),
  },
  image_button: {
    width: WIDTHXD(100),
    height: WIDTHXD(100),
    resizeMode: 'contain'
  }
})
