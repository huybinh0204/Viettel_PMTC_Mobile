import React, { Component } from 'react'
import {
  Text, View, TouchableOpacity, StyleSheet, LayoutAnimation, ScrollView, Dimensions, Animated,
  FlatList, TouchableWithoutFeedback, Modal, TextInput, Image, SafeAreaView, Platform
} from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto';
import RnFetchBlob from 'rn-fetch-blob'
import FastImage from 'react-native-fast-image';
import { CheckBox } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import PDF from 'react-native-pdf'
import { connect } from 'react-redux'
import IconClose from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash'
import R from '../../../assets/R'
import ModalSearch from '../../AdvanceRequest/common/Modal';
import ButtonAdd from '../../../common/Button/ButtonAdd';
import { WIDTHXD, HEIGHTXD, getFontXD, getWidth, WIDTH, convertTypeFile } from '../../../config/Function'
import ModalPrintInvoiceGroup from './index'
import ModalPrintStatement from '../../../common/PrintedStatement/index'
import NavigationService from '../../../routers/NavigationService'
import { showAlert, TYPE } from '../../../common/DropdownAlert'
import FlatListSwipe from '../../../common/Swipe/FlatListSwipe';
import ItemAttachment from '../AddApInvoiceGroupStatement/Attack/Items/Item';
import ModalAttachment from '../../../common/FilePicker/ModalAttachment'
import FormData from 'form-data'
import global from '../global'
import { TABLE_INVOICE_GROUP_ID, TABLE_DOCUMENT_SIGN_ID, TABLE_STATEMENT_ID_2 } from '../../../config/constants'
import { showLoading, hideLoading } from '../../../common/Loading/LoadingModal'
import { NetworkSetting } from '../../../config/Setting';
import ApInvoiceGroupStatement from '../../../apis/Functions/apInvoiceGroupStatement'
import VOfficeRequest from '../../../apis/Functions/vOffice'
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios'




const menu = [
  { title: 'Chọn phiếu in khác', image: require('../../../assets/images/attack/print.png') },
  { title: 'Đính kèm', image: require('../../../assets/images/attack/attack.png') },
  { title: 'Chọn người ký', image: require('../../../assets/images/attack/people.png') },
  { title: 'Trình ký', image: require('../../../assets/images/attack/submission.png') },
]

