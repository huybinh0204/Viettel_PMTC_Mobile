import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  LayoutAnimation,
  TouchableOpacity,
  Platform,
  UIManager
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import _ from 'lodash';
// import PickerItem from '../../ItemViews/PickerItem';
import PickerItem from '../../../AdvanceRequest/common/ItemPicker';
import PickerDate from '../../../../common/Picker/PickerDate';
import R from '../../../../assets/R';
import {
  getFontXD,
  WIDTHXD,
  HEIGHTXD,
  getWidth,
  getLineHeightXD
} from '../../../../config/Function';
import ItemTextForGeneral from './ItemTextForGeneral';
import AutoCompleteModal from '../../ItemViews/AutoCompleteModal';
import { getCategory } from '../../../../apis/Functions/statement';
import CheckBox from '../../../../common/Picker/CheckBox';
import { connect } from 'react-redux';
import { setIsHideGroupStatement } from '../../../../actions/statement';
import { FONT_TITLE } from '../../../../config/constants';
import { redStar } from 'common/Require';

class ItemGeneralInfo extends Component {
  partnerComplete = React.createRef();

  departmentComplete = React.createRef();

  constructor(props) {
    super(props);
    const dateTmp = new Date();
    this.state = {
      resultCategory: [],
      cStatementCategoryId: '',
      cBpartnerId: null,
      cDepartmentId: null,
      cControlDepartmentId: null,
      cControlDepartmentName: '',
      adUserDepartmentName: "",
      description: '',
      isSponsor: false,
      isnotoverallow: false,
      transDate: moment(new Date()).format('DD/MM/YYYY'),
      documentNo: "",
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    this.setState({
      cBpartnerId: this.props.userData.adUserId,
      adUserDepartmentName: this.props.userData.fullname
    });
    this.getCategory();
  }

  changePartner = item => {
    this.setState({ cBpartnerId: item.cBpartnerId });
  };

  changeDepartment = item => {
    this.setState({ cControlDepartmentId: item.cDepartmentId, cControlDepartmentName: item.value });
  };

  onChangeNoiDung = text => {
    this.setState({ description: text });
  };

  getCategory = async () => {
    const body = {
      isSize: true,
      adOrgId: 1000432,
      name: this.state.valueSearch
    };
    const response = await getCategory(body);
    if (response && response.status === 200) {
      this.setState({ resultCategory: this._convertListStatement(response.data) });
    }
  };

  _convertListStatement = data => {
    let result = []
    _.forEach(data, item => {
      result.push({ name: item.text, value: item.cstatementCategoryId })
    })
    return result
  }

  onChangeSponsor = value => {
    this.setState({ isSponsor: value });
  };

  onChangeOverallow = value => {
    this.setState({ isnotoverallow: value });
  };


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
    this.props.setIsHideGroupStatement({ isHideGeneralInfo: !this.props.isHideGeneralInfo });
  };

