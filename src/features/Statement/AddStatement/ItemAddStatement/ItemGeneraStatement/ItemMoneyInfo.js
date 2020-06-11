import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  TouchableOpacity,
  TextInput,
  Platform
} from 'react-native';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import PickerItem from '../../../../common/ItemPicker';
import { connect } from 'react-redux';
import PickerItem from '../../../../AdvanceRequest/common/ItemPicker';
import R from '../../../../../assets/R';
import {
  HEIGHTXD,
  WIDTHXD,
  getFontXD,
  getWidth,
  toPriceVnd,
  getLineHeightXD
} from '../../../../../config/Function';
import { setIsHideGroupStatement } from '../../../../../actions/statement';
import { FONT_TITLE } from '../../../../../config/constants';

class ItemMoneyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: {},
      requestBeforeTaxAmount: 0,
      requestTaxAmount:0,
      requestAmount:0,
      approvedBeforeTaxAmount:0,
      approvedTaxAmount:0,
      approvedAmount:0,
      selection: {
        start: 0,
        end: 0
      }
    };
  }

  componentDidMount() {
    let body = {};
    if (this.props.statementInfo) {
      body = this.props.statementInfo;
      this.setState({
        requestBeforeTaxAmount: toPriceVnd(this.props.statementInfo.requestBeforeTaxAmount),
        requestTaxAmount: toPriceVnd(this.props.statementInfo.requestTaxAmount),
        requestAmount: toPriceVnd(this.props.statementInfo.requestAmount),
        approvedBeforeTaxAmount: toPriceVnd(this.props.statementInfo.approvedBeforeTaxAmount),
        approvedTaxAmount: toPriceVnd(this.props.statementInfo.approvedTaxAmount),
        approvedAmount: toPriceVnd(this.props.statementInfo.approvedAmount)});
      this.setState({ body });
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.statementInfo)
    {
      if(nextProps.statementInfo.requestBeforeTaxAmount !== this.setState.requestBeforeTaxAmount) 
      this.setState({requestBeforeTaxAmount : toPriceVnd(nextProps.statementInfo.requestBeforeTaxAmount)})
      if(nextProps.statementInfo.requestTaxAmount !== this.setState.requestTaxAmount) 
      this.setState({requestTaxAmount : toPriceVnd(nextProps.statementInfo.requestTaxAmount)})
      if(nextProps.statementInfo.requestAmount !== this.setState.requestAmount) 
      this.setState({requestAmount : toPriceVnd(nextProps.statementInfo.requestAmount)})

      if(nextProps.statementInfo.approvedBeforeTaxAmount !== this.setState.approvedBeforeTaxAmount) 
      this.setState({approvedBeforeTaxAmount : toPriceVnd(nextProps.statementInfo.approvedBeforeTaxAmount)})
      if(nextProps.statementInfo.approvedTaxAmount !== this.setState.approvedTaxAmount) 
      this.setState({approvedTaxAmount : toPriceVnd(nextProps.statementInfo.approvedTaxAmount)})
      if(nextProps.statementInfo.approvedAmount !== this.setState.approvedAmount) 
      this.setState({approvedAmount : toPriceVnd(nextProps.statementInfo.approvedAmount)})
    }
  }

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
      isHideMoneyInfo: !this.props.isHideMoneyInfo
    });
  };

  renderItem = item => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: HEIGHTXD(30)
      }}
    >
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.deNghi}>{item.deNghi || 0}</Text>
      <Text style={styles.duocDuyet}>{item.duocDuyet}</Text>
    </View>
  );

  render() {
    const {
      currency,
      onChangeValue,
      statementInfo,
      isHideMoneyInfo
    } = this.props;
    const { 
      body, 
      requestBeforeTaxAmount, 
      requestTaxAmount,
      requestAmount,
      approvedBeforeTaxAmount,
      approvedTaxAmount,
      approvedAmount
     } = this.state;
    let nameCurrentID = '';
    if (!_.isEmpty(currency)) {
      _.forEach(currency, item => {
        if (item.fwmodelId === body.cCurrencyId) {
          nameCurrentID = item.name;
        }
      });
    }

    let fontSizeAuto = getFontXD(42);
    const maxLen = Math.max(
    requestBeforeTaxAmount.toString().length, 
    requestTaxAmount.toString().length, 
    requestAmount.toString().length, 
    approvedBeforeTaxAmount.toString().length, 
    approvedTaxAmount.toString().length, 
    approvedAmount.toString().length)
    if (maxLen > 14) {
      fontSizeAuto =fontSizeAuto * (14 / maxLen);
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[
            styles.flexRow,
            {
              borderBottomWidth: isHideMoneyInfo === true ? 1 : 0,
              paddingHorizontal: WIDTHXD(30)
            }
          ]}
        >
          <Text style={styles.title}>Thông tin số tiền</Text>
          {isHideMoneyInfo === true ? (
            <Ionicons
              name="ios-arrow-down"
              size={WIDTHXD(50)}
              style={{ marginRight: WIDTHXD(50) }}
              color={R.colors.iconGray}
            />
          ) : (
            <Ionicons
              name="ios-arrow-forward"
              size={WIDTHXD(50)}
              style={{ marginRight: WIDTHXD(37) }}
              color={R.colors.iconGray}
            />
          )}
        </TouchableOpacity>
        {isHideMoneyInfo && body.cAdvanceRequestId !== 0 && (
          <View style={{ paddingHorizontal: WIDTHXD(0) }}>
            <View style={styles.wrapper}>
              <View style={{flex:1}}>
                <Text editable={false}  style={[styles.label,{paddingTop:HEIGHTXD(Platform.OS ==="android"? 24: 12)}]} />
                <Text editable={false} style={[styles.label]}>
                  Tiền trước thuế
                </Text>
                <Text editable={false} style={[styles.label]}>
                  Tiền thuế
                </Text>
                <Text editable={false} style={[styles.label]}>
                  Tổng tiền
                </Text>
              </View>
              <View style={{ width: WIDTHXD(320), alignItems: 'flex-end', marginRight:WIDTHXD(30) }}>
                <TextInput
                  editable={false}
                  style={[styles.label, { color: R.colors.black0, alignSelf:"center" }]}
                >
                  Đề nghị
                </TextInput>
                <Text
                  numberOfLines={1}
                  style={[styles.label, { color: R.colors.black0, fontSize:fontSizeAuto }]}
                >
                  {requestBeforeTaxAmount || 0}
                </Text>
                <View style={styles.line} />
                <Text
                  numberOfLines={1}
                  style={[styles.label, { color: R.colors.black0, fontSize:fontSizeAuto }]}
                >
                  {requestTaxAmount || 0}
                </Text>
                <View style={styles.line} />
                <Text
                  numberOfLines={1}
                  style={[styles.label, { color: R.colors.black0, fontSize:fontSizeAuto }]}
                >
                  {requestAmount || 0}
                </Text>
                <View style={styles.line} />
              </View>

              <View style={styles.lineColumn} />

              <View style={{ width: WIDTHXD(320), alignItems: 'flex-end', marginLeft:WIDTHXD(30) }}>
                <TextInput
                  editable={false}
                  style={[styles.label, { color: R.colors.black0, alignSelf:"center" }]}
                >
                  Được duyệt
                </TextInput>
                <Text numberOfLines={1} style={[styles.label,{fontSize:fontSizeAuto}]}>
                {approvedBeforeTaxAmount || 0}
                  {/* {checkFormatItem(approvedBeforeTaxAmount) ? numberWithCommas(approvedBeforeTaxAmount) : 0} */}
                </Text>
                <View style={styles.line} />
                <Text numberOfLines={1} style={[styles.label,{fontSize:fontSizeAuto}]}>
                {approvedTaxAmount || 0}
                  {/* {checkFormatItem(approvedTaxAmount) ? numberWithCommas(approvedTaxAmount) : 0} */}
                </Text>
                <View style={styles.line} />
                <Text numberOfLines={1} style={[styles.label,{fontSize:fontSizeAuto}]}>
                {approvedAmount || 0}
                  {/* {checkFormatItem(approvedAmount) ? numberWithCommas(approvedAmount) : 0} */}
                </Text>
                <View style={styles.line} />
              </View>
            </View>

          </View>
        )}
        {this.props.detail && isHideMoneyInfo && <View style={styles.line} />}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isHideMoneyInfo: state.statementRuducer.isHideMoneyInfo
  };
}
export default connect(mapStateToProps, {
  setIsHideGroupStatement
})(ItemMoneyInfo);

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth(),
    elevation: 2
  },
  linee: {
    width: WIDTHXD(2),
    height: WIDTHXD(116),
    backgroundColor: R.colors.colorBackground
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(36),
    borderBottomColor: R.colors.borderGray
  },
  flexColumn: {
    flexDirection: 'column'
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
    paddingVertical: HEIGHTXD(10)
  },
  wrapperText: {
    width: WIDTHXD(200),
    height: HEIGHTXD(100),
    paddingHorizontal: WIDTHXD(8),
    alignItems: 'flex-end',
    textAlign: 'right',
    borderBottomColor: R.colors.borderGray,
    borderBottomWidth: WIDTHXD(1),
    fontSize: getFontXD(42),
    paddingVertical: 0,
    marginLeft: WIDTHXD(12),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777
  },
  type: {
    width: WIDTHXD(320),
    marginLeft: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(42)
  },
  deNghi: {
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground,
    width: getWidth() / 5,
    textAlign: 'right',
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(42)
  },
  duocDuyet: {
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground,
    width: getWidth() / 5,
    textAlign: 'right',
    marginRight: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(42)
  },
  tigia: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  viewDenghi: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: WIDTHXD(116)
  },
  viewDuocDuyet: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  txtValue: {
    textAlign: 'right',
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    fontSize: getFontXD(42)
  },
  ctnTienTe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: WIDTHXD(20)
  },
  wrapper: {
    paddingBottom: HEIGHTXD(46),
    flexDirection: 'row',
    marginLeft:WIDTHXD(30),
    marginRight:WIDTHXD(62),
  },

  label: {
    fontSize: getFontXD( FONT_TITLE ),
    lineHeight: getLineHeightXD(51),
    fontFamily: R.fonts.RobotoRegular,
    marginTop: HEIGHTXD(40),
    color: R.colors.color777,
    padding: 0,
    marginBottom: 0
  },

  line: {
    height: 0.5,
    width: WIDTHXD(320),
    backgroundColor: R.colors.iconGray
  },

  lineColumn: {
    flex:1,
    width: 0.8,
    backgroundColor: '#ddd',
    maxWidth: 0.8,
    marginTop:HEIGHTXD(40)
  }
});
