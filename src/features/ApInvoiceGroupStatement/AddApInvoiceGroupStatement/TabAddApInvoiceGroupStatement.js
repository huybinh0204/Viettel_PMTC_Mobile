import React, { Component } from 'react';
import {
    KeyboardAvoidingView, Platform, StatusBar, SafeAreaView, Text,
    StyleSheet, View, Dimensions, ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TabView, TabBar } from 'react-native-tab-view';
import i18n from 'assets/languages/i18n';
import { HEIGHTXD, getFontXD, WIDTHXD } from '../../../config/Function';
import R from '../../../assets/R';
import NavigationService from '../../../routers/NavigationService';
import Header from '../header';
import GeneralInfo from './GeneralInfo/GeneralInfo';
import InvoiceInfo from './InvoiceInfo/InvoiceList';
import Attackments from './Attack/Attackments';
import PaymentInfo from './PaymentInfo/index';
import SigningInfo from './SigningInfo/SigningInfo';
import DetailPrint from '../Print/ViewPrint';
import global from '../global'
import BottomMenu from 'features/AdvanceRequest/common/BottomMenu';
import { connect } from 'react-redux';
import { showAlert, TYPE } from 'common/DropdownAlert';
import ApInvoiceGroupStatement from '../../../apis/Functions/apInvoiceGroupStatement'
import { createSession } from '../../../apis/Functions/users'

import { TABLE_INVOICE_GROUP_ID } from '../../../config/constants'
import moment from 'moment'
import ModalPrint from '../Print'
import ModalAttachment from 'common/FilePicker/ModalAttachment';
import axios from 'axios';
import { updateListInvoiceGroup, updateInvoiceGroupItem } from '../../../actions/invoiceGroup'
import { saveBeforeExit } from '../../../actions/advanceRequest'
import { DetailPrintInvoiceGroup } from 'routers/screenNames';



const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};

const icons = [
    {
        key: 'save',
        value: 'Lưu',
        active: require('../../../assets/images/menu/save.png'),
        disable: require('../../../assets/images/menu/saved.png'),
        press: require('../../../assets/images/menu/savep.png')
    },
    {
        key: 'co',
        value: 'CO',
        active: require('../../../assets/images/menu/co.png'),
        disable: require('../../../assets/images/menu/cod.png'),
        press: require('../../../assets/images/menu/cop.png')
    },
    {
        key: 'ra',
        value: 'RA',
        active: require('../../../assets/images/menu/ra.png'),
        disable: require('../../../assets/images/menu/rad.png'),
        press: require('../../../assets/images/menu/rap.png')
    },
    {
        key: 'attack',
        value: 'Đính kèm',
        active: require('../../../assets/images/menu/attack.png'),
        disable: require('../../../assets/images/menu/attackd.png'),
        press: require('../../../assets/images/menu/attackp.png')
    },
    {
        key: 'print',
        value: 'Phiếu in',
        active: require('../../../assets/images/menu/print.png'),
        disable: require('../../../assets/images/menu/printd.png'),
        press: require('../../../assets/images/menu/printp.png')
    },
]

const renderLabel = ({ route, focused }) => (
    <View style={{
        marginBottom: HEIGHTXD(32),
        width: WIDTHXD(374),
    }}
    >
        <Text
            style={[focused ? styles.activeTabTextColor : styles.tabTextColor]}
        >
            {route.title}
        </Text>
    </View>
)

const renderTabbar = props => (
    <LinearGradient
        colors={R.colors.colorHeaderGradienMenuTab}
        style={styles.tab}
    >
        <TabBar
            {...props}
            style={styles.tabStyle}
            renderLabel={renderLabel}
            scrollEnabled={true}
            indicatorStyle={styles.indicatorStyle}
        />
    </LinearGradient>)

