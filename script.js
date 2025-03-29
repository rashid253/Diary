// Process image using Tesseract.js and auto-fill homework fields.
function processImage() {
  const imageInput = document.getElementById("imageUpload");
  if (!imageInput.files[0]) {
    alert("Please upload an image.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function () {
    Tesseract.recognize(reader.result, 'eng', { logger: m => console.log(m) })
      .then(({ data: { text } }) => {
        const homeworkData = autoClassifyHomework(text);
        fillReviewForm(homeworkData);
        alert("OCR complete! Please review and edit the auto-filled data.");
      })
      .catch(err => console.error("OCR error:", err));
  };
  reader.readAsDataURL(imageInput.files[0]);
}

// Auto-classify extracted text using simple regex for subject keywords.
function autoClassifyHomework(text) {
  const subjects = {
    "Urdu": /(urdu|adab)/i,
    "English": /(english|essay|grammar|literature)/i,
    "Math": /(math|algebra|geometry|calculus)/i,
    "Science": /(science|physics|chemistry|biology)/i,
    "Social Studies": /(social studies|history|geography)/i
  };
  let homework = {
    "Urdu": "",
    "English": "",
    "Math": "",
    "Science": "",
    "Social Studies": ""
  };
  let lines = text.split(/\r?\n/);
  let currentSubject = null;
  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    let found = false;
    for (const subject in subjects) {
      if (subjects[subject].test(line)) {
        currentSubject = subject;
        let details = line.replace(subjects[subject], "").trim(" :-");
        homework[subject] += details + " ";
        found = true;
        break;
      }
    }
    if (!found && currentSubject) {
      homework[currentSubject] += line + " ";
    }
  });
  for (const subject in homework) {
    homework[subject] = homework[subject].trim();
  }
  return homework;
}

// Fill the diary form with auto-extracted homework data.
function fillReviewForm(homeworkData) {
  document.getElementById("urduHomework").value = homeworkData["Urdu"];
  document.getElementById("englishHomework").value = homeworkData["English"];
  document.getElementById("mathHomework").value = homeworkData["Math"];
  document.getElementById("scienceHomework").value = homeworkData["Science"];
  document.getElementById("socialHomework").value = homeworkData["Social Studies"];
}

// Update the preview section with current form data.
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
    <h3>Homework Details</h3>
    <table border="1" width="100%" cellspacing="0" cellpadding="5">
      <tr><th style="width:30%">Subject</th><th>Homework</th></tr>
      <tr><td>Urdu</td><td>${urdu}</td></tr>
      <tr><td>English</td><td>${english}</td></tr>
      <tr><td>Math</td><td>${math}</td></tr>
      <tr><td>Science</td><td>${science}</td></tr>
      <tr><td>Social Studies</td><td>${social}</td></tr>
    </table>
    <p><strong>Teacher's Note:</strong> ${teacherNote}</p>
    <p><strong>Announcements:</strong> ${announcements}</p>
  `;
  document.getElementById("previewContent").innerHTML = previewHTML;
}

// Generate a PDF of the diary using jsPDF.
function generatePDF() {
  updatePreview();
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();
  let content = document.getElementById("previewContent").innerText;
  doc.text(content, 10, 10);
  doc.save('HomeworkDiary.pdf');
}

// Share diary content via WhatsApp.
function shareWhatsApp() {
  const diaryText = document.getElementById("previewContent").innerText;
  if (!diaryText) {
    alert("No diary content available to share.");
    return;
  }
  const url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(diaryText);
  window.open(url, "_blank");
}

// Simple parent interaction: send chat message.
function sendChat() {
  const chatInput = document.getElementById("chatInput");
  let message = chatInput.value.trim();
  if (message === "") {
    alert("Please type a message.");
    return;
  }
  let chatBox = document.getElementById("chatBox");
  let msgElem = document.createElement("p");
  msgElem.innerHTML = `<strong>You:</strong> ${message}`;
  chatBox.appendChild(msgElem);
  chatInput.value = "";
  // Optionally, add backend integration for real-time interaction.
}
