document.getElementById("stressForm").addEventListener("submit", function(e){

e.preventDefault()

let q1 = parseInt(document.querySelector('[name="q1"]').value)
let q2 = parseInt(document.querySelector('[name="q2"]').value)
let q3 = parseInt(document.querySelector('[name="q3"]').value)

let score = q1 + q2 + q3

let result = ""

if(score <= 5){
result = "Low Stress 🙂"
}
else if(score <= 10){
result = "Moderate Stress 😐"
}
else{
result = "High Stress ⚠️ Consider relaxation or support."
}

document.getElementById("result").innerText =
"Your Stress Level: " + result

})

// LOGIN

let loginForm = document.getElementById("loginForm")

if(loginForm){

loginForm.addEventListener("submit",function(e){

e.preventDefault()

let email = document.getElementById("email").value
let password = document.getElementById("password").value

fetch("http://localhost:3000/login",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({email,password})

})
.then(res=>res.json())
.then(data=>{

document.getElementById("loginResult").innerText = data.message

if(data.success){
window.location.href="index.html"
}

})

})
}


// REGISTER

let registerForm = document.getElementById("registerForm")

if(registerForm){

registerForm.addEventListener("submit",function(e){

e.preventDefault()

let name = document.getElementById("name").value
let email = document.getElementById("regEmail").value
let password = document.getElementById("regPassword").value

fetch("http://localhost:3000/register",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({name,email,password})

})
.then(res=>res.json())
.then(data=>{

document.getElementById("registerResult").innerText = data.message

})

})

}