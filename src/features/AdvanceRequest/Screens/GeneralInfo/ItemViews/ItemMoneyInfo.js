import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity, TextInput } from 'react-native';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PickerItem from '../../../common/ItemPicker';
import R from '../../../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth, toPriceVnd, checkFormatItem, numberWithCommas, getLineHeightXD } from '../../../../../config/Function';
import i18n from '../../../../../assets/languages/i18n';
import { redStar } from '../../../../../common/Require';


class ItemMoneyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      body: {},
      isEditCurrentRate: false,
      selection: {
        start: 0,
        end: 0
      }
    }
  }

  componentDidMount() {
    let body = {}
    if (this.props.value) {
      body = this.props.value
      this.setState({ body })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ body: nextProps.value })
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
    this.setState({ expanded: !this.state.expanded }, () => this.props.updateExpanded(this.state.expanded, 1));
  }

  renderItem = (item: Object) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: HEIGHTXD(30) }}>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.deNghi}>{item.deNghi || 0}</Text>
      <Text style={styles.duocDuyet}>{item.duocDuyet}</Text>
    </View>
  );

  render() {
    const { currency, onChangeValue, value } = this.props;
    const { expanded, body, isEditCurrentRate } = this.state;
    let nameCurrentID = ''
    let fontSize = getFontXD(42)
    if (!_.isEmpty(currency)) {
      _.forEach(currency, item => {
        if (item.fwmodelId === body.cCurrencyId) {
          nameCurrentID = item.name;
        }
      })
    }

    const data = [
      { title: 'Tổng tiền', suggestion: checkFormatItem(body.requestAmount) ? numberWithCommas(body.requestAmount) : 0, approved: checkFormatItem(body.approvedAmount) ? numberWithCommas(body.approvedAmount) : 0 },
    ]

    const maxLen = Math.max(data[0].suggestion.length, data[0].approved.length)
    if (maxLen > 13) {
      fontSize = fontSize * (13 / maxLen);
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexRow, { borderBottomWidth: (expanded === true) ? 0.3 : 0, paddingHorizontal: WIDTHXD(30) }]}
        >
          <Text style={styles.title}>Thông tin số tiền</Text>
          {expanded === true ? <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />
            : <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded && <View style={{ paddingHorizontal: WIDTHXD(0) }}>

          <View style={styles.flexRow}>
            <View style={{
              flex: 1.8,
              flexDirection: 'row',
              paddingRight: WIDTHXD(104),
              alignItems: 'center',
              paddingLeft: WIDTHXD(48)
            }}
            >
              <Text style={[styles.label, { flex: 1 }]}>{i18n.t('CURRENCY_T')}{redStar()}</Text>
              <PickerItem
                enableEdit={this.props.enableEdit}
                value={nameCurrentID}
                width={WIDTHXD(220)}
                data={currency}
                require={false}
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
            <View style={styles.money_info_vertical_line} />
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.label, { flex: 1 }]}>{i18n.t('CURRENCY_RATE')}{redStar()}</Text>
              <View style={styles.wrapperText}>
                <TextInput
                  editable={isEditCurrentRate}
                  maxLength={8}
                  value={body.currencyRate ? body.currencyRate.toString() : ''}
                  style={{ padding: 0, margin: 0, textAlign: 'right', width: WIDTHXD(100) }}
                  keyboardType="number-pad"
                  onChangeText={(text) => {
                    body.currencyRate = parseInt(text, 10);
                    onChangeValue({ key: 'currencyRate', value: parseInt(text, 10) })
                    this.setState({ body });
                  }}
                />
              </View>
            </View>
          </View>
        </View>}
        {
          (this.state.expanded && (body.cAdvanceRequestId !== 0)) && (<View style={{ paddingHorizontal: WIDTHXD(0) }}>
            <View style={styles.wrapper}>
              <View style={styles.money_info_header_container}>
                <View style={styles.money_info_header_left_container}>
                  <View style={{ flex: 1 }} />
                  <Text style={styles.money_info_header_text_left}>Đề nghị</Text>
                </View>
                <View style={styles.money_info_vertical_line} />
                <Text style={styles.money_info_header_text_right}>Được duyệt</Text>
              </View>
              {data.map(element => (
                <View style={styles.money_info_item_container} key={element.title}>
                  <View style={styles.money_info_item_left_container}>
                    <Text style={styles.money_info_item_left_text_left}>{element.title}</Text>
                    <View style={styles.money_info_item_left_text_right_container}>
                      <Text style={{ ...styles.money_info_item_left_text_right, fontSize }} adjustsFontSizeToFit numberOfLines={1}>{element.suggestion}</Text>
                    </View>
                  </View>
                  <View style={styles.money_info_vertical_line} />
                  <View style={styles.money_info_item_right_container}>
                    <View style={styles.money_info_item_right_text_container}>
                      <Text style={{ ...styles.money_info_item_right_text, fontSize }} adjustsFontSizeToFit numberOfLines={1}>{element.approved}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
          )
        }
        {this.props.detail && this.state.expanded
          && <View style={styles.line} />}
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
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(40),
    borderBottomColor: R.colors.borderGray
  },
  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: R.colors.iconGray,
    paddingVertical: WIDTHXD(30),
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(60),
  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
  },
  wrapperText: {
    paddingHorizontal: WIDTHXD(36),
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: R.colors.borderGray,
    height: HEIGHTXD(65),
  },
  label: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label,
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
    fontSize: getFontXD(36),
  },
  borderText: {
    flex: 0,
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground,
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
  wrapper: {
    paddingBottom: HEIGHTXD(46),
  },
  money_info_header_container: {
    flexDirection: 'row',
    paddingTop: HEIGHTXD(30)
  },
  money_info_header_text_left: {
    textAlign: 'center',
    minWidth: WIDTHXD(330),
    paddingRight: WIDTHXD(30),
    color: R.colors.black0,
    fontSize: getFontXD(42),
  },
  money_info_vertical_line: {
    width: 1,
    backgroundColor: '#E6E6E6',
  },
  money_info_header_left_container: {
    flex: 2,
    flexDirection: 'row',
    paddingRight: WIDTHXD(30),
  },
  money_info_header_text_right: {
    flex: 1,
    textAlign: 'center',
    color: R.colors.black0,
    fontSize: getFontXD(42),
    paddingRight: WIDTHXD(49)
  },
  money_info_item_container: {
    flexDirection: 'row',
  },
  money_info_item_left_container: {
    flex: 2,
    flexDirection: 'row',
    paddingRight: WIDTHXD(30),
    paddingTop: HEIGHTXD(26),
  },
  money_info_item_left_text_left: {
    flex: 1,
    paddingLeft: WIDTHXD(46),
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
  },
  money_info_item_left_text_right_container: {
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    paddingBottom: HEIGHTXD(6),
    minWidth: WIDTHXD(330),
  },
  money_info_item_left_text_right: {
    minWidth: WIDTHXD(217),
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    textAlign: 'right'
  },
  money_info_item_right_container: {
    flex: 1,
    paddingTop: HEIGHTXD(26),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: WIDTHXD(49)
  },
  money_info_item_right_text_container: {
    minWidth: WIDTHXD(217),
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    paddingBottom: HEIGHTXD(6)
  },
  money_info_item_right_text: {
    textAlign: 'right',
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    minWidth: WIDTHXD(330)
  }
})
