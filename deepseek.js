// Ask DeepSeek anything about the page - edited by https://metehan.ai
//
// Adjust the value of 'question' on line 26.
// Adjust the value of 'userContentList' on line 27, currently set to body text.
// Other examples such as page title, meta description, heading h1 or h2 are
// shown on line 32 onwards.
//    
// 
// This script demonstrates how JavaScript Snippets can communicate with 
// APIs, in this case DeepSeek.
// 
// This script also shows how the Spider will wait for JavaScript Promises to
// be fulfilled i.e. the fetch request to the ChatGPT API when fulfilled
// will return the data to the Spider.
// 
// IMPORTANT:
// You will need to supply your API key below on line 25 which will be stored
// as part of your SEO Spider configuration in plain text. Also be mindful if 
// sharing this script that you will be sharing your API key also unless you 
// delete it before sharing.
// 
// Also be aware of API limits when crawling large web sites with this snippet.
//

const OPENROUTER_API_KEY = 'sk-or-v1-xxx';
// Define the API endpoint
const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

// Define the question or prompt
const question = 'Analyze the following page content and rewrite title ';

// Select the page content to analyze
// Example: Page Title
const userContentList = [document.title];

// Function to send a request to the OpenRouter API
function chatGptRequest(userContent) {
    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'deepseek/deepseek-r1-distill-llama-70b',
            messages: [
                {
                    role: 'user',
                    content: `${question} ${userContent}`
                }
            ],
            temperature: 0.7
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        return data.choices[0].message.content.trim();
    });
}

// Execute the function for each selected content and return the results to Screaming Frog
return Promise.all(userContentList.map(userContent => {
    return chatGptRequest(userContent);
}))
.then(data => seoSpider.data(data))
.catch(error => seoSpider.error(error));
