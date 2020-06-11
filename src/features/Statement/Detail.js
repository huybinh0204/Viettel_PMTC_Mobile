import React, { PureComponent } from 'react'
import {
  Text, View, TouchableOpacity, StyleSheet, LayoutAnimation, ScrollView,
  FlatList, TouchableWithoutFeedback, Modal, TextInput, Image,
} from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto';
import RnFetchBlob from 'rn-fetch-blob'
import FastImage from 'react-native-fast-image';
import axios from 'axios'
import FormData from 'form-data'
import LinearGradient from 'react-native-linear-gradient';
import PDF from 'react-native-pdf'
import { CheckBox } from 'native-base'
import IconClose from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash'
import { FilePickerHelper } from '../../helpers/FilePickerHelper';
import R from '../../assets/R'
// import ModalSearch from '../../common/Modal';
import ModalSearch from '../AdvanceRequest/common/Modal';
import AutoCompleteModal from './ItemViews/AutoCompleteModal';
import ButtonAdd from '../../common/Button/ButtonAdd';
import { WIDTHXD, HEIGHTXD, getFontXD, getWidth, WIDTH } from '../../config/Function'
import ModalPrint from '../../common/PrintedVotes/index'
import NavigationService from '../../routers/NavigationService'

const menu = [
  { title: 'Chọn phiếu in khác', image: require('../../assets/images/attack/attack.png') },
  { title: 'Đính kèm', image: require('../../assets/images/attack/attack.png') },
  { title: 'Chọn người ký', image: require('../../assets/images/attack/people.png') },
  { title: 'Trình ký', image: require('../../assets/images/attack/submission.png') },
]

