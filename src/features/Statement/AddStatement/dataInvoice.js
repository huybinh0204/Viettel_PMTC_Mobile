const FakeData = {
  THONG_TIN_CHUNG: {
    mauSoHD: '01GTKT/001',
    kyHieu: 'AA/20E',
    soHoaDon: 212152,
    maSoThue: '0134566780012',
    tenNguoiBan: 'Nguyễn Văn B',
    diaChi: 'Nguyễn Trãi, Thanh Xuân, Hà Đông',
    content: 'Nội dung tên hàng hóa/ dịch vụ',
    KIEU_HOA_DON: [
      {
        id: '5e3e84ff8f0a289dd1515db6',
        name: 'Tờ trình quản lý chi phí',
        value: 'TT01'
      },
      {
        id: '5e3e84fff13bb249772e090b',
        name: 'Tờ trình quản lý chất lượng',
        value: 'TT02'
      },
    ],
    LOAI_HANG_HOA_DICH_VU: [
      {
        id: '5e3e84ff8f0a289dd1515db6',
        name: 'Hàng hóa - dịch vụ thông thường',
      },
      {
        id: '5e3e84fff13bb249772e090b',
        name: 'Hàng hóa - dịch vụ cao cấp',
      },
    ]
  },
  THONG_TIN_SO_TIEN: {
    tienTe: [
      {
        id: '5e3e84fff13bb249772e090b',
        name: 'VND',
      },
      {
        id: '5e3e84fff13bb249772e40b',
        name: 'USD',
      },
    ],
    tyGia: '',
  },
  THONG_TIN_QUAN_TRI: {
    phuongThucThanhToan: [
      {
        id: '5e3e84fff13bb249772e090b',
        name: 'Ủy nhiệm chi',
      },
      {
        id: '5e3e84fff13bb249772e40b',
        name: 'Thanh toán qua Airpay',
      },
      {
        id: '5e3e84fff13bb249772e05b',
        name: 'Ví điện tử Momo',
      },
      {
        id: '5e3e84fff13bb249772e096',
        name: 'Thanh toán trực tiếp',
      },
    ]
  }
}

export const TIEN_TE = [
  {
    type: 'Tiền trước thuế',
    deNghi: '1.000.000',
    duocDuyet: '1.000.000'
  },
  {
    type: 'Tiền thuế',
    deNghi: '100.000',
    duocDuyet: '100.000'
  },
  {
    type: 'Tổng tiền',
    deNghi: '1.000.000',
    duocDuyet: '1.000.000'
  }
]
export default FakeData;
