const elems = {
    name: document.querySelector(".name"),
    pass: document.querySelector(".pass"),
    boton: document.querySelector(".but")
  };
  
  elems.boton.onclick = submit;
  
function submit(){
    if(elems.name.value != "" && elems.pass.value != ""){
        fetch('localhost:3000/userAuth', {  
            method: 'post',  
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: elems.name.value,
                pass: elems.pass.value
                })
          })
          .then(function (data) {  
            console.log('Request succeeded with JSON response', data);  
          })  
          .catch(function (error) {  
            console.log('Request failed', error);  
          });    
    }
}

