//GLOBALS

const partURL = "http://localhost:3000/plumbing_parts";
const jobURL = "http://localhost:3000/jobs";

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
const searchBar = document.querySelector("#search-bar");
const partDetailCard = document.querySelector("#part-detail-card");
const imageDetail = document.querySelector("#image-detail");
const partCardName = document.querySelector("#part-detail-name");
const editDeleteButtons = document.querySelector("#edit-delete-buttons");
const deleteButton = document.querySelector(".delete-button");
// let selectedJobs;

//FETCH FUNCTIONS

function getParts(url) {
  return fetch(url).then((res) => res.json());
}

function getJobs(url) {
  return fetch(url).then((res) => res.json());
}

//EVENT LISTENERS

//Search Bar Input
searchBar.addEventListener("input", (e) => {
  const searchText = e.target.value.toLowerCase();
  getJobs(jobURL).then((jobs) => {
    const filteredJobs = jobs.filter((job) =>
      job.name.toLowerCase().includes(searchText)
    );
    filteredJobs.forEach((job) => renderDetailState(job));
  });
  toggleDetailState();
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
  renderInPartsList(newPart);
}

//Handle New Job Submit

function handleJobSubmit(e) {
  e.preventDefault();
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  const values = Array.from(checkboxes).map((checkbox) => checkbox.value);

  const newJob = {
    name: e.target["job-name-submit"].value,
    description: e.target["job-descr-submit"].value,
    image: e.target["job-img-submit"].value,
    parts: values,
  };

  const image = document.createElement("img");
  image.src = e.target["job-img-submit"].value;
  image.classList.add("rounded-5", "p-2");

  jobIcons.appendChild(image);
  image.addEventListener("click", (e) => {
    if (detailState.classList.contains("hidden")) {
      detailState.classList.remove("hidden");
    } else if (e.target.src === imageDetail.src) {
      detailState.classList.add("hidden");
    }
    renderDetailState(newJob);
  });

  e.target.reset();

  fetch(jobURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newJob),
  })
    .then((res) => {
      alert(`${newJob.name} submitted!`);
      return res.json();
    })
    .then((newJobJson) => {
      const storedJobIds = getStoredJobIds();
      storedJobIds.push(newJobJson.id);
      localStorage.setItem("jobIds", JSON.stringify(storedJobIds));
      // Save the ID to localStorage
      // Set the ID as the image element's attribute
      // const imageElement = document.getElementById("myImage");
      image.setAttribute("data-job-id", newJobJson.id);
    });

    updateImagesWithJobIds();

}

//Handle Parts Dropdown
function handlePartsDropdown() {
  if (partsList.classList.contains("hidden")) {
    partsList.classList.remove("hidden");
  } else {
    partsList.classList.add("hidden");
  }
}

//For Detail State Toggle
function toggleDetailState(e) {
  if (detailState.classList.contains("hidden")) {
    detailState.classList.remove("hidden");
  } else if (e.target.src === imageDetail.src) {
    detailState.classList.add("hidden");
  }
}

//For Part Detail Toggle

function togglePartCard(e) {
  if (partDetailCard.classList.contains("hidden")) {
    partDetailCard.classList.remove("hidden");
  } else if (e.target.textContent === partCardName.textContent) {
    partDetailCard.classList.add("hidden");
  }
}

//For New Part Button State Toggle
function toggleNewPartState() {
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
  if (newJobForm.classList.contains("hidden")) {
    newJobForm.classList.remove("hidden");
    newJobButton.textContent = "Done";
  } else {
    newJobForm.classList.add("hidden");
    newJobButton.textContent = "Create New Job";
  }
}

//For Delete Job Button
function deleteJob(job) {
  fetch(`${jobURL}/${job.id}`),
    {
      method: "DELETE",
    };
  console.log(job);
}

//RENDER FUNCTIONS

//Render Existing Jobs in Home State Icons

function renderIconsHomeState(jobsObj) {
  const jobIconImg = document.createElement("img");
  jobIconImg.src = jobsObj.image;
  jobIconImg.classList.add("rounded-5", "p-2");
  jobIcons.appendChild(jobIconImg);

  jobIconImg.addEventListener("click", (e) => {
    toggleDetailState(e);
    renderDetailState(jobsObj);
  });
}

//Display Detail in Job Detail State

