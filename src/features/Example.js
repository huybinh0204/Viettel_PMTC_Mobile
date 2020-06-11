import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native'
import R from 'assets/R';
import AsyncStorageUtils from 'helpers/AsyncStorageUtils';
import NavigationService from 'routers/NavigationService';
import { PdfViewer, ListStatement, ListInvoice, TabInvoice } from 'routers/screenNames';
import { FilePickerHelper } from 'helpers/FilePickerHelper';
import { FlatList } from 'react-native-gesture-handler';
import i18n from 'assets/languages/i18n';
import PickerSearch from '../common/Picker/PickerSearch';
import SwipeableRowItem from '../common/Swipe/SwipeableRowItem';
import { HEIGHT, WIDTH, getFont, HEIGHTXD, WIDTHXD } from '../config/Function';
import DialogSearch from '../common/InputModal/DialogSearch'
import ImagePickerModal from '../common/FilePicker/ImagePickerModal';
import ImageViewer from '../common/FileViewer/ImageViewer';
import DownloadWithProgress from '../common/DownloadModal/DownloadWithProgress'
import SaveToXlsx from '../common/SaveFile/SaveToXlsx'
import { showAlert, TYPE } from '../common/DropdownAlert'

const dataSwipe = {
  listIcon1: [
    { name: 'delete', bgrColor: '#dd2c00', color: '#fff' }
  ],
  listIcon2: [
    { name: 'pencil', bgrColor: '#ddd', color: '#000' },
    { name: 'delete', bgrColor: '#dd2c00', color: '#fff' }
  ],
  listIcon3: [
    { name: 'arrange-bring-forward', bgrColor: '#ddd', color: '#000' },
    { name: 'pencil', bgrColor: '#ddd', color: '#000' },
    { name: 'delete', bgrColor: '#dd2c00', color: '#fff' }
  ]
}
const listField = [
  {
    title: 'Số tờ trình gốc',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.TEXTINPUT,
    data: [],
    value: '',
    placeholder: 'Nhập số tờ trình gốc',
  },
  {
    title: 'Loại tờ trình',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.PICKER,
    value: '',
    data: R.strings.local.LOAI_TO_TRINH
  },
  {
    title: 'Người duyệt',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.AUTOCOMPLETESEARCH,
    value: '',
    data: R.strings.local.LOAI_TO_TRINH,
    placeholder: 'Tìm người duyệt',
  },
  {
    title: 'Ngày lập',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.DATEPICKER,
    value: '',
    data: [],
    placeholder: 'Ngày lập tờ trình',
  },
  {
    title: 'Trạng thái duyệt',
    type: R.strings.TYPE_ITEM_DIALOGSEARCH.CHECKBOX,
    value: '',
    data: []
  },
]
export default class Example extends React.PureComponent {
  state = {
    value: '',
    success: true,
    textCache: '',
    stringTest: '',
    dataDialogSearch: 'Chưa có dữ liệu',
    images: [],
    files: [],
  }

