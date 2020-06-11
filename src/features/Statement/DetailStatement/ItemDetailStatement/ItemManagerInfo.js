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
import _ from 'lodash';
import R from '../../../../assets/R';
import {
  HEIGHTXD,
  getFontXD,
  WIDTHXD,
  getWidth,
  getLineHeightXD
} from '../../../../config/Function';
import ItemTextForGeneral from './ItemTextForGeneral';

type Props = {
  item: Object
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

  render() {
    const { item, detail } = this.props;
    let soTienChuaDNTT = _.has(item, 'notRequestAmount')
      ? item.notRequestAmount
      : 'Trống';
    let dieuKhoanTT = _.has(item, 'cPaymentTermId')
      ? item.cPaymentTermId
      : 'Trống';
    let phuongThucTT = _.has(item, 'typeRate') ? item.typeRate : 'Trống';
    let hanTT = _.has(item, 'dueDate') ? item.dueDate : 'Trống';
    let donViCT = _.has(item, 'cWorkUnitId') ? item.cWorkUnitId : 'Trống';
    let thiTruongCT = _.has(item, 'cLocationId') ? item.cLocationId : 'Trống';
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
            {detail && (
              <View
                style={[
                  styles.flexColumn,
                  { alignItems: 'flex-start', marginTop: HEIGHTXD(20) }
                ]}
              >
                <ItemTextForGeneral
                  title="Số tiền chưa DNTT"
                  content={soTienChuaDNTT}
                  width={WIDTHXD(1064)}
                />
              </View>
            )}
            <View
              style={[
                styles.flexColumn,
                {
                  alignItems: 'flex-start',
                  marginTop: detail ? HEIGHTXD(30) : HEIGHTXD(20)
                }
              ]}
            >
              <ItemTextForGeneral
                title="Điều khoản thanh toán"
                content={dieuKhoanTT}
                width={WIDTHXD(1064)}
              />
            </View>

            <View style={styles.flexRow}>
              <View style={[styles.flexColumn, { marginTop: HEIGHTXD(30) }]}>
                <ItemTextForGeneral
                  title="Phương thức thanh toán"
                  content={phuongThucTT}
                  width={WIDTHXD(692)}
                />
              </View>
              <View style={[styles.flexColumn, { marginTop: HEIGHTXD(30) }]}>
                <ItemTextForGeneral
                  title="Hạn thanh toán"
                  content={hanTT}
                  width={WIDTHXD(342)}
                />
              </View>
            </View>

            <View
              style={[
                styles.flexColumn,
                { alignItems: 'flex-start', marginTop: HEIGHTXD(30) }
              ]}
            >
              <ItemTextForGeneral
                title="Đơn vị công tác"
                content={donViCT}
                width={WIDTHXD(1064)}
              />
            </View>
            <View
              style={[
                styles.flexColumn,
                styles.lastItem,
                { marginTop: HEIGHTXD(30) }
              ]}
            >
              <ItemTextForGeneral
                title="Thị trường công tác"
                content={thiTruongCT}
                width={WIDTHXD(1064)}
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
