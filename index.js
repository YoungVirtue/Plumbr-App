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
const detailState = document.querySelector("#detail-state");
const partsList = document.querySelector("#parts-list");
const partsDropdown = document.querySelector("#dropdown");
const jobIcons = document.querySelector("#job-icons");
const searchBar = document.querySelector("#search-bar")
const partDetailCard = document.querySelector("#part-detail-card")

//FETCH FUNCTIONS

function getParts(url) {
  return fetch(url).then((res) => res.json());
}

function getJobs(url) {
  return fetch(url)
  .then(res=> res.json())
}

//EVENT LISTENERS

//Search Bar Input
searchBar.addEventListener("input", (e) => {
    const searchText = e.target.value.toLowerCase(); // Fetch the input value and convert to lowercase
    
    // Fetch the jobs data
  getJobs(jobURL)
      .then(jobs => {
        // Filter the jobs by the search text
        const filteredJobs = jobs.filter(job => job.name.toLowerCase().includes(searchText));
        
        // Clear out the current job display
        // Assuming you have a function `clearJobDisplay()`
        //clearJobDisplay();
  
        // Render the filtered jobs
        // Assuming you have a function `renderJob(job)` that adds a job to the job display
        filteredJobs.forEach(job => renderDetailState(job));
      });
      toggleDetailState()
      // partDetailCard.innerHTML=""
  });
  

//New Part Form Submit
newPartForm.addEventListener("submit", handlePartSubmit);

//New Job Form Submit
newJobForm.addEventListener("submit", handleJobSubmit);

//Add parts List Dropdown
partsDropdown.addEventListener("click", handlePartsDropdown);

//Detail State Toggle

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
  })
  .then(() => alert(`${newPart.name} submitted!`));
  
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
  
  jobIcons.appendChild(image);
  image.addEventListener("click", () => {
    toggleDetailState()
    renderDetailState(newJob)
  });
  

  e.target.reset();

  fetch(jobURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newJob),
  }).then((res) => {
    alert(`${newJob.name} submitted!`)
    return res.json()
  }) .then(newJobJson => {
    image.dataset.jobId = newJobJson.id;
  });
};

//Handle Parts Dropdown
function handlePartsDropdown() {
  if (partsList.classList.contains("hidden")) {
    partsList.classList.remove("hidden");
  } else {
    partsList.classList.add("hidden");
  }
}

//For Detail State Toggle
function toggleDetailState() {
  // e.preventDefault();
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

//Display Detail in Job Detail State

function renderDetailState(newJob) {
  const detailImg = document.querySelector("#image-detail")
  const detailName = document.querySelector("#job-detail-name")
  const detailDescr = document.querySelector("#job-description-name")
  const ul = document.querySelector("#job-parts-detail-list")
  
  const jobPartsArr = newJob.parts
  
  detailImg.src = newJob.image
  detailName.textContent = newJob.name
  detailDescr.textContent = newJob.description
  ul.innerHTML = "";
  
  jobPartsArr.forEach((part) => {
    getParts(partURL + "/" + part)
    .then((part) => {
      let li = document.createElement('li');
      li.textContent = part.name
      ul.appendChild(li)
      li.addEventListener('click', () => renderPartsDetail(part))
    })
    // renderPartsDetail(part[0])
  })
}

function renderPartsDetail(part) {
  const partDetailImage = document.querySelector("#part-detail-img")
  const partDetailName = document.querySelector("#part-detail-name")
  const partDetailSize = document.querySelector("#part-detail-size")
  const partDetailType = document.querySelector("#part-detail-type")
  const partDetailTags = document.querySelector("#part-detail-tags")
  partDetailTags.innerHTML = ""
  const tagArr = part.tags

  partDetailImage.src = part.image
  partDetailName.textContent = part.name
  partDetailSize.textContent = part.size
  partDetailType.textContent = part.type
  tagArr.forEach((tag) => {
    let li = document.createElement('li')
    li.textContent = `#${tag}`
    partDetailTags.appendChild(li)
  })
  
}

  
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
  
