import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, TouchableHighlight } from 'react-native';
import FastImage from 'react-native-fast-image';
import R from '../../../assets/R';
import { WIDTHXD, getFontXD, getWidth, HEIGHTXD } from '../../../config/Function'

type Props = {
  icons: Array,
  activeMenu: Number,
  onPress: Function,
  isActiveSave: Boolean,
  isActiveCo: Boolean,
  isActivePrint: Boolean,
  isActiveAttack: Boolean,
  isRa: Boolean,
}

class BottomMenu extends Component<Props> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isPressAttack: false,
      isPressCo: false,
      isPressPrint: false,
      isPressSave: false,
      isPressSubmit: false,
      isPressRA: false,
      reRender: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.isRa !== this.props.isRa)) {
      this.setState({ reRender: true, isPressCo: false })
    }
    if ((nextProps.isActiveAttack !== this.props.isActiveAttack) || (nextProps.isActivePrint !== this.props.isActiveAttack)
      || (nextProps.isActiveSubmit !== this.props.isActiveSubmit) || (nextProps.isActiveCo !== this.props.isActiveCo)
      || (nextProps.isActiveSave !== this.props.isActiveSave)) {
      this.setState({ reRender: true })
    }
  }

  _onHideUnderlay = (item) => {
    switch (item.key) {
      case 'co':
        this.setState({ isPressCo: false })
        break
      case 'ra':
        this.setState({ isPressRA: false })
        break
      case 'save':
        this.setState({ isPressSave: false })
        break
      case 'print':
        this.setState({ isPressPrint: false })
        break
      case 'submit':
        this.setState({ isPressSubmit: false })
        break
      case 'attack':
        this.setState({ isPressAttack: false })
        break
      default:
        break
    }
  }

  _onShowUnderlay = (item) => {
    switch (item.key) {
      case 'co':
        this.setState({ isPressCo: true })
        break
      case 'ra':
        this.setState({ isPressRA: true })
        break
      case 'save':
        this.setState({ isPressSave: true })
        break
      case 'print':
        this.setState({ isPressPrint: true })
        break
      case 'submit':
        this.setState({ isPressSubmit: true })
        break
      case 'attack':
        this.setState({ isPressAttack: true })
        break
      default:
        break
    }
  }

  _renderItemMenu = (item, index) => {
    let link = item.active
    let color = R.colors.colorNameBottomMenu
    let title = item.value
    switch (item.key) {
      case 'co':
        if (this.props.isRa) {
          link = require('../../../assets/images/menu/ra.png')
          title = 'RA'
        } else {
          if (this.props.isActiveCo) link = this.state.isPressCo ? item.press : item.active
          else { link = item.disable; color = R.colors.iconGray }
        }
        break
      case 'save':
        if (this.props.isActiveSave) link = this.state.isPressSave ? item.press : item.active
        else { link = item.disable; color = R.colors.iconGray }
        break
      case 'print':
        if (this.props.isActivePrint) link = this.state.isPressPrint ? item.press : item.active
        else { link = item.disable; color = R.colors.iconGray }
        break
      case 'submit':
        if (this.props.isActiveSubmit) link = this.state.isPressSubmit ? item.press : item.active
        else { link = item.disable; color = R.colors.iconGray }
        break
      case 'attack':
        if (this.props.isActiveAttack) link = this.state.isPressAttack ? item.press : item.active
        else { link = item.disable; color = R.colors.iconGray }
        break
      default:
        break
    }
    const countMenu = this.props.icons.length - 1;
    return (
      (this.props.isRa && item.key === 'co') || (!this.props.isRa && item.key === 'ra') ? null : (
        <View style={{ width: getWidth() / countMenu }} key={item.key}>
          <TouchableHighlight
            onPressOut={() => this.props.onPress(index)}
            style={styles.btIcon}
            underlayColor="transparent"
            onHideUnderlay={() => this._onHideUnderlay(item)}
            onShowUnderlay={() => this._onShowUnderlay(item)}
          >
            <View style={{ alignItems: 'center' }}>
              <FastImage source={link} style={styles.icIcon} />
              <Text style={[styles.txtIcon, { color }]}>{title}</Text>
            </View>
          </TouchableHighlight>
        </View>
      )
    )
  }

  render() {
    if (this.props.activeMenu === 1) {
      return (
        <View style={styles.ctn}>
          <FlatList
            data={this.props.icons}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
            horizontal={true}
            contentContainerStyle={styles.contentContainerStyle}
            renderItem={({ item, index }) => this._renderItemMenu(item, index)}
            scrollEnabled={false}
          />
        </View>
      )
    } else return null
  }
}

export default BottomMenu

const styles = StyleSheet.create({
  ctn: {
    zIndex: 1,
    width: getWidth(),
    flexDirection: 'row',
    backgroundColor: R.colors.white,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.12,
    elevation: 20,
    position: 'absolute',
    bottom: 0,
    height: HEIGHTXD(200),
    shadowRadius: 2
  },
  ctnRow: {
    width: getWidth(),
    flexDirection: 'row',
    backgroundColor: R.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 50,
  },
  contentContainerStyle: {
    width: getWidth(),
    flexGrow: 1,
    flexDirection: 'row',
  },
  icIcon: {
    width: WIDTHXD(72),
    height: WIDTHXD(72)
  },
  btIcon: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: WIDTHXD(18),
    paddingVertical: WIDTHXD(12),
    flex: 1,
    justifyContent: 'space-around',
  },
  txtIcon: {
    fontFamily: R.fonts.RobotoRegular,
    fontSize: getFontXD(33),
    color: R.colors.colorNameBottomMenu,
    marginTop: WIDTHXD(20)
  },
})
