from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from social_django.utils import psa
import requests
from django.shortcuts import redirect
from rest_framework.authtoken.models import Token # Import Token mod
import ollama

class GithubLoginView(APIView):
    def get(self, request, *args, **kwargs):
        return redirect('social:begin', backend='github')

# class GithubLoginDoneView(APIView):
#     def get(self, request, *args, **kwargs):
#         user = request.user
#         if user.is_authenticated:
#             token, created = Token.objects.get_or_create(user=user)  # Correct way to get/create token
#             return Response({'token': token.key})
#         return Response({'error': 'Authentication failed'}, status=400)


class GithubLoginDoneView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            token, created = Token.objects.get_or_create(user=user)
            print(f'Token: {token.key}')  # Debugging to see if token is created
            response = redirect('http://localhost:5173/repos')  # React frontend URL
            response = redirect(f'http://localhost:5173/repos?token={token.key}')
            return response

        return Response({'error': 'Authentication failed'}, status=400)




class GetRepoData(APIView):
    permission_classes = [IsAuthenticated]  # Protect this view

    def get(self, request, owner, repo):
        try:
            # Fetch GitHub access token
            github_user = request.user.social_auth.get(provider='github')
            access_token = github_user.extra_data['access_token']
        except Exception as e:
            return Response({'error': 'GitHub account not linked'}, status=400)

        # URL to get the contents of the repository
        url = f'https://api.github.com/repos/{owner}/{repo}/contents'
        headers = {'Authorization': f'token {access_token}'}

        # Fetch all files from the repository
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            repo_contents = response.json()

            # Initialize a list to store file data
            all_files_content = []

            # Loop through each item (file or directory) in the repo
            for item in repo_contents:
                if item['type'] == 'file':
                    # If it's a file, fetch its content
                    file_response = requests.get(item['download_url'], headers=headers)
                    if file_response.status_code == 200:
                        file_content = file_response.text
                        all_files_content.append({
                            'file_name': item['name'],
                            'file_path': item['path'],
                            'content': file_content
                        })

            return Response(all_files_content)
        else:
            return Response({'error': 'Repo not found or unauthorized access'}, status=response.status_code)

    

class GetAllReposView(APIView):
    permission_classes = [IsAuthenticated]  # Require user to be authenticated

    def get(self, request):
        try:
            # Get the GitHub social_auth data
            github_user = request.user.social_auth.get(provider='github')
            access_token = github_user.extra_data['access_token']
        except Exception as e:
            return Response({'error': 'GitHub account not linked'}, status=400)

        # GitHub API endpoint to get all repositories for the authenticated user
        url = 'https://api.github.com/user/repos'
        headers = {'Authorization': f'token {access_token}'}

        # Make the request to GitHub API
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            # Return the list of repositories
            return Response(response.json())
        else:
            return Response({'error': 'Unable to fetch repositories'}, status=response.status_code)




class LlamaModelView(APIView):

    def post(self, request):
        # Get the input data from the request
        prompt = request.data.get('prompt')
        if not prompt:
            return Response({'error': 'No prompt provided'}, status=400)

        try:
            # Interact with the LLaMA model
            model_response = ollama.chat(model='llama3.2:3b', messages=[{'role': 'user', 'content': prompt}])

            # Access the message content in the response
            response_content = model_response.get('message', {}).get('content', None)

            if response_content:
                return Response({'response': response_content})
            else:
                return Response({'error': 'No content in response'}, status=500)
        
        except Exception as e:
            return Response({'error': str(e)}, status=500)