class DetailAttack extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expandedAttack: false,
      expandedApproval: false,
      expandedMenu: false,
      listApproval: [],
      listAttack: [],
      showMenu: false,
      visible: false,
      indexMenu: 0,
      titleModal: '',
      signers: [{ cOfficestaffId: '', signerName: '', organizationid: '', organizationName: '', signature: false, promulgate: false }],
      listSigner: [],
      reRender: false,
      parallelSigner: false,
      showIconEye: false,
      isError: false,
      url: '',
      dataAttackFile: {},
      animated: new Animated.Value(0),
      isCo: false,
      userName: '',
      password: '',
      title: '',
      fileName: '',
      attachmentFileSign: {},
      vOfficeInfo: {},
      printFile: {},
      cDocumentsignId: null,
      dateAcct: '',
      isViewDocumentSign: false,
      adTableId: null
    }
  }

  componentDidMount() {
    if (this.props.isViewDocumentSign) {
      if (this.props.adTableId === TABLE_STATEMENT_ID_2) {
        global.DOCUMENT_TYPE_ID = 1
      }
      this.setState({ adTableId: this.props.adTableId, cDocumentsignId: this.props.cDocumentSignId, isViewDocumentSign: true, isCo: true }, () => {
        this._refreshData()
      })
    } else {
      if (this.props.navigation.state.params.adTableId === TABLE_STATEMENT_ID_2) {
        global.DOCUMENT_TYPE_ID = 1
      }
      this.setState({
        adTableId: this.props.navigation.state.params.adTableId,
      })
      this._downloadFile(this.props.navigation.state.params.url, this.props.navigation.state.params.title, this.props.navigation.state.params.fileName)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cDocumentSignId !== this.props.cDocumentSignId) {
      this.setState({ cDocumentsignId: nextProps.cDocumentSignId, isViewDocumentSign: true }, () => {
        this._refreshData()
      })
    }
  }

  _refreshData = () => {
    this._getAttachList()
    this._getSignerList()
  }
  /**
   * get attach of document sign
   */
  _getAttachList = async () => {
    const response = await VOfficeRequest.getAttachList(this.state.cDocumentsignId);
    if (response && response.status === 200) {
      let attachList = this.state.listAttack
      _.forEach(response.data, item => {
        if (item.isFileSign && item.isFileSign === "Y") {
          let url = `http://222.252.22.174:8080/erp-service/adAttachmentServiceRest/downloadFile?condition={"filename":"${item.title}","folder":"${item.folder}"}`;
          this.setState({ url: url, isError: false })
          this.props.onUpdateTitle && this.props.onUpdateTitle(item.filename)
        } else {
          let attachItem = {
            name: item.filename,
            title: item.title,
            folder: item.folder,
          }
          attachList.push(attachItem)
        }
      })
      this.setState({ listAttack: attachList })
    }
  }
  /**
   * get signer list of document sign
   */
  _getSignerList = async () => {
    const response = await VOfficeRequest.getSignerList(this.state.cDocumentsignId);
    if (response && response.status === 200) {
      let signerList = this.state.listSigner
      _.forEach(response.data, item => {
        let signer = {
          cOfficestaffId: item.cSignerId,
          signerName: item.cSignerName,
          organizationid: item.cOfficepositionId,
          organizationName: item.rolename,
          signature: item.signimage === "Y" ? true : false,
          promulgate: item.ispublished === "Y" ? true : false,
        }
        signerList.push(signer)

      })
      this.setState({ listSigner: signerList })
    }
  }
  _downloadFile = (url, title, fileName) => {
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'pdf'
    }).fetch('GET', encodeURI(url))
      .then((res) => {
        // let dataAttackFile = this.state.listAttack
        // let item = {
        //   isFileSign: true,
        //   type: 'pdf',
        //   name: fileName,
        //   uri: Platform.OS === 'android' ? 'file://' + res.path()  : '' + res.path()
        // }

        let item = {
          isFileSign: true,
          type: "application/pdf",
          name: fileName,
          uri: Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path()
        }

        // dataAttackFile.push(item)
        if (this.state.cDocumentsignId) {
          this.setState({ attachmentFileSign: res, printFile: item }, () => {
            this._updateSignFile(url, title, fileName)
          })
        } else {
          this.setState({ attachmentFileSign: res, printFile: item, url, title, fileName, isError: false })
        }
      })
      .catch((err) => {
      })
  }

  // _downloadFile = (url) => {
  //   const url = encodeURI(NetworkSetting.ROOT.concat(`/erp-service/adAttachmentServiceRest/downloadFile?condition={"filename": "${item.title}", "folder": "${item.folder}"}`));

  //   const downloadAndView = () => RNFetchBlob.config({
  //     addAndroidDownloads: {
  //       useDownloadManager: true,
  //       notification: true,
  //       title: 'Download',
  //       description: 'Download file đính kèm',
  //       path: RNFetchBlob.fs.dirs.DownloadDir.concat('/').concat(item.filename),
  //     },
  //     path: RNFetchBlob.fs.dirs.DocumentDir.concat('/').concat(item.filename),
  //     fileCache: true,
  //   }).fetch('GET', url)
  //     .then((res) => {
  //       showAlert(TYPE.SUCCESS, 'Thông báo', 'Tải file thành công')
  //       if (Platform.OS === 'ios') {
  //         RNFetchBlob.ios.openDocument(res.path())
  //       } else {
  //         RNFetchBlob.android.actionViewIntent(res.path())
  //       }
  //     })
  //     .catch((err) => {
  //       showAlert(TYPE.ERROR, 'Thông báo', 'Tải file thất bại')
  //     })

  //     if (Platform.OS === 'android') {
  //       requestStoragePermission(()=>downloadAndView());
  //     } else {
  //       downloadAndView()
  //     }
  // }
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

  _onPressMenu = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      create: {
        type: LayoutAnimation.Types.easeOut,
        property: LayoutAnimation.Properties.scaleY
      },
      update: {
        type: LayoutAnimation.Types.easeOut,
        property: LayoutAnimation.Properties.scaleY
      }
    })
    this.setState({ expandedMenu: !this.state.expandedMenu })
  }

  _onPressItemMenu = (index) => {
    switch (index) {
      case 0:
        if (this.state.adTableId === TABLE_INVOICE_GROUP_ID) {
          this._refModalPrintInvoiceGroup.setModalVisible(true)
        } else {
          this._refModalPrintStatement.setModalVisible(true)
        }
        break;
      case 1:
        this._attackFile()
        break
      case 2:
        this.setState({ visible: true, titleModal: 'Chọn người ký' })
        break
      case 3:
        if (this.state.listSigner.length > 0) {
          this.setState({ visible: true, titleModal: 'Nhập mật khẩu SSO' })
        } else {
          showAlert(TYPE.ERROR, 'Thông báo', 'Bạn phải chọn người ký trước khi trình ký')
        }
        break
      default:
        break
    }
    this.setState({ indexMenu: index, expandedMenu: false })
  }

  _accept = (url, title, fileName) => {
    this._downloadFile(url, title, fileName)
  }

  _addSigner = () => {
    let signers = [...this.state.signers]
    const newSigner = { cOfficestaffId: '', signerName: '', organizationid: '', organizationName: '', signature: false, promulgate: false, delete: true }
    signers.push(newSigner)
    this.setState({ signers })
  }

  _addSignerToList = (signers) => {
    let listSigner = [...this.state.listSigner]
    if (!this._checkEmpty(signers)) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng điền đầy đủ thông tin người ký ')
    } else {
      if (listSigner.length === 0) {
        listSigner = signers
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Thêm người ký thành công')
        this.setState({ listSigner, visible: false })
      } else {
        if (signers.length > listSigner.length) {
          if (!this._checkEmpty(signers)) {
            showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng điền đầy đủ thông tin người ký ')
          } else {
            for (let i = listSigner.length; i < signers.length; i++) {
              listSigner.push(signers[i])
            }
            showAlert(TYPE.SUCCESS, 'Thông báo', 'Thêm người ký thành công')
            this.setState({ listSigner, visible: false })
          }
        } else {
          showAlert(TYPE.WARN, 'Thông báo', 'Người ký đã được thêm')
        }
      }
    }
  }

  _checkEmpty = (signers) => {
    let result = false
    _.forEach(signers, item => {
      if (item.signerName === '' || item.organizationName === '') result = false
      else result = true
    })
    return result
  }


  _attackFile = () => {
    this._refModalAttackment.show()
  }

  _onChooseFile = (res) => {
    if (res) {
      const listAttack = [...this.state.listAttack]
      if (typeof (res) === 'object' && res.length >= 0) {
        res.map(item => {
          item.isFileSign = false
          listAttack.push(item)
        })
      } else {
        listAttack.push(res)
      }
      showAlert(TYPE.SUCCESS, 'Thông báo', 'Đính kèm file thành công')
      this.setState({ listAttack })
    }
  }

  _renderIconExtensionFile = (item) => {
    let iconFile = ''
    let extension = item.name.substring(item.name.indexOf('.') + 1)
    if (['jpg', 'png', 'bmp'].includes(extension)) {
      iconFile = R.strings.fileTypeIcon[3].icon
    } else if (['xls', 'xlsx'].includes(extension)) {
      iconFile = R.strings.fileTypeIcon[1].icon
    } else if (['doc', 'docx'].includes(extension)) {
      iconFile = R.strings.fileTypeIcon[0].icon
    } else if (['pdf'].includes(extension)) {
      iconFile = R.strings.fileTypeIcon[2].icon
    }
    return iconFile
  }

  _onPressFileAttack = item => {
    let extension = item.name.substring(item.name.indexOf('.') + 1)
    if (['jpg', 'png', 'bmp', 'pdf'].includes(extension)) {
      NavigationService.navigate('ViewFileAttack', item)
    } else {
      if (Platform.OS === 'android') {
        RnFetchBlob.android.actionViewIntent(item.uri)
      } else {
        RnFetchBlob.ios.openDocument(item.uri)
      }
    }
  }

  _onDelAttackFile = async (indexs, indexDel) => {
    let listAttack = [...this.state.listAttack];
    if (this.state.cDocumentsignId) {
      showLoading()
      const response = await VOfficeRequest.delSignerFile(listAttack[index].cattachmentinfoId);
      if (response && response.status === 200) {
        listAttack.splice(indexDel, 1);
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Xoá file đính kèm thành công');
        this.setState({ listAttack });
      }
    } else {
      listAttack.splice(indexDel, 1);
      showAlert(TYPE.SUCCESS, 'Thông báo', 'Xoá file đính kèm thành công');
      this.setState({ listAttack });
    }
  };

  _renderAttackmenInfo() {
    return <PDF
      source={{ uri: encodeURI(this.state.url), cache: false }}
      style={{ flex: 1 }}
      onError={(err) => {
        this.setState({ isError: true })
      }}

    />;
  }

  _pressIconEye = () => {
    this.setState({ showIconEye: !this.state.showIconEye })
  }

  _deleteSigner = async (index) => {
    let { signers, listSigner } = this.state
    if (this.state.cDocumentsignId) {
      showLoading()
      const response = await VOfficeRequest.delSigner(signers[index].cOfficestaffId);
      if (response && response.status === 200) {
        signers.splice(index, 1)
        listSigner.splice(index, 1)
        this.setState({ signers, listSigner, visible: false })
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Xóa người ký thành công')
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Xóa người ký không thành công')
      }
    } else {
      signers.splice(index, 1)
      listSigner.splice(index, 1)
      this.setState({ signers, listSigner, visible: false })
      showAlert(TYPE.SUCCESS, 'Thông báo', 'Xóa người ký thành công')
    }
  }

  _randomName = (fileName, length) => {
    let result = fileName;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.concat('.pdf');
  }

  /**
   * create vOffice
   */
  _createPrint = async () => {
    showLoading()
    const formData = new FormData()
    const isParallelSign = this.state.parallelSigner ? 'Y' : 'N'
    const cSignerIdLst = []
    _.forEach(this.state.signers, item => {
      cSignerIdLst.push({ cOfficepositionId: item.organizationid, cSignerId: item.cOfficestaffId, signimage: item.signature ? "Y" : "N", ispublished: item.promulgate ? "Y" : "N" })
    })

    if (this.state.printFile.isFileSign) {
      formData.append('attachmentFileSign', this.state.printFile)
    }

    _.forEach(this.state.listAttack, item => {
      if (item.isFileSign && item.isFileSign === true) {
        formData.append('attachmentFileSign', item)
      } else {
        formData.append('attachments', item)
      }
    })
    let res = null;
    const url = NetworkSetting.ROOT.concat(`/erp-service-mobile/cDocumentsignServiceRest/attachFile/${global.DOCUMENT_TYPE_ID}/${this.props.adUserId}/${this.props.adUserId}/${this.state.fileName}/${this.state.adTableId}/${this.props.navigation.state.params.id}/${this.state.password}/?isParallelSign=${isParallelSign}&cSignerIdLst=${JSON.stringify(cSignerIdLst)}`)
    console.log('url', url)
    try {
      res = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } catch (error) {
      console.log('ERROR---', error)
      //
    }
    hideLoading()
    console.log('RES-----', res)
    console.log('')
    if (res && res.status === 200) {
      this.setState({
        cDocumentsignId: res.data.cDocumentsignId,
        dateAcct: res.data.dateacct
      })
      this.props.navigation.state.params.setDocumentSignId(res.data.cDocumentSignId)
    }
    return res
  }

  /**
   * update sign file of vOffice
   */
  _updateSignFile = async (url, title, fileName) => {
    showLoading()
    const formData = new FormData()
    if (this.state.printFile.isFileSign) {
      formData.append('attachmentFileSign', this.state.printFile)
    }
    let res = null;
    const urlRequest = NetworkSetting.ROOT.concat(`/erp-service-mobile/cDocumentsignServiceRest/cDocumentsign/addFileSignY/${this.state.cDocumentsignId}`)
    try {
      res = await axios.post(urlRequest, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } catch (error) {
      console.log('ERROR---', error)
      //
    }
    hideLoading()
    if (res && res.status === 200) {
      showAlert(TYPE.SUCCESS, 'Thông báo', 'Đổi phiếu in thành công')
      this.setState({ url, title, fileName, isError: false })
    } else {
      showAlert(TYPE.ERROR, 'Thông báo', 'Đổi phiếu in không thành công')
    }
  }
  /**
   * CO vOffice after created
   */
  _coPrint = async () => {
    let cDocumentsignId
    if (this.state.cDocumentsignId) {
      cDocumentsignId = this.state.cDocumentsignId
    } else {
      const response = await this._createPrint()
      if (response && response.status === 200) {
        cDocumentsignId = response.data.cDocumentsignId
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Đã có lỗi xảy ra')
      }
    }
    if (cDocumentsignId) {
      const body = {
        ad_table_id: TABLE_DOCUMENT_SIGN_ID,
        record_id: cDocumentsignId,
        ad_org_id: this.props.adOrgId,
        updatedby: this.props.adUserId
      }
      const resVoffice = await ApInvoiceGroupStatement.coVoffice(body)
      console.log('RESPONSE voffice---', resVoffice)
      if (resVoffice && resVoffice.data.returnMessage) {
        showAlert(TYPE.WARN, 'Thông báo', resVoffice.data.returnMessage)
      } else {
        showAlert(TYPE.SUCCESS, 'Thông báo', 'CO phiếu in thành công')
        this.setState({
          isCo: true,
          vOfficeInfo: resVoffice.data
        })
      }
    }
  }
  /**
   * ra print
   */
  _raPrint = async () => {
    const body = {
      ad_table_id: TABLE_DOCUMENT_SIGN_ID,
      record_id: this.state.cDocumentsignId,
      ad_org_id: this.props.adOrgId,
      updatedby: this.props.adUserId,
      dateAcct: this.state.dateAcct,
      ad_window_id: 1000000
    }
    try {
      const response = await ApInvoiceGroupStatement.raVoffice(body)
      console.log('RESPONSE RA PRINT', response)
      if (response && response.status === 200) {
        if (!response.data.returnMessage) {
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Hủy hoàn thành phiếu in thành công')
          this.setState({ isCo: false })
        } else {
          showAlert(TYPE.ERROR, 'Thông báo', response.data.returnMessage)
        }

      }
    } catch (error) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Hủy hoàn thành phiếu in thất bại')
    }
  }

  _addSignersVoffice = async (idVoffice, signers) => {
    showLoading()
    const promise = []
    _.forEach(signers, itemSigner => {
      promise.push(vOffice.createSigners({ employeeId: itemSigner.cOfficestaffId }))
    })
    Promise
      .all(promise)
      .then(res => {
        _.forEach(res, itemRes => {
          if (itemRes.status === 200) {
            NavigationService.navigate('CreateVOffice', { cDocumentsignId: idVoffice, refreshData: () => { } })
          } else {
            showAlert(TYPE.WARN, 'Thông báo', 'Có lỗi xảy ra')
          }
        })
      })
      .catch(err => {
      })
      .finally(() => hideLoading())
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
              value={this.state.userName}
              onChangeText={userName => this.setState({ userName })}
            />
          </View>
          <View style={{ marginBottom: HEIGHTXD(60) }}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.textInput}
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
          </View>
          <TouchableOpacity onPress={() => this.setState({ visible: false }, () => this._coPrint())}>
            <Text style={styles.txtAccept}>ĐỒNG Ý (CO)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: HEIGHTXD(48) }}
            onPress={async () => {
              if (this.state.cDocumentsignId) {
                this.setState({ visible: false }, () => {
                  NavigationService.navigate('CreateVOffice', { cDocumentsignId: this.state.cDocumentsignId, refreshData: () => { this._refreshData() } })
                })
              } else {
                const response = await this._createPrint()
                if (response && response.status === 200) {
                  this.setState({ visible: false }, () => {
                    NavigationService.navigate('CreateVOffice', { cDocumentsignId: response.data.cDocumentsignId, refreshData: () => { this._refreshData() } })
                  })
                } else {
                  showAlert(TYPE.ERROR, 'Thông báo', 'Có lỗi xảy ra')
                }
              }
            }
            }
          >
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={[styles.label, { marginBottom: HEIGHTXD(32) }]}>Người ký {index + 1}</Text>
                      {item.delete
                        ? <TouchableOpacity onPress={() => this._deleteSigner(index)}>
                          <Text style={styles.txtDelete}>Xoá</Text>
                        </TouchableOpacity>
                        : null}
                    </View>
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
                        onPress={() => {
                          item.signature = !item.signature
                          this.setState({ signers })
                        }}
                        checked={item.signature}
                        size={WIDTH(30)}
                        color={R.colors.colorNameBottomMenu}
                        style={{ borderRadius: HEIGHTXD(18), marginLeft: -WIDTHXD(24) }}
                      />
                      <Text style={[styles.labelCheckbox, { marginLeft: WIDTHXD(56), color: R.colors.black0 }]}>Hiển thị chữ ký</Text>
                    </View>
                    <View style={[styles.ctnCheckbox, { marginLeft: WIDTHXD(156) }]}>
                      <CheckBox
                        onPress={() => {
                          item.promulgate = !item.promulgate
                          this.setState({ signers })
                        }}
                        checked={item.promulgate}
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
              onPress={() => this.setState({ parallelSigner: !this.state.parallelSigner })}
              checked={this.state.parallelSigner}
              size={WIDTH(30)}
              color={R.colors.colorNameBottomMenu}
              style={{ borderRadius: HEIGHTXD(18), marginLeft: -WIDTHXD(24) }}
            />
            <Text style={[styles.labelCheckbox, { marginLeft: WIDTHXD(56), color: R.colors.black0 }]}>Trình ký song song</Text>
          </View>
          <TouchableOpacity
            onPress={() => this._addSigner()}
            style={{ marginTop: HEIGHTXD(88) }}
          >
            <Text style={styles.txtAddSigner}>Thêm người ký</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: HEIGHTXD(58) }} onPress={() => this._addSignerToList(signers)}>
            <Text style={styles.txtAccept}>ĐỒNG Ý</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }


  render() {
    const { expandedAttack, expandedApproval, listApproval, listAttack, titleModal, indexMenu, showIconEye, signers, listSigner, title } = this.state
    return (
      <SafeAreaView style={styles.container}>
        {this.state.isViewDocumentSign ?
          null :
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
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.txtHeader}
                >
                  {title}
                </Text>
              </TouchableOpacity>
              {
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

              }

            </View>
          </LinearGradient>
        }
        <View style={[styles.viewTop, { flex: (_.isEmpty(listApproval) && _.isEmpty(listAttack)) ? 1 : 6 }]}>
          {this.state.isError === true
            ? <Text style={styles.txtError}>File đính kèm bị lỗi</Text>
            : this._renderAttackmenInfo()}
        </View>
        {((!_.isEmpty(listSigner) || !_.isEmpty(listAttack)))
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
                    <Text style={styles.mainText}>{`Tệp đính kèm (${listAttack.length})`}</Text>
                  </View>
                  {expandedAttack && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                  {!expandedAttack && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                </TouchableOpacity>
                {
                  expandedAttack
                  && (
                    <View>
                      {this.state.isCo ?
                        <FlatList
                          data={listAttack}
                          renderItem={({ item, index }) => {
                            return <ItemAttachment
                              pressItemAttack={() => {
                                this._onPressFileAttack(item)
                              }}
                              filename={item.name}
                              index={index}
                              type={convertTypeFile(item.name)}
                            />
                          }}
                        />
                        :
                        < FlatListSwipe
                          data={listAttack}
                          renderItem={({ item, index }) => {
                            return <ItemAttachment
                              pressItemAttack={() => {
                                this._onPressFileAttack(item)
                              }}
                              filename={item.name}
                              index={index}
                              type={convertTypeFile(item.name)}
                              onPressIcon={this._onDelAttackFile}
                              isFileSign={item.isFileSign}
                            />
                          }}
                          onPressIcon={(indexOfIcon, indexOfItem, adAttachmentId) => {
                            this._onDelAttackFile(indexOfIcon, indexOfItem, adAttachmentId);
                          }}
                          listIcons={[R.images.iconDelete]}
                          widthListIcon={WIDTHXD(360)}
                          rightOfList={WIDTHXD(70)}
                          styleOfIcon={{}}
                        />
                      }
                    </View>
                  )
                }
              </View> : null}
            {!_.isEmpty(listSigner)
              ? <View style={{ marginTop: HEIGHTXD(54), marginBottom: HEIGHTXD(30) }}>
                <TouchableOpacity style={styles.btAttack} onPress={() => this.changeLayoutApproval()}>
                  <Text style={[styles.mainText, { marginBottom: HEIGHTXD(40), marginBottom: HEIGHTXD(40) }]}>Danh sách ký duyệt</Text>
                  {expandedApproval && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                  {!expandedApproval && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                </TouchableOpacity>
                {
                  expandedApproval
                  && (
                    <FlatList
                      scrollEnabled={false}
                      data={listSigner}
                      keyExtractor={(item, index) => index.toString()}
                      extraData={this.state}
                      renderItem={({ item }) => (
                        <TouchableOpacity style={styles.btApproval}>
                          <View style={styles.rowApproval}>
                            <View style={styles.ctnImage}>
                              <FastImage
                                source={require('../../../assets/images/category/iconPeople.png')}
                                style={styles.imageAvt}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                            </View>
                            <View style={styles.colApproval}>
                              <Text style={styles.content}>{item.signerName}</Text>
                              <Text style={[styles.title, { marginTop: HEIGHTXD(25) }]}>{item.organizationName}</Text>
                            </View>
                          </View>
                          <Text style={styles.status}>Chưa ký</Text>
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
          this.state.expandedMenu
          && <FlatList
            scrollEnabled={false}
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
        }
        <ModalPrintInvoiceGroup ref={ref => { this._refModalPrintInvoiceGroup = ref }} accept={this._accept} />
        <ModalPrintStatement ref={ref => { this._refModalPrintStatement = ref }} accept={this._accept} />
        <ModalAttachment
          onCapturePhoto={this._onChooseFile}
          onChoosePhoto={this._onChooseFile}
          onChooseFile={this._onChooseFile}
          ref={ref => { this._refModalAttackment = ref }}
        />
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
        {
          !this.state.isCo ? <ButtonAdd
            onButton={() => {
              this._onPressMenu()
            }}
            bottom={HEIGHTXD(150)}
          />
            : <View style={styles.ctnBtRa}>
              <TouchableOpacity style={styles.btRA} onPress={() => this._raPrint()}>
                <FastImage
                  style={styles.imageStyleRA}
                  resizeMode={FastImage.resizeMode.contain} source={require('../../../assets/images/menu/rap.png')} />
              </TouchableOpacity>
              <Text style={styles.txtRa}>
                RA
                </Text>
            </View>

        }
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state) {
  return {
    advanceRequestId: state.advanceRequestReducer.advanceRequestId,
    requestAmount: state.advanceRequestReducer.requestAmount,
    adUserId: state.userReducers.userData.loggedIn.adUserId,
    adUserDepartmentId: state.userReducers.userData.loggedIn.adUserDepartmentId,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
  }
}

export default connect(mapStateToProps, {})(DetailAttack)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51
  },
  imageStyleRA: {
    width: WIDTHXD(80),
    height: HEIGHTXD(90)
  },
  ctnBtRa: {
    position: 'absolute',
    alignSelf: 'flex-end',
    right: WIDTHXD(60),
    bottom: HEIGHTXD(150),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btRA: {
    width: WIDTHXD(150),
    height: WIDTHXD(150),
    borderRadius: WIDTH(50) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: R.colors.colorButtonRA,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 0.5 },
  },
  txtRa: {
    fontSize: getFontXD(33),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.colorNameBottomMenu,
    textAlign: 'center',
    marginTop: HEIGHTXD(8)
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
    marginBottom: WIDTHXD(24),
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    elevation: 4,
  },
  status: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoItalic,
    color: R.colors.label,
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
  },
  rowAttack: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: WIDTHXD(84),
    width: (Dimensions.get('window').width) * 0.6,
    marginBottom: WIDTHXD(18),
  },
  txtHeader: {
    fontSize: getFontXD(54),
    fontFamily: R.fonts.RobotoMedium,
    color: R.colors.white,
    marginLeft: WIDTHXD(68),
    marginRight: WIDTHXD(68),
    width: '100%'
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
  txtError: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoMedium,
    color: R.colors.black0,
    textAlign: 'center',
    marginTop: HEIGHTXD(40)
  },
  txtDelete: {
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color504,
    marginBottom: HEIGHTXD(32),
    marginRight: WIDTHXD(8),
    textDecorationLine: 'underline'
  }
})