  render() {
    console.log('RESULT CATEGORY----', this.state.resultCategory)
    const {
      // expanded,
      description,
      transDate,
      isSponsor,
      isnotoverallow,
      adUserDepartmentName,
    } = this.state;
    const cStatementCategoryId = this.state.cStatementCategoryId ? this.state.cStatementCategoryId : ''
    let id = ''
    _.forEach(this.state.resultCategory, (item, index) => {
      if (item.value === cStatementCategoryId) id = index
    })
    const { documentNo, isHideGeneralInfo } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.changeLayout}
          style={[
            styles.flexTitle,
            { borderBottomWidth: isHideGeneralInfo === true ? 0.3 : 0 }
          ]}
        >
          <Text style={styles.title}>Thông tin chung</Text>
          {isHideGeneralInfo && (
            <Ionicons
              name="ios-arrow-down"
              size={WIDTHXD(50)}
              color={R.colors.iconGray}
            />
          )}
          {!isHideGeneralInfo && (
            <Ionicons
              name="ios-arrow-forward"
              size={WIDTHXD(50)}
              color={R.colors.iconGray}
            />
          )}
        </TouchableOpacity>
        {isHideGeneralInfo && (
          <View
            style={{
              paddingLeft: WIDTHXD(30),
              paddingRight: WIDTHXD(31),
            }}
          >
            {documentNo ? (
              <View
                style={[
                  styles.flexColumn,
                  { alignItems: 'flex-start', marginTop: HEIGHTXD(40) }
                ]}
              >
                <View style={styles.flexRow}>
                  <Text style={styles.label}>Số chứng từ</Text>
                  <Text style={{
                    fontSize: getFontXD(42),
                    fontFamily: R.fonts.RobotoRegular,
                    marginLeft: WIDTHXD(113)
                  }}>
                    {documentNo}</Text>
                </View>
              </View>
            ) : null
            }
            <View
              style={[
                styles.flexColumn,
                { alignItems: 'flex-start', marginTop: HEIGHTXD(40) }
              ]}
            >
              <Text style={styles.label}>Người yêu cầu</Text>
              <AutoCompleteModal
                id={this.state.cBpartnerId}
                ref={this.partnerComplete}
                onChange={this.changePartner}
                title="Người yêu cầu"
                keyApi="partner"
                name={adUserDepartmentName}
              />
            </View>
            <View
              style={[
                styles.flexColumn,
                { alignItems: 'flex-start', marginTop: HEIGHTXD(40) }
              ]}
            >
              <Text style={styles.label}>{`Phòng ban kiểm soát CP`}{redStar()}</Text>
              <AutoCompleteModal
                id={this.state.cControlDepartmentId}
                ref={this.departmentComplete}
                onChange={this.changeDepartment}
                title="Phòng ban kiểm soát"
                keyApi="departmentFull"
              />
            </View>
            <View style={[styles.flexRow, { marginTop: HEIGHTXD(40) }]}>
              <View style={styles.flexColumn}>
                <Text style={[styles.label, { marginBottom: HEIGHTXD(11) }]}>Loại tờ trình</Text>
                <PickerItem
                  width={WIDTHXD(692)}
                  data={this.state.resultCategory}
                  id={id}
                  value={cStatementCategoryId}
                  onValueChange={(index, itemChild) => {
                    console.log('ITEM CHILD---', itemChild)
                    this.setState({ cStatementCategoryId: itemChild.value })
                  }}
                />
              </View>
              <View style={[styles.flexColumn, { alignItems: 'flex-start' }]}>
                <Text style={[styles.label, { marginBottom: HEIGHTXD(11) }]}>Ngày lập</Text>
                <PickerDate
                  value={transDate}
                  width={WIDTHXD(342)}
                  onValueChange={date => {
                    this.setState({ transDate: date });
                  }}
                />
              </View>
            </View>
            <View style={[styles.flexColumn, styles.lastItem]}>
              <TextInput
                maxLength={250}
                multiline
                value={description}
                onChangeText={this.onChangeNoiDung}
                placeholder="Nhập nội dung"
                style={styles.formEnterInfo}
              />
            </View>
            <View style={{ marginBottom: HEIGHTXD(40) }}>
              <CheckBox
                value={isSponsor}
                textStyle={{ color: 'black', fontSize: getFontXD(42) }}
                onValueChange={this.onChangeSponsor}
                containerStyle={{ margin: 0, paddingVertical: 0 }}
                title="Chi các hoạt động tài trợ, quỹ phúc lợi"
              />
              <CheckBox
                value={isnotoverallow}
                onValueChange={this.onChangeOverallow}
                textStyle={{ color: 'black', fontSize: getFontXD(42) }}
                containerStyle={{ margin: HEIGHTXD(40), paddingVertical: 0 }}
                title="Không vượt quá quyết toán"
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
    isHideGeneralInfo: state.statementRuducer.isHideGeneralInfo,
  };
}
export default connect(mapStateToProps, {
  setIsHideGroupStatement
}, null, { forwardRef: true })(ItemGeneralInfo);


const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.white,
    width: getWidth()
    // borderRadius: WIDTHXD(30),
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
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: R.colors.iconGray
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
  formEnterInfo: {
    textAlignVertical: 'top',
    paddingHorizontal: WIDTHXD(36),
    minHeight: HEIGHTXD(220),
    width: WIDTHXD(1064),
    borderColor: R.colors.borderGray,
    fontSize: getFontXD(42),
    borderWidth: 0.3,
    borderRadius: WIDTHXD(20),
    color: R.colors.black0,
    fontFamily: R.fonts.RobotoRegular,
  },
  wrapperText: {
    width: WIDTHXD(352),
    paddingHorizontal: WIDTHXD(36),
    borderRadius: HEIGHTXD(20),
    height: HEIGHTXD(99),
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 0.3,
    borderColor: R.colors.iconGray
  },
  lastItem: {
    alignItems: 'flex-start',
    marginBottom: HEIGHTXD(40),
    marginTop: HEIGHTXD(40)
  },
  label: {
    fontSize: getFontXD(FONT_TITLE),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label
  },
  content: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.black0
  }
});
