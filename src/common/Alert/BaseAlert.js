import React from 'react';
import { View, Text, StyleSheet, StatusBar, Modal, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from '../../assets';
import R from '../../assets/R';
import i18n from '../../assets/languages/i18n';
import { HEIGHT } from '../../config/Function';
/**
 *  @param {show} show to set modal visiable
 *  @param {closeModal} closeModal to set modal visiable
 */

export default class BaseAlert extends React.Component {
  state = {
    show: false,
  };

  closeModal=(val) => {
    this.setState({ show: val })
  }

  render() {
    let { show } = this.state;
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={show}
        onRequestClose={() => { this.closeModal(false) }}
      >
        <TouchableOpacity
          activeOpacity={0}
          style={style.blackStyle}
          onPress={() => this.closeModal(false)}
        >
          <StatusBar barStyle="light-content" backgroundColor={colors.black0} />
          <View style={style.body}>
            <View style={style.content}>
              <View style={style.headerView}>
                <Text style={style.headerText}>Thông báo</Text>
              </View>
              <View style={style.circleCheck}>
                {this.props.success ? <AntDesign size={HEIGHT(30)} name="checkcircleo" color={R.colors.blue0084} /> : <AntDesign size={HEIGHT(30)} name="closecircleo" color={R.colors.red300} /> }
              </View>
              <Text style={style.message}>{this.props.message || i18n.t('NOTI_DEFAULT')}</Text>
            </View>

          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const style = StyleSheet.create({
  blackStyle: {
    flex: 1,
    backgroundColor: colors.black40p,
    justifyContent: 'center'
  },
  body: {
    width: '80%',
    backgroundColor: colors.white100,
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10
  },
  headerView: {
    borderBottomColor: colors.borderE,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  headerText: {
    color: colors.primaryColor,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center'
  },
  message: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.black3,
    width: '80%',
    alignSelf: 'center',
    paddingVertical: 15,
    textAlign: 'center'
  },
  circleCheck: {
    alignSelf: 'center',
    marginVertical: 10,
    marginTop: 20,
    resizeMode: 'contain'
  }
});
