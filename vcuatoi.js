const API = "http://localhost:3000/api";

// ============================
// LẤY TÀI KHOẢN ĐANG ĐĂNG NHẬP
// ============================

const user = JSON.parse(localStorage.getItem("user"));

if (!user || !user.MaTaiKhoan) {
  alert("Bạn chưa đăng nhập!");
  window.location.href = "indexdangnhap.html";
  throw new Error("Không tìm thấy tài khoản");
}

const maTaiKhoan = user.MaTaiKhoan;

console.log("Tài khoản đang xem vé:", user);
console.log("MaTaiKhoan:", maTaiKhoan);

// ============================
// LẤY DANH SÁCH VÉ
// ============================

async function loadVe() {
  try {
    const response = await fetch(`${API}/vemyt/${maTaiKhoan}`);

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách vé");
    }

    const danhSachVe = await response.json();

    console.log("Danh sách vé:", danhSachVe);

    hienThiVe(danhSachVe);
  } catch (error) {
    console.error("Lỗi:", error);

    const container = document.getElementById("danhSachVe");

    if (container) {
      container.innerHTML = `
        <p class="text-danger">
          Không thể tải danh sách vé.
        </p>
      `;
    }
  }
}

// ============================
// HIỂN THỊ VÉ
// ============================

function hienThiVe(danhSachVe) {
  const container = document.getElementById("danhSachVe");

  if (!container) {
    console.error("Không tìm thấy #danhSachVe");
    return;
  }

  container.innerHTML = "";

  if (!danhSachVe || danhSachVe.length === 0) {
    container.innerHTML = `
      <p>Bạn chưa có vé nào.</p>
    `;
    return;
  }

  danhSachVe.forEach((ve) => {
    const div = document.createElement("div");

    div.className = "ve-item";

    div.innerHTML = `
      <h4>${ve.TenPhim || "Không xác định"}</h4>

      <p>
        <strong>Phòng:</strong>
        ${ve.TenPhong || "Không xác định"}
      </p>

      <p>
        <strong>Ngày chiếu:</strong>
        ${formatNgay(ve.NgayChieu)}
      </p>

      <p>
        <strong>Giờ chiếu:</strong>
        ${formatGio(ve.GioChieu)}
      </p>

      <p>
        <strong>Ghế:</strong>
        ${ve.Ghe || "Không xác định"}
      </p>

      <p>
        <strong>Tổng tiền:</strong>
        ${formatTien(ve.TongTien)}
      </p>

      <p>
        <strong>Thanh toán:</strong>
        ${ve.PhuongThucThanhToan || "Không xác định"}
      </p>

      <p>
        <strong>Trạng thái:</strong>
        ${ve.TrangThai || "Không xác định"}
      </p>

      <hr>
    `;

    container.appendChild(div);
  });
}

// ============================
// FORMAT TIỀN
// ============================

function formatTien(tien) {
  if (tien === null || tien === undefined || tien === "") {
    return "0đ";
  }

  return Number(tien).toLocaleString("vi-VN") + "đ";
}

// ============================
// FORMAT NGÀY
// ============================

function formatNgay(ngay) {
  if (!ngay) return "Không xác định";

  const date = new Date(ngay);

  if (isNaN(date.getTime())) {
    return ngay;
  }

  return date.toLocaleDateString("vi-VN");
}

// ============================
// FORMAT GIỜ
// ============================

function formatGio(gio) {
  if (!gio) return "Không xác định";

  console.log("GioChieu nhận được:", gio);
  console.log("Kiểu dữ liệu:", typeof gio);

  // Trường hợp SQL trả về:
  // "19:30:00"
  // "19:30"
  if (typeof gio === "string") {
    const match = gio.match(/(\d{2}):(\d{2})/);

    if (match) {
      return `${match[1]}:${match[2]}`;
    }
  }

  // Trường hợp GioChieu là Date/object
  const date = new Date(gio);

  if (!isNaN(date.getTime())) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  return String(gio);
}

// ============================
// CHẠY
// ============================

loadVe();
