from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from social_django.utils import psa
import requests
from django.shortcuts import redirect
from rest_framework.authtoken.models import Token # Import Token mod
import ollama
import base64
import json
from rest_framework.permissions import AllowAny

class GithubLoginView(APIView):
    permission_classes = [AllowAny]

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
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            token, created = Token.objects.get_or_create(user=user)
            return redirect(f'http://localhost:5173/repos?token={token.key}')
        return Response({'error': 'Authentication failed'}, status=400)





def fetch_all_files_recursively(owner, repo, path, headers, collected_files):
    url = f'https://api.github.com/repos/{owner}/{repo}/contents/{path}'
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return

    ignored_dirs = {"node_modules", ".git", ".github", "dist", "build", "__pycache__"}
    ignored_extensions = {".ico", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"}

    for item in response.json():
        name = item['name']
        item_path = item['path']

        # Skip ignored folders
        if item['type'] == 'dir' and any(part in ignored_dirs for part in item_path.split('/')):
            continue

        # Skip ignored files
        if item['type'] == 'file' and any(name.lower().endswith(ext) for ext in ignored_extensions):
            continue

        if item['type'] == 'file':
            file_response = requests.get(item['download_url'], headers=headers)
            if file_response.status_code == 200:
                collected_files.append({
                    'file_name': name,
                    'file_path': item_path,
                    'content': file_response.text
                })

        elif item['type'] == 'dir':
            fetch_all_files_recursively(owner, repo, item_path, headers, collected_files)


class GetRepoData(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, owner, repo):
        try:
            github_user = request.user.social_auth.get(provider='github')
            access_token = github_user.extra_data['access_token']
        except Exception:
            return Response({'error': 'GitHub account not linked'}, status=400)

        headers = {'Authorization': f'token {access_token}'}
        all_files_content = []

        fetch_all_files_recursively(owner, repo, "", headers, all_files_content)
        return Response(all_files_content)


    

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
        prompt = request.data.get('prompt')
        if not prompt:
            return Response({'error': 'No prompt provided'}, status=400)

        try:
            model_response = ollama.chat(
                model='llama3',
                messages=[{'role': 'user', 'content': prompt}]
            )
            content = model_response.get('message', {}).get('content', None)
            if content:
                return Response({'response': content})
            return Response({'error': 'No content in response'}, status=500)
        except Exception as e:
            return Response({'error': str(e)}, status=500)



class CommitReadmeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, owner, repo):
        readme_content = request.data.get('content')
        if not readme_content:
            return Response({'error': 'No content provided'}, status=400)

        try:
            github_user = request.user.social_auth.get(provider='github')
            access_token = github_user.extra_data['access_token']
        except Exception:
            return Response({'error': 'GitHub account not linked'}, status=400)

        headers = {
            'Authorization': f'token {access_token}',
            'Accept': 'application/vnd.github.v3+json'
        }

        get_url = f'https://api.github.com/repos/{owner}/{repo}/contents/README.md'
        get_response = requests.get(get_url, headers=headers)

        sha = None
        if get_response.status_code == 200:
            sha = get_response.json().get('sha')

        encoded_content = base64.b64encode(readme_content.encode()).decode()

        payload = {
            "message": "created with readmegen",
            "content": encoded_content,
            "branch": "main"  # Change this to actual branch if not main
        }
        if sha:
            payload["sha"] = sha

        commit_url = f'https://api.github.com/repos/{owner}/{repo}/contents/README.md'

        # Debug
        print("PUT URL:", commit_url)
        print("Payload:", json.dumps(payload, indent=2))
        print("Headers:", headers)

        commit_response = requests.put(commit_url, headers=headers, json=payload)

        if commit_response.status_code in [200, 201]:
            return Response({'status': 'README committed'})
        else:
            print("GitHub Commit Error:", commit_response.status_code)
            print(commit_response.json())
            return Response({
                'error': 'Failed to commit README',
                'details': commit_response.json()
            }, status=500)