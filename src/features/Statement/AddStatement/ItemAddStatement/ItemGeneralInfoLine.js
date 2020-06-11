import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  LayoutAnimation,
  TouchableOpacity,
  Platform,
  UIManager
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import { connect } from 'react-redux';
import PickerDate from '../../../../common/Picker/PickerDate';
// import PickerItem from '../../../../common/Picker/PickerItem';
import PickerItem from '../../../AdvanceRequest/common/ItemPicker';
import AdvanceRequest from '../../../../apis/Functions/advanceRequest';
import { getCurrencyRate } from '../../../../apis/Functions/statement';
import { setIsHideGroupStatement } from '../../../../actions/statement';
import R from '../../../../assets/R';
import { FONT_TITLE } from '../../../../config/constants';
import FakeData from '../dataInvoice';
import {
  getFontXD,
  WIDTHXD,
  HEIGHTXD,
  getWidth,
  getLineHeightXD,
  toPriceVnd
} from '../../../../config/Function';
import ItemTextForGeneral from './ItemTextForGeneral';
import AutoCompleteModal from '../../ItemViews/AutoCompleteModal';
import { getCategory } from '../../../../apis/Functions/statement';
import { redStar } from 'common/Require';
import moment from 'moment'
class ItemGeneralInfoLine extends Component {
  partnerComplete = React.createRef();

