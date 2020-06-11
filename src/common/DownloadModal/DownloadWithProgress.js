import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, PermissionsAndroid, Platform } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import RNFetchBlob from 'rn-fetch-blob'
import FileViewer from 'react-native-file-viewer';
import { getFont, HEIGHT, WIDTH, popupOk } from '../../config/Function';
import R from '../../assets/R';
import colors from '../../assets/colors';

/**
 *@method setModalVisible To show popUp and download
 */
class DownloadWithProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      loading: false,
      downloaded: false
    };
    this.url = '';
    this.fileName = 'fileName';
    this.fileExt = 'fileExt';
  }

  /**
   * this function to download file with url, filenam, file extinction
  * @param {boolean} visible To set modal visible
  * @param {string} url Url to dowload
  * @param {string} fileName Name of file dowload
  * @param {string} fileExt Extinction of file (pdf, docx, xlsx)
  */
  setModalVisible = async (visible, url, fileName, fileExt) => {
    /**
     * Modal support dowload file from server
     */
    this.setState({
      modalVisible: visible
    })
    this.url = url;
    this.fileName = fileName;
    this.fileExt = fileExt;
  }


  requestPermission = async () => {
    try {
      if (Platform.OS === 'ios') this.downloadFile(this.url, this.fileName, this.fileExt)
      else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'Vietel needs access to your storage to download File.'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.downloadFile(this.url, this.fileName, this.fileExt)
        } else this.setState({ downloaded: true, loading: false });
      }
    } catch (err) {
      // console.warn(err)
    }
  }

  openFile = (path: string) => {
    FileViewer.open(path)
      .then(() => {
      })
      .catch(() => {
        popupOk('Thông báo', 'Thiết bị của bạn không thể đọc file.');
      })
  }

  downloadFile = (url, fileName, fileExt) => {
    this.setState({ loading: true })
    const { config } = RNFetchBlob;
    let { dirs } = RNFetchBlob.fs
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${dirs.DownloadDir}/${fileName}.${fileExt}`,
      }
    }

    if (url === null || url === undefined) {
      popupOk('Thông báo', 'Không thể mở URL');
    } else {
      config(options).fetch('GET', url).then(() => {
        this.setState({ downloaded: true, loading: false })
      });
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => this.setModalVisible(false, '', '', '')}
      >
        <TouchableWithoutFeedback
          onPress={() => { this.setModalVisible(false, '', '', '') }}
        >
          <View
            style={styles.opacity}
          >
            <TouchableWithoutFeedback>
              {!this.state.downloaded ? (
                <View style={styles.modal}>
                  <View style={styles.header}>
                    <View />
                    <Text style={{ fontSize: getFont(18), fontFamily: 'Roboto', fontWeight: 'bold' }}>Tải xuống</Text>
                    <TouchableOpacity
                      onPress={() => this.setModalVisible(false, '', '', '')}
                    >
                      <AntDesign name="closecircleo" size={WIDTH(23)} color={R.colors.colorTextDetail} />
                    </TouchableOpacity>
                  </View>
                  {!this.state.loading ? (
                    <>
                      <TouchableOpacity
                        onPress={() => this.requestPermission()}
                        style={{ borderWidth: 1, borderRadius: WIDTH(5), borderColor: R.colors.lightBlueB4, alignItems: 'center', padding: WIDTH(10), marginTop: HEIGHT(15) }}
                      >
                        <Entypo name="download" size={WIDTH(50)} color={R.colors.lightBlueB4} />
                      </TouchableOpacity>
                      <Text style={{ marginTop: HEIGHT(5), fontSize: getFont(14) }}>{`Tải tệp ${this.fileName}.${this.fileExt} về máy`}</Text>
                    </>
                  )
                    : (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator color="#1C1C1C" animating size="large" />
                        <Text style={{ marginTop: HEIGHT(5), fontSize: getFont(14) }}>Đang tải về máy</Text>
                      </View>
                    )}

                </View>
              )
                : (
                  <View style={styles.modal}>
                    <View style={styles.header}>
                      <View />
                      <Text style={{ fontSize: getFont(18), fontFamily: 'Roboto', fontWeight: 'bold' }}>Tải thành công</Text>
                      <TouchableOpacity
                        onPress={() => this.setModalVisible(false, '', '', '')}
                      >
                        <AntDesign name="closecircleo" size={WIDTH(23)} color={R.colors.colorTextDetail} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => this.openFile(`${RNFetchBlob.fs.dirs.DownloadDir}/${this.fileName}.${this.fileExt}`)}
                      style={{ borderWidth: 1, borderRadius: WIDTH(5), borderColor: R.colors.lightBlueB4, alignItems: 'center', padding: WIDTH(10), marginTop: HEIGHT(15) }}
                    >
                      <AntDesign name="filetext1" size={WIDTH(50)} color={R.colors.lightBlueB4} />
                    </TouchableOpacity>
                    <Text style={{ marginTop: HEIGHT(5), fontSize: getFont(14) }}>{`Mở tệp ${this.fileName}.${this.fileExt}`}</Text>
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

export default DownloadWithProgress;
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
