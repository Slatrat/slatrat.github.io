const months = [
    "january", "february", "march", "april",
    "may", "june", "july", "august",
    "september", "october", "november", "december"
];

function getDateSegment(day) {
    if (day <= 14) return "1_14";
    return "15_31";
}

function loadEntries(month, segment, callback) {
    fetch(`databases/${month}_${segment}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => callback(data))
        .catch(error => {
            console.error('Error loading entries:', error.message);
            alert('Failed to load entries. Please check the console for more details.');
        });
}

let currentDate = new Date();
let currentMonth = months[currentDate.getMonth()];
let currentSegment = getDateSegment(currentDate.getDate());
let currentIndex = currentDate.getDate() - (currentSegment === "1_14" ? 1 : 15);

function displayEntry(entries, index) {
    document.getElementById('headline').innerText = entries[index].headline;
    document.getElementById('summary').innerText = entries[index].summary;
}

function prevEntry(entries) {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : entries.length - 1;
    displayEntry(entries, currentIndex);
}

function nextEntry(entries) {
    currentIndex = (currentIndex < entries.length - 1) ? currentIndex + 1 : 0;
    displayEntry(entries, currentIndex);
}

function obscureImage() {
    const imageContainer = document.querySelector('.image-container');
    const wrongOverlay = document.createElement('div');
    wrongOverlay.classList.add('wrong-overlay');
    
    imageContainer.appendChild(wrongOverlay);
    
    const interval = 60000 / 50; // 60 seconds divided by 50 text elements
    let textCount = 0;
    const fonts = ['Arial', 'Verdana', 'Tahoma', 'Georgia', 'Times New Roman', 'Courier New', 'Lucida Console', 'Comic Sans MS', 'Impact', 'Trebuchet MS'];

    function addText() {
        if (textCount >= 50) return;
        
        const wrongText = document.createElement('div');
        wrongText.innerText = "wrong";
        wrongText.classList.add('wrong-text');
        wrongText.style.top = `${Math.random() * 100}%`;
        wrongText.style.left = `${Math.random() * 100}%`;
        wrongText.style.fontSize = `${Math.random() * 3 + 1}em`;
        wrongText.style.fontFamily = fonts[textCount % fonts.length];
        wrongText.style.color = textCount % 2 === 0 ? 'black' : 'white';
        wrongText.style.webkitTextStroke = '1px red';
        
        // Avoid the area where "wrong" should be unobstructed
        const top = parseFloat(wrongText.style.top);
        const left = parseFloat(wrongText.style.left);
        if (top > 40 && top < 60 && left > 40 && left < 60) {
            wrongText.style.top = `${Math.random() * 40 + 30}%`;
            wrongText.style.left = `${Math.random() * 40 + 30}%`;
        }

        wrongOverlay.appendChild(wrongText);
        textCount++;
        setTimeout(addText, interval);
    }
    
    addText();
}

document.addEventListener('DOMContentLoaded', () => {
    loadEntries(currentMonth, currentSegment, (entries) => {
        displayEntry(entries, currentIndex);
        document.getElementById('prev').addEventListener('click', () => prevEntry(entries));
        document.getElementById('next').addEventListener('click', () => nextEntry(entries));
    });
    
    setTimeout(obscureImage, 15000);  // Start obscuring the image after 15 seconds
});