
document.querySelector(".form").addEventListener("submit", (e) => {
    e.preventDefault();

    let input = document.querySelector(".input").value;
    let type = document.querySelector("#type").shadowRoot.querySelector(".select-text").innerHTML;

    //Gestion d'erreur si un type de résultat n'est pas choisi
    if(!type){
        displayError("Please select what are your looking for !");
    }

    //Gestion d'erreur des types de résultat
    let typeResult;
    if (type === "Anime" && input){
        typeResult = "anime"
        presentLoading();
        requestToApi(input, typeResult, type);
    }
    else if (type === "Character"  && input){
        typeResult = "character"
        presentLoading();
        requestToApi(input, typeResult, type);
    }
    else if (type === "Manga"  && input){
        typeResult = "manga"
        presentLoading();
        requestToApi(input, typeResult, type);
    }
    else if (type === "Person"  && input){
        typeResult = "person"
        presentLoading();
        requestToApi(input, typeResult, type);
    }
    else if (type === "Select One"  && !input){
        displayError("Please select what are your looking for !");
    }
    else if(type === "Select One"  && input){
        displayError("Please select what are your looking for !");
    }

    //Gestion d'erreur si le search est vide
    if (!input){
        displayError("Please write a name in the searchbar !");
    }

})

function requestToApi(input, typeResult, type){

    let slider = document.querySelector("ion-slides");
    let nbResult = document.querySelector(".nbResult");

    axios
    .get(`https://api.jikan.moe/v3/search/${typeResult}?q=${input}&limit=10`)
        .then((response) =>{
            
            //Gestion d'erreur si pas de résultat de l'API
            if(response.data.results.length == 0){
                displayError("No result, please try another thing !");   
            }

            //Affichage du nombre de résultat
            response.data.results.length > 1 ? nbResult.innerHTML = `${ response.data.results.length} results` : `${ response.data.results.length} result`

            if (typeResult === "anime" || typeResult === "manga"){
                let i = 0;
                let nbSlide = 1;
                response.data.results.forEach(element => {

                    //Modification de la date au format anglais plus propre
                    let newDate = formatDate(element.start_date);
    
                    //Reset du contenu
                    let card = document.querySelector(`.slide${nbSlide}`);
                    card.innerHTML="";

                    //Insertion des résultats dans le slider
                    card.insertAdjacentHTML("afterbegin", `
                    <ion-card color="light">
                        <ion-card-header>
                            <ion-card-subtitle>${type} (${element.type})</ion-card-subtitle>
                            <ion-card-title class="title ion-padding">${element.title}</ion-card-title>
                            <img src="${element.image_url}">
                        </ion-card-header>
                        <ion-card-content>
                            <p class="align_synopsis created_at">Created at : ${newDate}</p>
                            <p class="align_synopsis synopsis${i}">${element.synopsis}</p>
                            <a class="link" target="_blank" href="${element.url}">More informations</a>
                        </ion-card-content>
                    </ion-card>
                `)

                    //Gestion du nombre d'épisodes ou de chapitre
                    let moreInfo = document.querySelector(`.synopsis${i}`);
                    typeResult === "anime" ? moreInfo.insertAdjacentHTML("afterend", `<p class="chapter_episode">Number of episode(s) : ${element.episodes} </p>`) : 
                    moreInfo.insertAdjacentHTML("afterend", `<p class="chapter_episode">Number of chapter(s) : ${element.chapters} </p>`) 

                    i++;
                    nbSlide++;
                });
            }
            else{
                let nbSlide = 1;
                response.data.results.forEach(element => {

                    //Reset du contenu
                    let card = document.querySelector(`.slide${nbSlide}`);
                    card.innerHTML="";

                    //Insertion des résultats dans le slider
                    card.insertAdjacentHTML("afterbegin", `
                    <ion-card color="light">
                        <ion-card-header>
                            <ion-card-subtitle>${type}</ion-card-subtitle>
                            <img src="${element.image_url}">
                            <ion-card-title class="title ion-padding">${element.name}</ion-card-title>
                            <a class="link" target="_blank" href="${element.url}">More informations</a>
                        </ion-card-header>
                    </ion-card>`)

                    nbSlide++;
                });
            }
    })
    .catch((error) => {
        if(error.response){
            displayError("There is a problem, please try later");
        }
    });
    
}

// Fonction d'affichage des erreurs
async function displayError(messageError) {
    const toast = document.createElement('ion-toast');
    toast.message = messageError;
    toast.duration = 2000;
    toast.color = "danger";
    document.body.appendChild(toast);
    return toast.present();
  }

  async function presentLoading() {
    const loading = document.createElement('ion-loading');
  
    loading.cssClass = 'my-custom-class';
    loading.message = 'Please wait...';
    loading.duration = 2000;
  
    document.body.appendChild(loading);
    await loading.present();
  
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

// Sliders des résultats
var slides = document.querySelector('ion-slides');

    slides.options = {
  initialSlide: 1,
  speed: 400
}

// Fonction pour formater la date
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}