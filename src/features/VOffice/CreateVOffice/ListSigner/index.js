import React, { PureComponent } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import R from 'assets/R';
import i18n from 'assets/languages/i18n';
import FlatListSwipe from 'common/Swipe/FlatListSwipe';
import { WIDTHXD, HEIGHTXD, NetworkSetting } from '../../../../config';
import ItemSigner from './Item';
import AddSigner from './Add'
import BottomMenu from '../GeneralInfor/ItemViews/BottomMenu';
import ModalAttachment from '../../../../common/FilePicker/ModalAttachment';
import { addSignFile } from '../VOfficeFile/ListFile';
import ButtonAdd from '../../../../common/Button/ButtonAdd';
import global from '../../global';
import { showAlert, TYPE } from 'common/DropdownAlert';
import { showLoading, hideLoading } from 'common/Loading/LoadingModal';
import { PostData, GetData, DelData } from 'apis/helpers';
import Confirm from 'common/ModalConfirm/Confirm';

export default class ListSigner extends PureComponent {
  newSigner = null;

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
      enable: false,
    },
    {
      name: i18n.t('ATTACK_T'),
      iconName: R.images.voffice.attach,
      enable: true
    },
  ]

  componentDidMount() {
    global.setListUserSignMode = (flag = false) => {
      this.setState({ listMode: flag });
      global.isAddingUserSign = !flag;
    }

    this.refresh();

    // update menu
    const { isEdit, viewOnly } = this.props;
    this.menu[0].enable = isEdit && !viewOnly;
    this.menu[2].enable = isEdit && !viewOnly;
  }

  refresh = async () => {
    const data = await this.fetch();
    this.setState({ data });
  }

  fetch = async () => {
    try {
      const response = await GetData(`${NetworkSetting.ROOT}/erp-service-mobile/cSigninfomationServiceRest/cSignInfomation/${this.props.cDocumentsignId}`);
      if (!response.data || response.data.length < 1) return [];
      console.log(response.data)
      return response.data;
    } catch (error) {
      return [];
    }
  }

  onAddSingerPress = () => {
    this.setState({ listMode: !this.state.listMode });
    global.isAddingUserSign = true;
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

  verifySaveSigner = async () => {
    const signer = this.newSigner;
    if (signer === null) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng nhập đầy đủ các thông tin.');
      return;
    }
    if (!signer.cSignerId) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng chọn người ký.');
      return;
    }
    if (!signer.cOfficepositionId) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng chọn vai trò ký.');
      return;
    }
    if (isNaN(signer.imagenote)) {
      showAlert(TYPE.WARN, 'Thông báo', 'Vui lòng nhập vị trí ký.');
      return;
    }

    try {
      showLoading();
      // console.log('props', this.props)
      signer.cDocumentsignId = this.props.cDocumentsignId;
      // console.log(JSON.stringify(signer))
      const response = await PostData(`${NetworkSetting.ROOT}/erp-service-mobile/cSigninfomationServiceRest/create/`, signer);
      // console.log(response);

      if (response && response.status === 200) {
        this.setState({ listMode: true });
        global.isAddingUserSign = false;
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Thêm người ký thành công.');
        this.refresh();
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Thêm người ký thất bại.');
      }
    } catch (error) {
      console.log(error);
      showAlert(TYPE.ERROR, 'Thông báo', 'Có lỗi xảy ra khi thêm người ký.');
    } finally {
      hideLoading();
    }
  }

  removeSigner = async () => {
    try {
      showLoading();
      const id = this.state.selectedId;
      const response = await DelData(`${NetworkSetting.ROOT}/erp-service-mobile/cSigninfomationServiceRest/cSigninfomation/${id}`);
      if (response && response.status === 200) {
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Xoá người ký thành công.');
        this.refresh();
      } else {
        showAlert(TYPE.ERROR, 'Thông báo', 'Có lỗi xảy ra khi xoá người ký.');
      }
    } catch (error) {
      console.log(error);
      showAlert(TYPE.ERROR, 'Thông báo', 'Có lỗi xảy ra khi xoá người ký.');
    } finally {
      hideLoading();
    }
  }

  _onChangeBottomMenu = (index) => {
    if (index === 0) {
      if (this.state.listMode) {
        // save voffice
      } else {
        this.verifySaveSigner();
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
    let maxLineNo = 0;
    data.map(x => maxLineNo = maxLineNo < x.lineno ? x.lineno : maxLineNo);

    let List = this.props.tabIndex === 2 ? FlatListSwipe : FlatList;

    return (
      <View style={styles.container}>
        {this.state.listMode ? (<List
          data={this.state.data}
          onRefresh={() => this.refresh()}
          refreshing={false}
          renderItem={({ item, index }) => (
            <ItemSigner
              index={index}
              item={item}
              onPressIcon={() => { }}
            />)}
          onPressIcon={(indexOfIcon, indexOfItem) => {
            this.setState({ selectedId: data[indexOfItem].cSigninfomationId });
            this.ConfirmPopup.setModalVisible(true);
          }}
          listIcons={[R.images.iconDelete]}
          widthListIcon={WIDTHXD(140)}
          rightOfList={WIDTHXD(30)}
          styleOfIcon={{}}
        />) : (<AddSigner onDataChange={data => this.newSigner = data} maxLineNo={maxLineNo} />)}
        <BottomMenu
          menu={this.menu}
          onChange={this._onChangeBottomMenu}
        />
        {this.state.listMode && (<ButtonAdd
          onButton={this.onAddSingerPress}
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
          onPressRight={() => this.removeSigner()}
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
