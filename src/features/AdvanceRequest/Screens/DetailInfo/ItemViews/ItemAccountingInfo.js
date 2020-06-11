import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import R from '../../../../../assets/R';
import { getFontXD, WIDTHXD, HEIGHTXD, getWidth } from '../../../../../config/Function';
import ModalSearch from '../../../common/Modal';

type Props = {
  item: Object,
  value: Object,
  onChangeValue: Function,
};
type State = {
  expanded: boolean
}


class ItemGeneralInfo extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: true,
      details: {},
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
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

  componentDidMount() {
    if (this.props.data) {
      this.setState({ details: this.props.data })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ details: nextProps.data })
    }
  }

  render() {
    const { onChangeValue, } = this.props;
    const { expanded, details } = this.state;
    const cCostTypeName = details.cCostTypeName ? details.cCostTypeName : '';
    const cBudgetName = details.cBudgetName ? details.cBudgetName : '';
    const paymentTypeName = details.paymentTypeName ? details.paymentTypeName : '';
    const adOrgIndebtName = details.adOrgIndebtName ? details.adOrgIndebtName : '';
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexRow, { borderBottomWidth: (expanded === true) ? 0.3 : 0, paddingHorizontal: WIDTHXD(30), paddingVertical: WIDTHXD(30) }]}
        >
          <Text style={styles.title}>THÔNG TIN KẾ TOÁN</Text>
          {expanded && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
          {!expanded && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded
          && (
            <View style={{ paddingHorizontal: WIDTHXD(30) }}>
              <View style={[styles.flexColumn, { alignItems: 'flex-start' }]}>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  value={cCostTypeName}
                  id={details.cCostTypeId}
                  title="Khoản mục phí"
                  label="Khoản mục phí"
                  keyApi="itemFee"
                  onValueChange={obj => {
                    details.cCostTypeName = obj.name
                    onChangeValue({ key: 'cCostTypeId', value: obj.id })
                    this.setState({ details })
                  }}
                />
              </View>
              <View style={[styles.flexColumn]}>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  value={cBudgetName}
                  id={details.cBudgetId}
                  title="Nguồn kinh phí"
                  label="Nguồn kinh phí"
                  keyApi="funding"
                  onValueChange={obj => {
                    details.cBudgetName = obj.name
                    onChangeValue({ key: 'cBudgetId', value: obj.id })
                    this.setState({ details })
                  }}
                />
              </View>
              <View style={[styles.flexColumn]}>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  value={paymentTypeName}
                  id={details.paymentType}
                  title="Loại chi"
                  label="Loại chi"
                  keyApi="paymentType"
                  onValueChange={obj => {
                    details.paymentTypeName = obj.name
                    onChangeValue({ key: 'paymentType', value: obj.id })
                  }}
                />
              </View>
              <View style={[styles.flexColumn, { paddingBottom: HEIGHTXD(30) }]}>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  value={adOrgIndebtName}
                  id={details.adOrgIndebtId}
                  title="Đơn vị nhận nợ"
                  label="Đơn vị nhận nợ"
                  keyApi="debtRecevingUnit"
                  onValueChange={obj => {
                    details.adOrgIndebtName = obj.name
                    onChangeValue({ key: 'adOrgIndebtId', value: obj.id })
                  }}
                />
              </View>
            </View>
          )
        }
      </View>
    )
  }
}

export default ItemGeneralInfo;

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
  itemLast: {
    alignItems: 'flex-start',
    paddingBottom: HEIGHTXD(24),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: R.colors.borderGray,
  },
  row: {
    marginTop: HEIGHTXD(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexColumn: {
    flexDirection: 'column',
    marginVertical: HEIGHTXD(20),
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
    paddingVertical: HEIGHTXD(10)
  },
  formEnterInfo: {
    textAlignVertical: 'top',
    paddingHorizontal: WIDTHXD(20),
    height: HEIGHTXD(160),
    width: WIDTHXD(1064),
    marginTop: HEIGHTXD(37),
    borderColor: R.colors.borderGray,
    borderWidth: 1,
    borderRadius: WIDTHXD(20)
  },
  wrapperText: {
    width: WIDTHXD(300),
    borderRadius: HEIGHTXD(20),
    paddingHorizontal: WIDTHXD(20),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: R.colors.borderGray,
  },
  lastItem: {
    alignItems: 'flex-start',
    marginBottom: HEIGHTXD(46)
  },
  label: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    marginBottom: HEIGHTXD(8)
  },
})
