const formData = {
  football: {
    label: "Áo đấu thể thao",
    forms: {
      football_one_shirt: {
        name: "Khung 1 áo đấu",
        note: "Dành cho khách đặt 1 áo đấu kèm tên, số áo và phụ kiện.",
        fields: [
          { id: "customerName", label: "Họ tên khách hàng", type: "text", required: true },
          { id: "phone", label: "Số điện thoại", type: "tel", required: true },
          { id: "shirtName", label: "Tên trên áo", type: "text", required: true },
          { id: "shirtNumber", label: "Số áo", type: "text", required: true },
          { id: "team", label: "CLB / đội tuyển", type: "text", required: true },
          { id: "mainColor", label: "Màu áo mong muốn", type: "text" },
          {
            id: "accessories",
            label: "Phụ kiện thêm",
            type: "select",
            options: ["Không thêm", "Bóng", "Cúp", "Huy chương", "Bóng + Cúp", "Bóng + Cúp + Huy chương"]
          },
          {
            id: "frameSize",
            label: "Kích thước khung",
            type: "select",
            options: ["15 x 21 cm", "21 x 30 cm", "Size khác"]
          },
          { id: "address", label: "Địa chỉ nhận hàng", type: "text", required: true, full: true },
          { id: "referenceImage", label: "Link ảnh mẫu nếu có", type: "text", full: true },
          { id: "note", label: "Ghi chú thêm", type: "textarea", full: true }
        ]
      },

      football_two_shirts: {
        name: "Khung 2 áo đấu",
        note: "Dành cho khách muốn làm 2 áo trong cùng 1 khung.",
        fields: [
          { id: "customerName", label: "Họ tên khách hàng", type: "text", required: true },
          { id: "phone", label: "Số điện thoại", type: "tel", required: true },
          { id: "shirtName1", label: "Tên áo thứ nhất", type: "text", required: true },
          { id: "shirtNumber1", label: "Số áo thứ nhất", type: "text", required: true },
          { id: "shirtName2", label: "Tên áo thứ hai", type: "text", required: true },
          { id: "shirtNumber2", label: "Số áo thứ hai", type: "text", required: true },
          { id: "team", label: "CLB / đội tuyển", type: "text" },
          {
            id: "layout",
            label: "Bố cục mong muốn",
            type: "select",
            options: ["2 áo ngang nhau", "1 áo trái - 1 áo phải", "Shop tự căn bố cục"]
          },
          { id: "address", label: "Địa chỉ nhận hàng", type: "text", required: true, full: true },
          { id: "note", label: "Ghi chú thêm", type: "textarea", full: true }
        ]
      }
    }
  },

  uniform: {
    label: "Quân phục / Công an",
    forms: {
      uniform_one_shirt: {
        name: "Khung 1 áo quân phục",
        note: "Dành cho khách đặt 1 áo quân phục/công an cơ bản.",
        fields: [
          { id: "customerName", label: "Họ tên khách hàng", type: "text", required: true },
          { id: "phone", label: "Số điện thoại", type: "tel", required: true },
          {
            id: "uniformType",
            label: "Loại áo",
            type: "select",
            options: ["Công an", "Bộ đội", "PCCC", "Hải quân", "Phòng không không quân", "Khác"]
          },
          { id: "nameTag", label: "Tên trên bảng tên", type: "text", required: true },
          { id: "rank", label: "Cấp bậc", type: "text", placeholder: "Ví dụ: Trung úy, Đại úy..." },
          { id: "shoulder", label: "Cầu vai", type: "text", placeholder: "Ví dụ: 2 sao 1 vạch, 3 sao 2 vạch..." },
          {
            id: "frameSize",
            label: "Kích thước khung",
            type: "select",
            options: ["15 x 21 cm", "21 x 30 cm", "Size khác"]
          },
          { id: "address", label: "Địa chỉ nhận hàng", type: "text", required: true, full: true },
          { id: "referenceImage", label: "Link ảnh mẫu nếu có", type: "text", full: true },
          { id: "note", label: "Ghi chú thêm", type: "textarea", full: true }
        ]
      },

      uniform_with_id: {
        name: "Quân phục có bảng tên + số hiệu",
        note: "Dành cho mẫu cần ghi rõ bảng tên, số hiệu, đơn vị hoặc mã ngành.",
        fields: [
          { id: "customerName", label: "Họ tên khách hàng", type: "text", required: true },
          { id: "phone", label: "Số điện thoại", type: "tel", required: true },
          { id: "nameTag", label: "Tên trên bảng tên", type: "text", required: true },
          { id: "idNumber", label: "Số hiệu / mã số", type: "text", required: true },
          { id: "unit", label: "Đơn vị / lớp / khóa", type: "text" },
          { id: "rank", label: "Cấp bậc", type: "text", required: true },
          {
            id: "shoulderStar",
            label: "Số sao trên cầu vai",
            type: "select",
            options: ["1 sao", "2 sao", "3 sao", "4 sao", "Khác"]
          },
          {
            id: "shoulderLine",
            label: "Số vạch trên cầu vai",
            type: "select",
            options: ["Không vạch", "1 vạch", "2 vạch", "Khác"]
          },
          {
            id: "hat",
            label: "Có thêm mũ không?",
            type: "select",
            options: ["Không", "Có mũ", "Shop tư vấn"]
          },
          {
            id: "medal",
            label: "Có thêm huy chương không?",
            type: "select",
            options: ["Không", "Có", "Shop tư vấn"]
          },
          { id: "address", label: "Địa chỉ nhận hàng", type: "text", required: true, full: true },
          { id: "referenceImage", label: "Link ảnh mẫu nếu có", type: "text", full: true },
          { id: "note", label: "Ghi chú thiết kế", type: "textarea", full: true }
        ]
      },

      uniform_two_shirts: {
        name: "Khung 2 áo quân phục",
        note: "Dành cho mẫu có 2 áo trong cùng 1 khung, ví dụ áo công an + áo dài, hoặc 2 áo ngành.",
        fields: [
          { id: "customerName", label: "Họ tên khách hàng", type: "text", required: true },
          { id: "phone", label: "Số điện thoại", type: "tel", required: true },
          {
            id: "shirtOne",
            label: "Thông tin áo bên trái",
            type: "text",
            required: true,
            placeholder: "Ví dụ: Áo công an, tên A, cấp bậc..."
          },
          {
            id: "shirtTwo",
            label: "Thông tin áo bên phải",
            type: "text",
            required: true,
            placeholder: "Ví dụ: Áo dài trắng, tên B..."
          },
          {
            id: "layout",
            label: "Bố cục",
            type: "select",
            options: ["2 áo ngang nhau", "Áo trái lớn hơn", "Áo phải lớn hơn", "Shop tự căn"]
          },
          {
            id: "extraItems",
            label: "Phụ kiện thêm",
            type: "select",
            options: ["Không", "Mũ", "Huy chương", "Dây vàng", "Mũ + huy chương", "Shop tư vấn"]
          },
          { id: "address", label: "Địa chỉ nhận hàng", type: "text", required: true, full: true },
          { id: "note", label: "Ghi chú thêm", type: "textarea", full: true }
        ]
      }
    }
  },

  couple: {
    label: "Cặp đôi / Cưới",
    forms: {
      wedding_couple: {
        name: "Khung vest - váy cưới",
        note: "Dành cho quà cưới, kỷ niệm ngày cưới hoặc couple.",
        fields: [
          { id: "customerName", label: "Họ tên khách hàng", type: "text", required: true },
          { id: "phone", label: "Số điện thoại", type: "tel", required: true },
          { id: "groomName", label: "Tên chú rể / bạn nam", type: "text", required: true },
          { id: "brideName", label: "Tên cô dâu / bạn nữ", type: "text", required: true },
          { id: "date", label: "Ngày kỷ niệm", type: "text", placeholder: "Ví dụ: 20.10.2026" },
          {
            id: "outfit",
            label: "Trang phục",
            type: "select",
            options: ["Vest + váy cưới", "Vest + áo dài", "Áo dài đôi", "Shop tư vấn"]
          },
          { id: "mainColor", label: "Màu chủ đạo", type: "text", placeholder: "Ví dụ: trắng kem, xanh pastel..." },
          { id: "address", label: "Địa chỉ nhận hàng", type: "text", required: true, full: true },
          { id: "note", label: "Lời chúc / ghi chú", type: "textarea", full: true }
        ]
      }
    }
  },

  graduation: {
    label: "Tốt nghiệp",
    forms: {
      graduation_basic: {
        name: "Khung tốt nghiệp cơ bản",
        note: "Dành cho quà tốt nghiệp, sinh viên, học sinh.",
        fields: [
          { id: "customerName", label: "Họ tên khách hàng", type: "text", required: true },
          { id: "phone", label: "Số điện thoại", type: "tel", required: true },
          { id: "graduateName", label: "Tên người nhận", type: "text", required: true },
          { id: "school", label: "Trường / lớp", type: "text" },
          { id: "year", label: "Năm tốt nghiệp", type: "text" },
          { id: "mainColor", label: "Màu chủ đạo", type: "text" },
          {
            id: "frameSize",
            label: "Kích thước khung",
            type: "select",
            options: ["15 x 21 cm", "21 x 30 cm", "Size khác"]
          },
          { id: "address", label: "Địa chỉ nhận hàng", type: "text", required: true, full: true },
          { id: "note", label: "Lời chúc / ghi chú", type: "textarea", full: true }
        ]
      }
    }
  },

  custom: {
    label: "Thiết kế riêng",
    forms: {
      custom_any: {
        name: "Gửi ý tưởng riêng",
        note: "Dành cho khách chưa biết chọn mẫu nào, chỉ cần mô tả ý tưởng.",
        fields: [
          { id: "customerName", label: "Họ tên khách hàng", type: "text", required: true },
          { id: "phone", label: "Số điện thoại", type: "tel", required: true },
          { id: "idea", label: "Ý tưởng muốn làm", type: "textarea", required: true, full: true },
          {
            id: "budget",
            label: "Ngân sách dự kiến",
            type: "select",
            options: ["Dưới 200k", "200k - 300k", "300k - 500k", "Trên 500k", "Shop tư vấn"]
          },
          { id: "deadline", label: "Ngày cần nhận hàng", type: "text" },
          { id: "address", label: "Địa chỉ nhận hàng", type: "text", required: true, full: true }
        ]
      }
    }
  }
};

