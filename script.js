// Process image: show preview and enable the scan button.
function processImage() {
  const imageInput = document.getElementById("imageUpload");
  if (!imageInput.files[0]) {
    alert("Please upload an image.");
    return;
  }
  const file = imageInput.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const imageDataUrl = reader.result;
    // Show image preview
    document.getElementById("uploadedImage").src = imageDataUrl;
    document.getElementById("imagePreviewContainer").classList.remove("hidden");
    // Show "Scan Image" button
    document.getElementById("scanButton").classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

// Scan image using Tesseract.js for OCR.
function scanImage() {
  const imageDataUrl = document.getElementById("uploadedImage").src;
  if (!imageDataUrl) {
    alert("No image available to scan.");
    return;
  }
  // Show OCR dialog with initial processing message.
  const ocrDialog = document.getElementById("ocrDialog");
  document.getElementById("extractedText").innerText = "Processing OCR...";
  ocrDialog.classList.remove("hidden");

  // Use Tesseract.js to extract text.
  Tesseract.recognize(imageDataUrl, 'eng', { logger: m => console.log(m) })
    .then(({ data: { text } }) => {
      document.getElementById("extractedText").innerText = text;
    })
    .catch(err => {
      console.error("OCR error:", err);
      document.getElementById("extractedText").innerText = "Error extracting text.";
    });
}

// Close OCR dialog and reveal Auto Fill Diary button.
function closeOCRDialog() {
  document.getElementById("ocrDialog").classList.add("hidden");
  document.getElementById("autoFillSection").classList.remove("hidden");
}

// Auto-fill the diary form from the extracted OCR text.
function autoFillDiary() {
  const extractedText = document.getElementById("extractedText").innerText;
  if (!extractedText || extractedText === "Processing OCR..." || extractedText === "Error extracting text.") {
    alert("No valid extracted text available.");
    return;
  }
  const homeworkData = autoClassifyHomework(extractedText);
  fillReviewForm(homeworkData);
  alert("Diary form auto-filled. Please review and adjust as needed.");
}

// Basic auto-classification using regex (match subjects like 'Urdu:', 'English:', etc.).
function autoClassifyHomework(text) {
  const subjects = {
    "Urdu": /(urdu|adab):\s*(.*)/i,
    "English": /(english|essay|grammar|literature):\s*(.*)/i,
    "Math": /(math|algebra|geometry|calculus):\s*(.*)/i,
    "Science": /(science|physics|chemistry|biology):\s*(.*)/i,
    "Social Studies": /(social studies|history|geography):\s*(.*)/i
  };
  let homework = {
    "Urdu": "",
    "English": "",
    "Math": "",
    "Science": "",
    "Social Studies": ""
  };
  let lines = text.split(/\r?\n/);
  lines.forEach(line => {
    line = line.trim();
    for (const subject in subjects) {
      const match = line.match(subjects[subject]);
      if (match) {
        homework[subject] = match[2].trim();
      }
    }
  });
  return homework;
}

// Fill the diary form with the classified homework data.
function fillReviewForm(homeworkData) {
  document.getElementById("urduHomework").value = homeworkData["Urdu"];
  document.getElementById("englishHomework").value = homeworkData["English"];
  document.getElementById("mathHomework").value = homeworkData["Math"];
  document.getElementById("scienceHomework").value = homeworkData["Science"];
  document.getElementById("socialHomework").value = homeworkData["Social Studies"];
}

// Update the preview section with diary form data in a standard vertical layout.
function updatePreview() {
  const date = document.getElementById("diaryDate").value || "__________";
  const schoolName = document.getElementById("schoolName").value || "__________";
  const className = document.getElementById("className").value || "__________";
  const studentName = document.getElementById("studentName").value || "__________";
  
  const urdu = document.getElementById("urduHomework").value || "______________________";
  const english = document.getElementById("englishHomework").value || "______________________";
  const math = document.getElementById("mathHomework").value || "______________________";
  const science = document.getElementById("scienceHomework").value || "______________________";
  const social = document.getElementById("socialHomework").value || "______________________";
  
  const teacherNote = document.getElementById("teacherNote").value || "_________________________________________________";
  const announcements = document.getElementById("announcements").value || "_________________________________________________";
  
  // Build the preview in a traditional diary style.
  let previewHTML = `
    <div class="diary-header">
      <h2>${schoolName}</h2>
      <p><strong>Date:</strong> ${date} | <strong>Class:</strong> ${className} | <strong>Student:</strong> ${studentName}</p>
    </div>
    <div class="diary-body">
      <div class="diary-entry">
        <h3>Urdu</h3>
        <p>${urdu}</p>
      </div>
      <div class="diary-entry">
        <h3>English</h3>
        <p>${english}</p>
      </div>
      <div class="diary-entry">
        <h3>Math</h3>
        <p>${math}</p>
      </div>
      <div class="diary-entry">
        <h3>Science</h3>
        <p>${science}</p>
      </div>
      <div class="diary-entry">
        <h3>Social Studies</h3>
        <p>${social}</p>
      </div>
    </div>
    <div class="diary-footer">
      <p><strong>Teacher's Note:</strong> ${teacherNote}</p>
      <p><strong>Announcements / Alerts:</strong> ${announcements}</p>
    </div>
  `;
  document.getElementById("previewContent").innerHTML = previewHTML;
}

// Generate a PDF using jsPDF.
function generatePDF() {
  updatePreview();
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();
  let content = document.getElementById("previewContent").innerText;
  doc.text(content, 10, 10);
  doc.save('HomeworkDiary.pdf');
}

// Share diary via WhatsApp.
function shareDiary() {
  const diaryText = document.getElementById("previewContent").innerText;
  if (!diaryText) {
    alert("No diary content available to share.");
    return;
  }
  const url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(diaryText);
  window.open(url, "_blank");
}
