/* eslint-disable no-console */
import React, { Component } from 'react'
import {
  Text, View, TouchableOpacity, StyleSheet, LayoutAnimation, ScrollView, Dimensions, Animated,
  FlatList, TouchableWithoutFeedback, Modal, TextInput, Image, SafeAreaView, Platform
} from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto';
import RnFetchBlob from 'rn-fetch-blob'
import moment from 'moment'
import FastImage from 'react-native-fast-image';
import axios from 'axios'
import FormData from 'form-data'
import { CheckBox } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import PDF from 'react-native-pdf'
import { connect } from 'react-redux'
import IconClose from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash'
import { NetworkSetting } from '../../../../config/Setting';
import R from '../../../../assets/R'
import ModalSearch from '../../common/Modal';
import ButtonAdd from '../../../../common/Button/ButtonAdd';
import { WIDTHXD, HEIGHTXD, getFontXD, getWidth, WIDTH, convertTypeFile } from '../../../../config/Function'
import { uploadFileAttackSuccess, coVoffice } from '../../../../actions/advanceRequest'
import { getListAttackFile } from '../../../../apis/Functions/statement';
import ModalPrint from '../../../../common/PrintedVotes/index'
import NavigationService from '../../../../routers/NavigationService'
import { showAlert, TYPE } from '../../../../common/DropdownAlert'
import FlatListSwipe from '../../../../common/Swipe/FlatListSwipe';
import ItemAttachment from './ItemViews/ItemAttachment';
import ModalAttachment from '../../../../common/FilePicker/ModalAttachment'
import vOffice from '../../../../apis/Functions/vOffice'
import AdvanceRequest from '../../../../apis/Functions/advanceRequest'
import { showLoading, hideLoading } from '../../../../common/Loading/LoadingModal'
import global from '../../global'
import Confirm from '../../../../common/ModalConfirm/Confirm';
import OnPressFileAttack from './Function'


const menu = [
  { title: 'Chọn phiếu in khác', image: require('../../../../assets/images/attack/print.png') },
  { title: 'Đính kèm', image: require('../../../../assets/images/attack/attack.png') },
  { title: 'Chọn người ký', image: require('../../../../assets/images/attack/people.png') },
  { title: 'Trình ký', image: require('../../../../assets/images/attack/submission.png') },
]

