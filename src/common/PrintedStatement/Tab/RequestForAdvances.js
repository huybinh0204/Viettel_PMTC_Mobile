import React, { Component } from 'react'
import { Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { getWidth, getHeight, getFontXD, WIDTHXD, HEIGHTXD } from '../../../config/Function'
import R from '../../../assets/R'
import *as constants from '../constants'


export default class MoneyTransferOffer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listData: [
        {
          name: 'Đề nghị tạm ứng',
          value: 1,
        },
        {
          name: 'Đề nghị tạm ứng chuyển khoản',
          value: 1,
          footTypeSign: [constants.DROPDOWN_LIST_LOAI_2_CHAN_KY, constants.DROPDOWN_LIST_LOAI_4_CHAN_KY, constants.DROPDOWN_LIST_LOAI_5_CHAN_KY]
        },
        {
          name: 'Đề nghị tạm ứng bổ sung',
          value: 1,
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
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => this.props.onPressItem(item)}
              style={styles.btItem}
            >
              <Text style={styles.txtName}>{item.name}</Text>
            </TouchableOpacity>
          )
        }}
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
    height: HEIGHTXD(200),
    justifyContent: 'center'
  },
  txtName: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    paddingVertical: HEIGHTXD(50),
    color: R.colors.black0
  },
})