  departmentComplete = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      // expanded: true,
      resultCategory: [],
      listCurrency: [],
      cstatementCategoryId: null,
      partnerComplete: null,
      departmentId: null,
      description: '',
      currencyRate: '1',
      transDate: 'transDate',
      requestBeforeTaxAmount: 0,
      requestTaxAmount: 0,
      sumAmount: 0,
      cCurrencyId: 234,
      isEditCurrentRate: false
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    this._getListCurrency();
  }

  _getListCurrency = async () => {
    const body = { isSize: true, name: '' };
    try {
      const response = await AdvanceRequest.getListCurrency(body);
      if (response && response.status === 200) {
        const { listCurrency } = this.state;
        _.forEach(response.data, item => {
          const itemCurrency = { name: item.value, fwmodelId: item.fwmodelId };
          listCurrency.push(itemCurrency);
        });
        listCurrency.pop();
        this.setState({ listCurrency });
      }
    } catch (err) { }
  };

  _getCurrencyRate = async (currencyId) => {
    const body = { fromCurrencyId: currencyId, adOrgId: this.props.adOrgId, validFrom: moment().format('YYYY-DD-MM') };
    try {
      const response = await getCurrencyRate(body);
      if (response && response.status === 200) {
        this.setState({ cCurrencyId: currencyId, currencyRate: response.data.toString(), isEditCurrentRate: true })
      } else {
        this.setState({ cCurrencyId: currencyId, isEditCurrentRate: true })
      }
    } catch (err) {
      this.setState({ cCurrencyId: currencyId, isEditCurrentRate: true })
    }
  }

  changePartner = item => {
    this.setState({ partnerComplete: item });
  };

  changeDepartment = item => {
    this.setState({ departmentId: item.departmentId });
  };

  onChangeNoiDung = text => {
    this.setState({ description: text });
  };

  onChangeCurrencyRate = text => {
    const currentRateTmp = parseInt(text, 10);
    this.setState({ currencyRate: currentRateTmp });
  };

  onChangeRequestBeforeTaxAmount = text => {
    this.setState(
      { requestBeforeTaxAmount: parseInt(text.split('.').join(''), 10) },
      () => {
        const sumAmountTmp = this.state.requestBeforeTaxAmount + this.state.requestTaxAmount;
        this.setState({ sumAmount: sumAmountTmp });
      }
    );
  };

  onChangeRequestTaxAmount = text => {
    this.setState(
      { requestTaxAmount: parseInt(text.split('.').join(''), 10) },
      () => {
        const sumAmountTmp = this.state.requestBeforeTaxAmount + this.state.requestTaxAmount;
        this.setState({ sumAmount: sumAmountTmp });
      }
    );
  };

  getCategory = async () => {
    const body = {
      isSize: true,
      adOrgId: this.props.adOrgId,
      name: this.state.valueSearch
    };
    const response = await getCategory(body);
    if (response && response.status === 200) {
      this.setState({ resultCategory: response.data });
    }
  };

  changeLayout = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleY,
        springDamping: 1.7
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 1.7
      }
    });
    this.props.setIsHideGroupStatement({
      isHideGeneralInfoLine: !this.props.isHideGeneralInfoLine
    });
  };

  render() {
    const {
      description,
      currencyRate,
      requestBeforeTaxAmount,
      requestTaxAmount,
      listCurrency,
      sumAmount,
      cCurrencyId,
      isEditCurrentRate
    } = this.state;
    const { dataStatementLine, isHideGeneralInfoLine } = this.props;
    let nameCurrency = '';
    if (!_.isEmpty(listCurrency)) {
      _.forEach(listCurrency, item => {
        if (item.fwmodelId === cCurrencyId) {
          nameCurrency = item.name;
        }
      });
    }
    console.log(JSON.stringify(listCurrency))
    console.log(cCurrencyId)

    let fontSizeAuto = getFontXD(42);
    const maxLen = Math.max(
      requestBeforeTaxAmount.toString().length,
      requestTaxAmount.toString().length,
      // requestAmount.length, 
      // approvedBeforeTaxAmount.length, 
      // approvedTaxAmount.length, 
      // approveAmount.length,
      sumAmount.toString().length)
    if (maxLen > 11) {
      fontSizeAuto = fontSizeAuto * (11 / maxLen);
    }
    // dataStatementLine
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[
            styles.flexTitle,
            { borderBottomWidth: isHideGeneralInfoLine === true ? 0.3 : 0 }
          ]}
        >
          <Text style={styles.title}>Thông tin chung</Text>
          {isHideGeneralInfoLine && (
            <Ionicons
              name="ios-arrow-down"
              size={WIDTHXD(50)}
              color={R.colors.iconGray}
            />
          )}
          {!isHideGeneralInfoLine && (
            <Ionicons
              name="ios-arrow-forward"
              size={WIDTHXD(50)}
              color={R.colors.iconGray}
            />
          )}
        </TouchableOpacity>
        {isHideGeneralInfoLine && (
          <View
            style={{
              paddingLeft: WIDTHXD(30),
              // paddingRight: WIDTHXD(31),
              paddingTop: HEIGHTXD(20)
            }}
          >
            <View style={[styles.flexColumn, styles.lastItem]}>
              <TextInput
                maxLength={250}
                multiline
                value={description}
                onChangeText={this.onChangeNoiDung}
                placeholder="Nhập nội dung"
                style={styles.formEnterInfo}
              />
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginVertical: HEIGHTXD(40)
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{`Tiền tệ`}{redStar()}</Text>
                {dataStatementLine ? (<View style={styles.labelN} />) : null}
                <View style={{ height: HEIGHTXD(100), marginTop: HEIGHTXD(Platform.OS === "android" ? 20 : 12), justifyContent: 'flex-end' }}>
                  <Text style={styles.type}>Tiền trước thuế</Text>
                </View>
                <View style={{ height: HEIGHTXD(100), justifyContent: 'flex-end' }}>
                  <Text style={styles.type}>Tiền thuế</Text>
                </View>
                <View style={{ height: HEIGHTXD(100), justifyContent: 'flex-end' }}>
                  <Text style={styles.type}>Tổng tiền</Text>
                </View>
              </View>

              <View style={{ marginRight: HEIGHTXD(30) }}>
                <PickerItem
                  value={nameCurrency}
                  width={WIDTHXD(270)}
                  data={listCurrency}
                  onValueChange={(index, itemChild) => {
                    if (itemChild.fwmodelId === 234) {
                      this.setState({ cCurrencyId: itemChild.fwmodelId, isEditCurrentRate: false, currencyRate: "1" })
                    } else {
                      this._getCurrencyRate(itemChild.fwmodelId)
                    }
                  }}
                />
                {dataStatementLine ? (<View style={[styles.borderText, { borderBottomWidth: 0 }]}>
                  <Text style={[styles.deNghi, { fontSize: getFontXD(36), alignSelf: "center" }]}>Đề nghị</Text>
                </View>) : null}
                <View style={[styles.borderTextDN, { marginTop: HEIGHTXD(Platform.OS === "android" ? 40 : 0) }]}>
                  <TextInput
                    keyboardType="number-pad"
                    value={toPriceVnd(requestBeforeTaxAmount)}
                    onChangeText={this.onChangeRequestBeforeTaxAmount}
                    style={[styles.deNghi, { fontSize: fontSizeAuto, width: WIDTHXD(320) }]}
                  />
                </View>

                <View style={styles.borderTextDN}>
                  <TextInput
                    keyboardType="number-pad"
                    value={toPriceVnd(requestTaxAmount)}
                    onChangeText={this.onChangeRequestTaxAmount}
                    style={[styles.deNghi, { fontSize: fontSizeAuto, width: WIDTHXD(320) }]}
                  />
                </View>

                <View style={styles.borderTextDN}>
                  <TextInput style={[styles.deNghi, { fontSize: fontSizeAuto, width: WIDTHXD(320) }]} editable={false}>
                    {toPriceVnd(sumAmount)}
                  </TextInput>
                </View>
              </View>

              {dataStatementLine ? (<View style={styles.lineColumn} />) : null}

              <View style={{ marginRight: HEIGHTXD(63), width: WIDTHXD(320), marginLeft: HEIGHTXD(30) }}>
                <View style={{ flexDirection: 'row', height: HEIGHTXD(100) }}>
                  <Text style={styles.typeA}>{`Tỷ giá`}{redStar()}</Text>
                  <View style={[styles.borderText, { alignSelf: 'baseline', width: WIDTHXD(150), marginTop: 0, alignSelf: "center" }]}>
                    <TextInput
                      editable={isEditCurrentRate}
                      keyboardType="number-pad"
                      value={currencyRate}
                      onChangeText={this.onChangeCurrencyRate}
                      style={styles.deNghi}
                    />
                  </View>
                </View>
                {dataStatementLine ? (
                  <View style={[styles.borderText, { borderBottomWidth: 0, marginTop: HEIGHTXD(40), alignSelf: "flex-end", }]}>
                    <Text style={[styles.deNghi, { fontSize: getFontXD(36), alignSelf: "center" }]}>Được duyệt</Text>
                  </View>
                ) : null}
                {dataStatementLine ? (<View
                  style={styles.borderTextDN}
                >
                  <TextInput editable={false}
                    value={toPriceVnd(requestBeforeTaxAmount)}
                    style={[styles.deNghi, { fontSize: fontSizeAuto, width: WIDTHXD(320) }]}>

                  </TextInput>
                </View>) : null}

                {dataStatementLine ? (<View
                  style={styles.borderTextDN}
                >
                  <TextInput editable={false}
                    value={toPriceVnd(requestTaxAmount)}
                    style={[styles.deNghi, { fontSize: fontSizeAuto, width: WIDTHXD(320) }]}></TextInput>
                  {/* <Text style={styles.deNghi}>{dataStatementLine.approvedTaxAmount}</Text> */}

                </View>) : null}

                {dataStatementLine ? (<View
                  style={styles.borderTextDN}
                >
                  <TextInput editable={false}
                    value={toPriceVnd(sumAmount)}
                    style={[styles.deNghi, { fontSize: fontSizeAuto, width: WIDTHXD(320) }]}></TextInput>
                  {/* <Text style={styles.deNghi}>{dataStatementLine.approveAmount}</Text> */}

                </View>) : null}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isHideGeneralInfoLine: state.statementRuducer.isHideGeneralInfoLine,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId
  };
}
export default connect(
  mapStateToProps,
  {
    setIsHideGroupStatement
  },
  null,
  { forwardRef: true }
)(ItemGeneralInfoLine);

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth()
    // borderRadius: WIDTHXD(30),
  },
  lineColumn: {
    width: 100,
    backgroundColor: '#ddd',
    maxWidth: 0.8,
    marginTop: HEIGHTXD(140)
  },
  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(37),
    borderBottomColor: R.colors.iconGray,
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(59.76)
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: R.colors.iconGray
  },
  flexColumn: {
    flexDirection: 'column'
  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase'
  },
  formEnterInfo: {
    textAlignVertical: 'top',
    paddingHorizontal: WIDTHXD(36),
    minHeight: HEIGHTXD(220),
    width: WIDTHXD(1064),
    borderColor: R.colors.borderGray,
    borderWidth: 0.3,
    borderRadius: WIDTHXD(20),
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular
  },
  wrapperText: {
    width: WIDTHXD(352),
    paddingHorizontal: WIDTHXD(36),
    borderRadius: HEIGHTXD(20),
    height: HEIGHTXD(99),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 0.3,
    borderColor: R.colors.iconGray
  },
  lastItem: {
    alignItems: 'flex-start',
    marginTop: HEIGHTXD(40)
  },
  label: {
    fontSize: getFontXD(FONT_TITLE),
    fontFamily: R.fonts.RobotoRegular,
    marginTop: HEIGHTXD(40),
    color: R.colors.label,
    padding: 0,
    // flex: 1.4
  },
  labelN: {
    marginTop: HEIGHTXD(40),
    height: HEIGHTXD(Platform.OS === "android" ? 70 : 45),
  },
  content: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.black0
  },
  leftTitle: {
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(36)
  },
  type: {
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(FONT_TITLE),
    padding: 0,
    marginBottom: 2,
    // backgroundColor:"blue",
    width: 100,
  },
  typeA: {
    // paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(FONT_TITLE),
    flex: 1,
    textAlign: 'left',
    padding: 0,
    alignSelf: "center"
  },
  deNghi: {
    textAlign: 'right',
    // paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    textAlignVertical: 'center',
    padding: 0,
    color: R.colors.black0
    // backgroundColor:"red",
    // height:HEIGHTXD(100)
  },
  duocDuyet: {
    width: getWidth() / 5,
    textAlign: 'right',
    marginRight: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36)
  },
  borderText: {
    // flex: 0.8,
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground,
    width: WIDTHXD(254),
    marginTop: HEIGHTXD(40),
  },
  borderTextDN: {
    // flex: 0.8,
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground,
    width: WIDTHXD(320),
    height: HEIGHTXD(100),
    justifyContent: 'flex-end',
    paddingBottom: HEIGHTXD(5),
    // marginTop: HEIGHTXD(40),
  },
  borderTextA: {
    flexDirection: 'row',
    alignSelf: "flex-end",
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground,
    width: WIDTHXD(320),
    height: HEIGHTXD(100),
    justifyContent: 'flex-end',
    paddingBottom: HEIGHTXD(5),
  },
  // flexRow: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   paddingVertical: HEIGHTXD(36),
  //   borderBottomColor: R.colors.borderGray
  // },
  wrapperText: {
    width: WIDTHXD(222),
    borderRadius: HEIGHTXD(20),
    paddingHorizontal: WIDTHXD(8),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: R.colors.borderGray,
    height: HEIGHTXD(100)
  }
});
