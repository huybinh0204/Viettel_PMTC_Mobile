// @flow
import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash'
import i18n from 'assets/languages/i18n';
import R from '../../../../../assets/R';
import { getFontXD, WIDTHXD, HEIGHTXD, getWidth, getLineHeightXD } from '../../../../../config/Function';
import ItemTextForGeneral from '../../ItemViews/ItemFormText'
import global from '../../../global'

class ItemGeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    global.hideGeneralInfor = this._hideGeneralInfor.bind(this)
  }

  _hideGeneralInfor = (isHide) => {
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
    const { item } = this.props;
    const { expanded } = this.state;
    global.isHideGeneralInfor = !expanded
    global.updateHeader()
    let typeInvoice = _.has(item, 'type') && !_.isNull(item.type) ? item.type : 0
    let transDate = _.has(item, 'transDate') && !_.isNull(item.transDate) ? item.transDate : 'Trống'
    let serviceType = _.has(item, 'serviceType') && !_.isNull(item.serviceType) ? item.serviceType : 'Trống'
    let template = _.has(item, 'template') && !_.isNull(item.template) ? item.template : 'Trống'
    let symbol = _.has(item, 'symbol') && !_.isNull(item.symbol) ? item.symbol : 'Trống'
    let invoiceNo = _.has(item, 'invoiceNo') && !_.isNull(item.invoiceNo) ? item.invoiceNo : 'Trống'
    let cBpartnerName = _.has(item, 'cBpartnerName') && !_.isNull(item.cBpartnerName) ? item.cBpartnerName : 'Trống'
    let taxCode = _.has(item, 'taxCode') && !_.isNull(item.taxCode) ? item.taxCode : 'Trống'
    let sellerName = _.has(item, 'sellerName') && !_.isNull(item.sellerName) ? item.sellerName : 'Trống'
    let address = _.has(item, 'address') && !_.isNull(item.address) ? item.address : 'Trống'
    let description = _.has(item, 'description') && !_.isNull(item.description) ? item.description : 'Trống'
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexTitle, { borderBottomWidth: (expanded === true) ? 0.3 : 0 }]}
        >
          <Text style={styles.title}>{i18n.t('GENERAL_INFORMATION')}</Text>
          {expanded && <Ionicons name="ios-arrow-down" size={WIDTHXD(40)} color={R.colors.iconGray} />}
          {!expanded && <Ionicons name="ios-arrow-forward" size={WIDTHXD(40)} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded
          && (
            <View style={{ paddingLeft: WIDTHXD(30), paddingRight: WIDTHXD(31), paddingTop: HEIGHTXD(20) }}>
              {item.documentNo
                ? <View style={styles.flexRowDoc}>
                  <Text style={[styles.label, { textAlign: 'left', flex: 1.5 }]}>Bảng THTT</Text>
                  <Text style={{ fontSize: getFontXD(42), fontFamily: R.fonts.RobotoRegular, textAlign: 'center', flex: 4.5 }}>{item.documentNo}</Text>
                </View>
                : null}
              <View style={[styles.flexRow]}>
                <ItemTextForGeneral title={i18n.t('TYPE_INVOICE')} content={R.strings.TYPE_INVOICE[typeInvoice].name} width={WIDTHXD(692)} />
                <ItemTextForGeneral title={i18n.t('DATE_INVOICE')} content={transDate} width={WIDTHXD(342)} />
              </View>
              <View style={[styles.flexRow, { marginTop: HEIGHTXD(40) }]}>
                <ItemTextForGeneral title={i18n.t('TYPE_GOODS_SERVICE')} content={R.strings.ARRAY_TYPE_GOODS_SERVIVE[serviceType]} width={WIDTHXD(1064)} />
              </View>
              <View style={[styles.flexRow, { marginTop: HEIGHTXD(40) }]}>
                <ItemTextForGeneral title={i18n.t('INVOICE_CODE')} content={template} width={WIDTHXD(332)} />
                <ItemTextForGeneral title={i18n.t('SYMBOY_T')} content={symbol} width={WIDTHXD(332)} />
                <ItemTextForGeneral title={i18n.t('NO_INVOICE')} content={invoiceNo} width={WIDTHXD(340)} />
              </View>
              <View style={[styles.flexColumn, { alignItems: 'flex-start', marginTop: HEIGHTXD(40) }]}>
                <ItemTextForGeneral title={i18n.t('C_BPARTNER_ID')} content={cBpartnerName} width={WIDTHXD(1064)} />
              </View>
              <View style={[styles.flexRow, { marginTop: HEIGHTXD(40) }]}>
                <ItemTextForGeneral title={i18n.t('TAX_CODE')} content={taxCode} width={WIDTHXD(450)} />
                <ItemTextForGeneral title={i18n.t('SELLER_NAME')} content={sellerName} width={WIDTHXD(584)} />
              </View>

              <View style={[styles.flexColumn, styles.lastItem]}>
                <ItemTextForGeneral title={i18n.t('ADDRESS_T')} content={address} width={WIDTHXD(1064)} />
                <View style={styles.formEnterInfo}>
                  <Text style={styles.content}>{description}</Text>
                </View>
              </View>

            </View>
          )}
      </View>
    )
  }
}

export default ItemGeneralInfo;

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth()
  },

  flexRowDoc: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HEIGHTXD(30),
    marginBottom: HEIGHTXD(20)
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
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: R.colors.iconGray,
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
  formEnterInfo: {
    textAlignVertical: 'top',
    paddingHorizontal: WIDTHXD(36),
    minHeight: HEIGHTXD(200),
    width: WIDTHXD(1064),
    marginTop: HEIGHTXD(40),
    borderColor: R.colors.borderGray,
    borderWidth: 1,
    borderRadius: WIDTHXD(20)
  },
  wrapperText: {
    width: WIDTHXD(352),
    paddingHorizontal: WIDTHXD(36),
    borderRadius: HEIGHTXD(20),
    height: HEIGHTXD(99),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
  },
  lastItem: {
    alignItems: 'flex-start',
    marginBottom: HEIGHTXD(46),
    marginTop: HEIGHTXD(40)
  },
  label: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize,),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(11),
    color: R.colors.label,
  },
  content: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(R.fontsize.contentFieldTextSize,),
    color: R.colors.black0,
    paddingVertical: HEIGHTXD(10)
  }
})
