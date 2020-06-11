import React, { Component } from 'react'
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import R from 'assets/R'
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'assets/languages/i18n';
import { TextInput } from 'react-native-gesture-handler';
import { getWidth, WIDTHXD, HEIGHTXD, getFontXD, getLineHeightXD, checkFormatItem, numberWithCommas } from '../../../../../../config'
import global from '../../../../global'


export default class MoneyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    global.hideDetailMoneyInfor = this._hideDetailMoneyInfor.bind(this)
  }

  _hideDetailMoneyInfor = (isHide) => {
    this.setState({ expanded: isHide })
  }

  changeLayout = () => {
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
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { expanded } = this.state;
    global.isHideDetailMoneyInfor = !expanded
    global.updateHeader()
    const { requestBeforeTaxAmount, requestTaxAmount, requestAmount, approvedBeforeTaxAmount, approvedTaxAmount, approvedAmount } = this.props
    const data = [
      { title: 'Tiền trước thuế', suggestion: checkFormatItem(requestBeforeTaxAmount) ? numberWithCommas(requestBeforeTaxAmount) : 0, approved: checkFormatItem(approvedBeforeTaxAmount) ? numberWithCommas(approvedBeforeTaxAmount) : 0 },
      { title: 'Tiền thuế', suggestion: checkFormatItem(requestTaxAmount) ? numberWithCommas(requestTaxAmount) : 0, approved: checkFormatItem(approvedTaxAmount) ? numberWithCommas(approvedTaxAmount) : 0 },
      { title: 'Tổng tiền', suggestion: checkFormatItem(requestAmount) ? numberWithCommas(requestAmount) : 0, approved: checkFormatItem(approvedAmount) ? numberWithCommas(approvedAmount) : 0 },
    ]

    let fontSize = getFontXD(42);
    const maxLen = Math.max(data[0].suggestion.length, data[0].approved.length, data[1].suggestion.length, data[1].approved.length, data[2].suggestion.length, data[2].approved.length)
    const maxAllow = Platform.OS === 'ios' ? 15 : 14;
    if (maxLen > maxAllow) {
      fontSize = fontSize * (maxAllow / maxLen);
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexTitle, { borderBottomWidth: (expanded === true) ? 0.3 : 0 }]}
        >
          <Text style={styles.title}>{i18n.t('AMOUNT_INFORMATION')}</Text>
          {expanded && <Ionicons name="ios-arrow-down" size={WIDTHXD(40)} color={R.colors.iconGray} />}
          {!expanded && <Ionicons name="ios-arrow-forward" size={WIDTHXD(40)} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded
          && (
            <View style={styles.wrapper}>
              {/* <View>
                <TextInput editable={false} style={styles.label} />
                <TextInput editable={false} style={styles.label}>Tiền trước thuế</TextInput>
                <TextInput editable={false} style={styles.label}>Tiền thuế</TextInput>
                <TextInput editable={false} style={styles.label}>Tổng tiền</TextInput>
              </View>

              <View style={{ width: WIDTHXD(217), alignItems: 'flex-end', }}>
                <TextInput editable={false} style={[styles.label, { color: R.colors.black0 }]}>Đề nghị</TextInput>
                <TextInput editable={false} style={[styles.label, { color: R.colors.black0 }]}>{requestBeforeTaxAmount}</TextInput>
                <View style={styles.line} />
                <TextInput style={[styles.label, { color: R.colors.black0 }]}>{requestTaxAmount}</TextInput>
                <View style={styles.line} />
                <TextInput style={[styles.label, { color: R.colors.black0 }]}>{requestAmount}</TextInput>
                <View style={styles.line} />
              </View>
              <View style={styles.lineColumn} />
              <View style={{ maxWidth: WIDTHXD(250), alignItems: 'flex-end', }}>
                <TextInput editable={false} style={[styles.label, { color: R.colors.black0 }]}>Được duyệt</TextInput>
                <TextInput style={styles.label}>{approvedBeforeTaxAmount}</TextInput>
                <View style={styles.line} />
                <TextInput style={styles.label}>{approvedTaxAmount}</TextInput>
                <View style={styles.line} />
                <TextInput style={styles.label}>{approvedAmount}</TextInput>
                <View style={styles.line} />
              </View> */}
              <View style={styles.money_info_header_container}>
                <View style={styles.money_info_header_left_container}>
                  <View style={{ flex: 1 }} />
                  <Text style={styles.money_info_header_text_left}>Đề nghị</Text>
                </View>
                <View style={styles.money_info_vertical_line} />
                <Text style={styles.money_info_header_text_right}>Được duyệt</Text>
              </View>
              {data.map(element => (
                <View style={styles.money_info_item_container} key={element.title}>
                  <View style={styles.money_info_item_left_container}>
                    <Text style={styles.money_info_item_left_text_left}>{element.title}</Text>
                    <View style={styles.money_info_item_left_text_right_container}>
                      <Text style={{ ...styles.money_info_item_left_text_right, fontSize }} adjustsFontSizeToFit numberOfLines={1}>{element.suggestion}</Text>
                    </View>
                  </View>
                  <View style={styles.money_info_vertical_line} />
                  <View style={styles.money_info_item_right_container}>
                    <View style={styles.money_info_item_right_text_container}>
                      <Text style={{ ...styles.money_info_item_right_text, fontSize }} adjustsFontSizeToFit numberOfLines={1}>{element.approved}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth()
  },
  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(37),
    borderBottomColor: R.colors.iconGray,
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(59.76)
  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(51),
    fontFamily: R.fonts.RobotoRegular,
    marginTop: HEIGHTXD(30),
    color: R.colors.color777,
    padding: 0,
    marginBottom: 0,
  },
  line: {
    height: 0.5,
    width: WIDTHXD(217),
    backgroundColor: R.colors.iconGray
  },
  lineColumn: {
    height: HEIGHTXD(470),
    width: 0.8,
    backgroundColor: '#ddd',
    marginTop: HEIGHTXD(60)
  },
  wrapper: {
    paddingBottom: HEIGHTXD(46),
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // paddingHorizontal: WIDTHXD(46)
  },
  money_info_header_container: {
    flexDirection: 'row',
    paddingTop: HEIGHTXD(30)
  },
  money_info_header_text_left: {
    textAlign: 'center',
    minWidth: WIDTHXD(330),
    paddingRight: WIDTHXD(30),
    color: R.colors.black0,
    fontSize: getFontXD(42),
  },
  money_info_vertical_line: {
    width: 1,
    backgroundColor: '#E6E6E6',
  },
  money_info_header_left_container: {
    flex: 2,
    flexDirection: 'row',
    paddingRight: WIDTHXD(30),
  },
  money_info_header_text_right: {
    flex: 1,
    textAlign: 'center',
    color: R.colors.black0,
    fontSize: getFontXD(42),
    paddingRight: WIDTHXD(49)
  },
  money_info_item_container: {
    flexDirection: 'row',
  },
  money_info_item_left_container: {
    flex: 2,
    flexDirection: 'row',
    paddingRight: WIDTHXD(30),
    paddingTop: HEIGHTXD(26),
  },
  money_info_item_left_text_left: {
    flex: 1,
    paddingLeft: WIDTHXD(46),
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
  },
  money_info_item_left_text_right_container: {
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    paddingBottom: HEIGHTXD(6),
    minWidth: WIDTHXD(330),
  },
  money_info_item_left_text_right: {
    minWidth: WIDTHXD(217),
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    textAlign: 'right'
  },
  money_info_item_right_container: {
    flex: 1,
    paddingTop: HEIGHTXD(26),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: WIDTHXD(49)
  },
  money_info_item_right_text_container: {
    minWidth: WIDTHXD(217),
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    paddingBottom: HEIGHTXD(6)
  },
  money_info_item_right_text: {
    textAlign: 'right',
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    minWidth: WIDTHXD(330)
  }
})
