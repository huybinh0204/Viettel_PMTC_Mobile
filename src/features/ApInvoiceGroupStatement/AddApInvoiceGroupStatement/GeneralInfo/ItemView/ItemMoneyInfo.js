import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity, FlatList, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'assets/languages/i18n';
import PickerItem from '../../../../../common/Picker/PickerItem';
import ItemTitle from '../../../../../common/Item/ItemTitle';
import R from '../../../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth, getLineHeightXD, toPriceVnd } from '../../../../../config/Function';
import _ from 'lodash'

class ItemMoneyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      body: {},
      isEditCurrentRate: true,
      isReadOnly: false
    }
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({ body: this.props.value, isReadOnly: this.props.isReadOnly })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ body: nextProps.value })
    }
    if (nextProps.isReadOnly !== this.props.isReadOnly) {
      this.setState({ isReadOnly: nextProps.isReadOnly })
    }
    if (nextProps.showAllField !== this.props.showAllField) {
      this.setState({ expanded: nextProps.showAllField })
    }
  }

  changeLayout = () => {
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

  renderItem = (item) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: HEIGHTXD(30) }}>
      <Text style={styles.type}>{item.type}</Text>
      <View style={styles.borderText}>
        <Text style={styles.deNghi}>{item.deNghi}</Text>
      </View>
      <View style={styles.borderText}>
        <Text style={styles.duocDuyet}>{item.duocDuyet}</Text>
      </View>

    </View>
  )

  render() {
    const { expanded, body } = this.state;
    let { currency, isCreate, onChangeValue } = this.props
    let nameCurrentID = ''
    if (!_.isEmpty(currency)) {
      _.forEach(currency, item => {
        if (item.fwmodelId === body.cCurrencyId) {
          nameCurrentID = item.name;
        }
      })
    }
    let requestAmount = body.requestAmount ? toPriceVnd(body.requestAmount) : "0"
    let approvedAmount = body.approvedAmount ? toPriceVnd(body.approvedAmount) : "0"
    let materialAmount = body.productAmount ? toPriceVnd(body.productAmount) : "0"

    let fontSize = getFontXD(42);
    const maxLen = Math.max(requestAmount.length, approvedAmount.length, materialAmount.length)
    const maxAllow = Platform.OS === 'ios' ? 15 : 14;

    if (maxLen > maxAllow) {
      fontSize = fontSize * (maxAllow / maxLen);
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexTitle, { borderBottomWidth: (expanded === true) ? 0.3 : 0, paddingHorizontal: WIDTHXD(30) }]}
        >
          <Text style={styles.title}>{i18n.t('AMOUNT_INFORMATION')}</Text>
          {expanded === true ? <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(50) }} color={R.colors.iconGray} />
            : <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(50) }} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded && (
          <View style={{ paddingHorizontal: WIDTHXD(30), paddingVertical: HEIGHTXD(40) }}>

            <View style={styles.flexRow}>
              <ItemTitle
                title={i18n.t('CURRENCY_T')}
                isRequire={true}
              />
              <View style={styles.ctnTienTe}>
                <PickerItem
                  disabled={this.state.isReadOnly}
                  value={nameCurrentID}
                  defaultValue={nameCurrentID}
                  width={WIDTHXD(220)}
                  data={currency}
                  onValueChange={(index, itemChild) => {
                    if (itemChild.fwmodelId === 234) {
                      body.currencyRate = 1
                      this.setState({ body, isEditCurrentRate: false })
                    } else {
                      this.setState({ isEditCurrentRate: true })
                    }
                    onChangeValue({ key: 'cCurrencyId', value: parseInt(itemChild.fwmodelId, 10) })
                  }}
                />
              </View>
            </View>
            {isCreate ? null : (
              <View>
                {(body.type === 3 || body.type === 4) ?
                  <View style={[styles.flexRow, { justifyContent: "space-between" }]}>
                    <Text style={[styles.label]}>{i18n.t('MATERIAL_AMOUNT')}</Text>
                    <View style={styles.money_info_item_left_text_right_container}>
                      <Text style={{ ...styles.money_info_item_left_text_right, fontSize }} adjustsFontSizeToFit numberOfLines={1}>{materialAmount}</Text>
                    </View>
                  </View>
                  : null}
                <View style={[styles.flexRow, { justifyContent: "space-between" }]}>
                  <Text style={[styles.label]}>{i18n.t('REQUEST_AMOUNT')}</Text>
                  <View style={styles.money_info_item_left_text_right_container}>
                    <Text style={{ ...styles.money_info_item_left_text_right, fontSize }} adjustsFontSizeToFit numberOfLines={1}>{requestAmount}</Text>
                  </View>
                </View>
                <View style={[styles.flexRow, { justifyContent: "space-between" }]}>
                  <Text style={[styles.label]}>{i18n.t('APPROVED_AMOUNT')}</Text>
                  <View style={styles.money_info_item_left_text_right_container}>
                    <Text style={{ ...styles.money_info_item_left_text_right, fontSize }} adjustsFontSizeToFit numberOfLines={1}>{approvedAmount}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>)}
      </View>
    )
  }
}

export default ItemMoneyInfo;

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
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: HEIGHTXD(20),
  },
  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(36),
    borderBottomColor: R.colors.borderGray
  },
  flexColumn: {
    flexDirection: 'column',
  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
  },
  wrapperText: {
    width: WIDTHXD(200),
    paddingHorizontal: WIDTHXD(8),
    alignItems: 'flex-end',
    textAlign: 'right',
    borderBottomColor: R.colors.borderGray,
    borderBottomWidth: WIDTHXD(1),
    fontSize: getFontXD(42),
    paddingVertical: 0,
    marginLeft: WIDTHXD(12),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    marginRight: WIDTHXD(16)
  },
  label: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
  },
  line: {
    height: HEIGHTXD(235),
    position: 'absolute',
    width: WIDTHXD(4),
    right: WIDTHXD(330),
    bottom: HEIGHTXD(36),
    backgroundColor: R.colors.colorBackground,
    flex: 1,
  },
  type: {
    width: WIDTHXD(320),
    marginLeft: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(60),
  },
  borderText: {
    borderBottomColor: R.colors.borderGray,
    borderBottomWidth: WIDTHXD(1),
    paddingLeft: HEIGHTXD(36),
  },

  deNghi: {
    width: getWidth() / 5,
    textAlign: 'right',
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36),
  },
  duocDuyet: {
    width: getWidth() / 5,
    textAlign: 'right',
    marginRight: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36),
  },
  leftTitle: {
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(36),
  },
  rightTitle: {
    marginRight: WIDTHXD(50),
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(36),
  },
  tigia: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  ctnTienTe: {
    marginLeft: WIDTHXD(230),
    justifyContent: 'center',
    paddingRight: WIDTHXD(116)
  },
  money: {
    borderBottomColor: R.colors.iconGray,
    borderBottomWidth: 0.3,
    paddingVertical: 0,
    paddingLeft: WIDTHXD(25),
    textAlign: 'right',
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    fontSize: getFontXD(R.fontsize.contentFieldTextSize)
  },
  money_info_item_left_text_right: {
    minWidth: WIDTHXD(217),
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    textAlign: 'right'
  },
  money_info_item_left_text_right_container: {
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    paddingBottom: HEIGHTXD(6),
    minWidth: WIDTHXD(330),
  },
})
