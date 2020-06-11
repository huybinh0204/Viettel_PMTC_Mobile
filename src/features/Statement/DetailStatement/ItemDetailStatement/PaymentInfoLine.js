import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  LayoutAnimation,
  TouchableOpacity,
  Platform,
  UIManager,
  StatusBar
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
// import PickerItem from '../../ItemViews/PickerItem';
import PickerDate from '../../../../common/Picker/PickerDate';
import PickerItem from '../../../../common/Picker/PickerItem';
import R from '../../../../assets/R';
import FakeData from '../dataInvoice';
import {
  getFontXD,
  WIDTHXD,
  HEIGHTXD,
  getWidth,
  getLineHeightXD
} from '../../../../config/Function';
import ItemTextForGeneral from './ItemTextForGeneral';
import AutoCompleteModal from '../../ItemViews/AutoCompleteModal';
import { getCategory } from '../../../../apis/Functions/statement';
import {FONT_TITLE} from '../../../../config/constants';

class PaymentInfoLine extends Component {
  partnerComplete = React.createRef();

  departmentComplete = React.createRef();

  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: true,
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
      cCurrencyId: 0,
      itemStatementLine:{}
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    this.getCategory();
    const { itemStatementLine } = this.props;
    // if(itemStatementLine)
    // {
    //   this.setState({
    //     description : dataStatementLine.description,
    //     cCurrencyId : dataStatementLine.cCurrencyId, // Tiền tệ
    //     currencyRate : dataStatementLine.currencyRate,// Tỷ giá
    //     requestTaxAmount :dataStatementLine.requestTaxAmount? `${dataStatementLine.requestTaxAmount}` : "" ,// Tiền thuế đề nghị
    //     requestBeforeTaxAmount : dataStatementLine.requestBeforeTaxAmount? `${dataStatementLine.requestBeforeTaxAmount}` : "", // Tiền trước thuế đề nghị

    //   })
    // }
  }

  changePartner = item => {
    this.setState({ partnerComplete: item });
  };

  changeDepartment = item => {
    this.setState({ departmentId: item.departmentId });
  };

  onChangeNoiDung = (text: string) => {
    this.setState({ description: text });
  };

  onChangeCurrencyRate = (text: string) => {
    this.setState({ currencyRate: text });
  };

  onChangeRequestBeforeTaxAmount = (text: string) => {
    this.setState({ requestBeforeTaxAmount: text });
  };

  onChangeRequestTaxAmount = (text: string) => {
    this.setState({ requestTaxAmount: text });
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
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const {
      expanded,
    } = this.state;
    const { itemStatementLine } = this.props;
    return (
      <View style={styles.container}>
        {expanded && (
          <View>
            <View style={styles.itemContainer}>
              <Text style={styles.type}>Đơn vị</Text>
              <View style={styles.borderText}>
                <Text style={styles.deNghi}>
                  {itemStatementLine && itemStatementLine.adOrgName}
                </Text>
              </View>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.type}>Loại chứng từ</Text>
              <View style={styles.borderText}>
                <Text style={styles.deNghi}>
                  {itemStatementLine && itemStatementLine.cDocumentTypeId}
                </Text>
              </View>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.type}>Số chứng từ</Text>
              <View style={styles.borderText}>
                <Text style={styles.deNghi}>
                  {itemStatementLine && itemStatementLine.documentNo}
                </Text>
              </View>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.type}>Ngày hoạch toán</Text>
              <View style={styles.borderText}>
                <Text style={styles.deNghi}>
                  {itemStatementLine && itemStatementLine.dateAcct}
                </Text>
              </View>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.type}>Số tiền</Text>
              <View style={styles.borderText}>
                <Text style={styles.deNghi}>
                  {itemStatementLine && itemStatementLine.cCurrencyId}
                </Text>
              </View>
            </View>

            <View style={styles.itemContainer}>
              <Text style={styles.type}>Số Tk thanh toán</Text>
              <View style={styles.borderText}>
                <Text style={styles.deNghi}>
                  {itemStatementLine && itemStatementLine.accountNo}
                </Text>
              </View>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.type}>Trạng thái hoạch toán</Text>
              <View style={styles.borderText}>
                <Text style={styles.deNghi}>
                  {itemStatementLine && itemStatementLine.description}
                </Text>
              </View>
            </View>
            <View style={styles.itemDescription}>
              <Text style={styles.typeDescription}>Nội dung</Text>
              <View style={styles.borderDescription}>
                <Text style={styles.deNghi}>
                  {itemStatementLine && itemStatementLine.adOrgId}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default PaymentInfoLine;

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth()
    // borderRadius: WIDTHXD(30),
  },
  itemDescription: {
    flexDirection: 'column',
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(31),
    marginTop: HEIGHTXD(33)
  },
  typeDescription: {
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(FONT_TITLE),
    textAlignVertical: 'center',
    padding: 0
  },
  borderDescription: {
    textAlign: 'left'
  },
  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(37),
    borderBottomColor: R.colors.iconGray,
    borderWidth: 0.2,
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
    height: HEIGHTXD(160),
    width: WIDTHXD(1064),
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
    borderColor: R.colors.iconGray
  },
  lastItem: {
    alignItems: 'flex-start',
    marginBottom: HEIGHTXD(20),
    marginTop: HEIGHTXD(30)
  },
  label: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(11),
    color: R.colors.label
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
    width: WIDTHXD(450),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(FONT_TITLE),
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: HEIGHTXD(33),
    marginBottom: HEIGHTXD(36),
    padding: 0
  },
  typeA: {
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(42),
    flex: 1,
    paddingLeft: HEIGHTXD(30)
  },
  deNghi: {
    textAlign: 'left',
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    textAlignVertical: 'center',
    flex: 1,
    marginTop: HEIGHTXD(33),
    marginBottom: HEIGHTXD(36)
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
    width: WIDTHXD(544),
    paddingLeft: WIDTHXD(30),
    // backgroundColor:"red",
    marginRight: WIDTHXD(103)
  },
  borderTextA: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(36),
    borderBottomColor: R.colors.borderGray
  },
  label: {
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    marginVertical: HEIGHTXD(13),
    color: R.colors.label
  },
  wrapperText: {
    width: WIDTHXD(222),
    borderRadius: HEIGHTXD(20),
    paddingHorizontal: WIDTHXD(8),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: R.colors.borderGray,
    height: HEIGHTXD(100)
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: R.colors.iconGray,
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(31)
  }
});
