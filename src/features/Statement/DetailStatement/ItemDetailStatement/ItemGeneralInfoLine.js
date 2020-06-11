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
import { connect } from 'react-redux';
import _ from 'lodash';
// import PickerItem from '../../ItemViews/PickerItem';
import { redStar } from 'common/Require';
import PickerItem from '../../../AdvanceRequest/common/ItemPicker';
import R from '../../../../assets/R';
import { setIsHideGroupStatement } from '../../../../actions/statement';
import {
  getFontXD,
  WIDTHXD,
  HEIGHTXD,
  getWidth,
  getLineHeightXD,
  toPriceVnd
} from '../../../../config/Function';
import AdvanceRequest from '../../../../apis/Functions/advanceRequest';
import { getCategory, getCurrencyRate } from '../../../../apis/Functions/statement';
import { FONT_TITLE } from '../../../../config/constants';
import moment from 'moment'

class ItemGeneralInfoLine extends Component {
  partnerComplete = React.createRef();

  departmentComplete = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      resultCategory: [],
      cstatementCategoryId: null,
      partnerComplete: null,
      departmentId: null,
      content: '',
      currencyRate: 0,
      transDate: 'transDate',
      requestTaxAmount: 0,
      requestBeforeTaxAmount: 0,
      description: '',
      listCurrency: [],
      cCurrencyId: 0,
      dataStatementLine: {},
      sumAmount: 0,
      approvedBeforeTaxAmount: null,
      approvedTaxAmount: null,
      approveAmount: null,
      isEditCurrentRate: true
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.dataStatementLine) {
      if (nextProps.dataStatementLine.description !== this.state.description) this.setState({ description: nextProps.dataStatementLine.description });
      if (
        nextProps.dataStatementLine.currencyRate !== this.state.currencyRate
      ) {
        this.setState({
          currencyRate: `${nextProps.dataStatementLine.currencyRate || ''}`
        });
      }
      if (
        nextProps.dataStatementLine.requestTaxAmount
        !== this.state.requestTaxAmount
      ) {
        await this.setState({
          requestTaxAmount:
            parseInt(nextProps.dataStatementLine.requestTaxAmount) || 0
        });
      }
      if (
        nextProps.dataStatementLine.requestBeforeTaxAmount
        !== this.state.requestBeforeTaxAmount
      ) {
        await this.setState({
          requestBeforeTaxAmount:
            parseInt(nextProps.dataStatementLine.requestBeforeTaxAmount) || 0
        });
      }
      if (nextProps.dataStatementLine.cCurrencyId !== this.state.cCurrencyId) this.setState({ cCurrencyId: nextProps.dataStatementLine.cCurrencyId });
      if (
        nextProps.dataStatementLine.approvedBeforeTaxAmount
        !== this.state.approvedBeforeTaxAmount
      ) {
        this.setState({
          approvedBeforeTaxAmount:
            nextProps.dataStatementLine.approvedBeforeTaxAmount
        });
      }
      if (
        nextProps.dataStatementLine.approvedTaxAmount
        !== this.state.approvedTaxAmount
      ) {
        this.setState({
          approvedTaxAmount: nextProps.dataStatementLine.approvedTaxAmount
        });
      }
      if (
        nextProps.dataStatementLine.approveAmount !== this.state.approveAmount
      ) {
        this.setState({
          approveAmount: nextProps.dataStatementLine.approveAmount
        });
      }
      const sumAmountTmp = this.state.requestTaxAmount + this.state.requestBeforeTaxAmount;
      this.setState({ sumAmount: sumAmountTmp });
    }
  }

  componentDidUpdate() { }

  componentDidMount() {
    this.getCategory();
    const { dataStatementLine } = this.props;
    if (dataStatementLine) {
      this.setState({
        description: dataStatementLine.description,
        cCurrencyId: dataStatementLine.cCurrencyId, // Tiền tệ
        currencyRate: dataStatementLine.currencyRate, // Tỷ giá
        requestTaxAmount: dataStatementLine.requestTaxAmount
          ? `${dataStatementLine.requestTaxAmount}`
          : '', // Tiền thuế đề nghị
        requestBeforeTaxAmount: dataStatementLine.requestBeforeTaxAmount
          ? `${dataStatementLine.requestBeforeTaxAmount}`
          : '' // Tiền trước thuế đề nghị
      });
    }
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
        this.setState({ cCurrencyId: currencyId, currencyRate: response.data, isEditCurrentRate: true })
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
    this.setState({ currencyRate: text });
  };

  onChangeRequestBeforeTaxAmount = text => {
    console.log(this.state.requestBeforeTaxAmount, this.state.requestTaxAmount)
    this.setState(
      { requestBeforeTaxAmount: parseInt(text.split('.').join(''), 10) },
      () => {
        const sumAmountTmp = parseInt(this.state.requestBeforeTaxAmount)
          + parseInt(this.state.requestTaxAmount);
        this.setState({ sumAmount: sumAmountTmp });
      }
    );
  };

  onChangeRequestTaxAmount = text => {
    this.setState(
      { requestTaxAmount: parseInt(text.split('.').join(''), 10) },
      () => {
        const sumAmountTmp = parseInt(this.state.requestBeforeTaxAmount)
          + parseInt(this.state.requestTaxAmount);
        this.setState({ sumAmount: sumAmountTmp });
      }
    );
  };

  getCategory = async () => {
    const body = {
      isSize: true,
      adOrgId: 1000432,
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
      listCurrency,
      description,
      currencyRate,
      requestBeforeTaxAmount,
      requestTaxAmount,
      dataStatementLine,
      approvedBeforeTaxAmount,
      approvedTaxAmount,
      approveAmount,
      sumAmount,
      cCurrencyId,
      isEditCurrentRate
    } = this.state;
    let nameCurrency = '';
    if (!_.isEmpty(listCurrency)) {
      _.forEach(listCurrency, item => {
        if (item.fwmodelId === cCurrencyId) {
          nameCurrency = item.name;
        }
      });
    }
    let fontSizeAuto = getFontXD(42);
    const maxLen = Math.max(
      requestBeforeTaxAmount.toString().length,
      requestTaxAmount.toString().length,
      sumAmount.toString().length
    );
    // requestAmount.length,
    // approvedBeforeTaxAmount.leng
    // approvedTaxAmount.length,
    // approveAmount.length,

    if (maxLen > 11) {
      fontSizeAuto *= (11 / maxLen);
    }
    const { isHideGeneralInfoLine } = this.props;
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
              paddingLeft: WIDTHXD(30)
              // paddingRight: WIDTHXD(31),
              // paddingTop: HEIGHTXD(20)
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
                <Text style={styles.label}>
                  {'Tiền tệ'}
                  {redStar()}
                </Text>
                <View style={styles.labelN} />
                <View
                  style={{ height: HEIGHTXD(100), justifyContent: 'flex-end' }}
                >
                  <Text style={styles.type}>Tiền trước thuế</Text>
                </View>
                <View
                  style={{ height: HEIGHTXD(100), justifyContent: 'flex-end' }}
                >
                  <Text style={styles.type}>Tiền thuế</Text>
                </View>
                <View
                  style={{ height: HEIGHTXD(100), justifyContent: 'flex-end' }}
                >
                  <Text style={styles.type}>Tổng tiền</Text>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <PickerItem
                  value={nameCurrency}
                  width={WIDTHXD(270)}
                  data={listCurrency}
                  onValueChange={(index, itemChild) => {
                    if (itemChild.fwmodelId === 234) {
                      this.setState({ cCurrencyId: itemChild.fwmodelId, isEditCurrentRate: false, currencyRate: 1 })
                    } else {
                      console.log(itemChild)

                      this._getCurrencyRate(itemChild.fwmodelId)
                    }
                  }}
                />
                <View style={[styles.borderText, { borderBottomWidth: 0 }]}>
                  <Text style={[styles.deNghi, { fontSize: getFontXD(36), alignSelf: "center" }]}>Đề nghị</Text>
                </View>
                <View style={styles.borderTextDN}>
                  <TextInput
                    value={toPriceVnd(requestBeforeTaxAmount)}
                    onChangeText={this.onChangeRequestBeforeTaxAmount}
                    style={[styles.deNghi, { fontSize: fontSizeAuto, width: WIDTHXD(320) }]}
                  />
                </View>
                <View style={styles.borderTextDN}>
                  <TextInput
                    value={toPriceVnd(requestTaxAmount)}
                    onChangeText={this.onChangeRequestTaxAmount}
                    style={[styles.deNghi, { fontSize: fontSizeAuto, width: WIDTHXD(320) }]}
                  />
                </View>
                <View style={styles.borderTextDN}>
                  <TextInput editable={false}
                    style={[styles.deNghi, { fontSize: fontSizeAuto, width: WIDTHXD(320) }]}>
                    {toPriceVnd(sumAmount)}
                  </TextInput>
                </View>
              </View>
              <View style={styles.lineColumn} />

              <View style={{ marginRight: HEIGHTXD(63), width: WIDTHXD(320), marginLeft: HEIGHTXD(30) }}>
                <View style={{ flexDirection: 'row', height: HEIGHTXD(100) }}>
                  <Text style={styles.typeA}>
                    {'Tỷ giá'}
                    {redStar()}
                  </Text>
                  <View
                    style={[
                      styles.borderText,
                      {
                        alignSelf: 'baseline',
                        width: WIDTHXD(150),
                        marginTop: 0,
                        alignSelf: 'center'
                      }
                    ]}
                  >
                    <TextInput
                      editable={isEditCurrentRate}
                      keyboardType="number-pad"
                      value={currencyRate ? currencyRate.toString() : ''}
                      onChangeText={this.onChangeCurrencyRate}
                      style={[styles.deNghi]}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.borderText,
                    {
                      borderBottomWidth: 0,
                      marginTop: HEIGHTXD(40),
                      width: WIDTHXD(320),
                      flex: 1,
                    }
                  ]}
                >
                  <Text style={[styles.deNghi, { fontSize: getFontXD(36), alignSelf: "center" }]}>
                    Được duyệt
                  </Text>
                </View>
                <View style={styles.borderTextDN}>
                  <TextInput
                    editable={false}
                    value={toPriceVnd(requestBeforeTaxAmount)}
                    style={[styles.deNghi, { fontSize: fontSizeAuto, width: WIDTHXD(320) }]}
                  />
                </View>
                <View style={styles.borderTextDN}>
                  <TextInput
                    editable={false}
                    value={toPriceVnd(requestTaxAmount)}
                    style={[styles.deNghi, { fontSize: fontSizeAuto, width: WIDTHXD(320) }]}
                  />
                </View>
                <View style={styles.borderTextDN}>
                  <TextInput
                    editable={false}
                    value={toPriceVnd(sumAmount)}
                    style={[styles.deNghi, { fontSize: fontSizeAuto, width: WIDTHXD(320) }]}
                  />
                </View>
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
  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(37),
    borderBottomColor: R.colors.iconGray,
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(59.76)
  },
  lineColumn: {
    width: 100,
    backgroundColor: '#ddd',
    maxWidth: 0.8,
    marginTop: HEIGHTXD(140)
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
    minHeight: HEIGHTXD(220),
    textAlignVertical: 'top',
    paddingHorizontal: WIDTHXD(36),
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
    padding: 0
    // flex: 1.4
  },
  labelN: {
    marginTop: HEIGHTXD(40),
    height: HEIGHTXD(60)
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
    marginBottom: 3
  },
  typeA: {
    // paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(FONT_TITLE),
    flex: 1,
    textAlign: 'left',
    padding: 0,
    alignSelf: 'center'
  },
  deNghi: {
    textAlign: 'right',
    // paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    textAlignVertical: 'center',
    padding: 0,
    color: R.colors.black0
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
    marginTop: HEIGHTXD(40)
  },
  borderTextDN: {
    // flex: 0.8,
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground,
    width: WIDTHXD(320),
    height: HEIGHTXD(100),
    justifyContent: 'flex-end',
    paddingBottom: HEIGHTXD(5)
    // marginTop: HEIGHTXD(40),
  },
  borderTextA: {
    // flex: 0.8,
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground,
    // marginLeft: WIDTHXD(50),
    width: WIDTHXD(320),
    height: HEIGHTXD(100),
    justifyContent: 'flex-end',
    paddingBottom: HEIGHTXD(5)
    // marginTop: HEIGHTXD(40),
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
