import { createStackNavigator, createAppContainer } from 'react-navigation';
/**
 *  Home
 */
import TabMain from '../features/TabMain';
/**
 *  Intro
 */
import IntroScreen from '../features/Intro';
/**
 *  Notification
 */
import Notification from '../features/Notification'
/**
 *  Search
 */
import Search from '../features/Search'
/**
 *  Category
 */
import Category from '../features/Category'
/**
 *  ToTrinh
 */
import ListStatement from '../features/ListStatement/ListStatement'
import TabDetailStatement from '../features/Statement/DetailStatement/TabDetailStatement';
import TabAddStatement from '../features/Statement/AddStatement/TabAddStatement';
import DetailPrint from '../features/Statement/Detail'
/**
 * ApInvoice group statement
 */
import ListApInvoiceGroupStatement from '../features/ApInvoiceGroupStatement/ListApInvoiceGroupStatement/ListApInvoiceGroupStatement'
import TabAddApInvoiceGroupStatement from '../features/ApInvoiceGroupStatement/AddApInvoiceGroupStatement/TabAddApInvoiceGroupStatement'
import DetailPrintInvoiceGroup from '../features/ApInvoiceGroupStatement/Print/ViewPrint'

/*
/**
 *  Invoice
 */
import ListInvoice from '../features/Invoice/ListInvoice'
import DetailInvoice from '../features/Invoice/DetailInvoice';
import CreateInvoice from '../features/Invoice/CreateInvoice';
/**
 * VOffice
 */
import ListVOffice from '../features/VOffice/ListVOffice'
import CreateVOffice from '../features/VOffice/CreateVOffice'

/**
 * FileViewer
 */
import PdfViewer from '../common/FileViewer/PdfViewer'
/**
*  Trang Chu
 */
import Home from '../features/Home';

/**
 *  Profile
 */
import Profile from '../features/Profile';

// De Nghi Thanh Toan
import AdvanceRequest from '../features/AdvanceRequest';
import AdvanceRequestInfo from '../features/AdvanceRequest/Screens/index';
import DetailAttack from '../features/AdvanceRequest/Screens/Attack/Detail'
import ViewFileAttack from '../features/AdvanceRequest/Screens/Attack/ViewFileAttack'

/**
 * Danh Sach Khach Hang
 */
import ListCustomer from '../features/RequestPartner/ListRequestPartner/ListPartners';
import CreateCustomer from '../features/RequestPartner/TabRequestPartner/index';
import ListPartner from '../features/RequestPartner/ListRequestPartner/ListRequestPartners'
/**
 * SoLieuChiTiet
 */
import * as screenNames from './screenNames'
import PrintedVotes from '../common/PrintedVotes'

console.disableYellowBox = true;

const AppNavigator = createStackNavigator(
  {
    [screenNames.IntroScreen]: { screen: IntroScreen },
    [screenNames.TabMain]: { screen: TabMain },
    [screenNames.Search]: { screen: Search },
    [screenNames.Notification]: { screen: Notification },
    [screenNames.Category]: { screen: Category },
    [screenNames.ListStatement]: { screen: ListStatement },
    [screenNames.TabDetailStatement]: { screen: TabDetailStatement },
    [screenNames.TabAddStatement]: { screen: TabAddStatement },
    [screenNames.ListInvoice]: { screen: ListInvoice },
    [screenNames.PdfViewer]: { screen: PdfViewer },
    [screenNames.DetailInvoice]: { screen: DetailInvoice },
    [screenNames.Home]: { screen: Home },
    [screenNames.Profile]: { screen: Profile },
    [screenNames.AdvanceRequest]: { screen: AdvanceRequest },
    [screenNames.CreateInvoice]: { screen: CreateInvoice },
    [screenNames.AdvanceRequestInfo]: { screen: AdvanceRequestInfo },
    [screenNames.ListApInvoiceGroupStatement]: { screen: ListApInvoiceGroupStatement },
    [screenNames.TabAddApInvoiceGroupStatement]: { screen: TabAddApInvoiceGroupStatement },
    [screenNames.ListCustomer]: { screen: ListCustomer },
    [screenNames.CreateCustomer]: { screen: CreateCustomer },
    [screenNames.ListPartner]: { screen: ListPartner },
    [screenNames.ListVOffice]: { screen: ListVOffice },
    [screenNames.CreateVOffice]: { screen: CreateVOffice },
    [screenNames.PrintedVotes]: { screen: PrintedVotes },
    [screenNames.DetailAttack]: { screen: DetailAttack },
    [screenNames.DetailPrint]: { screen: DetailPrint },
    [screenNames.ViewFileAttack]: { screen: ViewFileAttack },
    [screenNames.DetailPrintInvoiceGroup]: { screen: DetailPrintInvoiceGroup }
  },
  {
    initialRouteName: screenNames.TabMain,
    headerMode: 'none'
  }
);
export default createAppContainer(AppNavigator);
