const eventsElement = document.querySelector("#thumbnails")
const selectedImage = document.querySelector("#selected-image");
const selectedTitle = document.querySelector("#selected-title");
const selectedDate = document.querySelector("#selected-date");
const selectedDescription = document.querySelector("#selected-description");
let events_lst = []
let timer_id = 0

function setSelectedIndex(i) {

    clearTimeout(timer_id)

    const currentSelected = document.querySelector("#thumbnails img.selected");
    if(currentSelected) {
        currentSelected.classList.remove("selected")
    }

    


    if (i == events_lst.length){
        i = 0
    }
    

    const event = document.querySelector("#" +`thumb-${i}`)
    const event_info = events_lst[i]
    event.classList.add("selected")

    console.log(event)
    selectedImage.setAttribute("src", event_info.image_url);
    selectedTitle.setAttribute("href", event_info.permalink);
    selectedTitle.setAttribute("class", "selected-title"); // Optional, if needed
    selectedTitle.innerText = event_info.event_title;
    selectedDate.innerText = getReadableTime(event_info.datetime_start);
    selectedDescription.innerText = event_info.description;

    timer_id = setTimeout(() =>{
        setSelectedIndex((i+1)%events_lst.length)}, 10000)


}

getUMEventsWithImages((events) => {
    for(const ev of events){
        events_lst.push(ev)
        const elem = document.createElement("img");
        elem.setAttribute("src", ev.image_url);
        elem.innerText = ev.event_title;
        elem.id = `thumb-${events.indexOf(ev)}`
        eventsElement.append(elem);
        elem.addEventListener("click", () => setSelectedIndex((events.indexOf(ev))%events.length));
    }
    //const selected = document.querySelector("img")
    //selected.setAttribute("class", "selected-image");
    if (events.length > 0) {
        setSelectedIndex(0);
    }
});

const timeout = 10000