/* Bấm vào card sản phẩm sẽ tự chọn chủ đề ở form */
function quickSelectCategory(categoryKey) {
  document.getElementById("categorySelect").value = categoryKey;
  loadFormsByCategory();
  document.getElementById("order").scrollIntoView({ behavior: "smooth" });
}

/* Khi chọn chủ đề, hàm này sẽ load danh sách mẫu con */
function loadFormsByCategory() {
  const category = document.getElementById("categorySelect").value;
  const formTypeBox = document.getElementById("formTypeBox");
  const formTypeSelect = document.getElementById("formTypeSelect");
  const dynamicOrderForm = document.getElementById("dynamicOrderForm");
  const dynamicFields = document.getElementById("dynamicFields");

  formTypeSelect.innerHTML = `<option value="">-- Chọn mẫu --</option>`;
  dynamicFields.innerHTML = "";
  dynamicOrderForm.classList.add("hidden");

  if (!category) {
    formTypeBox.classList.add("hidden");
    return;
  }

  const forms = formData[category].forms;

  Object.keys(forms).forEach((formKey) => {
    const option = document.createElement("option");
    option.value = formKey;
    option.textContent = forms[formKey].name;
    formTypeSelect.appendChild(option);
  });

  formTypeBox.classList.remove("hidden");
}

