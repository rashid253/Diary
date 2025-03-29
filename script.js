// Dummy OCR simulation function (replace with actual API integration as needed)
function simulateOCR(imageData) {
  return new Promise((resolve) => {
    // Simulate a delay for OCR processing
    setTimeout(() => {
      // For demonstration, return dummy extracted text.
      resolve("Urdu: پڑھائی کا کام\nEnglish: Write an essay on Nature\nMath: Solve exercise 5.2\nScience: Read chapter 3\nSocial Studies: Prepare notes on history");
    }, 2000);
  });
}

// Process image: show preview and start OCR simulation.
function processImage() {
  const imageInput = document.getElementById("imageUpload");
  if (!imageInput.files[0]) {
    alert("Please upload an image.");
    return;
  }
  const file = imageInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function () {
    // Show image preview
    document.getElementById("uploadedImage").src = reader.result;
    document.getElementById("imagePreviewContainer").classList.remove("hidden");
    // Show "Scan Image" button
    document.getElementById("scanButton").classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

// Scan image: simulate OCR extraction and display floating dialog.
function scanImage() {
  const imageData = document.getElementById("uploadedImage").src;
  if (!imageData) {
    alert("No image to scan.");
    return;
  }
  // Show dialog with "Processing..." initially.
  const ocrDialog = document.getElementById("ocrDialog");
  const extractedTextDiv = document.getElementById("extractedText");
  extractedTextDiv.innerText = "Processing OCR...";
  ocrDialog.classList.remove("hidden");
  
  // Call the dummy OCR simulation function.
  simulateOCR(imageData).then(extractedText => {
    extractedTextDiv.innerText = extractedText;
  });
}

// Close the OCR dialog.
function closeOCRDialog() {
  document.getElementById("ocrDialog").classList.add("hidden");
  // Reveal the Auto Fill Diary button.
  document.getElementById("autoFillSection").classList.remove("hidden");
}

// Auto-fill the diary form using extracted OCR text.
function autoFillDiary() {
  const extractedText = document.getElementById("extractedText").innerText;
  if (!extractedText || extractedText === "Processing OCR...") {
    alert("No extracted text available.");
    return;
  }
  const homeworkData = autoClassifyHomework(extractedText);
  fillReviewForm(homeworkData);
  alert("Diary form auto-filled. Please review and adjust as needed.");
}

// Basic auto-classification using regex.
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

// Fill the form with classified homework data.
function fillReviewForm(homeworkData) {
  document.getElementById("urduHomework").value = homeworkData["Urdu"];
  document.getElementById("englishHomework").value = homeworkData["English"];
  document.getElementById("mathHomework").value = homeworkData["Math"];
  document.getElementById("scienceHomework").value = homeworkData["Science"];
  document.getElementById("socialHomework").value = homeworkData["Social Studies"];
}

// Update preview section with diary form data in traditional layout.
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
  
  let previewHTML = `
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>School Name:</strong> ${schoolName}</p>
    <p><strong>Class:</strong> ${className}</p>
    <p><strong>Student Name:</strong> ${studentName}</p>
    <table class="diary-output">
      <tr>
        <th>Subject</th>
        <th>Homework Details</th>
      </tr>
      <tr>
        <td>Urdu</td>
        <td>${urdu}</td>
      </tr>
      <tr>
        <td>English</td>
        <td>${english}</td>
      </tr>
      <tr>
        <td>Math</td>
        <td>${math}</td>
      </tr>
      <tr>
        <td>Science</td>
        <td>${science}</td>
      </tr>
      <tr>
        <td>Social Studies</td>
        <td>${social}</td>
      </tr>
    </table>
    <p><strong>Teacher's Note:</strong> ${teacherNote}</p>
    <p><strong>Announcements / Alerts:</strong> ${announcements}</p>
  `;
  document.getElementById("previewContent").innerHTML = previewHTML;
}

// Generate PDF using jsPDF
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
