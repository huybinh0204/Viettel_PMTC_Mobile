// @flow
import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import R from '../../../assets/R';
import { setStatusMenu, setStatementID, setStatusCOStatement } from '../../../actions/statement';
import { HEIGHTXD, WIDTHXD } from '../../../config/Function';
import ItemMoneyInfo from './ItemAddStatement/ItemGeneraStatement/ItemMoneyInfo';
import ItemStatus from './ItemAddStatement/ItemGeneraStatement/itemStatus';
import ItemOfficeInfo from './ItemAddStatement/ItemGeneraStatement/ItemOfficeInfo';
import ItemGeneralInfo from './ItemAddStatement/ItemGeneralInfo';
import FakeData from './dataInvoice';
import Confirm from '../../../common/ModalConfirm/Confirm';
import {
  createSatement,
  updateSatement,
  findByIdStatement
} from '../../../apis/Functions/statement';
import global from '../global'

import { showAlert, TYPE } from '../../../common/DropdownAlert';


class GeneralInfo extends Component {
  itemGeneralInfo = React.createRef();

  itemOfficeInfo = React.createRef();


  constructor(props) {
    super(props);
    global.onSumitAddGeneralInfo = this.onSubmitStatement.bind(this)
    global.reloadGeneralInfo = this.getDetailByID.bind(this);

    this.state = {
      index: 0,
      debt: '',
      conTract: '',
      rules: '',
      department: '',
      market: '',
      content: '',
      documentNo: '',
      statementInfo: {},
      body: {
        keyheader: null,
        adProcessId: null,
        adProcessName: null,
        // requestBeforeTaxAmount: 34763447,
        approvedBeforeTaxAmount: 0,
        requestTaxAmount: 0,
        approvedTaxAmount: 0,
        adOrgId: this.props.adOrgId,
        adOrgName: null,
        adClientId: null,
        adClientName: null,
        created: null,
        createdFrom: null,
        createdTo: null,
        createdby: null,
        createdbyName: null,
        updated: null,
        updatedFrom: null,
        updatedTo: null,
        updatedby: null,
        updatedbyName: null,
        description: 'Tờ trình test cai xem nao',
        isactive: 'Y',
        isDeleted: 'N',
        documentNo: '',
        transDate: '31/03/2020',
        transDateFrom: null,
        transDateTo: null,
        hardCopyDocumentNo: null,
        hardCopyDate: null,
        hardCopyDateFrom: null,
        hardCopyDateTo: null,
        documentCode: null,
        financeNumber: null,
        currencyRate: 1,
        // requestAmount: 34763447,
        approvedAmount: 0,
        parentId: null,
        parentName: null,
        // isSponsor: 'N',
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
        // isnotoverallow: 'Y',
        value: null,
        name: null,
        fwmodelId: 0,
        isSize: true,
        cDocumentTypeId: 1,
        cStatementCategoryId: 43,
        // cDepartmentId: 27,
        // cBpartnerId: 1789564,
        cCurrencyId: null,
        cControlDepartmentId: null,
        cDocumentsignId: null,
        cPeriodId: null,
        cDocumentTypeName: null,
        cStatementCategoryName: null,
        cDepartmentName: null,
        cBpartnerName: null,
        cCurrencyName: null,
        cControlDepartmentName: null,
        cDocumentsignName: null,
        cPeriodName: null,
        cStatementId: 0,
        cDepartmentId: null
      },
    };
  }
  getDetailByID = async () => {
    try {
      console.log("reloadstatment", this.state.statementInfo.cStatementId)
      const resDetail = await findByIdStatement(this.state.statementInfo.cStatementId);

      if (resDetail.status === 200) {
        this.setState({ statementInfo: resDetail.data, body: resDetail.data });
        if (this.props.callBackListStatement) {
          this.props.callBackListStatement();
        }
      } else {
        showAlert(TYPE.WARN, 'Thông báo', 'Kiểm tra lại kết nối');
      }
    } catch (e) { }
    this.setState({ loading: true }, async () => {
      this.setState({ loading: false });
    });
  };

  openModalConfirm = () => {
    this.ConfirmPopup.setModalVisible(true)
  }
  onChangeNoiDung = (text) => {
    this.setState({ content: text });
  };

  onChangeConTract = (text) => {
    this.setState({ conTract: text });
  };

  onChangeDebt = (text) => {
    this.setState({ debt: text });
  };

  onChangeRules = (text) => {
    this.setState({ rules: text });
  };

  onChangeMarket = (text) => {
    this.setState({ market: text });
  };

  onChangeDepartment = (text) => {
    this.setState({ department: text });
  };

  componentDidMount() {
    let dataTemp = this.state.body;
    dataTemp.adOrgId = this.props.userData.adOrgId;
    dataTemp.createdby = this.props.userData.adUserId;
    dataTemp.cDepartmentId = this.props.userData.adUserDepartmentId;
    dataTemp.cControlDepartmentId = this.props.userData.adUserDepartmentId;
    console.log('body statement', dataTemp)
    this.setState({
      body: dataTemp,
    })
  }

  componentWillReceiveProps(nextProps) {
  }

  // onChangeBottomTab = async index => {
  //   switch (index) {
  //     case 0: {
  //       this.ConfirmPopup.setModalVisible(true)
  //     }
  //     break;
  //     case 1:
  //     case 2:
  //       {
  //         if(this.props.onSumitStatusStatement)
  //         {
  //           this.props.onSumitStatusStatement();
  //         }
  //       }
  //       break;
  //     case 3:
  //     default:

  //   }
  //   this.setState({ index });
  // };

