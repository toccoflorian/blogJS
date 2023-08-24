

const iconMenuMobileElement = document.querySelector('.header-menu-icon');
const headerMobileMenuElement = document.querySelector('.header-mobile-menu');

let isMobileMenuOpen = false;

const mobileMenuClose = () => {

    headerMobileMenuElement.classList.remove('open')
    headerMobileMenuElement.innerHTML = '';
    isMobileMenuOpen = !isMobileMenuOpen;

}
const mobileMenuOpen = () => {

    headerMobileMenuElement.classList.add('open')
    headerMobileMenuElement.innerHTML = `
    <ul>
        <li><a class="" href="./index.html">Acceuil</a></li>
        <li><a class="" href="./form.html">Editer un article</a></li>
    </ul>
    `;
    isMobileMenuOpen = !isMobileMenuOpen;
    headerMobileMenuElement.addEventListener('click', event => event.stopPropagation())
}


iconMenuMobileElement.addEventListener('click', event => {
    event.stopPropagation();
    if (isMobileMenuOpen) {
        mobileMenuClose()
    } else {
        mobileMenuOpen()
    }
})

window.addEventListener('click', event => {
    if (isMobileMenuOpen) {
        mobileMenuClose()
    }
})