export default class SubmissonProcess extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      expandedAttack: false,
      expandedApproval: false,
      listApproval: [{}],
      listAttack: [{}],
      showMenu: false,
      visible: false,
      indexMenu: 0,
      titleModal: '',
      signers: [{ cOfficestaffId: '', signerName: '', organizationid: '', organizationName: '', signature: false, promulgate: false }],
      reRender: false,
      showIconEye: false,
      nameFile: 'demo0506.pdf'
    }
  }

  componentDidMount() {
  }

  changeLayoutAttack = () => {
    LayoutAnimation.configureNext(
      {
        duration: 500,
        create: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.scaleY,
          springDamping: 1.7,
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 1.7,
        },
      }
    );
    this.setState({ expandedAttack: !this.state.expandedAttack });
  }

  changeLayoutApproval = () => {
    LayoutAnimation.configureNext(
      {
        duration: 500,
        create: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.scaleY,
          springDamping: 1.7,
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 1.7,
        },
      }
    );
    this.setState({ expandedApproval: !this.state.expandedApproval });
  }

  _onPressItemMenu = (index) => {
    switch (index) {
      case 0:
        this._refModalPrint.setModalVisible(true)
        break;
      case 1:
        this._attackFile()
        break
      case 2:
        this.setState({ visible: true, titleModal: 'Chọn người ký' })
        break
      case 3:
        this.setState({ visible: true, titleModal: 'Nhập mật khẩu SSO' })
        break
      default:
        break
    }
    this.setState({ indexMenu: index })
  }

  _accept = () => {

  }

  _addSigner = () => {
    let signers = [...this.state.signers]
    const newSigner = { cOfficestaffId: '', signerName: '', organizationid: '', organizationName: '', signature: false, promulgate: false }
    signers.push(newSigner)
    this.setState({ signers })
  }

  _attackFile = async () => {
    const response = await FilePickerHelper()
  }

  _pressIconEye = () => {
    this.setState({ showIconEye: !this.state.showIconEye })
  }

  _renderModal = () => {
    const signers = [...this.state.signers]
    if (this.state.indexMenu === 3) {
      return (
        <View>
          <View style={{ marginBottom: HEIGHTXD(48) }}>
            <Text style={styles.label}>Tên đăng nhập</Text>
            <TextInput
              style={styles.textInput}
            />
          </View>
          <View style={{ marginBottom: HEIGHTXD(60) }}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.textInput}
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity>
            <Text style={styles.txtAccept}>ĐỒNG Ý (CO)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: HEIGHTXD(48) }}>
            <Text style={styles.txtToSubmission}>Đi đến cửa sổ Trình ký</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={{ paddingBottom: HEIGHTXD(78) }}>
          <FlatList
            data={this.state.signers}
            style={{ maxHeight: this.state.signers.length > 1 ? HEIGHTXD(1250) : HEIGHTXD(630) }}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
            renderItem={({ item, index }) => {
              return (
                <View style={{ marginBottom: HEIGHTXD(90) }}>
                  <View style={styles.flexCol}>
                    <Text style={styles.label}>Người ký {index + 1}</Text>
                    <ModalSearch
                      buttonShowModal={{ width: WIDTHXD(910) }}
                      value={signers[index].signerName}
                      id={null}
                      title="Chọn người ký"
                      keyApi="signer"
                      onValueChange={obj => {
                        signers[index].signerName = obj.name
                        signers[index].cOfficestaffId = obj.id
                        this.setState({ signers })
                      }}
                    />
                  </View>
                  <View style={[styles.flexCol, { marginTop: HEIGHTXD(54) }]}>
                    <Text style={styles.label}>Vai trò</Text>
                    <ModalSearch
                      buttonShowModal={{ width: WIDTHXD(910) }}
                      value={signers[index].organizationName}
                      id={signers[index].cOfficestaffId}
                      title="Vai trò"
                      keyApi="roleSigner"
                      onValueChange={obj => {
                        signers[index].organizationid = obj.id
                        signers[index].organizationName = obj.name
                        this.setState({ signers })
                      }}
                    />
                  </View>
                  <View style={styles.rowCheckBox}>
                    <View style={styles.ctnCheckbox}>
                      <CheckBox
                        checked={true}
                        size={WIDTH(30)}
                        color={R.colors.colorNameBottomMenu}
                        style={{ borderRadius: HEIGHTXD(18), marginLeft: -WIDTHXD(24) }}
                      />
                      <Text style={[styles.labelCheckbox, { marginLeft: WIDTHXD(56), color: R.colors.black0 }]}>Hiển thị chữ ký</Text>
                    </View>
                    <View style={[styles.ctnCheckbox, { marginLeft: WIDTHXD(156) }]}>
                      <CheckBox
                        checked={true}
                        size={WIDTH(30)}
                        color={R.colors.colorNameBottomMenu}
                        style={{ borderRadius: HEIGHTXD(18) }}
                      />
                      <Text style={[styles.labelCheckbox, { marginLeft: WIDTHXD(56), color: R.colors.black0 }]}>Ban hành</Text>
                    </View>
                  </View>
                </View>
              )
            }}
          />
          <View style={[styles.ctnCheckbox]}>
            <CheckBox
              checked={true}
              size={WIDTH(30)}
              color={R.colors.colorNameBottomMenu}
              style={{ borderRadius: HEIGHTXD(18), marginLeft: -WIDTHXD(24) }}
            />
            <Text style={[styles.labelCheckbox, { marginLeft: WIDTHXD(56), color: R.colors.black0 }]}>Trình ký song song</Text>
          </View>
          <TouchableOpacity
            onPress={() => this._addSigner()}
            style={{ marginTop: HEIGHTXD(88) }}>
            <Text style={styles.txtAddSigner}>Thêm người ký</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: HEIGHTXD(58) }}>
            <Text style={styles.txtAccept}>ĐỒNG Ý</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  onPickFile = async () => {
    let res = await FilePickerHelper()
    const formData = new FormData()
    const image = res[0]
    formData.append('attachments', image)
    axios.post(encodeURI('http://222.252.22.174:8080/erp-service/adAttachmentServiceRest/attachFile/1000077/926/1/21774/21774'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => console.log('RESPONSE UPLOAID', response)).catch(err => console.log('ERROR UPLOAD FILE"', err))
  }

  _downloadFile = async () => {
    // const url = encodeURI('http://222.252.22.174:8080/erp-service/adAttachmentServiceRest/downloadFile?condition={"filename": "9419974b-55fe-49f4-9966-b8ebda1751bc.pdf", "folder": "/u01/app/erp_test_buid/tomcat_8081/temp/2020/5/5"}')
    const url = encodeURI('http://10.10.20.163:8080/erp-service/reportStarterServiceRest/reportStarter/exportHtml?AD_Process_ID=10153&reportName=PhuLucDeXuatKinhPhi')
    const { fs } = RnFetchBlob
    RnFetchBlob.config({
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: 'Download',
        description: 'Downloaded',
        path: fs.dirs.DownloadDir.concat('/').concat(this.state.nameFile),
      },
      path: fs.dirs.DocumentDir.concat('/').concat(this.state.nameFile),
      appendExt: 'pdf',
      fileCache: true,
    }).fetch('GET', url)
      .then((res) => {
        console.log('DOWNLOAD SUCCESS---', res.path())
        this.setState({ reRender: !this.state.reRender })
      })
      .catch((err) => {
        console.log('error download file:', err)
      })
  }

  render() {
    const { expandedAttack, expandedApproval, listApproval, listAttack, showMenu, titleModal, indexMenu, showIconEye } = this.state
    const url = { uri: encodeURI('http://222.252.22.174:8080/erp-service/adAttachmentServiceRest/downloadFile?condition={"filename": "9419974b-55fe-49f4-9966-b8ebda1751bc.pdf", "folder": "/u01/app/erp_test_buid/tomcat_8081/temp/2020/5/5"}') }
    const url2 = { uri: encodeURI('http://222.252.22.174:8080/erp-service/reportStarterServiceRest/reportStarter/exportPdf?AD_Process_ID=10153&reportName=PhuLucDeXuatKinhPhi&AD_User_ID=21447&REPORT_MODE=2&RECORD_ID=63146') }
    const dataItem = this.props.navigation.getParam('dataItem');
    // const url2 = { uri: encodeURI('http://222.252.22.174:8080/erp-service/reportStarterServiceRest/reportStarter/exportPdf?AD_Process_ID=10153&reportName=PhuLucDeXuatKinhPhi') }
    // const source3 = { uri: Platform.OS === 'android' ? `file:/storage/emulated/0/Download/${this.state.nameFile}` : 'file:/storage/emulated/0/documents/testConvert.pdf' }
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0062E1', '#0268E3', '#0B7BE9', '#1899F4', '#22AEFB']}
          style={{ height: HEIGHTXD(200), justifyContent: 'center' }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() => NavigationService.pop()}
              style={styles.btHeader}
            >
              <Fontisto name="angle-left" size={WIDTHXD(46)} color={R.colors.white} />
              <Text style={styles.txtHeader}>{dataItem && dataItem.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
              onPress={() => this._pressIconEye()}
            >
              <Image
                source={showIconEye ? R.images.openEye : R.images.iconEyeHide}
                style={styles.imageEye}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={[styles.viewTop, { flex: (_.isEmpty(listApproval) && _.isEmpty(listAttack)) ? 1 : 6 }]}>
          <PDF
            source={url2}
            style={{ flex: 1 }}
            onError={(error) => {
              console.log('ERROROR---', error);
            }}
          />
        </View>
        {!_.isEmpty(listApproval) || !_.isEmpty(listAttack)
          ? <ScrollView
            style={{
              paddingHorizontal: WIDTHXD(30),
              paddingVertical: HEIGHTXD(20),
              width: '100%',
              maxHeight: (expandedApproval && expandedAttack)
                ? HEIGHTXD(700)
                : ((expandedAttack || expandedApproval)
                  ? HEIGHTXD(380)
                  : (!_.isEmpty(listApproval) && !_.isEmpty(listAttack)
                    ? HEIGHTXD(250) : HEIGHTXD(140)))
            }}>
            {!_.isEmpty(listAttack)
              ? <View>
                <TouchableOpacity style={styles.btAttack} onPress={() => this.changeLayoutAttack()}>
                  <View style={styles.rowAttack}>
                    <Text style={styles.mainText}>Tệp đính kèm</Text>
                    <Text style={[styles.mainText, { marginLeft: WIDTHXD(8) }]}>1</Text>
                  </View>
                  {expandedAttack && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                  {!expandedAttack && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                </TouchableOpacity>
                {
                  expandedAttack
                  && (
                    <FlatList
                      scrollEnabled={false}
                      data={listAttack}
                      keyExtractor={(item, index) => index.toString()}
                      extraData={this.state}
                      renderItem={({ item }) => (
                        <TouchableOpacity style={styles.btMainText}>
                          <FastImage source={R.strings.fileTypeIcon[1].icon} style={styles.icon} resizeMode={FastImage.resizeMode.stretch} />
                          <Text style={styles.txtMainText}>Mẫu 1: Chuyển tiền theo hợp đồng .pdf</Text>
                        </TouchableOpacity>
                      )
                      }
                    />
                  )
                }
              </View> : null}
            {!_.isEmpty(listApproval)
              ? <View>
                <TouchableOpacity style={styles.btAttack} onPress={() => this.changeLayoutApproval()}>
                  <Text style={[styles.mainText, { marginBottom: WIDTHXD(32) }]}>Danh sách ký duyệt</Text>
                  {expandedApproval && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                  {!expandedApproval && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                </TouchableOpacity>
                {
                  expandedApproval
                  && (
                    <FlatList
                      scrollEnabled={false}
                      data={listApproval}
                      keyExtractor={(item, index) => index.toString()}
                      extraData={this.state}
                      renderItem={({ item }) => (
                        <TouchableOpacity style={styles.btApproval}>
                          <View style={styles.rowApproval}>
                            <View style={styles.ctnImage}>
                              <FastImage
                                source={require('../../assets/images/category/iconPeople.png')}
                                style={styles.imageAvt}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                            </View>
                            <View style={styles.colApproval}>
                              <Text style={styles.content}>Nguyen Van An</Text>
                              <Text style={styles.title}>Trưởng Ban Công Nghệ Thông Tin- Khối cơ quan Tập Đoàn</Text>
                            </View>
                          </View>
                          <Text style={styles.status}>Đã kí duyệt</Text>
                        </TouchableOpacity>
                      )
                      }
                    />
                  )
                }
              </View>
              : null}
          </ScrollView> : null}
        {
          showMenu
            ? <FlatList
              data={menu}
              style={styles.menu}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => this._onPressItemMenu(index)}
                    style={styles.row}>
                    <View style={styles.ctnTextmenu}>
                      <Text style={styles.titleMenu}>{item.title}</Text>
                    </View>
                    <FastImage
                      source={item.image}
                      style={styles.iconMenu}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </TouchableOpacity>
                )
              }}
            />
            : null
        }
        <ModalPrint ref={ref => { this._refModalPrint = ref }} accept={this._accept} />
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => this.setState({ showModalChild: false, visible: false })}
        >
          <View style={{ flex: 1, alignItems: 'center' }}>
            <TouchableWithoutFeedback
              onPress={() => { this.setState({ showModalChild: false, visible: false }) }}
            >
              <View
                style={styles.opacity}
              >
                <TouchableWithoutFeedback>
                  <View style={[styles.modal, { width: indexMenu === 3 ? WIDTHXD(800) : WIDTHXD(1014) }]}>
                    <View style={[styles.viewTitle, { width: indexMenu === 3 ? WIDTHXD(800) : WIDTHXD(1014) }]}>
                      <View style={styles.viewEmpty}></View>
                      <Text style={styles.titlePopup}>{titleModal}</Text>
                      <TouchableOpacity onPress={() => this.setState({ showModalChild: false, visible: false })} style={styles.btClose}>
                        <IconClose name="close" size={WIDTHXD(48)} color={R.colors.black0} />
                      </TouchableOpacity>
                    </View>
                    {this._renderModal()}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
        <ButtonAdd
          onButton={() => this.setState({ showMenu: !this.state.showMenu })}
          bottom={HEIGHTXD(150)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexBasis: 100,
    backgroundColor: R.colors.blueGrey51
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  menu: {
    position: 'absolute',
    right: WIDTHXD(70),
    bottom: Platform.OS === 'ios' ? HEIGHTXD(320) : HEIGHTXD(340),
  },
  viewTop: {
    backgroundColor: R.colors.white,
    marginTop: WIDTHXD(24)
  },
  btApproval: {
    backgroundColor: R.colors.white,
    borderRadius: WIDTHXD(20),
    paddingHorizontal: WIDTHXD(42),
    paddingVertical: WIDTHXD(18),
    marginBottom: WIDTHXD(24)
  },
  status: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.colorStatusSubmisson,
    alignSelf: 'flex-end'
  },
  imageAvt: {
    width: WIDTHXD(120),
    height: HEIGHTXD(120),
  },
  ctnImage: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  rowApproval: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colApproval: {
    flex: 5,
    marginRight: WIDTHXD(32),
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  btAttack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: WIDTHXD(48)
  },
  rowAttack: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ctnContent: {
    paddingTop: WIDTHXD(20),
    paddingBottom: WIDTHXD(48),
    borderBottomColor: R.colors.borderE6,
    borderBottomWidth: WIDTHXD(1),
    paddingHorizontal: WIDTHXD(36),
    justifyContent: 'space-around'
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777
  },
  content: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    marginTop: WIDTHXD(8)
  },
  viewBottom: {
    paddingHorizontal: WIDTHXD(36),
    backgroundColor: R.colors.blueGrey51
  },
  ctnMainText: {
    marginTop: WIDTHXD(48)
  },
  btMainText: {
    flexDirection: 'row',
    paddingVertical: WIDTHXD(36),
    paddingHorizontal: WIDTHXD(30),
    backgroundColor: R.colors.white,
    borderRadius: WIDTHXD(20),
    marginTop: WIDTHXD(20),
  },
  mainText: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.color777
  },
  icon: {
    width: WIDTHXD(55),
    height: HEIGHTXD(68)
  },
  iconMenu: {
    width: WIDTHXD(130),
    height: WIDTHXD(130)
  },
  titleMenu: {
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoMedium,
    color: R.colors.colorNameBottomMenu,
  },
  ctnTextmenu: {
    backgroundColor: R.colors.white,
    borderWidth: 0,
    borderRadius: WIDTHXD(8),
    paddingHorizontal: WIDTHXD(4),
    marginRight: WIDTHXD(32)
  },
  txtMainText: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    marginLeft: WIDTHXD(18)
  },
  opacity: {
    flex: 1,
    width: getWidth(),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#rgba(0,0,0,0.3)',
    paddingHorizontal: WIDTHXD(56)
  },
  modal: {
    backgroundColor: R.colors.white100,
    alignItems: 'center',
    width: WIDTHXD(1014),
    borderRadius: WIDTHXD(20),
    paddingBottom: HEIGHTXD(78),
    paddingTop: HEIGHTXD(12)
  },
  viewTitle: {
    flexDirection: 'row',
    width: WIDTHXD(1014),
    paddingVertical: HEIGHTXD(50),
  },
  btClose: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titlePopup: {
    fontSize: getFontXD(48),
    color: R.colors.colorMain,
    fontFamily: R.fonts.RobotoMedium,
    flex: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label,
    marginBottom: HEIGHTXD(8)
  },
  textInput: {
    width: WIDTHXD(695),
    height: HEIGHTXD(100),
    borderRadius: WIDTHXD(20),
    borderWidth: 0.3,
    borderColor: R.colors.border,
    padding: 0,
    paddingHorizontal: WIDTHXD(24),
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0
  },
  txtAccept: {
    textAlign: 'center',
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(48),
    color: R.colors.colorNameBottomMenu
  },
  txtToSubmission: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoItalic,
    color: R.colors.black0,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  ctnCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelCheckbox: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    marginVertical: HEIGHTXD(13),
    color: R.colors.color777,
  },
  rowCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: HEIGHTXD(30)
  },
  txtAddSigner: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.black0,
    textAlign: 'center'
  },
  btHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: WIDTHXD(84)
  },
  txtHeader: {
    fontSize: getFontXD(54),
    fontFamily: R.fonts.RobotoMedium,
    color: R.colors.white,
    marginLeft: WIDTHXD(68)
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: WIDTHXD(24)
  },
  imageEye: {
    height: HEIGHTXD(45.3),
    width: WIDTHXD(73),
    marginRight: WIDTHXD(24)
  },
})
