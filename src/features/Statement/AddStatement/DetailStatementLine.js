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
import { connect } from 'react-redux';
import R from '../../../assets/R';
import { setTypeOfIconStatementLine, setStatusCOStatement } from '../../../actions/statement';
import { HEIGHTXD, WIDTHXD, validateEmail } from '../../../config/Function';
import ItemGeneralInfoLine from './ItemAddStatement/ItemGeneralInfoLine';
import ItemDifferentLine from './ItemAddStatement/ItemDifferentLine';
import ItemAccountant from './ItemAddStatement/ItemAccountantLine';
import ItemBudget from './ItemAddStatement/ItemBudgetLine';
import FakeData from './dataInvoice';
import { showAlert, TYPE } from '../../../common/DropdownAlert';
import { createSatementLine, updateSatementLine } from '../../../apis/Functions/statement';
import global from '../global';

class DetailStatementLine extends Component {
  generalInfoLineeRef = React.createRef();

  accountanteRef = React.createRef();

  budgeteRef = React.createRef();

  differentLineeRef = React.createRef();

  constructor(props) {
    super(props);

    global.onSumitAddGeneralInfoLine = this.onSubmitStatement.bind(this)
    this.props.setTypeOfIconStatementLine(2);
    this.state = {
      index: 0,
      debt: '',
      conTract: '',
      rules: '',
      department: '',
      market: '',
      content: '',
      dataStatementLine: null,
      statusButtonCO: false,
      body: {
        defaultSortField: 'name',
        isSize2: true,
        columnnGroup: null,
        columnSums: null,
        actionGroup: null,
        valueGroup: null,
        currencyColumn: null,
        listAction: null,
        currentActionIndex: 0,
        totalRecord: null,
        totalAfter: null,
        totalRecordSum: null,
        adWindowId: null,
        isSumObject: false,
        filterFields: null,
        filterClau: null,
        sortField: '',
        sortDir: 'ASC',
        sqlWhere: null,
        returnMessage: null,
        roleCode: null,
        start: 0,
        maxResult: 0,
        isDisplayBold: 'N',
        sbAppend: '',
        lstResult: [],
        strAppend: null,
        baseAdUserId: null,
        // currencyId: null,
        currencyName: null,
        adOrgId: this.props.adOrgId,
        adOrgName: null,
        adClientId: 1000000,
        adClientName: null,
        created: 1580835600000,
        createdFrom: null,
        createdTo: null,
        createdby: 10362509,
        createdbyName: null,
        updated: 1580835600000,
        updatedFrom: null,
        updatedTo: null,
        updatedby: 10362509,
        updatedbyName: null,
        description: 'Tờ trình kinh phí test them moi',
        isactive: 'Y',
        isDeleted: 'N',
        // requestAmount: 6628475195,
        // approveAmount: 6628475195,
        proposalDate: '31/03/2020',
        proposalDateFrom: null,
        proposalDateTo: null,
        approveDate: '31/03/2020',
        approveDateFrom: null,
        approveDateTo: null,
        warningEmail: null,
        isOutOfList: null,
        currencyRate: 1,
        qtPlanDetailId: null,
        qtPlanDetailName: null,
        planAmount: null,
        useAmount: null,
        remainAmount: null,
        isOutOfBudget: null,
        // requestBeforeTaxAmount: 6.628475195e9,
        // approvedBeforeTaxAmount: 6.628475195e9,
        // requestTaxAmount: null,
        // approvedTaxAmount: null, 
        keyheader: null,
        keyline: null,
        directRelease: 'N',
        qtPlanId: null,
        qtPlanName: null,
        name: null,
        value: null,
        logInfo:
          'Org_Value:null,Record_ID:6742029,Table_ID:1000470,Line_ID:7601987,Window_ID:333,AD_Org_ID:1000000,Description:Tờ trình kinh phí hỗ trợ với nhân sự lớn tuổi nghỉ sớm - Đợt 3,Approve_Amount:6.628.475.195,00,C_Currency_ID:null,Currency_Value:null,Currency_Rate:1',
        fwmodelId: 7601987,
        isSize: true,
        cStatementId: 62321,
        cStatementName: null,
        cPaymentScopeId: null,
        cPlanPeriodName: null,
        cPaymentScopeName: null,
        cStatementLineId: 0,
        // cCurrencyId: 234,
        cCurrencyName: null,
        cPurposeId: null,
        cPurposeName: null,
        cCostTypeName: null,
        cBudgetName: null,
        cBudgetId: 44,
        cCostTypeId: null,
        cActivityName: null,
        cPlanPeriodId: null,
        cActivityId: null
      },
      menu: [
        {
          name: 'Lưu',
          iconName: this.props.statusMenu.isSave
            ? R.images.iconSaveActive
            : R.images.iconSaveInActive
        },
        {
          name: 'CO',
          iconName: this.props.statusMenu.isCOed
            ? R.images.iconCodActive
            : R.images.iconRadActive
        },
        {
          name: 'Đính kèm',
          iconName: this.props.statusMenu.isAttack
            ? R.images.iconAttackActive
            : R.images.iconAttackInActive
        },
        {
          name: 'Trình ký',
          iconName: this.props.statusMenu.isSubmitd
            ? R.images.iconSubmitdActive
            : R.images.iconSubmitdInActive
        },
        {
          name: 'Phiếu in',
          iconName: this.props.statusMenu.isPrint
            ? R.images.iconPrintActive
            : R.images.iconPrintInActive
        }
      ]
    };
    global.goBackToListDetailStatement = this._goBackToListDetailStatement.bind(
      this
    );
  }

