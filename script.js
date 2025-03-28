// Function to process the uploaded image using Tesseract.js
function processImage() {
  const imageInput = document.getElementById("imageUpload");
  if (!imageInput.files[0]) {
    alert("Please upload an image.");
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function() {
    Tesseract.recognize(reader.result, 'eng', { logger: m => console.log(m) })
      .then(({ data: { text } }) => {
        // Use simple regex-based segmentation to classify homework
        const homeworkData = autoClassifyHomework(text);
        // Pre-fill the review form with extracted text
        fillReviewForm(homeworkData);
        // Show the review section
        document.getElementById("reviewSection").classList.remove("hidden");
      })
      .catch(err => console.error("OCR error:", err));
  };
  reader.readAsDataURL(imageInput.files[0]);
}

// Basic auto-classification of text for subjects using regex
function autoClassifyHomework(text) {
  const subjects = {
    "Urdu": /(urdu|adab)/i,
    "English": /(english|essay|grammar|literature)/i,
    "Math": /(math|algebra|geometry|calculus)/i,
    "Science": /(science|physics|chemistry|biology)/i,
    "Social Studies": /(social studies|history|geography)/i
  };
  // Initialize homework data with empty strings
  let homework = {
    "Urdu": "",
    "English": "",
    "Math": "",
    "Science": "",
    "Social Studies": ""
  };
  // Split text into lines
  let lines = text.split(/\r?\n/);
  let currentSubject = null;
  
  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    // Check if line contains a subject keyword
    let foundSubject = false;
    for (const subject in subjects) {
      if (subjects[subject].test(line)) {
        currentSubject = subject;
        // Remove the subject keyword from the line if needed
        let details = line.replace(subjects[subject], "").trim(" :-");
        homework[subject] += details + " ";
        foundSubject = true;
        break;
      }
    }
    // If no subject keyword is found, assume it belongs to the current subject
    if (!foundSubject && currentSubject) {
      homework[currentSubject] += line + " ";
    }
  });
  // Trim extra spaces
  for (const subject in homework) {
    homework[subject] = homework[subject].trim();
  }
  return homework;
}

// Fill the review form with auto-classified homework data
function fillReviewForm(homeworkData) {
  // You can further improve this function to parse out and fill more fields
  document.getElementById("urduHomework").value = homeworkData["Urdu"];
  document.getElementById("englishHomework").value = homeworkData["English"];
  document.getElementById("mathHomework").value = homeworkData["Math"];
  document.getElementById("scienceHomework").value = homeworkData["Science"];
  document.getElementById("socialHomework").value = homeworkData["Social Studies"];
}

// Generate a preview of the final digital diary
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
    <table>
      <tr><th>Subject</th><th>Homework</th></tr>
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
  // Show the preview section
  document.getElementById("previewSection").classList.remove("hidden");
}

// Open WhatsApp with the final diary text (URL-encoded)
function sendToWhatsApp() {
  const diaryText = document.getElementById("previewContent").innerText;
  if (!diaryText) {
    alert("No diary content available to send.");
    return;
  }
  const url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(diaryText);
  window.open(url, "_blank");
}
