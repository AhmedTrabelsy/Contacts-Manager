//auto text setup
window.addEventListener("load", function () {
    setTimeout(function () {
        let welcome = "Welcome To Our Website ";
        let txt = document.getElementById("welcome");
        let counter = setInterval(function () {
            txt.innerHTML = txt.innerHTML + welcome[0];
            welcome = welcome.substring(1);
            if (txt.innerHTML == 'Welcome To Our Website ') {
                clearInterval(counter);
                txt.innerHTML += ` <i class="bi bi-emoji-smile"></i>`;
            }
        }, 80);

    }, 1000);
    let pageItem = window.localStorage.getItem("page");
    if (pageItem == "overview") {
        overviewClick();
    } else if (pageItem == "contacts") {
        contactsClick();
        refresh();
    } else {
        overviewClick();
    }
});

//overview click
let overviewButton = document.getElementById("overView");

overviewButton.addEventListener("click", overviewClick);

function overviewClick() {
    let overView = document.getElementById("overviewDiv");
    let contacts = document.getElementById("contactsList");
    changeFocus(0);
    overView.setAttribute("style", "opacity: 1;");
    contacts.setAttribute("style", "opacity: 0; height: 0; display: none;");
    window.localStorage.setItem("page", "overview");
}

//contacts click
let contactsButton = document.getElementById("contacts");
let contactsButton2 = document.getElementById("contactsClick");

contactsButton.addEventListener("click", contactsClick);
contactsButton2.addEventListener("click", contactsClick);

function contactsClick() {
    let overView = document.getElementById("overviewDiv");
    let contacts = document.getElementById("contactsList");
    changeFocus(1);
    contacts.setAttribute("style", "opacity: 1; display: block;");
    overView.setAttribute("style", "opacity: 0; height: 0; display: none;");
    window.localStorage.setItem("page", "contacts");
}

function changeFocus(n) {
    let classButtons = document.getElementsByClassName("nav-link ");
    for (let i = 0; i < classButtons.length; i++) {
        if (classButtons[i].classList.contains("link-secondary")) {
            classButtons[i].classList.remove("link-secondary");
            classButtons[i].classList.add("link-dark");
        }
    }
    classButtons[n].classList.remove("link-dark");
    classButtons[n].classList.add("link-secondary");
}

//clear data
let clearBtn = document.getElementById("clearData");

clearBtn.addEventListener("click", clearData);
function clearData() {
    localStorage.clear();
    window.location.reload();
}

//take input
function addContact() {
    //enter informations
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Add New Contact',
        text: "Enter the contact informations",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Add',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="First Name">' + '<input id="swal-input2" class="swal2-input" placeholder="Last Name">' + '<input id="swal-input3" class="swal2-input" placeholder="Job Title">' + '<input id="swal-input4" class="swal2-input" placeholder="Phone Number">',
    }).then((result) => {
        if (result.isConfirmed) {
            var formValues = {
                firstName: document.getElementById('swal-input1').value,
                lastName: document.getElementById('swal-input2').value,
                job: document.getElementById('swal-input3').value,
                number: document.getElementById('swal-input4').value,
            };
            if (formValues.firstName != "" && formValues.lastName != "" && formValues.job != "" && formValues.number.length == 8) {
                newContact(formValues);
                refresh();
                swalWithBootstrapButtons.fire(
                    'Addeded!',
                    'Your new contact has been addeded.',
                    'success'
                )
            } else {
                swalWithBootstrapButtons.fire(
                    'Cancelled',
                    'Please insert a valid informations',
                    'error'
                )
            }
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'No changes have been made',
                'error'
            )
        }
    })
}
var contactsArray = [];
var counter;
if (window.localStorage.getItem("contacts") == null) {
    window.localStorage.setItem("contacts", JSON.stringify(contactsArray));
    counter = 0;
} else {
    let contactsArray = JSON.parse(window.localStorage.getItem("contacts"));
    counter = contactsArray.length;
}

function newContact(formValues) {
    //Save to local storage
    let contactsArray = JSON.parse(window.localStorage.getItem("contacts"));
    formValues.id = counter;
    counter++;
    contactsArray.push(formValues);
    window.localStorage.setItem("contacts", JSON.stringify(contactsArray));
}

//Add contacts
let addContactBtn = document.getElementById("addContact");
let contactDisplay = document.getElementById("contact");
addContactBtn.addEventListener("click", addContact);

//refresh contacts
function refresh() {
    let contactsArray = (JSON.parse(window.localStorage.getItem("contacts")));
    let noContacts = document.getElementById("noContacts");
    let newContact;
    let counter = 0;

    contactsContainer.innerHTML = "";
    contactsArray.forEach(element => {
        newContact = contactDisplay.cloneNode(true);
        newContact.children[0].firstChild.innerHTML = element.firstName + " " + element.lastName;
        newContact.children[2].innerHTML = element.job;
        newContact.children[3].innerHTML = element.number;
        newContact.setAttribute("id", counter);
        contactsContainer.append(newContact);
        element.id = counter;
        counter++;
    });
    window.localStorage.setItem("contacts", JSON.stringify(contactsArray));
    if (contactsArray.length != 0) {
        noContacts.setAttribute("style", "display: none;");
    } else {
        noContacts.setAttribute("style", "display: block;");
    }
}

