// @flow
import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import axios from 'axios'
import {
  HEIGHTXD,
  getFontXD,
  getWidth,
  WIDTHXD
} from '../../../config/Function';
import { NetworkSetting } from '../../../config/Setting';
import R from '../../../assets/R';
import NavigationService from '../../../routers/NavigationService';
import ModalPrint from '../../../common/PrintedStatement/index';
import HeaderForTabStatement from '../../../common/Header/HeaderForTabStatement';
import GeneralInfo from './GeneralInfo';
import DetailedInfo from './DetailedInfo';
import { showAlert, TYPE } from '../../../common/DropdownAlert';
import ModalAttachment from '../../../common/FilePicker/ModalAttachment';
import {
  setKeySearchStatementLine,
  setStatusCOStatement,
  uploadFileAttackStatement
} from '../../../actions/statement';
// import Attackments from './Attackments';

import Attackments from '../DetailStatement/Attack/Attackments';
import BotomMenu from '../../AdvanceRequest/common/BottomMenu';
import { iconStatement } from '../../../config/constants';
import { coStatement, raStatement } from '../../../apis/Functions/statement';
import global from '../global';
import { DetailPrintInvoiceGroup } from 'routers/screenNames';
import { TABLE_STATEMENT_ID, TABLE_STATEMENT_ID_2 } from '../../../config/constants'
import moment from 'moment'
import { showLoading, hideLoading } from '../../../common/Loading/LoadingModal'

const renderLabel = ({ route, focused }) => (
  <View
    style={{
      marginBottom: HEIGHTXD(30),
      marginTop: HEIGHTXD(60),
      width: WIDTHXD(374)
    }}
  >
    <Text style={[focused ? styles.activeTabTextColor : styles.tabTextColor]}>
      {route.title}
    </Text>
  </View>
);

const renderTabBar = props => (
  <LinearGradient colors={R.colors.colorHeaderGradienMenuTab}>
    <TabBar
      {...props}
      indicatorStyle={styles.indicatorStyle}
      style={styles.tabStyle}
      renderLabel={renderLabel}
    />
  </LinearGradient>
);

class TabAddStatement extends Component {
  generalInfo = React.createRef();

  detailedInfo = React.createRef();

  generalInfo;

  state = {
    index: 0,
    routes: [
      { key: 1, title: 'Thông tin chung' },
      { key: 2, title: 'Thông tin chi tiết' },
      { key: 3, title: 'Đính kèm' }
    ],
    loading: true,
    cStatementId: null,
    cDocumentSignId: null,
    itemStatementNew: {},
    search: '',
    isShowBtnSearch: false,
    isSearch: false,
    isSwipeEnabled: false,
    isActiveSave: true,
    isActiveCo: false,
    isActivePrint: false,
    isActiveAttack: false,
    isActiveSubmit: false
  };