class DetailAttack extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expandedAttack: true,
      expandedApproval: true,
      expandedMenu: false,
      listApproval: [],
      listAttack: [],
      showMenu: false,
      visible: false,
      indexMenu: 0,
      titleModal: '',
      signers: [{ cOfficestaffId: '', signerName: '', organizationid: '', organizationName: '', signimage: false, ispublished: false }],
      listSigner: [],
      reRender: false,
      parallelSigner: false,
      showIconEye: false,
      isError: false,
      url: '',
      viewDetail: false,
      dataAttackFile: {},
      animated: new Animated.Value(0),
      isCo: false,
      userName: '',
      password: '',
      idVoffice: null,
      attackFileErrors: [],
      dateAcct: moment(new Date()).format('DD/MM/YYYY'),
      fwmodelId: null,
      attachmentFileSign: null,
      title: ''
    }
  }

  componentDidMount() {
    if (this.props.navigation.state.params.id) {
      this._processViewVoffice(this.props.navigation.state.params.id)
    } else {
      this._getListAttack()
      const { adProcessId, key } = this.props.navigation.state.params.dataAttackFile
      const signers = []
      if (this.props.navigation.state.params.dataAttackFile.footTypeSign) {
        for (let i = 0; i < this.props.navigation.state.params.dataAttackFile.footTypeSign; i++) {
          signers.push({ cOfficestaffId: '', signerName: '', organizationid: '', organizationName: '', signimage: false, ispublished: false })
        }
      } else signers.push({ cOfficestaffId: '', signerName: '', organizationid: '', organizationName: '', signimage: false, ispublished: false })
      const params = this._setUrl(this.props.navigation.state.params.dataAttackFile)
      let url = NetworkSetting.ROOT
        .concat('/erp-service/reportStarterServiceRest/reportStarter/exportPdf')
        .concat(`?AD_Process_ID=${adProcessId}&reportName=${key}&AD_User_ID=${this.props.adUserId}&REPORT_MODE=${1}`)
        .concat(`&RECORD_ID=${this.props.advanceRequestId}`)
        .concat(`&UUID=_Y&condition=${params}`)
      this.setState({
        url,
        isError: false,
        dataAttackFile: this.props.navigation.state.params.dataAttackFile,
        signers,
        title: this.props.navigation.state.params.dataAttackFile.namePrint
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCoVoffice !== this.props.isCoVoffice) {
      global.UPDATE_ADVANCE_REQUEST()
    }
  }

  _processViewVoffice = async (id) => {
    let { listSigner, listAttack, signers } = this.state
    let url = ''
    let title = ''
    const responseSigners = await this._getListSignerVoffice(id)
    console.log('signers--', responseSigners)
    const filesAttack = await this._getListFileAttackVoffice(id)
    console.log('filesAttack--', filesAttack)
    _.forEach(filesAttack.data, item => {
      if (item.isFileSign === 'Y') {
        title = item.filename
        url = NetworkSetting.ROOT
          .concat(`/erp-service/adAttachmentServiceRest/downloadFile?condition={"filename": "${item.title}", "folder": "${item.folder}"}`)
      } else {
        listAttack.push(item)
      }
    })
    _.forEach(responseSigners.data, (item, index) => {
      listSigner.push({ cOfficestaffId: item.cSigninfomationId, signerName: item.cSignerName, organizationid: item.cOfficepositionId, organizationName: item.position, signimage: item.signimage === 'Y', ispublished: item.ispublished === 'Y' })
      signers.unshift({ cOfficestaffId: item.cSigninfomationId, signerName: item.cSignerName, organizationid: item.cOfficepositionId, organizationName: item.position, signimage: item.signimage === 'Y', ispublished: item.ispublished === 'Y', delete: index === 0 })
    })
    this.setState({ listAttack, fwmodelId: id, url, isError: false, title, signers, listSigner, isCo: this.props.isCoVoffice })
  }

  _getListSignerVoffice = async (id) => {
    const response = await vOffice.getSignerList(id)
    if (response && response.status === 200) return response
  }

  _getListFileAttackVoffice = async (id) => {
    const response = await AdvanceRequest.listAttackVoffice(id)
    if (response && response.status === 200) return response
  }

  _getListAttack = async () => {
    const body = {
      adTableId: global.TABLE_ID,
      recordId: this.props.advanceRequestId,
      isActive: 'Y',
      isDeleted: 'N',
    }
    try {
      const response = await getListAttackFile(body);
      if (response.status === 200) {
        const newAttacks = await this._processList(response.data)
        this.setState({ listAttack: newAttacks })
      }
    } catch (error) {
    }
  }

  _processList = (array) => {
    _.forEach(array, item => {
      item.isFileAttack = true
    })
    return array
  }

  _checkEmptyData = () => {
    if (_.isEmpty(this.state.password)) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng nhập mật khẩu trình ký')
      return false
    } else if (_.isEmpty(this.state.listSigner) || this.state.listSigner.length < this.state.signers.length) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng nhập thêm người ký')
      return false
    }
    return true
  }

  _randomName = (length) => {
    let result = this.props.navigation.state.params.dataAttackFile.key;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.concat('.pdf');
  }

  _createPrint = async () => {
    if (this._checkEmptyData()) {
      showLoading()
      const formData = new FormData()
      const isParallelSign = this.state.parallelSigner ? 'Y' : 'N'
      const cSignerIdLst = []
      const fileName = this.props.navigation.state.params.dataAttackFile.key.concat('.pdf')
      if (!_.isEmpty(this.state.signers)) {
        _.forEach(this.state.signers, item => {
          cSignerIdLst.push({
            cOfficepositionId: item.organizationid,
            cSignerId: item.cOfficestaffId,
            signimage: item.signimage ? 'Y' : 'N',
            ispublished: item.ispublished ? 'Y' : 'N'
          })
        })
      }
      const fileSign = this.state.attachmentFileSign
      fileSign.name = this._randomName(20)
      formData.append('attachments', fileSign)
      _.forEach(this.state.listAttack, item => {
        if (!item.isFileAttack) {
          delete item.isFileSign
          formData.append('attachments', item)
        }
      })
      let res = null;
      const url = NetworkSetting.ROOT
        .concat(`/erp-service-mobile/cDocumentsignServiceRest/attachFile/${global.DOCUMENT_TYPE_ID}/${this.props.adUserId}/${this.props.adUserId}/${fileName}/${global.TABLE_ID_CO}/${this.props.advanceRequestId}/${this.state.password}/?isParallelSign=${isParallelSign}&cSignerIdLst=${JSON.stringify(cSignerIdLst)}`)
      try {
        res = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } catch (error) {
        showAlert(TYPE.ERROR, 'Thông báo', 'Có lỗi xảy ra')
      }
      hideLoading()
      console.log('RESPONSE CREATE---', res)
      return res
    }
  }

  _getNewListSigner =async (fwmodelId) => {
    const listSigner = []
    const signers = []
    const responseSigners = await this._getListSignerVoffice(fwmodelId)
    console.log('RESPONSE UPDATE LIST: 1 --------', responseSigners)
    if (responseSigners && responseSigners.status === 200) {
      _.forEach(responseSigners.data, item => {
        listSigner.push({ cOfficestaffId: item.cSigninfomationId, signerName: item.cSignerName, organizationid: item.cOfficepositionId, organizationName: item.position, signimage: item.signimage === 'Y', ispublished: item.ispublished === 'Y' })
        signers.unshift({ cOfficestaffId: item.cSigninfomationId, signerName: item.cSignerName, organizationid: item.cOfficepositionId, organizationName: item.position, signimage: item.signimage === 'Y', ispublished: item.ispublished === 'Y', delete: true })
      })
      this.setState({ listSigner, signers }, () => () => console.log('THIS.STATE:', listSigner))
    }
  }

  _coPrint = async () => {
    if (this.state.fwmodelId === null) {
      const response = await this._createPrint()
      if (response && response.status === 200) {
        this._co(response.data.fwmodelId)
        this._getNewListSigner(response.data.fwmodelId)
      }
    } else {
      this._co(this.state.fwmodelId)
      const responseSigners = await this._getListSignerVoffice(this.state.fwmodelId)
      console.log('RESPONSE UPDATE LIST: 2 --------', responseSigners)
      this._getNewListSigner(this.state.fwmodelId)
    }
  }

  _co = async (fwmodelId) => {
    const body = {
      ad_table_id: global.TABLE_ID_CO_VOFFICE,
      record_id: fwmodelId,
      ad_org_id: this.props.adOrgId,
      updatedby: this.props.adUserId
    }
    const resVoffice = await AdvanceRequest.coVoffice(body)
    console.log('RESPONSE CO:', resVoffice)
    if (resVoffice && resVoffice.data.returnMessage) {
      this._deleteVoffice(fwmodelId)
      showAlert(TYPE.WARN, 'Thông báo', resVoffice.data.returnMessage)
    } else {
      showAlert(TYPE.SUCCESS, 'Thông báo', 'CO phiếu in thành công')
      let dateAcct = moment(new Date()).format('DD/MM/YYYY')
      if (resVoffice.data.dateAcct !== null) dateAcct = resVoffice.data.dateAcct
      const responseListAttack = await this._updateListAttack(fwmodelId)
      this.setState({ isCo: true, fwmodelId, dateAcct, listAttack: responseListAttack }, () => {
        this.props.coVoffice(true, fwmodelId)
      })
    }
  }

  _updateListAttack = async (id) => {
    const response = await vOffice.getAttachList(id)
    const { listAttack } = this.state
    if (response && response.status === 200) {
      for (let i = 0; i < response.data.length; i++) {
        for (let j = 0; j < listAttack.length; j++) {
          if (listAttack[j].name === response.data[i].filename) {
            listAttack[j].fwmodelId = response.data[i].cattachmentinfoId
          }
        }
      }
      return listAttack
    }
  }

  _raPrint = async () => {
    const body = {
      ad_table_id: global.TABLE_ID_CO_VOFFICE,
      record_id: this.state.fwmodelId,
      ad_org_id: this.props.adOrgId,
      updatedby: this.props.adUserId,
      dateAcct: this.state.dateAcct,
      ad_window_id: 1000000
    }
    try {
      const response = await AdvanceRequest.raVoffice(body)
      console.log('RESPONSE RA:', response)
      if (response && response.status === 200 && !response.data.returnMessage) {
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Hủy hoàn thành phiếu in thành công')
        this.setState({ isCo: false }, () => {
          this.props.coVoffice(false, this.state.fwmodelId)
        })
      } else {
        showAlert(TYPE.WARN, 'Thông báo', response.data.returnMessage)
      }
    } catch (error) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Hủy hoàn thành phiếu in thất bại')
    }
  }

  _accept = (item) => {
    const signers = []
    if (item.dataAttackFile.footTypeSign) {
      for (let i = 0; i < item.dataAttackFile.footTypeSign; i++) {
        signers.push({ cOfficestaffId: '', signerName: '', organizationid: '', organizationName: '', signimage: false, ispublished: false })
      }
    }
    const params = this._setUrl(item.dataAttackFile)
    let url = NetworkSetting.ROOT
      .concat('/erp-service/reportStarterServiceRest/reportStarter/exportPdf')
      .concat(`?AD_Process_ID=${item.dataAttackFile.adProcessId}&reportName=${item.dataAttackFile.key}&AD_User_ID=${this.props.adUserId}&REPORT_MODE=${1}`)
      .concat(`&RECORD_ID=${this.props.advanceRequestId}`)
      .concat(`&UUID=_Y&condition=${params}`)
    this.setState({ url, isError: false, dataAttackFile: item.dataAttackFile, signers, title: item.dataAttackFile.namePrint })
    if (this.state.fwmodelId !== null) this._updateTypePrintVoffice()
  }

  _setUrl = (res) => {
    let params = []
    const { checkboxPrint, checkboxSign, date, footTypeSign, key, th, typePrint, value } = res
    switch (value) {
      case 1:
        if (checkboxPrint && checkboxSign) {
          params = [{ columnName: 'KyLenTD', value: 'Y', reportName: key, dataType: 'Yes-No', isspecial: 'Y' }, { columnName: 'IsGom', value: 'Y', reportName: key, dataType: 'Yes-No' }]
        } else if (checkboxSign) {
          params = [{ columnName: 'KyLenTD', value: 'Y', reportName: key, dataType: 'Yes-No', isspecial: 'Y' }]
        } else if (checkboxPrint) {
          params = [{ columnName: 'IsGom', value: 'Y', reportName: key, dataType: 'Yes-No', isspecial: 'Y' }]
        }
        break;
      case 2:
        if (checkboxPrint && checkboxSign) {
          params = [
            { columnName: 'KyLenTD', value: 'Y', reportName: key, dataType: 'Yes-No', isspecial: 'Y' },
            { columnName: 'IsGom', value: 'Y', reportName: key, dataType: 'Yes-No' },
          ]
        } else if (checkboxSign) {
          params = [{ columnName: 'KyLenTD', value: 'Y', reportName: key, dataType: 'Yes-No', isspecial: 'Y' }]
        } else if (checkboxPrint) {
          params = [{ columnName: 'IsGom', value: 'Y', reportName: key, dataType: 'Yes-No', isspecial: 'Y' }]
        }
        break;
      case 3:
        if (checkboxSign && typePrint) {
          params = [
            { columnName: 'KyLenTD', value: 'Y', reportName: key, dataType: 'Yes-No', isspecial: 'Y' },
            { columnName: 'IsGom', value: typePrint.toString(), reportName: key, dataType: 'List' }
          ]
        } else if (checkboxSign) params.push({ columnName: 'KyLenTD', value: 'Y', reportName: key, dataType: 'Yes-No', isspecial: 'Y' })
        else if (typePrint) params.push({ columnName: 'IsGom', value: typePrint.toString(), reportName: key, dataType: 'List', isspecial: 'Y' })
        break;
      case 4:
        if (checkboxPrint && checkboxSign) {
          params = [
            { columnName: 'KyLenTD', value: 'Y', reportName: key, dataType: 'Yes-No', isspecial: 'Y' },
            { columnName: 'IsGom', value: 'Y', reportName: key, dataType: 'Yes-No' },
          ]
        } else if (checkboxSign) {
          params = [{ columnName: 'KyLenTD', value: 'Y', reportName: key, dataType: 'Yes-No', isspecial: 'Y' }]
        } else if (checkboxPrint) {
          params = [{ columnName: 'IsGom', value: 'Y', reportName: key, dataType: 'Yes-No', isspecial: 'Y' }]
        }
        break;
      case 6:
        params = [
          { columnName: 'Dot', value: th, reportName: key, dataType: 'String' },
          { columnName: 'Thang', value: `date(${date})`, reportName: key, dataType: 'Date' }
        ]
        break;
      case 8:
        if (footTypeSign === 4 || footTypeSign === 5) {
          params.push({ columnName: 'LoaiChanKy', value: (footTypeSign.toString().concat('CK')), reportName: key, dataType: 'List' })
        }
        break;
      default:
        break
    }
    return JSON.stringify(params)
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
    this.setState({ indexMenu: index, expandedMenu: false })
  }

  _deleteVoffice = async (id) => {
    try {
      const response = await vOffice.delVOffice(id)
    } catch (err) {
    }
  }

  _updateTypePrintVoffice = async () => {
    const formData = new FormData()
    formData.append('attachments', this.state.attachmentFileSign)
    const response = await vOffice.changeTypePrint(this.state.fwmodelId, formData)
    if (response && response.status === 200) {
      showAlert(TYPE.SUCCESS, 'Thông báo', 'Thay đổi phiếu in thành công')
    } else {
      showAlert(TYPE.ERROR, 'Thông báo', 'Thay đổi phiếu in thất bại')
    }
  }

  _addSigner = () => {
    let signers = [...this.state.signers]
    const newSigner = { cOfficestaffId: '', signerName: '', organizationid: '', organizationName: '', signimage: false, ispublished: false, delete: true }
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
            let termArray = []
            for (let i = listSigner.length; i < signers.length; i++) {
              listSigner.push(signers[i])
              termArray.push(signers[i])
            }
            if (this.state.fwmodelId === null) {
              this.setState({ listSigner, visible: false, expandedApproval: true })
              showAlert(TYPE.SUCCESS, 'Thông báo', 'Thêm người ký thành công')
            } else {
              this.setState({ visible: false })
              this._addSignerVoffice(termArray)
            }
          }
        } else {
          showAlert(TYPE.WARN, 'Thông báo', 'Người ký đã được thêm')
        }
      }
    }
  }

  _addSignerVoffice = async (termArray) => {
    // TODO:
    const signers = []
    _.forEach(termArray, (item, index) => {
      signers.push({
        cOfficepositionId: item.organizationid,
        cSignerId: item.cOfficestaffId,
        signimage: item.signimage ? 'Y' : 'N',
        ispublished: item.ispublished ? 'Y' : 'N',
        cSignerName: item.signerName,
        cDocumentsignId: this.state.fwmodelId,
        parallelsignlevel: null,
        isactive: 'Y',
        isDelete: 'N',
        imagenote: parseInt(this.state.listSigner.length, 10) + parseInt(index, 10) + 1,
      })
    })
    const response = await AdvanceRequest.addSignerVoffice(signers)
    console.log('BODY---', signers)
    console.log('RESPONSE ADD LIST SIGNER:', response)
    if (response && response.status === 200) {
      this.setState({ listSigner: [...this.state.listSigner, ...termArray] }, () => {
        this._getNewListSigner(this.state.fwmodelId)
      })
      showAlert(TYPE.SUCCESS, 'Thông báo', 'Thêm người ký thành công')
    } else {
      showAlert(TYPE.ERROR, 'Thông báo', 'Thêm người ký thất bại')
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

  _onChooseFile = async (res) => {
    // TODO:
    if (res) {
      const listAttack = [...this.state.listAttack]
      if (this.state.fwmodelId === null) {
        if (typeof (res) === 'object' && res.length >= 0) {
          res.map(item => {
            item.isFileSign = false
            listAttack.push(item)
          })
        } else {
          listAttack.push(res)
        }
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Đính kèm file thành công')
        this.setState({ listAttack, expandedAttack: true })
      } else {
        this._addFileSign(Array.isArray(res) ? res[0] : res)
      }
    }
  }

  _addFileSign = async (file) => {
    const data = {
      cdocumentsignId: this.state.fwmodelId,
      filename: file.name,
      isFileSignName: 'Không',
      isFileSignType: 'File đính kèm',
      isFileSign: 'N'
    }
    const addSignFileResponse = await axios.post(`${NetworkSetting.ROOT}/erp-service-mobile/cAttachmentinfoRsServiceRest/create/`, data);
    if (addSignFileResponse && addSignFileResponse.status === 200) {
      const cattachmentinfoId = addSignFileResponse.data;
      const formData = new FormData()
      formData.append('attachments', file)
      const response = await AdvanceRequest.addFileAttackVoffice(cattachmentinfoId, this.props.advanceRequestId, this.props.advanceRequestId, file.name, formData)
      if (response && response.status === 200) {
        if (response.data !== 'Định dạng file không hợp lệ') {
          const listAttack = [...this.state.listAttack]
          listAttack.push(file)
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Đính kèm file thành công')
          this.setState({ listAttack })
        } else {
          showAlert(TYPE.ERROR, 'Thông báo', 'Đính kèm file thất bại')
        }
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Đính kèm file thất bại')
      }
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

  _onDelAttackFile = async (indexs, indexDel) => {
    let listAttack = [...this.state.listAttack];
    if (this.state.fwmodelId !== null) {
      const response = await vOffice.delSignerFile(listAttack[indexDel].fwmodelId)
      if (response && response.status === 200) {
        listAttack.splice(indexDel, 1);
        this.setState({ listAttack });
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Xóa file đính kèm thành công');
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Xóa file đính kèm thất bại');
      }
    } else {
      listAttack.splice(indexDel, 1);
      showAlert(TYPE.SUCCESS, 'Thông báo', 'Xóa file đính kèm thành công');
      this.setState({ listAttack });
    }
  }

  _renderAttackmenInfo() {
    // TODO:
    return <PDF
      source={{ uri: encodeURI(this.state.url), cache: false }}
      style={{ flex: 1 }}
      onError={(err) => {
        console.log('url view FILE ATTACK:', this.state.url)
        this.setState({ isError: true })
      }}
      onLoadComplete={(number, path) => {
        this._saveFileMainPrint(path)
      }}
    />;
  }

  _pressIconEye = () => {
    this.setState({ showIconEye: !this.state.showIconEye })
  }

  _saveFileMainPrint = async (path) => {
    const response = await RnFetchBlob.fs.stat(path)
    if (response) {
      const newFile = { uri: 'file://'.concat(response.path), type: 'application/pdf', size: response.size, name: response.filename }
      this.setState({ attachmentFileSign: newFile })
    }
  }

  _deleteSigner = (index) => {
    let { signers, listSigner } = this.state
    if (this.state.fwmodelId === null) {
      signers.splice(index, 1)
      listSigner.splice(index, 1)
      this.setState({ signers, listSigner })
      showAlert(TYPE.SUCCESS, 'Thông báo', 'Xóa người ký thành công')
    } else this._deleteSignerVoffice(listSigner[index], index)
  }

  _deleteSignerVoffice = async (signer, index) => {
    let { signers, listSigner } = this.state
    try {
      const response = await AdvanceRequest.deleteSignerVoffice(signer.cOfficestaffId)
      if (response && response.status === 200) {
        signers.splice(index, 1)
        listSigner.splice(index, 1)
        this.setState({ signers, listSigner, visible: false })
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Xóa người ký thành công')
      } else showAlert(TYPE.ERROR, 'Thông báo', 'Xóa người ký thất bại')
    } catch (err) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Xóa người ký thất bại')
      console.log('ERROR:', err)
    }
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
            <Text style={styles.txtAccept}>ĐỒNG Ý</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: HEIGHTXD(48) }}
            onPress={async () => {
              const response = await this._createPrint()
              if (response && response.status === 200) {
                this.setState({ visible: false }, () => {
                  NavigationService.navigate('CreateVOffice', { cDocumentsignId: response.data.fwmodelId, refreshData: () => { } })
                })
              } else {
                showAlert(TYPE.ERROR, 'Thông báo', 'Có lỗi xảy ra')
              }
            }}
          >
            <Text style={styles.txtToSubmission}>Lưu thông tin Trình ký</Text>
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
                      enableEdit={true}
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
                      enableEdit={true}
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
                          item.signimage = !item.signimage
                          this.setState({ signers })
                        }}
                        checked={item.signimage}
                        size={WIDTH(30)}
                        color={R.colors.colorNameBottomMenu}
                        style={{ borderRadius: HEIGHTXD(18), marginLeft: -WIDTHXD(24) }}
                      />
                      <Text style={[styles.labelCheckbox, { marginLeft: WIDTHXD(56), color: R.colors.black0 }]}>Hiển thị chữ ký</Text>
                    </View>
                    <View style={[styles.ctnCheckbox, { marginLeft: WIDTHXD(156) }]}>
                      <CheckBox
                        onPress={() => {
                          item.ispublished = !item.ispublished
                          this.setState({ signers })
                        }}
                        checked={item.ispublished}
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
            style={{ marginTop: HEIGHTXD(88), flexDirection: 'row', justifyContent: 'center' }}
          >
            <View style={styles.btAdd}>
              <IconClose name="plus" size={WIDTHXD(42)} color={R.colors.colorNameBottomMenu} />
            </View>
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
    const { expandedAttack, expandedApproval, listApproval, listAttack, titleModal, indexMenu, showIconEye, signers, listSigner } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#0062E1', '#0268E3', '#0B7BE9', '#1899F4', '#22AEFB']}
          style={{ height: HEIGHTXD(200), justifyContent: 'center' }}
        >
          <Confirm
            ref={ref => { this._refConfirmPopup = ref }}
            title="Có lỗi xảy ra, bạn có muốn thử lại hay không ?"
            titleLeft="HUỶ"
            titleRight="ĐỒNG Ý"
            onPressLeft={() => this._deleteVoffice()}
            onPressRight={() => this._attackFileVoffice(this.state.idVoffice, this.state.attackFileErrors)}
          />
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
                {this.state.title}
              </Text>
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
          {this.state.isError === true
            ? <Text style={styles.txtError}>File đính kèm bị lỗi</Text>
            : this._renderAttackmenInfo()}
        </View>
        {((!_.isEmpty(listSigner) || !_.isEmpty(listAttack)) && !this.props.navigation.getParam('viewDetail'))
          ? <ScrollView
            style={{
              paddingVertical: HEIGHTXD(20),
              width: '100%',
              maxHeight: (expandedApproval && expandedAttack)
                ? HEIGHTXD(700)
                : ((expandedAttack || expandedApproval)
                  ? HEIGHTXD(380)
                  : (!_.isEmpty(listApproval) && !_.isEmpty(listAttack)
                    ? HEIGHTXD(250) : HEIGHTXD(140)))
            }}
          >
            {!_.isEmpty(listAttack)
              ? <View style={{ paddingHorizontal: WIDTHXD(30), marginBottom: HEIGHTXD(30) }}>
                <TouchableOpacity style={styles.btAttack} onPress={() => this.changeLayoutAttack()}>
                  <View style={styles.rowAttack}>
                    <Text style={styles.mainText}>Tệp đính kèm</Text>
                    <Text style={[styles.mainText, { marginLeft: WIDTHXD(8) }]}>{listAttack.length}</Text>
                  </View>
                  {expandedAttack && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                  {!expandedAttack && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                </TouchableOpacity>
                {
                  expandedAttack
                  && (
                    <View>
                      <FlatListSwipe
                        data={listAttack}
                        renderItem={({ item, index }) => {
                          return <ItemAttachment
                            pressItemAttack={() => {
                              OnPressFileAttack(item)
                            }}
                            filename={item.name || item.filename}
                            index={index}
                            type={convertTypeFile(item.name) || convertTypeFile(item.filename)}
                            onPressIcon={this._onDelAttackFile}
                          />
                        }}
                        onPressIcon={(indexOfIcon, indexOfItem, adAttachmentId) => {
                          this._onDelAttackFile(indexOfIcon, indexOfItem, adAttachmentId);
                        }}
                        listIcons={[R.images.iconDelete]}
                        widthListIcon={WIDTHXD(320)}
                        rightOfList={WIDTHXD(70)}
                        styleOfIcon={{}}
                      />
                    </View>
                  )
                }
              </View> : null}
            {!_.isEmpty(listSigner)
              ? <View style={{ paddingHorizontal: WIDTHXD(30), marginBottom: HEIGHTXD(30) }}>
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
                      data={listSigner}
                      keyExtractor={(item, index) => index.toString()}
                      extraData={this.state}
                      renderItem={({ item }) => (
                        <TouchableOpacity style={styles.btApproval}>
                          <View style={styles.rowApproval}>
                            <View style={styles.ctnImage}>
                              <FastImage
                                source={require('../../../../assets/images/category/iconPeople.png')}
                                style={styles.imageAvt}
                                resizeMode={FastImage.resizeMode.contain}
                              />
                            </View>
                            <View style={styles.colApproval}>
                              <Text style={styles.content}>{item.signerName}</Text>
                              <Text style={styles.title}>{item.organizationName}</Text>
                            </View>
                          </View>
                          {/* <Text style={styles.status}>Đã kí duyệt</Text> */}
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
        <ModalPrint ref={ref => { this._refModalPrint = ref }} accept={this._accept} />
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
                  resizeMode={FastImage.resizeMode.contain}
                  source={require('../../../../assets/images/menu/rap.png')}
                />
              </TouchableOpacity>
              <Text style={styles.txtRa}>RA</Text>
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
    adUserId: state.userReducers.userData.adUserId,
    adUserDepartmentId: state.userReducers.userData.adUserDepartmentId,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
    isCoVoffice: state.advanceRequestReducer.coVoffice,
  }
}

export default connect(mapStateToProps, { uploadFileAttackSuccess, coVoffice })(DetailAttack)

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
    textDecorationLine: 'underline',
  },
  btAdd: {
    width: WIDTHXD(64),
    height: HEIGHTXD(64),
    borderRadius: WIDTHXD(32),
    borderColor: R.colors.colorNameBottomMenu,
    backgroundColor: R.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.3,
    marginRight: WIDTHXD(32),
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  }
})
