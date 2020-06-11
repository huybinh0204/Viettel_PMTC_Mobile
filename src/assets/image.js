import { ImageSetting } from '../config';

/* eslint-disable global-require */
//
const images = {
  // general
  bg_cannot_connect: require('./images/general/bg_cannot_connect.png'),
  app_icon: require('./images/general/app_icon.png'),
  ic_upgrade: require('./images/general/ic_upgrade.png'),
  iconDropdown: require('./images/general/iconDropdown.png'),
  iconDown: require('./images/general/iconDown.png'),
  iconCalendar: require('./images/general/iconCalendar.png'),
  iconSearchs: require('./images/general/iconSearch.png'),
  iconCO: require('./images/menu/co.png'),
  iconRA: require('./images/menu/ra.png'),
  iconPrint: require('./images/menu/print.png'),
  iconDelete: require('./images/general/iconDelete.png'),
  iconEdit: require('./images/general/iconEdit.png'),
  iconCoppy: require('./images/general/iconCoppy.png'),
  drop: require('./images/general/drop.png'),
  arrowR: require('./images/general/arrowR.png'),
  arrowView: require('./images/general/arrowView.png'),
  iconCheck: require('./images/general/iconCheck.png'),
  iconUnCheck: require('./images/general/iconUnCheck.png'),
  // Home
  avatar: require('./images/avatar.png'),
  bangTHTT: require('./images/home/bangTHTT.png'),
  deNghi: require('./images/home/deNghi.png'),
  toTrinh: require('./images/home/toTrinh.png'),
  hoaDon: require('./images/home/hoaDon.png'),
  // Dropdonw Alert
  iconSuccess: require('./images/general/iconSuccess.png'),
  iconError: require('./images/general/iconError.png'),
  iconNotification: require('./images/general/iconNotification.png'),
  warnIcon: require('./images/general/warnIcon.png'),
  circleCheck: require('./images/general/circleCheck.png'),
  // notification
  iconAvatarNoti: require('./images/notification/iconAvatarNoti.png'),
  iconReadALl: require('./images/notification/iconReadAll.png'),
  // category
  iconCal: require('./images/category/iconCal.png'),
  iconLogout: require('./images/category/iconLogout.png'),
  iconPeople: require('./images/category/iconPeople.png'),
  iconReport: require('./images/category/iconReport.png'),
  iconSetting: require('./images/category/iconSetting.png'),
  accountantPay: require('./images/category/accountantPay.png'),
  accountingGeneral: require('./images/category/accountingGeneral.png'),
  accountingProperty: require('./images/category/accountingProperty.png'),
  accountingRecept: require('./images/category/accountingRecept.png'),
  categoryGeneral: require('./images/category/categoryGeneral.png'),
  managementInventory: require('./images/category/managementInventory.png'),

  // statement
  iconFilter: require('./images/statement/iconFilter.png'),
  iconSearch: require('./images/statement/iconSearch.png'),
  // menu
  iconRadActive: require('./images/menu/ra.png'),
  iconRadInActive: require('./images/menu/rad.png'),
  iconCodActive: require('./images/menu/co.png'),
  iconRadInActive: require('./images/menu/cod.png'),
  iconSubmitdActive: require('./images/menu/submit.png'),
  iconSubmitdInActive: require('./images/menu/submitd.png'),
  iconSaveActive: require('./images/menu/save.png'),
  iconSaveInActive: require('./images/menu/saved.png'),
  iconPrintActive: require('./images/menu/print.png'),
  iconPrintInActive: require('./images/menu/printd.png'),
  iconAttackActive: require('./images/menu/attack.png'),
  iconAttackInActive: require('./images/menu/attackd.png'),
  // invoice
  iconEyeHide: require('./images/invoice/iconEyeHide.png'),
  openEye: require('./images/invoice/openEye.png'),
  iconSave: require('./images/invoice/iconSave.png'),
  iconAttack: require('./images/invoice/iconAttack.png'),
  invoice: {
    save: {
      out: require('./images/menu/savep.png'),
      in: require('./images/menu/save.png'),
      disable: require('./images/menu/saved.png')
    },
    attach: {
      out: require('./images/menu/attackp.png'),
      in: require('./images/menu/attack.png'),
      disable: require('./images/menu/attackd.png')
    },
  },
  // voffice
  voffice: {
    save: {
      out: require('./images/menu/savep.png'),
      in: require('./images/menu/save.png'),
      disable: require('./images/menu/saved.png')
    },
    co: {
      out: require('./images/menu/cop.png'),
      in: require('./images/menu/co.png'),
      disable: require('./images/menu/cod.png')
    },
    attach: {
      out: require('./images/menu/attackp.png'),
      in: require('./images/menu/attack.png'),
      disable: require('./images/menu/attackd.png')
    },
  },

  // attachment
  img_camera: require('./images/attack/img_camera.png'),
  img_file: require('./images/attack/img_file.png'),
  img_gallery: require('./images/attack/img_gallery.png'),

  // ic filetype
  ic_doc: require('./images/filetype/ic_doc.png'),
  ic_jpg: require('./images/filetype/ic_jpg.png'),
  ic_pdf: require('./images/filetype/ic_pdf.png'),
  ic_xlsx: require('./images/filetype/ic_xlsx.png'),
  // invoice group
  iconCreateAdvanceRequest: require('./images/invoicegroup/createAdvanceRequest.png'),
  iconAdd: require('./images/invoicegroup/add.png'),
  iconDeleteStament: require('./images/invoicegroup/delete.png'),

  ...ImageSetting,
};

export default images;
