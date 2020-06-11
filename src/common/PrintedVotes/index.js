import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions, TextInput } from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view';
import IconClose from 'react-native-vector-icons/AntDesign'
import _ from 'lodash'
import moment from 'moment'
import { CheckBox } from 'native-base';
import R from '../../assets/R'
import PickerItem from '../../features/AdvanceRequest/common/ItemPicker';
import PickerDate from '../Picker/PickerDate';
import { getWidth, getFontXD, WIDTHXD, HEIGHTXD } from '../../config/Function'
import MoneyTransferOffer from './Tab/MoneyTransferOffer'
import RequestForAdvances from './Tab/RequestForAdvances'

const initialLayout = {
  height: Dimensions.get('window').height,
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
      showModalChild: false,
      modalAdvancdeRequest: true,
      item: {},
      checkboxSign: false,
      checkboxPrint: false,
      typePrint: null,
      footTypeSign: null,
      th: '',
      key: '',
      value: '',
      adProcessId: '',
      date: moment(new Date()).format('DD/MM/YYYY'),
      routes: [
        { key: 1, title: 'ĐN chuyển tiền' },
        { key: 2, title: 'ĐN tạm ứng' },
      ],
      namePrint: ''
    }
  }

  setModalVisible = (visible) => {
    this.setState({
      visible
    })
  }

  _onPressItemMoneyTransferOffer = (item) => {
    if (!item.options) {
      this.setState({ item, visible: false }, () => {
        this.props.accept({ viewDetail: false, dataAttackFile: { namePrint: item.name, key: item.key, value: item.value, adProcessId: item.adProcessId } })
      })
    } else {
      this.setState({ item, visible: false, showModalChild: true }, () => {
        setTimeout(() => this.setState({ visible: true, namePrint: item.name, key: item.key, value: item.value, adProcessId: item.adProcessId }), 500)
      })
    }
  }

  _onPressItemRequestForAdvances = (item) => {
    if (!item.options) {
      this.setState({ item, visible: false }, () => {
        this.props.accept({ viewDetail: false, dataAttackFile: { namePrint: item.name, key: item.key, value: item.value, adProcessId: item.adProcessId } })
      })
    } else {
      this.setState({ item, visible: false, showModalChild: true }, () => {
        setTimeout(() => this.setState({ visible: true, namePrint: item.name, key: item.key, value: item.value, adProcessId: item.adProcessId }), 500)
      })
    }
  }

  _onChangePicker = (item, type) => {
    if (type === 'typePrint') this.setState({ typePrint: item.value })
    else if (type === 'footTypeSign') this.setState({ footTypeSign: item.value })
  }

  _renderScene = ({ route }) => {
    switch (route.key) {
      case 1:
        return <MoneyTransferOffer onPressItem={(item) => this._onPressItemMoneyTransferOffer(item)} />
      case 2:
        return <RequestForAdvances onPressItem={(item) => this._onPressItemRequestForAdvances(item)} />
      default:
        return null
    }
  }

  _renderModal = () => {
    const { modalAdvancdeRequest, showModalChild, item } = this.state
    if (modalAdvancdeRequest) {
      if (!showModalChild) {
        return this._renderModalAdvanceRequest()
      } else {
        return this._renderModalChild(item)
      }
    } else {
      return null
    }
  }

  _renderModalAdvanceRequest = () => (
    <View style={{ height: HEIGHTXD(860) }}>
      <TabView
        swipeEnabled={true}
        renderTabBar={renderTabbar}
        navigationState={this.state}
        renderScene={this._renderScene}
        onIndexChange={index => {
          this.setState({ index })
        }}
        initialLayout={initialLayout}
      />
    </View>
  )

  _renderModalChild = (item) => {
    const dataDropdownPrint = item.typePrint ? item.typePrint : []
    const dataDropdownFootTypeSign = item.footTypeSign ? item.footTypeSign : []
    return (
      <View style={{ justifyContent: 'center', paddingHorizontal: WIDTHXD(40), paddingBottom: WIDTHXD(30) }}>
        <Text style={[styles.namePrint, { fontSize: getFontXD(42), marginTop: HEIGHTXD(24) }]}>{item.name}</Text>
        {item.typePrint
          ? (<View style={[styles.viewRow, { marginBottom: HEIGHTXD(50) }]}>
            <Text style={styles.typePrint}>Loại phiếu in</Text>
            <PickerItem
              style={{ marginLeft: WIDTHXD(40) }}
              width={WIDTHXD(690)}
              data={dataDropdownPrint}
              onValueChange={(position, itemChild) => this._onChangePicker(itemChild, 'typePrint')}
            />
          </View>)
          : null}
        {item.footTypeSign
          ? (<View style={[styles.viewRow, { marginBottom: HEIGHTXD(50) }]}>
            <Text style={styles.typePrint}>Loại chân ký</Text>
            <PickerItem
              style={{ marginLeft: WIDTHXD(40) }}
              width={WIDTHXD(690)}
              data={dataDropdownFootTypeSign}
              onValueChange={(position, itemChild) => this._onChangePicker(itemChild, 'footTypeSign')}
            />
          </View>)
          : null}
        {item.checkbox ? this._renderCheckbox(item.checkbox) : null}
        {item.times ? this._renderTimes() : null}
        <TouchableOpacity
          onPress={() => this.setState({ visible: false, showModalChild: false }, () => {
            this.props.accept({
              viewDetail: false,
              dataAttackFile: {
                namePrint: this.state.namePrint,
                typePrint: this.state.typePrint,
                footTypeSign: this.state.footTypeSign,
                checkboxSign: this.state.checkboxSign,
                checkboxPrint: this.state.checkboxPrint,
                th: this.state.th,
                date: this.state.date,
                key: this.state.key,
                value: this.state.value,
                adProcessId: this.state.adProcessId
              }
            })
          })}
          style={styles.btAccept}
        >
          <Text style={styles.txtAccept}>ĐỒNG Ý</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderCheckbox = (data) => {
    return (
      <View style={[{ flexDirection: 'row' }, { justifyContent: data.length === 2 ? 'space-around' : 'flex-start' }]}>
        <View style={styles.rowCheckBox}>
          <CheckBox
            checked={this.state.checkboxSign}
            size={WIDTHXD(30)}
            color={R.colors.colorNameBottomMenu}
            style={{ borderRadius: HEIGHTXD(18), marginLeft: -WIDTHXD(24) }}
            onPress={() => this.setState({ checkboxSign: !this.state.checkboxSign })}
          />
          <Text style={styles.nameCheckbox}>{data[0]}</Text>
        </View>
        {data[1]
          ? <View style={styles.rowCheckBox}>
            <CheckBox
              checked={this.state.checkboxPrint}
              size={WIDTHXD(30)}
              color={R.colors.colorNameBottomMenu}
              style={{ borderRadius: HEIGHTXD(18) }}
              onPress={() => this.setState({ checkboxPrint: !this.state.checkboxPrint })}
            />
            <Text style={styles.nameCheckbox}>{data[1]}</Text>
          </View> : null}
      </View>
    )
  }

  _renderTimes = () => {
    return (
      <View style={styles.viewTime}>
        <View style={{ flex: 1.5, }}>
          <Text style={styles.label}>Đợt</Text>
          <TextInput
            onChangeText={th => this.setState({ th })}
            style={styles.textInput}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ alignSelf: 'flex-end' }}>
            <Text style={styles.label}>Ngày</Text>
            <PickerDate
              containerStyle={styles.ctnPicker}
              width={WIDTHXD(342)}
              onValueChange={date => this.setState({ date })}
            />
          </View>
        </View>
      </View>
    )
  }

  _createDataDropdown = (data) => {
    console.log('DTATAAA', data)
    // let result = []
    // _.forEach(data, (item, index) => {
    //   result.push({ name: item, value: index })
    // })
    return data
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => this.setState({ showModalChild: false, visible: false })}
      >
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback
            onPress={() => { this.setState({ showModalChild: false, visible: false }) }}
          >
            <View
              style={styles.opacity}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modal}>
                  <View style={styles.viewTitle}>
                    <View style={styles.viewEmpty}></View>
                    <Text style={styles.titlePopup}>Chọn Phiếu In</Text>
                    <TouchableOpacity onPress={() => this.setState({ showModalChild: false, visible: false })} style={styles.btClose}>
                      <IconClose name="close" size={WIDTHXD(48)} color={R.colors.black0} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.menu}>
                    {this._renderModal()}
                  </View>
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
    alignItems: 'center',
    backgroundColor: '#rgba(0,0,0,0.3)',
    flexDirection: 'row'
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
    alignSelf: 'flex-end',
    backgroundColor: R.colors.white100,
    width: getWidth(),
    borderTopLeftRadius: WIDTHXD(20),
    borderTopRightRadius: WIDTHXD(20),
    paddingBottom: WIDTHXD(40)
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
    marginBottom: HEIGHTXD(12),
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
