function processImage() {
  const imageInput = document.getElementById("imageUpload");
  if (!imageInput.files[0]) {
    alert("Please upload an image.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function () {
    Tesseract.recognize(reader.result, 'eng', {
      logger: m => console.log(m)
    })
    .then(({ data: { text } }) => {
      const parsedHTML = parseText(text);
      document.getElementById("output").innerHTML = parsedHTML;
    })
    .catch(err => console.error("OCR error:", err));
  };
  reader.readAsDataURL(imageInput.files[0]);
}

function parseText(text) {
  // Define simple regex patterns for subjects
  const subjects = {
    "Urdu": /(urdu|adab)/i,
    "English": /(english|essay|grammar|literature)/i,
    "Math": /(math|algebra|geometry|calculus)/i,
    "Science": /(science|physics|chemistry|biology)/i,
    "Social Studies": /(social studies|history|geography)/i
  };

  let outputHTML = "<h2>Extracted Homework</h2>";
  // For each subject, check if the subject's keyword exists in the text
  for (const subject in subjects) {
    if (subjects[subject].test(text)) {
      // A simple approach: display the full text under every subject that matches.
      // In a production system, you would segment the text more precisely.
      outputHTML += `<p><strong>${subject}:</strong> ${text}</p>`;
    }
  }
  return outputHTML;
}

function sendToWhatsApp() {
  const extractedText = document.getElementById("output").innerText;
  if (!extractedText) {
    alert("No extracted text available to send.");
    return;
  }
  const url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(extractedText);
  window.open(url, "_blank");
}
