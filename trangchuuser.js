const movieList = document.getElementById("movieList");

const timKiemTheLoai = document.getElementById("timKiemTheLoai");
const chonTheLoai = document.getElementById("chonTheLoai");

let tatCaPhim = [];

// ===============================
// TẢI PHIM TỪ SQL
// ===============================
async function loadMovies() {
  try {
    const response = await fetch("http://localhost:3000/api/phim");

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách phim");
    }

    const movies = await response.json();

    // Lưu toàn bộ phim
    tatCaPhim = movies;

    // Tạo danh sách thể loại
    taoDanhSachTheLoai(movies);

    // QUAN TRỌNG:
    // Khi mới mở trang -> hiện TẤT CẢ phim
    hienThiPhim(tatCaPhim);
  } catch (error) {
    console.error("Lỗi tải phim:", error);

    movieList.innerHTML = `
            <p style="text-align:center; color:red;">
                Không thể tải danh sách phim!
            </p>
        `;
  }
}

// ===============================
// TẠO DANH SÁCH THỂ LOẠI
// ===============================
function taoDanhSachTheLoai(movies) {
  chonTheLoai.innerHTML = `
        <option value="">Tất cả thể loại</option>
    `;

  const danhSachTheLoai = [];

  movies.forEach(function (movie) {
    if (!movie.TheLoai) {
      return;
    }

    // Nếu SQL có nhiều thể loại kiểu:
    // "Hành động, Phiêu lưu"
    const cacTheLoai = movie.TheLoai.split(",");

    cacTheLoai.forEach(function (theLoai) {
      const tenTheLoai = theLoai.trim();

      if (tenTheLoai !== "" && !danhSachTheLoai.includes(tenTheLoai)) {
        danhSachTheLoai.push(tenTheLoai);
      }
    });
  });

  danhSachTheLoai.sort();

  danhSachTheLoai.forEach(function (theLoai) {
    const option = document.createElement("option");

    option.value = theLoai;
    option.textContent = theLoai;

    chonTheLoai.appendChild(option);
  });
}

// ===============================
// HIỂN THỊ PHIM
// ===============================
function hienThiPhim(movies) {
  movieList.innerHTML = "";

  // Nếu không có phim
  if (movies.length === 0) {
    movieList.innerHTML = `
            <p style="
                text-align:center;
                color:#aaa;
                font-size:18px;
                margin-top:40px;
            ">
                Không tìm thấy phim phù hợp.
            </p>
        `;

    return;
  }

  // ===============================
  // PHIM ĐANG CHIẾU
  // ===============================
  const khuVucDangChieu = document.createElement("section");

  khuVucDangChieu.id = "dangChieu";
  khuVucDangChieu.className = "khu-vuc-phim";

  const tieuDeDangChieu = document.createElement("h2");

  tieuDeDangChieu.className = "tieu-de-phim";
  tieuDeDangChieu.textContent = "PHIM ĐANG CHIẾU";

  const danhSachDangChieu = document.createElement("div");

  danhSachDangChieu.className = "ds-phim";

  // ===============================
  // PHIM NGỪNG CHIẾU
  // ===============================
  const khuVucNgungChieu = document.createElement("section");

  khuVucNgungChieu.id = "ngungChieu";
  khuVucNgungChieu.className = "khu-vuc-phim khu-vuc-ngung";

  const tieuDeNgungChieu = document.createElement("h2");

  tieuDeNgungChieu.className = "tieu-de-phim";
  tieuDeNgungChieu.textContent = "PHIM NGỪNG CHIẾU";

  const danhSachNgungChieu = document.createElement("div");

  danhSachNgungChieu.className = "ds-phim";

  // ===============================
  // TẠO CARD PHIM
  // ===============================
  movies.forEach(function (movie) {
    const card = document.createElement("div");

    card.className = "main";

    // Ảnh
    const img = document.createElement("img");

    img.src = movie.AnhPhim || "./icon.jpg";
    img.alt = movie.TenPhim;

    // Tên phim
    const tenPhim = document.createElement("h4");

    tenPhim.textContent = movie.TenPhim;

    // Thể loại
    const theLoai = document.createElement("p");

    theLoai.innerHTML =
      "<strong>Thể loại:</strong> " + (movie.TheLoai || "Chưa cập nhật");

    // Đạo diễn
    const daoDien = document.createElement("p");

    daoDien.innerHTML =
      "<strong>Đạo diễn:</strong> " + (movie.DaoDien || "Chưa cập nhật");

    // Thời lượng
    const thoiLuong = document.createElement("p");

    thoiLuong.innerHTML =
      "<strong>Thời lượng:</strong> " +
      (movie.ThoiLuong || "Chưa cập nhật") +
      " phút";

    // Nút
    const button = document.createElement("button");

    button.className = "btn btn-outline-primary";

    // ===============================
    // KIỂM TRA TRẠNG THÁI
    // ===============================
    if (movie.TrangThai === "Hoạt động") {
      button.textContent = "ĐẶT VÉ";

      button.onclick = function () {
        window.location.href =
          "./chitietphim.html?TenPhim=" + encodeURIComponent(movie.TenPhim);
      };
    } else {
      button.textContent = "NGỪNG CHIẾU";

      button.disabled = true;
    }

    // Thêm vào card
    card.appendChild(img);
    card.appendChild(tenPhim);
    card.appendChild(theLoai);
    card.appendChild(daoDien);
    card.appendChild(thoiLuong);
    card.appendChild(button);

    // Đưa phim vào đúng khu vực
    if (movie.TrangThai === "Ngừng chiếu") {
      danhSachNgungChieu.appendChild(card);
    } else {
      danhSachDangChieu.appendChild(card);
    }
  });

  khuVucDangChieu.appendChild(tieuDeDangChieu);
  khuVucDangChieu.appendChild(danhSachDangChieu);

  khuVucNgungChieu.appendChild(tieuDeNgungChieu);
  khuVucNgungChieu.appendChild(danhSachNgungChieu);

  movieList.appendChild(khuVucDangChieu);
  movieList.appendChild(khuVucNgungChieu);
}

function locPhim() {
  const tuKhoa = timKiemTheLoai.value.trim().toLowerCase();

  const theLoai = chonTheLoai.value.trim().toLowerCase();

  if (tuKhoa === "" && theLoai === "") {
    hienThiPhim(tatCaPhim);

    return;
  }

  const phimLoc = tatCaPhim.filter(function (movie) {
    const danhSachTheLoai = (movie.TheLoai || "").toLowerCase();

    const dungTuKhoa = tuKhoa === "" || danhSachTheLoai.includes(tuKhoa);

    const dungTheLoai = theLoai === "" || danhSachTheLoai.includes(theLoai);

    return dungTuKhoa && dungTheLoai;
  });

  hienThiPhim(phimLoc);
}

timKiemTheLoai.addEventListener("input", locPhim);

chonTheLoai.addEventListener("change", locPhim);

function cuonDenPhim(id) {
  const khuVuc = document.getElementById(id);

  if (khuVuc) {
    khuVuc.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

loadMovies();
