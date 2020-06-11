import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, UIManager } from 'react-native';
import i18n from 'assets/languages/i18n';
import moment from 'moment';

import apiVOffice from '../../../../../apis/Functions/vOffice';
import PickerDate from '../../../../../common/Picker/PickerDate';
import R from '../../../../../assets/R';
import { getFontXD, WIDTHXD, HEIGHTXD, getWidth, getLineHeightXD } from '../../../../../config/Function';
import global from '../../../global'
import ItemInputText from '../../../../Invoice/common/ItemInputText';
import ItemPicker from '../../../../Invoice/common/ItemPicker';
import PickerSearch from '../../../../../common/Picker/PickerSearch';
import { redStar } from 'common/Require';

class ItemGeneralInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      textForms: [],
      textForm: '',
      priority: '',
      sector: 'Tài chính',
      filling: false
    };

    this.listUom = []
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    global.hideGeneralInfor = this._hideGeneralInfor.bind(this);
  }

  _hideGeneralInfor = (isHide) => {
    this.setState({ expanded: isHide })
  }

  componentDidMount() {
    // get list text form
    // this._searchTextForms('');
    // console.log('dataItem', this.props.item)
    // fill data if have item
    if (this.props.item.cDocumentsignId) {
      this.fillVOfficeUpdate(this.props.item);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.item.cDocumentsignId !== nextProps.item.cDocumentsignId) {
      console.log('receiver new voffice, fill data');
      this.fillVOfficeUpdate(nextProps.item);
    }

    return true;
  }

  fillVOfficeUpdate = (voffice) => {
    if (this.state.filling) return;

    this.setState({ filling: true }, async () => {
      let {
        textForms,
        textForm,
        priority,
        sector,
      } = this.state;

      // fill text form
      if (!textForms || textForms.length === 0) {
        textForms = await this._fetchTextForms('');
      }
      if (textForms) {
        let findTextForms = textForms.filter(x => x.documentTypeId === voffice.cDoctypeId);
        if (findTextForms && findTextForms.length > 0) {
          textForm = findTextForms[0].name;
        }
      }

      // fill priority
      console.log('priority', voffice.priority)
      let findPriority = R.strings.local.DO_UU_TIEN.filter(x => x.value === voffice.priority);
      if (findPriority && findPriority.length > 0) {
        priority = findPriority[0].name;
      }

      // fill sector
      let findSector = R.strings.local.LINH_VUC.filter(x => x.value === voffice.areacode);
      if (findSector && findSector.length > 0) {
        // console.log('found areacode', findSector)
        sector = findSector[0].name;
      } else {
        // console.log('not found areacode', R.strings.local.LINH_VUC)
      }

      this.setState({ textForm, priority, sector, filling: false });
    })
  }

  _searchTextForms = async (search_text) => {
    const textForms = await this._fetchTextForms(search_text);
    // console.log(textForms)
    this.setState({ textForms });
  }

  _fetchTextForms = async (search_text) => {
    try {
      let body = {
        name: search_text,
        listDoctyeValue: "PCTM,DGCLTGAP,SALSUM",
      }
      let resVOffice = await apiVOffice.getTextForms(body);
      if (resVOffice && resVOffice.length > 0) {
        return resVOffice;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  render() {
    const { item, self } = this.props;
    const { expanded } = this.state;
    global.isHideGeneralInfor = !expanded
    // global.updateHeader()
    return (
      <View style={styles.container}>
        <View style={{ paddingLeft: WIDTHXD(30), paddingRight: WIDTHXD(31), paddingTop: HEIGHTXD(20) }}>
          <ItemInputText
            require={true}
            disabled={self.dataItem.viewOnly}
            width={WIDTHXD(1064)}
            title="Số chứng từ trình ký"
            value={self.dataItem.voucherno}
            inputProps={{
              maxLength: 50
            }}
            marginTop={HEIGHTXD(30)}
            onChangeValue={(text) => {
              self.dataItem.voucherno = text
              self.dataItem.signcode = text
              self._reRender()
            }}
          />
          <ItemInputText
            require={true}
            disabled={self.dataItem.viewOnly}
            width={WIDTHXD(1064)}
            title="Mật khẩu"
            value={self.dataItem.password}
            marginTop={HEIGHTXD(30)}
            inputProps={{
              autoCompleteType: 'password',
              secureTextEntry: true,
              textContentType: 'password',
              maxLength: 20
            }}
            onChangeValue={(text) => {
              self.dataItem.password = text
              self._reRender()
            }}
          />
          <Text style={{ ...styles.label, marginTop: HEIGHTXD(30) }}>{"Hình thức văn bản"}</Text>
          <PickerSearch
            disabled={self.dataItem.viewOnly}
            width={WIDTHXD(1064)}
            title="Hình thức văn bản"
            height={HEIGHTXD(99)}
            value={this.state.textForm}
            data={this.state.textForms}
            findData={this._fetchTextForms}
            onValueChange={(values, item) => {
              self.dataItem.cDoctypeId = item.documentTypeId;
              self.dataItem.cDoctypeName = item.name;
              this.setState({ textForm: item.name });
            }}
          />
          <View style={[styles.flexRow]}>
            <ItemInputText
              require={true}
              disabled={self.dataItem.viewOnly}
              width={WIDTHXD(692)}
              title="Ký hiệu văn bản"
              value={self.dataItem.signcode}
              marginTop={HEIGHTXD(30)}
              inputProps={{
                maxLength: 50
              }}
              onChangeValue={(text) => {
                self.dataItem.signcode = text;
                self.dataItem.documentcode = text;
                self._reRender()
              }}
            />
            <View style={styles.flexColumn}>
              <Text style={[styles.label, { marginTop: HEIGHTXD(30) }]}>Ngày chứng từ{redStar()}</Text>
              <PickerDate
                disabled={self.dataItem.viewOnly}
                width={WIDTHXD(342)}
                onValueChange={(date) => {
                  self.dataItem.dateacct = date
                  self._reRender()
                }}
                value={self.dataItem.dateacct}
              />
            </View>
          </View>
          <ItemInputText
            require={true}
            disabled={self.dataItem.viewOnly}
            width={WIDTHXD(1064)}
            title="Tiêu đề trình ký"
            value={self.dataItem.titlesign}
            marginTop={HEIGHTXD(30)}
            inputProps={{
              maxLength: 250
            }}
            onChangeValue={(text) => {
              self.dataItem.titlesign = text
              self._reRender()
            }}
          />
          <View style={[styles.flexRow, { paddingBottom: HEIGHTXD(5) }]}>
            <ItemPicker
              require={true}
              title="Độ ưu tiên"
              disabled={self.dataItem.viewOnly}
              data={R.strings.local.DO_UU_TIEN}
              width={WIDTHXD(450)}
              value={this.state.priority}
              onValueChange={(value, items) => {
                self.dataItem.priority = items.value
                this.setState({ priority: items.name })
                self._reRender()
              }}
            />
            <ItemPicker
              require={true}
              title="Lĩnh vực"
              disabled={self.dataItem.viewOnly}
              data={R.strings.local.LINH_VUC}
              width={WIDTHXD(585)}
              value={this.state.sector}
              onValueChange={(value, items) => {
                this.setState({ sector: items.name });
                self.dataItem.areacode = items.value;
                // console.log(items.value)
                self._reRender()
              }}
            />
          </View>
        </View>
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
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderBottomColor: R.colors.iconGray,
  },
  flexColumn: {
    flexDirection: 'column',
  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(56),
    fontFamily: R.fonts.RobotoBold,
    color: R.colors.colorMain,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(11),
    color: R.colors.label,
  },
})