  componentDidMount() {
    this.props.setStatusCOStatement(true);
    setTimeout(() => {
      this.setState({ loading: false });
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cStatementId !== this.props.cStatementId) {
      this.setState({
        cStatementId: nextProps.cStatementId
      })
    }
  }

  onChangeStatementId = id => {
    this.setState({ cStatementId: id });
  };

  onSetItemStatementNew = item => {
    this.setState({ itemStatementNew: item });
  };

  onChangeSearch = text => {
    this.props.setKeySearchStatementLine(text);
    this.setState({ search: text });
  };

  _renderScene = ({ route }: Object) => {
    let idInvoice = this.props.navigation.getParam('idInvoice');
    const { callBackListStatement } = this.props.navigation.state.params;
    switch (route.key) {
      case 1: {
        return (
          <GeneralInfo
            callBackListStatement={callBackListStatement}
            setIsSwipeEnabled={this.setIsSwipeEnabled}
            setIsShowBtnSearch={this.setIsShowBtnSearch}
            onChangeStatusMenuBottom={this.onChangeStatusMenuBottom}
            nextToDetail={() => {
              this.setState({ index: 1 });
            }}
            onSetItemStatementNew={this.onSetItemStatementNew}
            onChangeStatementId={this.onChangeStatementId}
            ref={this.generalInfo}
          />
        );
      }
      case 2:
        return (
          <DetailedInfo
            screenProps={this.setIsShowBtnSearch}
            cStatementId={this.state.cStatementId}
            ref={this.detailedInfo}
            idInvoice={idInvoice}
          />
        );
      case 3:
        return <Attackments />;
      default:
        return null;
    }
  };


  onBack = () => { };

  onChangeSearch = text => {
    this.props.setKeySearchStatementLine(text);
    this.setState({ search: text });
  };

  setIsSearch = isSearch => {
    this.setState({ isSearch });
  };

  setIsShowBtnSearch = isShowBtnSearch => {
    this.setState({ isShowBtnSearch });
  };

  setIsSwipeEnabled = isSwipeEnabled => {
    this.setState({ isSwipeEnabled });
  };

  onSubmitBottomTab = async indexBottom => {
    const {
      isActiveSave,
      isActiveCo,
      isActivePrint,
      isActiveAttack,
      isActiveSubmit
    } = this.state;
    switch (indexBottom) {
      case 0: {
        if (!isActiveSave) return;
        if (this.state.index === 0) {
          global.onSumitAddGeneralInfo();
        } else {
          if (this.state.index === 1) {
            if (this.props.typeOfIconTabStatement == 1) {
              global.onSumitDetailGeneralInfoLine();
            }
            if (this.props.typeOfIconTabStatement == 2) {
              global.onSumitAddGeneralInfoLine();
            }
          }
        }
        break;
      }
      case 1:
      case 2: {
        this.onSumitStatusStatement();
        break;
      }
      case 3: {
        if (isActiveAttack) {
          this._refModalAttackment.show();
          this.setState({ index: 2 })
        }
        break;
      }

      case 4: {
        if (this.state.cDocumentSignId) {
          NavigationService.navigate('CreateVOffice', { cDocumentsignId: this.state.cDocumentSignId, refreshData: () => { } })
        } else {
          this._createVOffice()
        }
        break

      }

      case 5: {
        if (!isActiveSubmit) return;
        this._refModalPrint.setModalVisible(true);
        break;
      }
      default: {
      }
    }
    // this.setState({ index });
  };

  /**
   * create vOffice
   */
  _createVOffice = async () => {
    showLoading()
    let res = null;
    const url = NetworkSetting.ROOT.concat(`/erp-service-mobile/cDocumentsignServiceRest/attachFile/1/${this.props.adUserId}/${this.props.adUserId}/${TABLE_STATEMENT_ID_2}/${this.state.cStatementId}/`)
    console.log('url', url)
    try {
      res = await axios.post(url)
    } catch (error) {
      console.log('ERROR---', error)
      //
    }
    hideLoading()
    console.log('RES-----', res)
    console.log('')
    if (res && res.status === 200) {
      this.setState({
        cDocumentSignId: res.data.cDocumentsignId,
      })
      NavigationService.navigate('CreateVOffice', { cDocumentsignId: res.data.cDocumentsignId, refreshData: () => { } })
    } else {
      showAlert(TYPE.ERROR, 'Thông báo', 'Trình ký thất bại')
    }
    return res
  }

  _onCapturePhoto = (response) => {
    this._uploadFile(response)
  }

  _onChooseFile = (response) => {
    this._uploadFile(response)
  }

  _onChoosePhoto = response => {
    this._uploadFile(response)
  }

  _uploadFile = response => {
    if (response) {
      const url = NetworkSetting.ROOT
        .concat(`/erp-service/adAttachmentServiceRest/attachFile/1000077/${this.props.cStatementId}/1/${this.props.adUserId}/${this.props.adUserId}`)
      const formData = new FormData()
      if (typeof (response) === 'object' && response.length >= 0) {
        response.map(item => formData.append('attachments', item))
      } else {
        formData.append('attachments', response)
      }
      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (res.data.returnMessage === 'Upload file thành công') {
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Tải lên file thành công')
          this.props.uploadFileAttackStatement()
        } else {
          showAlert(TYPE.WARN, 'Thông báo', res.data.returnMessage)
        }
      }).catch(err => {
        showAlert(TYPE.ERROR, 'Thông báo', 'Upload file thất bại')
      })
    }
  }

  onSumitStatusStatement = async () => {
    if (this.props.cStatementId) {
      const { callBackListStatement } = this.props.navigation.state.params;
      // cControlDepartmentId

      if (!this.props.statusButtonCO) {
        // const response = await raStatement(this.props.cStatementId);
        // if (response && response.status === 200) {
        //   this.props.setStatusCOStatement(true);
        //   callBackListStatement();
        //   this.onChangeStatusMenuBottom(true);
        //   showAlert(TYPE.SUCCESS, 'Thông báo', 'RA thành công');
        // } else {
        //   showAlert(TYPE.WARN, 'Thông báo', 'Kiểm tra lại kết nối');
        // }
        this._RAStatement()
      } else {
        if (!this.state.isActiveCo) return;
        // const response = await coStatement(this.props.cStatementId);
        // if (response && response.status === 200) {
        //   this.props.setStatusCOStatement(false);
        //   this.onChangeStatusMenuBottom(false);
        //   callBackListStatement();
        //   showAlert(TYPE.SUCCESS, 'Thông báo', 'CO thành công');
        // } else {
        //   showAlert(TYPE.WARN, 'Thông báo', 'Chưa có thông tin chi tiết');
        // }
        this._COStatement()
      }
    } else {
      if (!this.state.isActiveCo) return;
      showAlert(TYPE.WARN, 'Thông báo', 'Chưa có tờ trình');
    }
  };

  _COStatement = async () => {
    const { callBackListStatement } = this.props.navigation.state.params;
    try {
      const body = {
        ad_table_id: TABLE_STATEMENT_ID_2,
        record_id: this.props.cStatementId,
        ad_org_id: this.props.adOrgId,
        c_dept_id: this.props.adUserDepartmentId,
        updatedby: this.props.adUserId
      }

      console.log('bodyCO', body)
      const response = await coStatement(body);
      if (response.status === 200) {
        if (response.data.returnMessage) {
          showAlert(TYPE.ERROR, 'Thông báo', response.data.returnMessage)
        } else {
          this.props.setStatusCOStatement(false);
          callBackListStatement();
          this.onChangeStatusMenuBottom(false)
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Hoàn thành tờ trình thành công')
        }
      } else {
        showAlert(TYPE.ERROR, 'CO thất bại', response.data.returnMessage)
      }
    } catch (err) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Hoàn thành tờ trình thất bại')
    }
  }
  _RAStatement = async () => {
    const { callBackListStatement } = this.props.navigation.state.params;
    try {
      const body = {
        ad_table_id: TABLE_STATEMENT_ID_2,
        record_id: this.props.cStatementId,
        ad_org_id: this.props.adOrgId,
        c_dept_id: this.props.adUserDepartmentId,
        updatedby: this.props.adUserId,
        dateAcct: moment(new Date()).format('DD/MM/YYYY'),
        ad_window_id: 100000,
        orgLevel: 2

      }
      console.log('bodyRA', body)
      const response = await raStatement(body);

      if (response.status === 200) {
        if (response.data.returnMessage) {
          showAlert(TYPE.ERROR, 'RA thất bại', response.data.returnMessage)
        } else {
          this.props.setStatusCOStatement(true);
          callBackListStatement();
          showAlert(TYPE.SUCCESS, 'Thông báo', 'RA thành công');
          this.onChangeStatusMenuBottom(true)
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Hủy hoàn thành tờ trình thành công')
        }
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Hủy hoàn thành tờ trình thất bại')
      }

    } catch (err) {
      showAlert(TYPE.ERROR, 'Thông báo', 'Huỷ hoàn thành tờ trình thất bại')
    }
  }

  _accept = (url, title, fileName) => {
    NavigationService.navigate(DetailPrintInvoiceGroup, { id: this.props.cStatementId, url, title, fileName, setDocumentSignId: (id) => { this.setState({ cDocumentSignId: id }) }, adTableId: TABLE_STATEMENT_ID_2 })
  };

  onChangeStatusMenuBottom = statusButtonCO => {
    if (statusButtonCO) {
      this.setState({
        isActiveSave: true,
        isActiveCo: true,
        isActivePrint: true,
        isActiveAttack: true,
        isActiveSubmit: true
      });
    } else {
      this.setState({
        isActiveSave: false,
        isActiveCo: true,
        isActivePrint: true,
        isActiveAttack: false,
        isActiveSubmit: true
      });
    }
  };

  render() {
    const {
      itemStatementNew,
      search,
      isShowBtnSearch,
      isSearch,
      index,
      isSwipeEnabled,
      isActiveSave,
      isActiveCo,
      isActivePrint,
      isActiveAttack,
      isActiveSubmit
    } = this.state;

    if (this.state.loading) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <HeaderForTabStatement
            setIsShowBtnSearch={this.setIsShowBtnSearch}
            onButtonSearch={() => {
              this.setIsSearch(true);
            }}
            onBackSatement="ádasdasd"
            itemStatementNew={itemStatementNew}
            title="Tờ trình"
            onPressLeft={() => NavigationService.pop()}
            onPressRight={() => { }}
            indexOfTab={index}
            typeOfIconTabStatement={this.props.typeOfIconTabStatement}
            indexOfTab={this.state.index}
            isShowBtnSearch={isShowBtnSearch}
            isSearch={isSearch}
          />
          <View>
            <ActivityIndicator animating color="#1C1C1C" size="large" />
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={R.colors.colorWhite} />
        <HeaderForTabStatement
          title="Tờ trình"
          onPressLeft={() => NavigationService.pop()}
          onPressRight={() => { }}
          typeOfIconTabStatement={this.props.typeOfIconTabStatement}
          onChangeSearch={this.onChangeSearch}
          search={search}
          indexOfTab={index}
          isShowBtnSearch={isShowBtnSearch}
          setIsShowBtnSearch={this.setIsShowBtnSearch}
          isSearch={isSearch}
          onButtonSearch={() => {
            this.setIsSearch(true);
          }}
        />
        <TabView
          renderTabBar={renderTabBar}
          navigationState={this.state}
          renderScene={this._renderScene}
          swipeEnabled={isSwipeEnabled}
          onIndexChange={index => {
            if (this.props.cStatementId === 0) {
              // this.setState({ isShowBtnSearch: index ===1? true: false, index })
              showAlert(TYPE.WARN, 'Thông báo', 'ban chưa tạo thông tin chung');
              return;
            }
            this.setState({
              isShowBtnSearch: index === 1,
              isSwipeEnabled: index !== 2,
              index
            });
          }}
          initialLayout={{ width: getWidth() }}
        />
        {index === 1 && this.props.typeOfIconTabStatement === 0 ? null : (
          <BotomMenu
            onPress={this.onSubmitBottomTab}
            icons={iconStatement}
            activeMenu={1}
            isActiveSave={isActiveSave}
            isActiveCo={isActiveCo}
            isActiveRa={true}
            isActivePrint={isActivePrint}
            isActiveAttack={isActiveAttack}
            isActiveSubmit={isActiveSubmit}
            isRa={!this.props.statusButtonCO}
          />
          // isActiveSave,
          // isActiveCo,
          // isActivePrint,
          // isActiveAttack,
          // isActiveSubmit
        )}
        <ModalPrint
          ref={ref => {
            this._refModalPrint = ref;
          }}
          accept={this._accept}
        />
        <ModalAttachment
          onCapturePhoto={this._onCapturePhoto}
          onChoosePhoto={this._onChoosePhoto}
          onChooseFile={this._onChooseFile}
          ref={ref => {
            this._refModalAttackment = ref;
          }}
        />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    cStatementId: state.statementRuducer.cStatementId,
    statusButtonCO: state.statementRuducer.statusButtonCO,
    typeOfIconTabStatement: state.statementRuducer.typeOfIconTabStatement,
    adUserId: state.userReducers.userData.loggedIn.adUserId,
    adOrgId: state.userReducers.userData.loggedIn.adOrgId,
    adUserDepartmentId: state.userReducers.userData.loggedIn.adUserDepartmentId,
  };
}
export default connect(mapStateToProps, {
  setKeySearchStatementLine,
  setStatusCOStatement,
  uploadFileAttackStatement
})(TabAddStatement);

const styles = StyleSheet.create({
  activeTabTextColor: {
    color: R.colors.white,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    textAlign: 'center',
    opacity: 1
  },
  tabTextColor: {
    color: R.colors.white,
    opacity: 1,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    textAlign: 'center'
  },
  tabStyle: {
    backgroundColor: 'transparent',
    elevation: 0,
    padding: 0,
    // height: HEIGHTXD(300) * 0.6,
  },
  indicatorStyle: {
    backgroundColor: R.colors.white,
    height: HEIGHTXD(12)
  }
});
