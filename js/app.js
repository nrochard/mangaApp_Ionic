
document.querySelector(".form").addEventListener("submit", (e) => {
    e.preventDefault();

    let input = document.querySelector(".input").value;
    let type = document.querySelector("#type").shadowRoot.querySelector(".select-text").innerHTML;
  
    console.log(type);

    //Gestion d'erreur des types de résultat
    let typeResult;
    if (type === "Animé" && input){
        typeResult = "anime"
        presentLoading();
        requestToApi(input, typeResult, type);
    }
    else if (type === "Personnage"  && input){
        typeResult = "character"
        presentLoading();
        requestToApi(input, typeResult, type);
    }
    else if (type === "Manga"  && input){
        typeResult = "manga"
        presentLoading();
        requestToApi(input, typeResult, type);
    }
    else if (type === "Personne"  && input){
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
    console.log("input pour API ->", input);
    console.log("type pour API ->", typeResult);
  

    axios
    .get(`https://api.jikan.moe/v3/search/${typeResult}?q=${input}&limit=10`)
        .then((response) =>{
            // console.log(response.data);
            console.log("type pour API ->", typeResult);
            if (typeResult === "anime" || typeResult === "manga"){
                let i = 0;
                let nbSlide = 1;
                response.data.results.forEach(element => {
                    let card = document.querySelector(`.slide${nbSlide}`);
                    card.innerHTML="";
                    card.insertAdjacentHTML("afterbegin", `
                    <ion-card color="light">
                        <ion-card-header>
                            <ion-card-subtitle>${type}</ion-card-subtitle>
                            <img src="${element.image_url}">
                            <ion-card-title class="title ion-padding">${element.title}</ion-card-title>
                        </ion-card-header>
                        <ion-card-content>
                            <p class="synopsis${i}">${element.synopsis}</p>
                            <a href="${element.url}">En savoir plus</a>
                        </ion-card-content>
                    </ion-card>
                `)
                    let moreInfo = document.querySelector(`.synopsis${i}`);
                    typeResult === "anime" ? moreInfo.insertAdjacentHTML("afterend", `<p>Nombre d'épisodes : ${element.episodes} </p>`) : 
                    moreInfo.insertAdjacentHTML("afterend", `<p>Nombre de chapitres : ${element.chapters} </p>`) 
                    i++;
                    nbSlide++;
                });
            }
            else{
                let nbSlide = 1;
                response.data.results.forEach(element => {
                    let card = document.querySelector(`.slide${nbSlide}`);
                    card.innerHTML="";
                    card.insertAdjacentHTML("afterbegin", `
                    <ion-card color="light">
                        <ion-card-header>
                            <ion-card-subtitle>${type}</ion-card-subtitle>
                            <img src="${element.image_url}">
                            <ion-card-title class="title ion-padding">${element.name}</ion-card-title>
                        </ion-card-header>
                    </ion-card>`)
                });
            }

    })
    .catch((error) => {
        if(error.response){
            displayError("Il y a eu un problème, veuillez réessayer plus tard");
            // console.log(error.response.data);
        }
    });
    
}

async function displayError(messageError) {
    const toast = document.createElement('ion-toast');
    toast.message = messageError;
    toast.duration = 3000;
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

  var slides = document.querySelector('ion-slides');

// Optional parameters to pass to the swiper instance.
// See http://idangero.us/swiper/api/ for valid options.
slides.options = {
  initialSlide: 1,
  speed: 400
}