/* Global Variables */
const apiKey = 'ed177b3f79c20fa58aa4e4b54c655e38'
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather'
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
let date = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();


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
            // make post request to the server 
            await fetch('/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
            // get the data from the server
            let data = await getServerData()
            if(data) {
                loading.innerHTML = ''
                previewContent.innerHTML  = "Your Feelings today: " + data.feelings;
                previewDate.innerHTML = "Date: " + data.date;
                previewTemp.innerHTML = "Temperature: " + data.temperature + " &#8451;";
            }
             // rest input fields to receive new inputs
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
        let response = await fetch(`${url}?zip=${zip},US&appid=${apiKey}`)
      
            let data =  await response.json()

            const { main: { temp } } = data
            const temperature = Math.round(temp - 273.5)
            return temperature
        
    } catch (error) {
        throw new Error(' Please check zipcode then try again later!')
    }
}

async function getServerData() {
    let getData = await fetch('/get');
    let getResp = await getData.json();
    return getResp;
}