  onSubmitStatement = async (isNextDetail = false) => {
    const { body } = this.state;
    if (!this.itemGeneralInfo.current.state.cControlDepartmentId) {
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

    body.cBpartnerId = this.itemGeneralInfo.current.state.cBpartnerId;
    body.cControlDepartmentId = this.itemGeneralInfo.current.state.cControlDepartmentId;
    body.cControlDepartmentName = this.itemGeneralInfo.current.state.cControlDepartmentName;
    body.transDate = this.itemGeneralInfo.current.state.transDate;
    body.cStatementCategoryId = this.itemGeneralInfo.current.state.cStatementCategoryId;
    body.description = this.itemGeneralInfo.current.state.description;
    body.isSponsor = this.convertBoolToString(
      this.itemGeneralInfo.current.state.isSponsor
    );
    body.isnotoverallow = this.convertBoolToString(
      this.itemGeneralInfo.current.state.isnotoverallow
    );
    if (this.props.cStatementId && this.itemOfficeInfo.current) {
      body.hardCopyDocumentNo = this.itemOfficeInfo.current.state.hardCopyDocumentNo
    }
    try {
      if (this.props.cStatementId === 0) {
        console.log('body create', JSON.stringify(body))
        const response = await createSatement(body);
        if (response && response.status === 200) {
          this.props.onChangeStatusMenuBottom(true)
          this.props.setStatementID(response.data.cStatementId);
          this.setState({ documentNo: response.data.documentNo });
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Tạo thành công');
          console.log('response create', response.data)
          this.setState({ statementInfo: response.data, body: response.data })
          if (isNextDetail) {
            this.props.nextToDetail();
            this.props.setIsShowBtnSearch(true);
          }
          this.props.setIsSwipeEnabled(true);
          if (this.props.callBackListStatement) {
            this.props.callBackListStatement()
          }
          this.props.setStatusCOStatement(true);
        }
      } else {
        body.cStatementId = this.props.cStatementId;
        const response = await updateSatement(body);
        if (response && response.status === 200) {
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Cập nhật thành công');
          this.setState({ statementInfo: response.data, body: response.data })
          this.props.setIsShowBtnSearch(true);
          this.props.setIsSwipeEnabled(true);
          if (this.props.callBackListStatement) {
            this.props.callBackListStatement()
          }
        }
      }
    } catch (error) {
      showAlert(TYPE.ERROR, 'Thông báo', error);
    }
  };

  convertBoolToString = value => {
    if (value === true) {
      return 'Y';
    }
    return 'N';
  };

  _onPressMenu = (index) => {
  }

  render() {
    // biến tạm
    const { statementInfo } = this.state;
    const { cStatementId } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <StatusBar backgroundColor={R.colors.colorMain} />
          <View style={{ marginTop: HEIGHTXD(24) }}>
            <ItemGeneralInfo
              documentNo={this.state.documentNo}
              ref={this.itemGeneralInfo}
              content={this.state.content}
              debt={this.state.debt}
              conTract={this.state.conTract}
              onChangeNoiDung={text => this.onChangeNoiDung(text)}
              onChangeConTract={text => this.onChangeConTract(text)}
              onChangeDebt={text => this.onChangeDebt(text)}
              item={FakeData.THONG_TIN_CHUNG}
              userData={this.props.userData}
            />
          </View>
          {/* <View style={{ marginVertical: HEIGHTXD(30) }}>
            <ItemOfficeInfo
              ref={this.itemOfficeInfo}
              item={FakeData.THONG_TIN_SO_TIEN}
            />
          </View> */}
          {(cStatementId) ? (
            <View style={{ marginTop: HEIGHTXD(24) }}>
              <ItemMoneyInfo
                statementInfo={statementInfo}
                ref={this.itemOfficeInfo}
                item={this.dataItem}
                detail={false}
              />
            </View>) : null}
          {(cStatementId) ? (
            <View style={{ marginTop: HEIGHTXD(24) }}>
              <ItemOfficeInfo
                statementInfo={statementInfo}
                ref={this.itemOfficeInfo}
                // item={this.dataItem}
                item={this.state.body}
                detail={false}
              />
            </View>) : null}
          {(cStatementId) ? (
            <View style={{ marginVertical: HEIGHTXD(24) }}>
              <ItemStatus
                statementInfo={statementInfo}
                ref={this.itemOfficeInfo}
                item={this.dataItem}
                detail={false}
              />
            </View>) : null}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (this.props.cStatementId === 0) {
                this.onSubmitStatement(true);
              } else {
                this.props.nextToDetail();
                this.props.setIsShowBtnSearch(true);
                this.props.setIsSwipeEnabled(true);
              }
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
        <Confirm
          ref={ref => {
            this.ConfirmPopup = ref;
          }}
          title="Bạn có muốn lưu bản ghi này không ?"
          titleLeft="HUỶ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => { }}
          onPressRight={() => this.onSubmitStatement()}
        />
      </View>
    );
  }
}

// export default GeneralInfo;

function mapStateToProps(state) {
  return {
    cStatementId: state.statementRuducer.cStatementId,
    statusMenu: state.statementRuducer.statusMenu,
    userData: state.userReducers.userData.loggedIn,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
    statusButtonCO: state.statementRuducer.statusButtonCO,
  };
}
export default connect(mapStateToProps, { setStatusMenu, setStatementID, setStatusCOStatement })(
  GeneralInfo
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: R.colors.colorBackground,
    justifyContent: 'space-around',
    position: 'relative',
    marginBottom: HEIGHTXD(200),
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
