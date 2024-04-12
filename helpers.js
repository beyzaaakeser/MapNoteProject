export const setStorage = (data) => {
    // veriyi locale gondermek icin stringe cevirme
    const strData = JSON.stringify(data);

    // localstorage guncelleme
    localStorage.setItem("notes",strData);
}

var carIcon = L.icon({
    iconUrl:"car.png",
    iconSize:[50,60]
})

var homeIcon = L.icon({
    iconUrl:"home-marker.png",
    iconSize:[50,60]
})

var jobIcon = L.icon({
    iconUrl:"job.png",
    iconSize:[50,60]
})

var visitIcon = L.icon({
    iconUrl:"visit.png",
    iconSize:[50,60]
})
export function detecIcon(type){
    switch(type){
        case "park":
            return carIcon;
        case "home":
            return homeIcon ;
        case "job":
            return jobIcon;
        case "goto":
            return visitIcon;
    }
}

export const detecType = (type) => {
    switch (type) {
      case "park":
        return "Car Park";
      case "home":
        return "Home";
      case "job":
        return "Job";
      case "goto":
        return "Visit";
    }
  };