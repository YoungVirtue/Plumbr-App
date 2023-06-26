//GLOBALS

//DOM SELECTORS
const dropArea = document.getElementById("drop_area");
const fileInput = document.getElementById("file_input");
const urlInput = document.getElementById("url_input");
const urlButton = document.getElementById("url_button");
const displayImage = document.getElementById("display_image");
const newPartButton = document.getElementById("new-part-btn");
const newPartForm = document.querySelector("#new-part-form");
const newJobButton = document.getElementById("new-job-btn");
const newJobForm = document.querySelector("#new-job-form");
const jobImgIcon = document.querySelector("#job-image-icon");
const detailState = document.querySelector("#detail-state");

//FETCH FUNCTIONS

//EVENT LISTENERS

//New Part Form Submit
newPartForm.addEventListener('submit', handlePartSubmit);

//Detail State Toggle
jobImgIcon.addEventListener("click", toggleDetailState);

//Create New Part Button State Toggle
newPartButton.addEventListener("click", toggleNewPartState);
newJobButton.addEventListener("click", toggleNewJobState);


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

//Handle New Part Submit

function handlePartSubmit(e) {
    e.preventDefault()
    const partName = e.target["part-name-submit"].value
    const partSize = e.target["part-size-submit"].value
    const partType = e.target["part-type-submit"].value
    const partTags = e.target["part-tags-submit"].value
    console.log(partName, partSize, partType, partTags)
    e.target.reset()
    alert(`${partName} submitted!`)

}

//For Detail State Toggle
function toggleDetailState(e) {
  e.preventDefault();
  if (detailState.classList.contains("hidden")) {
    detailState.classList.remove("hidden");
  } else {
    detailState.classList.add("hidden");
  }
}

//For New Part Button State Toggle
function toggleNewPartState() {
  // e.preventDefault();
  if (newPartForm.classList.contains("hidden")) {
    newPartForm.classList.remove("hidden");
    newPartButton.textContent = "Done";
  } else {
    newPartForm.classList.add("hidden");
    newPartButton.textContent = "Create New Part";
  }
}

//For New Job Button State Toggle
function toggleNewJobState() {
  // e.preventDefault();
  if (newJobForm.classList.contains("hidden")) {
    newJobForm.classList.remove("hidden");
    newJobButton.textContent = "Done";
  } else {
    newJobForm.classList.add("hidden");
    newJobButton.textContent = "Create New Job";
  }
}

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
