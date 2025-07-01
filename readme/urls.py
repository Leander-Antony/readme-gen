from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GithubLoginView, GetRepoData, GithubLoginDoneView,GetAllReposView, LlamaModelView, CommitReadmeView

urlpatterns = [
    path('auth/', include('social_django.urls', namespace='social')),  # Social Auth URLs
    path('github-login/', GithubLoginView.as_view(), name='github-login'), #The redirect to the Github login page
    path('github-login/done/', GithubLoginDoneView.as_view(), name='github-login-done'), #The callback url
    path('repo-data/<str:owner>/<str:repo>/', GetRepoData.as_view(), name='repo-data'),
    path('all-repos/', GetAllReposView.as_view(), name='all-repos'),
    path('repos/', GetAllReposView.as_view(), name='repos'),
    path("llama-readme/", LlamaModelView.as_view(), name="llama-readme"),
    path("commit-readme/<str:owner>/<str:repo>/", CommitReadmeView.as_view(), name="commit-readme"),

]