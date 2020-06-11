import React, { Component } from 'react';
import {
  View, Text, Modal, StyleSheet, TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback, PermissionsAndroid, Platform
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import XLSX from 'xlsx';
import * as RNFS from 'react-native-fs'
import FileViewer from 'react-native-file-viewer';
import { getFont, HEIGHT, WIDTH, popupOk } from '../../config';
import R from '../../assets/R';
import colors from '../../assets/colors';

/**
 * @method setModalVisible Show popup to save and open file
 */
class SaveToXlsx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      loading: false,
      saved: false
    };
  }

  /**
   * This function to show popup and save data to xlsx file
   *@param visible To show popup
   *@param data Array data to save
   *@param fileName Name of file want to save without extinction (eg: Tailieu, BaoCao)
   *
   */
  setModalVisible = async (visible, data, fileName) => {
    this.setState({
      modalVisible: visible, saved: false
    })
    this.data = data;
    this.fileName = fileName;
    this.today = new Date();
    this.date = `${this.today.getDate()}-${this.today.getMonth() + 1}|${this.today.getHours()}-${this.today.getMinutes()}-${this.today.getSeconds()}`;
    this.path = ''
  }

  saveToXLSX = () => {
    this.setState({ loading: true })
    this.path = `${RNFS.DocumentDirectoryPath}/${this.fileName}|${this.date}.xlsx`;
    let ws = XLSX.utils.json_to_sheet(this.data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let str = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    this.requestStoragePermission(this.path, str)
  }


  requestStoragePermission = async (path, str) => {
    try {
      if (Platform.OS === 'ios') this.onExportFile(path, str);
      else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.onExportFile(path, str);
        } else {
          this.setState({ saved: false, loading: false })
          return false
        }
      }
    } catch (err) {
    }
  }

  onExportFile = async (path, str) => {
    let isExist = await RNFS.exists(path);
    if (!isExist) {
      await RNFS.writeFile(path, str, 'base64')
        .then(() => {
          this.setState({ saved: true, loading: false })
        })
        .catch(() => {
          this.setState({ saved: false, loading: false })
          popupOk('Lỗi', `Không thể lưu file ${this.fileName}.xlsx!`)
        });
    }
  };

  onViewInExcel = (path) => {
    FileViewer.open(path)
      .then(() => {
      })
      .catch(error => {
        console.warn(error)
        popupOk('Thông báo', 'Thiết bị của bạn cần phải cài đặt ứng dụng đọc file excel.');
      })
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => this.setModalVisible(false, '', '')}
      >
        <TouchableWithoutFeedback
          onPress={() => { this.setModalVisible(false, '', '') }}
        >
          <View
            style={styles.opacity}
          >
            <TouchableWithoutFeedback>
              {!this.state.saved ? (
                <View style={styles.modal}>
                  <View style={styles.header}>
                    <View />
                    <Text style={{ fontSize: getFont(18), fontFamily: 'Roboto', fontWeight: 'bold' }}>Lưu dưới dạng Excel</Text>
                    <TouchableOpacity
                      onPress={() => this.setModalVisible(false, '', '')}
                    >
                      <AntDesign name="closecircleo" size={WIDTH(23)} color={R.colors.colorTextDetail} />
                    </TouchableOpacity>
                  </View>
                  {!this.state.loading ? (
                    <>
                      <TouchableOpacity
                        onPress={() => this.saveToXLSX()}
                        style={{ borderWidth: 1, borderRadius: WIDTH(5), borderColor: R.colors.lightBlueB4, alignItems: 'center', padding: WIDTH(10), marginTop: HEIGHT(15) }}
                      >
                        <FontAwesome name="save" size={WIDTH(50)} color={R.colors.lightBlueB4} />
                      </TouchableOpacity>
                      <Text style={{ marginTop: HEIGHT(5), fontSize: getFont(14) }}>{`Lưu tệp ${this.fileName}.xlsx`}</Text>
                    </>
                  )
                    : (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator color="#1C1C1C" animating size="large" />
                        <Text style={{ marginTop: HEIGHT(5), fontSize: getFont(14) }}>Đang lưu tệp</Text>
                      </View>
                    )}

                </View>
              )
                : (
                  <View style={styles.modal}>
                    <View style={styles.header}>
                      <View />
                      <Text style={{ fontSize: getFont(18), fontFamily: 'Roboto', fontWeight: 'bold' }}>Lưu thành công</Text>
                      <TouchableOpacity
                        onPress={() => this.setModalVisible(false, '', '')}
                      >
                        <AntDesign name="closecircleo" size={WIDTH(23)} color={R.colors.colorTextDetail} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => this.onViewInExcel(this.path)}
                      style={{ borderWidth: 1, borderRadius: WIDTH(5), borderColor: R.colors.lightBlueB4, alignItems: 'center', padding: WIDTH(10), marginTop: HEIGHT(15) }}
                    >
                      <AntDesign name="exclefile1" size={WIDTH(50)} color={R.colors.lightBlueB4} />
                    </TouchableOpacity>
                    <Text style={{ marginTop: HEIGHT(5), fontSize: getFont(14) }}>{`Mở tệp ${this.fileName}.xlsx`}</Text>
                  </View>
                )

              }
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default SaveToXlsx;
const styles = StyleSheet.create({
  loadingContainer: {
    elevation: 3,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: WIDTH(355),
    paddingLeft: WIDTH(38),
    paddingHorizontal: WIDTH(15),
    paddingVertical: HEIGHT(5)

  },
  opacity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#rgba(0,0,0,0.7)'
  },
  modal: {
    backgroundColor: R.colors.white100,
    width: WIDTH(355),
    borderRadius: WIDTH(10),
    paddingTop: HEIGHT(16),
    // height: HEIGHT(528),
    paddingBottom: HEIGHT(14),
    alignItems: 'center',
    paddingHorizontal: WIDTH(12)
  },
  body: {
    width: WIDTH(331)
  },
  inputBox: {
    width: WIDTH(331),
    paddingVertical: HEIGHT(8),
    borderRadius: HEIGHT(8),
    paddingHorizontal: WIDTH(14),
    height: HEIGHT(48),
    fontSize: getFont(16),
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D3DEE8',
  },
  buttonLogin: {
    width: WIDTH(251),
    paddingVertical: HEIGHT(14),
    backgroundColor: colors.colorMain,
    borderRadius: HEIGHT(8),
    marginTop: HEIGHT(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  kiemtra: {
    fontSize: getFont(16),
    color: '#828282',
    textAlign: 'center',
    marginTop: HEIGHT(14)
  },
  textBtnTao: {
    fontWeight: '500',
    color: colors.white,
    fontSize: getFont(16),
    textAlign: 'center'
  },
  title: {
    color: '#1B1A1A',
    fontSize: getFont(16),
    fontWeight: 'bold',
    marginBottom: HEIGHT(8),
    marginTop: HEIGHT(12)
  },
  textBtn: {
    fontWeight: '500',
    color: colors.colorMain,
    fontSize: getFont(15),
    marginRight: WIDTH(11)
  },
});
