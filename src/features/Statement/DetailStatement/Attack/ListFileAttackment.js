import React, { PureComponent } from 'react';
import { View, StyleSheet, PermissionsAndroid } from 'react-native';
import R from 'assets/R';
import i18n from 'assets/languages/i18n';
import { connect } from 'react-redux';
import FlatListSwipe from 'common/Swipe/FlatListSwipe';
import RnFetchBlob from 'rn-fetch-blob'
// import BottomMenu from '../../common/BottomMenu';
import BottomMenu from '../../../Invoice/common/BottomMenu';
import BottomTabAdd from '../../ItemViews/BottomTabAdd';
import { WIDTHXD } from '../../../../config/Function';
import ItemAttachment from './Items/Item';
import { dataAttach } from '../../../Invoice/CreateInvoice/Attachment/dataAttach';
import {setTypeOfIconAttackInfo} from '../../../../actions/statement';
import { getListAttackFile, deleteAttackFile} from '../../../../apis/Functions/statement';
import {convertTypeFile} from "../../../../config"
import { showAlert, TYPE } from '../../../../common/DropdownAlert';
import { NetworkSetting } from '../../../../config/Setting';
import ItemTrong from '../../../../common/Item/ItemTrong';


class Attackments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      reRender: true,
      adTableId: 1000077,
      recordId: 926,
      isActive: "Y",
      isDeleted: "N",
      dataAttach:[],
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
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.uploadFileAttack !== this.props.uploadFileAttack) {
      this._getListAttack();
    }
  }
  
  componentDidMount()
  {
   this._getListAttack();
  }

  async _getListAttack(){
    const body = {      
      adTableId: this.state.adTableId,
      recordId: this.props.cStatementId,
      isActive: this.state.isActive,
      isDeleted: this.state.isDeleted,
    }
    const response = await getListAttackFile(body);
    
    if(response.status===200)
    {
      this.setState({dataAttach: response.data, loading: false})
    }
  }

  _onDel = async(indexs, indexDel, adAttachmentId) => {
    if(adAttachmentId)
    {
      const response = await deleteAttackFile([adAttachmentId]);
      if(response.status ===200)
      {
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Xoá thành công');
        let dataAttachTmp = this.state.dataAttach;
        dataAttachTmp.splice(indexDel, 1);
        this.setState({ dataAttach: dataAttachTmp });
      }
      else{
        showAlert(TYPE.WARN, 'Thông báo', 'Kiểm tra lại đường truyền');
      }
    }
  };

  _requestFileManagerPermission = async (item) => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Truy cập File',
            message: 'Phần Mềm Tài chính muốn truy cập vào trong bộ nhớ thiết bị của bạn',
            buttonPositive: 'OK',
            buttonNegative: 'Từ chối'
          }
        )
        console.log("_requestFileManagerPermission")
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this._downloadFile(item)
        } else {
          showAlert(TYPE.WARN, 'Thông báo', 'Không thể chọn file')
        }
      } catch (error) {
        showAlert(TYPE.ERROR, 'Thông báo', 'Có lỗi xảy ra1')
      }
    } else {
      this._downloadFile(item)
    }
  }

  _downloadFile = (item) => {
    const url = encodeURI(NetworkSetting.ROOT
      .concat(`/erp-service/adAttachmentServiceRest/downloadFile?condition={"filename": "${item.title}", "folder": "${item.folder}"}`))
    RnFetchBlob.config({
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: 'Download',
        description: 'Download file đính kèm',
        path: RnFetchBlob.fs.dirs.DownloadDir.concat('/').concat(item.filename),
      },
      path: RnFetchBlob.fs.dirs.DocumentDir.concat('/').concat(item.filename),
      fileCache: true,
    }).fetch('GET', url)
      .then((res) => {
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Tải file thành công')
        if (Platform.OS === 'ios') {
          RnFetchBlob.ios.openDocument(res.path())
        } else {
          RnFetchBlob.android.actionViewIntent(res.path())
        }
      })
      .catch((err) => {
        showAlert(TYPE.ERROR, 'Thông báo', 'Tải file thất bại')
      })
  }

  _onPressItemAttack = (item) => {
    const typeFile = convertTypeFile(item.filename);
    switch (typeFile) {
      case 3:
          this.props.setTypeOfIconAttackInfo(0)
        // NavigationService.navigate('DetailAttack', { dataItem: item, viewDetail: true })
        this.props.navigation.navigate('AttackmentInfo', {dataItem: item})
        break
      case 2:
          this.props.setTypeOfIconAttackInfo(0)
        // NavigationService.navigate('DetailAttack', { dataItem: item, viewDetail: true })
        this.props.navigation.navigate('AttackmentInfo', {dataItem: item})
        break
      case 1:
        this._requestFileManagerPermission(item)
        break
      case 0:
        this._requestFileManagerPermission(item)
        break
      default:
        showAlert(TYPE.WARN, 'Thông báo', 'Định dạng file không hỗ trợ')
        break
    }
  }

  

  _onChangeBottomMenu = index => {};

  render() {
    return (
      <View style={styles.container}>
        <FlatListSwipe
          data={this.state.dataAttach}
          renderItem={({ item, index }) => {
            return <ItemAttachment
              pressItemAttack={() => {
                this._onPressItemAttack(item)
              }}
              // pressItemAttack={()=>{
              //   this.props.setTypeOfIconAttackInfo(0)
              //   this.props.navigation.navigate('AttackmentInfo', {dataItem: item})
              // }}
              filename={item.filename}
              index={index}
              type={convertTypeFile(item.filename)}
              onPressIcon={this._onDel}
            />
          }}
          onPressIcon={(indexOfIcon, indexOfItem, adAttachmentId) => {
            this._onDel(indexOfIcon, indexOfItem, adAttachmentId);
          }}
          ListEmptyComponent={
            !this.state.loading && <ItemTrong />
          }
          listIcons={[R.images.iconDelete]}
          widthListIcon={WIDTHXD(129)}
          rightOfList={WIDTHXD(30)}
          styleOfIcon={{}}
        />

      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    statusMenu: state.statementRuducer.statusMenu,
    cStatementId: state.statementRuducer.cStatementId,
    uploadFileAttack: state.statementRuducer.uploadFileAttack
  };
}
export default connect(mapStateToProps, {setTypeOfIconAttackInfo})(Attackments);

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  }
});