function renderDetailState(newJob) {
  const detailImg = document.querySelector("#image-detail");
  const detailName = document.querySelector("#job-detail-name");
  const detailDescr = document.querySelector("#job-description-name");
  const ul = document.querySelector("#job-parts-detail-list");
  // const deleteButton = document.createElement("button");
  const editButton = document.createElement("button");
  editButton.classList.add("edit-button", "my-2");
  editButton.textContent = "Edit Job";
  // deleteButton.className = "delete-button";
  // deleteButton.textContent = "Delete Job";
  editDeleteButtons.innerHTML = "";
  editDeleteButtons.appendChild(editButton);
  editDeleteButtons.appendChild(deleteButton);

  // deleteButton.addEventListener("click", deleteJob);

  const jobPartsArr = newJob.parts;

  detailImg.src = newJob.image;
  detailName.textContent = newJob.name;
  detailDescr.textContent = newJob.description;
  ul.innerHTML = "";

  jobPartsArr.forEach((part) => {
    getParts(partURL + "/" + part).then((part) => {
      let li = document.createElement("li");
      li.textContent = part.name;
      ul.appendChild(li);
      li.addEventListener("click", (e) => {
        togglePartCard(e);
        renderPartsDetail(part);
      });
    });
  });
}

function renderPartsDetail(part) {
  const partDetailImage = document.querySelector("#part-detail-img");
  const partDetailName = document.querySelector("#part-detail-name");
  const partDetailSize = document.querySelector("#part-detail-size");
  const partDetailType = document.querySelector("#part-detail-type");
  const partDetailTags = document.querySelector("#part-detail-tags");
  partDetailTags.innerHTML = "";
  const tagArr = part.tags;

  partDetailImage.src = part.image;
  //partDetailImage.id = part.id;
  partDetailName.textContent = part.name;
  partDetailSize.textContent = `Size: ${part.size}`;
  partDetailType.textContent = `Type: ${part.type}`;
  tagArr.forEach((tag) => {
    let li = document.createElement("li");
    li.textContent = `#${tag}`;
    li.classList.add("list-group-item");
    partDetailTags.appendChild(li);
  });
}

//Display Parts Data in Parts List
function renderInPartsList(partObj) {
  const formCheck = document.createElement("label");
  const input = document.createElement("input");
  const label = document.createElement("span");
  formCheck.classList.add("label");
  input.type = "checkbox";
  input.id = partObj.id;
  input.name = partObj.name;
  input.value = partObj.id;
  input.classList.add("nes-checkbox");
  label.htmlFor = partObj.id;
  label.textContent = partObj.name;
  // label.classList.add("label")
  partsList.appendChild(formCheck);
  formCheck.appendChild(input);
  formCheck.appendChild(label);
}


//INITIALIZERS
getParts(partURL).then((partsArr) => {
  partsArr.forEach(renderInPartsList);
});

getJobs(jobURL).then((jobsArr) => {
  jobsArr.forEach(renderIconsHomeState);
});

// ...

// Function to retrieve the job ID from localStorage
// Function to retrieve all stored job IDs from localStorage
function getStoredJobIds() {
  const jobIdsString = localStorage.getItem("jobIds");
  if (jobIdsString) {
    return JSON.parse(jobIdsString);
  } else {
    return [];
  }
}

// Example usage:
const storedJobIds = getStoredJobIds();

// Function to update the image element with the stored job ID
// Function to update all image elements with their respective job IDs
function updateImagesWithJobIds() {
  const imageElements = jobIcons.querySelectorAll("img");
  const storedJobIds = getStoredJobIds();
  imageElements.forEach((imageElement) => {
    const jobId = imageElement.getAttribute("data-job-id");
    if (jobId && storedJobIds.includes(jobId)) {
      imageElement.setAttribute("data-job-id", jobId);
    }
  });
}


// Run the function when the page loads
window.addEventListener("load", updateImagesWithJobIds);
updateImagesWithJobIds();


//   deleteButton.addEventListener('click', () => {
//     const jobItem = jobIcons.querySelectorAll('img')
//     jobItem.forEach((job) => {
//         if (job.id === selectedJobs.name) {
//             job.remove()
//             fetch(`${jobURL}/${selectedJobs.id}`, {
//                 method: "DELETE"
//             })
//             .then(res => res.json())
//         }
//     })
// })
