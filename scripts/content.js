const defaultText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi lobortis id massa in pretium.Pellentesque id risus tellus. Morbi dictum commodo magna nec venenatis. Sed eget viverra lectus.Aliquam id purus sed mi blandit accumsan. Praesent sit amet erat lacus. Phasellus in pellentesque metus.Vestibulum eu nisi nulla. Nulla ante est, aliquet eu libero vitae, congue fringilla mauris. Nam erat neque, interdum nec dui id, tincidunt scelerisque purus. Suspendisse sem justo, facilisis et nisi a, vestibulum molestie nibh. Vestibulum eu mauris vestibulum, finibus ante at, semper augue. Donec vehicula urna ipsum, sit amet ultrices ex condimentum eget. Nam at lectus enim. Morbi ornare sagittis orci, eu efficitur nisi finibus vitae.`;
 var d = new Date();
 const emails = ["gmail", "outlook", "hotmail", "test", "protonmail"];
 const userNames = ["merter", "john", "doe01", "jane_01", "jack_02"];


 storageKeys = Object.keys(sessionStorage);
  if(storageKeys.length > 0){
    for (const key of storageKeys) {
      if(key.includes("&")){
        let formId = key.split('&')[0]; 
        if(formId !== ""){
          document.getElementById(formId).innerHTML = sessionStorage.getItem(key);
        }
      }
      
    }
  }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    var forms = document.getElementsByTagName("form");
    if (request.action === 'changeForms') {
      if (forms.length > 0) {
        for (let i=0; i< forms.length;i++) {
          const formElements = forms[i].getElementsByTagName("*");
          for (const element of formElements) {
            if(element.tagName == "INPUT"){
              if(element.getAttribute("type") == 'text'){
                cleanTxt = defaultText.replaceAll('.','').replaceAll(',','').split(' ')
                let txt = "";
                let maxLength = element.getAttribute("maxlength") || 10;
                if(maxLength){
                  if(maxLength > defaultText.length){
                    maxLength = defaultText.length;
                  }
                  let startIdx = getRandomInt(0, maxLength -1);
                  txt = defaultText.substring(startIdx, maxLength);
                }
                element.setAttribute("value", txt);
              }
              else if(element.getAttribute("type") == 'email'){
                 
                var emailIndex = getRandomInt(0,emails.length -1);
                userNameIndex = getRandomInt(0, userNames.length -1);
                element.setAttribute("value", userNames[userNameIndex] + "@" + emails[emailIndex] + ".com" );
              }
              else if(element.getAttribute("type") == 'password'){
                let pass = "pass@test";
                element.setAttribute("value", pass);
              }
              else if(element.getAttribute("type") == 'date'){
                let m = d.getMonth() + 1;
                if(m < 10){
                  m =  "0" + m;
                }
                let date = d.getFullYear()+ "-" + m + "-" + d.getDate();
                element.setAttribute("value", date);
              }
              else if(element.getAttribute("type") == 'time'){
                let time = "08.30";
                element.setAttribute("value", time);
                
              }else if(element.getAttribute("type") == 'number'){
                let min = 0;
                let max = 0;
                if(element.getAttribute("min")){
                  min = element.getAttribute("min");
                }
                if(element.getAttribute("max")){
                  max = element.getAttribute("max");
                }
                var randomIndex = getRandomInt(min, max);
                element.setAttribute("value", randomIndex);
              }
              if(element.getAttribute("type") == 'radio'){
                element.setAttribute("checked", "true");
              }
              

            }
            else if(element.tagName == "TEXTAREA"){
              element.textContent = "Lorem ipsum dolor sit amet.";
            }
            else if(element.tagName == "SELECT"){
              element.options.length;
              element.selectedIndex = 0;
              var randomIndex = getRandomInt(0, element.options.length - 1);
              element.options[randomIndex].setAttribute("selected","true");
              
            }
          }
        }

        let div = document.createElement("div");
        let highestZIndex = getHighestZIndex() +1;
        div.setAttribute("style", "width:100%!important;border-radius:3px!important;padding:10px!important;position:fixed!important;top:5px!important;z-index:"+highestZIndex+"!important");
        p = document.createElement("p");
        p.style.textAlign="center";
        p.style.margin= "0";
        let inp = document.createElement("input");
        inp.setAttribute("placeholder","enter form id");
        inp.setAttribute("style", "background-color:rgba(200,200,200,0.5)!important;")
        inp.value = forms[0].getAttribute("id");
        let btnSaveForm = document.createElement("button");
        let btnClose = document.createElement("button");
        btnClose.setAttribute("style","cursor:pointer!important;background-color:rgba(200,200,200,0.5)!important");
        btnClose.innerText ="X";

        btnClose.addEventListener("click", () => {
          div.style.display = "none";
        });
        btnSaveForm.innerText = "Save";
        btnSaveForm.setAttribute("style","cursor:pointer!important;background-color:rgba(200,200,200,0.5)!important");
        btnSaveForm.addEventListener("click", () => {
          let txt = btnSaveForm.innerText;
          btnSaveForm.innerText = "Ok!";
          setTimeout(() => {
            btnSaveForm.innerText = txt;
          }, 500);

          let storageOrderKey = Date.now();
          let formIdKey = forms[0].getAttribute("id") ?? "";
          storageKey = formIdKey+"&"+storageOrderKey;
          sessionStorage.setItem(storageKey, forms[0].innerHTML);
        });
        p.appendChild(inp);
        p.appendChild(btnSaveForm);
        p.appendChild(btnClose);
        div.appendChild(p);
        document.body.appendChild(div);

        console.log(div);
        
        sendResponse({ result: {isSuccessful : 'true', content : forms[0].getAttribute("id") }});
          
      } 
      else {
          console.log("Form bulunamadı.");
          sendResponse({ result: 'Form bulunamadı.' });
      }

      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
   
    
  }

   
  });

  function getHighestZIndex() {
    // Get all elements on the page
    const elements = document.getElementsByTagName('*');
    let highestZIndex = 0;
  
    // Iterate through each element
    for (let i = 0; i < elements.length; i++) {
      const zIndex = window.getComputedStyle(elements[i]).zIndex;
      
      // Check if the zIndex is a number and greater than the current highest
      if (!isNaN(zIndex) && zIndex !== 'auto') {
        highestZIndex = Math.max(highestZIndex, parseInt(zIndex, 10));
      }
    }
  
    return highestZIndex;
  }