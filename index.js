//GLOBALS

const partURL = "http://localhost:3000/plumbing_parts";
const jobURL = "http://localhost:3000/jobs"

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
const partsList = document.querySelector("#parts-list");
const partsDropdown = document.querySelector("#dropdown");
const jobIcons = document.querySelector("#job-icons");


//FETCH FUNCTIONS

function getParts(url) {
  return fetch(url).then((res) => res.json());
}

//EVENT LISTENERS

//New Part Form Submit
newPartForm.addEventListener("submit", handlePartSubmit);

//New Job Form Submit
newJobForm.addEventListener("submit", handleJobSubmit);

//Add parts List Dropdown
partsDropdown.addEventListener("click", handlePartsDropdown);

//Detail State Toggle
jobImgIcon.addEventListener("click", toggleDetailState);

//Create New Part Button State Toggle
newPartButton.addEventListener("click", toggleNewPartState);
newJobButton.addEventListener("click", toggleNewJobState);

// Handle file upload via input
fileInput.addEventListener("change", function (e) {
  displayUploadedFile(this.files[0]);
});

// Handle file upload via drag and drop
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

dropArea.addEventListener("drop", handleDrop, false);

//EVENT HANDLERS

//Handle New Part Submit

function handlePartSubmit(e) {
  e.preventDefault();
  const newPart = {
    name: e.target["part-name-submit"].value,
    size: e.target["part-size-submit"].value,
    type: e.target["part-type-submit"].value,
    tags: e.target["part-tags-submit"].value,
    image: e.target["part-img-submit"].value,
  };
  e.target.reset();
  fetch(partURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPart),
  }).then(() => alert(`${newPart.name} submitted!`));
}

//Handle New Job Submit

function handleJobSubmit(e) {
  e.preventDefault();
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  const values = Array.from(checkboxes).map(checkbox => checkbox.value);
  const newJob = {
    name: e.target["job-name-submit"].value,
    description: e.target["job-descr-submit"].value,
    image: e.target["job-img-submit"].value,
    parts: values,
  }
  const image = document.createElement("img")
  image.src = e.target["job-img-submit"].value
  image.id = e.target["job-name-submit"].value
  jobIcons.appendChild(image);
  e.target.reset();
  fetch(jobURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newJob),
  }).then(() => alert(`${newJob.name} submitted!`))
  };

//Handle Parts Dropdown
function handlePartsDropdown(e) {
    if (partsList.classList.contains("hidden")) {
        partsList.classList.remove("hidden");
      } else {
        partsList.classList.add("hidden");
      }
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

//Display Parts Data in Parts List
function renderInPartsList(partObj) {
    //console.log(partObj);
    const input = document.createElement("input");
    const label = document.createElement("label");
    input.type = "checkbox";
    input.id = partObj.id;
    input.name = partObj.name;
    input.value = partObj.id;
    label.htmlFor = partObj.id;
    label.textContent = partObj.name;
    partsList.appendChild(input);
    partsList.appendChild(label);
}

// Display uploaded file
function displayUploadedFile(file) {
  var reader = new FileReader();
  reader.onload = function (e) {
    displayImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
}



//INITIALIZERS
getParts(partURL)
    .then(partsArr => {
        partsArr.forEach(renderInPartsList);
    })
