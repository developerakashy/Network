// document.addEventListener("DOMContentLoaded",()=>{
import { getComment } from "./postview.js"
let createPost = document.querySelector("#create-posts")
let content = document.querySelector("#post-textarea")
let posts = document.querySelector("#post-nav1")
let followingPosts = document.querySelector("#post-nav2")
let slider = document.querySelector(".slider")
let text = document.querySelector("#post-textarea")
let post_comment = document.querySelector("#post-comment-view")
let home = document.querySelector("#content-home")
let postViewAll  = document.querySelector("#post-view-all")
let postViewFollowing  = document.querySelector("#post-view-following")
let loader  = document.querySelector(".loader")

let homeNavigation = document.querySelector("#home")

let lastClickedButton;
let firstLoad = false
let isLoading = false
let isLoadingFollowing = false
lastClickedButton = "posts"

window.addEventListener('popstate', (event)=>{
    console.log(event.state)
    showContent(event.state.div, event.state.postViewHeight)

})


homeNavigation.addEventListener('click', ()=>{
    showContent(home.id, screenHeights["content-home"])
})


post_comment.style.display = "none"

let screenHeights = {
    'content-home': 0,
    'post-comment-view': 0
}

function showContent(div, scrolling){
    let allContentPage = document.querySelectorAll(".content")
    let element = document.getElementById(div)

    allContentPage.forEach(page => {
        if(page.style.display === "block"){
            screenHeights[page.id] = window.scrollY
            if(page.id === 'content-home'){
                history.replaceState({div:home.id,postViewHeight: screenHeights['content-home'], section:"initial"}, "")

            }


        }
        page.style.display = "none"
    })

    element.style.display = "block"
    if(scrolling >= 0){
        console.log("scrolled: ", scrolling)
        window.scroll(0, scrolling)
    }
    else if(element.id === 'post-comment-view'){
        window.scroll(0, 0)
    }


}

let navContent = {}

function showNavContent(div){
    let nav = document.querySelectorAll(".nav")
    let element = document.getElementById(div)

    nav.forEach(contentView => {

        if(contentView.style.display === "block"){
            navContent[contentView.id] = window.scrollY

        }
        contentView.style.display = "none"
    })

    element.style.display = "block"
    window.scroll(0, navContent[div])
}


async function getFollowingPosts(){
    let response = await fetch(`./followingsPost`)
    return await response.json()
}

async function getAllPosts(){
    let response = await fetch(`./posts`)
    return await response.json()
}


function allPostSlider(){
    posts.firstChild.style.color = "inherit"
    followingPosts.firstChild.style.color = "rgb(113, 118, 123)"
    slider.style.left = "16.27%"
}

function follwingPostSlider(){
    followingPosts.firstChild.style.color = "inherit"
    posts.firstChild.style.color = "rgb(113, 118, 123)"
    slider.style.left = "66.28%"
}


posts.addEventListener("click", async ()=>{
    if(lastClickedButton !== 'posts'){
        allPostSlider()
        lastClickedButton = "posts"
        showNavContent(postViewAll.id)
        return
    }


    lastClickedButton = "posts"
    allPostSlider()


    if(isLoading){
        return
    }

    isLoading = true

    loader.style.display = "block"
    postViewAll.innerHTML = ""
    postViewFollowing.style.display = "none"
    postViewAll.style.display = "none"


    let result = await getAllPosts()
    loadAllPosts(result)

})


followingPosts.addEventListener("click", async ()=>{
    if(lastClickedButton !== 'followingPosts' && firstLoad){
        follwingPostSlider()
        lastClickedButton = "followingPosts";
        showNavContent(postViewFollowing.id)
        return
    }

    if(!firstLoad){
        navContent['post-view-all'] = window.scrollY

    }


    firstLoad = true
    lastClickedButton = "followingPosts";
    follwingPostSlider()


    if(isLoadingFollowing){
        return
    }


    loader.style.display = "block"
    postViewFollowing.innerHTML = ""
    postViewFollowing.style.display = "none"
    postViewAll.style.display = "none"
    isLoadingFollowing = true

    let result = await getFollowingPosts()
    loadFollowingPosts(result)

})

globalThis.scrollTo({top:0,behavior:"smooth"})
followingPosts.firstChild.style.color = "rgb(113, 118, 123)"

createPost.addEventListener("submit", ()=>{
        addPost(content)
        return false
})

text.addEventListener("input",()=>{
        increasingTextareaHeight()

})



increasingTextareaHeight();
history.scrollRestoration = 'manual'
posts.click()
showContent(home.id)


function loadAllPosts(resultAllPost){
    lastClickedButton = "posts"
    allPostSlider()
    globalThis.scrollTo({top:0,behavior:"smooth"})
    showPosts(resultAllPost);
}

function loadFollowingPosts(result){
    lastClickedButton = "followingPosts";
    follwingPostSlider()
    globalThis.scrollTo({top:0,behavior:"smooth"})
    postFollowing(result);
}


