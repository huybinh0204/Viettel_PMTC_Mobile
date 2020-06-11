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
import PickerSearch from '../../../../common/Picker/PickerSearch';
import AutoCompleteModal from '../../ItemViews/AutoCompleteModal';
import { connect } from 'react-redux';
import { setIsHideGroupStatement } from '../../../../actions/statement';
import R from '../../../../assets/R';
import { FONT_TITLE } from '../../../../config/constants';
import {
  HEIGHTXD,
  getFontXD,
  WIDTHXD,
  getWidth,
  getLineHeightXD
} from '../../../../config/Function';
import {
  searchTermPayment,
  searchWorkUnit,
  searchWorkingMarket
} from '../../../../apis/Functions/invoice';
import { redStar } from 'common/Require';

class ItemAccountant extends Component {
  fieldComplete = React.createRef();

  budgetComplete = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      cpaymentScopeId: '',
      cBudgetId: ''
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
    this.props.setIsHideGroupStatement({ isHideAccountantLine: !this.props.isHideAccountantLine });
  };

  async componentDidMount() { }

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

  onChangeField = item => {
    this.setState({ cpaymentScopeId: item.cpaymentScopeId });
  };

  onChangeBudget = item => {
    this.setState({ cBudgetId: item.cbudgetId });
  };

  render() {
    const {
      item,
      rules,
      department,
      market,
      onChangeMarket,
      onChangeRules,
      onChangeDepartment
    } = this.props;
    const { isHideAccountantLine } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[
            styles.flexTitle,
            { borderBottomWidth: isHideAccountantLine === true ? 0.3 : 0 }
          ]}
        >
          <Text style={styles.title}>Thông tin kế toán</Text>
          {isHideAccountantLine === true ? (
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
        {isHideAccountantLine && (
          <View
            style={{
              paddingLeft: WIDTHXD(30),
              paddingRight: WIDTHXD(31),
              marginBottom: HEIGHTXD(40)
            }}
          >
            {this.props.detail && (
              <View
                style={[
                  styles.flexColumn,
                  { alignItems: 'flex-start' }
                ]}
              >
                <Text style={[styles.label]}>Lĩnh vực chi</Text>
                <AutoCompleteModal
                  id={this.state.cpaymentScopeId}
                  ref={this.fieldComplete}
                  onChange={this.onChangeField}
                  title="Lĩnh vực chi"
                  keyApi="field"
                />
              </View>
            )}
            <View
              style={[
                styles.flexColumn,
                { alignItems: 'flex-start', marginTop: HEIGHTXD(20) }
              ]}
            >
              <Text style={[styles.label]}>{`Nguồn kinh phí`}{redStar()}</Text>
              <AutoCompleteModal
                id={this.state.cBudgetId}
                ref={this.budgetComplete}
                onChange={this.onChangeBudget}
                title="Nguồn kinh phí"
                keyApi="budget"
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isHideAccountantLine: state.statementRuducer.isHideAccountantLine,
  };
}
export default connect(mapStateToProps, {
  setIsHideGroupStatement
}, null, { forwardRef: true })(ItemAccountant);


const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth()
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
    marginBottom: HEIGHTXD(49)
  },
  label: {
    fontSize: getFontXD(FONT_TITLE),
    fontFamily: R.fonts.RobotoRegular,
    marginTop: HEIGHTXD(40),
    color: R.colors.label
  },
  content: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(36),
    paddingVertical: HEIGHTXD(50),
    color: R.colors.black0
  }
});
