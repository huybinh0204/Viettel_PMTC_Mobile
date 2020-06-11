import React, { Component } from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform
} from 'react-native';
import _ from 'lodash';
import AntDesign from 'react-native-vector-icons/AntDesign';
import R from '../../../assets/R';
import {
  HEIGHTXD,
  WIDTHXD,
  getFontXD,
  getWidth,
  ellipsis
} from '../../../config/Function';
import {
  getPartner,
  getDepartmentFull,
  getFeild,
  getBudget,
  getCostType,
  getActivity
} from '../../../apis/Functions/statement';

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

export default class AutoCompleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      isLoadingFooter: false,
      valueSearch: '',
      keySearch: "",
      result: [],
      resultSearch: {}
    };
  }

  componentDidMount() {
    this.setState({ valueSearch: this.props.name });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) this.setState({ valueSearch: nextProps.name || "" })
  }

  _getPayment = async () => {
    const body = {
      isSize: true,
      adOrgId: 1000000,
      name: this.state.keySearch
    };
    switch (this.props.keyApi) {
      case 'partner':
        try {
          const response = await getPartner(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (error) { }
        break;
      case 'departmentFull':
        try {
          const response = await getDepartmentFull(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (error) { }
        break;
      case 'field':
        try {
          const response = await getFeild(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (error) { }
        break;
      case 'budget':
        try {
          const response = await getBudget(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (error) { }
        break;
      case 'costType':
        try {
          const response = await getCostType(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (error) { }
        break;
      case 'activity':
        try {
          const response = await getActivity(body);
          if (response && response.status === 200) {
            this._deleteItemLoadMore(response.data)
          }
        } catch (error) { }
        break;
      default:
        break;
    }
  };

  _renderName = item => {
    let name = '';
    switch (this.props.keyApi) {
      case 'partner':
        name = item.text;
        break;
      case 'departmentFull':
        // eslint-disable-next-line prefer-destructuring
        name = item.name;
        break;
      case 'field':
        name = item.text;
        break;
      case 'budget':
        name = item.text;
        break;
      case 'costType':
        name = item.text;
        break;
      case 'activity':
        name = item.text;
        break;
      default:
        return name;
    }
    return name;
  };

  _onPressItem = item => {
    let { resultSearch, valueSearch } = this.state;
    const { text } = item;
    switch (this.props.keyApi) {
      case 'partner':
        resultSearch = item;
        valueSearch = text;
        this.props.onChange(item);
        break;
      case 'departmentFull':
        resultSearch = item;
        valueSearch = text;
        this.props.onChange(item);
        break;
      case 'field':
        resultSearch = item;
        valueSearch = text;
        this.props.onChange(item);
        break;
      case 'budget':
        resultSearch = item;
        valueSearch = text;
        this.props.onChange(item);
        break;
      case 'costType':
        resultSearch = item;
        valueSearch = text;
        this.props.onChange(item);
        break;
      case 'activity':
        resultSearch = item;
        valueSearch = text;
        this.props.onChange(item);
        break;
      default:
        break;
    }
    this.setState({ resultSearch, valueSearch, modalVisible: false });
  };

  _deleteItemLoadMore = (result) => {
    const resultTmp = _.forEach(result, (item, index) => {
      if (item.name === 'Tìm kiếm thêm' || item.text === 'Tìm kiếm thêm') {
        result.splice(index, 1)
      }
    })
    this.setState({ result })
  }

  render() {
    const {
      containerStyle,
      title,
      titleStyle,
      buttonShowModal,
      placeholder,
      keyApi,
      id
    } = this.props;
    return (
      <View>
        <TouchableOpacity
          style={[buttonShowModal, styles.buttonShowModal]}
          onPress={() => {
            this.setState({ modalVisible: true });
            this._getPayment();
          }}
        >
          <View style={styles.flexRowJustifyBetween}>
            <Text style={{ padding: 0, flex: 1, fontSize: getFontXD(42) }}>{this.state.valueSearch}</Text>
            {/* {<Text style={styles.txtTitle}>{ellipsis(this.state.valueSearch, 36)}</Text>} */}
            {!this.state.valueSearch
              ? <TouchableOpacity
                onPress={() => this.setState({ modalVisible: true })}
                hitSlop={{ left: WIDTHXD(50), right: WIDTHXD(50) }}
              >
                <AntDesign name="search1" size={WIDTHXD(43)} color={R.colors.iconGray} />
              </TouchableOpacity>
              : <TouchableOpacity
                onPress={() => {
                  this.props.onChange({})
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
          ref={ref => {
            this.refModal = ref;
          }}
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
                      <AntDesign
                        name="close"
                        size={WIDTHXD(48)}
                        color={R.colors.black0}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.viewContent}>
                    <View style={styles.inputSearch}>
                      <AntDesign
                        name="search1"
                        size={WIDTHXD(40)}
                        color={R.colors.iconGray}
                        style={{ position: 'absolute', left: WIDTHXD(28) }}
                      />
                      <TextInput
                        style={styles.input}
                        value={this.state.keySearch}
                        placeholder={placeholder || 'Tìm kiếm'}
                        placeholderTextColor={R.colors.color777}
                        onChangeText={keySearch => this.setState({ keySearch }, () => setTimeout(() => {
                          this._getPayment();
                        }, 500))
                        }
                      />
                    </View>
                    {!_.isEmpty(this.state.result) ? (
                      <View style={styles.viewResult}>
                        <FlatList
                          data={this.state.result}
                          extraData={this.state}
                          style={styles.flatlist}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity
                                style={[styles.btItem,
                                {
                                  backgroundColor: (id && (item.id === id || item.fwmodelId === id)) ?
                                    R.colors.backgrPicker : ''
                                }]}
                                onPress={() => this._onPressItem(item)}
                              >
                                <Text style={styles.txtResult}>
                                  {this._renderName(item)}
                                </Text>
                              </TouchableOpacity>
                            )
                          }}
                        />
                      </View>
                    ) : (<Text style={styles.viewTitleA}>Không tìm thấy dữ liệu</Text>)}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: WIDTHXD(1004),
    // maxHeight: HEIGHTXD(1650),
    height: HEIGHTXD(1650),
    // height: HEIGHTXD(Platform.OS === 'android' ? 1500 : 1400),
    borderRadius: WIDTHXD(30),
  },
  viewTitle: {
    width: WIDTHXD(1004),
    height: HEIGHTXD(85),
    marginTop: WIDTHXD(50),
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  viewTitleA: {
    textAlign: 'center',
    color: R.colors.black0,
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    marginTop: HEIGHTXD(48)
  },
  btItem: {
    paddingVertical: WIDTHXD(6),
    // paddingVertical: WIDTHXD(18),
    // paddingBottom: WIDTHXD(18),
    justifyContent: 'center',
    borderBottomWidth: WIDTHXD(1),
    borderBottomColor: R.colors.borderD4
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
    borderColor: R.colors.borderGray,
    borderWidth: 0.3,
    justifyContent: 'center',
    marginTop: HEIGHTXD(11),
  },
  flexRowJustifyBetween: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WIDTHXD(24),
    height: HEIGHTXD(100),
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
  txtResult: {
    paddingLeft: WIDTHXD(28),
    paddingRight: WIDTHXD(28),
    lineHeight: HEIGHTXD(100),
    // textAlign: 'center'
    // borderBottomWidth: WIDTHXD(1),
    // borderColor: R.colors.borderD4,
  }
})