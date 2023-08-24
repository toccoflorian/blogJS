

import { openModal } from "../assets/javascript/modal.js"

import "../assets/styles/styles.scss"
import "./index.scss"

let articles;
let categories;
let filter;
let sort = 'date-desc';

async function getData() {
    try {
        const response = await fetch('https://restapi.fr/api/articlesFlo');
        const body = await response.json();

        return body.length === undefined ? [body] : body;

    } catch (error) {
        console.log(error);
    }
}

async function deleteButtonInitialize() {
    const deleteButtonElement = document.querySelectorAll('.article-actions>.btn-danger');
    deleteButtonElement.forEach(button => {
        button.addEventListener('click', async event => {
            const result = await openModal('Voulez vous vraiment supprimer cette article?');
            if (result === true) {
                try {
                    const target = event.target;
                    const articleId = target.dataset.id;
                    const response = await fetch(`https://restapi.fr/api/articlesFlo/${articleId}`, {
                        method: 'DELETE'
                    })

                    start();
                } catch (error) {
                    console.log(error);
                }
            }
        })
    })
};

function editButtonInitialize() {
    const editButtons = document.querySelectorAll('.article-actions>.btn-primary');
    editButtons.forEach(button => {
        button.addEventListener('click', event => {
            location.href = `form.html?id=${event.target.dataset.id}`
        })
    })
};



function createArticleHTML(article) {
    const date = (new Date(article.createdAt)).toLocaleString('fr-FR', {
        day: "numeric",
        month: 'short',
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
    })
    return `
    <div class='article'>
        <img src=${article.img}/>
        <h2>${article.title ?? ''}</h2>
        <p class='article-author'>${article.author} | le ${date}</p>
        <p class='article-content'>${article.content}</p>
        <div class='article-actions'>
            <button class='btn btn-danger' data-id=${article._id}>Supprimer</button>
            <button class='btn btn-primary' data-id=${article._id}>Modifier</button>
        </div>
    </div>
    `;
}

function initializeButtons() {
    deleteButtonInitialize();
    editButtonInitialize();
}

function getCategories() {
    const cat = articles.reduce((acc, element) => {
        if (!acc[element.category]) {
            acc[element.category] = 1;
        } else {
            acc[element.category] += 1;
        }
        return acc
    }, {})

    const keys = Object.keys(cat)

    let catArray = [];
    for (const el of keys) {

        catArray.push([el, cat[el]])
    }
    return catArray.sort();
}

function initializeCategories() {

    const ulCategoriesElement = document.querySelector('.categories');
    ulCategoriesElement.innerHTML = '';

    for (const category of categories) {

        const li = document.createElement('li');
        li.innerHTML = `${category[0]} (<strong>${category[1]}</strong>)`;
        li.addEventListener('click', async event => {

            if (filter == category[0]) {
                filter = null;
            } else {
                filter = category[0];
            }

            articles = await getData();
            initializePage();
        })
        if (filter === category[0]) { li.className = 'category-selected' }
        ulCategoriesElement.appendChild(li);
    }
}

function filterArticles() {
    if (filter) {
        articles = articles.filter(element => {
            if (element.category === filter) {
                return true;

            } else {
                return false;
            }
        })

    }
}

function fetchArticles() {

    const articlesContainerElement = document.querySelector('.articles-container');
    articlesContainerElement.innerHTML = '';

    for (const article of articles) {
        articlesContainerElement.innerHTML += createArticleHTML(article);
    }
}


function sortAticles() {

    const select = document.querySelector('.sidebar select');
    select.addEventListener("change", event => {
        sort = event.currentTarget.value
        initializePage()
    })

    if (sort === 'date-desc') {
        articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else {
        articles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    }
}


async function initializePage() {

    initializeCategories();

    filterArticles();

    sortAticles()

    fetchArticles();

    initializeButtons();
}

async function start() {

    articles = await getData();
    categories = getCategories();
    initializePage();
}

start()


