import React, { PureComponent } from 'react';
import { View, StyleSheet, Platform, PermissionsAndroid, FlatList } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import R from 'assets/R';
import { connect } from 'react-redux';
import FlatListSwipe from 'common/Swipe/FlatListSwipe';
// import BottomMenu from '../../common/BottomMenu';
import { WIDTHXD } from '../../../../config/Function';
import ItemAttachment from './Items/Item';
import { setTypeOfIconAttackInfo } from '../../../../actions/statement';
import { getListAttackFile, deleteAttackFile } from '../../../../apis/Functions/statement';
import { convertTypeFile, NetworkSetting } from "../../../../config"
import { showAlert, TYPE } from '../../../../common/DropdownAlert';
import { TABLE_INVOICE_GROUP_ID } from '../../../../config/constants'
import ItemTrong from '../../../../common/Item/ItemTrong'


const requestStoragePermission = async (onSuccess) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Viettel App Camera Permission",
        message:
          "Viettel cần tải tài liệu của bạn về trước khi xem, bạn vui lòng cấp quyền lưu file.",
        buttonNeutral: "Nhắc tôi sau",
        buttonNegative: "Huỷ bỏ",
        buttonPositive: "Đồng ý"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
      onSuccess && onSuccess();
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

export const _downloadFile = (item) => {
  const url = encodeURI(NetworkSetting.ROOT.concat(`/erp-service/adAttachmentServiceRest/downloadFile?condition={"filename": "${item.title}", "folder": "${item.folder}"}`));

  const downloadAndView = () => RNFetchBlob.config({
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: 'Download',
      description: 'Download file đính kèm',
      path: RNFetchBlob.fs.dirs.DownloadDir.concat('/').concat(item.filename),
    },
    path: RNFetchBlob.fs.dirs.DocumentDir.concat('/').concat(item.filename),
    fileCache: true,
  }).fetch('GET', url)
    .then((res) => {
      showAlert(TYPE.SUCCESS, 'Thông báo', 'Tải file thành công')
      if (Platform.OS === 'ios') {
        RNFetchBlob.ios.openDocument(res.path())
      } else {
        RNFetchBlob.android.actionViewIntent(res.path())
      }
    })
    .catch((err) => {
      showAlert(TYPE.ERROR, 'Thông báo', 'Tải file thất bại')
    })

  if (Platform.OS === 'android') {
    requestStoragePermission(() => downloadAndView());
  } else {
    downloadAndView()
  }
}
class Attackments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reRender: true,
      adTableId: TABLE_INVOICE_GROUP_ID,
      isActive: "Y",
      isDeleted: "N",
      dataAttach: [],
      loading: true,
      isReadOnly: false
    };
  }
  async componentDidMount() {
    this._getAttackList()
    this.setState({ isReadOnly: this.props.isReadOnly })

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.refreshAttackList !== this.props.valurefreshAttackListe) {
      this._getAttackList()
    }
    if (nextProps.isReadOnly !== this.props.isReadOnly) {
      this.setState({ isReadOnly: nextProps.isReadOnly })
    }

    if (nextProps.recordId !== this.props.recordId) {
      this._getAttackList()
    }
  }

  _getAttackList = async () => {
    const body = {
      adTableId: this.state.adTableId,
      recordId: this.props.recordId,
      isActive: this.state.isActive,
      isDeleted: this.state.isDeleted,
    }

    const response = await getListAttackFile(body);
    console.log("bodyyyyyy", body)
    console.log("responseresponseresponse", response)
    if (response.status === 200) {
      this.setState({ dataAttach: response.data, loading: false })
    }
  }
  _onDel = async (indexs, indexDel, adAttachmentId) => {
    if (adAttachmentId) {
      const response = await deleteAttackFile([adAttachmentId]);
      if (response.status === 200) {
        showAlert(TYPE.SUCCESS, 'Thông báo', 'Xoá thành công');
        let dataAttachTmp = this.state.dataAttach;
        dataAttachTmp.splice(indexDel, 1);
        this.setState({ dataAttach: dataAttachTmp });
      }
      else {
        showAlert(TYPE.WARN, 'Thông báo', 'Kiểm tra lại đường truyền');
      }
    }
  };

  _onChangeBottomMenu = index => { };
  _onPressItem = (item) => {
    const typeFile = convertTypeFile(item.filename);
    switch (typeFile) {
      case 3:
      case 2: {
        this.props.navigation.navigate('AttachmentInfo', { dataItem: item });
        this.props.onAttachmentTabChange(1, item.filename);
        break
      }
      default:
        _downloadFile(item);
        return null;
    }

  }



  render() {
    return (
      <View style={styles.container}>
        {this.state.isReadOnly ?
          <FlatList
            data={this.state.dataAttach}
            renderItem={({ item, index }) => {
              return <ItemAttachment
                pressItemAttack={() => {
                  this._onPressItem(item)
                }}
                filename={item.filename}
                index={index}
                type={convertTypeFile(item.filename)}
                onPressIcon={this._onDel}
              />
            }}
            ListEmptyComponent={!this.state.loading && <ItemTrong />}
          />
          :
          <FlatListSwipe
            data={this.state.dataAttach}
            renderItem={({ item, index }) => {
              return <ItemAttachment
                pressItemAttack={() => {
                  this._onPressItem(item)
                }}
                filename={item.filename}
                index={index}
                type={convertTypeFile(item.filename)}
                onPressIcon={this._onDel}
              />
            }}
            onPressIcon={(indexOfIcon, indexOfItem, adAttachmentId) => {
              this._onDel(indexOfIcon, indexOfItem, adAttachmentId);
            }}
            ListEmptyComponent={!this.state.loading && <ItemTrong />}
            listIcons={[R.images.iconDelete]}
            widthListIcon={WIDTHXD(129)}
            rightOfList={WIDTHXD(30)}
            styleOfIcon={{}}
          />}

      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    statusMenu: state.statementRuducer.statusMenu
  };
}
export default connect(mapStateToProps, { setTypeOfIconAttackInfo })(Attackments);

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.colors.blueGrey51,
    flex: 1
  }
});
