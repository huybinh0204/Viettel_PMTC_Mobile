import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, BackHandler, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash'
import R from '../../../../assets/R';
import { HEIGHTXD, WIDTHXD } from '../../../../config/Function';
import ItemGeneralInfo from './ItemView/ItemGeneralInfo';
import ItemStatement from './ItemView/ItemStatement';
import ItemMoneyInfo from './ItemView/ItemMoneyInfo';
import ItemVOfficeInfo from './ItemView/ItemVOfficeInfo';
import ItemStatusInfo from './ItemView/ItemStatusInfo';
import NavigationService from 'routers/NavigationService';
import ListStatement from '../../../ListStatement/ListStatement';
import dataApInvoiceGroup from '../dataApInvoiceGroup';
import ApInvoiceGroupStatement from '../../../../apis/Functions/apInvoiceGroupStatement'
import Confirm from '../../../../common/ModalConfirm/Confirm';
import moment from 'moment';
import { connect } from 'react-redux';
import { showAlert, TYPE } from 'common/DropdownAlert';
import { NavigationEvents } from 'react-navigation';
import { updateListInvoiceGroup, updateIconEye, updateInvoiceGroupItem } from '../../../../actions/invoiceGroup'


class GeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      listCurrency: [],
      listParner: [],
      isCreate: true,
      pressNextToDetail: false,
      isEdit: false,
      isReadOnly: false,
      isUpdate: false,
      showAllField: true,
      arrExpanded: [],
      debt: '',
      accountingEmail: '',
      rules: '',
      department: '',
      market: '',
      content: '',
      loading: false,
      reRender: false,
      showAllField: true,
      objExpanded: { expandedGeneral: true, expandedMoney: true, expandedStatus: true, expandedVOffice: true },
      body: {
        isautopost: 'N',
        isCarryForward: 'N',
        originalInvoiceGroupId: null,
        isPayOnBehalf: 'N',
        numberReactive: 0,
        dateReactive: null,
        dateReactiveFrom: null,
        dateReactiveTo: null,
        apInvoiceGroupPreId: null,
        numberSettlement: null,
        controlDepartmentId: null,
        toFinancialDepartment: null,
        productAmount: null,
        pitStatus: null,
        pitCheckId: null,
        isAutoClearAsset: 'N',
        apInvoiceGroupId: 0,
        adOrgId: 0,
        adOrgName: null,
        adClientId: null,
        adClientName: null,
        created: null,
        createdFrom: null,
        createdTo: null,
        createdby: null,
        createdbyName: null,
        updated: null,
        updatedFrom: null,
        updatedTo: null,
        updatedby: null,
        updatedbyName: null,
        name: null,
        value: null,
        description: '',
        isactive: 'Y',
        isDeleted: 'N',
        type: null,
        typeName: '',
        documentNo: '',
        transDate: moment(new Date()).format('DD/MM/YYYY'),
        transDateFrom: null,
        transDateTo: null,
        voucherNo: null,
        accountingDate: moment(new Date()).format('DD/MM/YYYY'),
        accountingDateFrom: null,
        accountingDateTo: null,
        batchNo: '',
        batchName: '',
        groupBatchNo: null,
        groupBatchName: null,
        requestAmount: 0.0,
        approvedAmount: 0.0,
        approveStatus: "DR",
        docstatus: 'DR',
        accountingStatus: 0,
        paymentStatus: 0,
        isSync: 'N',
        posted: 'N',
        apInvoiceGroupRefId: null,
        apInvoiceGroupRefName: null,

        email: '',
        approveReason: null,
        signerstatus: 0,
        issignerrecord: 'N',
        signcomment: null,
        timeDr: moment(new Date()).format('DD/MM/YYYY'),
        isSubmitHardCopy: 'N',
        hardCopyInfo: null,
        fwmodelId: 0,
        isSize: true,
        cCurrencyId: null,
        cDepartmentId: null,
        cStatementId: null,
        cDocumentsignId: null,
        cCostCategoryId: null,
        cCostCategoryName: '',
        cDocumentRecordId: null,
        cBpartnerId: null,
        cBpartnerName: '',
        cDocumentTypeId: 3,
        vOfficeNo: '',
        timeHardCopy: '',
        hardCopyInfo: '',
        listCStatementId: [],
      },
      oldInvoiceGroup: {
        description: '',
        type: null,
        transDate: moment(new Date()).format('DD/MM/YYYY'),
        email: '',
        cCurrencyId: null,
        cBpartnerId: null,
        cStatementId: null,
        cCostCategoryId: null,
        listCStatementId: [],
      },
      oldDataStatement: [],
      dataStatement: []
    }
    this.isBackScreen = false
    this.isSwitchTab = false
  }

  _backHandle = () => {
    if (this._isChangeBody()) {
      this.ConfirmPopup.setModalVisible(true)
      this.isBackScreen = true
      return true
    }
    return false
  }

  componentDidMount = async () => {
    this._getListCurrency()
    this._getListParner()
    if (this.props.id != 0) {
      this._getDetailItem(this.props.id);
    } else {
      let dataTemp = this.state.body;
      dataTemp.adOrgId = this.props.userData.adOrgId;
      dataTemp.createdby = this.props.userData.adUserId;
      dataTemp.cDepartmentId = this.props.userData.adUserDepartmentId;
      const body = {
        isSize: true, name: '', adOrgId: this.props.adOrgId, isNotRequiredUser: true, employeeCode: this.props.userData.userName
      }
      const response = await ApInvoiceGroupStatement.getPartner(body);
      console.log(body, response)
      if (response && response.status === 200) {
        if (response.data.length === 2) {
          body.cBpartnerId = response.data[0].id
          body.cBpartnerName = response.data[0].name
        }
      }
      this.setState({
        body: dataTemp,
      })
    }
    this.setState({
      isReadOnly: this.props.isReadOnly
    })
    BackHandler.addEventListener('hardwareBackPress', this._backHandle)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandle)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPressMenu !== this.props.isPressMenu && nextProps.icPressMenu !== -1 && nextProps.tabActive === this.state.index) {
      this.setState({ pressNextToDetail: false })
      this._callApi()
    }
    if (nextProps.isCreate !== this.props.isCreate) {
      this.setState({ isCreate: nextProps.isCreate })
    }
    if (nextProps.value !== this.props.value) {
      this.setState({ body: nextProps.value })
    }
    if ((nextProps.showAllFieldGroup !== this.props.showAllFieldGroup) && (nextProps.tabActive === this.state.index)) {
      this.setState({ showAllField: nextProps.showAllFieldGroup })
    }
    if (nextProps.requestAmount !== this.props.requestAmount) {
      let { body } = this.state
      body.requestAmount = nextProps.requestAmount
      this.setState({ body })
    }

    if (nextProps.isReadOnly !== this.props.isReadOnly) {
      this.setState({ isReadOnly: nextProps.isReadOnly })
    }

    if (nextProps.reloadInfo !== this.props.reloadInfo) {
      this._getDetailItem(this.props.id);
    }

    if (nextProps.isBackScreen !== this.props.isBackScreen) {
      if (this._isChangeBody()) {
        this.ConfirmPopup.setModalVisible(true)
        this.isBackScreen = true
      } else {
        NavigationService.pop()
      }
    }

    if (nextProps.isSwitchTab !== this.props.isSwitchTab) {
      if (this._isChangeBody()) {
        this.isSwitchTab = true
        this.ConfirmNextTabPopup.setModalVisible(true)
      } else {
        this.props.goToTab()
      }
    }
  }
  updateExpanded = (bool, index) => {
    const { objExpanded } = this.state
    switch (index) {
      case 0:
        objExpanded.expandedGeneral = bool
        break
      case 1:
        objExpanded.expandedMoney = bool
        break
      case 2:
        objExpanded.expandedVOffice = bool
        break
      default:
        objExpanded.expandedStatus = bool
        break
    }
    this.setState({ objExpanded }, () => {
      this.props.updateIconEye()
    })
  }

  _callApi = async () => {
    if (this.state.isCreate === true) {
      this._createGeneralInfo()
    } else {
      this._updateGeneralInfo()
    }
  }

  _onChangeValue = (item) => {
    let { body } = this.state;
    body[item.key] = item.value;
    this.setState({ body, isEdit: false })
    if (item.key === 'transDate') {
      let transDate = moment(item.value, 'dd/MM/yyyy')
      let statementListTmp = this.state.dataStatement.filter(item => (moment(item.transDate, 'dd/MM/yyyy') <= transDate))
      this.setState({ dataStatement: statementListTmp })
    }
  }


  _validateData = () => {
    const error = []
    // _.forEach(['type', 'email', 'transDate', 'cCurrencyId', 'cBpartnerId'], item => {
    if (this.state.body.type === null) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng chọn loại bảng THTT')
      error.push(item)
    }
    if (!this.state.body.transDate) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng chọn ngày chứng từ')
      error.push(item)
    }
    if (!this.state.body.email) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng nhập email kế toán')
      error.push(item)
    }

    if (!this.state.body.cBpartnerId) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng chọn người yêu cầu')
      error.push(item)
    }

    if (!this.state.body.cCurrencyId) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng chọn tiền tệ')
      error.push(item)
    }
    // })
    return error
  }

  _resetData = () => {
    let newInvoiceGroup = this.state.body
    let oldInvoiceGroup = this.state.oldInvoiceGroup
    newInvoiceGroup.type = oldInvoiceGroup.type
    newInvoiceGroup.typeName = oldInvoiceGroup.typeName
    newInvoiceGroup.transDate = oldInvoiceGroup.transDate
    newInvoiceGroup.description = oldInvoiceGroup.description
    newInvoiceGroup.email = oldInvoiceGroup.email
    newInvoiceGroup.cBpartnerId = oldInvoiceGroup.cBpartnerId
    newInvoiceGroup.cBpartnerName = oldInvoiceGroup.cBpartnerName
    newInvoiceGroup.cCostCategoryId = oldInvoiceGroup.cCostCategoryId
    newInvoiceGroup.cCostCategoryName = oldInvoiceGroup.cCostCategoryName
    newInvoiceGroup.cCurrencyId = oldInvoiceGroup.cCurrencyId
    this.setState({ body: newInvoiceGroup })
  }

  _isChangeBody = () => {
    let newInvoiceGroup = this.state.body
    let oldInvoiceGroup = this.state.oldInvoiceGroup
    if (newInvoiceGroup.type !== oldInvoiceGroup.type) return true
    if (newInvoiceGroup.transDate !== oldInvoiceGroup.transDate) return true
    if (newInvoiceGroup.description !== oldInvoiceGroup.description) return true
    if (newInvoiceGroup.email !== oldInvoiceGroup.email) return true
    if (newInvoiceGroup.cBpartnerId !== oldInvoiceGroup.cBpartnerId) return true
    if (newInvoiceGroup.cCostCategoryId !== oldInvoiceGroup.cCostCategoryId) return true
    if (newInvoiceGroup.cCurrencyId !== oldInvoiceGroup.cCurrencyId) return true
    let dataStatement = this.state.dataStatement
    let oldDataStatement = this.state.oldDataStatement
    if (dataStatement.length !== oldDataStatement.length) {
      return true
    }
    _.forEach(oldDataStatement, (oldItem) => {
      let isChangeDataStatement = true
      _.forEach(dataStatement, (item) => {
        if (oldItem.cStatementId === item.cStatementId) {
          isChangeDataStatement = false
        }
      })
      if (isChangeDataStatement) {
        return true
      }
    })

    _.forEach(dataStatement, (item) => {
      let isChangeDataStatement = true
      _.forEach(oldDataStatement, (oldItem) => {
        if (oldItem.cStatementId === item.cStatementId) {
          isChangeDataStatement = false
        }
      })
      if (isChangeDataStatement) {
        return true
      }
    })
    return false
  }

  _createGeneralInfo = async () => {
    let dataStatamentIdTmp = []
    if (this.state.dataStatement.length > 0) {
      _.forEach(this.state.dataStatement, (item) => {
        dataStatamentIdTmp.push(item.cStatementId)
      })
    }
    if (!this._validateData().length) {
      try {
        const { body, pressNextToDetail } = this.state;
        body.listCStatementId = dataStatamentIdTmp
        console.log("body_create", JSON.stringify(body))
        const response = await ApInvoiceGroupStatement.addNewApInvoiceGroup(body)
        console.log("response_create", JSON.stringify(response))
        if (response && response.status === 200) {
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Tạo mới bảng tổng hợp thanh toán thành công')
          this.props.setId(response.data.apInvoiceGroupId)
          this.props.updateListInvoiceGroup()
          let oldInvoiceGroup = {
            description: response.data.description,
            type: response.data.type,
            transDate: response.data.transDate,
            email: response.data.email,
            cCurrencyId: response.data.cCurrencyId,
            cBpartnerId: response.data.cBpartnerId,
            cStatementId: response.data.cStatementId,
            cCostCategoryId: response.data.cCostCategoryId,
          }
          this._updateListStatement(response.data.listCStatementId, response.data.listCStatementName)
          this.setState({ isCreate: false, body: response.data, oldInvoiceGroup, isUpdate: true, isEdit: false }, () => {
            if (pressNextToDetail) {
              this.props.nextToLine()
            }
          })
          this.props.onCreateSuccess()
          if (this.isBackScreen) {
            NavigationService.pop()
          }
        } else {
          showAlert(TYPE.ERROR, 'Thông báo', 'Tạo mới bảng tổng hợp thanh toán thất bại')
        }
      } catch (err) {
        showAlert(TYPE.ERROR, 'Thông báo', 'Tạo mới bảng tổng hợp thanh toán thất bại')
      }
    }
  }

  _updateGeneralInfo = async () => {
    try {
      let dataStatamentIdTmp = []
      let dataStatement = this.state.dataStatement
      let oldDataStatement = this.state.oldDataStatement
      if (dataStatement && dataStatement.length > 0) {
        if (oldDataStatement && oldDataStatement.length > 0) {
          _.forEach(oldDataStatement, (oldItem) => {
            let isDeleteItem = true
            _.forEach(dataStatement, (item) => {
              if (oldItem.cStatementId === item.cStatementId) {
                isDeleteItem = false
              }
            })
            if (isDeleteItem) {
              let deleteId = -oldItem.cStatementId
              dataStatamentIdTmp.push(deleteId)
            }
          })
        }
        _.forEach(dataStatement, (item) => {
          dataStatamentIdTmp.push(item.cStatementId)
        })
      } else if (oldDataStatement && oldDataStatement.length > 0) {
        _.forEach(oldDataStatement, (item) => {
          let deleteId = -item.cStatementId
          dataStatamentIdTmp.push(deleteId)
        })
      }

      let { pressNextToDetail } = this.state;
      let body = this.state.body
      body.listCStatementId = dataStatamentIdTmp
      body.updated = new Date().getTime()
      console.log("body_update", JSON.stringify(body))
      const response = await ApInvoiceGroupStatement.updateApInvoiceGroup(body)
      console.log("response_update", response)
      if (response && response.status === 200) {
        this.props.updateInvoiceGroupItem()
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Cập nhật bảng tổng thanh toán thành công')
        let oldInvoiceGroup = {
          description: response.data.description,
          type: response.data.type,
          transDate: response.data.transDate,
          email: response.data.email,
          cCurrencyId: response.data.cCurrencyId,
          cBpartnerId: response.data.cBpartnerId,
          cStatementId: response.data.cStatementId,
          cCostCategoryId: response.data.cCostCategoryId,
        }
        this._updateListStatement(response.data.listCStatementId, response.data.listCStatementName)
        this.setState({ isUpdate: true, isEdit: false, oldInvoiceGroup, body: response.data }, () => {
          if (pressNextToDetail) {
            this.props.nextToLine()
          }
        })
        if (this.isBackScreen) {
          NavigationService.pop()
        }

        if (this.isSwitchTab) {
          this.isSwitchTab = false
          this.props.goToTab()
        }
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Cập nhật bảng tổng thanh toán thất bại')
      }
    } catch (err) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Cập nhật bảng tổng thanh toán thất bại')
    }
  }

  _updateListStatement = (listCStatementId, listCStatementName) => {
    if (listCStatementId.length > 0) {
      let dataStatement = []
      let oldDataStatement = []
      const newArrayStatementName = Object.entries(listCStatementName)
      _.forEach(newArrayStatementName, (item, index) => {
        if (listCStatementId[index] > 0) {
          let nameArray = item[1].split(' - ')
          let statement = {
            cStatementId: parseInt(item[0], 10),
            documentNo: nameArray[0],
            description: nameArray[1],
          }
          dataStatement.push(statement)
          oldDataStatement.push(statement)
        }
      })
      this.setState({
        dataStatement: dataStatement,
        oldDataStatement: oldDataStatement,
      })

    }
  }


  _getListCurrency = async () => {
    const body = { isSize: true, name: '' }
    try {
      const response = await ApInvoiceGroupStatement.getListCurrency(body);
      if (response && response.status === 200) {
        const { listCurrency } = this.state
        _.forEach(response.data, (item) => {
          const itemCurrency = { name: item.value, fwmodelId: item.fwmodelId }
          listCurrency.push(itemCurrency)
        })
        listCurrency.pop()
        this.setState({ listCurrency })
      }
    } catch (err) {
    }
  }

  _getListParner = async () => {
    const body = { isSize: true, name: '', adOrgId: this.props.userData.adOrgId }
    try {
      const response = await ApInvoiceGroupStatement.getPartner(body);
      if (response && response.status === 200) {
        let data = response.data
        data.splice(data.length - 1, 1)
        this.setState({ listParner: data })
      }
    } catch (err) {
    }
  }

  _getDetailItem = async (id) => {
    console.log('id invoice group', id)
    try {
      const response = await ApInvoiceGroupStatement.getItemApInvoiceGroup(id)
      if (response && response.status === 200) {
        // this.props.updateRequestAmount(response.data.requestAmount)
        console.log('dataItem ---- ', response)
        // let dataStatement = []
        // let oldDataStatement = []
        // if (response.data.listCStatementId.length > 0) {
        //   const newArrayStatementName = Object.entries(response.data.listCStatementName)
        //   _.forEach(newArrayStatementName, (item) => {
        //     let nameArray = item[1].split(' - ')
        //     let statement = {
        //       cStatementId: item[0],
        //       documentNo: nameArray[0],
        //       description: nameArray[1],
        //     }
        //     dataStatement.push(statement)
        //     oldDataStatement.push(statement)
        //   })

        // }
        this._updateListStatement(response.data.listCStatementId, response.data.listCStatementName)
        let oldInvoiceGroup = {
          description: response.data.description,
          type: response.data.type,
          transDate: response.data.transDate,
          email: response.data.email,
          cCurrencyId: response.data.cCurrencyId,
          cBpartnerId: response.data.cBpartnerId,
          cStatementId: response.data.cStatementId,
          cCostCategoryId: response.data.cCostCategoryId,
        }
        this.setState({
          isCreate: false,
          body: response.data,
          oldInvoiceGroup: oldInvoiceGroup,
          reRender: !this.state.reRender,

        });
      }
    } catch (err) {
      console.log('lỗi lấy thông tin BTHTT', err)
      showAlert(TYPE.INFO, 'Thông báo', 'Đã có lỗi xảy ra')
    }
  }

  // loadData = () => {
  //   let idInvoice = this.props.idInvoice ? this.props.idInvoice : '54289'
  //   let body = { id: idInvoice }
  //   this.setState({
  //     loading: true
  //   }, async () => {
  //     let resDetail = await getDetailsInvoice(body)
  //     if (resDetail && resDetail.data) {
  //       this.dataItem = resDetail.data
  //       this.setState({ reRender: !this.state.reRender })
  //     }
  //     this.setState({ loading: false })
  //   })
  // }

  _reRender = () => {
    this.setState({ reRender: !this.state.reRender })
  }

  _onPressAlert = () => {
    this._callApi()
  }

  onAddStatement = () => {
    NavigationService.navigate(ListStatement)
  }
  _deleteStatement = (index) => {
    if (this.statedataStatement.length > 0) {
      let dataStatementTmp = this.state.dataStatement
      dataStatementTmp.splice(index, 1)
      this.setState({ dataStatement: dataStatementTmp })
    }
  }

  _updateStatementData = (statementData) => {
    // this.setState({dataStatement: statementData})
    this.setState({ reRender: !this.state.reRender })
  }
  render() {
    console.log('dataaaaa', this.state.body)
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <View>
            <ActivityIndicator animating color="#1C1C1C" size="large" />
          </View>
        </View>
      )
    }
    return (
      <>
        <NavigationEvents
          onWillFocus={payload => {
            BackHandler.addEventListener('hardwareBackPress', this._backHandle);
          }}
          onDidFocus={payload => {
            BackHandler.addEventListener('hardwareBackPress', this._backHandle);
          }}
          onWillBlur={payload => {
            BackHandler.removeEventListener('hardwareBackPress', this._backHandle);
          }}
          onDidBlur={payload => {
            BackHandler.removeEventListener('hardwareBackPress', this._backHandle);
          }}
        />
        <ScrollView
          style={[styles.container, { marginBottom: HEIGHTXD(200) }]}
          showsVerticalScrollIndicator={false}>
          <Confirm
            ref={ref => { this.ConfirmPopup = ref }}
            title="Bạn có muốn lưu bản ghi này trước khi thoát không?"
            titleLeft="HUỶ"
            titleRight="ĐỒNG Ý"
            onPressLeft={() => {
              if (this.isBackScreen) {
                NavigationService.pop()
              }
            }}
            onPressRight={() => this._onPressAlert()}
          />

          <Confirm
            ref={ref => { this.ConfirmNextTabPopup = ref }}
            title="Bạn có muốn lưu bản ghi này trước khi chuyển tab không?"
            titleLeft="HUỶ"
            titleRight="ĐỒNG Ý"
            onPressLeft={() => {
              this._resetData()
              this.props.goToTab()
            }}
            onPressRight={() => this._onPressAlert()}
          />

          {/* <StatusBar backgroundColor={R.colors.colorMain} /> */}
          <View style={{ marginTop: HEIGHTXD(24), marginBottom: HEIGHTXD(12) }}>
            <ItemGeneralInfo
              value={this.state.body}
              listParner={this.state.listParner}
              onChangeValue={this._onChangeValue}
              showAllField={this.state.showAllField}
              updateExpanded={this.updateExpanded}
              showAllField={this.state.showAllField}
              isReadOnly={this.state.isReadOnly}
            />
          </View>

          <View style={{ marginVertical: HEIGHTXD(12) }}>
            <ItemStatement
              transDate={this.state.body.transDate}
              onAddStatement={() => this.onAddStatement()}
              updateExpanded={this.updateExpanded}
              showAllField={this.state.showAllField}
              isReadOnly={this.state.isReadOnly}
              dataStatement={this.state.dataStatement}
              deleteStatement={() => this._deleteStatement()}
              updateStatementData={() => this._updateStatementData()}
              reRender={this.state.reRender}
            // navigation={this.props.navigation}
            />

          </View>
          <View style={{ marginVertical: HEIGHTXD(12) }}>
            <ItemMoneyInfo
              value={this.state.body}
              currency={this.state.listCurrency}
              updateExpanded={this.updateExpanded}
              showAllField={this.state.showAllField}
              isCreate={this.state.isCreate}
              reRender={this._reRender}
              onChangeValue={this._onChangeValue}
              isReadOnly={this.state.isReadOnly}
            />
          </View>
          {(this.state.isCreate === false) && (this.state.body.apInvoiceGroupId !== 0)
            ? <View>
              <View style={{ marginVertical: HEIGHTXD(12) }}>
                <ItemVOfficeInfo
                  value={this.state.body}
                  updateExpanded={this.updateExpanded}
                  showAllField={this.state.showAllField}
                />
              </View>

              <View style={{ marginVertical: HEIGHTXD(12) }}>
                <ItemStatusInfo
                  value={this.state.body}
                  updateExpanded={this.updateExpanded}
                  showAllField={this.state.showAllField}

                // rules={this.state.rules}
                // department={this.state.department}
                // market={this.state.market}
                // onChangeRules={(text) => this.onChangeRules(text)}
                // onChangeDepartment={(text) => this.onChangeDepartment(text)}
                // onChangeMarket={(text) => this.onChangeMarket(text)}
                // item={FakeData.THONG_TIN_QUAN_TRI}
                />
              </View>
            </View>
            : null}
          <TouchableOpacity
            activeOpacity={1}
            style={styles.buttonNext}
            onPress={() => {
              this.setState({ pressNextToDetail: true }, () => {
                if (this.state.isReadOnly) {
                  this.props.nextToLine()
                } else {
                  if (this.state.isEdit) {
                    this.props.nextToLine()
                  } else {
                    this.ConfirmPopup.setModalVisible(true)
                  }
                }
              })
            }}
          >
            <View style={styles.button}>
              <Icon name="arrow-right" size={WIDTHXD(60)} color={R.colors.colorMain} />
            </View>
          </TouchableOpacity>
        </ScrollView>

      </>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.colorBackground,
  },
  button: {
    marginVertical: HEIGHTXD(48),
    width: WIDTHXD(137),
    height: WIDTHXD(137),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: WIDTHXD(137),
    elevation: 5,
    backgroundColor: R.colors.white
  },
  buttonNext: {
    alignItems: 'flex-end',
    marginRight: WIDTHXD(86),
    shadowColor: '#181F4D21',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  }
})

function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData.loggedIn,
    showAllFieldGroup: state.advanceRequestReducer.showAllFieldGroup,
  }
}
export default connect(mapStateToProps, { updateListInvoiceGroup, updateIconEye, updateInvoiceGroupItem })(GeneralInfo);

