// Это слабый пример санитайзинга. Всегда лучше использовать проверенные решения.
// Если вставлять через textContent — браузер не пустит XSS
// Если нужно через innerHTML, в реальных проектах можно использовать DOMPurify

const BLACKLIST_TAGS = ['script', 'iframe'];
const WHITELIST_ATTRS = ['src', 'alt'];

const R_TAG = /<(\w+)\s?(.*?)>.*?(<\/(.*?)>)?/;
const R_ATTRIBUTES = /(\w+\s*)=(\s*".*?")/g;

export function safe(unsafeString) {
    return unsafeString
        .replace(R_TAG, (match, m1) => {
            return BLACKLIST_TAGS.includes(m1) ? '' : match
        })
        .replace(R_ATTRIBUTES, (match, m1) => {
            return WHITELIST_ATTRS.includes(m1) ? match : ''
        });
}