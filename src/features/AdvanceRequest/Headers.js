import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { connect } from 'react-redux';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { HEIGHTXD, WIDTHXD, getFontXD, getLineHeightXD, getWidth, ellipsis } from '../../config/Function';
import NavigationService from '../../routers/NavigationService'
import R from '../../assets/R';
import { searchKeyword, filterAdvanceRequest, showAllField, actionInputSearch } from '../../actions/advanceRequest'
import DialogSearch from './DialogFilter';
import global from './global'

class HeaderAdvanceRequest extends React.Component {
  timeoutSearch

  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      showInputSearch: false,
      showIconSearch: true,
      hideIconEye: true,
      indexIcon: global.SHOW_ICON_EYE,
      objExpanded: { expandedGeneral: true, expandedMoney: true, expandedStatus: true, expandedVOffice: true },
      placeHolder: 'Số chứng từ, số tiền'
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.indexIcon !== this.props.indexIcon) {
      this.setState({ indexIcon: nextProps.indexIcon, showInputSearch: false, keyword: '' })
    }
    if ((nextProps.inputSearch !== this.props.inputSearch) && !nextProps.inputSearch) {
      this.setState({ showInputSearch: false, keyword: '' })
    }
    if (nextProps.objExpanded !== this.state.objExpanded) {
      this.setState({ objExpanded: nextProps.objExpanded })
    }
    if (nextProps.tabActive !== this.props.tabActive) {
      this._renderPlaceholder(nextProps.tabActive)
    }
  }

  _renderPlaceholder = (tabActive) => {
    let placeHolder = 'Số chứng từ, số tiền'
    switch (tabActive) {
      case 1:
        if (this.props.title === 'Bảng THTT') {
          placeHolder = 'Tên người bán, nội dung, số hoá đơn, số tiền'
        } else {
          placeHolder = 'Nội dung, số tiền'
        }
        break
      case 3:
        placeHolder = 'Email'
        break
      default:
        placeHolder
        break
    }
    this.setState({ placeHolder })
  }

  _search = (keyword) => {
    clearTimeout(this.timeoutSearch)
    this.timeoutSearch = setTimeout(async () => {
      this.props.searchKeyword(keyword, this.props.tabActive)
    }, 500)
  }

  _onPressConfirm = (filter) => {
    this.props.filterAdvanceRequest(Object.assign({}, filter), this.props.tabActive)
  }

  _renderIconEye = () => {
  }

  _checkInputFilter = () => {
    let input = []
    switch (this.props.tabActive) {
      case global.LIST_ADVANCER_REQUEST:
        input = [
          {
            title: 'Trạng thái tài liệu',
            data: R.strings.local.TRANG_THAI_TAI_LIEU_ADVANCE_REQUEST,
            key: 'docstatus'
          },
          {
            title: 'Trạng thái duyệt',
            data: R.strings.local.TRANG_THAI_DUYET_ADVANCE_REQUEST,
            key: 'approveStatus'
          },
          {
            title: 'Trạng thái ký',
            data: R.strings.local.TRANG_THAI_KY_FILTER,
            key: 'signerstatus'
          },
          {
            title: 'Trạng thái chi',
            data: R.strings.local.TRANG_THAI_CHI_FILTER,
            key: 'paymentStatus'
          },
        ]
        break
      case global.LIST_APPROVAL_INFO:
        input = [
          {
            title: 'Trạng thái duyệt',
            data: R.strings.local.TRANG_THAI_DUYET_ADVANCE_REQUEST,
            key: 'approveStatus'
          }
        ]
        break
      case global.LIST_PAY_INFO:
        input = [
          {
            title: 'Trạng thái hạch toán',
            data: R.strings.local.TRANG_THAI_HACH_TOAN,
            key: 'status'
          },
        ]
        break;
      default:
        break
    }
    return input
  }

  _pressIconEye = () => {
    this.setState({ hideIconEye: !this.state.hideIconEye },
      () => this.props.showAllField(this.state.hideIconEye))
  }

  _renderIconHeader = () => {
    const { showInputSearch, hideIconEye } = this.state
    switch (this.props.indexIcon) {
      case global.SHOW_DOUBLE_ICON:
        return (
          <View style={styles.viewSearchFilter}>
            {!showInputSearch
              ? <TouchableOpacity
                onPress={() => this.setState({ showInputSearch: true }, () => this.props.actionInputSearch(true))}
                style={styles.btn}
              >
                <Image
                  resizeMode="contain"
                  source={R.images.iconSearch}
                  style={styles.btn}
                />
              </TouchableOpacity>
              : null}
            <TouchableOpacity
              onPress={() => {
                this.DialogSearch.setModalVisible(true)
              }}
              style={styles.btn}
            >
              <Image
                resizeMode="contain"
                source={R.images.iconFilter}
                style={styles.btn}
              />
            </TouchableOpacity>
          </View>
        )
      case global.SHOW_ICON_EYE:
        return (
          <View>
            {hideIconEye
              ? <TouchableOpacity
                style={styles.button}
                hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
                onPress={() => this._pressIconEye()}
              >
                <Image
                  source={R.images.iconEyeHide}
                  style={styles.imageEye}
                  resizeMode="stretch"
                />
              </TouchableOpacity>
              : <TouchableOpacity
                style={styles.button}
                hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
                onPress={() => this._pressIconEye()}
              >
                <Image
                  source={R.images.openEye}
                  style={styles.imageEye}
                  resizeMode="stretch"
                />
              </TouchableOpacity>
            }
          </View>
        )
      case global.SHOW_ICON_SEARCHKEY:
        return (
          <View>
            {!showInputSearch
              ? <TouchableOpacity
                style={styles.dcm}
                onPress={() => this.setState({ showInputSearch: true }, () => this.props.actionInputSearch(true))}
                hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
              >
                <Ionicons name="ios-search" size={WIDTHXD(55)} color={R.colors.white} />
              </TouchableOpacity>
              : null}
          </View>
        )
      case global.HIDE_ICON:
        return null
      default:
        return null
    }
  }

  render() {
    const { title, colorTab } = this.props;
    const { showInputSearch, indexIcon, keyword } = this.state
    let color = !colorTab ? R.colors.colorHeaderGradien : R.colors.colorHeaderGradienTab
    let paddingBottom = !colorTab ? WIDTHXD(36) : WIDTHXD(0)
    return (
      <LinearGradient
        style={[styles.container, { paddingBottom }]}
        colors={color}
      >
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <TouchableOpacity
              onPress={() => {
                if (this.props.savedBeforeExit) {
                  this.props.checkSave(true)
                } else {
                  if (showInputSearch) {
                    this.setState({ showInputSearch: false, keyword: '' })
                  } else if (indexIcon === 0 && this.props.tabActive === 1) {
                    global.goBackToListDetail()
                  } else if (indexIcon === -1 && this.props.tabActive === 3) {
                    global.goBackToListApprovalInfo()
                  } else if (indexIcon === -1 && this.props.tabActive === 4) {
                    global.goBackToListPayInfo()
                  } else {
                    NavigationService.pop()
                  }
                }
              }}
              hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
            >
              <Fontisto name="angle-left" size={WIDTHXD(46)} color={R.colors.white} />
            </TouchableOpacity>
            {
              !showInputSearch
                ? <Text style={styles.title}>{title}</Text>
                : <View style={styles.view}>
                  <TextInput
                    multiline={false}
                    value={keyword}
                    autoFocus={true}
                    placeholderTextColor={R.colors.placeHolder}
                    style={!_.isEmpty(keyword) ? styles.inputSearch : styles.inputSearchPlaceholder}
                    placeholder={ellipsis(this.state.placeHolder, 34)}
                    onChangeText={text => this.setState({ keyword: text }, () => this._search(this.state.keyword))}
                  />
                  <Ionicons
                    style={styles.iconSearch}
                    name="ios-search"
                    size={WIDTHXD(55)}
                    color={R.colors.iconGray}
                  />
                </View>
            }
          </View>
          <View style={styles.rightHeader}>
            {this._renderIconHeader()}
          </View>
          <DialogSearch
            title="Lọc đề nghị thanh toán"
            modalVisible={this.state.modalVisible}
            ref={ref => { this.DialogSearch = ref }}
            onPressConfirm={this._onPressConfirm}
            titleStyle={styles.titleStyle}
            buttonStyle={styles.buttonStyle}
            textButtonStyle={styles.textButtonStyle}
            textButton="ĐỒNG Ý"
            data={this._checkInputFilter()}
          />
        </View>
      </LinearGradient>
    )
  }
}

