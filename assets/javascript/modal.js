

let body;
let modalCalcElement;


const createElementHTML = (text) => {
    body = document.querySelector('body')
    modalCalcElement = document.createElement('div');
    const modalElement = document.createElement('div');

    modalElement.className = 'modal';
    modalCalcElement.className = 'modal-calc';

    modalElement.innerHTML = `
    <h3>${text}</h3>
    <span>
        <button class="btn btn-danger">Non</button>
        <button class="btn btn-primary">Oui</button>
    </span>
    `;

    modalCalcElement.addEventListener('click', event => {
        body.removeChild(modalCalcElement);
        event.stopPropagation();
    })

    modalCalcElement.appendChild(modalElement);
    modalElement.addEventListener('click', event => event.stopPropagation())
    body.appendChild(modalCalcElement)
}

const createResponse = () => {
    const cancelButtonElement = document.querySelector('.modal>span> .btn-danger');
    const confirmButtonElement = document.querySelector('.modal>span>.btn-primary');

    return new Promise((resolve, reject) => {
        modalCalcElement.addEventListener('click', event => {
            modalCalcElement.remove()
            resolve(false);
        })

        cancelButtonElement.addEventListener('click', event => {
            body.removeChild(modalCalcElement);
            resolve(false);
        });

        confirmButtonElement.addEventListener('click', event => {
            body.removeChild(modalCalcElement);
            resolve(true);
        })
    });
}

export const openModal = (text) => {

    createElementHTML(text)

    const response = createResponse()

    return response;
}




