import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput } from 'react-native'
import _ from 'lodash'
import { connect } from 'react-redux'
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth, validateEmail } from '../../../../config';
import R from '../../../../assets/R';
import ModalSearch from '../../common/Modal';
import PickerDate from '../../../../common/Picker/PickerDate'
import { showAlert, TYPE } from '../../../../common/DropdownAlert';
import AdvanceRequest from '../../../../apis/Functions/advanceRequest';
import { showLoading, hideLoading } from '../../../../common/Loading/LoadingModal'
import global from '../../global'

class Details extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 3,
      reRender: false,
      oldEmail: '',
      oldcDepartmentId: '',
      item: {},
      adOrgId: null,
      adUserId: null,
      objUpdate: {
        adOrgId: null,
        isactive: 'Y',
        cApprovalAdvanceRequestId: null,
        cDepartmentId: null,
        email: null,
        cDepartmentName: null,
        no: null,
      },
      isCreate: true,
    }
    global.goBackToListApprovalInfo = this.goBackToListAprroval.bind(this)
  }

  componentDidMount() {
    let { objUpdate, oldEmail, oldcDepartmentId } = this.state
    let { adOrgId, adUserId } = this.props.navigation.state.params
    if (!_.isEmpty(this.props.navigation.state.params.detail)) {
      objUpdate.cApprovalAdvanceRequestId = this.props.navigation.state.params.detail.cApprovalAdvanceRequestId
      objUpdate.cDepartmentId = this.props.navigation.state.params.detail.cDepartmentId
      objUpdate.email = this.props.navigation.state.params.detail.email
      objUpdate.cDepartmentName = this.props.navigation.state.params.detail.cDepartmentName
      objUpdate.no = this.props.navigation.state.params.detail.no
      oldEmail = this.props.navigation.state.params.detail.email
      oldcDepartmentId = this.props.navigation.state.params.detail.cDepartmentId
      this.setState({ objUpdate, isCreate: false, oldEmail, oldcDepartmentId })
    }
    if (this.props.navigation.state.params.length === 0) this._onChangeDetail({ key: 'cDepartmentId', value: this.props.department.departmentId })
    this.setState({ adOrgId, adUserId })
  }

  componentWillUnmount() {
    if (this.state.reRender) {
      this.props.navigation.state.params.updateItem(this.state.item)
    }
    this.props.returnData({ activeMenu: global.HIDE_BOTTOM_MENU, indexIcon: global.SHOW_DOUBLE_ICON, toDetail: false })
  }

  _onChangeDetail = (itemBody) => {
    let { objUpdate } = this.state
    objUpdate[itemBody.key] = itemBody.value
    this.setState({ objUpdate })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPressMenu !== this.props.isPressMenu && nextProps.icPressMenu !== -1 && nextProps.tabActive === this.state.index) {
      this._callApi()
    }
    if (nextProps.isCreate !== this.props.isCreate) {
      this.setState({ objUpdate: nextProps.detailApproval })
    }
  }

  goBackToListAprroval = () => {
    this.props.navigation.goBack()
  }

  _callApi = () => {
    if (this.state.isCreate) {
      this._createApproval()
    } else {
      this._updateApproval()
    }
  }

  _validateCreateApproval = () => {
    const error = [];
    _.forEach(['email', 'cDepartmentId'], item => {
      if (!this.state.objUpdate[item]) {
        error.push(item)
      } if (item === 'email' && this.state.objUpdate.email) {
        if (!validateEmail(this.state.objUpdate.email)) {
          error.push(item)
          showAlert(TYPE.WARN, 'Thông báo', 'Email không hợp lệ')
        }
      }
    })
    return error;
  }

  _createApproval = async () => {
    let { objUpdate, oldEmail, oldcDepartmentId } = this.state
    if (this._validateCreateApproval().length > 0) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng điền đầy đủ thông tin')
    } else {
      showLoading()
      try {
        objUpdate.cAdvanceRequestId = this.props.id
        objUpdate.adOrgId = this.state.adOrgId
        const response = await AdvanceRequest.createApproval(objUpdate)
        if (response && response.status === 200) {
          hideLoading()
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Tạo mới thông tin duyệt thành công')
          this.goBackToListAprroval()
          let cloneObj = {
            adOrgId: 1000434,
            isactive: 'Y',
            cApprovalAdvanceRequestId: response.data.cApprovalAdvanceRequestId,
            cDepartmentId: response.data.cDepartmentId,
            email: response.data.email,
            cDepartmentName: response.data.cDepartmentName,
            no: response.data.no
          }
          oldEmail = response.data.email
          oldcDepartmentId = response.data.cDepartmentId
          this.setState({ isCreate: false, objUpdate: cloneObj, item: response.data, oldEmail, oldcDepartmentId, reRender: true })
        } else {
          hideLoading()
          showAlert(TYPE.ERROR, 'Thông báo', 'Tạo mới thông tin duyệt thất bại')
        }
      } catch (error) {
        hideLoading()
        showAlert(TYPE.ERROR, 'Thông báo', 'Tạo mới thông tin duyệt thất bại2222')
      }
    }
  }

  _checkAfterUpdate = () => {
    let { oldEmail, oldcDepartmentId } = this.state
    let newObject = this.state.objUpdate
    newObject.no = null
    if (newObject.email === oldEmail || oldEmail === '') {
      newObject.email = null
    } if (newObject.cDepartmentId === oldcDepartmentId || oldcDepartmentId === '') {
      newObject.cDepartmentId = null
    }
    return newObject
  }

  _updateApproval = async () => {
    try {
      showLoading()
      const response = await AdvanceRequest.updateItemDepartmentApproval(this._checkAfterUpdate())
      if (response && response.status === 200) {
        hideLoading()
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Cập nhât thông tin duyệt thành công')
        this.goBackToListAprroval()
        let cloneObj = {
          adOrgId: 1000434,
          isactive: 'Y',
          cApprovalAdvanceRequestId: response.data.cApprovalAdvanceRequestId,
          cDepartmentId: response.data.cDepartmentId,
          email: response.data.email,
          cDepartmentName: response.data.cDepartmentName,
          no: response.data.no,
        }
        let { oldEmail, oldcDepartmentId } = this.state
        oldEmail = response.data.email
        oldcDepartmentId = response.data.cDepartmentId
        this.setState({ objUpdate: cloneObj, oldEmail, oldcDepartmentId, item: response.data, reRender: true })
      } else {
        hideLoading()
        showAlert(TYPE.ERROR, 'Thông báo', 'Cập nhât thông tin duyệt thất bại')
      }
    } catch (error) {
      hideLoading()
      showAlert(TYPE.ERROR, 'Thông báo', 'Cập nhât thông tin duyệt thất bại')
    }
  }

  render() {
    const { objUpdate } = this.state
    const email = objUpdate.email ? objUpdate.email : ''
    const cDepartmentName = objUpdate.cDepartmentName ? objUpdate.cDepartmentName : ''
    const reason = objUpdate.reason ? objUpdate.reason : ''
    const approveName = objUpdate.approveName ? objUpdate.approveName : ''
    const no = objUpdate.no ? objUpdate.no.toString() : ''
    const value = this.props.navigation.state.params.length === 0 ? this.props.department.departmentName : cDepartmentName
    const id = this.props.navigation.state.params.length === 0 ? this.props.department.departmentId : ''
    let status = ''
    if (objUpdate && objUpdate.approveStatus) {
      _.forEach(R.strings.local.TRANG_THAI_DUYET, item => {
        if (item.id === objUpdate.approveStatus) {
          status = item.name
        }
      })
    }

    return (
      <View style={styles.ctn}>
        <View style={styles.container}>
          {(this.state.objUpdate.cApprovalAdvanceRequestId)
            ? <View style={styles.viewRows}>
              <Text style={[styles.txtLabel]}>STT</Text>
              <TextInput
                editable={false}
                placeholder="STT"
                value={no}
                style={[styles.input, styles.stt, styles.txtValue]}
              />
            </View> : null}
          <View style={styles.approval}>
            <ModalSearch
              enableEdit={this.props.enableEdit}
              label="Phòng ban phê duyệt"
              require={true}
              id={id}
              length={this.props.navigation.state.params.length}
              buttonShowModal={styles.btModal}
              value={value}
              title="Phòng ban phê duyệt"
              keyApi="departmentApproval"
              onValueChange={obj => {
                this._onChangeDetail({ key: 'cDepartmentId', value: obj })
              }}
            />
          </View>

          <View style={styles.viewRows}>
            <View style={{ flexDirection: 'row', flex: 2 }}>
              <Text style={[styles.txtLabel]}>Email</Text>
              <Text style={styles.require}>*</Text>
            </View>
            <TextInput
              editable={this.props.enableEdit}
              placeholder="Email"
              value={email}
              style={[styles.input, { flex: 3, marginLeft: 0, paddingLeft: WIDTHXD(24), paddingVertical: WIDTHXD(4) }, styles.txtValue]}
              onChangeText={text => {
                objUpdate.email = text
                this._onChangeDetail({ key: 'email', value: objUpdate.email })
              }}
            />
          </View>
          {(this.state.objUpdate.cApprovalAdvanceRequestId)
            ? <View>
              <View style={styles.viewRows}>
                <Text style={[styles.txtLabel, { flex: 2 }]}>Người duyệt</Text>
                <Text style={[styles.txtValue, { flex: 3 }]}>{approveName}</Text>
              </View>
              <View style={styles.viewRows}>
                <Text style={[styles.txtLabel, { flex: 2 }]}>Trạng thái duyệt</Text>
                <Text style={[styles.txtValue, { flex: 3 }]}>{status}</Text>
              </View>
              <View style={styles.viewRows}>
                <Text style={[styles.txtLabel, { flex: 2 }]}>Ngày duyệt</Text>
                <View style={styles.datePicker}>
                  <PickerDate
                    editable={this.props.enableEdit}
                    value={null}
                    width={WIDTHXD(296)}
                    onValueChange={date => {
                      this.setState({ clearingDueDate: date })
                    }
                    }
                    containerStyle={styles.containerStyle}
                  />
                </View>
              </View>
              <View style={styles.viewRows}>
                <Text style={[styles.txtLabel, { flex: 2 }]}>Lý do</Text>
                <Text style={[styles.txtValue, { flex: 3 }]}>{reason}</Text>
              </View>
            </View>
            : null}
        </View>
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    department: state.advanceRequestReducer.department,
    enableEdit: state.advanceRequestReducer.enableEdit,
  }
}


