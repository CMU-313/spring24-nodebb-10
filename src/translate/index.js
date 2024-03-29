'use strict'; // This ensures that the file operates in strict mode.

const fetch = require('node-fetch');

const translatorApi = module.exports;

translatorApi.translate = async function (postData) {
    // Ensure the TRANSLATOR_API environment variable is set
    if (!process.env.TRANSLATOR_API) {
        throw new Error('TRANSLATOR_API environment variable is not set.');
    }
    
    // Construct the URL using template literals for cleaner syntax
    const apiUrl = new URL(`/?content=${encodeURIComponent(postData.content)}`, process.env.TRANSLATOR_API);
    
    // Make the fetch request
    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Use dot notation to access properties
    return [data.is_english, data.translated_content];
};
