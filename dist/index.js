const elems = {
    name: document.querySelector(".name"),
    pass: document.querySelector(".pass"),
    boton: document.querySelector(".but")
  };
  
  elems.boton.onclick = submit;
  
function submit(){
    if(elems.name.value != "" && elems.pass.value != ""){
        fetch('http://api.covicake.me:3000/users/Auth', {  
            method: 'post',  
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
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