class TabAddApInvoiceGroupStatement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            indexTmp: 0,
            icPressMenu: -1,
            isPressMenu: false,
            activeMenu: 1,
            indexIcon: global.SHOW_ICON_EYE,
            positionIconMenu: 0,
            changeIconPreview: false,
            isListInvoice: false,
            isListPayInfo: false,
            isListAttach: false,
            isOnlyViewInvoice: false,
            isToLineInfo: { detail: false, payInfo: false, approval: false },
            color: null,
            routes: [
                { key: 1, title: i18n.t('GENERAL_INFORMATION') },
                { key: 2, title: i18n.t('DETAIL_INVOICE') },
                { key: 3, title: i18n.t('ATTACK_T') },
                { key: 4, title: i18n.t('PAYMENT_INFORMATION') },
                { key: 5, title: i18n.t('SIGNING_INFORMATION') }
            ],
            loading: false,
            isCreateGeneral: false,
            data: {},
            listCurrency: [],
            scrollEnabled: true,
            swipeEnabled: false,
            apInvoiceGroupId: null,
            cDocumentSignId: null,
            isActiveSave: true,
            isActiveCo: false,
            isRa: false,
            isActiveAttack: false,
            isActivePrint: false,
            refreshAttackList: false,
            isCreatedByMe: true,
            attachmentTabIndex: 0,
            isReadOnly: false,
            isBackScreen: false,
            isSwitchTab: false,
            reloadInfo: false,
            isViewAttackInSigningInfo: false,
            subTitle: '',
            isViewPrint: false
        }

        global.goBackToListDetail = this.goBackToListDetail.bind(this)
    }


    componentDidMount() {
        if (this.props.navigation.state.params.id) {
            this.setState({ color: this.props.navigation.state.params.color, apInvoiceGroupId: this.props.navigation.state.params.id })
            this._getDetailItem(this.props.navigation.state.params.id);
        }
        this._isCreateGeneral();
        this.props.saveBeforeExit(true)
    }


    componentWillUnmount() {
        this.props.saveBeforeExit(false)
    }
    _isCreateGeneral = () => {
        if (this.props.navigation.state.params.id === 0) {
            this.setState({ isCreateGeneral: true, swipeEnabled: false, isActiveAttack: false, isActivePrint: false, isActiveCo: false })
        } else {
            this.setState({ isCreateGeneral: false, swipeEnabled: true, isActiveAttack: true })
        }
    }


    goBackToListDetail = () => {
        this.props.navigation.goBack()
    }

    _onPressMenu = (index) => {
        switch (index) {
            case 0:
                if (this.state.isActiveSave) {
                    this.setState({ icPressMenu: index, isPressMenu: !this.state.isPressMenu })
                }
                break
            case 1:
                if (this.state.isActiveCo) {
                    this._COInvoiceGroup()
                }
                break
            case 2:
                if (this.state.isRa) {
                    this._RAInvoiceGroup()
                }
                break
            case 3:
                if (this.state.isActiveAttack) {
                    if (this.state.index === 0) {
                        this._checkChangeContentSwitchTab(-1)
                    } else {
                        this.fileModal && this.fileModal.show();
                        this.setState({ index: 2 })
                    }
                }
                break
            case 4:
                if (this.state.isActivePrint) {
                    this._refModalPrint.setModalVisible(true);
                }
                break
        }
    }

    _getDetailItem = async (id) => {
        try {
            const response = await ApInvoiceGroupStatement.getItemApInvoiceGroup(id)
            if (response && response.status === 200) {
                // this.props.updateRequestAmount(response.data.requestAmount)
                global.DOCUMENT_TYPE_ID = response.data.cDocumentTypeId
                if (response.data.docstatus === 'CO') {
                    let isActivePrint
                    if (response.data.createdby === this.props.userData.adUserId) {
                        isActivePrint = response.data.cDocumentsignId ? false : true
                    } else {
                        isActivePrint = false
                    }
                    this.setState({ isRa: true, isActiveCo: false, isActiveSave: false, isActiveAttack: false, isActivePrint: isActivePrint, cDocumentSignId: response.data.cDocumentsignId })
                }
                let viewOnly = response.data.docstatus === 'CO' || response.data.createdby !== this.props.userData.adUserId;
                if (response.data.createdby === this.props.userData.adUserId) {
                    this.setState({ isCreatedByMe: true, data: response.data, isReadOnly: viewOnly, isOnlyViewInvoice: response.data.docstatus === 'CO'})
                } else {
                    this.setState({ isCreatedByMe: false, data: response.data, isReadOnly: viewOnly, isRa: false, isActiveCo: false, isActiveSave: false, isActiveAttack: false, isActivePrint: false, isOnlyViewInvoice : true })
                }

            }
        } catch (err) {
            showAlert(TYPE.INFO, 'Thông báo', 'Đã có lỗi xảy ra')
        }
    }

    _COInvoiceGroup = async () => {
        try {
            const body = {
                ad_table_id: TABLE_INVOICE_GROUP_ID,
                record_id: this.state.apInvoiceGroupId,
                ad_org_id: this.props.userData.adOrgId,
                c_dept_id: this.props.userData.adUserDepartmentId,
                updatedby: this.props.userData.adUserId
            }
            const response = await ApInvoiceGroupStatement.coInvoiceGroup(body);
            if (response.status === 200) {
                if (response.data.returnMessage) {
                    showAlert(TYPE.ERROR, 'CO thất bại', response.data.returnMessage)
                } else {
                    this.setState({ isActiveCo: false, isRa: true, isActiveAttack: false, isActiveSave: false, isReadOnly: true, isActivePrint: true, reloadInfo: !this.state.reloadInfo })
                    this.props.updateInvoiceGroupItem()
                    showAlert(TYPE.SUCCESS, 'Thông báo', 'Hoàn thành bảng tổng hợp thanh toán thành công')
                }
            } else {
                showAlert(TYPE.ERROR, 'CO thất bại', response.data.returnMessage)
            }
        } catch (err) {
            showAlert(TYPE.ERROR, 'Thông báo', 'Hoàn thành bảng tổng hợp thanh toán thất bại')
        }
    }
    _RAInvoiceGroup = async () => {
        try {
            let bodyCreateSession = {
                userName: this.props.userData.userName,
                userId: this.props.userData.adUserId,
                roleId: this.props.userData.roleId,
                orgIdList: [this.props.userData.adOrgId],
                departmentIdList: [this.props.userData.adUserDepartmentId]
            }
            const responseCreateSession = await createSession(bodyCreateSession);
            const body = {
                ad_table_id: TABLE_INVOICE_GROUP_ID,
                record_id: this.state.apInvoiceGroupId,
                ad_org_id: this.props.userData.adOrgId,
                c_dept_id: this.props.userData.adUserDepartmentId,
                updatedby: this.props.userData.adUserId,
                dateAcct: this.state.data.accountingDate,
                ad_window_id: 100000,
                orgLevel: 2

            }

            const response = await ApInvoiceGroupStatement.raInvoiceGroup(body);

            if (response.status === 200) {
                if (response.data.returnMessage) {
                    showAlert(TYPE.ERROR, 'RA thất bại', response.data.returnMessage)
                } else {
                    this.setState({ isActiveCo: true, isRa: false, isActiveAttack: true, isActiveSave: true, isReadOnly: false, isActivePrint: false, reloadInfo: !this.state.reloadInfo })
                    this.props.updateInvoiceGroupItem()
                    showAlert(TYPE.SUCCESS, 'Thông báo', 'Hủy hoàn thành bảng tổng hợp thanh toán thành công')
                }
            } else {
                showAlert(TYPE.ERROR, 'Thông báo', 'Hủy hoàn thành bảng tổng hợp thanh toán thất bại')
            }

        } catch (err) {
            showAlert(TYPE.ERROR, 'Thông báo', 'Huỷ hoàn thành bảng tổng hợp thanh toán thất bại')
        }
    }


    returnData = (activeMenu, positionIconMenu) => {
        this.setState({ activeMenu, positionIconMenu })
    }

    returnDataAttach = (activeMenu, indexIcon) => {
        console.log('POSITION MENU', indexIcon)
        this.setState({ isListAttach: true })
        this.setState({ activeMenu, positionIconMenu })
    }

    returnDataPayInfo = (returnData) => {
        this.setState({ isListPayInfo: true, activeMenu: returnData.activeMenu, indexIcon: returnData.indexIcon })
    }


    setId = (id) => {
        let { data } = this.state
        data.apInvoiceGroupId = id
        this.setState({ data, swipeEnabled: true, isActiveAttack: true, apInvoiceGroupId: id })
    }

    setDocumentSignId = (id) => {
        this.setState({
            cDocumentSignId: id
        })
    }

    returnExpanded = () => {
        this.setState({ changeIconPreview: !this.state.changeIconPreview })
    }

    goToDetailInfo = (name) => {
        let { isToLineInfo } = this.state
    }

    _setCOActive = (isActiveCo) => {
        if (this.state.isCreatedByMe && this.state.data.docstatus !== 'CO') {
            this.setState({
                isActiveCo: isActiveCo,
            })
        }
    }

    _reloadInfo = () => {
        this.setState({
            reloadInfo: !this.state.reloadInfo
        })
        this.props.updateInvoiceGroupItem()
    }

    _onUpdateTitle = (title) => {
        this.setState({
            isViewPrint: true,
            subTitle: title
        })
    }

    _renderScene = ({ route }: Object) => {
        let id = this.props.navigation.state.params.id ? this.props.navigation.state.params.id : 0
        let { cBpartnerId, documentNo, cDocumentTypeId, description } = this.state.data
        let { isPressMenu, icPressMenu, index, color, refreshAttackList } = this.state;
        switch (route.key) {
            case 1:
                return <GeneralInfo
                    onCreateSuccess={() => this.setState({ swipeEnabled: true, isCreateGeneral: false })}
                    isPressMenu={isPressMenu}
                    icPressMenu={icPressMenu}
                    value={this.state.data}
                    tabActive={index}
                    isCreate={this.state.isCreateGeneral}
                    nextToLine={() => this.setState({ index: 1, indexIcon: global.SHOW_ICON_SEARCHKEY, activeMenu: global.HIDE_BOTTOM_MENU })}
                    setId={this.setId}
                    id={id}
                    isReadOnly={this.state.isReadOnly}
                    returnExpanded={this.returnExpanded}
                    isBackScreen={this.state.isBackScreen}
                    isSwitchTab={this.state.isSwitchTab}
                    reloadInfo={this.state.reloadInfo}
                    goToTab={() => this._changeTab()}

                />
            case 2:
                return <InvoiceInfo
                    screenProps={{
                        id: this.state.apInvoiceGroupId,
                        isOnlyViewInvoice: this.state.isOnlyViewInvoice,
                        reloadInfo: this._reloadInfo,
                        isReadOnly: this.state.isReadOnly,
                        setCOActive: this._setCOActive,
                        cBpartnerId, isPressMenu, icPressMenu, tabActive: index, color, returnData: this.returnData, goToDetailInfo: this.goToDetailInfo
                    }}
                />
            case 3:
                if (this.state.cDocumentSignId) {
                    return <DetailPrint
                        id={this.state.apInvoiceGroupId}
                        cDocumentSignId={this.state.cDocumentSignId}
                        isViewDocumentSign={true}
                        onUpdateTitle={(title) => this._onUpdateTitle(title)}
                        adTableId={TABLE_INVOICE_GROUP_ID}
                    />
                } else {
                    return <Attackments
                        screenProps={{
                            id: this.state.apInvoiceGroupId,
                            isReadOnly: this.state.isReadOnly,
                            isPressMenu, icPressMenu, tabActive: index, color, refreshAttackList,
                            onAttachmentTabChange: (attachmentTabIndex, subTitle) => this.setState({ attachmentTabIndex, subTitle })
                        }}

                    />
                }
            case 4:
                return <PaymentInfo
                    screenProps={{ id: this.state.apInvoiceGroupId, documentNo, cDocumentTypeId, description, returnData: this.returnDataPayInfo }}
                />

            case 5:
                return <SigningInfo
                    screenProps={{
                        id: this.state.apInvoiceGroupId,
                        onViewAttackInSigningInfo: (isViewAttackInSigningInfo, subTitle) => this.setState({ isViewAttackInSigningInfo, subTitle })
                    }}
                />

            default:
                return null;
        }
    };

    _closeScene = (index) => {
        if (this.state.isListAttach) {
            global.goBackToListListAttackFile()
        } if (this.state.isListPayInfo) {
            global.goBackToListPayInfo()
        }
    }

    _checkCloseInput = () => {
        if (this.props.inputSearch) {
            this.props.actionInputSearch(false)
        }
    }

    _accept = (url, title, fileName) => {
        NavigationService.navigate(DetailPrintInvoiceGroup, {
            id: this.state.apInvoiceGroupId, url, title, fileName, setDocumentSignId: (id) => {
                this.setState({
                    cDocumentSignId: id
                })
            }, adTableId: TABLE_INVOICE_GROUP_ID
        })
    }


    onCapturePhoto = (file) => {
        // upload photo
        this.upload(file);
    }

    onChoosePhoto = (file) => {
        // upload photo
        this.upload(file);
    }

    onChooseFile = (files) => {
        // upload file
        this.upload(files[0]);
    }

    upload = async (file) => {
        try {
            const user_id = this.props.userData.adUserId
            const formData = new FormData()
            formData.append('attachments', file);
            const response = await axios.post(`http://222.252.22.174:8080/erp-service/adAttachmentServiceRest/attachFile/${TABLE_INVOICE_GROUP_ID}/${this.state.apInvoiceGroupId}/1/${user_id}/${user_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            let url = `http://222.252.22.174:8080/erp-service/adAttachmentServiceRest/attachFile/${TABLE_INVOICE_GROUP_ID}/${this.state.apInvoiceGroupId}/1/${user_id}/${user_id}`
            // server not support return code to check success, fixed by message
            if (response && response.data.returnMessage.includes('Upload file thành công')) {
                showAlert(TYPE.SUCCESS, 'Thông báo', response.data.returnMessage);
                this.setState({ refreshAttackList: !this.state.refreshAttackList })
            } else if (response.data.returnMessage) {
                showAlert(TYPE.ERROR, 'Thông báo', response.returnMessage);
            } else throw Error('empty return message')
        } catch (error) {
            showAlert(TYPE.ERROR, 'Thông báo', 'Upload file không thành công');
        }
    }

    _checkChangeContent = () => {
        this.setState({ isBackScreen: !this.state.isBackScreen })
    }

    _checkChangeContentSwitchTab = (index) => {
        this.setState({ isSwitchTab: !this.state.isSwitchTab, indexTmp: index })
    }
    _setShowDoubleIcon = () => {
        this.setState({
            index: 3,
            indexIcon: global.SHOW_DOUBLE_ICON,
            activeMenu: global.HIDE_BOTTOM_MENU
        })
    }
    _changeTab = () => {
        let index = this.state.indexTmp
        if (index === -1) {
            index = 2
            this.fileModal && this.fileModal.show();
        }
        let indexIcon = 0
        let activeMenu = global.SHOW_BOTTOM_MENU
        if (index === 0) {
            this.setState({ index, indexIcon, activeMenu, swipeEnabled: true })
        } else if (index === 1) {
            indexIcon = global.HIDE_ICON
            activeMenu = global.HIDE_BOTTOM_MENU
            this.setState({ index, indexIcon, activeMenu, swipeEnabled: false })
            this._closeScene(index)
            this._checkCloseInput()
        } else {
            let swipeEnabled = true
            if (index === 2) {
                indexIcon = global.HIDE_ICON
                activeMenu = this.state.cDocumentSignId ? global.HIDE_BOTTOM_MENU : global.SHOW_BOTTOM_MENU
                swipeEnabled = false
            } else if (index === 3) {
                indexIcon = global.SHOW_DOUBLE_ICON
                activeMenu = global.HIDE_BOTTOM_MENU
            } else {
                indexIcon = global.HIDE_ICON
                activeMenu = global.HIDE_BOTTOM_MENU
            }
            this._closeScene(index)
            this._checkCloseInput()
            this.setState({ index, indexIcon, activeMenu, swipeEnabled })
        }
    }

    render() {
        let index = this.state.index
        if (this.state.loading) {
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <Header
                        title={i18n.t('APINVOICE_GROUP_STATEMENT_T')}
                        onPressLeft={() => NavigationService.pop()}
                        onPressRight={() => { }}
                    />
                    <View>
                        <ActivityIndicator animating color={R.colors.colorMain} size="small" />
                    </View>
                </SafeAreaView>
            )
        }
        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={WIDTHXD(-200)}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.container}>
                    <StatusBar backgroundColor={R.colors.colorWhite} />
                    <Header
                        tabActive={this.state.index}
                        indexIcon={this.state.indexIcon}
                        attachmentTabIndex={this.state.attachmentTabIndex}
                        isViewPrint={this.state.isViewPrint}
                        isViewAttackInSigningInfo={this.state.isViewAttackInSigningInfo}
                        setAttachmentTabIndex={(attachmentTabIndex) => this.setState({ attachmentTabIndex })}
                        setIsViewAttachmentInSigningInfo={(isViewAttackInSigningInfo) => this.setState({ isViewAttackInSigningInfo })}
                        title={i18n.t('APINVOICE_GROUP_STATEMENT_T')}
                        subTitle={this.state.subTitle}
                        colorTab={true}
                        onPressLeft={() => NavigationService.pop()}
                        onPressRight={() => { }}
                        changeIconPreview={this.state.changeIconPreview}
                        checkSave={() => this._checkChangeContent()}
                        setShowDoubleIcon={() => this._setShowDoubleIcon()}
                    />
                    <TabView
                        style={styles.container}
                        swipeEnabled={this.state.swipeEnabled}
                        renderTabBar={renderTabbar}
                        navigationState={this.state}
                        renderScene={this._renderScene}
                        onIndexChange={indexChange => {
                            if (this.state.isCreateGeneral) {
                                showAlert(TYPE.WARN, 'Thông báo', 'Bạn cần tạo thông tin chung để có thể tiếp tục')
                            } else {
                                if (index === 0) {
                                    this._checkChangeContentSwitchTab(indexChange)
                                } else {
                                    this.setState({ indexTmp: indexChange }, () =>
                                        this._changeTab())
                                }
                            }
                        }}
                        initialLayout={initialLayout}
                    />
                    {/* <View style={styles.bottomMenu}> */}
                    <BottomMenu
                        onPress={this._onPressMenu}
                        icons={icons}
                        activeMenu={this.state.activeMenu}
                        isActiveSave={this.state.isActiveSave}
                        isActiveCo={this.state.isActiveCo}
                        isActivePrint={this.state.isActivePrint}
                        isActiveAttack={this.state.isActiveAttack}
                        isRa={this.state.isRa}
                    />
                    {/* </View> */}
                </View>
                <ModalPrint
                    ref={ref => {
                        this._refModalPrint = ref;
                    }}
                    userId={this.props.userData.adUserId}
                    recordId={this.state.apInvoiceGroupId}
                    accept={this._accept}
                />
                <ModalAttachment
                    onCapturePhoto={this.onCapturePhoto}
                    onChoosePhoto={this.onChoosePhoto}
                    onChooseFile={this.onChooseFile}
                    ref={ref => this.fileModal = ref} />
            </KeyboardAvoidingView>
        );
    }
}


function mapStateToProps(state) {
    return {
        userData: state.userReducers.userData.loggedIn
    }
}

export default connect(mapStateToProps, { updateInvoiceGroupItem, saveBeforeExit })(TabAddApInvoiceGroupStatement);

const styles = StyleSheet.create({
    tabTextColor: {
        color: R.colors.white,
        opacity: 1,
        fontSize: getFontXD(42),
        fontFamily: R.fonts.RobotoRegular,
        textAlign: 'center',
    },
    textTab: {
        color: '#fff',
        fontSize: getFontXD(42),
        fontFamily: R.fonts.RobotoRegular
    },
    container: {
        flex: 1
    },
    activeTabTextColor: {
        color: R.colors.white,
        fontSize: getFontXD(42),
        fontFamily: R.fonts.RobotoRegular,
        textAlign: 'center',
        opacity: 1,
    },

    tabStyle: {
        elevation: 0,
        backgroundColor: 'transparent'
    },
    indicatorStyle: {
        backgroundColor: R.colors.white,
        height: HEIGHTXD(12)
    },
    bottomMenu: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'cyan',
        height: HEIGHTXD(200),
    },
});
