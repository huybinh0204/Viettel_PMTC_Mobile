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

  _hideDetailMoneyInfor = () => {
    this.setState({ expanded: false })
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

  onChangeText = (id, text) => {
    const { self } = this.props
    switch (id) {
      case 1:
        self.itemMoney.sugggestNoTax = text
        break;
      case 2:
        self.itemMoney.sugggestTax = text
        break;
      case 3:
        self.itemMoney.sugggestTotal = text

        break;
      case 4:
        self.itemMoney.acceptedtNoTax = text
        break;
      case 5:
        self.itemMoney.acceptedTax = text
        break;
      case 6:
        self.itemMoney.acceptedTotal = text
        break;
      default:
        break;
    }
    self._reRender()
  }

  render() {
    const { expanded } = this.state;
    global.isHideDetailMoneyInfor = !expanded
    global.updateHeader()
    const { self } = this.props
    const { requestBeforeTaxAmount, requestTaxAmount, requestAmount, approvedBeforeTaxAmount, approvedTaxAmount, approvedAmount } = self.dataDetailedInvoice
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
              <View>
                <TextInput editable={false} style={styles.label} />
                <TextInput editable={false} style={styles.label}>Tiền trước thuế</TextInput>
                <TextInput editable={false} style={styles.label}>Tiền thuế</TextInput>
                <TextInput editable={false} style={styles.label}>Tổng tiền</TextInput>
              </View>

              <View style={{ width: WIDTHXD(217), alignItems: 'flex-end', }}>
                <TextInput editable={false} style={[styles.label, { color: R.colors.black0 }]}>Đề nghị</TextInput>
                <Text numberOfLines={1} style={[styles.label, { color: R.colors.black0 }]}>
                  {checkFormatItem(requestBeforeTaxAmount) ? numberWithCommas(requestBeforeTaxAmount) : 0}
                </Text>
                <View style={styles.line} />
                <Text numberOfLines={1} style={[styles.label, { color: R.colors.black0 }]}>
                  {checkFormatItem(requestTaxAmount) ? numberWithCommas(requestTaxAmount) : 0}
                </Text>
                <View style={styles.line} />
                <Text numberOfLines={1} style={[styles.label, { color: R.colors.black0 }]}>
                  {checkFormatItem(requestAmount) ? numberWithCommas(requestAmount) : 0}
                </Text>
                <View style={styles.line} />
              </View>
              <View style={styles.lineColumn} />
              <View style={{ maxWidth: WIDTHXD(250), alignItems: 'flex-end', }}>
                <TextInput editable={false} style={[styles.label, { color: R.colors.black0 }]}>Được duyệt</TextInput>
                <Text numberOfLines={1} style={[styles.label]}>
                  {checkFormatItem(approvedBeforeTaxAmount) ? numberWithCommas(approvedBeforeTaxAmount) : 0}
                </Text>
                <View style={styles.line} />
                <Text numberOfLines={1} style={[styles.label]}>
                  {checkFormatItem(approvedTaxAmount) ? numberWithCommas(approvedTaxAmount) : 0}
                </Text>
                <View style={styles.line} />
                <Text numberOfLines={1} style={[styles.label]}>
                  {checkFormatItem(approvedAmount) ? numberWithCommas(approvedAmount) : 0}
                </Text>
                <View style={styles.line} />
              </View>
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
    backgroundColor: R.colors.iconGray,
    marginBottom: HEIGHTXD(20)
  },
  lineColumn: {
    height: HEIGHTXD(470),
    width: 0.8,
    backgroundColor: '#ddd',
    marginTop: HEIGHTXD(60)
  },
  wrapper: {
    paddingBottom: HEIGHTXD(46),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: WIDTHXD(46)
  }
})
