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
          name: 'Mẫu 1: Chuyển tiền theo hợp đồng - Chuyển tiền trong nước',
          value: 1,
          adProcessId: 10581,
          key: 'YeuCauChuyenTien_Mau1',
          checkbox: [constants.CHECKBOX_KYLEN_TD, constants.CHECKBOX_INGOM],
          options: true
        },
        {
          name: 'Mẫu 2: Chuyển tiền theo hợp đồng - Chuyển ngoại tệ',
          value: 2,
          adProcessId: 10582,
          key: 'YeuCauChuyenTien_Mau2',
          checkbox: [constants.CHECKBOX_KYLEN_TD, constants.CHECKBOX_INGOM],
          options: true
        },
        {
          name: 'Mẫu 3: Chuyển tiền theo BTHTT được duyệt - Chuyển trong nước',
          value: 3,
          adProcessId: 10601,
          key: 'YeuCauChuyenTien_Mau3',
          checkbox: [constants.CHECKBOX_KYLEN_TD],
          typePrint: [
            { name: constants.DROPDOWN_LIST_IN_THUONG, value: 1 },
            { name: constants.DROPDOWN_LIST_IN_CHI_TIET, value: 2 },
            { name: constants.DROPDOWN_LIST_IN_GOM, value: 3 },
            { name: constants.DROPDOWN_LIST_IN_GOM_CHI_TIET, value: 4 }
          ],
          options: true
        },
        {
          name: 'Mẫu 4: Chuyển tiền theo BTHTT được duyệt - Chuyển ngoại tệ',
          value: 4,
          adProcessId: 10602,
          key: 'YeuCauChuyenTien_Mau4',
          checkbox: [constants.CHECKBOX_KYLEN_TD, constants.CHECKBOX_INGOM],
          options: true
        },
        {
          name: 'Mẫu 5: Chuyển tiền TT đối tác tại các tỉnh (ASSC chuyển)(Ký chính)',
          value: 5,
          adProcessId: 10604,
          key: 'YeuCauChuyenTien_Mau5_KC',
          options: false
        },
        {
          name: 'Mẫu 6: Chuyển tiền TT đối tác tại các tỉnh (ASSC chuyển)(Phụ Lục)',
          value: 6,
          adProcessId: 10605,
          key: 'YeuCauChuyenTien_Mau5_PL',
          times: true,
          options: true
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
              <Text numberOfLines={2} style={styles.txtName}>{item.name}</Text>
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
    minHeight: HEIGHTXD(180),
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
