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
import R from '../../../../assets/R';
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

type Props = {
  item: Object,
  rules: string,
  department: string,
  market: string,
  onChangeMarket: Function,
  onChangeRules: Function,
  onChangeDepartment: Function,
  detail?: boolean
};
type State = {
  expanded: boolean
};
class ItemManagerInfo extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: true
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
    this.setState({ expanded: !this.state.expanded });
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
    const { expanded } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[
            styles.flexTitle,
            { borderBottomWidth: expanded === true ? 0.3 : 0 }
          ]}
        >
          <Text style={styles.title}>Thông tin quản trị</Text>
          {expanded === true ? (
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
        {expanded && (
          <View style={{ paddingLeft: WIDTHXD(30), paddingRight: WIDTHXD(31) }}>
            {this.props.detail && (
              <View style={[styles.flexColumn, { alignItems: 'flex-start' }]}>
                <Text style={[styles.label]}>Số tiền chưa DNTT</Text>
                <View style={[styles.wrapperText, { width: WIDTHXD(1064) }]}>
                  <Text numberOfLines={1} style={styles.content}>
                    {item.diaChi}
                  </Text>
                </View>
              </View>
            )}
            <View
              style={[
                styles.flexColumn,
                { alignItems: 'flex-start', marginTop: HEIGHTXD(20) }
              ]}
            >
              <Text style={[styles.label]}>Điều khoản thanh toán</Text>
              <PickerSearch
                width={WIDTHXD(1064)}
                data={[]}
                findData={this.findDataTermPayment}
                title="Điều khoản thanh toán"
                onValueChange={onChangeRules}
                content={rules}
              />
            </View>

            <View style={styles.flexRow}>
              <View style={[styles.flexColumn, { marginTop: HEIGHTXD(30) }]}>
                <Text style={[styles.label]}>Phương thức thanh toán</Text>
                <PickerItem
                  width={WIDTHXD(692)}
                  data={item.phuongThucThanhToan}
                />
              </View>
              <View style={[styles.flexColumn, { marginTop: HEIGHTXD(30) }]}>
                <Text style={[styles.label]}>Hạn thanh toán</Text>
                <PickerDate
                  width={WIDTHXD(342)}
                  onValueChange={() => {}}
                  containerStyle={{
                    width: null,
                    paddingHorizontal: WIDTHXD(24)
                  }}
                />
              </View>
            </View>

            <View
              style={[
                styles.flexColumn,
                { alignItems: 'flex-start', marginTop: HEIGHTXD(30) }
              ]}
            >
              <Text style={styles.label}>Đơn vị công tác</Text>
              <PickerSearch
                width={WIDTHXD(1064)}
                data={[]}
                title="Đơn vị công tác"
                findData={this.findWorkUnit}
                onValueChange={onChangeDepartment}
                content={department}
              />
            </View>
            <View
              style={[
                styles.flexColumn,
                styles.lastItem,
                { marginTop: HEIGHTXD(30) }
              ]}
            >
              <Text style={styles.label}>Thị trường công tác</Text>
              <PickerSearch
                width={WIDTHXD(1064)}
                data={[]}
                findData={this.findWorkingMarket}
                title="Thị trường công tác"
                onValueChange={onChangeMarket}
                content={market}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default ItemManagerInfo;

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
    borderWidth: 0.2,
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
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(11),
    color: R.colors.label
  },
  content: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(36),
    paddingVertical: HEIGHTXD(50),
    color: R.colors.black0
  }
});
