// document.addEventListener("DOMContentLoaded", ()=>{
import { showTime, screenHeights, postInteraction } from "./index.js"
let commentPage = document.querySelector("#post-comment-view")


export async function getComment(id){

    let response = await fetch(`/postview/${id}`)
    let result = await response.json()

    postCommentView(result[0][0])
    commentLoad(result[1])
}

// getComment()



function postCommentView(data){
    let date = new Date(data.created)
    let splitedDate = date.toDateString().split(" ")
    let splitedTime = date.toTimeString().split(" ")[0]

    console.log(data)
    commentPage.innerHTML =

            `<section class="post-heading">
                <button class="postview-back">
                    <?xml version="1.0" encoding="UTF-8"?>
                    <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="24" height="24"><path d="M.88,14.09,4.75,18a1,1,0,0,0,1.42,0h0a1,1,0,0,0,0-1.42L2.61,13H23a1,1,0,0,0,1-1h0a1,1,0,0,0-1-1H2.55L6.17,7.38A1,1,0,0,0,6.17,6h0A1,1,0,0,0,4.75,6L.88,9.85A3,3,0,0,0,.88,14.09Z" fill="white" stroke="white"/></svg>

                </button>
                <p>Post</p>
            </section>
            <section class="post-to-be-commented">
                <section class="post-visible-comment">

                    <div>
                        <section class="post-user">

                            <section class="user-image"></section>
                            <section>
                                <p class="username">${data.user.userName}
                                </p>
                                <p class="user-name">${data.user.userEmail}</p>
                            </section>
                        </section>
                        <section class="follow">
                            <button class="follow-btn ${data.id} all ${data.user.userId} ${data.followed == "You"? "following" : data.followed}">${data.followed == "You"? "Edit" : data.followed }</button>
                        </section>
                    </div>

                    <div>${data.content}</div>

                    <div>
                        <p class="user-name">${splitedTime}  • <span> ${splitedDate[2]} ${splitedDate[1]} ${splitedDate[3]}</span>
                        </p>
                    </div>

                    <div>
                        <button class="like-btn like-btn-${data.id} ${data.liked ? "liked" : "not-liked"}">
                        ${data.liked ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path d="M12 21.35l-.874-.835C5.798 16.182 2 12.015 2 8.5 2 5.42 4.42 3 7.5 3 9.642 3 11.486 4.592 12 6.25 12.514 4.591 14.358 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.515-3.798 7.682-8.126 12.015L12 21.35z" fill="rgb(249, 24, 128)" stroke-width="2"/>
                        </svg>`:`<svg class="svg-not-liked" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path d="M12 21.35l-.874-.835C5.798 16.182 2 12.015 2 8.5 2 5.42 4.42 3 7.5 3 9.642 3 11.486 4.592 12 6.25 12.514 4.591 14.358 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.515-3.798 7.682-8.126 12.015L12 21.35z" stroke="rgb(85,85,85)" stroke-width="2" />
                        </svg>`}
                        ${data.like_count > 1 ? data.like_count +" Likes":data.like_count+" Like"}</button><br>
                        <button class="comment-btn ${data.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                                    <path fill="none" d="M0 0h24v24H0z"/>
                                    <path d="M20 2H4a2 2 0 0 0-2 2v16l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-4 10H8v-2h8v2zm4-5H4V5h16v2z" stroke="rgb(85,85,85)" stroke-width="2"/>
                        </svg>
                        ${data.comment_count > 1 ? data.comment_count+" comments" : data.comment_count+" comment"}</button>
                    </div>

                </section>
            </section>

            <section class="comment-textarea">
                <form action="">
                    <section class="user-image"></section>
                    <textarea id="comment-text-content" type="text" placeholder="Post your reply"></textarea>
                    <button>Reply</button>
                </form>
            </section>


            <section class="comment-view">
            </section>`

            let postViewBack  = document.querySelector(".postview-back")

            postViewBack.addEventListener('click', ()=>{
                screenHeights["post-comment-view"] = window.scrollY
                console.log(screenHeights)
                history.back()
            })

            postInteraction('post-visible-comment')

}


function commentLoad(data){
    let comments = document.querySelector(".comment-view")

    data.reverse()


    data.forEach(element => {




    comments.innerHTML += `<section class="post-visible">

            <div>
                <section class="post-user">

                    <section class="user-image"></section>
                    <section>
                        <p class="username">${element.userCommented.userName}  • <span class="user-name">${showTime(element.commentCreated)}</span>
                        </p>
                        <p class="user-name">${element.userCommented.userEmail}</p>
                        </section>
                </section>

                </div>

                <div>${element.content}</div>

            <div>

            <button class="comment-like">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M12 21.35l-.874-.835C5.798 16.182 2 12.015 2 8.5 2 5.42 4.42 3 7.5 3 9.642 3 11.486 4.592 12 6.25 12.514 4.591 14.358 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.515-3.798 7.682-8.126 12.015L12 21.35z" fill="rgb(249, 24, 128)"/>
            </svg>
            6 Likes</button>
            </div>

            </section>`

        });

}

// })
