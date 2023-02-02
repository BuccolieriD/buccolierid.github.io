fetch("./db.json") //fai una chiamata a questo indirizzo
//then= "quando hai finito"

.then((response) => response.json()) //trasforma la risposta alla chiamata in un JSON
.then((data) => {
  //quando hai finito di trasfrmare la risposta in JSON
  //console.log("Success:", data); //in JSON fai le seguenti cose

  data.lavori.forEach((element) => {
    console.log(element.nome);

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


    let divContenitoreModali = document.querySelector("#contenitoreModali");

        let divModale = document.createElement("div");
        divModale.classList.add("modal", "fade" );
        divModale.setAttribute("id", "modal-" + element.id);
        divModale.setAttribute("tabindex", "-1");
        divModale.setAttribute("aria-hidden", "true");
        divModale.setAttribute("aria-labelledby", "exampleModalLabel");
        divContenitoreModali.appendChild(divModale);

            let divModalDialog = document.createElement("div");
            divModalDialog.classList.add("modal-dialog", "modal-xl");
            divModale.appendChild(divModalDialog);

                let divModalContent = document.createElement("div");
                divModalContent.classList.add("modal-content"); 
                divModalDialog.appendChild(divModalContent);

                    let divModalHeader = document.createElement("div");
                    divModalHeader.classList.add("modal-header");
                    divModalContent.appendChild(divModalHeader);

                        let modalH5 = document.createElement("h5");
                        modalH5.classList.add("modal-title");
                        modalH5.innerHTML = element.nomeLavoro;
                        divModalHeader.appendChild(modalH5);

                        let buttonClose = document.createElement("button");
                        buttonClose.classList.add("btn-close");
                        buttonClose.setAttribute("type", "button");
                        buttonClose.setAttribute("data-bs-dismiss", "modal");
                        buttonClose.setAttribute("aria-label", "Close");
                        divModalHeader.appendChild(buttonClose);

                let divModalBody = document.createElement("div");
                divModalBody.classList.add("modal-body", "mx-auto");
                divModalContent.appendChild(divModalBody);      
                
                    
                let tec = tecnologieDev.find(tec => tec == element.categoria); 
                    
                    if(tec != undefined){
                        let iframeModal = document.createElement("iframe");
                        iframeModal.setAttribute("src", element.YoutubeModale );
                        iframeModal.setAttribute("frameborder", "0");
                        iframeModal.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
                        iframeModal.setAttribute("title", "YouTube video player");
                        iframeModal.setAttribute("width", "800");
                        iframeModal.setAttribute("height", "500");
                        iframeModal.setAttribute("allowfullscreen", "true");
                        divModalBody.appendChild(iframeModal);
                    }else{
                        let iframeModal = document.createElement("iframe");
                        iframeModal.setAttribute("src", element.presentazioneModale );
                        iframeModal.setAttribute("frameborder", "0");
                        iframeModal.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
                        iframeModal.setAttribute("title", "YouTube video player");
                        iframeModal.setAttribute("width", "800");
                        iframeModal.setAttribute("height", "500");
                        iframeModal.setAttribute("allowfullscreen", "true");
                        divModalBody.appendChild(iframeModal); 
                    }

                    
        }
    );
    
 
});
