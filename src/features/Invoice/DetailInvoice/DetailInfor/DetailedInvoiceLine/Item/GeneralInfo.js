import React, { Component } from 'react'
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import R from 'assets/R'
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'assets/languages/i18n';
import { getWidth, WIDTHXD, HEIGHTXD, getFontXD, getLineHeightXD } from '../../../../../../config'
import ItemInputText from './ItemInputText';
import global from '../../../../global'
import ItemFormText from '../../../ItemViews/ItemFormText'

export default class GeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    global.hideDetailGeneralInfor = this._hideDetailGeneralInfor.bind(this)
  }

  _hideDetailGeneralInfor = (isHide) => {
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
    global.isHideDetailGeneralInfor = !expanded
    global.updateHeader()
    const { product, contract, chanel, managerUnit, total, price, cUomId, cStatementLineName, taxId, description } = this.props
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
            <View style={{ paddingBottom: HEIGHTXD(46) }}>
              <ItemFormText marginTop title="Mặt hàng" content={product} width={WIDTHXD(1064)} />
              <ItemFormText marginTop title="Hợp đồng" content={contract} width={WIDTHXD(1064)} />
              <ItemFormText marginTop title="Kênh" content={chanel} width={WIDTHXD(1064)} />
              <ItemFormText marginTop title="Đơn vị quản trị" content={managerUnit} width={WIDTHXD(1064)} />
              <ItemInputText value={description} />
              <View style={{ flexDirection: 'row', width: WIDTHXD(1064), justifyContent: 'space-between', alignSelf: 'center', }}>
                <ItemFormText marginTop title="Số lượng" content={total} width={WIDTHXD(258)} />
                <ItemFormText marginTop title="Đơn vị tính" content={cUomId} width={WIDTHXD(332)} />
                <ItemFormText marginTop title="Đơn giá" content={price} width={WIDTHXD(414)} />
              </View>
              <ItemFormText marginTop title="Chi tiết tờ trình" content={cStatementLineName} width={WIDTHXD(1064)} />
              <ItemFormText marginTop title="Loại thuế" content={taxId} width={WIDTHXD(1064)} />
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
})
