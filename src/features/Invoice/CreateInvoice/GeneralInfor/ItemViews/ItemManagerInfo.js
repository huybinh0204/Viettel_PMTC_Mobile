import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import i18n from '../../../../../assets/languages/i18n';
import PickerItem from '../../../../../common/Picker/PickerItem';
import PickerDate from '../../../../../common/Picker/PickerDate';
import PickerSearch from '../../../../../common/Picker/PickerSearch';
import R from '../../../../../assets/R';
import { HEIGHTXD, getFontXD, WIDTHXD, getWidth, getLineHeightXD } from '../../../../../config/Function';
import ApiInvoice from '../../../../../apis/Functions/invoice'
import global from '../../../global'

class ItemManagerInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true
    }
    global.hideManagermentInfor = this._hideManagermentInfor.bind(this)
  }

  _hideManagermentInfor = (isHide) => {
    this.setState({ expanded: isHide })
  }

  _changeLayout = () => {
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

  _findDataTermPayment = async (query) => {
    let body = {
      isSize: 'true',
      name: query
    }

    let res = await ApiInvoice.searchTermPayment(body)
    if (res && res.data) {
      return res.data
    } else {
      return []
    }
  }

  _findWorkUnit = async (query) => {
    let body = {
      isSize: 'true',
      name: query
    }

    let res = await ApiInvoice.searchWorkUnit(body)
    if (res && res.data) {
      return res.data
    } else {
      return []
    }
  }

  _findWorkingMarket = async (query) => {
    let body = {
      isSize: 'true',
      name: query
    }

    let res = await ApiInvoice.searchWorkingMarket(body)
    if (res && res.data) {
      return res.data
    } else {
      return []
    }
  }


  render() {
    const { self } = this.props;
    const { expanded } = this.state;
    global.isHideManagermentInfor = !expanded
    global.updateHeader()
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this._changeLayout}
          style={[styles.flexTitle, { borderBottomWidth: (expanded === true) ? 0.3 : 0 }]}
        >
          <Text style={styles.title}>{i18n.t('MANAGER_INFORMATION')}</Text>
          {expanded === true ? <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} color={R.colors.iconGray} />
            : <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded
          && (
            <View style={{ paddingLeft: WIDTHXD(30), paddingRight: WIDTHXD(31) }}>
              {this.props.detail
                && (
                  <View style={[styles.flexColumn, { alignItems: 'flex-start' }]}>
                    <Text style={[styles.label]}>{i18n.t('NOT_REQUEST_AMOUNT')}</Text>
                    <View style={[styles.wrapperText, { width: WIDTHXD(1064) }]}>
                      <Text numberOfLines={1} style={styles.content}>item</Text>
                    </View>
                  </View>)}
              <View style={[styles.flexColumn, { alignItems: 'flex-start', marginTop: HEIGHTXD(40) }]}>
                <Text style={[styles.label]}>{i18n.t('TERM_PAYMENT')}</Text>
                <PickerSearch
                  width={WIDTHXD(1064)}
                  data={[]}
                  value={self.dataItem.cPaymentTermName}
                  findData={this._findDataTermPayment}
                  title={i18n.t('TERM_PAYMENT')}
                  onValueChange={(value, item) => {
                    if (item) {
                      self.dataItem.cPaymentTermId = item.paymentTermId
                      self.dataItem.cPaymentTermName = item.text
                      self.dayToDueDate = item.laterDateAmount
                      self.dataItem.dueDate = moment(new Date(moment(self.dataItem.transDate, 'DD/MM/YYYY').format('MM/DD/YYYY')).getTime() + item.laterDateAmount * 24 * 60 * 60 * 1000).format('DD/MM/YYYY')
                    } else {
                      self.dataItem.cPaymentTermId = null
                      self.dataItem.cPaymentTermName = ''
                    }
                    self._reRender()
                  }}
                />
              </View>

              <View style={styles.flexRow}>
                <View style={[styles.flexColumn, { marginTop: HEIGHTXD(40) }]}>
                  <Text style={[styles.label]}>{i18n.t('PAYMENT_METHOD')}</Text>
                  <PickerItem
                    onValueChange={(value, items) => {
                      // self.dataItem.paymentType = items.id
                      self._reRender()
                    }}
                    width={WIDTHXD(692)}
                    // defaultIndex={(self.dataItem.paymentType && self.dataItem.paymentType !== null)
                    //   ? R.strings.PAYMENT_METHOD[R.strings.ID_PAYMENT_METHOD[self.dataItem.paymentType]] : ''}
                    data={R.strings.PAYMENT_METHOD}
                  />
                </View>
                <View style={[styles.flexColumn, { marginTop: HEIGHTXD(40) }]}>
                  <Text style={[styles.label]}>{i18n.t('DUE_DATE')}</Text>
                  <PickerDate
                    width={WIDTHXD(342)}
                    disabled={true}
                    onValueChange={(date) => {
                      self._reRender()
                    }}
                    value={self.dataItem.dueDate}
                    containerStyle={{ width: null, paddingHorizontal: WIDTHXD(24) }}
                  />
                </View>
              </View>

              <View style={[styles.flexColumn, { alignItems: 'flex-start', marginTop: HEIGHTXD(40) }]}>
                <Text style={styles.label}>{i18n.t('WORK_UNIT')}</Text>
                <PickerSearch
                  width={WIDTHXD(1064)}
                  data={[]}
                  title={i18n.t('WORK_UNIT')}
                  findData={this._findWorkUnit}
                  onValueChange={(value, item) => {
                    if (item) {
                      self.dataItem.cWorkUnitName = item.text
                      self.dataItem.cWorkUnitId = item.workUnitId
                    } else {
                      self.dataItem.cWorkUnitName = ''
                      self.dataItem.cWorkUnitId = null
                    }
                    self._reRender()
                  }}
                  value={self.dataItem.cWorkUnitName}
                />
              </View>
              <View style={[styles.flexColumn, styles.lastItem, { marginTop: HEIGHTXD(40) }]}>
                <Text style={styles.label}>{i18n.t('WORKING_MARKET')}</Text>
                <PickerSearch
                  width={WIDTHXD(1064)}
                  data={[]}
                  findData={this._findWorkingMarket}
                  title={i18n.t('WORKING_MARKET')}
                  onValueChange={(value, item) => {
                    if (item) {
                      self.dataItem.cLocationName = item.text
                      self.dataItem.cLocationId = item.locationId
                    } else {
                      self.dataItem.cLocationName = ''
                      self.dataItem.cLocationId = null
                    }
                    self._reRender()
                  }}
                  value={self.dataItem.cLocationName}
                />
              </View>
            </View>)}
      </View>
    )
  }
}

export default ItemManagerInfo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth(),
    // borderRadius: WIDTHXD(30),

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
    borderBottomColor: R.colors.borderGray
  },
  flexColumn: {
    flexDirection: 'column',
  },
  title: {
    fontSize: getFontXD(R.fontsize.contentFieldTextSize),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
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
  wrapperText: {
    width: WIDTHXD(300),
    borderRadius: HEIGHTXD(20),
    height: HEIGHTXD(99),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: R.colors.borderGray,
  },
  lastItem: {
    alignItems: 'flex-start',
    marginBottom: HEIGHTXD(49)
  },
  label: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(11),
    color: R.colors.label,
  },
  content: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(R.fontsize.contentFieldTextSize),
    paddingVertical: HEIGHTXD(50),
    color: R.colors.black0
  }
})
