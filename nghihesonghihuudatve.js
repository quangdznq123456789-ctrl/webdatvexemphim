const params = new URLSearchParams(window.location.search);

const maPhim = params.get("phim");

const danhSachPhim = {
  nghihe: "NGHỈ HÈ SỢ NGHỈ HƯU",

  spiderman: "SPIDERMAN",

  quyquyet: "QUỶ QUYỆT: RANH GIỚI VÔ ĐỊNH",

  theodyssey: "THE ODYSSEY",

  pawpatrol: "PAW PATROL: PHIM KHỦNG LONG",

  ngaytanphooak: "NGÀY TÀN CỦA PHỐ OAK",

  daichienkhonglo:
    "ĐẠI CHIẾN NGƯỜI KHỔNG LỒ: LẦN TẤN CÔNG CUỐI CÙNG (CHIẾU LẠI 2026)",

  diemmuu: "ĐIỂM MÙ",

  agito: "AGITO: CUỘC CHIẾN SIÊU NĂNG LỰC",

  thutinhguingoai: "THƯ TÌNH GỬI NGOẠI",

  conan: "PHIM ĐIỆN ẢNH THÁM TỬ LỪNG DANH CONAN: THIÊN THẦN XA NGÃ TRÊN XA LỘ",

  umamusume: "UMAMUSUME: PRETTY DERBY - KHỞI ĐẦU KỶ NGUYÊN MỚI",

  maxuonghom: "MA XƯỞNG HÒM",

  conannangdau: "THÁM TỬ LỪNG DANH CONAN: NÀNG DÂU HALLOWEEN",

  minions: "MINIONS & QUÁI VẬT: SỰ TRỞ LẠI CỦA GRU",

  moana: "HÀNH TRÌNH CỦA MOANA",

  shin: "PHIM SHIN – CẬU BÉ BÚT CHÌ: KỲ KỲ QUÁI QUÁI! KỲ NGHỈ YÊU QUÁI CỦA TỚ",
};

const tenPhim = danhSachPhim[maPhim];

if (!tenPhim) {
  alert("Không tìm thấy thông tin phim!");
}

const dates = document.querySelectorAll(".date");

const selectedDate = document.getElementById("selectedDate");

const times = document.querySelectorAll(".time");

const selectedTime = document.getElementById("selectedTime");

const selectedSeats = document.getElementById("selectedSeats");

const seatCount = document.getElementById("seatCount");

function capNhatGheDaDat() {
  const gioPhim = JSON.parse(localStorage.getItem("gioPhim")) || [];

  const ngay = selectedDate.textContent;

  const gio = selectedTime.textContent;

  if (ngay === "Chưa chọn" || gio === "Chưa chọn") {
    return;
  }

  const gheDaDat = [];

  gioPhim.forEach(function (ve) {
    if (ve.tenPhim === tenPhim && ve.ngay === ngay && ve.gio === gio) {
      ve.ghe.forEach(function (ghe) {
        gheDaDat.push(ghe);
      });
    }
  });

  document.querySelectorAll(".seat").forEach(function (seat) {
    const tenGhe = seat.textContent.trim();

    if (gheDaDat.includes(tenGhe)) {
      seat.classList.add("booked");

      seat.classList.remove("selected");
    } else {
      seat.classList.remove("booked");
    }
  });

  updateSeats();
}

dates.forEach((date) => {
  date.addEventListener("click", function () {
    // Bỏ active ngày cũ
    dates.forEach((item) => {
      item.classList.remove("active");
    });

    this.classList.add("active");

    selectedDate.textContent = this.innerText;

    capNhatGheDaDat();
  });
});

times.forEach((time) => {
  time.addEventListener("click", function () {
    times.forEach((item) => {
      item.classList.remove("active");
    });

    this.classList.add("active");

    selectedTime.textContent = this.innerText;

    capNhatGheDaDat();
  });
});

const seats = document.querySelectorAll(".seat");

seats.forEach((seat) => {
  seat.addEventListener("click", function () {
    if (this.classList.contains("booked")) {
      return;
    }

    this.classList.toggle("selected");

    updateSeats();
  });
});

function updateSeats() {
  const selected = document.querySelectorAll(".seat.selected");

  const seatNames = [];

  selected.forEach((seat) => {
    seatNames.push(seat.textContent.trim());
  });

  if (seatNames.length === 0) {
    selectedSeats.textContent = "Chưa chọn";
  } else {
    selectedSeats.textContent = seatNames.join(", ");
  }

  seatCount.textContent = seatNames.length;
}

const continueBtn = document.getElementById("continueBtn");

continueBtn.addEventListener("click", function () {
  const selected = document.querySelectorAll(".seat.selected");

  if (selectedDate.textContent === "Chưa chọn") {
    alert("Vui lòng chọn ngày!");

    return;
  }

  if (selectedTime.textContent === "Chưa chọn") {
    alert("Vui lòng chọn giờ chiếu!");

    return;
  }

  if (selected.length === 0) {
    alert("Vui lòng chọn ít nhất một ghế!");

    return;
  }

  const danhSachGhe = [];

  selected.forEach((seat) => {
    danhSachGhe.push(seat.textContent.trim());
  });

  const giaVe = 70000;

  const soLuongVe = danhSachGhe.length;

  const tongTien = soLuongVe * giaVe;

  const ve = {
    tenPhim: tenPhim,

    ngay: selectedDate.textContent,

    gio: selectedTime.textContent,

    ghe: danhSachGhe,

    soLuong: soLuongVe,

    giaVe: giaVe,

    tongTien: tongTien,
  };

  let gioPhim = JSON.parse(localStorage.getItem("gioPhim")) || [];

  gioPhim.push(ve);

  localStorage.setItem("gioPhim", JSON.stringify(gioPhim));

  alert(
    "Đã thêm vé vào giỏ!\n\n" +
      "Phim: " +
      tenPhim +
      "\n" +
      "Ngày: " +
      selectedDate.textContent +
      "\n" +
      "Giờ: " +
      selectedTime.textContent +
      "\n" +
      "Ghế: " +
      danhSachGhe.join(", ") +
      "\n" +
      "Số vé: " +
      soLuongVe +
      "\n" +
      "Tổng tiền: " +
      tongTien.toLocaleString("vi-VN") +
      "đ",
  );

  // ========================================
  // SANG GIỎ HÀNG
  // ========================================

  window.location.href = "giohang.html";
});