//delete contact
contactsContainer.addEventListener("click", function (e) {
    let clicked = e.target;
    //confirmation
    if (clicked.classList.contains("bi-trash")) {
        clicked = clicked.parentElement;
    }
    if (clicked.classList.contains("delete")) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                //delete contact
                let contactsArray = JSON.parse(window.localStorage.getItem("contacts"));
                clicked = clicked.parentElement.parentElement;
                contactsArray.splice(clicked.getAttribute("id"), 1);
                window.localStorage.setItem("contacts", JSON.stringify(contactsArray));
                refresh();
                swalWithBootstrapButtons.fire(
                    'Deleted!',
                    'Your contact has been deleted.',
                    'success'
                )
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelled',
                    'No changes have been made :)',
                    'error'
                )
            }
        });
    }
});

//edit contact
contactsContainer.addEventListener("click", function (e) {
    let clicked = e.target;
    if (clicked.classList.contains("bi-pencil-square")) {
        clicked = clicked.parentElement;
    }
    if (clicked.classList.contains("edit")) {
        clicked = clicked.parentElement.parentElement;
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })
        swalWithBootstrapButtons.fire({
            title: 'Update Contact',
            text: "Enter the new contact informations",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Update',
            html:
                `<input id="swal-input1" value="${clicked.children[0].firstChild.innerHTML.slice(0, clicked.children[0].firstChild.innerHTML.indexOf(" "))}" class="swal2-input" placeholder="First Name">` + `<input id="swal-input2" value="${clicked.children[0].firstChild.innerHTML.slice(clicked.children[0].firstChild.innerHTML.indexOf(" ") + 1, clicked.children[0].firstChild.innerHTML.length)}" class="swal2-input" placeholder="Last Name">` + `<input id="swal-input3" value="${clicked.children[2].innerHTML}" class="swal2-input" placeholder="Job Title">` + `<input id="swal-input4" value="${clicked.children[3].innerHTML}" class="swal2-input" placeholder="Phone Number">`,
        }).then((result) => {
            if (result.isConfirmed) {
                let contactsArray = JSON.parse(window.localStorage.getItem("contacts"));

                var formValues = {
                    firstName: document.getElementById('swal-input1').value,
                    lastName: document.getElementById('swal-input2').value,
                    job: document.getElementById('swal-input3').value,
                    number: document.getElementById('swal-input4').value,
                };
                if (formValues.firstName != "" && formValues.lastName != "" && formValues.job != "" && formValues.number.length == 8) {
                    //edit contact
                    contactsArray[clicked.getAttribute("id")].firstName = formValues.firstName;
                    contactsArray[clicked.getAttribute("id")].lastName = formValues.lastName;
                    contactsArray[clicked.getAttribute("id")].job = formValues.job;
                    contactsArray[clicked.getAttribute("id")].number = formValues.number;
                    window.localStorage.setItem("contacts", JSON.stringify(contactsArray));
                    refresh();
                    swalWithBootstrapButtons.fire(
                        'Updated!',
                        'Your new contact has been updated.',
                        'success'
                    )
                } else {
                    swalWithBootstrapButtons.fire(
                        'Cancelled',
                        'Please insert a valid informations',
                        'error'
                    )
                }
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelled',
                    'No changes have been made',
                    'error'
                )
            }
        })
    }
});


//search contacts
let search = document.getElementById("search");
search.addEventListener("keyup", searchContacts);

function searchContacts() {
    if (window.localStorage.getItem("page") == "overview") {
        contactsClick();
        refresh();
    }
    contactsArray = JSON.parse(window.localStorage.getItem("contacts"));
    key = search.value.toUpperCase();
    let counter = 0;
    if (contactsArray.length > 0) {
        contactsArray.forEach(function (element) {
            let currentContact = document.getElementById(element.id);
            if ((element.firstName + " " + element.lastName).toUpperCase().indexOf(key) != -1 || element.job.toUpperCase().indexOf(key) != -1 || element.number.toUpperCase().indexOf(key) != -1) {
                currentContact.setAttribute("style", "display: block;");
                counter--;
            } else {
                currentContact.setAttribute("style", "display: none;");
                counter++;
            }
        });
        if (counter == contactsArray.length) {
            noContacts.setAttribute("style", "display: block;");
        } else {
            noContacts.setAttribute("style", "display: none;");
        }
    }
}

search.addEventListener("blur", reset);

function reset() {
    if (search.value == "") {
        refresh();
        let elements = document.getElementsByClassName("person");
        for (let i = 0; i < elements.length; i++) {
            if (elements.getAttribute("id") != "contact") {
                elements[i].setAttribute("style", "display: block;");
            }
        }
    }
}
