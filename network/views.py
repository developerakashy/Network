from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.urls import reverse
import json
from django.contrib.auth.decorators import login_required
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
from .models import *


def posts(request):
    try:
        post_detail = Post.objects.all().order_by('-created')
        currentUserId = request.user.id

    except:
        post_detail = Post.objects.all().order_by('-created')


    return JsonResponse([transform(currentUserId, post_view.serialize()) for post_view in post_detail],safe=False)


def index(request):
    return render(request, "network/index.html",{
        "Post" : Post.objects.all().order_by('-created')
    })


def transform(currentUserId,data):
        try:
            user = User.objects.get(id=currentUserId)
            post = Post.objects.get(pk=data["id"])
            currentUserFollowing = [userF.user.id for userF in user.followers.all()]
            postLikedByUser = [userLiked.user.id for userLiked in post.postLiked.all()]
        except:
            currentUserFollowing = []
            postLikedByUser = []


        if currentUserId in postLikedByUser:
            data["liked"] = True
        else:
            data["liked"] = False

        if data["user"]["userId"] == currentUserId:
            data["followed"] = "You"
        elif data["user"]["userId"] in currentUserFollowing:
            data["followed"] = "following"
        else:
            data["followed"] = "follow"

        return data

@login_required
@csrf_exempt
def post(request):
    user = User.objects.get(id=request.user.id)
    if request.method == "POST":
        print("In post")
        data = json.loads(request.body)
        print(data)
        content = data.get("content","")
        print("content")
        Post.objects.create(user=user,content=content,followed="You")

        return JsonResponse({"message":"successfull"},status=200)
    print("out of post")
    return JsonResponse({"error":"error occured"},status=403)

def edit(request,id):
    if request.method == "POST":
        content = request.POST["content"]
        post = Post.objects.get(pk=id)
        post.content = content
        post.edited = True
        post.save()
        return HttpResponseRedirect(reverse('index'))
    if request.method == "GET":
        post = Post.objects.get(pk=id)
        return render(request,"network/edit.html",{
            "post":post
        })

def like(request,id):
    user =  Like.objects.get(user=request.user)
    post = Post.objects.get(id=id)

    if user.post.filter(pk=post.id):
        user.post.remove(post)

    else:
        user.post.add(post)
    post.save()

    currentUserId = request.user.id
    return JsonResponse(transform(currentUserId,post.serialize()),safe=False)


def follow(request,id):
    userFollowing = Following.objects.get(user=request.user)
    post = Post.objects.get(id=id)
    userfollower = Follower.objects.get(user=post.user)

    if post.user.id == request.user.id:
        print("ok")
        return JsonResponse({"message":"sameUser"},status=200)
    elif userFollowing.following.filter(pk=post.user.id):
        userFollowing.following.remove(post.user)
        userfollower.follower.remove(request.user)

    else:
        userFollowing.following.add(post.user)
        userfollower.follower.add(request.user)


    return JsonResponse({"message":"successfull"},status=200)


def followingsPost(request):
    user = Following.objects.get(user=request.user)
    followin = user.following.all()
    posting = Post.objects.none()

    for user_following in followin:
        posting = posting.union(Post.objects.filter(user=user_following))
    data = posting
    posting = Post.objects.none()
    currentUserId = request.user.id


    return JsonResponse([transform(currentUserId,post_deatil.serialize()) for post_deatil in data],safe=False)


def userPost(request,id):
    user = User.objects.get(pk=id)
    posts = Post.objects.filter(user=user)

    return JsonResponse([postByUser.serialize() for postByUser in posts],safe=False)


def followerOfUser(request,id):
    user = Follower.objects.get(user=id)
    # followers = user.following.all()
    return JsonResponse([user.serialize()],safe=False)

def userFollowed(request,id):
    user = Following.objects.get(user=id)
    return JsonResponse([user.serialize()],safe=False)

def postsLikedByUser(request,id):
    user = User.objects.get(id=id)
    postliked = Like.objects.get(user=user)
    return JsonResponse([postliked.serialize()],safe=False)



def postview(request,id):
    post = Post.objects.get(id=id)
    commentOnPost = post.comment_post.all()
    if request.method == "POST":
        content = request.POST["content"]
        comment = PostComment.objects.create(user=request.user,content=content)
        comment.post.add(post)

    comments = [commented.serialize() for commented in commentOnPost]
    currentUserId = request.user.id
    commentedPost = [transform(currentUserId,post.serialize())]
    return JsonResponse([commentedPost, comments],safe=False)

    return render(request, "network/postview.html", {
        "commentOnPost": post.comment_post.all(),
        "Post": post

    })


def users(request):
    users = User.objects.order_by("-created").all()[:5]
    return JsonResponse([user.serialize() for user in users],safe=False)

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            Like.objects.create(user=user)
            Following.objects.create(user=user)
            Follower.objects.create(user=user)
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
