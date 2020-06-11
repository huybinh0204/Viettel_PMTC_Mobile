import React, { Component } from 'react'
import { Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { getWidth, getHeight, getFontXD, WIDTHXD, HEIGHTXD } from '../../../config/Function'
import R from '../../../assets/R'
import *as constants from '../constants'


export default class Expense extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listData: [
        {
          Ad_process_id: 10153,
          reportName: 'PhuLucDeXuatKinhPhi',
          name: 'Phụ lục đề xuất kinh phí',
          value: 1,
          checkbox: [constants.CHECKBOX_KYLEN_TD, constants.CHECKBOX_INGOM]
        },
        {
          Ad_process_id: 11101,
          reportName: 'PLTONGHOPDEXUATKINHPHI',
          name: 'Phụ lục tổng hợp đề xuất kinh phí',
          value: 1,
          checkbox: [constants.CHECKBOX_KYLEN_TD, constants.CHECKBOX_INGOM]
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
