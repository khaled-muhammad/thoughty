import requests
import json
import time
import sys
from pprint import pprint
from const import BASE_URL, get_auth_headers, Colors


VERBOSE = True  # Set to False for less output

def log(message, level="info"):
    if not VERBOSE and level == "debug":
        return
    
    prefix = ""
    if level == "success":
        prefix = f"{Colors.OK}[SUCCESS]{Colors.ENDC} "
    elif level == "error":
        prefix = f"{Colors.ERROR}[ERROR]{Colors.ENDC} "
    elif level == "warning":
        prefix = f"{Colors.WARNING}[WARNING]{Colors.ENDC} "
    elif level == "debug":
        prefix = "[DEBUG] "
    
    print(f"{prefix}{message}")

def pretty_print_response(response):
    if not VERBOSE:
        return
        
    print(f"\n{Colors.BOLD}Status Code:{Colors.ENDC} {response.status_code}")
    print(f"{Colors.BOLD}Headers:{Colors.ENDC}")
    for key, value in response.headers.items():
        print(f"  {key}: {value}")
    
    try:
        print(f"{Colors.BOLD}Response Body:{Colors.ENDC}")
        pprint(response.json())
    except:
        print(f"  {response.text[:1000]}")
    
    print("\n" + "-"*80 + "\n")

def test_get_prompts():
    log("Testing Get Prompts...", "debug")
    
    response = requests.get(
        f"{BASE_URL}brainstorm/prompts/",
        headers=get_auth_headers()
    )
    
    pretty_print_response(response)
    
    if response.status_code == 200:
        log("Successfully retrieved prompts!", "success")
        return response.json()
    else:
        log(f"Failed to retrieve prompts: {response.status_code}", "error")
        return []

def test_spin_roulette():
    log("Testing Spin Roulette...", "debug")
    
    headers = get_auth_headers()
    headers["Content-Type"] = "application/json"
    
    response = requests.post(
        f"{BASE_URL}brainstorm/roulette/spin/",
        headers=headers
    )
    
    pretty_print_response(response)
    
    if response.status_code == 200:
        log("Successfully spun roulette!", "success")
        return response.json()
    else:
        log(f"Failed to spin roulette: {response.status_code}", "error")
        return None

def test_create_variation(prompt_id):
    log(f"Testing Create Variation for prompt {prompt_id}...", "debug")
    
    headers = get_auth_headers()
    headers["Content-Type"] = "application/json"
    
    variation_data = {
        "prompt_id": prompt_id,
        "text": "This is a test variation created via Python requests"
    }
    
    response = requests.post(
        f"{BASE_URL}brainstorm/variations/",
        headers=headers,
        json=variation_data
    )
    
    pretty_print_response(response)
    
    if response.status_code in [200, 201]:
        log("Successfully created variation!", "success")
        return response.json()
    else:
        log(f"Failed to create variation: {response.status_code}", "error")
        return None

def test_ai_generate_variations(prompt_id):
    log(f"Testing AI Generate Variations for prompt {prompt_id}...", "debug")
    
    headers = get_auth_headers()
    headers["Content-Type"] = "application/json"
    
    data = {
        "count": 2  # Generate 2 variations
    }
    
    response = requests.post(
        f"{BASE_URL}brainstorm/prompts/{prompt_id}/generate_variations/",
        headers=headers,
        json=data
    )
    
    pretty_print_response(response)
    
    if response.status_code == 200:
        result = response.json()
        
        # If using async tasks, we might need to poll for results
        if "task_id" in result:
            log("AI generation started asynchronously, task ID: " + result["task_id"], "warning")
            log("Waiting for results (polling)...", "debug")
            
            # Simple polling mechanism - in real code you'd want timeouts and better error handling
            max_attempts = 10
            for i in range(max_attempts):
                log(f"Checking results (attempt {i+1}/{max_attempts})...", "debug")
                time.sleep(2)  # Wait 2 seconds between checks
                
                # Check task status - this endpoint would need to be implemented
                check_response = requests.get(
                    f"{BASE_URL}brainstorm/tasks/{result['task_id']}/",
                    headers=headers
                )
                
                if check_response.status_code == 200:
                    task_result = check_response.json()
                    if task_result.get("status") == "completed":
                        log("AI generation task completed!", "success")
                        # Get the variations
                        return task_result.get("variations", [])
                
            log("Timed out waiting for AI generation results", "error")
            return []
        else:
            # Synchronous response
            log("Successfully generated variations with AI!", "success")
            return result
    else:
        log(f"Failed to generate variations with AI: {response.status_code}", "error")
        return []

def test_create_pod_from_variation(variation_id):
    log(f"Testing Create Pod from Variation {variation_id}...", "debug")
    
    headers = get_auth_headers()
    headers["Content-Type"] = "application/json"
    
    data = {
        "variation_id": variation_id
    }
    
    response = requests.post(
        f"{BASE_URL}brainstorm/pods/from-variation/",
        headers=headers,
        json=data
    )
    
    pretty_print_response(response)
    
    if response.status_code in [200, 201]:
        log("Successfully created pod from variation!", "success")
        return response.json()
    else:
        log(f"Failed to create pod from variation: {response.status_code}", "error")
        return None


log(f"{Colors.BOLD}Starting Brainstorm App API Tests{Colors.ENDC}")
log("-" * 50)

# Step 2: Get prompts
prompts = test_get_prompts()
if not prompts:
    log("Cannot proceed without prompts", "error")

# Get the first prompt ID for further tests
prompt_id = prompts[0]["id"] if prompts else None

# Step 3: Spin roulette
roulette_result = test_spin_roulette()

# Step 4: Create a manual variation
variation = test_create_variation(prompt_id)
if not variation:
    log("Failed to create variation", "error")

# Step 5: Generate AI variations
ai_variations = test_ai_generate_variations(prompt_id)

# If we have variations, try to create a pod
variation_id = None
if variation:
    variation_id = variation["id"]
elif ai_variations and isinstance(ai_variations, list) and len(ai_variations) > 0:
    variation_id = ai_variations[0]["id"]

if variation_id:
    # Step 6: Create pod from variation
    pod = test_create_pod_from_variation(variation_id)

log("\nTest Summary:", "debug")
log(f"✓ Authentication: {'Success' if get_auth_headers() != None else 'Failed'}", "debug")
log(f"✓ Get Prompts: {'Success' if prompts else 'Failed'}", "debug")
log(f"✓ Spin Roulette: {'Success' if roulette_result else 'Failed'}", "debug")
log(f"✓ Create Variation: {'Success' if variation else 'Failed'}", "debug")
log(f"✓ AI Generate Variations: {'Success' if ai_variations else 'Failed'}", "debug")

log(f"\n{Colors.BOLD}All tests completed!{Colors.ENDC}")