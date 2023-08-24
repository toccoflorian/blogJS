import "./form.scss"
import "../../assets/styles/styles.scss"
import { openModal } from '../../assets/javascript/modal.js'

const form = document.querySelector("form");
const errorElement = document.querySelector('#errors');
const cancelButtonElement = document.querySelector('.btn-secondary');
const articleId = new URL(location.href).searchParams.get('id');

let errors = [];

function formIsValid(art) {

    if (!art.author || !art.category || !art.content) {
        errors.push('Veuillez renseigner tous les champs.');
    } else {
        errors = [];
    }

    if (errors.length) {
        let errorHtml = '';
        errors.forEach((e) => {
            errorHtml += `<li>${e}</li>`;
        });
        errorElement.innerHTML = errorHtml;
        errors = [];
        return false;
    } else {
        errorElement.innerHTML = '';
        return true
    }

};


async function getArticle(articleId) {
    const response = await fetch('https://restapi.fr/api/articlesFlo/' + articleId)
    return await response.json();
};

if (articleId) {
    console.log('article id:', articleId);
    const article = await getArticle(articleId);

    const authorInput = form.querySelector('input[name="author"]');
    const imageInput = form.querySelector('input[name="img"]');
    const titleInput = form.querySelector('input[name="title"]');
    const categoryInput = form.querySelector('input[name="category"]');
    const contentTextarea = form.querySelector('textarea');

    authorInput.value = article.author || '';
    imageInput.value = article.img || '';
    titleInput.value = article.title || '';
    categoryInput.value = article.category || '';
    contentTextarea.value = article.content || '';


}


cancelButtonElement.addEventListener('click', event => {
    location.href = 'index.html';
});

// recuperer le formulaire et le transformer en objet
form.addEventListener('submit', async event => { // écouter l'evenement
    event.preventDefault(); // annule les actions par default lors de l'evenement comme le fait de recharger une page quand on click sur submit
    const formData = new FormData(form) // creer un objet 'FormData' avec notre formulaire ici 'form'
    const formEntries = formData.entries(); // creer un iterable avec les données de 'form'
    const articleObj = Object.fromEntries(formEntries); // on peut directement creer un objet a partir d'un 'entries', c'est un iterable

    // gerer les erreurs
    if (formIsValid(articleObj)) {
        try {
            const json = JSON.stringify(articleObj);
            if (articleId) { // mettre une methode de type 'upload' au lieu d'enregistré et supprimer
                const result = await openModal('Voulez vous vraiment modifier l\'article?');
                if (result) {
                    const response = await fetch('https://restapi.fr/api/articlesFlo/' + articleId, {
                        method: 'PUT',
                        'Access-Control-Allow-Headers': 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: json
                    }
                    )
                    // location.href = 'index.html'

                }
            } else {

                // creer un JSon de l'objet 'formObj'
                const response = await fetch('https://restapi.fr/api/articlesFlo/', {
                    method: 'POST',
                    'Access-Control-Allow-Headers': 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: json
                })
            }

            location.href = 'index.html'

        } catch (error) {
            console.log('error: ', error);
        }
    };
})