export default connect(mapStateToProps, {})(Details)

const styles = StyleSheet.create({
  ctn: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51
  },
  require: {
    color: 'red',
    fontSize: getFontXD(42),
    marginLeft: WIDTHXD(12)
  },
  btModal: {
    width: WIDTHXD(1040)
  },
  container: {
    width: getWidth(),
    backgroundColor: R.colors.white,
    paddingHorizontal: WIDTHXD(42),
    paddingVertical: WIDTHXD(52),
    marginTop: HEIGHTXD(30),
    justifyContent: 'flex-start',
    shadowColor: '#181F4D21',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  stt: {
    marginLeft: WIDTHXD(48),
    paddingLeft: WIDTHXD(24),
    paddingVertical: WIDTHXD(8)
  },
  datePicker: {
    flex: 3,
    justifyContent: 'flex-start',
  },
  containerStyle: {
    borderBottomWidth: WIDTHXD(3),
    borderBottomColor: R.colors.borderE6,
    borderRadius: 0,
    borderWidth: 0
  },
  viewStt: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: WIDTHXD(36)
  },
  txtLabel: {
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label
  },
  txtValue: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.black0,
  },
  input: {
    width: WIDTHXD(284),
    height: HEIGHTXD(90),
    borderRadius: WIDTHXD(20),
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
    marginLeft: WIDTHXD(44),
    paddingVertical: WIDTHXD(12),
    paddingLeft: WIDTHXD(12),
  },
  approval: {
    marginBottom: WIDTHXD(36),
  },
  viewRows: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: WIDTHXD(36),
  }
})
