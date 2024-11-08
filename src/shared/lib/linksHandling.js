/*
 * Binds click events to links and handles navigation.
 *
 * @param {NodeList} links - The links to bind the click events to.
 * @param {Function} linkHandler - The function to handle the link clicks.
 */
export function bindLinkClickEvents(links, linkHandler) {
    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            const navlinks = document.querySelectorAll('.navlink');

            navlinks.forEach((navlink) => {
                navlink.classList.remove('active');
                if (navlink.getAttribute('href') === href) {
                    navlink.classList.add('active');
                }
            });

            linkHandler(event, href);
        });
    });
}