function postInteraction(div){
    let postVisible = document.querySelectorAll(`.${div}`)

    postVisible.forEach(post => {

        post.addEventListener("click", (event)=>{
            if(event.target.classList.contains("like-btn")){
                likeThePost(event.target)

            }
            else if(event.target.classList.contains("username") || event.target.classList.contains("user-name") || event.target.classList.contains("user-image")){
                console.log("username")

            }
            else if(event.target.classList.contains("follow") || event.target.classList.contains("following")){
                follow(event.target)

            }

            else{
                if(div === 'post-visible-comment'){
                    return
                }
                let postID = event.target.parentElement.classList[2]

                showContent(post_comment.id)
                console.log()
                getComment(postID)
                console.log(screenHeights)
                history.pushState({div:post_comment.id,postViewHeight: screenHeights["post-comment-view"], section:event.target.id}, "")
                console.log("commentView Pushed")
            }
        })
    })
}


function increasingTextareaHeight(){
    let text = document.querySelector("#post-textarea")
    text.style.height = "0rem"
    text.style.height = text.scrollHeight + 5 + "px"
}


function showPosts(allPost){

    allPost.forEach(element => {

        postViewAll.innerHTML += `
        <section class="post-visible all-post ${element.id}">

        <div>
        <section class="post-user">

        <section class="user-image"></section>
        <section>
        <p class="username"><span>${element.user.userName}</span> • <span class="user-name">${showTime(element.created)}</span>
        </p>
        <p class="user-name">${element.user.userEmail}</p>
        </section>
        </section>
        <section class="follow">

        <button class="follow-btn ${element.id} all ${element.user.userId} ${element.followed == "You"? "following" : element.followed}">${element.followed == "You"? "Edit" : element.followed }</button>
        </section>
        </div>

        <div>${element.content}</div>

        <div>
        <button class="like-btn like-btn-${element.id} ${element.liked ? "liked" : "not-liked"}">
        ${element.liked ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
        <path fill="none" d="M0 0h24v24H0z"/>
        <path d="M12 21.35l-.874-.835C5.798 16.182 2 12.015 2 8.5 2 5.42 4.42 3 7.5 3 9.642 3 11.486 4.592 12 6.25 12.514 4.591 14.358 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.515-3.798 7.682-8.126 12.015L12 21.35z" fill="rgb(249, 24, 128)" stroke-width="2"/>
        </svg>`:`<svg class="svg-not-liked" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
        <path fill="none" d="M0 0h24v24H0z"/>
        <path d="M12 21.35l-.874-.835C5.798 16.182 2 12.015 2 8.5 2 5.42 4.42 3 7.5 3 9.642 3 11.486 4.592 12 6.25 12.514 4.591 14.358 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.515-3.798 7.682-8.126 12.015L12 21.35z" stroke="rgb(85,85,85)" stroke-width="2" />
        </svg>`}
        ${element.like_count > 1 ? element.like_count +" Likes":element.like_count+" Like"}</button><br>
        <button class="comment-btn ${element.id}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M20 2H4a2 2 0 0 0-2 2v16l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-4 10H8v-2h8v2zm4-5H4V5h16v2z" stroke="rgb(85,85,85)" stroke-width="2"/>
        </svg>
        ${element.comment_count > 1 ? element.comment_count+" comments" : element.comment_count+" comment"}</button>
        </div>

        </section>`

    });


    setTimeout(()=>{
        isLoading = false
        if(lastClickedButton === "posts"){
            postViewFollowing.style.display = "none"
            postViewAll.style.display = "block"
            loader.style.display = "none"
            postInteraction("all-post")
        }
    },500)

}


function postFollowing(post){

    if(post.length <= 0){
        console.log("No Following")
        postViewFollowing.innerHTML = `<p class="error">Please follow some user's to see there post Here</p>`
    }

    post.reverse()

    post.forEach(element => {
        postViewFollowing.innerHTML += `
            <section class="post-visible post-following ${element.id}">

            <div>
            <section class="post-user">

            <section class="user-image"></section>
            <section>
            <p class="username"> <span>${element.user.userName}</span> • <span class="user-name">${showTime(element.created)}</span>
            </p>
            <p class="user-name">${element.user.userEmail}</p>
            </section>
            </section>
            <section class="follow">
            <button class="follow-btn ${element.id} Following ${element.user.userId} ${element.followed == "You"? "following" : element.followed}">${element.followed == "You"? "Edit" : element.followed }</button>
            </section>
            </div>

            <div>${element.content}</div>

            <div>
            <button class="like-btn like-btn-${element.id} ${element.liked ? "liked" : "not-liked"}">
            ${element.liked ? `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M12 21.35l-.874-.835C5.798 16.182 2 12.015 2 8.5 2 5.42 4.42 3 7.5 3 9.642 3 11.486 4.592 12 6.25 12.514 4.591 14.358 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.515-3.798 7.682-8.126 12.015L12 21.35z" fill="rgb(249, 24, 128)" stroke-width="2"/>
            </svg>`:`<svg class="svg-not-liked" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M12 21.35l-.874-.835C5.798 16.182 2 12.015 2 8.5 2 5.42 4.42 3 7.5 3 9.642 3 11.486 4.592 12 6.25 12.514 4.591 14.358 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.515-3.798 7.682-8.126 12.015L12 21.35z" stroke="rgb(85,85,85)" stroke-width="2" />
            </svg>`}
            ${element.like_count > 1 ? element.like_count+" Likes":element.like_count+" Like"}</button><br>
            <button class="comment-btn ${element.id}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                            <path fill="none" d="M0 0h24v24H0z"/>
                            <path d="M20 2H4a2 2 0 0 0-2 2v16l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-4 10H8v-2h8v2zm4-5H4V5h16v2z" stroke="rgb(85,85,85)" stroke-width="2"/>
            </svg>
            ${element.comment_count > 1 ? element.comment_count+" comments" : element.comment_count+" comment"}</button>

            </div>
            </section>`

    });



    setTimeout(()=>{
        isLoadingFollowing = false
        if(lastClickedButton === "followingPosts"){
            postViewAll.style.display = "none"
            postViewFollowing.style.display = "block"
            loader.style.display = "none"
            postInteraction("post-following")
        }
    },500)

}