function mapStateToProps(state) {
  return {
    iconHeaderReducer: state.advanceRequestReducer,
    inputSearch: state.advanceRequestReducer.inputSearch,
    showAllFieldGroup: state.advanceRequestReducer.showAllFieldGroup,
    objExpanded: state.advanceRequestReducer.objExpanded,
    savedBeforeExit: state.advanceRequestReducer.savedBeforeExit,
  }
}

export default connect(mapStateToProps,
  { searchKeyword, filterAdvanceRequest, showAllField, actionInputSearch })(HeaderAdvanceRequest);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'purple'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: WIDTHXD(30),
    width: getWidth(),
    height: HEIGHTXD(200),
  },
  leftHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: WIDTHXD(54)
  },
  btn: {
    height: WIDTHXD(75),
    width: WIDTHXD(75),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WIDTHXD(24)
  },
  rightHeader: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTHXD(1064),
    marginRight: WIDTHXD(60)
  },
  title: {
    color: '#fff',
    marginLeft: WIDTHXD(67.6),
    fontSize: getFontXD(54),
    lineHeight: getLineHeightXD(65),
    fontFamily: R.fonts.RobotoMedium,
  },
  viewSearchFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: WIDTHXD(210),
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEye: {
    height: HEIGHTXD(45.3),
    width: WIDTHXD(73),
    marginRight: WIDTHXD(24)
  },
  dcm: {
    backgroundColor: R.colors.colorRGBA040,
    height: WIDTHXD(75),
    width: WIDTHXD(75),
    borderRadius: WIDTHXD(50),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WIDTHXD(24)
  },
  inputSearch: {
    width: WIDTHXD(780),
    height: HEIGHTXD(132),
    borderRadius: WIDTHXD(20),
    paddingRight: WIDTHXD(120),
    paddingLeft: WIDTHXD(36),
    backgroundColor: R.colors.white,
    fontSize: getFontXD(36),
    fontStyle: 'normal',
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0
  },
  inputSearchPlaceholder: {
    width: WIDTHXD(780),
    height: HEIGHTXD(132),
    borderRadius: WIDTHXD(20),
    paddingRight: WIDTHXD(120),
    paddingLeft: WIDTHXD(36),
    backgroundColor: R.colors.white,
    fontSize: getFontXD(36),
    fontStyle: 'italic',
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.placeHolder
  },
  iconSearch: {
    right: WIDTHXD(64)
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    width: WIDTHXD(780),
    marginLeft: WIDTHXD(40),
  },
})
