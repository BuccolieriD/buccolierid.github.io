fetch("./db.json") //fai una chiamata a questo indirizzo
//then= "quando hai finito"

.then((response) => response.json()) //trasforma la risposta alla chiamata in un JSON
.then((data) => {
  //quando hai finito di trasfrmare la risposta in JSON
  //console.log("Success:", data); //in JSON fai le seguenti cose

  data.categorie.forEach((element) => {
    let menuDropDown = document.querySelector("#dropd");
    let liMenuDropDown = document.createElement("li");
    let aMenuDropDown = document.createElement("a");
    aMenuDropDown.classList.add("dropdown-item");
    menuDropDown.appendChild(liMenuDropDown).appendChild(aMenuDropDown).innerText = element.categoria;

    aMenuDropDown.addEventListener("click", () => {
        if(aMenuDropDown.innerText == "Tutti"){
            stampaLavori();
        }else{stampaLavoriDevFiltrati(aMenuDropDown.innerText);  }
    });

    
    //Array tecnologie Front End
    let tecnologieDev = [
        "Three.js",
        "Angular",
        "JavaScript",
        "Ionic",
        "Bootstrap",
        "Sass e Bootstrap",
        "jQuery",
        "HTML",
        "HTML e CSS",
    ];

    //Array tecnologie Front End
    let categorieMarketing = [
        "Canva e Illustrator",
        "SEM",
        "SEO",
        "Mailchimp",
        "SEO Copywriting"
    ];

    //stampa i lavori filtrati
    function stampaLavoriDevFiltrati(categoriaSelezionata){
        let divContenitorePadre = document.querySelector("#contenitorePadre");
        divContenitorePadre.innerHTML = "";

        data.lavori.forEach((element) => {

            tecnologieDev;
            
            if(categoriaSelezionata == element.categoria){
              
                divContenitorePadre;

                let divLavoro = document.createElement("div");
                divLavoro.classList.add("col");
                divLavoro.classList.add("hov");
                //divLavoro.setAttribute("style", "display:none;");
                divContenitorePadre.appendChild(divLavoro);
                
                    //Div Card
                    let divCard = document.createElement("div");
                    divCard.classList.add("card","h-100", "text-dark", "bg-light");
                    divLavoro.appendChild(divCard);

                    //Card Header
                    let divCardHeader = document.createElement("div");
                    divCardHeader.classList.add("card-header");
                    divCardHeader.innerText = "Categoria: " + element.categoria;
                    divCard.appendChild(divCardHeader);

                    //Img Card
                    let imgCard = document.createElement("img");
                    imgCard.classList.add("card-img-top");
                    imgCard.src = element.srcImgCard;
                    imgCard.setAttribute("alt", element.altImgCard);
                    imgCard.setAttribute("data-bs-toggle", "modal");
                    imgCard.setAttribute("data-bs-target", "#modal-" + element.id);
                    imgCard.setAttribute("type", "button");
                    divCard.appendChild(imgCard);

                    //Card Body
                    let divCardBody = document.createElement("div");
                    divCardBody.classList.add("card-body");
                    divCard.appendChild(divCardBody);

                        //Card Title
                        let divCardTitle = document.createElement("h5");
                        divCardTitle.classList.add("card-title");
                        divCardTitle.innerText = element.nomeLavoro;
                        divCardBody.appendChild(divCardTitle);

                        //Card Text
                        let divCardDescription = document.createElement("p");
                        divCardDescription.classList.add("card-text");
                        divCardDescription.innerText = element.textCard;
                        divCardBody.appendChild(divCardDescription);


                    tecnologieDev.forEach((tec) => {
                        if(tec == element.categoria){
                            //Card Footer
                            let divCardFooter = document.createElement("div");
                            divCardFooter.classList.add("card-footer");
                            divCard.appendChild(divCardFooter);

                            //Card Footer Button YouTube
                            let divCardFooterButtonYouTube = document.createElement("a");
                            divCardFooterButtonYouTube.classList.add("btn", "btn-outline-danger", "btn-sm");
                            divCardFooterButtonYouTube.setAttribute("href", element.linkYouTube);
                            divCardFooterButtonYouTube.setAttribute("target", "_blank");
                            divCardFooterButtonYouTube.setAttribute("style", "margin-right:10px;");
                            divCardFooterButtonYouTube.innerHTML = `<i class="bi bi-youtube"></i> Funzionalità`;
                            divCardFooter.appendChild(divCardFooterButtonYouTube);

                            //Card Footer Button YouTube
                            let divCardFooterButtonGithub = document.createElement("a");
                            divCardFooterButtonGithub.classList.add("btn", "btn-outline-dark", "btn-sm");
                            divCardFooterButtonGithub.setAttribute("href", element.linkGithub);
                            divCardFooterButtonGithub.setAttribute("target", "_blank");
                            divCardFooterButtonGithub.innerHTML = `<i class="bi bi-github"></i> Codice`;
                            divCardFooter.appendChild(divCardFooterButtonGithub);
                            }
                        }    
                    );

                    categorieMarketing.forEach((tec) => {
                        if(tec == element.categoria){
                            //Card Footer
                            let divCardFooter = document.createElement("div");
                            divCardFooter.classList.add("card-footer");
                            divCard.appendChild(divCardFooter);
    
                            //Card Footer Button GoogleDrive
                            let divCardFooterButtonGoogleD = document.createElement("a");
                            divCardFooterButtonGoogleD.classList.add("btn", "btn-outline-primary", "btn-sm");
                            divCardFooterButtonGoogleD.setAttribute("href", element.linkGoogleDrive);
                            divCardFooterButtonGoogleD.setAttribute("target", "_blank");
                            divCardFooterButtonGoogleD.setAttribute("style", "margin-right:10px;");
                            divCardFooterButtonGoogleD.innerHTML = `<i class="bi bi-cloud-arrow-down"></i> Download`;
                            divCardFooter.appendChild(divCardFooterButtonGoogleD);
                        }
                    });
                //        

            }
        }
    )};

    //stampa tutti i lavori
    function stampaLavori(){
        let divContenitorePadre = document.querySelector("#contenitorePadre");
        divContenitorePadre.innerHTML = "";

        data.lavori.forEach((element) => {

            tecnologieDev;
            
              
                divContenitorePadre;

                let divLavoro = document.createElement("div");
                divLavoro.classList.add("col");
                divLavoro.classList.add("hov");
                //divLavoro.setAttribute("style", "display:none;");
                divContenitorePadre.appendChild(divLavoro);
                
                    //Div Card
                    let divCard = document.createElement("div");
                    divCard.classList.add("card","h-100", "text-dark", "bg-light");
                    divLavoro.appendChild(divCard);

                    //Card Header
                    let divCardHeader = document.createElement("div");
                    divCardHeader.classList.add("card-header");
                    divCardHeader.innerText = "Categoria: " + element.categoria;
                    divCard.appendChild(divCardHeader);

                    //Img Card
                    let imgCard = document.createElement("img");
                    imgCard.classList.add("card-img-top");
                    imgCard.src = element.srcImgCard;
                    imgCard.setAttribute("alt", element.altImgCard);
                    imgCard.setAttribute("data-bs-toggle", "modal");
                    imgCard.setAttribute("data-bs-target", "#modal-" + element.id);
                    imgCard.setAttribute("type", "button");
                    divCard.appendChild(imgCard);

                    //Card Body
                    let divCardBody = document.createElement("div");
                    divCardBody.classList.add("card-body");
                    divCard.appendChild(divCardBody);

                        //Card Title
                        let divCardTitle = document.createElement("h5");
                        divCardTitle.classList.add("card-title");
                        divCardTitle.innerText = element.nomeLavoro;
                        divCardBody.appendChild(divCardTitle);

                        //Card Text
                        let divCardDescription = document.createElement("p");
                        divCardDescription.classList.add("card-text");
                        divCardDescription.innerText = element.textCard;
                        divCardBody.appendChild(divCardDescription);


                    tecnologieDev.forEach((tec) => {
                        if(tec == element.categoria){
                            //Card Footer
                            let divCardFooter = document.createElement("div");
                            divCardFooter.classList.add("card-footer");
                            divCard.appendChild(divCardFooter);

                            //Card Footer Button YouTube
                            let divCardFooterButtonYouTube = document.createElement("a");
                            divCardFooterButtonYouTube.classList.add("btn", "btn-outline-danger", "btn-sm");
                            divCardFooterButtonYouTube.setAttribute("href", element.linkYouTube);
                            divCardFooterButtonYouTube.setAttribute("target", "_blank");
                            divCardFooterButtonYouTube.setAttribute("style", "margin-right:10px;");
                            divCardFooterButtonYouTube.innerHTML = `<i class="bi bi-youtube"></i> Funzionalità`;
                            divCardFooter.appendChild(divCardFooterButtonYouTube);

                            //Card Footer Button YouTube
                            let divCardFooterButtonGithub = document.createElement("a");
                            divCardFooterButtonGithub.classList.add("btn", "btn-outline-dark", "btn-sm");
                            divCardFooterButtonGithub.setAttribute("href", element.linkGithub);
                            divCardFooterButtonGithub.setAttribute("target", "_blank");
                            divCardFooterButtonGithub.innerHTML = `<i class="bi bi-github"></i> Codice`;
                            divCardFooter.appendChild(divCardFooterButtonGithub);
                            }
                        }
                    );

                    categorieMarketing.forEach((tec) => {
                        if(tec == element.categoria){
                            //Card Footer
                            let divCardFooter = document.createElement("div");
                            divCardFooter.classList.add("card-footer");
                            divCard.appendChild(divCardFooter);
    
                            //Card Footer Button GoogleDrive
                            let divCardFooterButtonGoogleD = document.createElement("a");
                            divCardFooterButtonGoogleD.classList.add("btn", "btn-outline-primary", "btn-sm");
                            divCardFooterButtonGoogleD.setAttribute("href", element.linkGoogleDrive);
                            divCardFooterButtonGoogleD.setAttribute("target", "_blank");
                            divCardFooterButtonGoogleD.setAttribute("style", "margin-right:10px;");
                            divCardFooterButtonGoogleD.innerHTML = `<i class="bi bi-cloud-arrow-down"></i> Download`;
                            divCardFooter.appendChild(divCardFooterButtonGoogleD);
                        }
                    });
                //        

            }
        )
    }

    
})});