/* Khi chọn mẫu con, hàm này dựng form tương ứng */
function renderDynamicForm() {
  const category = document.getElementById("categorySelect").value;
  const formType = document.getElementById("formTypeSelect").value;
  const dynamicOrderForm = document.getElementById("dynamicOrderForm");
  const dynamicFields = document.getElementById("dynamicFields");

  dynamicFields.innerHTML = "";

  if (!category || !formType) {
    dynamicOrderForm.classList.add("hidden");
    return;
  }

  const selectedForm = formData[category].forms[formType];

  dynamicFields.innerHTML += `
    <div class="form-note">
      <strong>${selectedForm.name}</strong><br>
      ${selectedForm.note}
    </div>
  `;

  selectedForm.fields.forEach((field) => {
    const required = field.required ? "required" : "";
    const placeholder = field.placeholder ? field.placeholder : "";
    const fullClass = field.full ? "full" : "";

    let fieldHTML = "";

    if (field.type === "select") {
      fieldHTML = `
        <div class="form-group ${fullClass}">
          <label>${field.label}</label>
          <select id="${field.id}" ${required}>
            <option value="">-- Chọn --</option>
            ${field.options.map((option) => `<option value="${option}">${option}</option>`).join("")}
          </select>
        </div>
      `;
    } else if (field.type === "textarea") {
      fieldHTML = `
        <div class="form-group ${fullClass}">
          <label>${field.label}</label>
          <textarea id="${field.id}" placeholder="${placeholder}" ${required}></textarea>
        </div>
      `;
    } else {
      fieldHTML = `
        <div class="form-group ${fullClass}">
          <label>${field.label}</label>
          <input type="${field.type}" id="${field.id}" placeholder="${placeholder}" ${required}>
        </div>
      `;
    }

    dynamicFields.innerHTML += fieldHTML;
  });

  dynamicOrderForm.classList.remove("hidden");
}