  renderMess = () => (
    <View style={styles.wrapperMes}>
      <TouchableOpacity
        onPress={() => {
          showAlert(TYPE.SUCCESS, 'Thông báo', 'Gửi thành công')
          this.setState({ success: true })
        }}
        style={styles.boxMessage}
      >
        <Text style={styles.textMes}>Thành công</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          showAlert(TYPE.ERROR, 'Thông báo', 'Gửi thất bại')
          this.setState({ success: false })
        }}
        style={styles.boxMessage}
      >
        <Text style={styles.textMes}>Thất bại</Text>
      </TouchableOpacity>
    </View>
  )

  onSaveCache = async (val) => {
    await AsyncStorageUtils.save(AsyncStorageUtils.KEY.STRING_TEST, val)
    this.setState({ stringTest: val })
  }

  onDelCache = () => {
    AsyncStorageUtils.remove(AsyncStorageUtils.KEY.STRING_TEST)
    this.setState({
      stringTest: ''
    })
  }

  async componentDidMount() {
    let stringTest = await AsyncStorageUtils.get(AsyncStorageUtils.KEY.STRING_TEST)
    if (stringTest === undefined || stringTest === null) {
      stringTest = ''
    }
    this.setState({ stringTest })
  }

  renderCache = () => (
    <View style={styles.wrapperItem}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInput
          style={[styles.inputBox]}
          multiline={true}
          value={this.state.textCache}
          onChangeText={text => {
            this.setState({ textCache: text })
          }}
          placeholder="Nhập nội dung cần lưu"
        />
        <TouchableOpacity
          onPress={() => { this.onSaveCache(this.state.textCache) }}
          style={[styles.boxMessage, { width: WIDTH(60) }]}
        >
          <Text style={styles.textMes}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={{ paddingVertical: HEIGHT(10) }}>Nội dung lưu</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.inputBox}>
            <Text>{this.state.stringTest}</Text>
          </View>
          <TouchableOpacity
            onPress={() => { this.onDelCache() }}
            style={[styles.boxMessage, { width: WIDTH(60) }]}
          >
            <Text style={styles.textMes}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  )

  renderDialog = () => (
    <View style={styles.wrapperItem}>
      {/* <StatusBar backgroundColor={R.colors.white} /> */}
      <TouchableOpacity
        onPress={() => { this.DialogSearch.setModalVisible(true) }}
        style={styles.boxMessage}
      >
        <Text style={styles.textMes}>Tìm kiếm</Text>
      </TouchableOpacity>
      <View>
        <Text style={{ paddingVertical: HEIGHT(10) }}>Nội dung trả về</Text>
        <View style={styles.inputBox}>
          <Text>{this.state.dataDialogSearch.toString()}</Text>
        </View>
      </View>
    </View>

  )

  // has change view example in CreateInvoice
  renderAutoComplete = () => (
    <View style={styles.wrapperItem}>
      <PickerSearch
        data={R.strings.local.LOAI_TO_TRINH}
        onValueChange={(value, item) => {
          this.setState({ value })
          console.log('item', item)
        }}
        title=""
        width={WIDTH(300)}
        boxInputStyle={{ width: WIDTH(270), paddingRight: WIDTH(60) }}
        placeholder="Nhập nội dung"
        listStyle={{ marginLeft: 0, width: WIDTH(270) }}
        containerStyle={{ width: WIDTH(270) }}
        textItemStyle={{ width: WIDTH(270) }}
        itemListStyle={{ width: WIDTH(270) }}
        iconStyle={{ right: WIDTH(80) }}
      />
    </View>
  )

  renderSwipe = () => (
    <View style={styles.wrapperItem}>
      <SwipeableRowItem
        listIcon={dataSwipe.listIcon1}
        onPress={(index) => { showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), i18n.t('Save_successfully')); console.log('index of icon pressed', index) }}
        width={50 * dataSwipe.listIcon1.length}
      >
        <View style={styles.itemSwipe}>
          <Text style={{ padding: HEIGHTXD(30) }}>Item Swipe with 1 icon</Text>
        </View>
      </SwipeableRowItem>
      <View style={{ marginTop: HEIGHTXD(40) }} />
      <SwipeableRowItem
        listIcon={dataSwipe.listIcon2}
        onPress={(index) => { showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), i18n.t('Save_successfully')); console.log('index of icon pressed', index) }}
        width={50 * dataSwipe.listIcon2.length}
      >
        <View style={styles.itemSwipe}>
          <Text style={{ padding: HEIGHTXD(30) }}>Item Swipe with 2 icon</Text>
        </View>
      </SwipeableRowItem>
      <View style={{ marginTop: HEIGHTXD(40) }} />
      <SwipeableRowItem
        listIcon={dataSwipe.listIcon3}
        onPress={(index) => { showAlert(TYPE.SUCCESS, i18n.t('NOTIFICATION_T'), i18n.t('Save_successfully')); console.log('index of icon pressed', index) }}
        width={50 * dataSwipe.listIcon3.length}
      >
        <View style={styles.itemSwipe}>
          <Text style={{ padding: HEIGHTXD(30) }}>Item Swipe with 3 icon</Text>
        </View>
      </SwipeableRowItem>
    </View>
  )

  downLoadFile = () => {
    this.DownloadWithProgress.setModalVisible(true, 'http://www.africau.edu/images/default/sample.pdf', 'testdownfile', 'pdf')
  }

  saveToXlsx = () => {
    let data = [
      {
        id: 'Abc123',
        name: 'Nguyễn Văn A',
        age: 19,
        address: 'Hà Đông, Hà Nội',
        chucVu: 'Lớp trưởng',
        sdt: '0123456789',
      },
      {
        id: 'Abc124',
        name: 'Nguyễn Văn A',
        age: 19,
        address: 'Hà Đông, Hà Nội',
        chucVu: '',
        sdt: '0123456789',
      }]
    let name = 'testxlsx'
    this.SaveToXlsx.setModalVisible(true, data, name)
  }

  openPDF = () => {
    NavigationService.navigate(PdfViewer, { content: { sourcePDF: 'http://www.africau.edu/images/default/sample.pdf', title: 'Demo PDF Reader' } })
  }

  onShowImageViewer = () => {
    let images = [
      { source: { uri: 'https://internetviettel.vn/wp-content/uploads/2017/05/4-1.jpg', }, title: 'Vườn cây xanh lá' },
      { source: { uri: 'https://imagevars.gulfnews.com/2020/01/07/Ronaldo_16f7ffce168_large.jpg', }, title: 'CR7' },
    ]
    this.ImageViewer.setImageViewVisible(true, images)
  }

  onPickImage = () => {
    this.ImagePickerModal.setModalVisible(true)
  }

  onPickedImage = (images) => {
    console.log(images)
    this.setState({ images })
  }

  renderListImage = () => (
    <FlatList
      data={this.state.images}
      renderItem={({ item, index }) => (
        <Text numberOfLines={1} style={{ width: WIDTH(130) }}>{`${index + 1}. ${item.path.split('/').splice(-1)}`}</Text>
      )}

    />
  )

  onPickFile = async () => {
    let res = await FilePickerHelper()
    if (res !== null) {
      this.setState({ files: res })
    }
  }

  renderListFile = () => (
    <FlatList
      data={this.state.files}
      renderItem={({ item, index }) => (
        <Text numberOfLines={1} style={{ width: WIDTH(130) }}>{`${index + 1}. ${item.uri.split('/').splice(-1)}`}</Text>
      )}

    />
  )


  render() {
    return (
      <View style={{ flex: 1, paddingHorizontal: WIDTH(20), paddingTop: HEIGHT(30) }}>
        <DownloadWithProgress ref={ref => { this.DownloadWithProgress = ref }} />
        <SaveToXlsx ref={ref => { this.SaveToXlsx = ref }} />
        <ImageViewer ref={ref => { this.ImageViewer = ref }} />
        <ImagePickerModal onPickedImage={this.onPickedImage} ref={ref => { this.ImagePickerModal = ref }} />
        <DialogSearch
          ref={ref => { this.DialogSearch = ref }}
          onPressConfirm={(val) => {
            this.setState({ dataDialogSearch: val.toString() })
          }}
          titleStyle={{ fontSize: getFont(17) }}
          textContentStyle={{ fontSize: getFont(17) }}
          onValueChange={(val, index) => { console.log(val, index) }}
          buttonStyle={{ fontSize: getFont(17) }}
          textButtonStyle={{ fontSize: getFont(17) }}
          textButton="Hoàn thành"
          data={listField}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            1. Màn hình với TabHost
          </Text>

          <Text style={styles.title}>
            2. Show message
          </Text>
          {this.renderMess()}
          <Text style={styles.title}>
            3. Lưu cache
          </Text>
          {this.renderCache()}
          <Text style={styles.title}>
            4. Dialog với list dữ liệu
          </Text>
          {this.renderDialog()}
          <Text style={styles.title}>
            5. Autocomplete search
          </Text>
          {this.renderAutoComplete()}
          <Text style={styles.title}>
            6. Swipe listview
          </Text>
          {this.renderSwipe()}


          <Text style={styles.title}>
            7. Xem ảnh, xem file PDF, tải file
          </Text>
          <View style={styles.wrapperMes}>
            <TouchableOpacity
              onPress={() => this.onShowImageViewer()}
              style={styles.boxMessage}
            >
              <Text style={styles.textMes}>Xem ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.openPDF()}
              style={styles.boxMessage}
            >
              <Text style={styles.textMes}>Xem PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.downLoadFile()}
              style={[styles.boxMessage, { marginTop: HEIGHT(20) }]}
            >
              <Text style={styles.textMes}>Tải file</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>
            8. Lưu file dạng Xlsx
          </Text>
          <View style={styles.wrapperMes}>
            <TouchableOpacity
              onPress={() => this.saveToXlsx()}
              style={styles.boxMessage}
            >
              <Text style={styles.textMes}>Lưu tệp</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>
            9. Chọn ảnh , chọn file
          </Text>
          <View style={[styles.wrapperMes, { alignItems: 'flex-start' }]}>
            <View>
              <TouchableOpacity
                onPress={() => this.onPickImage()}
                style={styles.boxMessage}
              >
                <Text style={styles.textMes}>Chọn ảnh</Text>
              </TouchableOpacity>
              {this.renderListImage()}
            </View>
            <View>
              <TouchableOpacity
                onPress={() => this.onPickFile()}
                style={styles.boxMessage}
              >
                <Text style={styles.textMes}>Chọn file</Text>
              </TouchableOpacity>
              {this.renderListFile()}
            </View>
          </View>

          <Text style={styles.title}>
            10. Giao diện tờ trình, hóa đơn, thông tin chung
          </Text>
          <View style={styles.wrapperMes}>
            <TouchableOpacity
              onPress={() => NavigationService.navigate(ListStatement)}
              style={styles.boxMessage}
            >
              <Text style={styles.textMes}>Tờ trình</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => NavigationService.navigate(ListInvoice)}
              style={styles.boxMessage}
            >
              <Text style={styles.textMes}>Hóa đơn</Text>
            </TouchableOpacity>

          </View>
          <View style={[styles.wrapperMes, { paddingVertical: HEIGHT(10) }]}>
            <TouchableOpacity
              onPress={() => NavigationService.navigate(TabInvoice)}
              style={styles.boxMessage}
            >
              <Text style={styles.textMes}>Thông tin chung</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </View>
    )
  }
}
const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: getFont(17)
  },
  wrapperMes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: HEIGHT(20),
    paddingHorizontal: WIDTH(10),
    width: WIDTH(320),
    flexWrap: 'wrap'
  },
  wrapperItem: {
    justifyContent: 'center',
    paddingVertical: HEIGHT(20),
    paddingHorizontal: WIDTH(10),
    width: WIDTH(320)
  },
  boxMessage: {
    width: WIDTH(130),
    paddingVertical: HEIGHT(14),
    backgroundColor: R.colors.colorMain,
    borderRadius: HEIGHT(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textMes: {
    color: '#fff'
  },
  inputBox: {
    width: WIDTH(200),
    paddingVertical: HEIGHT(2),
    borderRadius: HEIGHT(8),
    minHeight: HEIGHT(52),
    paddingHorizontal: WIDTH(14),
    paddingRight: WIDTH(35),
    borderWidth: 1,
    borderColor: '#D3DEE8',
    justifyContent: 'center'
  },
  itemSwipe: {
    height: HEIGHTXD(200),
    width: WIDTHXD(935),
    borderRadius: WIDTHXD(15),
    borderWidth: 1,
    borderColor: '#ddd',
  }
})
