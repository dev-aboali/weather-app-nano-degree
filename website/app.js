/* Global Variables */
const apiKey = 'ed177b3f79c20fa58aa4e4b54c655e38'
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather'
const server = 'http://localhost:3000'
let zipCodeInput = document.querySelector('#zip');
let feelingsInput = document.querySelector('#feelings');
let generateButton = document.getElementById('generate')
let message = document.querySelector('.message')
let loading = document.querySelector('.loading')
let previewDate = document.getElementById('date')
let previewTemp = document.getElementById('temp')
let previewContent = document.getElementById('content')
// Create a new date instance dynamically with JS
let d = new Date();
let date = d.getMonth()+ 1 +'/'+ d.getDate() +'/'+ d.getFullYear();


generateButton.addEventListener('click', async () => {
    // get user inputs for zipcode and feelings
    let zip = zipCodeInput.value.trim(),
        feelings = feelingsInput.value.trim();
   
  
    if(!zip) {
        message.textContent = "*Please type zipcode for your city"
        return;
    } else if(!feelings) {
        message.textContent = "*Tell us your feelings"
        return;
    } else {
        
        try {
              // make loading message to the user before getting results
            loading.innerHTML = 'Loading...'
            let temp = await getWeatherApiData(BASE_URL, zip, apiKey)
           
            const requestBody = {
                temperature: temp,
                date,
                feelings
            }
            // post data to the server
            await postData(`${server}/add`, requestBody)
           
            // get the data from the server
            let data = await getServerData(server + '/get')

            if(data) {
                loading.innerHTML = ''
                previewContent.innerHTML  = "Your Feelings today: " + data.feelings;
                previewDate.innerHTML = "Date: " + data.date;
                previewTemp.innerHTML = "Temperature: " + data.temperature + " &#8451;";
            }
             // rest input fields to receive new entries
                zipCodeInput.value = '';
                feelingsInput.value = '';
            

        } catch (error) {
            loading.textContent = ''
            message.textContent = error   
            setTimeout(() => {
                message.textContent = ''
            }, 3000)
        }

    }
})


async function getWeatherApiData(url ,zip, apiKey) {
    try {
        let response = await fetch(`${url}?zip=${zip},US&appid=${apiKey}&units=metric`)
      
            let data =  await response.json()

            const { main: { temp } } = data
            const temperature = Math.round(temp)
            return temperature
        
    } catch (error) {
        throw new Error(' Please check zipcode then try again later!')
    }
}

async function getServerData(url) {
    let getData = await fetch(url);
    let getResp = await getData.json();
    return getResp;
}

async function postData(url, dataObj) {
     // make post request to the server 
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataObj)
    })
}



