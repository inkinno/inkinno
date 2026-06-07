import urllib.request
import json
import datetime
import os
import re

USERNAME = "inkinno"
API_URL = f"https://api.github.com/users/{USERNAME}/repos?sort=updated&per_page=100"

def fetch_repos():
    req = urllib.request.Request(API_URL)
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        req.add_header("Authorization", f"token {token}")
        
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def generate_markdown(repos):
    one_year_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=365)
    
    recent_repos = [
        repo for repo in repos 
        if repo["name"] != USERNAME and 
        datetime.datetime.strptime(repo["updated_at"], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=datetime.timezone.utc) > one_year_ago
    ]
    
    recent_repos.sort(key=lambda x: x["updated_at"], reverse=True)
    
    md = "<!-- RECENT_REPOS_START -->\n"
    for repo in recent_repos:
        date_str = repo['updated_at'][:10]
        link = repo.get("homepage")
        if not link or link.strip() == "":
            link = repo["html_url"]
        md += f"- **[{repo['name']}]({link})** - 업데이트: {date_str}\n"
    md += "<!-- RECENT_REPOS_END -->"
    
    return md

def update_readme(new_content):
    try:
        with open("README.md", "r", encoding="utf-8") as f:
            readme = f.read()
    except FileNotFoundError:
        readme = ""
        
    if "<!-- RECENT_REPOS_START -->" not in readme:
        readme += "\n### 🚀 최근 업데이트된 프로젝트 목록 (최근 1년 이내)\n<!-- RECENT_REPOS_START -->\n<!-- RECENT_REPOS_END -->\n"

    updated_readme = re.sub(
        r"<!-- RECENT_REPOS_START -->.*<!-- RECENT_REPOS_END -->", 
        new_content, 
        readme, 
        flags=re.DOTALL
    )
    
    with open("README.md", "w", encoding="utf-8") as f:
        f.write(updated_readme)

if __name__ == "__main__":
    repos = fetch_repos()
    markdown_content = generate_markdown(repos)
    update_readme(markdown_content)
    print("README.md updated successfully.")
