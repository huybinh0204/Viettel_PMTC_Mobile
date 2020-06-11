import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'assets/languages/i18n';
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigationService from 'routers/NavigationService';
import { ListCustomer } from 'routers/screenNames';
import moment from 'moment';
import PickerItem from '../../../../../common/Picker/PickerItem';
import PickerDate from '../../../../../common/Picker/PickerDate';
import R from '../../../../../assets/R';
import { getFontXD, WIDTHXD, HEIGHTXD, getWidth, getLineHeightXD } from '../../../../../config/Function';
import ItemTextForGeneral from './ItemTextForGeneral'
import global from '../../../global'
import { redStar } from 'common/Require';
import { getPartner } from '../../../../../apis/Functions/statement'
import _ from 'lodash'

class ItemGeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    global.hideGeneralInfor = this._hideGeneralInfor.bind(this)
  }

  _hideGeneralInfor = (isHide) => {
    this.setState({ expanded: isHide })
  }

  _changeLayout = () => {
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

  _findCBParner = async (taxCode) => {
    let body = {
      isSize: true,
      adOrgId: this.props.adOrgId,
      name: taxCode
    }
    let res = await getPartner(body);
    // let res = await ApiInvoice.searchDebtSubject(body)
    if (res && res.data && res.data.length === 2) {
      if (res.data[0].taxCode === taxCode) {
        const { self } = this.props
        self.dataItem.sellerName = res.data[0].name
        self._reRender()
      }
    }
  }

  render() {
    const { item, self } = this.props;
    const { expanded } = this.state;
    global.isHideGeneralInfor = !expanded
    global.updateHeader()
    let serviceTypeName = ''
    if (self.dataItem.serviceType) {
      _.forEach(R.strings.TYPE_GOODS_SERVIVE, (item) => {
        if (self.dataItem.serviceType === item.id) {
          serviceTypeName = item.name
        }
      })
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this._changeLayout}
          style={[styles.flexTitle, { borderBottomWidth: (expanded === true) ? 0.3 : 0 }]}
        >
          <Text style={styles.title}>{i18n.t('GENERAL_INFORMATION')}</Text>
          {expanded && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} color={R.colors.iconGray} />}
          {!expanded && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded
          && (
            <View style={{ paddingLeft: WIDTHXD(30), paddingRight: WIDTHXD(31), paddingTop: HEIGHTXD(40) }}>
              {self.dataItem.documentNo
                ? <View style={styles.flexRowDoc}>
                  <Text style={[styles.label, { textAlign: 'left', flex: 1.5 }]}>Bảng THTT</Text>
                  <Text style={{ fontSize: getFontXD(42), fontFamily: R.fonts.RobotoRegular, textAlign: 'center', flex: 4.5 }}>{self.dataItem.documentNo}</Text>
                </View>
                : null}
              <View style={[styles.flexRow]}>
                <View style={styles.flexColumn}>
                  <Text style={styles.label}>{i18n.t('TYPE_INVOICE')}{redStar()}</Text>
                  <PickerItem
                    onValueChange={(value, valueItem) => {
                      self._reRender()
                      self.dataItem.groupChange = value
                    }}
                    width={WIDTHXD(692)}
                    defaultValue={(self.dataItem.groupChange && self.dataItem.groupChange !== null) ? R.strings.TYPE_INVOICE[self.dataItem.groupChange].name : ''}
                    maxHeight={HEIGHTXD(210)}
                    data={R.strings.TYPE_INVOICE}
                  />
                </View>
                <View style={styles.flexColumn}>
                  <Text style={styles.label}>{i18n.t('DATE_INVOICE')}{redStar()}</Text>
                  <PickerDate
                    width={WIDTHXD(342)}
                    onValueChange={(date) => {
                      self.dataItem.transDate = date
                      self.dataItem.dueDate = moment(new Date(moment(date, 'DD/MM/YYYY').format('MM/DD/YYYY')).getTime() + self.dayToDueDate * 24 * 60 * 60 * 1000).format('DD/MM/YYYY')
                      self._reRender()
                    }}
                    value={self.dataItem.transDate}
                  />
                </View>
              </View>
              <View style={[styles.flexRow, { marginTop: HEIGHTXD(40) }]}>
                <View style={styles.flexColumn}>
                  <Text style={styles.label}>{i18n.t('TYPE_GOODS_SERVICE')}{redStar()}</Text>
                  <PickerItem
                    onValueChange={(value) => {
                      self._reRender()
                      self.dataItem.serviceType = R.strings.TYPE_GOODS_SERVIVE[value].id
                    }}
                    width={WIDTHXD(1064)}
                    maxHeight={HEIGHTXD(396)}
                    data={R.strings.TYPE_GOODS_SERVIVE}
                    defaultValue={serviceTypeName}
                  />
                </View>
              </View>
              <View style={[styles.flexRow, { marginTop: HEIGHTXD(40) }]}>
                <ItemTextForGeneral
                  require={true}
                  onChangeValue={value => {
                    self.dataItem.template = value
                    self._reRender()
                  }}
                  title={i18n.t('INVOICE_CODE')}
                  value={self.dataItem.template}
                  maxLength={20}
                  width={WIDTHXD(332)}
                />
                <ItemTextForGeneral
                  require={true}
                  onChangeValue={value => {
                    self._reRender()
                    self.dataItem.symbol = value
                  }}
                  title={i18n.t('SYMBOY_T')}
                  value={self.dataItem.symbol}
                  maxLength={20}
                  width={WIDTHXD(332)}
                />
                <ItemTextForGeneral
                  require={true}
                  onChangeValue={value => {
                    self._reRender()
                    self.dataItem.invoiceNo = value
                  }}
                  title={i18n.t('NO_INVOICE')}
                  value={self.dataItem.invoiceNo}
                  maxLength={20}
                  width={WIDTHXD(340)}
                />
              </View>
              <View style={[styles.flexColumn, { alignItems: 'flex-start', marginTop: HEIGHTXD(40) }]}>
                <Text style={styles.label}>{i18n.t('C_BPARTNER_ID')}</Text>
                <TouchableOpacity
                  onPress={() => {
                    NavigationService.navigate(ListCustomer, {
                      onPressItem: (items) => {
                        self.dataItem.cBpartnerId = items.cBpartnerId
                        self.dataItem.cBpartnerName = items.name
                        self._reRender()
                      }
                    })
                  }}
                  style={[styles.searchPicker]}
                >
                  <Text numberOfLines={1} style={[styles.textStyle, { width: WIDTHXD(900) }]}>{self.dataItem.cBpartnerName}</Text>
                  <TouchableOpacity disabled={!self.dataItem.cBpartnerId}
                    hitSlop={{ left: 20, top: 20, right: 20, bottom: 20 }}
                    onPress={() => {
                      self.dataItem.cBpartnerId = null
                      self.dataItem.cBpartnerName = null
                      self._reRender()
                    }}>
                    <AntDesign name={self.dataItem.cBpartnerId ? 'close' : 'search1'} size={WIDTHXD(43)} color={R.colors.iconGray} />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <View style={[styles.flexRow, { marginTop: HEIGHTXD(40) }]}>
                <ItemTextForGeneral
                  onChangeValue={async (value) => {
                    // if (cbParner) {
                    //   self.dataItem.sellerName = cbParner.name
                    // }
                    self._reRender()
                    self.dataItem.taxCode = value
                    this._findCBParner(value)
                  }}
                  require={true}
                  title={i18n.t('TAX_CODE')}
                  value={item && item.taxCode}
                  maxLength={20}
                  width={WIDTHXD(450)}
                />
                <ItemTextForGeneral
                  onChangeValue={value => {
                    self._reRender()
                    self.dataItem.sellerName = value
                  }}
                  require={true}
                  title={i18n.t('SELLER_NAME')}
                  value={item && item.sellerName}
                  maxLength={50}
                  width={WIDTHXD(584)}
                />
              </View>

              <View style={[styles.flexColumn, styles.lastItem]}>
                <ItemTextForGeneral
                  onChangeValue={value => {
                    self._reRender()
                    self.dataItem.address = value
                  }}
                  title={i18n.t('ADDRESS_T')}
                  maxLength={250}
                  value={self.dataItem.address}
                  width={WIDTHXD(1064)}
                />
                <TextInput
                  multiline
                  maxLength={250}
                  value={self.dataItem.description}
                  onChangeText={value => {
                    self._reRender()
                    self.dataItem.description = value
                  }}
                  placeholder="Nội dung tên hàng hóa/ dịch vụ"
                  style={styles.formEnterInfo}
                />
              </View>

            </View>
          )}
      </View>
    )
  }
}

