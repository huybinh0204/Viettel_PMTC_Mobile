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
import InvoiceGroupRequest from '../../../apis/Functions/apInvoiceGroupStatement';


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
    if (nextProps.value !== this.props.value) {
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
    const body = {
      isSize: true, name: this.state.keySearch, adOrgId: this.props.adOrgId, isNotRequiredUser: true,
    }
    switch (keyApi) {
      case 'costFactor':
        try {
          const response = await InvoiceGroupRequest.getListCostFactor(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (err) {
        }
        break;
      case 'partner':
        try {
          const response = await InvoiceGroupRequest.getPartner(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (error) { }
        break;
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
      case 'departmentApproval':
        name = item.departmentName
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
      case 'costFactor':
        valueSearch = name;
        this.props.onValueChange({ id: item.fwmodelId, name });
        break;

      case 'partner':
        valueSearch = name;
        this.props.onValueChange({ id: item.fwmodelId, name });
        break;
      default:
        break;
    }
    this.setState({ resultSearch, valueSearch, modalVisible: false })
  }

  render() {
    const { containerStyle, title, titleStyle, buttonShowModal, placeholder, id, isReadOnly } = this.props;
    return (
      <View>
        <TouchableOpacity
          style={[styles.buttonShowModal, buttonShowModal]}
          onPress={() => {
            if (!isReadOnly) {
              this.setState({ modalVisible: true, keySearch: '' },
                () => this._getPayment())
            }
          }}>
          <View style={styles.flexRowJustifyBetween}>
            <Text style={styles.txtTitle}>{ellipsis(this.state.valueSearch, 36)}</Text>
            {isReadOnly ? null : <View>
              {this.state.valueSearch === ''
                ? <TouchableOpacity
                  onPress={() => this.setState({ modalVisible: true })}
                  hitSlop={{ left: WIDTHXD(50), right: WIDTHXD(50) }}
                >
                  <AntDesign name="search1" size={WIDTHXD(43)} color={R.colors.iconGray} />
                </TouchableOpacity>
                : <TouchableOpacity
                  onPress={() => {
                    this._onPressItem({ name: '', value: '' })
                    this.setState({ valueSearch: '' })
                  }}
                  hitSlop={{ left: WIDTHXD(50), right: WIDTHXD(50) }}
                >
                  <AntDesign name="close" size={WIDTHXD(43)} color={R.colors.iconGray} />
                </TouchableOpacity>
              }
            </View>}
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
            onPress={() => this.setState({ modalVisible: false })}>
            <View style={styles.overViewModal}>
              <TouchableWithoutFeedback>
                <View style={[containerStyle, styles.container]}>
                  <View style={styles.viewTitle}>
                    <Text style={[titleStyle, styles.title]}>{title}</Text>
                    <TouchableOpacity
                      style={styles.btClose}
                      onPress={() => this.setState({ modalVisible: false })}>
                      <AntDesign name="close" size={WIDTHXD(48)} color={R.colors.black0} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.viewContent}>
                    <View style={styles.inputSearch}>
                      <AntDesign name="search1" size={WIDTHXD(40)} color={R.colors.iconGray} style={{ position: 'absolute', left: WIDTHXD(28) }} />
                      <TextInput
                        style={styles.input}
                        value={this.state.keySearch}
                        placeholder={placeholder || 'Tìm kiếm'}
                        placeholderTextColor={R.colors.color777}
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
    adUserId: state.userReducers.userData.loggedIn.adUserId,
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
    color: R.colors.black0
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
  btItem: {
    paddingVertical: WIDTHXD(6),
    // paddingBottom: WIDTHXD(18),
    justifyContent: 'center',
    borderBottomWidth: WIDTHXD(1),
    borderBottomColor: R.colors.borderD4,
  },
  txtResult: {
    paddingLeft: WIDTHXD(28),
    paddingRight: WIDTHXD(28),
    lineHeight: HEIGHTXD(100),
    // width: '100%'
    // textAlign: 'center'
  }
})
