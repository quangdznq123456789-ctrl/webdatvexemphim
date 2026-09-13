const API = "http://localhost:3000/api";

// ============================
// LẤY THÔNG TIN ĐẶT VÉ
// ============================

const thongTin = JSON.parse(localStorage.getItem("thongTinDatVe"));

const user = JSON.parse(localStorage.getItem("user"));

// ============================
// KIỂM TRA THÔNG TIN
// ============================

if (!thongTin) {
  alert("Không có thông tin đặt vé");
  window.location.href = "index.html";
  throw new Error("Không có thông tin đặt vé");
}

if (!user || !user.MaTaiKhoan) {
  alert("Không tìm thấy tài khoản đăng nhập!");
  window.location.href = "indexdangnhap.html";
  throw new Error("Không có MaTaiKhoan");
}

const maTaiKhoan = user.MaTaiKhoan;

console.log("Tài khoản hiện tại:", user);
console.log("MaTaiKhoan:", maTaiKhoan);

// ============================
// HIỂN THỊ THÔNG TIN VÉ
// ============================

document.getElementById("phim").textContent = thongTin.tenPhim;

document.getElementById("phong").textContent = thongTin.tenPhong;

document.getElementById("ngay").textContent = formatNgay(thongTin.ngayChieu);

document.getElementById("gio").textContent = formatGio(thongTin.gioChieu);

// ============================
// HIỂN THỊ GHẾ
// ============================

async function hienThiGhe() {
  try {
    const response = await fetch(`${API}/ghe/${thongTin.maSuatChieu}`);

    if (!response.ok) {
      throw new Error("Không lấy được danh sách ghế");
    }

    const data = await response.json();

    const danhSachMaGhe = thongTin.ghe.map((maGhe) => Number(maGhe));

    const danhSachTenGhe = data
      .filter((ghe) => danhSachMaGhe.includes(Number(ghe.MaGhe)))
      .map((ghe) => ghe.SoGhe);

    document.getElementById("ghe").textContent =
      danhSachTenGhe.length > 0 ? danhSachTenGhe.join(", ") : "Không xác định";
  } catch (error) {
    console.error("Lỗi hiển thị ghế:", error);

    document.getElementById("ghe").textContent = "Không thể tải ghế";
  }
}

hienThiGhe();

// ============================
// HIỂN THỊ DỊCH VỤ
// ============================

document.getElementById("dichvu").textContent = thongTin.dichVu.TenDichVu;

// Số lượng combo
if (document.getElementById("soLuongDichVu")) {
  document.getElementById("soLuongDichVu").textContent =
    thongTin.soLuongDichVu || 0;
}

// ============================
// HIỂN THỊ NƯỚC
// ============================

if (thongTin.nuoc) {
  document.getElementById("nuoc").textContent = thongTin.nuoc.TenNuoc;

  document.getElementById("soLuongNuoc").textContent =
    thongTin.soLuongNuoc || 0;
} else {
  document.getElementById("nuocRow").style.display = "none";

  if (document.getElementById("soLuongNuocRow")) {
    document.getElementById("soLuongNuocRow").style.display = "none";
  }
}

// ============================
// HIỂN THỊ TỔNG TIỀN
// ============================

document.getElementById("tongTien").textContent = formatTien(thongTin.tongTien);

// ============================
// CHỌN PHƯƠNG THỨC THANH TOÁN
// ============================

document.querySelectorAll('input[name="payment"]').forEach((input) => {
  input.addEventListener("change", function () {
    if (this.value === "Thanh toán ngân hàng") {
      document.getElementById("bankBox").style.display = "block";

      document.getElementById("noiDungCK").textContent =
        `VE ${thongTin.tenPhim}`;
    } else {
      document.getElementById("bankBox").style.display = "none";
    }
  });
});

// ============================
// NÚT XÁC NHẬN ĐẶT VÉ
// ============================

document
  .getElementById("btnThanhToan")
  .addEventListener("click", async function () {
    // ============================
    // KIỂM TRA PHƯƠNG THỨC
    // ============================

    const payment = document.querySelector('input[name="payment"]:checked');

    if (!payment) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    // ============================
    // HỎI XÁC NHẬN
    // ============================

    const xacNhan = confirm(`Bạn có chắc chắn đặt vé: ${thongTin.tenPhim}?`);

    // Người dùng bấm HỦY
    if (!xacNhan) {
      return;
    }

    // ============================
    // KIỂM TRA TÀI KHOẢN
    // ============================

    const maTaiKhoan = Number(user.MaTaiKhoan);

    if (!maTaiKhoan || isNaN(maTaiKhoan)) {
      alert("Mã tài khoản không hợp lệ!");
      return;
    }

    // ============================
    // DỮ LIỆU GỬI BACKEND
    // ============================

    const data = {
      maTaiKhoan: maTaiKhoan,

      maSuatChieu: thongTin.maSuatChieu,

      ghe: thongTin.ghe,

      tongTien: thongTin.tongTien,

      phuongThucThanhToan: payment.value,

      dichVu: [
        {
          maDichVu: thongTin.dichVu.MaDichVu,

          maNuoc: thongTin.nuoc ? thongTin.nuoc.MaNuoc : null,

          soLuong: Number(thongTin.soLuongDichVu) || 0,

          donGia: Number(thongTin.dichVu.Gia),
        },
      ],
    };

    console.log("Dữ liệu gửi lên backend:", data);

    // ============================
    // GỬI ĐẶT VÉ
    // ============================

    try {
      const response = await fetch(`${API}/datve`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log("Backend trả về:", result);

      // ============================
      // ĐẶT VÉ THẤT BẠI
      // ============================

      if (!response.ok) {
        alert(result.message || "Đặt vé thất bại");

        return;
      }

      // ============================
      // ĐẶT VÉ THÀNH CÔNG
      // ============================

      localStorage.setItem("maDatVe", result.maDatVe);

      localStorage.removeItem("thongTinDatVe");

      alert("Đặt vé thành công!");

      // ============================
      // VỀ TRANG CHỦ
      // ============================

      window.location.href = "dangnhapxong.html";
    } catch (error) {
      console.error("Lỗi đặt vé:", error);

      alert("Không thể kết nối server");
    }
  });

// ============================
// FORMAT
// ============================

function formatTien(tien) {
  return Number(tien).toLocaleString("vi-VN") + "đ";
}

function formatNgay(ngay) {
  if (!ngay) return "";

  return new Date(ngay).toLocaleDateString("vi-VN");
}

function formatGio(gio) {
  if (!gio) return "";

  return gio.substring(0, 5);
}