/* Khi khách bấm gửi form */
function submitDynamicOrder(event) {
  event.preventDefault();

  const category = document.getElementById("categorySelect").value;
  const formType = document.getElementById("formTypeSelect").value;
  const selectedForm = formData[category].forms[formType];

  let message = "";
  message += "ĐƠN ĐẶT HÀNG THE.KEEPUS\n";
  message += "-----------------------------\n";
  message += `Chủ đề: ${formData[category].label}\n`;
  message += `Mẫu: ${selectedForm.name}\n`;
  message += "-----------------------------\n";

  selectedForm.fields.forEach((field) => {
    const input = document.getElementById(field.id);
    message += `${field.label}: ${input.value}\n`;
  });

  console.log(message);

  alert("Đã tạo thông tin đơn hàng. Hiện tại đơn đang in ra Console. Bước sau có thể nối Google Sheet hoặc Gmail.");

  /*
    Sau này muốn gửi qua Zalo/Telegram/Gmail/Google Sheet
    thì mình sẽ sửa phần này.
  */
 const heroImages = [
  "images/hero1.jpg",
  "images/hero2.jpg",
  "images/hero3.jpg",
  "images/hero4.jpg",
  "images/hero5.jpg",
  "images/hero6.jpg",
  "images/hero7.jpg",
  "images/hero8.jpg"
];

let currentHeroImage = 0;

function changeHeroImage() {
  const heroSlideImage = document.getElementById("heroSlideImage");

  if (!heroSlideImage) return;

  heroSlideImage.classList.add("fade-out");

  setTimeout(() => {
    currentHeroImage++;

    if (currentHeroImage >= heroImages.length) {
      currentHeroImage = 0;
    }

    heroSlideImage.src = heroImages[currentHeroImage];
    heroSlideImage.classList.remove("fade-out");
  }, 450);
}

setInterval(changeHeroImage, 3000);
}