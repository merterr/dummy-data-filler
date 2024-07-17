let btnFillForm = document.getElementById('btnFillForm');
btnFillForm.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'changeForms' }, function(response){
        if (response && response.result) {
          if(response.result.isSuccessful == 'true'){
          }
          
        } else { }
      });
    });
  });