  _goBackToListDetailStatement = () => {
    this.props.navigation.goBack();
  };

  componentDidMount = async () => {

  };

  componentWillUnmount() {
    this.props.setTypeOfIconStatementLine(0);
  }

  onChangeNoiDung = (text: string) => {
    this.setState({ content: text });
  };

  onChangeConTract = (text: string) => {
    this.setState({ conTract: text });
  };

  onChangeDebt = (text: string) => {
    this.setState({ debt: text });
  };

  onChangeRules = (text: string) => {
    this.setState({ rules: text });
  };

  onChangeMarket = (text: string) => {
    this.setState({ market: text });
  };

  onChangeDepartment = (text: string) => {
    this.setState({ department: text });
  };

  // onChangeBottomTab = async (index) => {
  //   switch (index) {
  //     case 0: {
  //       this.onSubmitStatement();
  //     }
  //     break;
  //     case 1:
  //     case 2:
  //       {
  //         if(this.props.onSumitStatusStatement){
  //           this.props.onSumitStatusStatement();
  //         }
  //       }
  //       break;
  //     default:
  //       return;
  //   }
  //   this.setState({ index });
  // };


  onSubmitStatement = async () => {
    const { body } = this.state;
    console.log(body)
    if (!this.generalInfoLineeRef.current.state.description) {
      showAlert(TYPE.WARN, 'Thông báo', 'Bạn chưa nhập nội dung');
      return;
    }

    if (this.generalInfoLineeRef.current.state.description.length > 250) {
      showAlert(TYPE.WARN, 'Thông báo', 'Bạn nhập nội dung quá dài');
      return;
    }

    // if(!this.generalInfoLineeRef.current.state.currencyId) {
    //   showAlert(TYPE.WARN, 'Thông báo', 'Bạn chưa chọn tiền tệ');
    //   return;
    // };

    if (!this.generalInfoLineeRef.current.state.currencyRate) {
      showAlert(TYPE.WARN, 'Thông báo', 'Bạn chưa nhập tỷ giá');
      return;
    }

    if (!this.accountanteRef.current.state.cBudgetId) {
      showAlert(TYPE.WARN, 'Thông báo', 'Bạn chưa chọn nguồn kinh phí');
      return;
    }

    if (!this.differentLineeRef.current.state.proposalDate) {
      showAlert(
        TYPE.WARN,
        'Thông báo',
        'Bạn chưa chọn ngày đề nghị quyết toán'
      );
      return;
    }

    if (this.differentLineeRef.current.state.warningEmail && !validateEmail(this.differentLineeRef.current.state.warningEmail)) {
      showAlert(
        TYPE.WARN,
        'Thông báo',
        'Email chưa hợp lệ'
      );
      return;
    }

    body.cStatementId = this.props.cStatementId;
    body.description = this.generalInfoLineeRef.current.state.description;
    body.cCurrencyId = this.generalInfoLineeRef.current.state.cCurrencyId;
    body.currencyRate = this.generalInfoLineeRef.current.state.currencyRate;
    body.requestBeforeTaxAmount = this.generalInfoLineeRef.current.state.requestBeforeTaxAmount;
    body.approvedBeforeTaxAmount = this.generalInfoLineeRef.current.state.requestBeforeTaxAmount;
    body.requestTaxAmount = this.generalInfoLineeRef.current.state.requestTaxAmount;
    body.approvedTaxAmount = this.generalInfoLineeRef.current.state.requestTaxAmount;
    body.requestAmount = this.generalInfoLineeRef.current.state.sumAmount;
    body.approveAmount = this.generalInfoLineeRef.current.state.sumAmount;
    body.cPaymentScopeId = this.accountanteRef.current.state.cpaymentScopeId;
    body.cBudgetId = this.accountanteRef.current.state.cBudgetId;
    body.cCostTypeId = this.budgeteRef.current.state.cCostTypeId;
    body.cActivityId = this.budgeteRef.current.state.cActivityId;

    body.isOutOfBudget = this.convertBoolToString(this.budgeteRef.current.state.isOutOfBudget);
    body.directRelease = this.convertBoolToString(this.budgeteRef.current.state.directRelease);

    body.proposalDate = this.differentLineeRef.current.state.proposalDate;

    body.warningEmail = this.differentLineeRef.current.state.warningEmail;
    body.approveDate = this.differentLineeRef.current.state.approveDate;
    console.log('body create statement line', JSON.stringify(body))

    try {
      if (!this.state.dataStatementLine) {
        const response = await createSatementLine(body);
        if (response && response.status === 200) {
          console.log('response create statement line', response.data)
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Tạo thành công');
          this.setState({ dataStatementLine: response.data })
          const { callBackListStatementLine } = this.props.navigation.state.params;
          if (callBackListStatementLine) {
            callBackListStatementLine();
          }
          this._goBackToListDetailStatement()
        } else {
          showAlert(TYPE.ERROR, 'Thông báo', 'Kiểm tra lại kết nối');
        }
      }
      else {
        const response = await updateSatementLine(body);
        if (response && response.status === 200) {
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Cập nhật thành công');
          const { callBackListStatementLine } = this.props.navigation.state.params;
          if (callBackListStatementLine) {
            callBackListStatementLine();
          }
          this._goBackToListDetailStatement()
        } else {
          showAlert(TYPE.ERROR, 'Thông báo', 'Kiểm tra lại kết nối');
        }
      }

    } catch (error) {
      showAlert(TYPE.ERROR, 'Thông báo', error);
    }
  }

