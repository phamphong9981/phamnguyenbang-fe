/* Cây KC (GDPT 2018) + mức nhận thức — port từ prototype Đánh giá kỹ năng. */
// ===================================================================
// ĐÁNH GIÁ KỸ NĂNG — dữ liệu cây KC (Knowledge Component)
// Nguồn: seed_kc_tree.sql (GDPT 2018) — 4 mạch · 17 chủ đề · 56 KC lá
// Sinh mock tiến độ học sinh (deterministic) + ngân hàng câu đã sai.
// ===================================================================

// ---- Mạch kiến thức (4 nút gốc) ----
export const A_MACH = [
  { tag: 'dai_so',            code: 'DAI_SO',   name: 'Đại số',               color: '#2563eb', bg: '#eff6ff' },
  { tag: 'giai_tich',         code: 'GIAI_TICH',name: 'Giải tích',            color: '#ea580c', bg: '#fff7ed' },
  { tag: 'hinh_hoc',          code: 'HINH_HOC', name: 'Hình học & đo lường',  color: '#7c3aed', bg: '#f5f3ff' },
  { tag: 'thong_ke_xac_suat', code: 'TKXS',     name: 'Thống kê & xác suất',  color: '#0d9488', bg: '#f0fdfa' },
];

// ---- Chủ đề (17) với KC lá (56) ----
export const A_TOPICS = [
  // ===== Đại số (7) =====
  { tag: 'menh_de_tap_hop', mach: 'dai_so', name: 'Mệnh đề và tập hợp', grade: 'g10', kcs: [
    { tag: 'menh_de', name: 'Mệnh đề toán học', diff: 2, desc: 'Phủ định, đảo, tương đương; điều kiện cần, đủ.' },
    { tag: 'tap_hop', name: 'Tập hợp và các phép toán', diff: 2, desc: 'Hợp, giao, hiệu, phần bù; biểu đồ Ven; đếm phần tử.' },
  ]},
  { tag: 'bpt_hai_an', mach: 'dai_so', name: 'BPT bậc nhất hai ẩn', grade: 'g10', kcs: [
    { tag: 'bpt_he_bpt_hai_an', name: 'BPT và hệ BPT bậc nhất hai ẩn', diff: 3, desc: 'Miền nghiệm; cực trị F = ax + by trên miền đa giác.' },
  ]},
  { tag: 'ham_so_dai_so', mach: 'dai_so', name: 'Hàm số và hàm bậc hai', grade: 'g10', kcs: [
    { tag: 'khai_niem_ham_so', name: 'Khái niệm hàm số và đồ thị', diff: 2, desc: 'Tập xác định, tập giá trị, đồng biến/nghịch biến.' },
    { tag: 'ham_so_bac_hai', name: 'Hàm số bậc hai và parabol', diff: 3, desc: 'Đỉnh, trục đối xứng; bài toán thực tiễn.' },
    { tag: 'dau_tam_thuc', name: 'Dấu tam thức bậc hai, BPT bậc hai', diff: 3, desc: 'Định lí dấu tam thức; giải BPT bậc hai một ẩn.' },
    { tag: 'pt_quy_bac_hai', name: 'Phương trình quy về bậc hai', diff: 3, desc: 'Phương trình chứa căn quy về bậc hai.' },
  ]},
  { tag: 'to_hop', mach: 'dai_so', name: 'Đại số tổ hợp', grade: 'g10', kcs: [
    { tag: 'quy_tac_dem', name: 'Quy tắc đếm', diff: 2, desc: 'Quy tắc cộng, nhân, sơ đồ hình cây.' },
    { tag: 'hoan_vi_chinh_hop_to_hop', name: 'Hoán vị, chỉnh hợp, tổ hợp', diff: 3, desc: 'Tính và vận dụng P, A, C.' },
    { tag: 'nhi_thuc_newton', name: 'Nhị thức Newton', diff: 3, desc: 'Khai triển (a+b)^n bằng tổ hợp.' },
  ]},
  { tag: 'luong_giac', mach: 'dai_so', name: 'Lượng giác', grade: 'g11', kcs: [
    { tag: 'gia_tri_luong_giac', name: 'Giá trị lượng giác và biến đổi', diff: 3, desc: 'Công thức cộng, nhân đôi, tích-tổng.' },
    { tag: 'ham_so_luong_giac', name: 'Hàm số lượng giác và đồ thị', diff: 3, desc: 'Tuần hoàn, chẵn lẻ; đồ thị sin, cos, tan.' },
    { tag: 'pt_luong_giac', name: 'Phương trình lượng giác', diff: 3, desc: 'Công thức nghiệm và vận dụng.' },
  ]},
  { tag: 'day_so_cap_so', mach: 'dai_so', name: 'Dãy số và cấp số', grade: 'g11', kcs: [
    { tag: 'day_so', name: 'Dãy số', diff: 2, desc: 'Tăng, giảm, bị chặn; cách cho dãy số.' },
    { tag: 'cap_so_cong', name: 'Cấp số cộng', diff: 3, desc: 'Số hạng tổng quát và tổng n số hạng đầu.' },
    { tag: 'cap_so_nhan', name: 'Cấp số nhân', diff: 3, desc: 'Số hạng tổng quát và tổng n số hạng đầu.' },
  ]},
  { tag: 'mu_logarit', mach: 'dai_so', name: 'Mũ và lôgarit', grade: 'g11', kcs: [
    { tag: 'luy_thua', name: 'Lũy thừa', diff: 2, desc: 'Số mũ nguyên, hữu tỉ, thực; rút gọn biểu thức.' },
    { tag: 'logarit', name: 'Lôgarit', diff: 3, desc: 'Khái niệm và tính chất phép tính lôgarit.' },
    { tag: 'ham_mu_ham_logarit', name: 'Hàm số mũ và lôgarit', diff: 3, desc: 'Nhận dạng, đồ thị, tính chất.' },
    { tag: 'pt_bpt_mu_logarit', name: 'PT, BPT mũ và lôgarit', diff: 4, desc: 'Giải PT/BPT; lãi suất, tăng trưởng.' },
  ]},
  // ===== Giải tích (4) =====
  { tag: 'gioi_han', mach: 'giai_tich', name: 'Giới hạn và hàm số liên tục', grade: 'g11', kcs: [
    { tag: 'gioi_han_day_so', name: 'Giới hạn dãy số', diff: 3, desc: 'Phép toán giới hạn; cấp số nhân lùi vô hạn.' },
    { tag: 'gioi_han_ham_so', name: 'Giới hạn hàm số', diff: 3, desc: 'Giới hạn hữu hạn, một phía, tại vô cực.' },
    { tag: 'ham_so_lien_tuc', name: 'Hàm số liên tục', diff: 3, desc: 'Liên tục tại điểm, trên khoảng, đoạn.' },
  ]},
  { tag: 'dao_ham', mach: 'giai_tich', name: 'Đạo hàm', grade: 'g11', kcs: [
    { tag: 'khai_niem_dao_ham', name: 'Khái niệm đạo hàm, tiếp tuyến', diff: 3, desc: 'Ý nghĩa hình học; PT tiếp tuyến tại một điểm.' },
    { tag: 'quy_tac_dao_ham', name: 'Quy tắc tính đạo hàm', diff: 3, desc: 'Tổng, hiệu, tích, thương; đạo hàm hàm hợp.' },
    { tag: 'dao_ham_cap_hai', name: 'Đạo hàm cấp hai', diff: 3, desc: 'Khái niệm và ứng dụng (gia tốc...).' },
  ]},
  { tag: 'khao_sat_ham_so', mach: 'giai_tich', name: 'Ứng dụng đạo hàm khảo sát hàm số', grade: 'g12', kcs: [
    { tag: 'tinh_don_dieu', name: 'Tính đơn điệu', diff: 3, desc: 'Đồng biến, nghịch biến qua dấu đạo hàm.' },
    { tag: 'cuc_tri', name: 'Cực trị của hàm số', diff: 3, desc: 'Điểm cực trị, giá trị cực trị.' },
    { tag: 'gtln_gtnn', name: 'GTLN, GTNN', diff: 3, desc: 'Giá trị lớn nhất, nhỏ nhất trên tập cho trước.' },
    { tag: 'tiem_can', name: 'Tiệm cận', diff: 3, desc: 'Tiệm cận ngang, đứng, xiên của đồ thị.' },
    { tag: 'khao_sat_do_thi', name: 'Khảo sát và vẽ đồ thị', diff: 4, desc: 'Sơ đồ khảo sát; đồ thị bậc ba, phân thức.' },
    { tag: 'ung_dung_dao_ham_thuc_tien', name: 'Bài toán tối ưu thực tiễn', diff: 4, desc: 'Chi phí, lợi nhuận, khoảng cách...' },
  ]},
  { tag: 'tich_phan', mach: 'giai_tich', name: 'Nguyên hàm và tích phân', grade: 'g12', kcs: [
    { tag: 'nguyen_ham', name: 'Nguyên hàm', diff: 3, desc: 'Bảng nguyên hàm; tính nguyên hàm cơ bản.' },
    { tag: 'tich_phan', name: 'Tích phân', diff: 3, desc: 'Định nghĩa, tính chất, tính tích phân.' },
    { tag: 'ung_dung_tich_phan', name: 'Ứng dụng tích phân', diff: 4, desc: 'Diện tích hình phẳng, thể tích khối.' },
  ]},
  // ===== Hình học (4) =====
  { tag: 'hinh_phang_co_so', mach: 'hinh_hoc', name: 'Hệ thức lượng và vectơ', grade: 'g10', kcs: [
    { tag: 'he_thuc_luong_tam_giac', name: 'Hệ thức lượng trong tam giác', diff: 3, desc: 'Định lí côsin, sin, diện tích, giải tam giác.' },
    { tag: 'vecto_phang', name: 'Vectơ và phép toán vectơ', diff: 3, desc: 'Tổng, hiệu, tích với số, tích vô hướng.' },
  ]},
  { tag: 'toa_do_phang', mach: 'hinh_hoc', name: 'Tọa độ trong mặt phẳng', grade: 'g10', kcs: [
    { tag: 'toa_do_vecto_phang', name: 'Tọa độ vectơ trong mặt phẳng', diff: 3, desc: 'Độ dài, biểu thức tọa độ các phép toán.' },
    { tag: 'duong_thang_phang', name: 'Phương trình đường thẳng', diff: 3, desc: 'PT tổng quát, tham số; góc, khoảng cách.' },
    { tag: 'duong_tron_phang', name: 'Phương trình đường tròn', diff: 3, desc: 'Tâm, bán kính, PT tiếp tuyến.' },
    { tag: 'ba_duong_conic', name: 'Ba đường conic', diff: 4, desc: 'PT chính tắc elip, hypebol, parabol.' },
  ]},
  { tag: 'khong_gian_tong_hop', mach: 'hinh_hoc', name: 'Quan hệ trong không gian', grade: 'g11', kcs: [
    { tag: 'duong_thang_mat_phang', name: 'Đường thẳng và mặt phẳng trong KG', diff: 3, desc: 'Giao tuyến, giao điểm, hình chóp - tứ diện.' },
    { tag: 'quan_he_song_song', name: 'Quan hệ song song', diff: 3, desc: 'Song song đường - đường, đường - mặt, mặt - mặt.' },
    { tag: 'quan_he_vuong_goc', name: 'Quan hệ vuông góc', diff: 4, desc: 'Định lí ba đường vuông góc; mặt phẳng vuông góc.' },
    { tag: 'goc_khoang_cach_kg', name: 'Góc và khoảng cách trong KG', diff: 4, desc: 'Góc nhị diện; khoảng cách hai đường chéo nhau.' },
    { tag: 'the_tich_khoi', name: 'Thể tích khối', diff: 4, desc: 'Thể tích hình chóp, lăng trụ, hình hộp.' },
  ]},
  { tag: 'toa_do_khong_gian', mach: 'hinh_hoc', name: 'Tọa độ trong không gian', grade: 'g12', kcs: [
    { tag: 'toa_do_vecto_kg', name: 'Tọa độ vectơ trong KG', diff: 3, desc: 'Vectơ và phép toán trong Oxyz.' },
    { tag: 'pt_mat_phang', name: 'Phương trình mặt phẳng', diff: 3, desc: 'PT tổng quát; song song, vuông góc; khoảng cách.' },
    { tag: 'pt_duong_thang_kg', name: 'Phương trình đường thẳng KG', diff: 4, desc: 'PT chính tắc, tham số; vị trí tương đối; góc.' },
    { tag: 'pt_mat_cau', name: 'Phương trình mặt cầu', diff: 3, desc: 'Tâm, bán kính; lập PT mặt cầu.' },
  ]},
  // ===== Thống kê & xác suất (2) =====
  { tag: 'thong_ke', mach: 'thong_ke_xac_suat', name: 'Thống kê', grade: 'g10', kcs: [
    { tag: 'so_gan_dung', name: 'Số gần đúng và sai số', diff: 2, desc: 'Sai số tuyệt đối, tương đối; quy tròn.' },
    { tag: 'so_dac_trung_trung_tam', name: 'Số đặc trưng xu thế trung tâm', diff: 3, desc: 'Trung bình, trung vị, tứ phân vị, mốt.' },
    { tag: 'so_dac_trung_phan_tan', name: 'Số đặc trưng độ phân tán', diff: 3, desc: 'Phương sai, độ lệch chuẩn, khoảng biến thiên.' },
  ]},
  { tag: 'xac_suat', mach: 'thong_ke_xac_suat', name: 'Xác suất', grade: 'g10', kcs: [
    { tag: 'xac_suat_co_dien', name: 'Xác suất cổ điển', diff: 3, desc: 'Không gian mẫu, biến cố; tính bằng tổ hợp.' },
    { tag: 'quy_tac_xac_suat', name: 'Quy tắc tính xác suất', diff: 3, desc: 'Biến cố hợp - giao, độc lập; cộng và nhân.' },
    { tag: 'xac_suat_co_dieu_kien', name: 'Xác suất có điều kiện, Bayes', diff: 4, desc: 'Xác suất toàn phần; công thức Bayes.' },
  ]},
];

// ---- Mức nhận thức ----
export const COG = {
  NB:  { key: 'NB',  name: 'Nhận biết',     color: '#64748b', bg: '#f1f5f9' },
  TH:  { key: 'TH',  name: 'Thông hiểu',    color: '#2563eb', bg: '#eff6ff' },
  VD:  { key: 'VD',  name: 'Vận dụng',      color: '#d97706', bg: '#fffbeb' },
  VDC: { key: 'VDC', name: 'Vận dụng cao',  color: '#e11d48', bg: '#fff1f2' },
};
export const COG_ORDER = ['NB', 'TH', 'VD', 'VDC'];
