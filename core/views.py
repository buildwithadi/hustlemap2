from django.shortcuts import render
from django.http import JsonResponse
import requests
import os
from dotenv import load_dotenv
from .models import Waitlist
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
import json

load_dotenv()

def landing(request):
    return render(request, 'core/landing.html')

def home(request):
    return render(request, 'core/home.html')

@csrf_exempt
@require_POST
def join_waitlist(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        
        if not email:
            return JsonResponse({'success': False, 'error': 'Email is required'}, status=400)
            
        # Check if email already exists
        if Waitlist.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'error': 'Email already registered'}, status=400)
            
        # Create new waitlist entry
        Waitlist.objects.create(email=email)
        return JsonResponse({'success': True})
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

def generate_roadmap(request):
    if request.method == 'GET':
        return render(request, 'core/home.html')
    
    if request.method == 'POST':
        platform = request.POST.get('platform')
        days = request.POST.get('days')
        category = request.POST.get('category')
        custom_category = request.POST.get('customCategory', '')

        # Use custom category if "Other" is selected
        if category == 'Other' and custom_category:
            category = custom_category
        
        # Prepare the prompt for Deepseek API
        prompt = f"""Create a {days}-day roadmap for growing a {category} account on {platform}. Format as follows:

Day 1

[First task with details]
[Second task with details]
[Third task with details]

---

Continue this exact format for all {days} days. Important:
- Start each day with 'Day X'
- List exactly 3 tasks per day
- Separate days with '---'
- No introduction or conclusion text
- No extra formatting or symbols like astriks(*)"""

        # Make API call to Deepseek
        api_key = os.getenv('DEEPSEEK_API_KEY')
        api_url = os.getenv('DEEPSEEK_API_URL')
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'model': 'deepseek-chat',
            'messages': [
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'temperature': 0.7,
            'max_tokens': 3000
        }
        
        try:
            response = requests.post(
                api_url,
                headers=headers,
                json=data
            )
            response.raise_for_status()
            content = response.json()['choices'][0]['message']['content']

            # Remove any introduction text
            if "Here's" in content:
                content = content.split(":", 1)[1] if ":" in content else content
                content = content.replace("Here's", "").replace("here's", "")
            
            # Split into days and clean up
            days_content = content.split('---')
            cleaned_days = []
            
            for day in days_content:
                # Skip empty sections
                if not day.strip():
                    continue
                
                # Clean up the day content
                day_lines = []
                for line in day.strip().split('\n'):
                    line = line.strip()
                    if line and not line.startswith(('Here', 'here')):
                        day_lines.append(line)
                
                if day_lines and any(line.startswith('Day') for line in day_lines):
                    cleaned_day = '\n'.join(day_lines)
                    if cleaned_day not in cleaned_days:  # Remove duplicates
                        cleaned_days.append(cleaned_day)
            
            # Join days with proper spacing
            final_content = '\n\n---\n\n'.join(cleaned_days)
            
            return JsonResponse({
                'success': True,
                'roadmap': final_content
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    }, status=400) 