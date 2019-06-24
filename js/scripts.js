// Elements that will be referenced throughout the project
const $employeeGallery = $("#gallery");
// for original data fetched
let employees;
// for filtered names via user searching
let filteredEmployees;

// FETCH REQUESTS
function fetchUsers(url) {
    return fetch(url)
            // Check that server response is OK
            .then(statCheck)
            .then(res => res.json())
}

fetchUsers('https://randomuser.me/api/?results=12&nat=au,gb,ie,nz,us')
    .then(data => {
        employees = data.results;
        // set filteredEmployees to initial data so it's not null
        filteredEmployees = employees;
        displayUsers(employees);
    })
    .catch(error => errorDisplay(error));

// HELPER FUNCTIONS
function statCheck(res) {
    if (!res.ok) {
        return Promise.reject(res.statusText);
    }
    else {
        return res;
    }
}

function errorDisplay(error) {
    // append error message to gallery div
    const $message = $(`<span>Looks like something went wrong! Error message: ${error}</span>`);
    $employeeGallery.append($message);
}

function displayUsers(users) {
    $employeeGallery.empty();
    // create divs to append employee info to
    for (let i = 0; i < users.length; i++) {
        
        // creating and appending employee images
        const $cardDiv = $('<div class="card"></div>');
        const $cardImage = $(`<div class="card-img-container"><img class="card-img" src="${users[i].picture.large}" alt="profile picture"></div`);
        const $cardInfo = $('<div class="card-info-container"></div');
        $cardDiv.append($cardImage, $cardInfo);
        $employeeGallery.append($cardDiv);

        // creating and appending employee details
        const $employeeName = $(`<h3 id="name" class="card-name cap">${users[i].name.first} ${users[i].name.last}</h3>`);
        const $employeeEmail = $(`<p class="card-text">${users[i].email}</p>`);
        const $employeeLocation = $(`<p class="card-text cap">${users[i].location.city}</p>`);
        $cardInfo.append($employeeName, $employeeEmail, $employeeLocation);

        // set up click handlers for modal window
        $cardDiv.click(() => modalWindow(users, i));
    }
}

// MODAL WINDOW
function modalWindow(user, employeeIndex) {
    const employee = user[employeeIndex];
    const $body = $("body");
    // create modal container div
    const $modalContainer = $('<div class="modal-container"></div>');

    // create modal window div
    const $modalWindow = $('<div class="modal"></div>');
    $modalContainer.append($modalWindow);

    // create and append modal window close button
    const $modalCloseButton = $('<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>');
    $modalCloseButton.click(() => $modalContainer.remove());

    $modalWindow.append($modalCloseButton);

    // build info container
    const $modalInfo = $('<div class="modal-info-container"></div>');
    const $modalImage = $(`<img class="modal-img" src="${employee.picture.large}" alt="profile picture">`);
    const $modalName = $(`<h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>`);
    const $modalEmail = $(`<p class="modal-text">${employee.email}</p>`);
    const $modalLocation = $(`<p class="modal-text cap">${employee.location.city}</p><hr>`);

    // assign new formatted number to a variable
    const newPhone = formatPhoneNumber(employee.phone);
    const $modalPhone = $(`<p class="modal-text">${newPhone}</p>`);
    const $modalAddress = $(`<p class="modal-text cap">${employee.location.street}, ${employee.location.state} ${employee.location.postcode}</p>`);

    // set up birthdate format for proper display
    const birthdate = employee.dob.date;
    let newBirthdate = birthdate.slice(0, 10).split("-");
    newBirthdate = `${newBirthdate[1]}/${newBirthdate[2]}/${newBirthdate[0]}`;
    const $modalBirthday = $(`<p class="modal-text">Birthday: ${newBirthdate}</p>`);

    $modalInfo.append($modalImage, $modalName, $modalEmail, $modalLocation, $modalPhone, $modalAddress, $modalBirthday);
    $modalWindow.append($modalInfo);
    $body.append($modalContainer);
    createToggle($modalContainer, $modalWindow, employeeIndex);
}

// format numbers that match the "(123)-456-7890" format and display as "(123) 456-7890"
function formatPhoneNumber(phone) {
    const matchCheck = phone.match(/^\((\d{3})\)-(\d{3})-(\d{4})$/);
    if (matchCheck) {
        return "(" + matchCheck[1] + ")" + " " + matchCheck[2] + "-" + matchCheck[3];
    }
    else {
        return phone;
    }
}

// EXCEEDS: MODAL TOGGLE
// create and append modal toggle buttons to the modal window
function createToggle($container, $window, currentEm) {
    if (currentEm-1 >= 0) {
        const $modalPrev = $('<button type="button" id="modal-prev" class="modal-prev btn"><</button>');
        $window.append($modalPrev);
        $modalPrev.click(() => toggle($container, currentEm-1));
    }

    if (currentEm+1 < filteredEmployees.length) {
        const $modalNext = $('<button type="button" id="modal-next" class="modal-next btn">></button>');
        $window.append($modalNext);
        $modalNext.click(() => toggle($container, currentEm+1));
    }
}

// dismisses current modal and displays employee modal of passed in index
function toggle($container, showEm) {
    modalWindow(filteredEmployees, showEm);
    $container.remove();
}

// EXCEEDS: SEARCH FEATURE
function createSearchBar() {
    const $searchDiv = $(".search-container");
    const $form = $('<form action="#" method="get"></form>');
    const $searchBar = $('<input type="search" id="search-input" class="search-input" placeholder="Search...">');
    const $submitBtn = $('<input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">');
    $form.append($searchBar, $submitBtn);
    $searchDiv.append($form);

    $submitBtn.click(() => {
        searchFunctionality($searchBar, employees);
    });

    $searchBar.keyup(() => {
        searchFunctionality($searchBar, employees);
    });
}

// takes original data and assigns a filtered list of employees to filteredEmployees based on user input
function searchFunctionality(input, employeeList) {
    const filteredNames = [];
    for (i = 0; i < employeeList.length; i++) {
        const emName = employeeList[i].name;
        if (emName.first.indexOf(input.val()) > -1 || emName.last.indexOf(input.val()) > -1) {
            filteredNames.push(employeeList[i]);
        }
    }
    filteredEmployees = filteredNames;
    displayUsers(filteredNames);
}

createSearchBar();