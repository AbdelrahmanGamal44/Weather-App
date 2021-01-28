const dateText = document.querySelector('.date'),
    cityText = document.querySelector('.city'),
    weatherIcon = document.getElementById('weatherIcon'),
    tempNum = document.getElementById('tempNum'),
    weatherText = document.getElementById('weatherText'),
    airPress = document.getElementById('airPress'),
    humidity = document.getElementById('humidity'),
    visibilityText = document.getElementById('visibility'),
    forcastDiv = document.querySelector('.forcast-future'),
    locationInfoDiv = document.querySelector('.location-info'),
    weatherDiv = document.querySelector('.weather'),

    date = new Date(),
    days = {
        '0':'Sunday',
        '1':'Monday',
        '2':'Tuesday',
        '3':'Wednesday',
        '4':'Thursday',
        '5':'Friday',
        '6':'Saturday',
    },
    form = document.querySelector('.search-box'),
    input = document.querySelector('.search-input'),
    apiKey = 'f76f68817d266998f9ad8a1520645ea6',
    apiUrl = (location) => `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${apiKey}`,
    getDailyForcast = (location) => `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`,
    imageUrl = (iconId) =>`https://openweathermap.org/img/wn/${iconId}@2x.png`;


async function getLocation(query){
    if(input.value){
        forcastDiv.innerHTML = '';
        const resp = await fetch(apiUrl(query));
        const resj = await resp.json();

        locationInfoDiv.style.visibility = 'visible';
        weatherDiv.style.visibility = 'visible';
        forcastDiv.style.visibility = 'visible';

        cityText.innerHTML = `${input.value} ${resj.sys.country}`;
        tempNum.innerHTML = KtoC(resj.main.temp);
        weatherText.innerHTML = resj.weather[0]['main'];
        weatherIcon.setAttribute('src', imageUrl(resj.weather[0]['icon']));
        airPress.innerHTML = `Air Pressure: ${resj.main.pressure} hPa`;
        humidity.innerHTML = `Humidity: ${resj.main.humidity}%`;
        visibilityText.innerHTML = `Visibility: ${resj.visibility/1000}km`;
        

        const resp2 = await fetch(getDailyForcast(query));
        const resj2 = await resp2.json();
        console.log(resj2);
        let daysNumForMonth = function(month,year) {
            return new Date(year, month, 0).getDate();
        };
        let daysNumForThisMonth = daysNumForMonth(date.getMonth(), date.getFullYear());
        let x = date.getDate();
        let z = date.getDay();
        let d = 1;
        for(let ele of resj2.list){
            let dateArray = ele.dt_txt.split(' ');
            dateArray = dateArray[0].split('-');
            if(x+1 == dateArray[2]){
                if(z+d > 6){
                    d = -z;
                }
                const markup = `
                <div class="day">
                    <p>${days[z+d]}</p>
                    <img src="${imageUrl(ele.weather[0]['icon'])}" alt="${ele.weather[0]['main']}">
                    <span>${KtoC(ele.main.temp)}<span class="nested-span">o C</span></span>
                </div>
                `;
                forcastDiv.insertAdjacentHTML('beforeend',markup);
                d++;
                x++;
            }else if(x == daysNumForThisMonth){
                x =0;
                if(x+1 == dateArray[2]){
                    if(z+d > 6){
                        d = -z;
                    }
                    const markup2 = `
                    <div class="day">
                        <p>${days[z+d]}</p>
                        <img src="${imageUrl(ele.weather[0]['icon'])}" alt="${ele.weather[0]['main']}">
                        <span>${KtoC(ele.main.temp)}<span class="nested-span">o C</span></span>
                    </div>
                    `;
                    forcastDiv.insertAdjacentHTML('beforeend',markup2);
                    d++;
                    x++;
                }
            }

        }
    }else{
        alert('CITY NAME REQUIRED');
    }
}
form.addEventListener('submit', e => {
    e.preventDefault();
    getLocation(input.value);
})

function getDate(){
    const date2 = new Date();
    dateText.innerHTML = `${days[date2.getDay()]} ${date2.getHours()-12}:${date2.getMinutes()}:${date2.getSeconds()} PM`;
}
setInterval(getDate,1000);

function KtoC(k){
    return Math.floor((k - 273.15).toFixed(2));
}
