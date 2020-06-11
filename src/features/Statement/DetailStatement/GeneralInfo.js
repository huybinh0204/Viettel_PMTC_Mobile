// @flow
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import R from '../../../assets/R';
import { HEIGHTXD, WIDTHXD } from '../../../config/Function';
import ItemGeneralInfo from './ItemDetailStatement/ItemGeneralInfo';
import ItemOfficeInfo from './ItemDetailStatement/ItemOfficeInfo';
import ItemMoneyInfo from './ItemDetailStatement/ItemGeneraStatement/ItemMoneyInfo';
import ItemStatus from './ItemDetailStatement/ItemGeneraStatement/itemStatus';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  findByIdStatement,
  updateSatement,
} from '../../../apis/Functions/statement';
import global from '../global';
import { showAlert, TYPE } from '../../../common/DropdownAlert';
import {
  setStatusMenu,
  setStatementID,
  setStatusCOStatement
} from '../../../actions/statement';

class GeneralInfo extends Component {
  // menu: Array<Object>;
  itemGeneralInfo = React.createRef();

  itemOfficeInfo = React.createRef();

  constructor(props) {
    super(props);
    global.onSumitDetailGeneralInfo = this.submitUpdateStatement.bind(this);
    global.reloadGeneralInfo = this.getDetailByID.bind(this);
    this.state = {
      index: 0,
      reRender: false,
      loading: false,
      statementInfo: null,
      statusCO: true,
      statementGeneral: {
        // requestBeforeTaxAmount: 34763447,
        approvedBeforeTaxAmount: 0,
        requestTaxAmount: 0,
        approvedTaxAmount: 0,
        adOrgId: this.props.adOrgId,
        adOrgName: null,
        adClientId: null,
        adClientName: null,
        created: 1585650898345,
        createdFrom: null,
        createdTo: null,
        createdby: 10362509,
        createdbyName: null,
        updated: new Date().getTime(),
        updatedFrom: null,
        updatedTo: null,
        updatedby: 10362509,
        updatedbyName: null,
        description: 'Tờ trình -_-',
        isactive: 'Y',
        isDeleted: 'N',
        documentNo: 'PTC2TT200008',
        transDate: '31/03/2020',
        transDateFrom: null,
        transDateTo: null,
        hardCopyDocumentNo: null,
        hardCopyDate: null,
        hardCopyDateFrom: null,
        hardCopyDateTo: null,
        documentCode: null,
        financeNumber: null,
        currencyRate: null,
        // requestAmount: 34763447,
        approvedAmount: 0,
        parentId: null,
        parentName: null,
        isSponsor: 'N',
        isFinish: 'N',
        docstatus: 'DR',
        approveStatus: '0',
        isSync: null,
        textId: null,
        textName: null,
        textSyncId: null,
        textSyncName: null,
        processing: 'N',
        posted: 'N',
        signvoffice: 'N',
        signerstatus: '0',
        issignerrecord: 'N',
        signcomment: null,
        dataSource: null,
        adWindowName: null,
        trytime: 0,
        isautopost: null,
        isnotoverallow: 'Y',
        value: null,
        name: null,
        signerStatus: '0',
        cStatementLines: null,

        fwmodelId: 62242,
        isSize: true,
        cDocumentsignId: null,
        cDocumentTypeId: 1,
        cControlDepartmentId: 1015668,
        // cStatementCategoryId: 43,
        cCurrencyId: null,
        cBpartnerId: 1789564,
        cStatementId: 62242,
        cDepartmentId: 27,
        cPeriodId: null,
        cControlDepartmentName: null,
        cDepartmentName: null,
        cDocumentsignName: null,
        cStatementCategoryName: null,
        cDocumentTypeName: null,
        cCurrencyName: null,
        cPeriodName: null,
        cBpartnerName: null
      }
    };

    this.dataItem = {};
  }

  statusCOTmp = false;

  componentDidMount() {
    this.getDetailByID();
  }

  getDetailByID = async () => {
    try {
      const resDetail = await findByIdStatement(this.props.cStatementId);
      if (resDetail.status === 200) {
        console.log('reload info', resDetail.data)

        this.setState({ statementInfo: resDetail.data });
      } else {
        showAlert(TYPE.WARN, 'Thông báo', 'Kiểm tra lại kết nối');
      }
      if (this.props.callBackListStatement) {
        this.props.callBackListStatement();
      }
    } catch (e) { }
    this.setState({ loading: true }, async () => {
      this.setState({ loading: false });
    });
  };

  onChangeBottomTab = async index => {
    switch (index) {
      case 0: {
        this.submitUpdateStatement();
        break;
      }
      case 1: {
        this.props.onSumitStatusStatement();
        break;
      }
      default: {
      }
    }
    this.setState({ index });
  };

