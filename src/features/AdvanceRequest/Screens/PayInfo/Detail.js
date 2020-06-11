import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import _ from 'lodash'
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth, toPriceVnd } from '../../../../config';
import R from '../../../../assets/R';
import global from '../../global'


export default class DetailPayInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      body: {},
    }
    global.goBackToListPayInfo = this.goBackToListPayInfo.bind(this)
  }

  componentDidMount() {
    if (this.props.navigation.state.params.dataDetail) {
      this.setState({ body: this.props.navigation.state.params.dataDetail })
    }
  }

  componentWillUnmount() {
    this.props.returnData({ activeMenu: global.HIDE_BOTTOM_MENU, indexIcon: global.SHOW_DOUBLE_ICON, toDetail: false })
  }

  goBackToListPayInfo = () => {
    this.props.navigation.goBack()
  }

  render() {
    const { body } = this.state
    const adOrgName = body.adOrgName ? body.adOrgName : ''
    const documentName = body.documentName ? body.documentName : ''
    const documentNo = body.documentNo ? body.documentNo : ''
    const dateAcct = body.dateAcct ? body.dateAcct : ''
    const arCashLineId = body.arCashLineId ? body.arCashLineId : ''
    const amtAcct = body.amtAcct ? body.amtAcct : ''
    const cCurrencyName = body.cCurrencyName ? body.cCurrencyName : ''
    const accountNo = body.accountNo ? body.accountNo : ''
    const descriptionLine = body.descriptionLine ? body.descriptionLine : ''
    let status = ''
    if (body.status) {
      _.forEach(R.strings.local.TRANG_THAI_HACH_TOAN, item => {
        if (item.value === body.status) {
          status = item.name
        }
      })
    }
    return (
      <View style={styles.ctn}>
        <View style={styles.container}>
          <View style={[styles.row, { paddingVertical: WIDTHXD(36) }]}>
            <Text style={styles.title}>Đơn vị</Text>
            <Text style={styles.content}>{adOrgName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Loại chứng từ</Text>
            <Text style={styles.content}>{documentName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Số chứng từ</Text>
            <Text style={styles.content}>{documentNo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Số UNT</Text>
            <Text style={styles.content}>{arCashLineId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Ngày hạch toán</Text>
            <Text style={styles.content}>{dateAcct}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Số tiền</Text>
            <Text style={styles.content}>{cCurrencyName} {toPriceVnd(amtAcct)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Số tài khoản</Text>
            <Text style={styles.content}>{accountNo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Trạng thái hạch toán</Text>
            <Text style={styles.content}>{status}</Text>
          </View>
          <View style={styles.viewCol}>
            <Text style={styles.titleCol}>Nội dung</Text>
            <Text style={styles.contentCol}>{descriptionLine}</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  ctn: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  },
  container: {
    width: getWidth(),
    backgroundColor: R.colors.white,
    paddingHorizontal: WIDTHXD(42),
    marginTop: HEIGHTXD(30),
    shadowColor: '#181F4D21',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  viewCol: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingTop: HEIGHTXD(18),
  },
  row: {
    paddingVertical: HEIGHTXD(32),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: R.colors.borderE6,
    borderBottomWidth: WIDTHXD(1),
  },
  title: {
    flex: 2.5,
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(36),
    color: R.colors.color777
  },
  content: {
    flex: 3,
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.black0,
  },
  contentCol: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.black0,
    marginTop: WIDTHXD(16),
    marginBottom: WIDTHXD(32)
  },
  titleCol: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.color777
  },
})
