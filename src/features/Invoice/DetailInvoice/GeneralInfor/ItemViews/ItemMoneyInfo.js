import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash'
import i18n from 'assets/languages/i18n';
import R from '../../../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth, getLineHeightXD, checkFormatItem, numberWithCommas } from '../../../../../config/Function';
import global from '../../../global'

class ItemMoneyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true
    }
    global.hideMoneyInfor = this._hideMoneyInfor.bind(this)
  }

  _hideMoneyInfor = (isHide) => {
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

  renderItem = (item, fontSize) => (
    <View style={styles.money_info_item_container} key={item.title}>
      <View style={styles.money_info_item_left_container}>
        <Text style={styles.money_info_item_left_text_left}>{item.title}</Text>
        <View style={styles.money_info_item_left_text_right_container}>
          <Text style={{ ...styles.money_info_item_left_text_right, fontSize }} adjustsFontSizeToFit numberOfLines={1}>{item.suggestion}</Text>
        </View>
      </View>
      <View style={styles.money_info_vertical_line} />
      <View style={styles.money_info_item_right_container}>
        <View style={styles.money_info_item_right_text_container}>
          <Text style={{ ...styles.money_info_item_right_text, fontSize }} adjustsFontSizeToFit numberOfLines={1}>{item.approved}</Text>
        </View>
      </View>
    </View>
  )

  render() {
    const { item, detail } = this.props;
    const { expanded } = this.state;
    global.isHideMoneyInfor = !expanded
    global.updateHeader()
    let cCurrencyName = _.has(item, 'cCurrencyName') && !_.isNull(item.cCurrencyName) ? item.cCurrencyName : 0
    let currencyRate = _.has(item, 'currencyRate') && !_.isNull(item.currencyRate) ? item.currencyRate : '1'
    const { requestBeforeTaxAmount, requestTaxAmount, requestAmount, approvedBeforeTaxAmount, approvedTaxAmount, approvedAmount } = this.props.item;

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
          {expanded === true ? <Ionicons name="ios-arrow-down" size={WIDTHXD(40)} color={R.colors.iconGray} />
            : <Ionicons name="ios-arrow-forward" size={WIDTHXD(40)} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded && (
          <View style={styles.flexRow}>
            <Text style={[styles.label]}>{i18n.t('CURRENCY_T')}</Text>
            <View style={[styles.wrapperText, { borderWidth: 1, borderColor: R.colors.borderGray }]}>
              <Text numberOfLines={1}>{cCurrencyName}</Text>
            </View>
            <Text style={[styles.label, { marginLeft: WIDTHXD(120) }]}>{i18n.t('CURRENCY_RATE')}</Text>
            <View style={[styles.wrapperText, { justifyContent: 'flex-end', flexDirection: 'row' }]}>
              <Text style={{ marginTop: HEIGHTXD(20) }} numberOfLines={1}>{currencyRate}</Text>
            </View>
          </View>
        )}
        {this.state.expanded && (
          <View>
            <View style={{ width: getWidth() / 2, flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'flex-end' }}>
              <Text style={styles.leftTitle}>
                {i18n.t('SUGGESTIONS_T')}
              </Text>
              <Text style={styles.rightTitle}>
                {i18n.t('APPROVED_T')}
              </Text>
            </View>
            <FlatList
              data={data}
              renderItem={({ item }) => this.renderItem(item, fontSize)}
              style={{ marginBottom: HEIGHTXD(40) }}
            />
          </View>)}
        {expanded
          && detail && <View style={styles.line} />}
      </View>
    )
  }
}

export default ItemMoneyInfo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth()
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: WIDTHXD(46),
    paddingVertical: HEIGHTXD(40),
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
  flexColumn: {
    flexDirection: 'column',
  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
  },
  wrapperText: {
    width: WIDTHXD(222),
    borderRadius: HEIGHTXD(20),
    paddingHorizontal: WIDTHXD(36),
    marginLeft: WIDTHXD(45),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: R.colors.borderGray,
    height: HEIGHTXD(90),
  },
  label: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label,
  },
  line: {
    height: HEIGHTXD(235),
    position: 'absolute',
    width: WIDTHXD(4),
    right: WIDTHXD(330),
    bottom: HEIGHTXD(36),
    backgroundColor: R.colors.colorBackground,
    flex: 1,
  },
  type: {
    width: WIDTHXD(320),
    marginLeft: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36),
  },
  borderText: {
    flex: 0,
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground,
  },
  deNghi: {
    width: getWidth() / 5,
    textAlign: 'right',
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36),
  },
  duocDuyet: {
    width: getWidth() / 5,
    textAlign: 'right',
    marginRight: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36),
  },
  leftTitle: {
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(36),
  },
  rightTitle: {
    marginRight: WIDTHXD(50),
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(36),
  },
  money_info_vertical_line: {
    width: 1,
    backgroundColor: '#E6E6E6',
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
