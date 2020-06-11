import React, { PureComponent } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import R from 'assets/R';
import i18n from 'assets/languages/i18n';
import axios from 'axios';

import ModalAttachment from 'common/FilePicker/ModalAttachment';
import FlatListSwipe from 'common/Swipe/FlatListSwipe';
import BottomMenu from '../../../VOffice/CreateVOffice/GeneralInfor/ItemViews/BottomMenu';
import { WIDTHXD, convertTypeFile } from '../../../../config';
import ItemAttachment from '../../../Invoice/CreateInvoice/Attachment/Item';
// import { dataAttach } from './dataAttach'
import partner from 'apis/Functions/partner';
import { connect } from 'react-redux';
import { PostData } from '../../../../apis/helpers';
import { showAlert, TYPE } from 'common/DropdownAlert';
import Confirm from 'common/ModalConfirm/Confirm';
import global from '../global';

class ListAttachment extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      reRender: true,
      data: [],
      selectedIndex: 0,
    }
    // this.dataAttach = dataAttach;
  }

  menu = [
    {
      name: i18n.t('SAVE_T'),
      iconName: R.images.invoice.save,
      enable: false,
    },
    {
      name: i18n.t('ATTACK_T'),
      iconName: R.images.invoice.attach,
      enable: true,
    },
  ]

  componentDidMount() {
    // fetch data
    // http://222.252.22.174:8080/erp-service/adAttachmentServiceRest/adAttachment/search
    this.props.screenProps.setRefreshAttachmentList(() => this.fetch());
    this.fetch();
    global.showAttachModal = () => this.fileModal && this.fileModal.show();
  }

  fetch = async () => {
    try {
      const disabled = this.props.screenProps.disabled;
      console.log('disable edit partner', disabled);
      if (!this.props.screenProps.idPartner) {
        console.log('cancel fetch attactment because idPartner is ', this.props.screenProps.idPartner);
        // this.menu[0].enable = false;
        this.menu[1].enable = false;
        this.reRender();
        return;
      }
      // this.menu[0].enable = !disabled;
      this.menu[1].enable = !disabled;
      this.reRender();
      // console.log(this.props.idPartner)
      const response = await partner.getListAttachment(this.props.screenProps.idPartner);
      // console.log('list file', response);
      if (response.data) this.setState({ data: response.data });
    } catch (error) {
      console.log(error);
    }
  }

  reRender = () => this.setState({ reRender: !this.state.reRender });

  _onDel = async (_, indexOfItem) => {
    // request remove attachment from partner
    try {
      const response = await partner.removeAttachmment(this.state.data[indexOfItem].adAttachmentId);
      // console.log(response)

      // server not support return code to check success, fixed by message
      if (response && response.data.returnMessage.includes('Xóa file thành công')) {
        showAlert(TYPE.SUCCESS, 'Thông báo', response.data.returnMessage);
        this.fetch();
      } else if (response.data.returnMessage) {
        showAlert(TYPE.ERROR, 'Thông báo', response.returnMessage);
      } else throw Error('empty return message')
    } catch (error) {
      console.log(error)
      showAlert(TYPE.ERROR, 'Thông báo', 'Xoá file không thành công');
    }
    // this.dataAttach.splice(indexDel, 1);
    this.setState({ reRender: !this.state.reRender })
  }

  _onChangeBottomMenu = (index) => {
    if (index === 1) {
      this.fileModal && this.fileModal.show();
    }
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
      const response = await axios.post(`http://222.252.22.174:8080/erp-service/adAttachmentServiceRest/attachFile/1001834/${this.props.screenProps.idPartner}/1/${user_id}/${user_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // server not support return code to check success, fixed by message
      if (response && response.data.returnMessage.includes('Upload file thành công')) {
        showAlert(TYPE.SUCCESS, 'Thông báo', response.data.returnMessage);
        this.fetch();
      } else if (response.data.returnMessage) {
        showAlert(TYPE.ERROR, 'Thông báo', response.returnMessage);
      } else throw Error('empty return message')
    } catch (error) {
      console.log(error)
      showAlert(TYPE.ERROR, 'Thông báo', 'Upload file không thành công');
    }
  }

  pressItemAttach = (item) => {
    this.props.navigation.navigate('AttachmentInfo', { dataItem: item });
    this.props.screenProps.onAttachmentTabChange(1);
  }

  render() {
    // console.log(this.props.isFocus)
    let List = FlatListSwipe;

    return (
      <View style={styles.container}>
        <List
          data={this.state.data}
          renderItem={({ item, index }) => (
            <ItemAttachment
              title={item.filename}
              index={index}
              type={convertTypeFile(item.filename)}
              onPressIcon={this._onDel}
              pressItemAttach={() => this.pressItemAttach(item)}
            />)}
          onRefresh={this.fetch}
          refreshing={false}
          keyExtractor={(item, index) => `attach-${index}`}
          onPressIcon={(indexOfIcon, indexOfItem) => {
            this.setState({ selectedIndex: indexOfItem });
            this.ConfirmPopup.setModalVisible(true);
          }}
          listIcons={[R.images.iconDelete]}
          widthListIcon={WIDTHXD(129)}
          rightOfList={WIDTHXD(30)}
          styleOfIcon={{}}
        />
        <BottomMenu
          menu={this.menu}
          onChange={this._onChangeBottomMenu}
        />
        <Confirm
          ref={ref => { this.ConfirmPopup = ref }}
          title="Bạn có muốn xoá file đính kèm này không?"
          titleLeft="HUỶ BỎ"
          titleRight="ĐỒNG Ý"
          onPressLeft={() => {

          }}
          onPressRight={() => {
            this._onDel(null, this.state.selectedIndex);
          }}
        />
        <ModalAttachment
          onCapturePhoto={this.onCapturePhoto}
          onChoosePhoto={this.onChoosePhoto}
          onChooseFile={this.onChooseFile}
          ref={ref => this.fileModal = ref} />
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    userData: state.userReducers.userData
  }
}
export default connect(mapStateToProps, {})(ListAttachment);
const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  },
});
