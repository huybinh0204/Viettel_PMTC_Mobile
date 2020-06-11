import React, { PureComponent } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image';
import PDF from 'react-native-pdf'
import Fontisto from 'react-native-vector-icons/Fontisto';
import LinearGradient from 'react-native-linear-gradient';
import { WIDTHXD, HEIGHTXD, getFontXD, convertTypeFile } from '../../../../config/Function'
import NavigationService from '../../../../routers/NavigationService'
import { showLoading, hideLoading } from '../../../../common/Loading/LoadingModal'
import { NetworkSetting } from '../../../../config/Setting';
import R from '../../../../assets/R'


export default class ViewAttackFile extends PureComponent {
  _renderAttackmenInfo(item) {
    console.log('ITEM------', item)
    let uri = null
    if (item) {
      if (item.folder) {
        uri = NetworkSetting.ROOT
          .concat(`/erp-service/adAttachmentServiceRest/downloadFile?condition={"filename": "${item.title}", "folder": "${item.folder}"}`)
      } else uri = item.uri
      const typeFile = convertTypeFile(item.name || item.filename);
      console.log('TYPE FILE:', typeFile)
      switch (typeFile) {
        case 3:
          return (
            <FastImage
              source={{ uri: uri }}
              style={{ flex: 1 }}
              resizeMode={FastImage.resizeMode.contain}
            />
          );
        case 2: {
          return <PDF
            source={{ uri: encodeURI(uri), cache: false }}
            style={{ flex: 1 }}
            onLoadProgress={() => showLoading()}
            onLoadComplete={() => hideLoading()}
            onError={(err) => {
              console.log('ERROR VIEW FIEL', err)
              this.setState({ isError: true })
            }}
          />;
        }
        default:
          break;
      }
    }
    return null
  }

  render() {
    const item = this.props.navigation.state.params
    const name = item.name || item.filename
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#0062E1', '#0268E3', '#0B7BE9', '#1899F4', '#22AEFB']}
          style={{ height: HEIGHTXD(200), justifyContent: 'center' }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() => NavigationService.pop()}
              style={styles.btHeader}
            >
              <Fontisto name="angle-left" size={WIDTHXD(46)} color={R.colors.white} />
              <Text style={styles.txtHeader}>{name}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          {this._renderAttackmenInfo(item)}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  btHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: WIDTHXD(84)
  },
  txtHeader: {
    fontSize: getFontXD(54),
    fontFamily: R.fonts.RobotoMedium,
    color: R.colors.white,
    marginLeft: WIDTHXD(68)
  },
})
