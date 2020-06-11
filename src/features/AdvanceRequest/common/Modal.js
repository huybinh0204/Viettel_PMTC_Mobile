import React, { Component } from 'react';
import {
  Text, View, Modal, TouchableOpacity, FlatList, StyleSheet,
  TouchableWithoutFeedback, TextInput, StyleProp, ViewStyle, TextStyle
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign';
import R from '../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, ellipsis } from '../../../config/Function';
import AdvanceRequest from '../../../apis/Functions/advanceRequest';


type Props = {
  title: string,
  placeholder: string,
  titleStyle: StyleProp<TextStyle>,
  containerStyle: StyleProp<ViewStyle>,
  textInputStyle: StyleProp<TextStyle>,
  inputStyle: StyleProp<ViewStyle>,
  listResultStyle: StyleProp<ViewStyle>,
  textResultStyle: StyleProp<TextStyle>,
  buttonShowModal: StyleProp<ViewStyle>,
  onValueChange: Function,
  keyApi: string,
  value: string,
  paymentOrgId: number,
  cCostCategoryId: number,
  id: Number,
  require: Boolean,
  label: String,
}

type State = {
  modalVisible: boolean,
  isLoadingFooter: boolean,
  valueSearch: string,
}

/**
 * @param modalVisible show Modal
 * @param placeholder placeholder of text input search
 * @param titleStyle title style of modal
 * @param containerStyle style modal
 * @param textInputStyle style of text input search in modal
 * @param inputStyle style of input in modal
 * @param listResultStyle style of flatlist result
 * @param buttonShowModal style of button show modal
 * @param key api
 */

class ModalSearch extends Component<Props, State> {
  timeout

  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisible: false,
      isLoadingFooter: false,
      valueSearch: '',
      result: [],
      resultSearch: {},
      keySearch: '',
      key: '',
    }
  }

  async componentDidMount() {
    if (this.props.value) {
      this.setState({ valueSearch: this.props.value })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value && nextProps.value) {
      this.setState({ valueSearch: nextProps.value })
    }
  }

  _deleteItemLoadMore = (result) => {
    _.forEach(result, (item, index) => {
      if (item.name === 'Tìm kiếm thêm' || item.text === 'Tìm kiếm thêm' || item.displayname === 'Tìm kiếm thêm') {
        result.splice(index, 1)
      }
    })
    this.setState({ result })
  }

  _setTimeoutSearch = () => {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(async () => {
      this._getPayment()
    }, 500)
  }

  _getPayment = async () => {
    const { keyApi, transDate, cDepartmentId } = this.props;
    let body = {
      isSize: true, name: this.state.keySearch, adOrgId: this.props.adOrgId, isNotRequiredUser: true,
    }
    switch (keyApi) {
      case 'payUnit':
        try {
          const response = await AdvanceRequest.getListPayUnit(body)
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (error) {
        }
        break;
      case 'debtRecevingUnit':
        try {
          const response = await AdvanceRequest.debtRecevingUnit(body)
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (error) {
        }
        break;
      case 'contract':
        try {
          const response = await AdvanceRequest.getContract(body)
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (error) {
        }
        break
      case 'itemFee':
        try {
          const response = await AdvanceRequest.getListItemFee(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break;
      case 'position':
        try {
          const response = await AdvanceRequest.getPosition(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break;
      case 'project':
        try {
          const response = await AdvanceRequest.getProject(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break;
      case 'debtSubject':
        try {
          const response = await AdvanceRequest.getListDebtSubject(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break;
      case 'funding':
        try {
          const response = await AdvanceRequest.getFunding(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break;
      case 'paymentType':
        try {
          const response = await AdvanceRequest.paymentType(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break;
      case 'costFactor':
        try {
          const response = await AdvanceRequest.getListCostFactor(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break;
      case 'bank':
        try {
          const response = await AdvanceRequest.bank(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break;
      case 'benefitBank':
        try {
          body.cBpartnerId = this.props.cBpartnerId;
          const response = await AdvanceRequest.benefitBank(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break;
      case 'statement':
        try {
          const newBody = {}
          newBody.documentNo = this.state.keySearch
          newBody.docStatus = 'CO'
          newBody.isFinish = 'N'
          newBody.transDate = transDate
          newBody.cDepartmentId = cDepartmentId
          const response = await AdvanceRequest.listStateMent(newBody);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break;
      case 'departmentApproval':
        try {
          const newBody = { adOrgId: this.props.adOrgId, isSize: true, isFinanceDepartment: 'Y', }
          if (this.props.length === 0) body = newBody
          const response = await AdvanceRequest.departmentApproval(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break;
      case 'signer':
        try {
          const response = await AdvanceRequest.listSigner(this.state.keySearch)
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break;
      case 'roleSigner':
        if (this.props.id) {
          try {
            const response = await AdvanceRequest.roleSigner({ employeeId: this.props.id, position: this.state.keySearch })
            if (response && response.status === 200) {
              this._deleteItemLoadMore(response.data)
            }
          } catch (err) {
          }
        }
        break;
      case 'cBpartner':
        try {
          const response = await AdvanceRequest.getPartners(body)
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break
      default:
        break
    }
  }

  _renderName = (item) => {
    let { name } = item;
    switch (this.props.keyApi) {
      case 'payUnit':
        name = item.text;
        break
      case 'statement':
        name = item.documentNo
        break
      case 'signer':
        name = item.displayname
        break
      default:
        return name;
    }
    return name;
  }

  _onPressItem = (item) => {
    let { resultSearch, valueSearch } = this.state;
    const { name } = item;
    switch (this.props.keyApi) {
      case 'payUnit':
        valueSearch = name;
        this.props.onValueChange({ id: item.adOrgId, name });
        break;
      case 'debtRecevingUnit':
        valueSearch = name;
        this.props.onValueChange({ id: item.fwmodelId, name });
        break;
      case 'contract':
        valueSearch = name;
        this.props.onValueChange({ id: item.contractId, name });
        break;
      case 'itemFee':
        valueSearch = name;
        this.props.onValueChange({ id: item.cCostTypeId, name });
        break;
      case 'project':
        valueSearch = name;
        this.props.onValueChange({ id: item.projectId, name });
        break;
      case 'position':
        valueSearch = name;
        this.props.onValueChange({ id: item.cSiteCodeInfoId, name });
        break;
      case 'funding':
        valueSearch = name;
        this.props.onValueChange({ id: item.cbudgetId, name });
        break;
      case 'paymentType':
        valueSearch = name;
        this.props.onValueChange({ id: item.fwmodelId, name });
        break;
      case 'debtSubject':
        valueSearch = name;
        this.props.onValueChange({ id: item.cBpartnerId, name });
        break;
      case 'costFactor':
        valueSearch = name;
        this.props.onValueChange({ id: item.fwmodelId, name });
        break;
      case 'bank':
        valueSearch = name;
        this.props.onValueChange({ id: item.bankId, name });
        break;
      case 'benefitBank':
        valueSearch = name;
        this.props.onValueChange({
          id: item.cBpartnerBankId,
          accountNo: item.accountNo,
          cBankName: item.cBankName,
          cBankId: item.cBankId,
          name
        });
        break;
      case 'statement':
        valueSearch = item.documentNo;
        this.props.onValueChange({ id: item.fwmodelId, name: item.documentNo });
        break;
      case 'departmentApproval':
        valueSearch = item.name;
        this.props.onValueChange(item.cDepartmentId);
        break;
      case 'signer':
        valueSearch = item.displayname
        this.props.onValueChange({ id: item.cOfficestaffId, name: item.displayname });
        break
      case 'roleSigner':
        valueSearch = item.rolename
        this.props.onValueChange({ id: item.cOfficepositionId, name: item.rolename });
        break
      case 'cBpartner':
        valueSearch = item.rolename
        this.props.onValueChange({ id: item.fwmodelId, name: item.name });
        break
      default:
        this.props.onValueChange({ id: '', name: '' });
        break;
    }
    this.setState({ resultSearch, valueSearch, modalVisible: false })
  }

  render() {
    const { containerStyle, title, titleStyle, buttonShowModal, placeholder, id, require, label } = this.props;
    return (
      <View>
        {label ? <View style={{ flexDirection: 'row', }}>
          <Text style={styles.label}>{label}</Text>
          {require ? <Text style={styles.require}>*</Text> : null}
        </View>
          : null}
        <TouchableOpacity
          disabled={!this.props.enableEdit}
          style={[styles.buttonShowModal, buttonShowModal]}
          onPress={() => this.setState({ modalVisible: true, keySearch: '' },
            () => this._getPayment())}
        >
          <View style={styles.flexRowJustifyBetween}>
            <Text style={styles.txtTitle}>{ellipsis(this.state.valueSearch, 36)}</Text>
            {this.state.valueSearch === ''
              ? <TouchableOpacity
                disabled={!this.props.enableEdit}
                onPress={() => this.setState({ modalVisible: true })}
                hitSlop={{ left: WIDTHXD(50), right: WIDTHXD(50) }}
              >
                <AntDesign name="search1" size={WIDTHXD(43)} color={R.colors.iconGray} />
              </TouchableOpacity>
              : <TouchableOpacity
                disabled={!this.props.enableEdit}
                onPress={() => {
                  this._onPressItem({ name: '', value: '' })
                  this.setState({ valueSearch: '' })
                }}
                hitSlop={{ left: WIDTHXD(50), right: WIDTHXD(50) }}>
                <AntDesign name="close" size={WIDTHXD(43)} color={R.colors.iconGray} />
              </TouchableOpacity>
            }
          </View>
        </TouchableOpacity>
        <Modal
          animated={true}
          animationType="fade"
          ref={ref => { this.refModal = ref }}
          visible={this.state.modalVisible}
          transparent={true}
        >
          <TouchableWithoutFeedback
            onPress={() => this.setState({ modalVisible: false })}
          >
            <View style={styles.overViewModal}>
              <TouchableWithoutFeedback>
                <View style={[containerStyle, styles.container]}>
                  <View style={styles.viewTitle}>
                    <Text style={[titleStyle, styles.title]}>{title}</Text>
                    <TouchableOpacity
                      style={styles.btClose}
                      onPress={() => this.setState({ modalVisible: false })}
                    >
                      <AntDesign name="close" size={WIDTHXD(48)} color={R.colors.black0} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.viewContent}>
                    <View style={styles.inputSearch}>
                      <AntDesign name="search1" size={WIDTHXD(40)} color={R.colors.iconGray} style={{ position: 'absolute', left: WIDTHXD(28) }} />
                      <TextInput
                        style={styles.input}
                        placeholderTextColor={R.colors.color777}
                        value={this.state.keySearch}
                        placeholder={placeholder || 'Tìm kiếm'}
                        onChangeText={keySearch => this.setState({ keySearch }, () => this._setTimeoutSearch())}
                      />
                    </View>
                    {!_.isEmpty(this.state.result)
                      ? <View style={styles.viewResult}>
                        <FlatList
                          data={this.state.result}
                          extraData={this.state}
                          style={styles.flatlist}
                          renderItem={({ item, index }) => (
                            <TouchableOpacity
                              style={[styles.btItem, { backgroundColor: (item.fwmodelId === id && item.fwmodelId && id) ? R.colors.backgrPicker : '' }]}
                              onPress={() => this._onPressItem(item)}
                            >
                              <Text style={styles.txtResult}>{this._renderName(item)}</Text>
                            </TouchableOpacity>
                          )
                          }
                        />
                      </View>
                      : <Text style={styles.txtEmpty}>Không có kết quả</Text>}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>

        </Modal>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
    adUserId: state.userReducers.userData.adUserId,
  }
}

export default connect(mapStateToProps, {})(ModalSearch)

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: WIDTHXD(1004),
    height: HEIGHTXD(1650),
    borderRadius: WIDTHXD(30),
  },
  txtDelete: {
    color: R.colors.iconGray,
    fontSize: getFontXD(38)
  },
  require: {
    color: 'red',
    fontSize: getFontXD(36),
    marginLeft: WIDTHXD(12)
  },
  label: {
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    marginBottom: HEIGHTXD(8)
  },
  txtEmpty: {
    textAlign: 'center',
    color: R.colors.black0,
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    marginTop: HEIGHTXD(48)
  },
  viewTitle: {
    width: WIDTHXD(1004),
    height: HEIGHTXD(85),
    marginTop: WIDTHXD(50),
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  txtTitle: {
    marginRight: WIDTHXD(24),
    color: R.colors.black0,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular
  },
  viewContent: {
    marginTop: WIDTHXD(75),
    marginBottom: WIDTHXD(36),
    paddingHorizontal: WIDTHXD(46),
  },
  inputSearch: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
  },
  viewResult: {
    marginTop: WIDTHXD(37),
    paddingBottom: WIDTHXD(54)
  },
  flatlist: {
    width: WIDTHXD(914),
    height: HEIGHTXD(1150),
    borderWidth: 0.3,
    borderRadius: WIDTHXD(20),
    borderColor: R.colors.borderD4,
  },
  btItem: {
    paddingVertical: WIDTHXD(6),
    justifyContent: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: R.colors.borderD4,
    minHeight: HEIGHTXD(100),
  },
  txtResult: {
    paddingLeft: WIDTHXD(28),
    paddingRight: WIDTHXD(28),
  },
  input: {
    width: WIDTHXD(914),
    height: WIDTHXD(99),
    borderRadius: WIDTHXD(20),
    borderWidth: 0.3,
    borderColor: R.colors.borderD4,
    fontSize: getFontXD(35),
    fontFamily: R.fonts.RobotoRegular,
    paddingLeft: WIDTHXD(90),
    paddingVertical: 0,
    color: R.colors.black0,
  },
  flexRow: {
    flexDirection: 'row',
  },
  title: {
    textAlign: 'center',
    alignItems: 'center',
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(48),
    color: R.colors.blue255,
  },
  buttonShowModal: {
    width: WIDTHXD(1064),
    height: HEIGHTXD(100),
    borderRadius: WIDTHXD(20),
    backgroundColor: R.colors.white,
    borderColor: R.colors.iconGray,
    borderWidth: 0.3,
    justifyContent: 'center',
  },
  flexRowJustifyBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WIDTHXD(24),
  },
  overViewModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#rgba(0,0,0,0.7)',
  },
  btClose: {
    alignSelf: 'center',
    position: 'absolute',
    right: WIDTHXD(48),
    width: WIDTHXD(48),
    height: WIDTHXD(48),
  },
})
