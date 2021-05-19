const body = document.getElementById('body');
const main = document.getElementById('main');
const formTitle = document.getElementById('formTitle');
const formPortions = document.getElementById('formPortions');
const formDuration = document.getElementById('formDuration');
const formImgUrl = document.getElementById('formImgUrl');
const formIngredients = document.getElementById('formIngredients');
let saveButton = document.getElementById('save');
const cancelButton = document.getElementById('cancel');
const dishLink = document.getElementById('dish-link');
const aboutLink = document.getElementById('about-link');

function getDate(){
var today = new Date();
var datedate = today.getFullYear()+' - '+(today.getMonth()+1)+' - '+today.getDate() + '  (YYYY / MM / DD)';
return datedate;
}

function getDishesFromServer() {
    fetch('http://localhost:3000/dishes')
        .then(function (response) {

            response.json().then(function (dishes) {
                renderDishesListPage(dishes);
            });
        });
};

function getDishFromServer(id) {
    fetch(`http://localhost:3000/dishes/${id}`)
        .then(function (response) {

            response.json().then(function (dishes) {
                renderDishPage(dishes);
            });
        });
};

function addDishToServer() {

    const postObject = {
        title: formTitle.value,
        portions: formPortions.value,
        duration: formDuration.value,
        date: getDate(),
        imgUrl: formImgUrl.value,
        ingredients: formIngredients.value
    }

    fetch('http://localhost:3000/dishes', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function () {

        getDishesFromServer();
        resetForm();
        closeModal();
    });
}

function deleteDishFromServer(id) {

    fetch(`http://localhost:3000/dishes/${id}`, {
        method: 'DELETE',
    }).then(function () {

        getDishesFromServer();
    });
}

