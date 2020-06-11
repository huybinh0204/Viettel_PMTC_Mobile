import React, { Component } from 'react';
import { StyleSheet, Text, View, LayoutAnimation, TouchableOpacity } from 'react-native';
import CheckBox from '../../../../../common/Picker/CheckBox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import R from '../../../../../assets/R';
import { HEIGHTXD, WIDTHXD, getFontXD, getWidth } from '../../../../../config/Function';
import i18n from 'assets/languages/i18n';
import _ from 'lodash'

type Props = {
  item: Object,
  detail?: boolean
};
type State = {
  expanded: boolean
}
class ItemVOfficeInfo extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: true
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
    this.setState({ expanded: !this.state.expanded });
  }

  renderItem = (item: Object) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: HEIGHTXD(30) }}>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.deNghi}>{item.deNghi}</Text>
      <Text style={styles.duocDuyet}>{item.duocDuyet}</Text>
    </View>
  )

  render() {
    const { value } = this.props;
    const { expanded } = this.state;
    const isSignerRecord  = value.issignerrecord && value.issignerrecord === 'Y' ? true : false
    let hardCopyInfo = value.hardCopyInfo ? value.hardCopyInfo : ''
    let timeHardCopy = value.timeHardCopy ? value.timeHardCopy : ''
    let signerStatus = ''
    if (value.signerstatus) {
      _.forEach(R.strings.local.TRANG_THAI_KY, item => {
        if (item.value === value.signerstatus) {
          signerStatus = item.name
        }
      })
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[styles.flexRow, { borderBottomWidth: (expanded === true) ? 0.3 : 0, paddingHorizontal: WIDTHXD(30) }]}
        >
          <Text style={styles.title}>{i18n.t('VOFFICE_INFO')}</Text>
          {expanded === true ? <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(50) }} color={R.colors.iconGray} />
            : <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(50) }} color={R.colors.iconGray} />}
        </TouchableOpacity>
        {
          expanded
          && <View
            style={{ paddingHorizontal: WIDTHXD(32), paddingVertical: HEIGHTXD(32) }}>
            <View style={{ marginTop: HEIGHTXD(12) }}>
              <View style={styles.flexRow}>
                <Text style={[styles.label, { flex: 0.5 }]}>{i18n.t('VOFFICE_NO')}</Text>
                <View style={[styles.wrapperText, { flex: 0.5 }]}><Text numberOfLines={1}>{hardCopyInfo}</Text></View>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { flex: 0.5 }]}>{i18n.t('SIGNER_STATUS')}</Text>
                <Text style={[styles.labelInside, { flex: 0.5, marginLeft: -(WIDTHXD(72)) }]}>{signerStatus}</Text>
              </View>
              <View style={[styles.row, { alignItems: "center" }]}>
                <Text style={[styles.label, { flex: 0.5 }]}>{i18n.t('VO_APPROVE_DATE')}</Text>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', flex: 0.5 }}>
                  <Text style={[styles.label, {marginLeft: -(WIDTHXD(36))}]}>{timeHardCopy}</Text>
                  <View style={styles.ctnCheckbox}>
                    <CheckBox
                      value={isSignerRecord}
                      textStyle={{ color: 'black', fontSize: getFontXD(42) }}
                      containerStyle={{ marginTop: HEIGHTXD(0), paddingVertical: 0 }}
                      title={i18n.t('HAS_SIGNED')}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        }
      </View>
    )
  }
}

export default ItemVOfficeInfo;

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
  ctnCheckbox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: WIDTHXD(36),
  },
  row: {
    flexDirection: 'row',
    marginVertical: HEIGHTXD(20)
  },
  label: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
  },

  labelInside: {
    fontSize: getFontXD(R.fontsize.contentFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
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
    height: HEIGHTXD(90),
    borderRadius: HEIGHTXD(20),
    paddingHorizontal: WIDTHXD(36),
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
    fontSize: getFontXD(36),
  },
  deNghi: {
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground,
    width: getWidth() / 5,
    textAlign: 'right',
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36),
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
    fontSize: getFontXD(36),
  },
})
