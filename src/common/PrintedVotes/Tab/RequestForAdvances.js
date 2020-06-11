import React, { Component } from 'react'
import { Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { getWidth, getFontXD, HEIGHTXD } from '../../../config/Function'
import R from '../../../assets/R'
import * as constants from '../constants'


export default class MoneyTransferOffer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listData: [
        {
          name: 'Đề nghị tạm ứng',
          value: 7,
          key: 'DeNghiTamUng',
          adProcessId: 5015,
          options: false
        },
        {
          name: 'Đề nghị tạm ứng chuyển khoản',
          value: 8,
          key: 'DeNghiTamUngChuyenKhoan',
          adProcessId: 10063,
          footTypeSign: [
            { name: constants.DROPDOWN_LIST_LOAI_2_CHAN_KY, value: 2 },
            { name: constants.DROPDOWN_LIST_LOAI_4_CHAN_KY, value: 4 },
            { name: constants.DROPDOWN_LIST_LOAI_5_CHAN_KY, value: 5 }],
          options: true
        },
        {
          name: 'Đề nghị tạm ứng bổ sung',
          value: 9,
          key: 'DeNghiTamUngBoSung',
          adProcessId: 5016,
          options: false
        },
      ]
    }
  }

  render() {
    return (
      <FlatList
        data={this.state.listData}
        style={styles.container}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => this.props.onPressItem(item)}
            style={styles.btItem}
          >
            <Text numberOfLines={2} style={styles.txtName}>{item.name}</Text>
          </TouchableOpacity>
        )
        }
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: getWidth(),
    height: HEIGHTXD(390),
  },
  btItem: {
    paddingLeft: HEIGHTXD(36),
    paddingRight: HEIGHTXD(100),
    borderBottomWidth: 0.3,
    borderBottomColor: R.colors.iconGray,
    borderTopColor: R.colors.iconGray,
    minHeight: HEIGHTXD(203),
    justifyContent: 'center'
  },
  txtName: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    paddingVertical: HEIGHTXD(50),
    color: R.colors.black0,
    width: '100%'
  },
})
