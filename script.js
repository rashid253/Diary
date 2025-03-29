const worker = Tesseract.createWorker();

// Image Processing
async function processImage() {
    const imageInput = document.getElementById('imageUpload');
    if (!imageInput.files[0]) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('uploadedImage').src = e.target.result;
        document.getElementById('imagePreviewContainer').classList.remove('hidden');
        document.getElementById('scanButton').classList.remove('hidden');
    };
    reader.readAsDataURL(imageInput.files[0]);
}

// OCR Processing
async function scanImage() {
    try {
        showOCRProcessing();
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        
        const { data: { text } } = await worker.recognize(
            document.getElementById('uploadedImage').src
        );
        
        document.getElementById('extractedText').textContent = text || "No text detected";
        document.getElementById('autoFillSection').classList.remove('hidden');
    } catch (error) {
        showOCRError(error);
    }
}

function showOCRProcessing() {
    document.getElementById('extractedText').innerHTML = `
        <div class="processing-message">
            <div class="spinner"></div>
            Analyzing image...
        </div>
    `;
    document.getElementById('ocrDialog').classList.remove('hidden');
}

function showOCRError(error) {
    console.error('OCR Error:', error);
    document.getElementById('extractedText').innerHTML = `
        <div class="error-message">
            Error: ${error.message || 'Failed to read text from image'}
        </div>
    `;
}

// Rest of your original functions with enhanced regex
function autoClassifyHomework(text) {
    const patterns = {
        "Urdu": /(urdu|adab)[:\-\—]\s*(.+)/i,
        "English": /(english|essay|grammar)[:\-\—]\s*(.+)/i,
        "Math": /(math|algebra|geometry)[:\-\—]\s*(.+)/i,
        "Science": /(science|physics|chemistry)[:\-\—]\s*(.+)/i,
        "Social Studies": /(social studies|history|geography)[:\-\—]\s*(.+)/i
    };

    return Object.entries(patterns).reduce((acc, [subject, regex]) => {
        const match = text.match(regex);
        acc[subject] = match?.[2]?.trim() || "";
        return acc;
    }, {});
}

// Keep all other original functions (updatePreview, generatePDF, etc.) unchanged