export default ItemGeneralInfo;

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
  flexRowDoc: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: HEIGHTXD(40),
    marginBottom: HEIGHTXD(20)
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
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: R.colors.iconGray,
  },
  flexColumn: {
    flexDirection: 'column',
  },
  title: {
    fontSize: getFontXD(R.fontsize.contentFieldTextSize),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
  },
  formEnterInfo: {
    textAlignVertical: 'top',
    paddingHorizontal: WIDTHXD(36),
    minHeight: HEIGHTXD(200),
    fontSize: getFontXD(R.fontsize.contentFieldTextSize),
    width: WIDTHXD(1064),
    marginTop: HEIGHTXD(40),
    paddingBottom: HEIGHTXD(30),
    borderColor: R.colors.borderGray,
    borderWidth: 1,
    borderRadius: WIDTHXD(20)
  },
  wrapperText: {
    width: WIDTHXD(352),
    paddingHorizontal: WIDTHXD(36),
    borderRadius: HEIGHTXD(20),
    height: HEIGHTXD(99),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
  },
  lastItem: {
    alignItems: 'flex-start',
    marginBottom: HEIGHTXD(46),
    marginTop: HEIGHTXD(40)
  },
  label: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(11),
    color: R.colors.label,
  },
  content: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(R.fontsize.contentFieldTextSize),
    color: R.colors.black0
  },
  searchPicker: {
    width: WIDTHXD(1064),
    borderRadius: HEIGHTXD(20),
    paddingHorizontal: WIDTHXD(36),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: HEIGHTXD(99),
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
    color: R.colors.black0,
  },
  textStyle: {
    fontFamily: R.fonts.RobotoRegular,
    width: WIDTHXD(800),
    fontSize: getFontXD(42),
  },
})
