// @flow
/* eslint-disable react/jsx-closing-tag-location */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
// import { CheckBox } from 'native-base';
import CheckBox from '../../../../common/Picker/CheckBox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { TIEN_TE } from '../../../Invoice/DetailInvoice/dataInvoice';
import PickerItem from '../../../../common/Picker/PickerItem';
import R from '../../../../assets/R';
import {
  HEIGHTXD,
  getFontXD,
  WIDTHXD,
  getWidth,
  getLineHeightXD,
  WIDTH
} from '../../../../config/Function';
import { setIsHideGroupStatement } from '../../../../actions/statement';
import { FONT_TITLE } from '../../../../config/constants';

class ItemOfficeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hardCopyDocumentNo: '',
      hardCopyInfo: '',
      body: {},
    };
  }

  componentDidMount() {
    const { statementInfo } = this.props;
    if (statementInfo) {
      this.setState({
        hardCopyDocumentNo: statementInfo.hardCopyDocumentNo,
        hardCopyInfo: statementInfo.hardCopyInfo,
        body: statementInfo
      });
    }
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
    this.props.setIsHideGroupStatement({
      isHideOfficeInfo: !this.props.isHideOfficeInfo
    });
  };

  renderItem = (item) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: HEIGHTXD(30)
      }}
    >
      <Text style={styles.type}>{item.type}</Text>
      <View style={styles.borderText}>
        <Text style={styles.deNghi}>{item.deNghi}</Text>
      </View>
      <View style={styles.borderText}>
        <Text style={styles.duocDuyet}>{item.duocDuyet}</Text>
      </View>
    </View>
  );

  onChangeHardCopyDocumentNo = text => {
    this.setState({ hardCopyDocumentNo: text });
  };

  render() {
    const { item,isHideOfficeInfo } = this.props;
    const { hardCopyDocumentNo, body, hardCopyInfo  } = this.state;
    const checkSignerrecord = body.issignerrecord === "Y" ? true: false
    
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[
            styles.flexTitle,
            { borderBottomWidth: isHideOfficeInfo === true ? 0.3 : 0 }
          ]}
        >
          <Text style={styles.title}>THÔNG TIN VOFFICE</Text>
          {isHideOfficeInfo === true ? (
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
        {isHideOfficeInfo && (
          <View
            style={{
              paddingHorizontal: WIDTHXD(30),
              marginBottom: HEIGHTXD(40)
            }}
          >
            <View style={styles.flexRow}>
              <Text style={styles.label}>
                Số, ký hiệu văn bản
              </Text>
              <View style={styles.wrapperText}>
                <TextInput
                  value={hardCopyDocumentNo}
                  onChangeText={this.onChangeHardCopyDocumentNo}
                  style={{ flex: 1, width: '100%', padding: 0, fontSize:getFontXD(42) }}
                >
                  {item.tyGia}
                </TextInput>
              </View>
            </View>
            <View style={{}}>
            <View style={styles.row}>
                <Text style={[styles.label, { flex: 1.2 }]}>Số KH VB trình ký</Text>
                <Text style={[styles.label, { flex: 2, paddingLeft: WIDTHXD(36), color: R.colors.black0, fontSize:getFontXD(42) }]}>
                  {hardCopyInfo ? hardCopyInfo : ''}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { flex: 1.2 }]}>Trạng thái ký</Text>
                <Text style={[styles.label, { flex: 2, paddingLeft: WIDTHXD(36), color: R.colors.black0, fontSize:getFontXD(42) }]}>
                  {body.signerstatus ? R.strings.local.TRANG_THAI_KY[body.signerstatus].name : ''}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { flex: 1.5, marginTop:HEIGHTXD(5) }]}>Ngày duyệt VO</Text>
                <Text style={[styles.label, { flex: 1.5, paddingLeft: WIDTHXD(36), color: R.colors.black0, fontSize:getFontXD(42) }]}>{body.actiondate ? body.actiondate : ''}</Text>
                <View style={{ justifyContent: 'space-around', flexDirection: 'row', flex: 2 }}>

                  <View style={styles.ctnCheckbox}>
                    {/* <CheckBox
                      checked={checkSignerrecord}
                      size={WIDTH(30)}
                      color={R.colors.colorCheckBox}
                      style={{ borderRadius: HEIGHTXD(18) }}
                    /> */}
                      <CheckBox
                      value={checkSignerrecord}
      //                 onValueChange={this.onChangeOverallow}
                      textStyle={{ color: 'black', fontSize: getFontXD(42) }}
                      containerStyle={{ marginTop: HEIGHTXD(0), paddingVertical: 0 }}
                      title="Đã trình ký"
                    />
                    {/* <Text style={[styles.label, { marginLeft: WIDTHXD(56), color: R.colors.black0 }]}>Đã trình ký</Text> */}
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
        {this.props.detail && this.state.isHideOfficeInfo && (
          <View>
            <View
              style={{
                width: getWidth() / 2,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'flex-end'
              }}
            >
              <Text style={styles.leftTitle}>Đề nghị</Text>
              <Text style={styles.rightTitle}>Được duyệt</Text>
            </View>
            <FlatList
              data={TIEN_TE}
              renderItem={({ item }) => this.renderItem(item)}
              style={{ marginBottom: HEIGHTXD(40) }}
            />
          </View>
        )}
        {this.props.detail && this.state.isHideOfficeInfo && (
          <View style={styles.line} />
        )}
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    isHideOfficeInfo: state.statementRuducer.isHideOfficeInfo
  };
}
export default connect(mapStateToProps, {
  setIsHideGroupStatement
},null, {forwardRef : true})(ItemOfficeInfo);

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth()
    // borderRadius: WIDTHXD(30),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:HEIGHTXD(40),
  },
  flexTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: HEIGHTXD(37),
    borderBottomColor: R.colors.iconGray,
    paddingLeft: WIDTHXD(30),
    paddingRight: WIDTHXD(67)
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
  wrapperText: {
    width: WIDTHXD(659),
    borderRadius: HEIGHTXD(20),
    paddingHorizontal: WIDTHXD(8),
    marginLeft: WIDTHXD(45),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
    height: HEIGHTXD(99)
  },
  label: {
    fontSize: getFontXD(FONT_TITLE),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label,
  },
  row: {
    flexDirection: 'row',
    marginTop: HEIGHTXD(40)
  },
  ctnCheckbox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: WIDTHXD(36),
  },
  line: {
    height: HEIGHTXD(235),
    position: 'absolute',
    width: WIDTHXD(4),
    right: WIDTHXD(330),
    bottom: HEIGHTXD(36),
    backgroundColor: R.colors.colorBackground,
    flex: 1
  },
  type: {
    width: WIDTHXD(320),
    marginLeft: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36)
  },
  borderText: {
    flex: 0,
    borderBottomWidth: 1,
    borderColor: R.colors.colorBackground
  },
  deNghi: {
    width: getWidth() / 5,
    textAlign: 'right',
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36)
  },
  duocDuyet: {
    width: getWidth() / 5,
    textAlign: 'right',
    marginRight: WIDTHXD(60),
    paddingBottom: HEIGHTXD(20),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777,
    fontSize: getFontXD(36)
  },
  leftTitle: {
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(36)
  },
  rightTitle: {
    marginRight: WIDTHXD(50),
    fontFamily: R.fonts.RobotoMedium,
    fontSize: getFontXD(36)
  }
});
