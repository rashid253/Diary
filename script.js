function processImage() {
  alert("OCR Feature Coming Soon!");
}

function generatePDF() {
  alert("PDF Generation Feature Coming Soon!");
}

function shareDiary() {
  let message = "Check out today's diary!";
  let whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");
}
