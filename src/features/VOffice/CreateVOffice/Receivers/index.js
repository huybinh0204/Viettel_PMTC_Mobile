import React, { PureComponent } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import R from 'assets/R';
import i18n from 'assets/languages/i18n';
import FlatListSwipe from 'common/Swipe/FlatListSwipe';
import { WIDTHXD, HEIGHTXD, NetworkSetting } from '../../../../config';
import ItemReceiver from './Item';
import BottomMenu from '../GeneralInfor/ItemViews/BottomMenu';
import ModalAttachment from '../../../../common/FilePicker/ModalAttachment';
import { addSignFile } from '../VOfficeFile/ListFile';
import ButtonAdd from '../../../../common/Button/ButtonAdd';
import global from '../../global';
import { showAlert, TYPE } from 'common/DropdownAlert';
import { showLoading, hideLoading } from 'common/Loading/LoadingModal';
import { PostData, GetData, DelData, PutData } from 'apis/helpers';
import Confirm from 'common/ModalConfirm/Confirm';

export default class Receiver extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      reRender: true,
      data: [],
      selectedId: null,
      listMode: true,
    }
  }

  menu = [
    {
      name: i18n.t('SAVE_T'),
      iconName: R.images.voffice.save,
      enable: true,
    },
    {
      name: 'CO',
      iconName: R.images.voffice.co,
      enable: true,
    },
    {
      name: i18n.t('ATTACK_T'),
      iconName: R.images.voffice.attach,
      enable: true
    },
  ]

  componentDidMount() {
    global.setListReceiverMode = (flag = false) => {
      this.setState({ listMode: flag });
      global.isAddingReceiver = !flag;
    }

    this.refresh();
  }

  refresh = async () => {
    const data = await this.fetch();
    this.setState({ data });
  }

  fetch = async () => {
    try {
      const response = await PostData(`${NetworkSetting.ROOT}/erp-service-mobile/cStaffsendRsServiceRest/getListByDocumentSignId/`, { cDocumentsignId: this.props.cDocumentsignId });
      if (!response.data || response.data.data.length < 1) return [];
      // console.log('ahihi', response)
      return response.data.data;
    } catch (error) {
      console.log(response.config)
      return [];
    }
  }

  onAddReceiverPress = () => {
    // this.setState({ listMode: !this.state.listMode });
    // global.isAddingReceiver = true;
    const data = this.state.data;
    const exists = this.state.data.filter(x => x.cStaffsendId ? false : true);
    const addShow = exists && exists.length > 0;
    if (!addShow) {
      this.setState({ data: [...data, { key: 'add' }] });
    }
  }

  onCapturePhoto = (file) => {
    // upload photo
    addSignFile(file, this.props.userData.adUserId, this.props.cDocumentsignId, nextLineNo(this.state.data), () => this.fetch());
  }

  onChoosePhoto = (file) => {
    // upload photo
    addSignFile(file, this.props.userData.adUserId, this.props.cDocumentsignId, nextLineNo(this.state.data), () => this.fetch());
  }

  onChooseFile = async (files) => {
    // upload file
    addSignFile(files[0], this.props.userData.adUserId, this.props.cDocumentsignId, nextLineNo(this.state.data), () => this.fetch());
  }

  removeReceiver = async () => {
    try {
      showLoading();
      const id = this.state.selectedId;
      const response = await DelData(`${NetworkSetting.ROOT}/erp-service-mobile/cStaffsendRsServiceRest/cStaffsend/${id}`);
      if (response && response.status === 200) {
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Xoá người nhận VB thành công.');
        this.refresh();
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Có lỗi xảy ra khi xoá người nhận VB.');
      }
    } catch (error) {
      console.log(error);
      showAlert(TYPE.ERROR, 'Thông báo', 'Có lỗi xảy ra khi xoá người nhận VB.');
    } finally {
      hideLoading();
    }
  }

  onChooseReceiver = async (item, lineno) => {
    // check if create or update by lineno
    const exists = this.state.data.filter(x => x.lineno === lineno);
    const isUpdate = exists && exists.length > 0;

    try {
      showLoading();

      const data = {
        lineno,// thứ tự
        cSignerId: item.id,//người nhận
        cSignerName: item.fullname,
        cDocumentsignId: this.props.cDocumentsignId//Id trình ký V-office
      }

      if (isUpdate) {
        data.cStaffsendId = exists[0].cStaffsendId;
        var response = await PutData(`${NetworkSetting.ROOT}/erp-service-mobile/cStaffsendRsServiceRest/update/`, data);
      } else {
        var response = await PostData(`${NetworkSetting.ROOT}/erp-service-mobile/cStaffsendRsServiceRest/create/`, data);
      }
      if (response && response.status === 200) {
        showAlert(TYPE.SUCCESS, 'Thông báo', `${isUpdate ? 'Cập nhật' : 'Thêm'} người nhận VB thành công.`);
        this.refresh();
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', `Có lỗi xảy ra khi ${isUpdate ? 'cập nhật' : 'thêm'} người nhận VB.`);
      }
    } catch (error) {
      console.log(error);
      showAlert(TYPE.ERROR, 'Thông báo', `Có lỗi xảy ra khi ${isUpdate ? 'cập nhật' : 'thêm'} người nhận VB.`);
    } finally {
      hideLoading();
    }
  }

  _onChangeBottomMenu = (index) => {
    if (index === 0) {
      if (this.state.listMode) {
        // save voffice
      } else {
        // this.verifySaveSigner();
      }
    }
    if (index === 2) {
      global.setTabIndex(1);
      setTimeout(() => {
        global.showAttachModal && global.showAttachModal();
      }, 700);
    }
  }

  render() {
    const { data } = this.state;
    let maxLineno = 0;
    if (data.length > 0) {
      data.map(x => maxLineno = (x.lineno > maxLineno) ? x.lineno : maxLineno);
    }
    let List = this.props.tabIndex === 3 ? FlatListSwipe : FlatList;

    return (
      <View style={styles.container}>
        <List
          data={this.state.data}
          onRefresh={() => this.refresh()}
          refreshing={false}
          renderItem={({ item, index }) => (
            <ItemReceiver
              index={index}
              item={item}
              maxLineno={maxLineno}
              onChoose={this.onChooseReceiver}
              onPressIcon={() => { }}
            />)}
          onPressIcon={(indexOfIcon, indexOfItem) => {
            this.setState({ selectedId: data[indexOfItem].cStaffsendId });
            this.ConfirmPopup.setModalVisible(true);
          }}
          listIcons={[R.images.iconDelete]}
          widthListIcon={WIDTHXD(140)}
          rightOfList={WIDTHXD(30)}
          styleOfIcon={{}}
        />
        <BottomMenu
          menu={this.menu}
          onChange={this._onChangeBottomMenu}
        />
        {this.state.listMode && (<ButtonAdd
          onButton={this.onAddReceiverPress}
          bottom={HEIGHTXD(280)}
        />)}
        <ModalAttachment
          onCapturePhoto={this.onCapturePhoto}
          onChoosePhoto={this.onChoosePhoto}
          onChooseFile={this.onChooseFile}
          ref={ref => this.fileModal = ref} />
        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title="Bạn có muốn xóa bản ghi này không?"
          titleLeft="HUỶ BỎ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => { }}
          onPressRight={() => this.removeReceiver()}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  },
});
