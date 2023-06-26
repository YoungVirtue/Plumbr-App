//GLOBALS

//DOM SELECTORS
const dropArea = document.getElementById("drop_area");
const fileInput = document.getElementById("file_input");
const urlInput = document.getElementById("url_input");
const urlButton = document.getElementById("url_button");
const displayImage = document.getElementById("display_image");

//FETCH FUNCTIONS

//EVENT LISTENERS

// Handle file upload via input
fileInput.addEventListener("change", function (e) {
  displayUploadedFile(this.files[0]);
});

// Handle URL input
urlButton.addEventListener("click", function () {
  displayImage.src = urlInput.value;
});

// Handle file upload via drag and drop
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

dropArea.addEventListener("drop", handleDrop, false);

//EVENT HANDLERS

//For Drag & Drop
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDrop(e) {
  var dt = e.dataTransfer;
  var file = dt.files[0];
  displayUploadedFile(file);
}

//RENDER FUNCTIONS

// Display uploaded file
function displayUploadedFile(file) {
  var reader = new FileReader();
  reader.onload = function (e) {
    displayImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

//INITIALIZERS
