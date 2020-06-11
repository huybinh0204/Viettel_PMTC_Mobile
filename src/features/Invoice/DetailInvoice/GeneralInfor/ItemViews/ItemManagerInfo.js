import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash'
import i18n from 'assets/languages/i18n';
import R from '../../../../../assets/R';
import { HEIGHTXD, getFontXD, WIDTHXD, getWidth, getLineHeightXD } from '../../../../../config/Function';
import ItemTextForGeneral from '../../ItemViews/ItemFormText'
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
    const { item, detail } = this.props;
    let notRequestAmount = (_.has(item, 'notRequestAmount') && item.notRequestAmount !== null) ? item.notRequestAmount : 'Trống'
    let cPaymentTermName = (_.has(item, 'cPaymentTermName') && item.cPaymentTermName !== null) ? item.cPaymentTermName : 'Trống'
    let paymentType = (_.has(item, 'paymentType') && item.paymentType !== null) ? item.paymentType : 'UNC'
    let dueDate = (_.has(item, 'dueDate') && item.dueDate !== null) ? item.dueDate : 'Trống'
    let cWorkUnitName = (_.has(item, 'cWorkUnitName') && item.cWorkUnitName !== null) ? item.cWorkUnitName : 'Trống'
    let cLocationName = (_.has(item, 'cLocationName') && item.cLocationName !== null) ? item.cLocationName : 'Trống'
    const { expanded } = this.state;
    global.isHideManagermentInfor = !expanded
    global.updateHeader()
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexTitle, { borderBottomWidth: (expanded === true) ? 0.3 : 0 }]}
        >
          <Text style={styles.title}>{i18n.t('MANAGER_INFORMATION')}</Text>
          {expanded === true ? <Ionicons name="ios-arrow-down" size={WIDTHXD(40)} color={R.colors.iconGray} />
            : <Ionicons name="ios-arrow-forward" size={WIDTHXD(40)} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded && (
          <View style={{ paddingLeft: WIDTHXD(30), paddingRight: WIDTHXD(31) }}>
            {detail && (
              <View style={[styles.flexColumn, { alignItems: 'flex-start', marginTop: HEIGHTXD(40) }]}>
                <ItemTextForGeneral title={i18n.t('NOT_REQUEST_AMOUNT')} content={notRequestAmount} width={WIDTHXD(1064)} />
              </View>)}
            <View style={[styles.flexColumn, { alignItems: 'flex-start', marginTop: HEIGHTXD(40) }]}>
              <ItemTextForGeneral title={i18n.t('TERM_PAYMENT')} content={cPaymentTermName} width={WIDTHXD(1064)} />
            </View>

            <View style={styles.flexRow}>
              <View style={[styles.flexColumn, { marginTop: HEIGHTXD(40) }]}>
                <ItemTextForGeneral title={i18n.t('PAYMENT_METHOD')} content={R.strings.TYPE_PAYMENT_METHOD[paymentType]} width={WIDTHXD(692)} />
              </View>
              <View style={[styles.flexColumn, { marginTop: HEIGHTXD(40) }]}>
                <ItemTextForGeneral title={i18n.t('DUE_DATE')} content={dueDate} width={WIDTHXD(342)} />
              </View>
            </View>

            <View style={[styles.flexColumn, { alignItems: 'flex-start', marginTop: HEIGHTXD(40) }]}>
              <ItemTextForGeneral title={i18n.t('WORK_UNIT')} content={cWorkUnitName} width={WIDTHXD(1064)} />
            </View>
            <View style={[styles.flexColumn, styles.lastItem, { marginTop: HEIGHTXD(40) }]}>
              <ItemTextForGeneral title={i18n.t('WORKING_MARKET')} content={cLocationName} width={WIDTHXD(1064)} />
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
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
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
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(11),
    color: R.colors.label,
  },
  content: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(36),
    paddingVertical: HEIGHTXD(50),
    color: R.colors.black0
  }
})