  convertBoolToString = value => {
    if (value === true) {
      return 'Y';
    }
    return 'N';
  };


  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <StatusBar backgroundColor={R.colors.colorMain} />
          <View style={{ marginTop: HEIGHTXD(24) }}>
            <ItemGeneralInfoLine
              ref={this.generalInfoLineeRef}
              item={FakeData.THONG_TIN_CHUNG}
              dataStatementLine={this.state.dataStatementLine}
            />
          </View>
          <View style={{ marginTop: HEIGHTXD(24) }}>
            <ItemAccountant
              ref={this.accountanteRef}
              detail={true}
              rules={this.state.rules}
              department={this.state.department}
              market={this.state.market}
              onChangeRules={text => this.onChangeRules(text)}
              onChangeDepartment={text => this.onChangeDepartment(text)}
              onChangeMarket={text => this.onChangeMarket(text)}
              item={FakeData.THONG_TIN_QUAN_TRI}
            />
          </View>

          <View style={{ marginTop: HEIGHTXD(24) }}>
            <ItemBudget
              ref={this.budgeteRef}
              detail={true}
              rules={this.state.rules}
              department={this.state.department}
              market={this.state.market}
              onChangeRules={text => this.onChangeRules(text)}
              onChangeDepartment={text => this.onChangeDepartment(text)}
              onChangeMarket={text => this.onChangeMarket(text)}
              item={FakeData.THONG_TIN_QUAN_TRI}
              dataStatementLine={this.state.dataStatementLine}
            />
          </View>
          <View style={{ marginVertical: HEIGHTXD(24) }}>
            <ItemDifferentLine
              ref={this.differentLineeRef}
              item={FakeData.THONG_TIN_SO_TIEN}
              detail={true}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    cStatementId: state.statementRuducer.cStatementId,
    statusButtonCO: state.statementRuducer.statusButtonCO,
    keySearchStatementLine: state.statementRuducer.keySearchStatementLine,
    statusMenu: state.statementRuducer.statusMenu,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,

  };
}
export default connect(mapStateToProps, { setTypeOfIconStatementLine, setStatusCOStatement })(
  DetailStatementLine
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: R.colors.colorBackground,
    marginBottom: HEIGHTXD(200)
    // justifyContent: 'space-around',
    // position: 'relative'
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


