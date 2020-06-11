import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import R from 'assets/R';
import _ from 'lodash'
import i18n from 'assets/languages/i18n';
import { WIDTHXD, HEIGHTXD, getFontXD, getLineHeightXD } from '../../../../../config';

const ItemDetailInvoice = (props) => {
  const { nameInvoice, price, quantum, cUomId, onPressItem, requestAmount } = props
  let nameInvoices = (_.isUndefined(nameInvoice) || !_.isNull(nameInvoice)) ? nameInvoice : i18n.t('NULL_L')
  let prices = (_.isUndefined(price) || !_.isNull(price)) ? price : i18n.t('NULL_L')
  let quantums = (_.isUndefined(quantum) || !_.isNull(quantum)) ? quantum : i18n.t('NULL_L')
  let cUomIdss = (_.isUndefined(cUomId) || !_.isNull(cUomId)) ? cUomId : i18n.t('NULL_L')
  let requestAmounts = (_.isUndefined(requestAmount) || !_.isNull(requestAmount)) ? requestAmount : i18n.t('NULL_L')

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={() => onPressItem && onPressItem()}>
        <View style={styles.containerItem}>
          <View style={{ flexDirection: 'row', marginTop: HEIGHTXD(24), justifyContent: 'space-between' }}>
            <Text style={styles.textNameInvoice}>{nameInvoices && nameInvoices}</Text>
            <Text style={styles.textNameInvoice}>{requestAmounts && requestAmounts}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: HEIGHTXD(30), marginBottom: HEIGHTXD(41), }}>
            <View style={styles.viewUnit}>
              <Text style={[styles.textQuantum, { color: R.colors.colorNameBottomMenu }]}>{quantums && quantums}</Text>
            </View>
            <Text style={styles.textQuantum}>{`${cUomIdss && cUomIdss} x VNĐ ${prices && prices}`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
};

export default ItemDetailInvoice

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  containerItem: {
    width: WIDTHXD(1065),
    backgroundColor: R.colors.white,
    marginTop: HEIGHTXD(30),
    borderRadius: WIDTHXD(30),
    paddingLeft: WIDTHXD(45),
    paddingRight: WIDTHXD(36),
    elevation: 1,
  },
  textNameInvoice: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(51),
    fontFamily: R.fonts.RobotoMedium,
    color: R.colors.grayText
  },
  textQuantum: {
    color: R.colors.grayText,
    fontSize: getFontXD(39),
    lineHeight: getLineHeightXD(47),
    fontFamily: R.fonts.RobotoRegular
  },
  viewUnit: {
    borderWidth: WIDTHXD(1),
    borderColor: R.colors.colorNameBottomMenu,
    marginRight: WIDTHXD(21),
    borderRadius: WIDTHXD(7),
    paddingHorizontal: WIDTHXD(3),
  }
})
