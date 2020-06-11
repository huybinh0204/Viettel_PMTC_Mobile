import React, { PureComponent } from 'react'
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, LayoutAnimation, FlatList, Platform, PermissionsAndroid } from 'react-native'
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import R from '../../../../assets/R'
import { WIDTHXD, HEIGHTXD, getFontXD } from '../../../../config/Function'
import { TABLE_INVOICE_GROUP_ID } from '../../../../config/constants'
import ApInvoiceGroupStatement from '../../../../apis/Functions/apInvoiceGroupStatement'
import { showAlert, TYPE } from 'common/DropdownAlert';
import Types from 'helpers/Types';
import _ from 'lodash'
import { convertTypeFile, NetworkSetting } from "../../../../config"
import RNFetchBlob from 'rn-fetch-blob';


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
      onSuccess && onSuccess();
    } else {
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

export default class SigningInfo extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      expandedAttack: false,
      expandedApproval: false,
      signingInfo: {},
      dataAttack: [{}, {}]
    }
  }
  componentDidMount() {
    this._getData(this.props.id)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this._getData(nextProps.id)
    }
  }

  changeLayoutAttack = () => {
    LayoutAnimation.configureNext(
      {
        duration: 500,
        create: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.scaleY,
          springDamping: 1.7,
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 1.7,
        },
      }
    );
    this.setState({ expandedAttack: !this.state.expandedAttack });
  }

  changeLayoutApproval = () => {
    LayoutAnimation.configureNext(
      {
        duration: 500,
        create: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.scaleY,
          springDamping: 1.7,
        },
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 1.7,
        },
      }
    );
    this.setState({ expandedApproval: !this.state.expandedApproval });
  }

  _getData = async (id) => {
    const body = {
      recordId: id,
      adTableId: TABLE_INVOICE_GROUP_ID,
      // recordId: 7453233,
      // adTableId: 1000176
    }
    const response = await ApInvoiceGroupStatement.getVOfficeInfo(body)
    if (response.status === 200) {
      this.setState({
        signingInfo: response.data
      })
    } else {
      // showAlert(TYPE.ERROR, 'Lấy thông tin trình ký không thành công')
    }
  }

  _renderItemAttack = (item) => {
    let type = convertTypeFile(item.filename)
    return <TouchableOpacity
      onPress={() => this._onPressItem(item)}
      style={styles.btMainText}>
      <FastImage source={R.strings.fileTypeIcon[type].icon} style={styles.icon} resizeMode={FastImage.resizeMode.stretch} />
      <Text style={styles.txtMainText}>{item.filename}</Text>
    </TouchableOpacity>
  }

  _onPressItem = (item) => {
    const typeFile = convertTypeFile(item.filename);
    switch (typeFile) {
      case 3:
      case 2: {
        this.props.navigation.navigate('AttachmentInfo', { dataItem: item });
        this.props.onViewAttackInSigningInfo(true, item.filename);
        break
      }
      default:
        _downloadFile(item);
        return null;
    }

  }


  _renderItemSignPerson = (item) => {
    let name = item.cSignerName ? item.cSignerName : ''
    let officePision = item.cOfficepositionName ? item.cOfficepositionName : ''
    return <TouchableOpacity style={styles.btApproval}>
      <View style={styles.rowApproval}>
        <FastImage
          source={require('../../../../assets/images/category/iconPeople.png')}
          style={styles.imageAvt}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.colApproval}>
          <Text style={styles.content}>{name}</Text>
          <Text style={[styles.title, { marginTop: HEIGHTXD(15) }]}>{officePision}</Text>
        </View>
      </View>
      <Text style={styles.status}>Đã kí duyệt</Text>
    </TouchableOpacity>
  }


  render() {
    const { expandedAttack, expandedApproval, signingInfo } = this.state
    if (_.isEmpty(signingInfo)) {
      return (
        <View><Text style={{ paddingVertical:HEIGHTXD(40), alignSelf:'center'}}>Chưa có thông tin trình ký</Text></View>
      )
    } else {
      let titlesign = signingInfo && signingInfo.titlesign ? signingInfo.titlesign : '--'
      let hardCopyDate = signingInfo && signingInfo.hardCopyDate ? signingInfo.hardCopyDate : '--'
      let priority = signingInfo && signingInfo.priority ? signingInfo.priority : '--'
      let dataAttach = []
      let fileSign = {}
      if (signingInfo) {
        _.forEach(signingInfo.attachmentinfoDTOLst, (item) => {
          if (item.isFileSign === 'Y') {
            fileSign = item
          } else {
            dataAttach.push(item)
          }
        })
      }
      const count = dataAttach ? dataAttach.length : 0
      return (
        <ScrollView style={styles.container}>
          <View style={styles.viewTop}>
            <View style={styles.ctnContent}>
              <Text style={styles.title}>Trích yếu nội dung</Text>
              <Text style={styles.content}>{titlesign}</Text>
            </View>
            <View style={styles.ctnContent}>
              <Text style={styles.title}>Ngày duyệt Voffice</Text>
              <Text style={styles.content}>{hardCopyDate}</Text>
            </View>
            <View style={styles.ctnContent}>
              <Text style={styles.title}>Độ ưu tiên</Text>
              <Text style={styles.content}>{priority}</Text>
            </View>
          </View>

          <View style={styles.viewBottom}>
            <View style={{ flexGrow: 2 }}>
              <View style={styles.ctnMainText}>
                <Text style={styles.mainText}>Văn bản chính</Text>
                {signingInfo && signingInfo.attachmentinfoDTOLst ?
                  <TouchableOpacity style={styles.btMainText}
                    onPress={() => this._onPressItem(fileSign)}
                  >
                    <FastImage source={R.strings.fileTypeIcon[2].icon} style={styles.icon} resizeMode={FastImage.resizeMode.stretch} />
                    <Text style={styles.txtMainText}>{fileSign.filename}</Text>
                  </TouchableOpacity>
                  : null
                }
              </View>

              <View>
                <TouchableOpacity style={styles.btAttack} onPress={() => this.changeLayoutAttack()}>
                  <View style={styles.rowAttack}>
                    <Text style={styles.mainText}>{`Tệp đính kèm (${count})`}</Text>
                  </View>
                  {expandedAttack && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                  {!expandedAttack && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                </TouchableOpacity>
                {
                  expandedAttack
                  && (
                    <FlatList
                      data={dataAttach}
                      keyExtractor={(item, index) => index.toString()}
                      extraData={this.state.signingInfo}
                      renderItem={({ item }) => (
                        this._renderItemAttack(item)
                      )
                      }
                    />
                  )
                }
              </View>

              <View>
                <TouchableOpacity style={styles.btAttack} onPress={() => this.changeLayoutApproval()}>
                  <Text style={[styles.mainText, { marginBottom: WIDTHXD(32) }]}>Danh sách ký duyệt</Text>
                  {expandedApproval && <Ionicons name="ios-arrow-down" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                  {!expandedApproval && <Ionicons name="ios-arrow-forward" size={WIDTHXD(50)} style={{ marginRight: WIDTHXD(30) }} color={R.colors.iconGray} />}
                </TouchableOpacity>
                {
                  expandedApproval
                  && (
                    <FlatList
                      data={signingInfo.cSigninfomationDTOLst}
                      keyExtractor={(item, index) => index.toString()}
                      extraData={this.state.signingInfo}
                      renderItem={({ item }) => (
                        this._renderItemSignPerson(item)
                      )
                      }
                    />
                  )
                }
              </View>
            </View>
          </View>
        </ScrollView>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.colors.blueGrey51
  },
  viewTop: {
    backgroundColor: R.colors.white,
    marginTop: WIDTHXD(24)
  },
  btApproval: {
    backgroundColor: R.colors.white,
    borderRadius: WIDTHXD(20),
    paddingHorizontal: WIDTHXD(42),
    paddingVertical: WIDTHXD(18),
    marginBottom: WIDTHXD(24)
  },
  status: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.colorStatusSubmisson,
    alignSelf: 'flex-end'
  },
  imageAvt: {
    width: WIDTHXD(120),
    height: HEIGHTXD(120),
    borderRadius: WIDTHXD(60),
    marginRight: WIDTHXD(62),
  },
  rowApproval: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  colApproval: {
    flex: 4,
    marginRight: WIDTHXD(32),
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  btAttack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: WIDTHXD(48)
  },
  rowAttack: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ctnContent: {
    paddingTop: WIDTHXD(20),
    paddingBottom: WIDTHXD(48),
    borderBottomColor: R.colors.borderE6,
    borderBottomWidth: WIDTHXD(1),
    paddingHorizontal: WIDTHXD(36),
    justifyContent: 'space-around'
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.color777
  },
  content: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    marginTop: WIDTHXD(8)
  },
  viewBottom: {
    flex: 2,
    paddingHorizontal: WIDTHXD(36),
    backgroundColor: R.colors.blueGrey51
  },
  ctnMainText: {
    marginTop: WIDTHXD(48)
  },
  btMainText: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: WIDTHXD(36),
    paddingHorizontal: WIDTHXD(30),
    backgroundColor: R.colors.white,
    borderRadius: WIDTHXD(20),
    marginTop: WIDTHXD(20),
  },
  mainText: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(42),
    color: R.colors.color777
  },
  icon: {
    width: WIDTHXD(55),
    height: HEIGHTXD(68)
  },
  txtMainText: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.black0,
    marginLeft: WIDTHXD(30),
    marginRight: WIDTHXD(30)
  }
})
