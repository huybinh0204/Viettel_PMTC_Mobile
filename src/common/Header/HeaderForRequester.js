/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Image, Animated, TextInput, } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import NavigationService from 'routers/NavigationService';
import { HEIGHTXD, WIDTHXD, getFontXD, getLineHeightXD } from '../../config/Function';
import R from '../../assets/R';
import global from '../../features/RequestPartner/TabRequestPartner/global'

class HeaderForRequestParner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchFocus: new Animated.Value(0),
      searchString: null,
      isSearch: false,
      isHideAllGeneral: false,
    };
    global.updateHeader = this._updateHeader.bind(this)
  }

  _updateHeader = () => {
    this.setState({
      isHideAllGeneral: global.isHideGeneralInfor,
    })
  }

  _handleSearchFocus = (status) => {
    this.setState({ isSearch: true })
  }

  render() {
    const { isSearch } = this.state
    const { title, indexOfTab, typeOfIconTab, onChangeSearch, placeholderSearch, search, disableEye, attachmentTabIndex, setAttachmentTabIndex, disableSearch } = this.props;
    let attachmentIndex = this.props.attachmentIndex ? this.props.attachmentIndex : 2;

    let _title = title;
    if (indexOfTab === 1 && typeOfIconTab === 1) _title = 'Chi tiết hóa đơn';
    if (indexOfTab === attachmentIndex && attachmentTabIndex === 1) _title = 'Đính kèm';
    return (
      <LinearGradient
        colors={R.colors.colorHeaderGradienTab}
        style={styles.container}
      >
        <StatusBar backgroundColor={R.colors.colorMain} barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.wrapper}>
            <TouchableOpacity
              onPress={() => {
                if (this.state.isSearch && indexOfTab === 1) {
                  this.setState({ isSearch: false })
                  onChangeSearch && onChangeSearch('')
                } else if (indexOfTab === attachmentIndex && attachmentTabIndex === 1) {
                  // if in preview of attachment, goback to list attachments
                  global.goBackToListListAttackFile && global.goBackToListListAttackFile();
                  setAttachmentTabIndex && setAttachmentTabIndex(0);
                } else if (indexOfTab === 1 && typeOfIconTab === 1) {
                  global.goBackToListDetailInvoice()
                } else {
                  this.props.onPressLeft ? this.props.onPressLeft() : NavigationService.pop();
                }
              }}
              hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
            >
              <Fontisto name="angle-left" size={WIDTHXD(46)} color={R.colors.white} />
            </TouchableOpacity>
            {!(indexOfTab === 1 && typeOfIconTab === 0 && isSearch) && (
              <Text style={styles.title}>{_title}</Text>)}
          </View>
          <View style={styles.wrapper}>
            {
              ((indexOfTab === 0) || (indexOfTab === 1 && typeOfIconTab === 1)) && !disableEye && (
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={() => {
                    let { isHideAllGeneral } = this.state
                    global.hideGeneralInfor(isHideAllGeneral)
                    this.setState({ isHideAllGeneral: !isHideAllGeneral })
                  }}
                  hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
                >
                  <Image
                    source={(this.state.isHideAllGeneral ? R.images.openEye : R.images.iconEyeHide)}
                    style={styles.imageEye}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
              )
            }
            {
              indexOfTab === 1 && typeOfIconTab === 0 && !isSearch && !disableSearch && (
                <View style={styles.view}>
                  <TouchableOpacity
                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                    onPress={() => {
                      this._handleSearchFocus(true)
                    }
                    }
                    style={{ flex: 0 }}
                  >
                    <Image
                      resizeMode="contain"
                      source={R.images.iconSearch}
                      style={styles.btn}
                    />
                  </TouchableOpacity>
                </View>
              )
            }
            {indexOfTab === 1 && typeOfIconTab === 0 && isSearch && !disableSearch
              && (
                <View style={[styles.btnSearch, { width: WIDTHXD(917) }]}>
                  <TextInput
                    value={search}
                    onChangeText={onChangeSearch}
                    autoFocus={true}
                    placeholder={placeholderSearch}
                    style={styles.formEnterInfo}
                  />
                  <TouchableOpacity
                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                    onPress={() => onChangeSearch('')}
                    style={{ flex: 0 }}
                  >
                    <Ionicons
                      name="ios-search"
                      size={WIDTHXD(43)}
                      color="#8D8D8D"
                    />
                  </TouchableOpacity>
                </View>
              )
            }

          </View>
        </View>
      </LinearGradient>
    )
  }
}

function mapStateToProps(state) {
  return {
    typeOfIconTab: state.invoiceReducer.typeOfIconTab
  }
}

export default connect(mapStateToProps, {})(HeaderForRequestParner)
const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.colorMain,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingHorizontal: WIDTHXD(80),
    marginTop: HEIGHTXD(65)
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HEIGHTXD(99)
  },
  title: {
    color: '#fff',
    marginLeft: WIDTHXD(67.6),
    fontSize: getFontXD(54),
    lineHeight: getLineHeightXD(65),
    fontFamily: R.fonts.RobotoMedium,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEye: {
    height: HEIGHTXD(45.3),
    width: WIDTHXD(73)
  },
  btn: {
    height: WIDTHXD(75),
    width: WIDTHXD(75),
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: WIDTHXD(30),
    alignItems: 'center',
    marginLeft: WIDTHXD(40),
    height: HEIGHTXD(99),
    backgroundColor: R.colors.white,
    borderRadius: WIDTHXD(20),
  },
  formEnterInfo: {
    width: WIDTHXD(800),
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoMedium,
    paddingVertical: 0
  },
})
