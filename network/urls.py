
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users",views.users,name="users"),
    path("user/<str:id>", views.userPost, name="userInfo"),
    path("post", views.post, name="post"),
    path("posts", views.posts, name="posts"),
    path("edit/<str:id>", views.edit, name="edit"),
    path("like/<str:id>", views.like, name="like"),
    path("userLikedPost/<str:id>", views.postsLikedByUser, name="userLikedPost"),
    path("followingsPost", views.followingsPost, name="following"),
    path("followed/<str:id>", views.userFollowed, name="followed"),
    path("follow/<str:id>", views.follow, name="follow"),
    path("userfollower/<str:id>", views.followerOfUser, name="follower"),
    path("postview/<str:id>", views.postview, name="postview"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
