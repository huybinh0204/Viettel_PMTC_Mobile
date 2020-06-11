import React, { Component } from 'react'
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import R from 'assets/R'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ApiInvoice from 'apis/Functions/invoice'
import { getWidth, WIDTHXD, HEIGHTXD, getFontXD, getLineHeightXD } from '../../../../../../config'
import ItemSearch from '../../../../common/ItemSearch';
import global from '../../../../global'
import _ from 'lodash'

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

  componentDidMount = async () => {
    let dataCostCenter = await this._findCostCenter('', this.props.departmentId)
    if (dataCostCenter.length === 1) {
      const { self } = this.props
      self.dataDetailedInvoice.cCostCenterName = dataCostCenter[0].name
      self.dataDetailedInvoice.cCostCenterId = dataCostCenter[0].id
      self._reRender()
    }
  }

  _findCostSource = async (query) => {
    let body = {
      isSize: 'true',
      name: query
    }
    let res = await ApiInvoice.searchCostSource(body)
    if (res && res.data) {
      let data = this._deleteItemLoadMore(res.data)
      return data
    } else {
      return []
    }
  }


  _findCostCenter = async (query, departmentId) => {
    let body = {
      adOrgId: this.props.adOrgId,
      isSize: 'true',
      name: query,
      departmentId: departmentId
    }

    let res = await ApiInvoice.searchCostCenter(body)
    if (res && res.data) {
      let data = this._deleteItemLoadMore(res.data)
      return data
    } else {
      return []
    }
  }

  _deleteItemLoadMore = (result) => {
    _.forEach(result, (item, index) => {
      if (item.name === 'Tìm kiếm thêm' || item.text === 'Tìm kiếm thêm' || item.displayname === 'Tìm kiếm thêm') {
        result.splice(index, 1)
      }
    })
    return result
  }

  _hideDetailOtherInfor = (isHide) => {
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
          {expanded && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} color={R.colors.iconGray} />}
          {!expanded && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded
          && (
            <View style={{ paddingBottom: HEIGHTXD(46) }}>
              <ItemSearch
                require={true}
                title="Trung tâm chi phí"
                titlePopUP="Tìm kiếm TT chi phí"
                value={self.dataDetailedInvoice.cCostCenterName}
                findData={this._findCostCenter}
                onValueChange={(value, item) => {
                  if (item) {
                    self.dataDetailedInvoice.cCostCenterName = item.name
                    self.dataDetailedInvoice.cCostCenterId = item.id
                  } else {
                    self.dataDetailedInvoice.cCostCenterName = ''
                    self.dataDetailedInvoice.cCostCenterId = null
                  }
                  self._reRender()
                }}
              />
              <ItemSearch
                findData={this._findCostSource}
                value={self.dataDetailedInvoice.cBudgetName}
                title="Nguồn kinh phí"
                titlePopUP="Tìm kiếm nguồn kinh phí"
                onValueChange={(value, item) => {
                  if (item) {
                    self.dataDetailedInvoice.cBudgetId = item.id
                    self.dataDetailedInvoice.cBudgetName = item.name
                  } else {
                    self.dataDetailedInvoice.cBudgetId = null
                    self.dataDetailedInvoice.cBudgetName = ''
                  }
                  self._reRender()
                  // self.dataDetailedInvoice.cBudgetName = item.name
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
    width: getWidth(),

    shadowColor: '#181F4D21',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 10,
  },
  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(37),
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
})
