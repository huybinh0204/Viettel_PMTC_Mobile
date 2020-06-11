import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import R from 'assets/R';
import FastImage from 'react-native-fast-image';
import { WIDTHXD, HEIGHTXD, getFontXD, NetworkSetting } from '../../../../config';
import PickerSearch from '../../../../common/Picker/PickerSearch';
import { PostData } from 'apis/helpers';

const searchPickerProps = {
  height: HEIGHTXD(90),
  containerStyle: {
    flex: 1,
    paddingHorizontal: 0,
    paddingRight: WIDTHXD(15),
  },
  style: {
    width: undefined,
    flex: 1,
  },
  textStyle: {
    paddingHorizontal: 8,
    width: undefined,
    flex: 1
  }
}

export default ItemSigner = (props) => {
  const [pickerReceiver, setPickerReceiver] = useState(null);
  const [receiver, setReceiver] = useState(null);

  // console.log(props.item)
  const fetchReceiver = async (text) => {
    try {
      const response = await PostData(`${NetworkSetting.ROOT}/erp-service/adUserServiceRest/adUser/getForAutoCompleteAdUser`, { name: text, isSize: true });
      if (!response.data || response.data.length < 1) return [];
      return response.data.map(item => ({
        id: item.adUserId,
        text: item.text,
        name: item.fullname,
        value: item.value,
      })).filter(x => x.text !== 'Tìm kiếm thêm');
    } catch (error) {
      // console.log('error', error)
      return [];
    }
  }

  useEffect(() => {
    pickerReceiver && pickerReceiver.onChangeText('');
    setReceiver({
      id: props.item.cSignerId,
      text: props.item.cSignerName ? props.item.cSignerName : props.item.cSignerId,
      name: props.item.cSignerName,
      value: props.item.cSignerId,
    });
  }, [pickerReceiver]);

  const { item } = props;
  const isUpdate = item.cSignerId ? true : false;

  return (
    <TouchableOpacity style={styles.root}>
      <Text style={styles.text_lineno}>{isUpdate ? props.item.lineno : (props.maxLineno + 1)}</Text>
      <View style={styles.vline} />
      <View style={styles.contain}>
        <Text style={styles.text_left}>Người nhận</Text>
        <PickerSearch
          ref={ref => setPickerReceiver(ref)}
          title='Người nhận'
          value={receiver ? receiver.text : ''}
          data={[]}
          findData={(text) => fetchReceiver(text)}
          onValueChange={(_, item) => {
            setReceiver(item);
            props.onChoose && props.onChoose(item, props.item.cStaffsendId ? props.maxLineno : (props.maxLineno + 1));
          }}
          {...searchPickerProps}
        />
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    marginTop: HEIGHTXD(30),
    backgroundColor: '#fff',
    minHeight: HEIGHTXD(150),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
  },
  text_lineno: {
    fontSize: getFontXD(48),
    fontFamily: R.fonts.RobotoRegular,
    minWidth: WIDTHXD(82),
    textAlign: 'center'
  },
  vline: {
    width: WIDTHXD(1.83),
    height: '100%',
    backgroundColor: '#E6E6E6'
  },
  contain: {
    paddingHorizontal: WIDTHXD(30),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text_left: {
    fontSize: getFontXD(42),
    color: '#5D5D5D',
    paddingRight: WIDTHXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular
  },
})
