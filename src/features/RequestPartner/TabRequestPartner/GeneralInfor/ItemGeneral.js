import React, { Component } from 'react'
import { StyleSheet, View, Platform, UIManager, TextInput } from 'react-native';
import R from 'assets/R'
import ApiInvoice from 'apis/Functions/invoice'
import { getWidth, WIDTHXD, HEIGHTXD, getFontXD, getLineHeightXD } from '../../../../config'
import ItemSearch from '../../../Invoice/common/ItemSearch';
import ItemInputText from '../../../Invoice/common/ItemInputText';

export default class GeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  _findWorkUnit = async (query) => {
    let body = {
      isSize: 'true',
      value: null,
      name: query
    }

    let res = await ApiInvoice.searchListPayUnit(body)
    if (res && res.data) {
      return res.data
    } else {
      return []
    }
  }

  _findReceiver = async (query) => {
    let body = {
      name: query,
      isSize: true
    }
    let res = await ApiInvoice.searchReceiver(body)
    if (res && res.data) {
      return res.data
    } else {
      return []
    }
  }

  // componentDidMount = () => {
  //   this._getAdOrgName(this.props.self.dataPartner.cRequestPartnerId)
  // }

  render() {
    const { self } = this.props
    return (
      <View style={styles.container}>
        <View style={{ paddingBottom: HEIGHTXD(46), alignItems: 'center' }}>
          <ItemSearch
            require={true}
            disabled={self.disabled}
            findData={this._findWorkUnit}
            title="Đơn vị"
            titlePopUP="Tìm kiếm đơn vị"
            value={self.dataPartner.adOrgName}
            onValueChange={(value, item) => {
              if (item) {
                self.dataPartner.adOrgId = item.adOrgId
                self.dataPartner.adOrgName = item.name
              } else {
                self.dataPartner.adOrgId = null
                self.dataPartner.adOrgName = ''
              }
              self._reRender()
            }}
          />
          <ItemInputText
            require={true}
            disabled={self.disabled}
            width={WIDTHXD(1064)}
            title="Tên đối tượng"
            value={self.dataPartner.partnerName}
            marginTop={HEIGHTXD(30)}
            onChangeValue={(text) => {
              self.dataPartner.partnerName = text
              self._reRender()
            }}
          />
          <View style={{ flexDirection: 'row', width: WIDTHXD(1064), justifyContent: 'space-between', alignSelf: 'center', }}>
            <ItemInputText
              disabled={self.disabled}
              width={WIDTHXD(511)}
              title="Chứng minh thư"
              marginTop={HEIGHTXD(30)}
              isNum={true}
              value={self.dataPartner.identify}
              onChangeValue={(text) => {
                self.dataPartner.identify = text
                self._reRender()
              }}
            />
            <ItemInputText
              disabled={self.disabled}
              width={WIDTHXD(523)}
              title="Mã số thuế"
              marginTop={HEIGHTXD(30)}
              value={self.dataPartner.taxCode}
              isNum={true}
              onChangeValue={(text) => {
                self.dataPartner.taxCode = text
                self._reRender()
              }}
            />
          </View>
          <ItemInputText
            require={true}
            disabled={self.disabled}
            width={WIDTHXD(1064)}
            title="Địa chỉ"
            marginTop={HEIGHTXD(30)}
            value={self.dataPartner.address}
            onChangeValue={(text) => {
              self.dataPartner.address = text
              self._reRender()
            }}
          />
          <ItemSearch
            require={true}
            disabled={self.disabled}
            findData={this._findReceiver}
            title="Người nhận"
            titlePopUP="Tìm kiếm người nhận"
            value={self.dataPartner.approverName}
            onValueChange={(value, item) => {
              if (item) {
                self.dataPartner.approverId = item.adUserId
                self.dataPartner.approverName = item.fullname
              } else {
                self.dataPartner.approverId = null
                self.dataPartner.approverName = ''
              }
              self._reRender()
            }}
          />
          <TextInput
            multiline
            maxLength={250}
            value={self.dataPartner.description}
            onChangeText={(text) => {
              self.dataPartner.description = text
              self._reRender()
            }}
            style={styles.formEnterInfo}
          />
        </View>
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
  formEnterInfo: {
    textAlignVertical: 'top',
    paddingHorizontal: WIDTHXD(36),
    height: HEIGHTXD(160),
    width: WIDTHXD(1064),
    marginTop: HEIGHTXD(30),
    borderColor: R.colors.borderGray,
    fontSize: getFontXD(R.fontsize.contentFieldTextSize),
    borderWidth: 0.3,
    borderRadius: WIDTHXD(20),
    paddingVertical: HEIGHTXD(26)
  },
})
