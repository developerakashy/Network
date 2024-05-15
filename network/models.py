from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    created = models.DateTimeField(auto_now_add=True)
    
    def serialize(self):
        return {
            "userId":self.id,
            "userName":self.username.capitalize(),
            "userEmail":self.email,
            "userJoined":self.created,
            "follower_count":self.following.all().count(),
            "following_count":self.followers.all().count()
        }

class Post(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    content = models.TextField(max_length=250)
    created = models.DateTimeField(auto_now_add=True)
    edited = models.BooleanField(default=False)
    liked = models.BooleanField(default=False)
    # like_count = models.IntegerField(default=0,blank=True)
    followed = models.TextField(max_length=250)

    def serialize(self):
        return {
            "id":self.id,
            "user":self.user.serialize(),
            "content":self.content,
            "edited":self.edited,
            "liked":self.liked,
            "like_count":self.postLiked.all().count(),
            "comment_count":self.comment_post.all().count(),
            "followed":self.followed,
            "created":self.created
        }

class Like(models.Model):
    user = models.OneToOneField(User,blank=True,on_delete=models.CASCADE)
    post = models.ManyToManyField(Post,related_name="postLiked",blank=True)

    def serialize(self):
        return {
            "user":self.user.username,
            "posts":[postliked.serialize() for postliked in self.post.all()],
            
        }

class Following(models.Model):
    user = models.OneToOneField(User,related_name="follower",on_delete=models.CASCADE)
    following = models.ManyToManyField(User,related_name="following",blank=True)
    
    def serialize(self):
        return {
            "user":self.user.username,
            "following":[userFollowed.serialize() for userFollowed in self.following.all()]
            
        }
    
    

class Follower(models.Model):
    user = models.OneToOneField(User,related_name="userfollower",blank=True,on_delete=models.CASCADE)
    follower = models.ManyToManyField(User,related_name="followers",blank=True)

    def serialize(self):
        return {
            "user":self.user.serialize(),
            "followers":[userFollower.serialize() for userFollower in self.follower.all()]
        }

class PostComment(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    content = models.TextField(max_length=120)
    post = models.ManyToManyField(Post,related_name="comment_post",blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "userCommented":self.user.username,
            "content":self.content,
            "commentOnPost":[commentOnPost.id for commentOnPost in self.post.all()],
            "commentCreated":self.created
        }
    

class PostCommentLiked(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    liked = models.ManyToManyField(PostComment,name="comment_liked",blank=True)

    def serialize(self):
        return{
            "user":self.user.username,
            "liked":[commentliked.id for commentliked in self.liked.all() ]
        }