function updateDishToServer(id) {

    const putObject = {
        title: formTitle.value,
        portions: formPortions.value,
        duration: formDuration.value,
        date: getDate(),
        imgUrl: formImgUrl.value,
        ingredients: formIngredients.value
    }

    fetch(`http://localhost:3000/dishes/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(putObject)
    }).then(function () {

        getDishesFromServer();

        resetForm();

        closeModal();
    });
}

function openAddModal() {

    clearSaveButtonEvents();

    saveButton.addEventListener('click', function () {
        addDishToServer()
    });

    body.className = 'show-modal';
}

function openEditModal(dish) {

    formTitle.value = dish.title;
    formPortions.value = dish.portions;
    formDuration.value = dish.duration;
    formImgUrl.value = dish.imgUrl;
    formIngredients.value = dish.content;

    clearSaveButtonEvents();

    saveButton.addEventListener('click', function () {
        updateDishToServer(dish.id)
    });

    body.className = 'show-modal';
}

function removeOldDishesFromDOM() {
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
}

function createDishListDOMNodes(dish) {

    let title = document.createElement('h2');
    title.className = "title";
    title.textContent = dish.title;

    let portions = document.createElement('span');
    portions.className = "info__item";
    portions.textContent = dish.portions;

    let portionsContainer = document.createElement('li');
    portionsContainer.className = "info__item";
    portionsContainer.textContent = 'Number of portions: ';
    portionsContainer.appendChild(portions)

    let duration = document.createElement('span');
    duration.className = "info__mark";
    duration.textContent = dish.duration;

    let durationContainer = document.createElement('li');
    durationContainer.className = "info__item";
    durationContainer.textContent = 'Aprox Duration: ';
    durationContainer.appendChild(duration)

    let date = document.createElement('span');
    date.className = "info__item";
    date.textContent = getDate();

    let dateContainer = document.createElement('li');
    dateContainer.className = "info__item";
    dateContainer.textContent = 'Date of post: ';
    dateContainer.appendChild(date)

    let img = document.createElement('img');
    img.src = dish.imgUrl;
    
     let imgContainer = document.createElement('li');
     imgContainer.className = "info__item";
     imgContainer.appendChild(img)
    
    let paragraph = document.createElement('p');
    paragraph.textContent = dish.ingredients;
    
    let paragraphContainer = document.createElement('li');
    paragraphContainer.className = "content__container";
    paragraphContainer.appendChild(paragraph);
    
    let partialinfoContainer = document.createElement('li');
    partialinfoContainer.appendChild(portionsContainer);
    partialinfoContainer.appendChild(durationContainer);
    partialinfoContainer.appendChild(dateContainer);
    partialinfoContainer.appendChild(imgContainer);
    partialinfoContainer.className = "content__container";    
    
        let infoContainer = document.createElement('ul');
    infoContainer.className = "info__container";
    infoContainer.appendChild(partialinfoContainer);
    infoContainer.appendChild(paragraphContainer)

    let deleteButton = document.createElement('button');
    deleteButton.className = "actions__btn";
    
    deleteButton.addEventListener('click', function () {
        deleteDishFromServer(dish.id);
    });
    deleteButton.textContent = 'Delete';

    let buttonsContainer = document.createElement('div');
    buttonsContainer.className = "actions__container";
    buttonsContainer.appendChild(deleteButton);

    let readMoreButton = document.createElement('button');
    readMoreButton.className = "button";
    
    readMoreButton.addEventListener('click', function () {
        getDishFromServer(dish.id);
    });
    readMoreButton.textContent = "Expand";

    let readMoreButtonContainer = document.createElement('div');
    readMoreButtonContainer.className = "button__container";
    readMoreButtonContainer.appendChild(readMoreButton);

    let articleListNode = document.createElement('article');
    articleListNode.appendChild(title);
    articleListNode.appendChild(buttonsContainer);
    articleListNode.appendChild(infoContainer);
    articleListNode.appendChild(readMoreButtonContainer);
    return articleListNode;
}

function createDishDOMNodes(dish) {

    let title = document.createElement('h2');
    title.className = "title";
    title.textContent = dish.title;

    let portions = document.createElement('span');
    portions.className = "info__item__single";
    portions.textContent = dish.portions;

    let portionsContainer = document.createElement('li');
    portionsContainer.className = "info__item__single";
    portionsContainer.textContent = 'Number of portions: ';
    portionsContainer.appendChild(portions)

    let duration = document.createElement('span');
    duration.className = "info__item__single";
    duration.textContent = dish.duration;

    let durationContainer = document.createElement('li');
    durationContainer.className = "info__item__single";
    durationContainer.textContent = 'Aprox Duration: ';
    durationContainer.appendChild(duration)

    let date = document.createElement('span');
    date.className = "info__item__single";
    date.textContent = getDate();

    let dateContainer = document.createElement('li');
    dateContainer.className = "info__item__single";
    dateContainer.textContent = 'Date of post: ';
    dateContainer.appendChild(date)

    let img = document.createElement('img');
    img.src = dish.imgUrl;

    let imgContainerli = document.createElement('li');
    let imgContainer = document.createElement('div');
    imgContainer.className = "info__item__single";
    imgContainer.appendChild(img)
    imgContainerli.appendChild(imgContainer)

    let paragraph = document.createElement('p');
    paragraph.textContent = dish.ingredients;

    let paragraphContainer = document.createElement('li');
    paragraphContainer.className = "content__container__single";
    paragraphContainer.appendChild(paragraph);

    let infoContainer = document.createElement('ul');
    infoContainer.className = "info__container__single";
    infoContainer.appendChild(portionsContainer);
    infoContainer.appendChild(durationContainer);
    infoContainer.appendChild(dateContainer);
    infoContainer.appendChild(imgContainer);
    infoContainer.appendChild(paragraphContainer);

    let dishNode = document.createElement('article');
    dishNode.appendChild(title);
    dishNode.appendChild(infoContainer);
    return dishNode;
}

function createAboutDOMNodes() {

    let title = document.createElement('h2');
    title.className = "title title--spaced";
    title.textContent = 'Welcome!';

    let imgdiv = document.createElement("div");
    let img = document.createElement('img');
    img.src = "https://static.toiimg.com/photo/64698744.cms";
    imgdiv.appendChild(img);
    imgdiv.className ="about__img__div" ;

    let paragraph = document.createElement('p');
    paragraph.textContent = "You can find here a collection of recipes gathered from food lovers. Feel free to check them out! There's a lot of variation: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    let paragraphContainer = document.createElement('div');
    paragraphContainer.className = "content__container__about";
    paragraphContainer.appendChild(paragraph);

    let dishNode = document.createElement('article');
    dishNode.appendChild(title);
    dishNode.appendChild(imgdiv);
    dishNode.appendChild(paragraphContainer);
    
    return dishNode;
}

function renderDishesListPage(dishes) {

    removeOldDishesFromDOM();

        let addButton = document.createElement('button');
        addButton.className = "button";
   
        addButton.addEventListener('click', openAddModal);
        addButton.textContent = " Add Recipe ";
    
        let addButtonContainer = document.createElement('div');
        addButtonContainer.className = "add__container";
        addButtonContainer.appendChild(addButton);

        main.appendChild(addButtonContainer);

    for (let i = 0; i < dishes.length; i++) {
        let dishDOMNode = createDishListDOMNodes(dishes[i]);
        main.appendChild(dishDOMNode);
    }
}

function renderDishPage(dish) {
    removeOldDishesFromDOM();

    let dishDOMNode = createDishDOMNodes(dish);
    main.appendChild(dishDOMNode);
}

function renderAboutPage() {
    removeOldDishesFromDOM();

    let dishDOMNode = createAboutDOMNodes();
    main.appendChild(dishDOMNode);
}

function resetForm() {
    formTitle.value = '';
    formPortions.value = '';
    formDuration.value = '';
    formImgUrl.value = '';
    formIngredients.value = '';
}

function clearSaveButtonEvents() {
    let newUpdateButton = saveButton.cloneNode(true);
    saveButton.parentNode.replaceChild(newUpdateButton, saveButton);
    saveButton = document.getElementById('save');
}

function closeModal() {
    body.className = '';
}

cancelButton.addEventListener('click', closeModal);
dishLink.addEventListener('click', getDishesFromServer);
aboutLink.addEventListener('click', renderAboutPage);

getDishesFromServer();