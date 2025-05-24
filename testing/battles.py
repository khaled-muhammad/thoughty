import requests
from datetime import datetime, timedelta

from const import BASE_URL, get_auth_headers

class BattlesAPITester:
    """Test suite for the Battles API endpoints"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
        
        # Test data
        self.test_pod_1 = None
        self.test_pod_2 = None
        self.test_battle = None
        
    def print_result(self, test_name: str, success: bool, message: str = ""):
        """Print test result with formatting"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if message:
            print(f"   {message}")
        print()
    
    def setup_authentication(self) -> bool:
        """Set up authentication for tests"""
        print("🔧 Setting up authentication...")
        
        # Try to add auth headers
        try:
            self.session.headers.update(get_auth_headers())
            return True
        except Exception as e:
            print(f"   Could not create guest user: {e}")
    
    def setup_test_pods(self) -> bool:
        """Create test pods for battles"""
        print("🔧 Setting up test pods...")
        
        pod1_data = {
            "title": "AI Ethics in Healthcare",
            "content": "AI should prioritize patient safety and transparency in medical decisions.",
            "stage": "final",
            "is_public": True
        }
        
        pod2_data = {
            "title": "AI Efficiency in Healthcare",
            "content": "AI should focus on maximizing treatment efficiency and reducing costs.",
            "stage": "final",
            "is_public": True
        }
        
        try:
            # Create first pod
            response1 = self.session.post(self.base_url + "pods/", json=pod1_data)
            if response1.status_code == 201:
                self.test_pod_1 = response1.json()
                print(f"   Created test pod 1: {self.test_pod_1['id']}")
            else:
                print(f"   Failed to create pod 1: {response1.status_code}")
                return False
            
            # Create second pod
            response2 = self.session.post(self.base_url + "pods/", json=pod2_data)
            if response2.status_code == 201:
                self.test_pod_2 = response2.json()
                print(f"   Created test pod 2: {self.test_pod_2['id']}")
                return True
            else:
                print(f"   Failed to create pod 2: {response2.status_code}")
                return False
                
        except Exception as e:
            print(f"   Error creating test pods: {e}")
            return False
    
    def test_create_battle(self) -> bool:
        """Test creating a new battle"""
        print("🧪 Testing battle creation...")
        
        battle_data = {
            "pod_a": self.test_pod_1["id"],
            "pod_b": self.test_pod_2["id"],
            "vote_threshold": 5,
            "closes_at": (datetime.now() + timedelta(days=1)).isoformat()
        }
        
        try:
            response = self.session.post(self.base_url + "battles/", json=battle_data)
            
            if response.status_code == 201:
                self.test_battle = response.json()
                self.print_result(
                    "Create Battle", 
                    True, 
                    f"Battle created with ID: {self.test_battle['id']}"
                )
                return True
            else:
                self.print_result(
                    "Create Battle", 
                    False, 
                    f"Status: {response.status_code}, Response: {response.text}"
                )
                return False
                
        except Exception as e:
            self.print_result("Create Battle", False, f"Exception: {e}")
            return False
    
    def test_create_invalid_battle(self) -> bool:
        """Test creating a battle with same pod twice (should fail)"""
        print("🧪 Testing invalid battle creation...")
        
        invalid_battle_data = {
            "pod_a": self.test_pod_1["id"],
            "pod_b": self.test_pod_1["id"],  # Same pod!
            "vote_threshold": 3
        }
        
        try:
            response = self.session.post(self.base_url + "battles/", json=invalid_battle_data)
            
            if response.status_code == 400:
                self.print_result(
                    "Invalid Battle Creation", 
                    True, 
                    "Correctly rejected same-pod battle"
                )
                return True
            else:
                self.print_result(
                    "Invalid Battle Creation", 
                    False, 
                    f"Expected 400, got: {response.status_code}"
                )
                return False
                
        except Exception as e:
            self.print_result("Invalid Battle Creation", False, f"Exception: {e}")
            return False
    
    def test_list_battles(self) -> bool:
        """Test listing all battles"""
        print("🧪 Testing battle listing...")
        
        try:
            response = self.session.get(self.base_url + "battles/")
            
            if response.status_code == 200:
                battles = response.json()
                if isinstance(battles, list) and len(battles) > 0:
                    self.print_result(
                        "List Battles", 
                        True, 
                        f"Found {len(battles)} battles"
                    )
                    return True
                else:
                    self.print_result(
                        "List Battles", 
                        False, 
                        "No battles found or invalid response format"
                    )
                    return False
            else:
                self.print_result(
                    "List Battles", 
                    False, 
                    f"Status: {response.status_code}"
                )
                return False
                
        except Exception as e:
            self.print_result("List Battles", False, f"Exception: {e}")
            return False
    
    def test_get_battle_detail(self) -> bool:
        """Test getting battle details"""
        print("🧪 Testing battle detail retrieval...")
        
        if not self.test_battle:
            self.print_result("Get Battle Detail", False, "No test battle available")
            return False
        
        try:
            response = self.session.get(self.base_url + f"battles/{self.test_battle['id']}/")
            
            if response.status_code == 200:
                battle = response.json()
                required_fields = ['id', 'pod_a', 'pod_b', 'created_by', 'created_at']
                missing_fields = [field for field in required_fields if field not in battle]
                
                if not missing_fields:
                    self.print_result(
                        "Get Battle Detail", 
                        True, 
                        f"Retrieved battle {battle['id']} with all required fields"
                    )
                    return True
                else:
                    self.print_result(
                        "Get Battle Detail", 
                        False, 
                        f"Missing fields: {missing_fields}"
                    )
                    return False
            else:
                self.print_result(
                    "Get Battle Detail", 
                    False, 
                    f"Status: {response.status_code}"
                )
                return False
                
        except Exception as e:
            self.print_result("Get Battle Detail", False, f"Exception: {e}")
            return False
    
    def test_create_vote(self) -> bool:
        """Test creating a vote for a battle"""
        print("🧪 Testing vote creation...")
        
        if not self.test_battle:
            self.print_result("Create Vote", False, "No test battle available")
            return False
        
        vote_data = {
            "battle": self.test_battle["id"],
            "choice": self.test_pod_1["id"]  # Vote for pod_a
        }
        
        try:
            response = self.session.post(self.base_url + "vote/", json=vote_data)
            
            if response.status_code == 201:
                vote = response.json()
                self.print_result(
                    "Create Vote", 
                    True, 
                    f"Vote created for battle {vote['battle']}"
                )
                return True
            else:
                self.print_result(
                    "Create Vote", 
                    False, 
                    f"Status: {response.status_code}, Response: {response.text}"
                )
                return False
                
        except Exception as e:
            self.print_result("Create Vote", False, f"Exception: {e}")
            return False
    
    def test_duplicate_vote(self) -> bool:
        """Test that duplicate votes are prevented"""
        print("🧪 Testing duplicate vote prevention...")
        
        if not self.test_battle:
            self.print_result("Duplicate Vote Prevention", False, "No test battle available")
            return False
        
        vote_data = {
            "battle": self.test_battle["id"],
            "choice": self.test_pod_2["id"]  # Try to vote again
        }
        
        try:
            response = self.session.post(self.base_url + "vote/", json=vote_data)
            
            if response.status_code == 400:
                self.print_result(
                    "Duplicate Vote Prevention", 
                    True, 
                    "Correctly prevented duplicate vote"
                )
                return True
            else:
                self.print_result(
                    "Duplicate Vote Prevention", 
                    False, 
                    f"Expected 400, got: {response.status_code}"
                )
                return False
                
        except Exception as e:
            self.print_result("Duplicate Vote Prevention", False, f"Exception: {e}")
            return False
    
    def test_battle_results(self) -> bool:
        """Test getting battle results"""
        print("🧪 Testing battle results...")
        
        if not self.test_battle:
            self.print_result("Battle Results", False, "No test battle available")
            return False
        
        try:
            response = self.session.get(self.base_url + f"battles/{self.test_battle['id']}/results/")
            
            if response.status_code == 200:
                results = response.json()
                if isinstance(results, dict):
                    total_votes = sum(results.values())
                    self.print_result(
                        "Battle Results", 
                        True, 
                        f"Got results with {total_votes} total votes: {results}"
                    )
                    return True
                else:
                    self.print_result(
                        "Battle Results", 
                        False, 
                        "Invalid results format"
                    )
                    return False
            else:
                self.print_result(
                    "Battle Results", 
                    False, 
                    f"Status: {response.status_code}"
                )
                return False
                
        except Exception as e:
            self.print_result("Battle Results", False, f"Exception: {e}")
            return False
    
    def test_ai_verdict(self) -> bool:
        """Test getting AI verdict for battle"""
        print("🧪 Testing AI verdict...")
        
        if not self.test_battle:
            self.print_result("AI Verdict", False, "No test battle available")
            return False
        
        try:
            response = self.session.get(self.base_url + f"battles/{self.test_battle['id']}/ai-verdict/")
            
            if response.status_code == 204:
                self.print_result(
                    "AI Verdict", 
                    True, 
                    "Battle not closed yet (expected behavior)"
                )
                return True
            elif response.status_code == 200:
                verdict = response.json()
                expected_fields = ['winner_pod', 'winner_title', 'reasoning']
                missing_fields = [field for field in expected_fields if field not in verdict]
                
                if not missing_fields:
                    self.print_result(
                        "AI Verdict", 
                        True, 
                        f"Got AI verdict for winner: {verdict['winner_title']}"
                    )
                    return True
                else:
                    self.print_result(
                        "AI Verdict", 
                        False, 
                        f"Missing fields in verdict: {missing_fields}"
                    )
                    return False
            else:
                self.print_result(
                    "AI Verdict", 
                    False, 
                    f"Status: {response.status_code}"
                )
                return False
                
        except Exception as e:
            self.print_result("AI Verdict", False, f"Exception: {e}")
            return False
    
    def test_unauthenticated_access(self) -> bool:
        """Test that unauthenticated requests are rejected"""
        print("🧪 Testing unauthenticated access...")
        
        # Create session without authentication
        unauth_session = requests.Session()
        
        try:
            response = unauth_session.get(self.base_url + f"battles/")
            
            if response.status_code == 401:
                self.print_result(
                    "Unauthenticated Access", 
                    True, 
                    "Correctly rejected unauthenticated request"
                )
                return True
            else:
                self.print_result(
                    "Unauthenticated Access", 
                    False, 
                    f"Expected 401, got: {response.status_code}"
                )
                return False
                
        except Exception as e:
            self.print_result("Unauthenticated Access", False, f"Exception: {e}")
            return False
    
    def run_all_tests(self) -> bool:
        """Run all tests in sequence"""
        print("🚀 Starting Battles API Test Suite")
        print("=" * 50)
        
        # Setup phase
        if not self.setup_authentication():
            print("❌ Authentication setup failed. Cannot continue.")
            return False
        
        if not self.setup_test_pods():
            print("❌ Test pod setup failed. Cannot continue.")
            return False
        
        # Test phase
        tests = [
            self.test_unauthenticated_access,
            self.test_create_battle,
            self.test_create_invalid_battle,
            self.test_list_battles,
            self.test_get_battle_detail,
            self.test_create_vote,
            self.test_duplicate_vote,
            self.test_battle_results,
            self.test_ai_verdict,
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            try:
                if test():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ Test {test.__name__} crashed: {e}")
                failed += 1
        
        # Summary
        print("=" * 50)
        print(f"🏁 Test Summary: {passed} passed, {failed} failed")
        
        if failed == 0:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed. Check the output above.")
            return False


tester  = BattlesAPITester(base_url=BASE_URL)
success = tester.run_all_tests()