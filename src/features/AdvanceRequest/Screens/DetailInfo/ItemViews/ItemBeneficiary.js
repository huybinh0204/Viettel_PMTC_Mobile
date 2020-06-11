import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash'
import R from '../../../../../assets/R';
import { getFontXD, WIDTHXD, HEIGHTXD, getWidth } from '../../../../../config/Function';
import ModalSearch from '../../../common/Modal';
import global from '../../../global'

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
      cBpartnerId: '',
      accountNo: '',
      accountNoBank: '',
      cBankName: '',
      cBpartnerBankName: ''
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
      this.setState({
        details: this.props.data,
        accountNo: this.props.data.accountNo,
        accountNoBank: this.props.data.bankownername,
        cBankName: this.props.data.cBankName,
        cBpartnerBankName: this.props.data.bankownername
      }, () => {
        if (global.CB_PARTNER_ID) {
          this.props.onChangeValue({ key: 'cBpartnerId', value: global.CB_PARTNER_ID })
          this.setState(
            { details: { ...this.state.details, cBpartnerId: global.CB_PARTNER_ID, cBpartnerName: global.CB_PARTNER_NAME } }
          )
        }
      })
    } else {
      if (global.CB_PARTNER_ID) {
        this.props.onChangeValue({ key: 'cBpartnerId', value: global.CB_PARTNER_ID })
        this.setState(
          { details: { ...this.state.details, cBpartnerId: global.CB_PARTNER_ID, cBpartnerName: global.CB_PARTNER_NAME } }
        )
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        details: nextProps.data,
        accountNo: nextProps.data.accountNo,
        accountNoBank: nextProps.data.bankownername,
        cBankName: nextProps.data.cBankName,
        cBpartnerBankName: nextProps.data.bankownername
      })
    }
  }

  render() {
    const { onChangeValue, } = this.props;
    const { expanded, details } = this.state;
    const cBpartnerName = details.cBpartnerName ? details.cBpartnerName : '';
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexRow, { borderBottomWidth: (expanded === true) ? 0.3 : 0, paddingHorizontal: WIDTHXD(30), paddingVertical: WIDTHXD(30) }]}
        >
          <Text style={styles.title}>NGƯỜI THỤ HƯỞNG</Text>
          {expanded && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
          {!expanded && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded
          && (
            <View style={{ paddingHorizontal: WIDTHXD(30) }}>
              <View style={[styles.flexColumn, { alignItems: 'flex-start' }]}>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  label="Đối tượng công nợ"
                  require={true}
                  value={cBpartnerName}
                  id={details.cBpartnerId}
                  title="Đối tượng công nợ"
                  keyApi="debtSubject"
                  onValueChange={obj => {
                    details.cBpartnerName = obj.name
                    this.setState({ cBpartnerId: obj.id })
                    onChangeValue({ key: 'cBpartnerId', value: obj.id })
                  }}
                />
              </View>
              <View style={[styles.flexColumn]}>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  value={this.state.cBpartnerBankName}
                  id={details.cBpartnerBankId}
                  title="Tài khoản ngân hàng thụ hưởng"
                  label="Tài khoản ngân hàng thụ hưởng"
                  keyApi="benefitBank"
                  cBpartnerId={this.state.cBpartnerId}
                  onValueChange={obj => {
                    if (!_.isEmpty(obj)) {
                      details.cBpartnerBankName = obj.name
                      onChangeValue({ key: 'bankownername', value: obj.name })
                      onChangeValue({ key: 'accountNo', value: obj.accountNo })
                      onChangeValue({ key: 'cBankId', value: obj.cBankId })
                      onChangeValue({ key: 'cBpartnerBankId', value: obj.id })
                      this.setState({
                        accountNo: obj.accountNo,
                        accountNoBank: obj.name,
                        cBankName: obj.cBankName,
                      })
                    }
                  }
                  }
                />
              </View>
              <View style={styles.row}>
                <View style={styles.account}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.label}>Tên chủ tài khoản</Text>
                    <Text style={styles.require}>*</Text>
                  </View>
                  <TextInput
                    editable={this.props.enableEdit}
                    value={this.state.accountNoBank}
                    style={styles.textInputLeft}
                    onChangeText={text => {
                      details.bankownername = text
                      this.setState({ details, accountNoBank: text })
                      onChangeValue({ key: 'bankownername', value: text })
                    }}
                  />
                </View>
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.label}>Số tài khoản</Text>
                    <Text style={styles.require}>*</Text>
                  </View>
                  <TextInput
                    editable={this.props.enableEdit}
                    value={this.state.accountNo}
                    keyboardType="number-pad"
                    style={styles.textInputRight}
                    onChangeText={text => {
                      details.accountNo = text
                      this.setState({ details, accountNo: text })
                      onChangeValue({ key: 'accountNo', value: text })
                    }}
                  />
                </View>
              </View>
              <View style={[styles.flexColumn, { paddingBottom: HEIGHTXD(30) }]}>
                <View style={{ flexDirection: 'row' }}>
                </View>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  id={details.cBankId}
                  require={true}
                  value={this.state.cBankName}
                  title="Ngân hàng"
                  label="Ngân hàng"
                  keyApi="bank"
                  onValueChange={obj => {
                    details.cBankName = obj.name
                    onChangeValue({ key: 'cBankId', value: obj.id })
                    onChangeValue({ key: 'bank', value: obj.name })
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
  require: {
    color: 'red',
    fontSize: getFontXD(42),
    marginLeft: WIDTHXD(12)
  },
  itemLast: {
    alignItems: 'flex-start',
    paddingBottom: HEIGHTXD(24),
  },
  textInputLeft: {
    width: WIDTHXD(575),
    height: HEIGHTXD(100),
    borderColor: R.colors.iconGray,
    borderRadius: WIDTHXD(20),
    borderWidth: 0.3,
    paddingVertical: 0,
    paddingLeft: WIDTHXD(32),
    color: R.colors.black0,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular
  },
  textInputRight: {
    width: WIDTHXD(460),
    height: HEIGHTXD(100),
    borderColor: R.colors.iconGray,
    borderRadius: WIDTHXD(20),
    borderWidth: 0.3,
    paddingVertical: 0,
    paddingLeft: WIDTHXD(32),
    color: R.colors.black0,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: R.colors.borderGray,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: HEIGHTXD(20),
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
    fontSize: getFontXD(36),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label,
    marginBottom: HEIGHTXD(8)
  },
})
