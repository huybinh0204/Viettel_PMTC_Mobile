import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList } from 'react-native'
import IconClose from 'react-native-vector-icons/AntDesign'
import _ from 'lodash'
import R from '../../../assets/R'
import { getWidth, getHeight, getFontXD, WIDTHXD, HEIGHTXD } from '../../../config/Function'
import * as constants from '../../../common/PrintedVotes/constants'
import PickerItem from '../../../common/Picker/PickerItem'
import { CheckBox } from 'native-base'
import NavigationService from 'routers/NavigationService'
import { NetworkSetting } from '../../../config/Setting';
import { showAlert, TYPE } from 'common/DropdownAlert'


type Props = {
  openModalPrint: Boolean
}

export default class PrintedSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      index: 0,
      showModalChild: false,
      item: {},
      typePrint: null,
      typeInvoiceGroup: null,
      footTypeSign: null,
      listData: [
        {
          Ad_process_id: 10387,
          reportName: 'BangTHCTGopTHTT',
          name: 'BTHTT cho chi tiết hóa đơn',
          value: 1,
          showModalChild: true,
          typePrint: [
            {
              columnName: 'Criteria',
              value: 1,
              name: constants.DROPDOWN_LIST_INVOICE_GROUP_TYPE,

            }, {
              columnName: 'Criteria',
              value: 2,
              name: constants.DROPDOWN_LIST_INVOICE_TYPE
            }
          ],
          footTypeSign: [
            {
              columnName: 'LoaiChanKy',
              value: '2CK',
              name: constants.DROPDOWN_LIST_LOAI_2_CHAN_KY_TAI_CHINH,

            },
            {
              columnName: 'LoaiChanKy',
              value: '2CK',
              name: constants.DROPDOWN_LIST_LOAI_2_CHAN_KY_PHONG_BAN,

            },
            {
              columnName: 'LoaiChanKy',
              value: '4CK',
              name: constants.DROPDOWN_LIST_LOAI_4_CHAN_KY,

            },
            {
              columnName: 'LoaiChanKy',
              value: '5CK',
              name: constants.DROPDOWN_LIST_LOAI_5_CHAN_KY,

            },
          ]
        },
        {
          Ad_process_id: 5000,
          reportName: 'BangTHNBGopTHTT',
          name: 'Bảng THNB Gộp',
          value: 1,
          showModalChild: true,
          checkbox: [
            {
              columnName: 'BaoGomVatTu',
              checked: false,
              name: constants.CHECKBOX_BAO_GOM_VAT_TU,
            },
            {
              columnName: 'CapTren',
              checked: false,
              name: constants.CHECKBOX_DAYLEN_CAP_TREN,
            },
            {
              columnName: 'IsTD',
              checked: false,
              name: constants.CHECKBOX_IN_TAI_TAP_DOAN,
            },
            {
              columnName: 'InTheoKM',
              checked: false,
              name: constants.CHECKBOX_IN_THEO_KHOAN_MUC
            }
          ],
          typePrint: [
            {
              columnName: 'Criteria',
              value: 1,
              name: constants.DROPDOWN_LIST_INVOICE_GROUP_TYPE,

            }, {
              columnName: 'Criteria',
              value: 2,
              name: constants.DROPDOWN_LIST_INVOICE_TYPE
            }
          ],
          footTypeSign: [
            {
              columnName: 'LoaiChanKy',
              value: '2CK',
              name: constants.DROPDOWN_LIST_LOAI_2_CHAN_KY,

            },
            {
              columnName: 'LoaiChanKy',
              value: '3CK',
              name: constants.DROPDOWN_LIST_LOAI_3_CHAN_KY,

            },
            {
              columnName: 'LoaiChanKy',
              value: '4CK',
              name: constants.DROPDOWN_LIST_LOAI_4_CHAN_KY,

            },
            {
              columnName: 'LoaiChanKy',
              value: '5CK',
              name: constants.DROPDOWN_LIST_LOAI_5_CHAN_KY,

            },
          ]
        },
        {
          Ad_process_id: 5002,
          reportName: 'BangTHTTCoToTrinh',
          name: 'Bảng THTT Có tờ trình',
          value: 1,
          showModalChild: true,
          checkbox: [{ columnName: 'InTheoKM', checked: false, name: constants.CHECKBOX_IN_THEO_KHOAN_MUC }],
          typeInvoiceGroup: [
            {
              columnName: 'LoaiBTH',
              value: 'THTT',
              name: constants.DROPDOWN_LIST_INVOICE_GROUP_TYPE,

            },
            {
              columnName: 'LoaiBTH',
              value: 'THNB',
              name: constants.DROPDOWN_LIST_INVOICE_GROUP_INTERNAL_TYPE,

            },
            {
              columnName: 'LoaiBTH',
              value: 'TNCN',
              name: constants.DROPDOWN_LIST_INVOICE_GROUP_PERSONAL_TYPE,

            },

          ],
          footTypeSign: [
            {
              columnName: 'LoaiChanKy',
              value: '2CK',
              name: constants.DROPDOWN_LIST_LOAI_2_CHAN_KY,

            },
            {
              columnName: 'LoaiChanKy',
              value: '4CK',
              name: constants.DROPDOWN_LIST_LOAI_4_CHAN_KY,

            },
            {
              columnName: 'LoaiChanKy',
              value: '5CK',
              name: constants.DROPDOWN_LIST_LOAI_5_CHAN_KY,

            },
          ]
        },
        {
          Ad_process_id: 5002,
          reportName: 'BangTHTTCoToTrinh',
          name: 'Bảng THTT theo khoản mục',
          value: 1,
          showModalChild: true,
          typeInvoiceGroup: [
            {
              columnName: 'LoaiBTH',
              value: 'THTT',
              name: constants.DROPDOWN_LIST_INVOICE_GROUP_TYPE,

            },
            {
              columnName: 'LoaiBTH',
              value: 'THNB',
              name: constants.DROPDOWN_LIST_INVOICE_GROUP_INTERNAL_TYPE,

            },
          ],
        },
        {
          Ad_process_id: 5003,
          reportName: 'BangTHTTVatTuQuyetToan',
          name: 'Bảng THTT Vật tư QT',
          value: 1,
          showModalChild: false,
        },
        {
          Ad_process_id: 5018,
          reportName: 'GiayTTTUToTrinh',
          name: 'Giấy TTTU Tờ trình',
          value: 1,
          showModalChild: false,
        },
        {
          Ad_process_id: 5019,
          reportName: 'GiayTTTU',
          name: 'Giấy TTTU',
          value: 1,
          showModalChild: false,
        },
        {
          Ad_process_id: 5022,
          reportName: 'CTGS_Report_New',
          name: 'Chứng từ ghi sổ',
          value: 1,
          showModalChild: true,
          checkbox: [
            {
              columnName: 'KyASSC',
              checked: false,
              name: constants.CHECKBOX_ASSC,
            }
          ]
        },
        {
          Ad_process_id: 5001,
          reportName: 'BangTHTTASSC',
          name: 'Bảng THTT ASSC',
          value: 1,
          showModalChild: true,
          checkbox: [
            {
              columnName: 'ChiTietHD',
              checked: false,
              name: constants.CHECKBOX_CHI_TIET_HOA_DON,
            }
          ]
        },
        {
          Ad_process_id: 11081,
          reportName: 'BangTHTT_TTVTNET',
          name: 'Bảng THTT trung tâm (VTNet)',
          value: 1,
          showModalChild: true,
          checkbox: [
            {
              columnName: 'GopBTHTT',
              checked: false,
              name: constants.CHECKBOX_GOP_BTHTT,
            },
            {
              columnName: 'BaoGomVatTu',
              checked: false,
              name: constants.CHECKBOX_BAO_GOM_VAT_TU,
            }
          ]
        },
        {
          Ad_process_id: 11082,
          reportName: 'BangTHTT_PBVTNET',
          name: 'Bảng THTT phòng ban (VTNet)',
          value: 1,
          showModalChild: false,
        },
      ]
    }
  }

  setModalVisible = (visible) => {
    this.setState({
      visible,
      showModalChild: false
    })
  }

  _onPressItem = (item) => {
    this.setState({ item, visible: false, showModalChild: item.showModalChild }, () => {
      if (this.state.item.showModalChild) {
        setTimeout(() => this.setState({ visible: true }), 500)
      } else {
        this._accept(item)
      }
    })

  }
  _renderModalChild = (item) => {
    const dataDropdownPrint = item.typePrint ? item.typePrint : []
    const dataDropdownInvoiceGroup = item.typeInvoiceGroup ? item.typeInvoiceGroup : []
    const dataDropdownFootTypeSign = item.footTypeSign ? item.footTypeSign : []
    return (
      <View style={{ justifyContent: 'center', paddingHorizontal: WIDTHXD(80), paddingBottom: WIDTHXD(30) }}>
        <Text style={[styles.namePrint, { textAlignVertical: "center", textAlign: "center", fontSize: getFontXD(42), marginTop: HEIGHTXD(24) }]}>{item.name}</Text>
        {item.typePrint
          ? (<View style={[styles.viewRow, { marginBottom: HEIGHTXD(50) }]}>
            <Text style={styles.typePrint}>Loại phiếu in</Text>
            <PickerItem
              style={{ marginLeft: WIDTHXD(40) }}
              width={WIDTHXD(690)}
              isTriangle={true}
              data={dataDropdownPrint}
              onValueChange={(position, itemChild) => this.setState({ typePrint: itemChild })}

            />
          </View>)
          : null}
        {item.typeInvoiceGroup
          ? (<View style={[styles.viewRow, { marginBottom: HEIGHTXD(50) }]}>
            <Text style={styles.typePrint}>Loại BTHTT</Text>
            <PickerItem
              style={{ marginLeft: WIDTHXD(40) }}
              width={WIDTHXD(690)}
              isTriangle={true}
              data={dataDropdownInvoiceGroup}
              onValueChange={(position, itemChild) => this.setState({ typeInvoiceGroup: itemChild })}
            />
          </View>)
          : null}
        {item.footTypeSign
          ? (<View style={[styles.viewRow, { marginBottom: HEIGHTXD(50) }]}>
            <Text style={styles.typePrint}>Loại chân ký</Text>
            <PickerItem
              style={{ marginLeft: WIDTHXD(40) }}
              width={WIDTHXD(690)}
              isTriangle={true}
              data={dataDropdownFootTypeSign}
              onValueChange={(position, itemChild) => this.setState({ footTypeSign: itemChild })}
            />
          </View>)
          : null}
        {item.checkbox ? this._renderCheckbox(item.checkbox) : null}
        {/* {item.times ? this._renderTimes() : null} */}
        <TouchableOpacity
          onPress={() => this._accept(item)}
          // onPress={() => this.setState({ visible: false }, () => {
          //   this.props.accept({
          //     viewDetail: false,
          //     dataAttackFile: {
          //       namePrint: item.name,
          //       typePrint: this.state.typePrint,
          //       typeInvoiceGroup: this.state.typeInvoiceGroup,
          //       footTypeSign: this.state.footTypeSign,
          //     }
          //   })
          // })}
          style={styles.btAccept}>
          <Text style={styles.txtAccept}>ĐỒNG Ý</Text>
        </TouchableOpacity>
      </View>
    )
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

  _accept = (item) => {
    let conditionArray = []
    if (item.typePrint) {
      if (this.state.typePrint) {
        let condition = {
          columnName: this.state.typePrint.columnName,
          value: this.state.typePrint.value,
          reportName: item.reportName,
          dataType: 'List',
        }
        conditionArray.push(JSON.stringify(condition))
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Bạn chưa chọn loại phiếu in')
        return
      }
    }

    if (item.typeInvoiceGroup) {
      if (this.state.typeInvoiceGroup) {
        let typeInvoiceGroup = {
          columnName: this.state.typeInvoiceGroup.columnName,
          value: this.state.typeInvoiceGroup.value,
          reportName: item.reportName,
          isspecial: 'Y',
          dataType: 'List',
        }
        conditionArray.push(JSON.stringify(typeInvoiceGroup))
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Bạn chưa chọn loại BTHTT')
        return
      }
    }

    if (item.footTypeSign) {
      if (this.state.footTypeSign) {
        let footTypeSign = {
          columnName: this.state.footTypeSign.columnName,
          value: this.state.footTypeSign.value,
          reportName: item.reportName,
          dataType: 'List',
        }
        conditionArray.push(JSON.stringify(footTypeSign))
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Bạn chưa chọn loại chân ký')
        return
      }
    }

    if (item.checkbox) {
      _.forEach(item.checkbox, (itemCheck) => {
        let checkInfo = {}
        if (itemCheck.name === constants.CHECKBOX_BAO_GOM_VAT_TU || itemCheck.name === constants.CHECKBOX_IN_THEO_KHOAN_MUC || itemCheck.name === constants.CHECKBOX_IN_THEO_KHOAN_MUC) {
          checkInfo = {
            columnName: itemCheck.columnName,
            value: itemCheck.checked ? 'Y' : 'N',
            reportName: item.reportName,
            isspecial: 'Y',
            dataType: 'Yes-No',
          }
        } else {
          checkInfo = {
            columnName: itemCheck.columnName,
            value: itemCheck.checked ? 'Y' : 'N',
            reportName: item.reportName,
            dataType: 'Yes-No',
          }
        }
        conditionArray.push(JSON.stringify(checkInfo))
      })

    }
    let conditionString = ''
    _.forEach(conditionArray, (item) => {
      if (conditionString !== '') {
        conditionString = `${conditionString},${item}`
      } else {
        conditionString = `${item}`
      }
    })

    let url = `${NetworkSetting.ROOT}/erp-service/reportStarterServiceRest/reportStarter/exportPdf?AD_Process_ID=${item.Ad_process_id}&reportName=${item.reportName}&AD_User_ID=${this.props.userId}&REPORT_MODE=1&RECORD_ID=${this.props.recordId}&condition=[${conditionString}]`
    let fileName = this._randomName(item.reportName, 20)
    this.props.accept(url, item.name, fileName)
    this.setState({ visible: false })
  }

  _renderCheckbox = (data) => {
    return (
      <View style={{ justifyContent: 'center' }}>
        <View style={[{ flexDirection: 'row' }, { justifyContent: 'space-around' }]}>
          <View style={styles.rowCheckBox}>
            <CheckBox
              checked={data[0].checked}
              size={WIDTHXD(30)}
              color={R.colors.colorNameBottomMenu}
              style={{ borderRadius: HEIGHTXD(18), marginLeft: -WIDTHXD(24) }}
              onPress={() => {
                data[0].checked = !data[0].checked
                let item = this.state.item
                item.data = data[0]
                this.setState({
                  item
                })
              }}
            />
            <Text style={styles.nameCheckbox}>{data[0].name}</Text>
          </View>
          {data[1] ?
            <View style={styles.rowCheckBox}>
              <CheckBox
                checked={data[1].checked}
                size={WIDTHXD(30)}
                color={R.colors.colorNameBottomMenu}
                style={{ borderRadius: HEIGHTXD(18) }}
                onPress={() => {
                  data[1].checked = !data[1].checked
                  let item = this.state.item
                  item.data = data[1]
                  this.setState({
                    item
                  })
                }}
              />
              <Text style={styles.nameCheckbox}>{data[1].name}</Text>
            </View>
            : null}
        </View>
        {data[2] ?
          <View style={[{ flexDirection: 'row', marginTop: HEIGHTXD(40) }, { justifyContent: 'space-around' }]}>
            <View style={styles.rowCheckBox}>
              <CheckBox
                checked={data[2].checked}
                size={WIDTHXD(30)}
                color={R.colors.colorNameBottomMenu}
                style={{ borderRadius: HEIGHTXD(18), marginLeft: -WIDTHXD(24) }}
                onPress={() => {
                  data[2].checked = !data[2].checked
                  let item = this.state.item
                  item.data = data[2]
                  this.setState({
                    item
                  })
                }}
              />
              <Text style={styles.nameCheckbox}>{data[2].name}</Text>
            </View>
            {data[3] ?
              <View style={styles.rowCheckBox}>
                <CheckBox
                  checked={data[3].checked}
                  size={WIDTHXD(30)}
                  color={R.colors.colorNameBottomMenu}
                  style={{ borderRadius: HEIGHTXD(18) }}
                  onPress={() => {
                    data[3].checked = !data[3].checked
                    let item = this.state.item
                    item.data = data[3]
                    this.setState({
                      item
                    })
                  }}
                />
                <Text style={styles.nameCheckbox}>{data[3].name}</Text>
              </View>
              : null}
          </View>
          : null}
      </View>
    )
  }

  _createDataDropdown = (data) => {
    let result = []
    _.forEach(data, (item, index) => {
      result.push({ name: item, value: index })
    })
    return result
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
                    <Text style={styles.titlePopup}>Chọn phiếu in</Text>
                    <TouchableOpacity onPress={() => this.setState({ visible: false })} style={styles.btClose}>
                      <IconClose name="close" size={WIDTHXD(48)} color={R.colors.black0} />
                    </TouchableOpacity>
                  </View>
                  {this.state.showModalChild ?
                    this._renderModalChild(this.state.item) :
                    <FlatList
                      data={this.state.listData}
                      style={styles.container}
                      keyExtractor={(item, index) => index.toString()}
                      extraData={this.state}
                      renderItem={({ item }) => {
                        return (
                          <TouchableOpacity
                            onPress={() => this._onPressItem(item)}
                            style={styles.btItem}
                          >
                            <Text style={styles.txtName}>{item.name}</Text>
                          </TouchableOpacity>
                        )
                      }}
                    />
                  }
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
    marginTop: HEIGHTXD(50)
  },
  rowCheckBox: {
    flex: 1,
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
    marginLeft: WIDTHXD(60)
  },
  typePrint: {
    width: WIDTHXD(250),
    marginRight: WIDTHXD(30),
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
    minHeight: HEIGHTXD(1000),
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
  container: {
    width: getWidth(),
    height: HEIGHTXD(390),
  },
  txtName: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    paddingVertical: HEIGHTXD(50),
    color: R.colors.black0
  },
})