  submitUpdateStatement = async () => {
    if (!this.itemGeneralInfo.current.state.cDepartmentId) {
      showAlert(TYPE.WARN, 'Thông báo', 'Bạn chưa chọn phòng ban');
      return;
    }

    if (!this.itemGeneralInfo.current.state.transDate) {
      showAlert(TYPE.WARN, 'Thông báo', 'Bạn chưa nhập ngày lập');
      return;
    }

    if (!this.itemGeneralInfo.current.state.description) {
      showAlert(TYPE.WARN, 'Thông báo', 'Bạn chưa nhập nội dung');
      return;
    }

    if (this.itemGeneralInfo.current.state.description.length > 250) {
      showAlert(TYPE.WARN, 'Thông báo', 'Bạn nhập nội dung quá dài');
      return;
    }
    const body = this.state.statementInfo;
    // body.adOrgId= '1001337',
    body.cDepartmentId = this.itemGeneralInfo.current.state.cDepartmentId;
    body.cBpartnerId = this.itemGeneralInfo.current.state.cBpartnerId;
    body.cStatementCategoryId = this.itemGeneralInfo.current.state.cStatementCategoryId;
    body.transDate = this.itemGeneralInfo.current.state.transDate;
    body.description = this.itemGeneralInfo.current.state.description;
    body.cControlDepartmentId = this.itemGeneralInfo.current.state.cControlDepartmentId;
    body.cControlDepartmentName = this.itemGeneralInfo.current.state.cControlDepartmentName;

    body.isSponsor = this.convertBoolToString(
      this.itemGeneralInfo.current.state.isSponsor
    );

    body.isnotoverallow = this.convertBoolToString(
      this.itemGeneralInfo.current.state.isnotoverallow
    );

    body.hardCopyDocumentNo = this.itemOfficeInfo.current.state.hardCopyDocumentNo;

    body.cStatementId = this.props.cStatementId;
    body.updated = new Date().getTime();
    console.log("update statement body", body)
    try {
      const response = await updateSatement(body);
      console.log("update statement response", response)

      if (response && response.status === 200) {
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Cập nhật thành công');
        if (this.props.callBackListStatement) {
          this.props.callBackListStatement();
        }
      }
    } catch (error) { }
  };

  convertBoolToString = value => {
    if (value === true) {
      return 'Y';
    }
    return 'N';
  };

  render() {
    const { statementInfo } = this.state;
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <View>
            <ActivityIndicator animating color="#1C1C1C" size="large" />
          </View>
        </View>
      );
    }
    return (
      <View style={[styles.container, { marginBottom: HEIGHTXD(200) }]}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: HEIGHTXD(24) }}>
            <ItemGeneralInfo
              ref={this.itemGeneralInfo}
              item={this.dataItem}
              statementInfo={statementInfo}
              userData={this.props.userData}
            />
          </View>
          <View style={{ marginTop: HEIGHTXD(24) }}>
            <ItemMoneyInfo
              statementInfo={statementInfo}
              ref={this.itemOfficeInfo}
              item={this.dataItem}
              detail={false}
            />
          </View>
          <View style={{ marginTop: HEIGHTXD(24) }}>
            <ItemOfficeInfo
              statementInfo={statementInfo}
              ref={this.itemOfficeInfo}
              item={this.dataItem}
              detail={false}
            />
          </View>
          <View style={{ marginVertical: HEIGHTXD(24) }}>
            <ItemStatus
              statementInfo={statementInfo}
              ref={this.itemOfficeInfo}
              item={this.dataItem}
              detail={false}
            />
          </View>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                this.props.nextToDetail();
                this.props.setIsShowBtnSearch(true);
            }}
            style={{ alignItems: 'flex-end' }}
          >
            <View style={styles.button}>
              <Icon
                name="arrow-right"
                size={WIDTHXD(60)}
                color={R.colors.colorMain}
              />
            </View>
          </TouchableOpacity>

        </ScrollView>
        {/* <BottomTabAdd
          menu={this.state.menu}
          onChange={this.onChangeBottomTab}
          activeIndex={this.state.index}
        /> */}
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    cStatementId: state.statementRuducer.cStatementId,
    statusMenu: state.statementRuducer.statusMenu,
    userData: state.userReducers.userData,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId
  };
}
export default connect(mapStateToProps, {
  setStatusMenu,
  setStatementID,
  setStatusCOStatement
})(GeneralInfo);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: R.colors.colorBackground
  },
  button: {
    marginTop: HEIGHTXD(42),
    marginBottom: HEIGHTXD(67),
    marginRight: WIDTHXD(86),
    width: WIDTHXD(137),
    height: WIDTHXD(137),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: WIDTHXD(137),
    elevation: 5,
    backgroundColor: R.colors.white
  }
});
