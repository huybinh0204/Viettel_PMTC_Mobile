import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import R from '../../../../../assets/R';
import { connect } from 'react-redux';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth } from '../../../../../config/Function';
import { setIsHideGroupStatement } from '../../../../../actions/statement';
import { FONT_TITLE } from '../../../../../config/constants';

class ItemStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: {},
      docstatus:"DR",
    }
  }

  componentDidMount() {
    if (this.props.statementInfo) {
      this.setState({ 
        body: this.props.statementInfo,
        docstatus: this.props.statementInfo.docstatus,
       })
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({docstatus : this.props.statusButtonCO ? "PO" : "DR"});
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
    this.props.setIsHideGroupStatement({
      isHideStatusInfo: !this.props.isHideStatusInfo
    });
  }

  renderItem = (item) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: HEIGHTXD(30) }}>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.deNghi}>{item.deNghi}</Text>
      <Text style={styles.duocDuyet}>{item.duocDuyet}</Text>
    </View>
  )

  render() {
    const { statementInfo, isHideStatusInfo } = this.props;
    const { body, docstatus } = this.state;
    const docStatus = docstatus ? (docstatus === 'DR' ? R.strings.local.TRANG_THAI_TAI_LIEU[0].name : R.strings.local.TRANG_THAI_TAI_LIEU[1].name) : ''
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexRow, { borderBottomWidth: (isHideStatusInfo === true) ? 1 : 0, paddingHorizontal: WIDTHXD(30) }]}
        >
          <Text style={styles.title}>Thông tin trạng thái </Text>
          {isHideStatusInfo === true ? <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(50) }} color={R.colors.iconGray} />
            : <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(37) }} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {isHideStatusInfo && 
        <View style={{ paddingHorizontal: WIDTHXD(32) }}>
            <View style={{ marginBottom: HEIGHTXD(40) }}>
              <View style={styles.row}>
                <Text style={[styles.label, { flex: 1.2, marginTop:HEIGHTXD(5) }]}>Trạng thái duyệt</Text>
                <Text style={[styles.label, { flex: 2, paddingLeft: WIDTHXD(36), fontSize: getFontXD(42), color: R.colors.grey1000 }]}>
                  {body.approveStatus ? R.strings.local.TRANG_THAI_DUYET[parseInt(statementInfo.approveStatus)].name : ''}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { flex: 1.2, marginTop:HEIGHTXD(5) }]}>Trạng thái tài liệu</Text>
                <Text style={[styles.label, { flex: 2, paddingLeft: WIDTHXD(36), fontSize: getFontXD(42), color: R.colors.grey1000 }]}>
                  {docStatus}
                </Text>
              </View>
              {/* <View style={styles.row}>
                <Text style={[styles.label, { flex: 1.2 }]}>Trạng thái chi</Text>
                <Text style={[styles.label, { flex: 2, paddingLeft: WIDTHXD(36) }]}>
                  {body.paymentStatus ? R.strings.local.TRANG_THAI_CHI[parseInt(statementInfo.paymentStatus)].name : ''}
                </Text>
              </View> */}
            </View>
          </View>
        }
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    isHideStatusInfo: state.statementRuducer.isHideStatusInfo,
    statusButtonCO: state.statementRuducer.statusButtonCO
  };
}
export default connect(mapStateToProps, {
  setIsHideGroupStatement
})(ItemStatus);


const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth(),
    elevation: 2,
  },
  ctnCheckbox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: WIDTHXD(36),
  },
  row: {
    flexDirection: 'row',
    marginTop: HEIGHTXD(40),
    justifyContent:"flex-end"
  },
  label: {
    fontSize: getFontXD( FONT_TITLE ),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label,
    padding:0
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(36),
    borderBottomColor: R.colors.borderGray
  },
  flexColumn: {
    flexDirection: 'column',
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
    paddingVertical: HEIGHTXD(10)
  },
  wrapperText: {
    width: WIDTHXD(222),
    borderRadius: HEIGHTXD(20),
    paddingHorizontal: WIDTHXD(8),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: R.colors.borderGray,
    paddingVertical: WIDTHXD(50),
  },
  line: {
    height: HEIGHTXD(235),
    position: 'absolute',
    width: WIDTHXD(4),
    right: WIDTHXD(330),
    bottom: HEIGHTXD(36),
    backgroundColor: R.colors.colorBackground,
    flex: 1,
  },
  type: {
    width: WIDTHXD(320),
    marginLeft: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(42),
  },
  deNghi: {
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground,
    width: getWidth() / 5,
    textAlign: 'right',
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(42),
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
    fontSize: getFontXD(42),
  },
  leftTitle: {
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(42),
  },
  rightTitle: {
    marginRight: WIDTHXD(50),
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(42),
  },
})
