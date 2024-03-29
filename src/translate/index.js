// var request = require('request')

// const translatorApi = module.exports;

// translatorApi.translate = async function (postData) {
//     const response = await fetch(process.env.TRANSLATOR_API+'/?content='+postData.content);
//     const data = await response.json();
//     return [data["is_english"], data["translated_content"]]
// }

const fetch = require('node-fetch');

const translatorApi = module.exports;

translatorApi.translate = async function (postData) {
    // Ensure the TRANSLATOR_API environment variable is set
    if (!process.env.TRANSLATOR_API) {
        throw new Error('TRANSLATOR_API environment variable is not set.');
    }
    
    // Construct the URL
    const apiUrl = new URL('/?content=' + encodeURIComponent(postData.content), process.env.TRANSLATOR_API);
    
    // Make the fetch request
    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return [data["is_english"], data["translated_content"]];
};
