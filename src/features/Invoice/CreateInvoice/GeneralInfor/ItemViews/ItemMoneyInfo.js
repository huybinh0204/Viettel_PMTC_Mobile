import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity, FlatList, TextInput, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'assets/languages/i18n';
import { connect } from 'react-redux';
import { fetchCurrencyList } from '../../../../../actions/invoice'
import PickerItem from '../../../../../common/Picker/PickerItem';
import R from '../../../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth, getLineHeightXD, checkFormatItem, numberWithCommas } from '../../../../../config/Function';
import global from '../../../global'
import { redStar } from 'common/Require';
import { getCurrencyRate } from '../../../../../apis/Functions/statement'
import moment from 'moment'

class ItemMoneyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      reRender: false
    }
    global.hideMoneyInfor = this._hideMoneyInfor.bind(this)
  }

  _hideMoneyInfor = (isHide) => {
    this.setState({ expanded: isHide })
  }

  componentDidMount() {
    this.props.fetchCurrencyList({
      isSize: 'true',
      name: ''
    })
  }

  _reRender = () => {
    this.setState({ reRender: !this.state.reRender })
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

  renderItem = (item) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: HEIGHTXD(30) }}>
      <Text style={styles.type}>{item.type}</Text>
      <View style={styles.borderText}>
        <Text style={styles.deNghi}>{item.deNghi}</Text>
      </View>
      <View style={styles.borderText}>
        <Text style={styles.duocDuyet}>{item.duocDuyet}</Text>
      </View>

    </View>
  )

  _getCurrencyRate = async (currency) => {
    const body = { fromCurrencyId: currency.cCurrencyId, adOrgId: this.props.adOrgId, validFrom: moment().format('YYYY-DD-MM') };
    const { self } = this.props
    try {
      const response = await getCurrencyRate(body);
      self.dataItem.cCurrencyId = currency.cCurrencyId;
      self.dataItem.cCurrencyName = currency.value;
      if (response && response.status === 200) {
        self.dataItem.currencyRate = response.data
      } else {
        self.dataItem.currencyRate = ''
      }
      self._reRender()
      this._reRender()
    } catch (err) {
      self.dataItem.currencyRate = ''
      self._reRender()
      this._reRender()

    }
  }

  render() {
    const { expanded } = this.state;
    global.isHideMoneyInfor = !expanded
    global.updateHeader()

    const { self, listCurrency } = this.props;

    const isEdit = self.dataItem.apInvoiceId !== 0;
    const { requestBeforeTaxAmount, requestTaxAmount, requestAmount, approvedBeforeTaxAmount, approvedTaxAmount, approvedAmount } = self.dataItem;

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
          style={[styles.flexTitle, { borderBottomWidth: (expanded === true) ? 0.3 : 0 }]}>
          <Text style={styles.title}>{i18n.t('AMOUNT_INFORMATION')}</Text>
          {expanded === true ? <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} color={R.colors.iconGray} />
            : <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded && (
          <View style={styles.flexRow}>
            <View style={{
              flex: 1.8,
              flexDirection: 'row',
              paddingRight: WIDTHXD(104),
              alignItems: 'center',
              paddingLeft: WIDTHXD(48)
            }}>
              <Text style={[styles.label, { flex: 1 }]}>{i18n.t('CURRENCY_T')}</Text>
              <PickerItem
                onValueChange={(value, items) => {
                  if (items.value === 'VND') {
                    self.dataItem.cCurrencyId = items.cCurrencyId;
                    self.dataItem.currencyRate = 1;
                    self.dataItem.cCurrencyName = items.value;
                    self._reRender()
                    this._reRender()
                  } else {
                    this._getCurrencyRate(items)
                  }
                }}
                defaultValue={(self.dataItem.cCurrencyName && self.dataItem.cCurrencyName !== null) ? self.dataItem.cCurrencyName : ''}
                width={WIDTHXD(222)}
                height={HEIGHTXD(90)}
                data={listCurrency}
              />
            </View>
            <View style={styles.money_info_vertical_line} />
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.label, { flex: 1 }]}>{i18n.t('CURRENCY_RATE')}{redStar()}</Text>
              <View style={styles.wrapperText}>
                <TextInput
                  value={self.dataItem.currencyRate + ''}
                  maxLength={8}
                  keyboardType="numeric"
                  multiline={false}
                  style={{ padding: 0, margin: 0, textAlign: 'right', width: WIDTHXD(100), color: R.colors.black0 }}
                  onChangeText={text => {
                    self.dataItem.currencyRate = text
                    this._reRender()
                  }}
                />
              </View>
            </View>
          </View>
        )}
        {this.props.detail && this.state.expanded
          && <View style={styles.line} />}
        {(expanded && isEdit)
          && (
            <View style={styles.wrapper}>

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
function mapStateToProps(state) {
  return {
    listCurrency: state.invoiceReducer.listCurrency,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId
  }
}
export default connect(mapStateToProps, { fetchCurrencyList })(ItemMoneyInfo);

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth(),

    shadowColor: '#181F4D21',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(40),
    paddingRight: WIDTHXD(48)
  },
  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: R.colors.iconGray,
    paddingVertical: WIDTHXD(30),
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(60),
  },
  title: {
    fontSize: getFontXD(R.fontsize.contentFieldTextSize),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
  },
  wrapperText: {
    paddingHorizontal: WIDTHXD(36),
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: R.colors.borderGray,
    height: HEIGHTXD(65),
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
  wrapper: {
    paddingBottom: HEIGHTXD(46),
    // paddingRight: WIDTHXD(49),
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
