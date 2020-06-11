import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import R from 'assets/R';
import { WIDTHXD, HEIGHTXD, getFontXD, NetworkSetting } from '../../../../config';
import PickerSearch from '../../../../common/Picker/PickerSearch';
import ItemCheckBox from '../GeneralInfor/ItemViews/ItemCheckBox'
import { GetData, PostData } from 'apis/helpers';
import { showAlert, TYPE } from 'common/DropdownAlert';
import { redStar } from 'common/Require';

const fetchUserSign = async (text) => {
  try {
    const response = await GetData(`${NetworkSetting.ROOT}/erp-service-mobile/erpAPITermServiceRest/cOfficestaff/findByAutoComplete?term=${text}`);
    if (!response.data || response.data.length < 1) return [];
    return response.data.map(item => ({
      id: item.cOfficestaffId,
      text: item.displayname,
      name: item.displayname,
      value: '',
    })).filter(x => x.name !== 'Tìm kiếm thêm');
  } catch (error) {
    // console.log('error', error)
    return [];
  }
}

const searchPickerProps = {
  height: HEIGHTXD(112.7),
  containerStyle: {
    flex: 1,
    paddingHorizontal: 0,
    paddingRight: WIDTHXD(15),
  },
  style: {
    width: '100%'
  },
  textStyle: {
    paddingHorizontal: 8,
    width: undefined,
    flex: 1
  }
}

export default AddSigner = (props) => {
  const [pickerUserSign, setPickerUserSign] = useState(null);
  const [pickerRole, setPickerRole] = useState(null);
  const [userSign, setUserSign] = useState(null);
  const [role, setRole] = useState(null);
  const [noSign, setNoSign] = useState((props.maxLineNo + 1) + '');
  const [positionSign, setPositionSign] = useState('1');
  const [showSign, setShowSign] = useState(true);
  const [enableOrg, setEnableOrg] = useState(true);


  const fetchRole = async (text) => {
    try {
      const cOfficestaffId = userSign.id;
      const response = await PostData(`${NetworkSetting.ROOT}/erp-service-mobile/cOfficestaffServiceRest/cOfficePosition/getForAutoComplete`, { employeeId: cOfficestaffId, position: text });
      if (!response.data || response.data.length < 1) return [];
      // console.log(response.data)
      return response.data.map(item => ({
        id: item.cOfficepositionId,
        text: item.position,
        // text: `${item.position} - ${item.orgname}`,
        name: item.orgname,
        value: '',
      })).filter(x => x.name !== 'Tìm kiếm thêm').slice(0, 50);
    } catch (error) {
      // console.log('error', error)
      return [];
    }
  }

  useEffect(() => {
    pickerUserSign && pickerUserSign.onChangeText('');
  }, [pickerUserSign]);

  useEffect(() => {
    const data = {
      cSignerId: userSign ? userSign.id : null,//Người ký, không được trùng 
      cOfficepositionId: role ? role.id : null,//Vai trò người ký
      imagenote: positionSign,//Vị trí ký
      cSignerName: "N",
      cDocumentsignId: null,//ID văn bản trình ký Voffice
      signimage: showSign ? 'Y' : 'N', // hien chu ky
      ispublished: enableOrg ? 'Y' : 'N', // don vi ban hanh
      parallelsignlevel: 1,
      cDocumentsignId: null,
      isactive: 'Y',
      isDelete: 'N'
    }
    props.onDataChange && props.onDataChange(data);
  })

  return (
    <View style={styles.root}>
      <View style={styles.container_line}>
        <View style={styles.input_container}>
          <Text style={styles.text_title_input}>Thứ tự ký{redStar()}</Text>
          <View style={styles.border_input}>
            <TextInput
              value={noSign}
              autoCorrect={false}
              keyboardType='decimal-pad'
              returnKeyType='done'
              onChangeText={setNoSign}
              style={styles.input} />
          </View>
        </View>
        <View style={[styles.input_container, { flex: 0.85 }]}>
          <Text style={styles.text_title_input}>Vị trí ký{redStar()}</Text>
          <View style={styles.border_input}>
            <TextInput
              value={positionSign}
              keyboardType='decimal-pad'
              returnKeyType='done'
              autoCorrect={false}
              onChangeText={setPositionSign}
              style={styles.input} />
          </View>
        </View>
      </View>
      <Text style={styles.input_title}>Người ký{redStar()}</Text>
      <PickerSearch
        ref={ref => setPickerUserSign(ref)}
        title='Người ký'
        value={userSign ? userSign.text : ''}
        data={[]}
        findData={(text) => fetchUserSign(text)}
        onValueChange={(_, item) => {
          setUserSign(item);
          setRole(null); // reset role after choose user sign
          pickerRole && pickerRole.onChangeText('');
        }}
        {...searchPickerProps}
      />
      <Text style={styles.input_title}>Vai trò{redStar()}</Text>
      <PickerSearch
        ref={ref => setPickerRole(ref)}
        title='Vai trò'
        value={role ? role.text : ''}
        tempDisabled={!userSign}
        onShowPorm={() => showAlert(TYPE.WARN, 'Cảnh báo', 'Bạn phải chọn người ký trước khi chọn vai trò.')}
        data={[]}
        findData={(text) => fetchRole(text)}
        onValueChange={(_, item) => setRole(item)}
        {...searchPickerProps}
      />
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: HEIGHTXD(67),
      }}>
        <ItemCheckBox title='Hiển thị chữ ký'
          checked={showSign}
          onPress={() => setShowSign(!showSign)} />
        <ItemCheckBox title='Chọn đơn vị ban hành'
          checked={enableOrg}
          onPress={() => setEnableOrg(!enableOrg)} />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    marginTop: HEIGHTXD(30),
    paddingTop: HEIGHTXD(43),
    paddingHorizontal: WIDTHXD(45),
    backgroundColor: '#fff',
    minHeight: HEIGHTXD(321),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
  },
  input_container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  text_title_input: {
    // minWidth: WIDTHXD(220),
    marginRight: WIDTHXD(40),
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    color: '#5D5D5D'
  },
  container_line: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  border_input: {
    borderRadius: WIDTHXD(20),
    width: WIDTHXD(153),
    minHeight: HEIGHTXD(90),
    borderWidth: WIDTHXD(3),
    borderColor: '#77869E',
    flexDirection: 'row'
  },
  input: {
    width: '100%',
    textAlign: 'center',
    flex: 1,
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    color: '#000',
    paddingVertical: 0
  },
  input_title: {
    fontSize: getFontXD(R.fontsize.lableFieldTextSize),
    fontFamily: R.fonts.RobotoRegular,
    marginBottom: HEIGHTXD(30),
    color: R.colors.label,
    marginTop: HEIGHTXD(68)
  }
})
