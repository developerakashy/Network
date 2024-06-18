document.addEventListener('DOMContentLoaded', ()=> {
    userRecommended()
})

function userRecommended(){
    fetch("/users")
    .then(response => response.json())
    .then(data => {
        let recommended = document.querySelector("#recommended-users")
        console.log(data)
        data.forEach(obj => {

            recommended.innerHTML += `<section class="logout">
            
            <section class="user">
            <section class="user-image"></section>
            <article class="userinfo">
            <p class="username">${obj.userName}</p>
            <p class="user-name">${obj.userEmail}</p>
            </article>
            </section>
            
            <section class="follow">
            <button class="follow-btn">Follow</button>
            </section>
            
            </section>`
            
            
        })
    })
    .catch(error => {
        console.log(error)
    })
}

