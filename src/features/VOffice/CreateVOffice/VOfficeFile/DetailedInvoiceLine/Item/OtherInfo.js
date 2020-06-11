import React, { Component } from 'react'
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import R from 'assets/R'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ApiInvoice from 'apis/Functions/invoice'
import { getWidth, WIDTHXD, HEIGHTXD, getFontXD, getLineHeightXD } from '../../../../../../config'
import ItemSearch from '../../../../common/ItemSearch';
import ItemPicker from '../../../../common/ItemPicker';
import global from '../../../../global'

export default class OtherInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    global.hideDetailOtherInfor = this._hideDetailOtherInfor.bind(this)
  }

  _findCostSource = async (query) => {
    let body = {
      isSize: 'true',
      name: query
    }
    let res = await ApiInvoice.searchCostSource(body)
    if (res && res.data) {
      return res.data
    } else {
      return []
    }
  }

  _findCostCenter = async (query) => {
    let body = {
      adOrgId: 1000432,
      isSize: 'true',
      name: query
    }

    let res = await ApiInvoice.searchCostCenter(body)
    if (res && res.data) {
      return res.data
    } else {
      return []
    }
  }

  _hideDetailOtherInfor = () => {
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


  render() {
    const { expanded } = this.state;
    global.isHideDetailOtherInfor = !expanded
    global.updateHeader()
    const { self } = this.props
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexTitle, { borderBottomWidth: (expanded === true) ? 0.3 : 0 }]}
        >
          <Text style={styles.title}>Thông tin khác</Text>
          {expanded && <Ionicons name="ios-arrow-down" size={WIDTHXD(40)} color={R.colors.iconGray} />}
          {!expanded && <Ionicons name="ios-arrow-forward" size={WIDTHXD(40)} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded
          && (
            <View style={{ paddingBottom: HEIGHTXD(46) }}>
              <ItemSearch

                title="Trung tâm chi phi"
                titlePopUP="Tìm kiếm TT chi phí"
                value={self.dataDetailedInvoice.cCostCenterName}
                findData={this._findCostCenter}
                onValueChange={(value, item) => {
                  self.dataDetailedInvoice.cCostCenterName = item.name
                  self.dataDetailedInvoice.cCostCenterId = item.id
                  self._reRender()
                }}
              />
              <ItemSearch
                findData={this._findCostSource}
                value={self.dataDetailedInvoice.cBudgetName}
                title="Nguồn kinh phí"
                titlePopUP="Tìm kiếm nguồn kinh phí"
                onValueChange={(value, item) => {
                  self.dataDetailedInvoice.cBudgetId = item.id
                  self.dataDetailedInvoice.cBudgetName = item.name
                  self._reRender()
                }}
              />
              {/* <ItemPicker title="Ký chi phí" data={[]} /> */}
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