function addPost(content){
    let data = {
        "content":content.value
    }

    fetch(`/post`,{
        method:"POST",
        body:JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message)
    }).catch(error => {
        console.error(error.error)
    })

    content.value = ""
    increasingTextareaHeight()
    showPosts()
}



function showTime(date){
    let createdDate = new Date(date)
    let dateNow = new Date()

    let differ = dateNow - createdDate
    let seconds = Math.floor(differ/1000)
    let minutes = Math.floor(seconds/60)
    let hours = Math.floor(minutes/60)
    let days = Math.floor(hours/24)
    let months = Math.floor(days/30)
    let years = Math.floor(months/12)

    if(years > 0){
        if(years === 1)
            return `${years}year ago`
        return `${years}years ago`
    }
    else if(months > 0){
        if(months === 1)
            return `${months}month ago`
        return `${months}months ago`
    }
    else if(days > 0){
        if(days === 1)
            return `${days}day ago`
        return `${days}days ago`
    }
    else if(hours > 0){
        if(hours === 1)
            return `${hours}hour ago`
        return `${hours}hours ago`
    }
    else if(minutes > 0){
        if(minutes === 1)
            return `${minutes}minute ago`
        return `${minutes}minutes ago`
    }
    else{
        if(seconds === 1)
            return `${seconds}second ago`
        return `${seconds}seconds ago`
    }


}

function addRemoveFollowing(btn){
    if(btn.classList.contains("following")){
        btn.classList.add("follow")
        btn.classList.remove("following")
        btn.textContent = "follow"

    }
    else{
        btn.classList.remove("follow")
        btn.classList.add("following")
        btn.textContent = "following"
    }

}


function follow(element){

    let allFollowBtn = document.querySelectorAll(".all")

    let post = element.className.split(" ")[1]
    let view = element.className.split(" ")[2]
    let relation_with_user = element.className.split(" ")[3]

        fetch(`/follow/${post}`)
        .then(response => response.json())
        .then(data => {
                if(data.message === "sameUser"){
                    console.log(data.message)
                    element.textContent = "Edit"
                    element.classList.add("following")
                }
                else{

                    allFollowBtn.forEach(btn => {
                        let user = btn.className.split(" ")[3]
                        if(user === relation_with_user){
                            addRemoveFollowing(btn)
                        }
                    })


                    if(lastClickedButton === "followingPosts"){
                        followingPosts.click()
                    }
                    else{
                        firstLoad = false
                    }

                }



        })
        .catch(error => {
                console.log(error)
        })


}





function likeThePost(element){
    let id = element.className.split(" ")[1]
    let allLikeButton = document.querySelectorAll(`.${id}`)

        fetch(`/like/${id.split("-")[2]}`)
        .then(response => response.json())
        .then(post => {
                if(post.liked){
                    allLikeButton.forEach(item => {
                        item.classList.add("liked")
                        item.classList.remove("not-liked")
                    })
                }
                else{
                    allLikeButton.forEach(item => {
                        item.classList.add("not-liked")
                        item.classList.remove("liked")
                    })
                }

                allLikeButton.forEach(item => {

                    item.innerHTML = `${post.liked?`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path d="M12 21.35l-.874-.835C5.798 16.182 2 12.015 2 8.5 2 5.42 4.42 3 7.5 3 9.642 3 11.486 4.592 12 6.25 12.514 4.591 14.358 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.515-3.798 7.682-8.126 12.015L12 21.35z" fill="rgb(249, 24, 128)"/>
                        </svg>`:`<svg class="svg-not-liked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path d="M12 21.35l-.874-.835C5.798 16.182 2 12.015 2 8.5 2 5.42 4.42 3 7.5 3 9.642 3 11.486 4.592 12 6.25 12.514 4.591 14.358 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.515-3.798 7.682-8.126 12.015L12 21.35z" stroke="rgb(85,85,85)" stroke-width="2"/>
                        </svg>`}
                        ${post.like_count > 1 ? post.like_count+" Likes":post.like_count+" Like"} `
                })

            })
        .catch(error => {
                console.log(error)
            })

}

export {
    showTime, screenHeights, postInteraction
}

// })
