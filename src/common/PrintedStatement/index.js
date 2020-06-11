import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions, TextInput } from 'react-native'
import { TabBar } from 'react-native-tab-view';
import IconClose from 'react-native-vector-icons/AntDesign'
import _ from 'lodash'
import R from '../../assets/R'
import { getWidth, getFontXD, WIDTHXD, HEIGHTXD } from '../../config/Function'
import Expense from './Tab/Expense'
import { NetworkSetting } from '../../config/Setting';


type Props = {
  openModalPrint: Boolean
}

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const renderTabbar = props => {
  return (
    <TabBar
      {...props}
      style={styles.tabStyle}
      renderLabel={({ route, focused }) => (
        <Text
          style={[focused ? styles.activeTabTextColor : styles.tabTextColor]}
        >
          {route.title}
        </Text>
      )}
      indicatorStyle={styles.indicatorStyle}
    />
  )
}

export default class PrintedVotes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      index: 0,
      // showModalChild: false,
      modalAdvancdeRequest: true,
      item: {},
      checkboxSign: false,
      checkboxPrint: false,
      routes: [
        { key: 1, title: 'ĐN chuyển tiền' },
        { key: 2, title: 'ĐN tạm ứng' },
      ],
    }
  }

  setModalVisible = (visible) => {
    this.setState({
      visible
    })
  }
  
  _randomName = (fileName, length) => {
    let result = fileName;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.concat('.pdf');
  }

  _onPressItem = (item) => {
    this.setState({ item, visible: false }, () => {
      let url = `${NetworkSetting.ROOT}/erp-service/reportStarterServiceRest/reportStarter/exportPdf?AD_Process_ID=${item.Ad_process_id}&reportName=${item.reportName}&AD_User_ID=${this.props.userId}&REPORT_MODE=1&RECORD_ID=${this.props.recordId}&condition=[]`
      let fileName = this._randomName(item.reportName, 20)
      this.props.accept(url, item.name, fileName)
    })

  }


  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => this.setState({ visible: false })}
      >
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <TouchableWithoutFeedback
            onPress={() => { this.setState({ visible: false }) }}
          >
            <View
              style={styles.opacity}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modal}>
                  <View style={styles.viewTitle}>
                    <View style={styles.viewEmpty}></View>
                    <Text style={styles.titlePopup}>Chọn Phiếu In</Text>
                    <TouchableOpacity onPress={() => this.setState({ visible: false })} style={styles.btClose}>
                      <IconClose name="close" size={WIDTHXD(48)} color={R.colors.black0} />
                    </TouchableOpacity>
                  </View>
                  <Expense onPressItem={(item) => this._onPressItem(item)} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  opacity: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#rgba(0,0,0,0.3)'
  },
  viewTime: {
    flexDirection: 'row'
  },
  btAccept: {
    alignSelf: 'center',
    marginTop: HEIGHTXD(150)
  },
  rowCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtAccept: {
    fontSize: getFontXD(48),
    fontFamily: R.fonts.RobotoMedium,
    color: R.colors.colorNameBottomMenu
  },
  label: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.label,
    marginBottom: HEIGHTXD(8),
  },
  ctnPicker: {
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
    width: null,
    paddingHorizontal: WIDTHXD(64),
  },
  textInput: {
    flex: 2,
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
    borderRadius: WIDTHXD(20),
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.black0,
    paddingVertical: 0,
  },
  viewRowCheckbox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  namePrint: {
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(46),
    color: R.colors.black0,
    marginBottom: HEIGHTXD(50)
  },
  nameCheckbox: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.black0,
    marginLeft: WIDTHXD(40)
  },
  typePrint: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(36),
    color: R.colors.label
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menu: {
    flex: 1,
    maxHeight: HEIGHTXD(307),
  },
  titlePopup: {
    fontSize: getFontXD(48),
    color: R.colors.colorMain,
    fontFamily: R.fonts.RobotoMedium,
    flex: 10,
    textAlign: 'center',
  },
  viewEmpty: {
    flex: 1,
  },
  viewTitle: {
    flexDirection: 'row',
    width: getWidth(),
    paddingVertical: HEIGHTXD(50),
    borderBottomWidth: 0.3,
    borderBottomColor: R.colors.iconGray,
    borderColor: R.colors.iconGray
  },
  btClose: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  modal: {
    backgroundColor: R.colors.white100,
    // backgroundColor: 'purple',
    width: getWidth(),
    height: HEIGHTXD(650),
    // maxHeight: HEIGHTXD(1300),
    borderTopLeftRadius: WIDTHXD(20),
    borderTopRightRadius: WIDTHXD(20),
    paddingBottom: WIDTHXD(40)
  },
  body: {
  },
  buttonComplete: {
    backgroundColor: R.colors.white,
    marginTop: WIDTHXD(96)
  },
  textBtnTao: {
    color: R.colors.colorMain,
    fontSize: getFontXD(48),
    fontFamily: R.fonts.RobotoMedium,
    textAlign: 'center',
  },
  activeTabTextColor: {
    color: R.colors.colorNameBottomMenu,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    textAlign: 'center',
  },
  tabTextColor: {
    color: R.colors.color777,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    textAlign: 'center',
  },
  tabStyle: {
    elevation: 0,
    width: getWidth(),
    backgroundColor: R.colors.white
  },
  indicatorStyle: {
    backgroundColor: R.colors.colorNameBottomMenu,
    height: HEIGHTXD(12)
  }
})
