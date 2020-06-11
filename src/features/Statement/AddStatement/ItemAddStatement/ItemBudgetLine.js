// @flow
/* eslint-disable react/jsx-closing-tag-location */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PickerItem from '../../../../common/Picker/PickerItem';
import PickerDate from '../../../../common/Picker/PickerDate';
import AutoCompleteModal from '../../ItemViews/AutoCompleteModal';
import { connect } from 'react-redux';
import {setIsHideGroupStatement} from '../../../../actions/statement';
import PickerSearch from '../../../../common/Picker/PickerSearch';
import R from '../../../../assets/R';
import CheckBox from '../../../../common/Picker/CheckBox';
import {FONT_TITLE} from '../../../../config/constants';

import {
  HEIGHTXD,
  getFontXD,
  WIDTHXD,
  getWidth,
  getLineHeightXD,
  toPriceVnd
} from '../../../../config/Function';
import {
  searchTermPayment,
  searchWorkUnit,
  searchWorkingMarket
} from '../../../../apis/Functions/invoice';

class ItemBudget extends Component {
  costTypeComplete = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      cCostTypeId: '',
      cActivityId: '',
      directRelease: false,
      isOutOfBudget: false,
      useAmount: null,
      planAmount: null,
      remainAmount: null,
      dataStatementLine: null
    };
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
    this.props.setIsHideGroupStatement({isHideBudgetLine: !this.props.isHideBudgetLine});
  };

  async componentDidMount() {}

  findDataTermPayment = async query => {
    let body = {
      isSize: 'true',
      name: query
    };

    let res = await searchTermPayment(body);
    if (res && res.data) {
      return res.data;
    } else {
      return [];
    }
  };

  findWorkUnit = async query => {
    let body = {
      isSize: 'true',
      name: query
    };

    let res = await searchWorkUnit(body);
    if (res && res.data) {
      return res.data;
    } else {
      return [];
    }
  };

  findWorkingMarket = async query => {
    let body = {
      isSize: 'true',
      name: query
    };

    let res = await searchWorkingMarket(body);
    if (res && res.data) {
      return res.data;
    } else {
      return [];
    }
  };

  componentWillReceiveProps(nextProps) {
    console.log(
      'dataStatementLinedataStatementLine12313123XXXXXX',
      nextProps.dataStatementLine
    );

    if (nextProps.dataStatementLine) {
      this.setState({ dataStatementLine: nextProps.dataStatementLine });
      if (nextProps.dataStatementLine.useAmount !== this.state.useAmount) {
        this.setState({
          useAmount: toPriceVnd(nextProps.dataStatementLine.useAmount)
        });
      }
      if (nextProps.dataStatementLine.planAmount !== this.state.planAmount) {
        this.setState({
          planAmount: toPriceVnd(nextProps.dataStatementLine.planAmount)
        });
      }
      if (
        nextProps.dataStatementLine.remainAmount !== this.state.remainAmount
      ) {
        this.setState({
          remainAmount: toPriceVnd(nextProps.dataStatementLine.remainAmount)
        });
      }
    }
  }

  onChangeCostType = item => {
    this.setState({ cCostTypeId: item.cCostTypeId });
  };

  changeActivity = item => {
    this.setState({ cActivityId: item.cActivityId });
  };

  onChangeOutOfBudget = value => {
    this.setState({ isOutOfBudget: value });
  };

  onChangeDirectRelease = value => {
    this.setState({ directRelease: value });
  };

  render() {
    const {
      expanded,
      directRelease,
      isOutOfBudget,
      useAmount,
      planAmount,
      remainAmount,
      dataStatementLine
    } = this.state;
    const {isHideBudgetLine} = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[
            styles.flexTitle,
            { borderBottomWidth: isHideBudgetLine === true ? 0.3 : 0 }
          ]}
        >
          <Text style={styles.title}>Thông tin ngân sách</Text>
          {isHideBudgetLine === true ? (
            <Ionicons
              name="ios-arrow-down"
              size={WIDTHXD(50)}
              color={R.colors.iconGray}
            />
          ) : (
            <Ionicons
              name="ios-arrow-forward"
              size={WIDTHXD(50)}
              color={R.colors.iconGray}
            />
          )}
        </TouchableOpacity>
        {isHideBudgetLine && (
          <View style={{ paddingLeft: WIDTHXD(30),  paddingRight: WIDTHXD(31), paddingBottom: HEIGHTXD(40) }}>
            <View
              style={[
                styles.flexColumn,
                {
                  alignItems: 'flex-start',
                }
              ]}
            >
              <View style={{ flexDirection: 'row', marginTop: HEIGHTXD(40),}}>
                <CheckBox
                  value={isOutOfBudget}
                  textStyle={{ color: 'black', fontSize: getFontXD(42) }}
                  containerStyle={{ margin: 0, paddingVertical: 0 }}
                  title="Ngoài ngân sách"
                  onValueChange={this.onChangeOutOfBudget}
                />
                <CheckBox
                  value={directRelease}
                  textStyle={{ color: 'black', fontSize: getFontXD(42) }}
                  containerStyle={{ margin: 0, paddingVertical: 0 }}
                  title="Tự động duyệt bổ sung"
                  onValueChange={this.onChangeDirectRelease}
                />
              </View>
              <Text style={[styles.label]}>Khoản mục phí</Text>
              <AutoCompleteModal
                id={this.state.cCostTypeId}
                ref={this.cCostType}
                onChange={this.onChangeCostType}
                title="Khoản mục phí"
                keyApi="costType"
              />
            </View>
            <View
              style={[
                styles.flexColumn,
                {
                  alignItems: 'flex-start',
                  marginTop: HEIGHTXD(20),
                }
              ]}
            >
              <Text style={[styles.label]}>Hoạt động</Text>
              <AutoCompleteModal
                id={this.state.cActivityId}
                ref={this.costTypeComplete}
                onChange={this.changeActivity}
                title="Hoạt động"
                keyApi="activity"
              />
            </View>
            {dataStatementLine ? (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Text style={styles.type}>Chi phí lũy kế theo tờ trình</Text>
                  <View style={styles.borderText}>
                    <View style={{ flex: 1 }} />
                    <View style={styles.deNghi}>
                      <Text style={styles.textBudgest}>{useAmount}</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Text style={styles.type}>Ngân sách quý đã duyệt</Text>
                  <View style={styles.borderText}>
                    <View style={{ flex: 1 }} />
                    <View style={styles.deNghi}>
                      <Text style={styles.textBudgest}>{planAmount}</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Text style={styles.type}>Số tiền còn lại lần trước</Text>
                  <View style={styles.borderText}>
                    <View style={{ flex: 1 }} />
                    <View style={styles.deNghi}>
                      <Text style={styles.textBudgest}>{remainAmount}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    isHideBudgetLine: state.statementRuducer.isHideBudgetLine,
  };
}
export default connect(mapStateToProps, {
  setIsHideGroupStatement
},null, {forwardRef : true})(ItemBudget);


const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth(),
    // paddingBottom: HEIGHTXD(40)
    // borderRadius: WIDTHXD(30),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: R.colors.borderGray
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
  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(37),
    borderBottomColor: R.colors.iconGray,
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(59.76)
  },
  wrapperText: {
    width: WIDTHXD(300),
    borderRadius: HEIGHTXD(20),
    height: HEIGHTXD(99),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: R.colors.borderGray
  },
  lastItem: {
    alignItems: 'flex-start',
    marginBottom: HEIGHTXD(40)
  },
  label: {
    fontSize: getFontXD(FONT_TITLE),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label,
    marginTop: HEIGHTXD(40)
  },
  content: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(36),
    paddingVertical: HEIGHTXD(50),
    color: R.colors.black0
  },
  borderText: {
    flex: 1, // borderBottomWidth: 1, // borderColor: R.colors.colorBackground,
    flexDirection: 'row'
  },
  deNghi: {
    fontFamily: R.fonts.RobotoRegular, // fontSize: getFontXD(42),
    flex: 1,
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground
  },
  textBudgest: {
    fontSize: getFontXD(42),
    paddingTop: WIDTHXD(20),
    textAlign: 'right',
    color: R.colors.color777
  },
  type: {
    width: WIDTHXD(320), // marginBottom: HEIGHTXD(30),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(42),
    flex: 1,
    paddingTop: HEIGHTXD(40)
  }
});
