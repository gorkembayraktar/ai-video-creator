import translatte from 'translatte'


export const translate = async (text, lang = 'en') => {
    return await translatte(text, {to: lang}).then(res => {
        return res.text;
    }).catch(err => {
        console.error(err);
        return "";
    });
}
