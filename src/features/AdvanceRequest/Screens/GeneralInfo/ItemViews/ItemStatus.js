import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import R from '../../../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth } from '../../../../../config/Function';

type Props = {
  item: Object,
  detail?: boolean
};
type State = {
  expanded: boolean
}
class ItemStatus extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: true,
      body: {}
    }
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({ body: this.props.value })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showAllField !== this.props.showAllField) {
      this.setState({ expanded: nextProps.showAllField })
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
    this.setState({ expanded: !this.state.expanded }, () => this.props.updateExpanded(this.state.expanded, 2));
  }

  renderItem = (item: Object) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: HEIGHTXD(30) }}>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.deNghi}>{item.deNghi}</Text>
      <Text style={styles.duocDuyet}>{item.duocDuyet}</Text>
    </View>
  )

  render() {
    const { docStatus } = this.props;
    const { expanded, body } = this.state;
    const docStatusAdvanceRequest = docStatus ? ((docStatus === 'RA' || docStatus === 'DR') ? R.strings.local.TRANG_THAI_TAI_LIEU[0].name : R.strings.local.TRANG_THAI_TAI_LIEU[1].name) : ''
    const paymentStatus = body.paymentStatus ? R.strings.local.TRANG_THAI_CHI[parseInt(body.paymentStatus, 10)].name : R.strings.local.TRANG_THAI_CHI[1].name
    const approveStatus = body.approveStatus ? R.strings.local.TRANG_THAI_DUYET[parseInt(body.approveStatus, 10)].name : ''
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexRow, { borderBottomWidth: (expanded === true) ? 0.3 : 0, paddingHorizontal: WIDTHXD(30) }]}
        >
          <Text style={styles.title}>Thông tin trạng thái </Text>
          {expanded === true ? <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />
            : <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {
          expanded
          && <View
            style={{ paddingHorizontal: WIDTHXD(32) }}
          >
            <View>
              <View style={styles.row}>
                <Text style={[styles.label, { flex: 1.2, fontSize: getFontXD(36) }]}>Trạng thái duyệt</Text>
                <Text style={[styles.label, styles.content]}>
                  {approveStatus}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { flex: 1.2, fontSize: getFontXD(36) }]}>Trạng thái tài liệu</Text>
                <Text style={[styles.label, styles.content]}>
                  {docStatusAdvanceRequest}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { flex: 1.2, fontSize: getFontXD(36) }]}>Trạng thái chi</Text>
                <Text style={[styles.label, styles.content]}>
                  {paymentStatus}
                </Text>
              </View>
            </View>
          </View>
        }
      </View>
    )
  }
}

export default ItemStatus;

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
  content: {
    flex: 2,
    paddingLeft: WIDTHXD(36),
    color: R.colors.black0
  },
  ctnCheckbox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: WIDTHXD(36),
  },
  row: {
    flexDirection: 'row',
    marginVertical: HEIGHTXD(20),
  },
  label: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    marginVertical: HEIGHTXD(13),
    color: R.colors.color777,
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
