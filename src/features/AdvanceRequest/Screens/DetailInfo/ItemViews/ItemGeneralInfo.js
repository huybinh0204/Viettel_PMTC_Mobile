import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, LayoutAnimation, TouchableOpacity, Platform, UIManager } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux'
import R from '../../../../../assets/R';
import { getFontXD, WIDTHXD, HEIGHTXD, getWidth, toPriceVnd } from '../../../../../config/Function';
import ModalSearch from '../../../common/Modal';

class ItemGeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      keysearchPayUnit: '',
      details: {},
      requestApproval: 0,
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
      let requestApproval = 0
      if (this.props.data.requestAmount !== 0) {
        requestApproval = this.props.data.requestAmount
      }
      this.setState({ details: this.props.data, requestApproval })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      let requestApproval = 0
      if (nextProps.data.requestAmount !== 0) requestApproval = nextProps.data.requestAmount
      this.setState({ details: nextProps.data, requestApproval })
    }
  }

  _resizeFont = (value) => {
    let fontSize = 42
    const maxLength = value ? value.length : 0
    if (maxLength > 10) { fontSize = fontSize * (10 / maxLength) }
    return WIDTHXD(fontSize)
  }

  render() {
    const { onChangeValue, adOrgId, cDepartmentId, docstatus, isFinish, transDate, documentNo } = this.props;
    const { expanded, details } = this.state;
    const description = details.description ? details.description : '';
    const requestAmount = details.requestAmount ? details.requestAmount : '';
    const cContractName = details.cContractName ? details.cContractName : '';
    const cProjectName = details.cProjectName ? details.cProjectName : '';
    const cSiteCodeInfoName = details.cSiteCodeInfoName ? details.cSiteCodeInfoName : '';
    const cStatementName = details.cStatementName ? details.cStatementName : '';
    const cPaymentPlanIdName = details.cPaymentPlanIdName ? details.cPaymentPlanIdName : '';
    const fontSize = this._resizeFont(toPriceVnd(requestAmount))
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexRow, { borderBottomWidth: (expanded === true) ? 0.3 : 0, paddingHorizontal: WIDTHXD(30), paddingVertical: WIDTHXD(30) }]}
        >
          <Text style={styles.title}>Thông tin chung</Text>
          {expanded && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
          {!expanded && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {expanded
          && (
            <View style={{ paddingHorizontal: WIDTHXD(30) }}>
              <TextInput
                editable={this.props.enableEdit}
                maxLength={250}
                multiline={true}
                value={description}
                onChangeText={text => {
                  details.description = text
                  this.setState({ details })
                  onChangeValue({ key: 'description', value: text })
                }
                }
                placeholder="Nội dung"
                style={styles.formEnterInfo}
              />
              <View style={styles.row}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.label}>Tổng tiền đề nghị</Text>
                  <Text style={styles.require}>*</Text>
                </View>
                <TextInput
                  editable={this.props.enableEdit}
                  keyboardType="number-pad"
                  value={toPriceVnd(requestAmount)}
                  style={[styles.totalMoney, { fontSize }]}
                  placeholder="0"
                  onChangeText={text => {
                    details.requestAmount = text.split('.').join('');
                    this.setState({ details, fontSize })
                    onChangeValue({ key: 'requestAmount', value: parseInt(text.split('.').join(''), 10) })
                  }
                  }
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Tổng tiền được duyệt</Text>
                <TextInput
                  editable={false}
                  value={toPriceVnd(this.state.requestApproval)}
                  style={[styles.totalMoney, { fontSize }]}
                  placeholder="0"
                />
              </View>
              <View style={[styles.flexColumn, { alignItems: 'flex-start' }]}>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  value={cContractName}
                  id={details.cContractId}
                  label="Hợp đồng"
                  title="Hợp đồng"
                  keyApi="contract"
                  onValueChange={obj => {
                    details.cContractName = obj.name
                    onChangeValue({ key: 'cContractId', value: obj.id })
                    this.setState({ details })
                  }}
                />
              </View>
              {details.cPaymentPlanIdName
                ? <View style={[styles.flexColumn]}>
                  <Text style={[styles.label, { marginTop: HEIGHTXD(36) }]}>Kì thanh toán</Text>
                  <Text style={[styles.value, { marginTop: HEIGHTXD(16) }]}>{cPaymentPlanIdName}</Text>
                </View>
                : null}
              <View style={[styles.flexColumn]}>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  value={cProjectName}
                  id={details.cProjectId}
                  label="Dự án"
                  title="Dự án"
                  keyApi="project"
                  onValueChange={obj => {
                    details.cProjectName = obj.name
                    onChangeValue({ key: 'cProjectId', value: obj.id })
                    this.setState({ details })
                  }}
                />
              </View>
              <View style={[styles.flexColumn]}>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  value={cSiteCodeInfoName}
                  id={details.cSiteCodeInfoId}
                  label="Vị trí"
                  title="Vị trí"
                  keyApi="position"
                  onValueChange={obj => {
                    details.cSiteCodeInfoName = obj.name
                    onChangeValue({ key: 'cSiteCodeInfoId', value: obj.id })
                  }}
                />
              </View>
              <View style={[styles.flexColumn, { paddingBottom: HEIGHTXD(30) }]}>
                <ModalSearch
                  enableEdit={this.props.enableEdit}
                  value={cStatementName}
                  label="Tờ trình"
                  require={true}
                  id={details.cStatementId}
                  title="Tờ trình"
                  keyApi="statement"
                  documentNo={documentNo}
                  docstatus={docstatus}
                  isFinish={isFinish}
                  transDate={transDate}
                  cDepartmentId={cDepartmentId}
                  adOrgId={adOrgId}
                  onValueChange={obj => {
                    details.cStatementName = obj.name
                    onChangeValue({ key: 'cStatementId', value: obj.id })
                    this.setState({ details })
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

function mapStateToProps(state) {
  return {
    requestAmount: state.advanceRequestReducer.requestAmount
  }
}

export default connect(mapStateToProps, {})(ItemGeneralInfo);

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
  formEnterInfo: {
    marginTop: HEIGHTXD(40),
    fontSize: getFontXD(42),
    minHeight: HEIGHTXD(160),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    paddingHorizontal: WIDTHXD(32),
    paddingBottom: HEIGHTXD(12),
    width: WIDTHXD(1064),
    borderColor: R.colors.iconGray,
    borderWidth: 0.3,
    borderRadius: WIDTHXD(20),
  },
  totalMoney: {
    borderBottomColor: R.colors.iconGray,
    borderBottomWidth: 0.3,
    width: WIDTHXD(260),
    paddingVertical: 0,
    textAlign: 'right',
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    fontSize: getFontXD(42)
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
    marginTop: HEIGHTXD(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexColumn: {
    flexDirection: 'column',
    marginVertical: HEIGHTXD(20)
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
    paddingVertical: HEIGHTXD(10)
  },
  value: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
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
    color: R.colors.color777,
    marginBottom: HEIGHTXD(8)
  },
})
