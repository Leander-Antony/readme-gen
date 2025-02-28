from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GithubLoginView, GetRepoData, GithubLoginDoneView,GetAllReposView, LlamaModelView

urlpatterns = [
    path('auth/', include('social_django.urls', namespace='social')),  # Social Auth URLs
    path('github-login/', GithubLoginView.as_view(), name='github-login'), #The redirect to the Github login page
    path('github-login/done/', GithubLoginDoneView.as_view(), name='github-login-done'), #The callback url
    path('repo-data/<str:owner>/<str:repo>/', GetRepoData.as_view(), name='repo-data'),
    path('all-repos/', GetAllReposView.as_view(), name='all-repos'),
    path('llama-response/', LlamaModelView.as_view(), name='llama-response'),
]