import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CodeBracketIcon,
  DocumentTextIcon,
  KeyIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  PlayIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CommandLineIcon,
  ServerIcon,
  LockClosedIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const endpoints = [
  {
    category: 'Authentication',
    icon: KeyIcon,
    color: 'from-red-500 to-orange-600',
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Authenticate user and get access token',
        parameters: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password' }
        ],
        responses: [
          { code: 200, description: 'Authentication successful', example: '{ "token": "jwt_token", "user": {...} }' },
          { code: 401, description: 'Invalid credentials' }
        ]
      },
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register a new user account',
        parameters: [
          { name: 'name', type: 'string', required: true, description: 'Full name' },
          { name: 'email', type: 'string', required: true, description: 'Email address' },
          { name: 'password', type: 'string', required: true, description: 'Password (min 8 chars)' }
        ],
        responses: [
          { code: 201, description: 'User created successfully' },
          { code: 400, description: 'Validation error' }
        ]
      },
      {
        method: 'POST',
        path: '/api/auth/refresh',
        description: 'Refresh access token using refresh token',
        parameters: [
          { name: 'refreshToken', type: 'string', required: true, description: 'Refresh token from login' }
        ],
        responses: [
          { code: 200, description: 'Token refreshed successfully', example: '{ "token": "new_jwt_token" }' },
          { code: 401, description: 'Invalid refresh token' }
        ]
      },
      {
        method: 'POST',
        path: '/api/auth/logout',
        description: 'Logout user and invalidate tokens',
        parameters: [],
        responses: [
          { code: 200, description: 'Logout successful' },
          { code: 401, description: 'Unauthorized' }
        ]
      }
    ]
  },
  {
    category: 'Polls',
    icon: DocumentTextIcon,
    color: 'from-blue-500 to-purple-600',
    endpoints: [
      {
        method: 'GET',
        path: '/api/polls',
        description: 'Get all polls (with pagination)',
        parameters: [
          { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
          { name: 'limit', type: 'integer', required: false, description: 'Items per page (default: 10)' },
          { name: 'status', type: 'string', required: false, description: 'Filter by status (active, closed, draft)' },
          { name: 'category', type: 'string', required: false, description: 'Filter by poll category' },
          { name: 'search', type: 'string', required: false, description: 'Search polls by title or description' }
        ],
        responses: [
          { code: 200, description: 'Polls retrieved successfully' },
          { code: 401, description: 'Unauthorized' }
        ]
      },
      {
        method: 'POST',
        path: '/api/polls',
        description: 'Create a new poll',
        parameters: [
          { name: 'title', type: 'string', required: true, description: 'Poll title' },
          { name: 'description', type: 'string', required: false, description: 'Poll description' },
          { name: 'options', type: 'array', required: true, description: 'Array of poll options' },
          { name: 'endDate', type: 'datetime', required: false, description: 'Poll end date' },
          { name: 'category', type: 'string', required: false, description: 'Poll category' },
          { name: 'isPublic', type: 'boolean', required: false, description: 'Whether poll is public (default: true)' },
          { name: 'allowMultipleVotes', type: 'boolean', required: false, description: 'Allow multiple votes per user (default: false)' }
        ],
        responses: [
          { code: 201, description: 'Poll created successfully' },
          { code: 400, description: 'Validation error' }
        ]
      },
      {
        method: 'GET',
        path: '/api/polls/{id}',
        description: 'Get specific poll by ID',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Poll ID' }
        ],
        responses: [
          { code: 200, description: 'Poll retrieved successfully' },
          { code: 404, description: 'Poll not found' }
        ]
      },
      {
        method: 'PUT',
        path: '/api/polls/{id}',
        description: 'Update an existing poll',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Poll ID' },
          { name: 'title', type: 'string', required: false, description: 'Poll title' },
          { name: 'description', type: 'string', required: false, description: 'Poll description' },
          { name: 'endDate', type: 'datetime', required: false, description: 'Poll end date' },
          { name: 'status', type: 'string', required: false, description: 'Poll status (active, closed, draft)' }
        ],
        responses: [
          { code: 200, description: 'Poll updated successfully' },
          { code: 404, description: 'Poll not found' },
          { code: 403, description: 'Not authorized to update this poll' }
        ]
      },
      {
        method: 'DELETE',
        path: '/api/polls/{id}',
        description: 'Delete a poll',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Poll ID' }
        ],
        responses: [
          { code: 204, description: 'Poll deleted successfully' },
          { code: 404, description: 'Poll not found' },
          { code: 403, description: 'Not authorized to delete this poll' }
        ]
      }
    ]
  },
  {
    category: 'Votes',
    icon: CheckCircleIcon,
    color: 'from-green-500 to-blue-600',
    endpoints: [
      {
        method: 'POST',
        path: '/api/polls/{id}/vote',
        description: 'Submit a vote for a poll',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Poll ID' },
          { name: 'optionId', type: 'string', required: true, description: 'Selected option ID' },
          { name: 'anonymous', type: 'boolean', required: false, description: 'Submit vote anonymously (default: false)' }
        ],
        responses: [
          { code: 200, description: 'Vote submitted successfully' },
          { code: 400, description: 'Invalid vote or poll closed' },
          { code: 409, description: 'User already voted' }
        ]
      },
      {
        method: 'GET',
        path: '/api/polls/{id}/results',
        description: 'Get poll results and analytics',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Poll ID' },
          { name: 'includeVoters', type: 'boolean', required: false, description: 'Include voter details (default: false)' }
        ],
        responses: [
          { code: 200, description: 'Results retrieved successfully' },
          { code: 404, description: 'Poll not found' }
        ]
      },
      {
        method: 'DELETE',
        path: '/api/polls/{id}/vote',
        description: 'Remove user vote from a poll',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Poll ID' }
        ],
        responses: [
          { code: 200, description: 'Vote removed successfully' },
          { code: 404, description: 'Poll not found or no vote exists' }
        ]
      }
    ]
  },
  {
    category: 'Analytics',
    icon: ChartBarIcon,
    color: 'from-purple-500 to-pink-600',
    endpoints: [
      {
        method: 'GET',
        path: '/api/analytics/polls',
        description: 'Get analytics for all polls',
        parameters: [
          { name: 'startDate', type: 'datetime', required: false, description: 'Start date for analytics' },
          { name: 'endDate', type: 'datetime', required: false, description: 'End date for analytics' },
          { name: 'category', type: 'string', required: false, description: 'Filter by poll category' }
        ],
        responses: [
          { code: 200, description: 'Analytics retrieved successfully' },
          { code: 401, description: 'Unauthorized' }
        ]
      },
      {
        method: 'GET',
        path: '/api/analytics/polls/{id}',
        description: 'Get detailed analytics for a specific poll',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Poll ID' },
          { name: 'includeVoters', type: 'boolean', required: false, description: 'Include voter details (default: false)' }
        ],
        responses: [
          { code: 200, description: 'Poll analytics retrieved successfully' },
          { code: 404, description: 'Poll not found' },
          { code: 401, description: 'Unauthorized' }
        ]
      },
      {
        method: 'GET',
        path: '/api/analytics/users',
        description: 'Get user engagement analytics',
        parameters: [
          { name: 'startDate', type: 'datetime', required: false, description: 'Start date for analytics' },
          { name: 'endDate', type: 'datetime', required: false, description: 'End date for analytics' },
          { name: 'groupBy', type: 'string', required: false, description: 'Group by: day, week, month (default: day)' }
        ],
        responses: [
          { code: 200, description: 'User analytics retrieved successfully' },
          { code: 401, description: 'Unauthorized' }
        ]
      }
    ]
  }
];

const codeExamples = [
  {
    language: 'JavaScript',
    title: 'Complete API Integration',
    description: 'Full authentication, poll management, and voting workflow',
    code: `// API Client Class
class VotelyAPI {
  constructor(baseURL = 'https://api.votely.com') {
    this.baseURL = baseURL;
    this.token = null;
  }

  async authenticate(email, password) {
    const response = await fetch(\`\${this.baseURL}/api/auth/login\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) throw new Error('Authentication failed');
    
    const data = await response.json();
    this.token = data.token;
    return data;
  }

  async createPoll(pollData) {
    const response = await fetch(\`\${this.baseURL}/api/polls\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${this.token}\`
      },
      body: JSON.stringify(pollData)
    });
    
    if (!response.ok) throw new Error('Failed to create poll');
    return await response.json();
  }

  async submitVote(pollId, optionId, anonymous = false) {
    const response = await fetch(\`\${this.baseURL}/api/polls/\${pollId}/vote\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${this.token}\`
      },
      body: JSON.stringify({ optionId, anonymous })
    });
    
    if (!response.ok) throw new Error('Failed to submit vote');
    return await response.json();
  }

  async getPollResults(pollId, includeVoters = false) {
    const response = await fetch(
      \`\${this.baseURL}/api/polls/\${pollId}/results?includeVoters=\${includeVoters}\`,
      {
        headers: { 'Authorization': \`Bearer \${this.token}\` }
      }
    );
    
    if (!response.ok) throw new Error('Failed to get results');
    return await response.json();
  }
}

// Usage Example
const api = new VotelyAPI();

// Complete workflow
async function runPollWorkflow() {
  try {
    // 1. Authenticate
    await api.authenticate('user@example.com', 'password123');
    console.log('✅ Authenticated successfully');

    // 2. Create a poll
    const poll = await api.createPoll({
      title: 'Team Lunch Preference',
      description: 'Where should we have lunch this Friday?',
      options: ['Pizza Place', 'Sushi Bar', 'Burger Joint', 'Healthy Salad'],
      endDate: '2024-12-31T23:59:59Z',
      category: 'Team Building',
      isPublic: true,
      allowMultipleVotes: false
    });
    console.log('✅ Poll created:', poll.id);

    // 3. Submit a vote
    await api.submitVote(poll.id, poll.options[0].id);
    console.log('✅ Vote submitted');

    // 4. Get results
    const results = await api.getPollResults(poll.id, true);
    console.log('✅ Results:', results);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runPollWorkflow();`
  },
  {
    language: 'Python',
    title: 'Advanced Python Integration',
    description: 'Comprehensive Python SDK with error handling and async support',
    code: `import requests
import asyncio
import aiohttp
from typing import Optional, Dict, List
from datetime import datetime
import json

class VotelyClient:
    def __init__(self, base_url: str = "https://api.votely.com"):
        self.base_url = base_url
        self.token: Optional[str] = None
        self.session = requests.Session()
    
    def authenticate(self, email: str, password: str) -> Dict:
        """Authenticate user and get access token"""
        response = self.session.post(
            f"{self.base_url}/api/auth/login",
            json={"email": email, "password": password}
        )
        response.raise_for_status()
        data = response.json()
        self.token = data["token"]
        self.session.headers.update({"Authorization": f"Bearer {self.token}"})
        return data
    
    def create_poll(self, poll_data: Dict) -> Dict:
        """Create a new poll with advanced options"""
        response = self.session.post(
            f"{self.base_url}/api/polls",
            json=poll_data
        )
        response.raise_for_status()
        return response.json()
    
    def get_polls(self, **filters) -> Dict:
        """Get polls with filtering and pagination"""
        params = {k: v for k, v in filters.items() if v is not None}
        response = self.session.get(f"{self.base_url}/api/polls", params=params)
        response.raise_for_status()
        return response.json()
    
    def submit_vote(self, poll_id: str, option_id: str, anonymous: bool = False) -> Dict:
        """Submit a vote for a poll"""
        response = self.session.post(
            f"{self.base_url}/api/polls/{poll_id}/vote",
            json={"optionId": option_id, "anonymous": anonymous}
        )
        response.raise_for_status()
        return response.json()
    
    def get_analytics(self, poll_id: Optional[str] = None, **filters) -> Dict:
        """Get analytics data"""
        if poll_id:
            url = f"{self.base_url}/api/analytics/polls/{poll_id}"
        else:
            url = f"{self.base_url}/api/analytics/polls"
        
        params = {k: v for k, v in filters.items() if v is not None}
        response = self.session.get(url, params=params)
        response.raise_for_status()
        return response.json()

# Async version for high-performance applications
class AsyncVotelyClient:
    def __init__(self, base_url: str = "https://api.votely.com"):
        self.base_url = base_url
        self.token: Optional[str] = None
    
    async def authenticate(self, email: str, password: str) -> Dict:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/api/auth/login",
                json={"email": email, "password": password}
            ) as response:
                response.raise_for_status()
                data = await response.json()
                self.token = data["token"]
                return data
    
    async def create_poll_async(self, poll_data: Dict) -> Dict:
        headers = {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/api/polls",
                headers=headers,
                json=poll_data
            ) as response:
                response.raise_for_status()
                return await response.json()

# Usage Examples
def main():
    # Synchronous usage
    client = VotelyClient()
    
    try:
        # Authenticate
        client.authenticate("user@example.com", "password123")
        print("✅ Authenticated successfully")
        
        # Create poll with all options
        poll = client.create_poll({
            "title": "Project Priority Vote",
            "description": "Which project should we prioritize for Q1?",
            "options": ["Feature A", "Feature B", "Feature C", "Feature D"],
            "endDate": "2024-12-31T23:59:59Z",
            "category": "Product Planning",
            "isPublic": True,
            "allowMultipleVotes": False
        })
        print(f"✅ Poll created: {poll['id']}")
        
        # Get polls with filters
        polls = client.get_polls(status="active", category="Product Planning", limit=5)
        print(f"✅ Found {len(polls['data'])} active polls")
        
        # Submit vote
        vote = client.submit_vote(poll["id"], poll["options"][0]["id"])
        print("✅ Vote submitted")
        
        # Get analytics
        analytics = client.get_analytics(poll_id=poll["id"])
        print("✅ Analytics retrieved")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ API Error: {e}")

# Run async example
async def async_example():
    client = AsyncVotelyClient()
    await client.authenticate("user@example.com", "password123")
    
    # Create multiple polls concurrently
    poll_data_list = [
        {"title": f"Poll {i}", "options": ["A", "B", "C"]} 
        for i in range(3)
    ]
    
    tasks = [client.create_poll_async(data) for data in poll_data_list]
    results = await asyncio.gather(*tasks)
    print(f"✅ Created {len(results)} polls concurrently")

if __name__ == "__main__":
    main()
    asyncio.run(async_example())`
  },
  {
    language: 'JavaScript',
    title: 'Fetch API Example',
    description: 'Basic authentication and poll creation',
    code: `// Authenticate user
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await loginResponse.json();

// Create a new poll
const pollResponse = await fetch('/api/polls', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    title: 'Team Lunch Preference',
    description: 'Where should we have lunch?',
    options: ['Pizza', 'Sushi', 'Burger', 'Salad'],
    endDate: '2024-12-31T23:59:59Z'
  })
});

const poll = await pollResponse.json();
console.log('Created poll:', poll);`
  },
  {
    language: 'Python',
    title: 'Python Requests Example',
    description: 'Using Python requests library',
    code: `import requests
import json

# Base URL
BASE_URL = 'https://api.votely.com'

# Authenticate
login_data = {
    'email': 'user@example.com',
    'password': 'password123'
}

response = requests.post(f'{BASE_URL}/api/auth/login', json=login_data)
token = response.json()['token']

# Create poll
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

poll_data = {
    'title': 'Project Priority Vote',
    'description': 'Which project should we prioritize?',
    'options': ['Feature A', 'Feature B', 'Feature C'],
    'endDate': '2024-12-31T23:59:59Z'
}

poll_response = requests.post(
    f'{BASE_URL}/api/polls',
    headers=headers,
    json=poll_data
)

print('Poll created:', poll_response.json())`
  },
  {
    language: 'cURL',
    title: 'cURL Commands',
    description: 'Command line examples',
    code: `# Login and get token
curl -X POST https://api.votely.com/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com", "password": "password123"}'

# Create poll (replace TOKEN with actual token)
curl -X POST https://api.votely.com/api/polls \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Team Meeting Time",
    "description": "When should we schedule the team meeting?",
    "options": ["Monday 9 AM", "Tuesday 2 PM", "Wednesday 10 AM"],
    "endDate": "2024-12-31T23:59:59Z"
  }'

# Get poll results
curl -X GET https://api.votely.com/api/polls/POLL_ID/results \\
  -H "Authorization: Bearer TOKEN"`
  }
];

export default function ApiReference() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExample, setSelectedExample] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-[#15191e] dark:via-[#1a1f26]/50 dark:to-[#1e242c]/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-8">
        {/* Enhanced Animated Background Elements for Light & Dark Modes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary floating orbs with enhanced color schemes */}
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/25 via-cyan-400/20 to-indigo-400/15 dark:from-blue-500/30 dark:via-cyan-500/25 dark:to-indigo-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 0.8, 1],
              opacity: [0.3, 0.6, 0.4, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/25 via-pink-400/20 to-rose-400/15 dark:from-purple-500/30 dark:via-pink-500/25 dark:to-rose-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 0.9, 1.4, 1.2],
              opacity: [0.5, 0.3, 0.7, 0.5],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
          
          {/* Secondary accent elements with mode-specific colors */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-indigo-400/20 via-blue-400/15 to-cyan-400/10 dark:from-indigo-500/25 dark:via-blue-500/20 dark:to-cyan-500/15 rounded-full blur-2xl"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.2, 0.4, 0.2],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-gradient-to-br from-emerald-400/20 via-teal-400/15 to-cyan-400/10 dark:from-emerald-500/25 dark:via-teal-500/20 dark:to-cyan-500/15 rounded-full blur-2xl"
            animate={{
              scale: [1.1, 0.7, 1.1],
              opacity: [0.3, 0.2, 0.3],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          {/* Enhanced particle effects with mode-specific visibility */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-blue-400/50 to-cyan-400/40 dark:from-blue-500/60 dark:to-cyan-500/50 rounded-full shadow-lg"
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-gradient-to-r from-purple-400/60 to-pink-400/50 dark:from-purple-500/70 dark:to-pink-500/60 rounded-full shadow-md"
            animate={{
              scale: [0, 2, 0],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
          
          {/* Additional subtle elements for depth */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-sky-400/15 to-blue-400/10 dark:from-sky-500/20 dark:to-blue-500/15 rounded-full blur-xl"
            animate={{
              scale: [0.9, 1.1, 0.9],
              opacity: [0.1, 0.25, 0.1],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-br from-violet-400/15 to-purple-400/10 dark:from-violet-500/20 dark:to-purple-500/15 rounded-full blur-xl"
            animate={{
              scale: [1.1, 0.8, 1.1],
              opacity: [0.15, 0.3, 0.15],
              rotate: [180, 270, 360],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-8 border border-blue-200/50 dark:border-blue-700/50 shadow-sm dark:shadow-blue-900/20 backdrop-blur-sm"
            >
              <CodeBracketIcon className="w-5 h-5" />
              API Reference
              <span className="ml-2 px-2 py-1 bg-blue-200/70 dark:bg-blue-800/70 rounded-full text-xs font-semibold">v2.0</span>
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              <span className="inline-block">
                API
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="ml-2 inline-block w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"
                />
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent relative">
                Reference
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
            </motion.h1>

            {/* Enhanced Subtitle with Interactive Elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 max-w-4xl mx-auto"
            >
              <motion.p
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"
              >
                Complete API documentation with{' '}
                <motion.span
                  className="font-semibold text-blue-600 dark:text-blue-400"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  interactive examples
                </motion.span>
                ,{' '}
                <motion.span
                  className="font-semibold text-purple-600 dark:text-purple-400"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  authentication guides
                </motion.span>
                , and{' '}
                <motion.span
                  className="font-semibold text-indigo-600 dark:text-indigo-400"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  comprehensive endpoints
                </motion.span>
                .
              </motion.p>
              
              {/* Feature Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-3 text-sm"
              >
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                  <CheckCircleIcon className="w-3 h-3" />
                  RESTful Design
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                  <DocumentTextIcon className="w-3 h-3" />
                  OpenAPI 3.0
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                  <CommandLineIcon className="w-3 h-3" />
                  Code Examples
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                  <ServerIcon className="w-3 h-3" />
                  WebSocket Support
                </span>
              </motion.div>
            </motion.div>

            {/* Enhanced Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <PlayIcon className="w-4 h-4" />
                <span>API Playground</span>
                <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <KeyIcon className="w-4 h-4" />
                <span>Get API Key</span>
                <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* API Overview Section */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-200 dark:border-blue-700 shadow-sm"
            >
              <CodeBracketIcon className="w-5 h-5" />
              Developer Resources
              <span className="ml-2 px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded-full text-xs font-semibold">v2.1</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Complete API
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Reference Guide
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              Everything you need to know about the Votely API - from authentication to advanced features, 
              with comprehensive examples and real-time documentation. Built with modern standards and 
              designed for seamless integration.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CheckCircleIcon className="w-4 h-4" />
                RESTful Design
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <DocumentTextIcon className="w-4 h-4" />
                JSON Responses
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                Rate Limited
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <InformationCircleIcon className="w-4 h-4" />
                WebSocket Ready
              </motion.span>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <GlobeAltIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Base URL
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                All API requests should be made to:
              </p>
              <code className="block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg text-sm font-mono border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                https://api.votely.com
              </code>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <LockClosedIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Use Bearer token authentication:
              </p>
              <code className="block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg text-sm font-mono border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                Authorization: Bearer YOUR_TOKEN
              </code>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ServerIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Rate Limits
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                API rate limits for different tiers:
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700/50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-gray-900 dark:text-white">Free:</span>
                  </div>
                  <span className="font-mono text-green-600 dark:text-green-400 font-semibold">100 requests/hour</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-gray-900 dark:text-white">Pro:</span>
                  </div>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">1,000 requests/hour</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-gray-900 dark:text-white">Enterprise:</span>
                  </div>
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-semibold">10,000 requests/hour</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <InformationCircleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Rate limits reset every hour. Upgrade your plan for higher limits.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-gray-100/50 to-blue-100/30 dark:from-gray-800/50 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium mb-6 border border-emerald-200 dark:border-emerald-700 shadow-sm"
            >
              <CodeBracketIcon className="w-5 h-5" />
              Interactive Examples
              <span className="ml-2 px-2 py-1 bg-emerald-200 dark:bg-emerald-800 rounded-full text-xs font-semibold">Live</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Ready-to-Use
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Code Examples
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Jump-start your integration with our comprehensive code examples. From simple authentication 
              to complex polling workflows, we've got you covered with production-ready snippets.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Copy & Paste Ready
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CommandLineIcon className="w-4 h-4" />
                Multiple Languages
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <DocumentTextIcon className="w-4 h-4" />
                Detailed Comments
              </motion.span>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Enhanced Language Selector */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Choose Language
                </h3>
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  {codeExamples.length} Examples
                </motion.span>
              </div>
              
              <div className="space-y-3">
                {codeExamples.map((example, index) => (
                  <motion.button
                    key={`${example.language}-${index}`}
                    onClick={() => setSelectedExample(index)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left group relative overflow-hidden ${
                      selectedExample === index
                        ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 shadow-lg shadow-emerald-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    {/* Animated background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 transition-opacity duration-300 ${
                      selectedExample === index ? 'opacity-100' : 'group-hover:opacity-100'
                    }`} />
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                            {example.language}
                          </h4>
                          {selectedExample === index && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-emerald-500 rounded-full"
                            />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {example.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {example.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: selectedExample === index ? 1 : 0, x: selectedExample === index ? 0 : -10 }}
                          className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Active
                        </motion.div>
                        <motion.div
                          whileHover={{ rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRightIcon className={`w-5 h-5 transition-colors duration-300 ${
                            selectedExample === index 
                              ? 'text-emerald-500' 
                              : 'text-gray-400 group-hover:text-emerald-500'
                          }`} />
                        </motion.div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-4 pt-4"
              >
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {codeExamples.length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Languages
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    Production
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Ready
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Code Display */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Enhanced Code Container with Gradient Border */}
              <div className="relative bg-gray-900 rounded-2xl p-6 overflow-hidden border border-gray-700/50 shadow-2xl">
                {/* Animated Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Enhanced Header with Better Visual Hierarchy */}
                <div className="relative flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs text-gray-400 font-mono">
                        {codeExamples[selectedExample].language}
                      </span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span className="text-xs text-gray-400">
                        {codeExamples[selectedExample].title}
                      </span>
                    </div>
                  </div>
                  
                  {/* Enhanced Copy Button with Better Feedback */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(codeExamples[selectedExample].code)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm text-gray-300 text-sm rounded-lg hover:bg-gray-700/80 transition-all duration-200 border border-gray-600/50 hover:border-gray-500/50 shadow-sm"
                  >
                    {copied ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </motion.button>
                </div>
                
                {/* Enhanced Code Display with Fixed Height and Y Scrolling */}
                <div className="relative">
                  <div className="h-[38.5rem] overflow-y-auto overflow-x-auto">
                    <pre className="text-gray-300 text-sm font-mono leading-relaxed">
                      <code className="block p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        {codeExamples[selectedExample].code}
                      </code>
                    </pre>
                  </div>
                  
                  {/* Enhanced Scroll Indicator */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-gray-800/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRightIcon className="w-3 h-3 text-gray-400 rotate-45" />
                  </div>
                </div>
              </div>
              
              {/* Enhanced Description with Better Typography */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700/50"
              >
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {codeExamples[selectedExample].title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {codeExamples[selectedExample].description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Endpoints Section */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-6 border border-indigo-200 dark:border-indigo-700 shadow-sm"
            >
              <GlobeAltIcon className="w-5 h-5" />
              RESTful API
              <span className="ml-2 px-2 py-1 bg-indigo-200 dark:bg-indigo-800 rounded-full text-xs font-semibold">v2.1</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Complete API
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Endpoints
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive collection of RESTful endpoints designed for seamless integration. 
              From authentication to advanced analytics, every endpoint is documented with examples and 
              real-time testing capabilities.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Interactive Docs
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <ServerIcon className="w-4 h-4" />
                Rate Limited
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <LockClosedIcon className="w-4 h-4" />
                Secure Auth
              </motion.span>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {endpoints.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Category Header */}
                <div 
                  className="p-6 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  onClick={() => setSelectedCategory(selectedCategory === category.category ? null : category.category)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-md`}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <category.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {category.category}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {category.endpoints.length} endpoints
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: selectedCategory === category.category ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </div>
                </div>

                {/* Endpoints List */}
                <motion.div 
                  className="overflow-hidden"
                  initial={false}
                  animate={{ 
                    height: selectedCategory === category.category ? 'auto' : 0,
                    opacity: selectedCategory === category.category ? 1 : 0
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <div className="p-6 space-y-6">
                    {category.endpoints.map((endpoint, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <motion.span 
                            whileHover={{ scale: 1.05 }}
                            className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                              endpoint.method === 'GET' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                              endpoint.method === 'POST' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                              endpoint.method === 'PUT' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            }`}
                          >
                            {endpoint.method}
                          </motion.span>
                          <code className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded border border-gray-200 dark:border-gray-600">
                            {endpoint.path}
                          </code>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                          {endpoint.description}
                        </p>

                        {/* Parameters */}
                        {endpoint.parameters && endpoint.parameters.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-4"
                          >
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <DocumentTextIcon className="w-4 h-4" />
                              Parameters
                            </h4>
                            <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                              {endpoint.parameters.map((param, paramIdx) => (
                                <motion.div 
                                  key={paramIdx} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: paramIdx * 0.05 }}
                                  className="flex items-center gap-4 text-sm hover:bg-white dark:hover:bg-gray-600/50 p-2 rounded transition-colors duration-150"
                                >
                                  <code className="font-mono text-blue-600 dark:text-blue-400 min-w-20 font-semibold">
                                    {param.name}
                                  </code>
                                  <span className="text-gray-500 dark:text-gray-400 min-w-16 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                                    {param.type}
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    param.required 
                                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {param.required ? 'Required' : 'Optional'}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-300 flex-1">
                                    {param.description}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Responses */}
                        {endpoint.responses && endpoint.responses.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <CheckCircleIcon className="w-4 h-4" />
                              Responses
                            </h4>
                            <div className="space-y-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                              {endpoint.responses.map((response, respIdx) => (
                                <motion.div 
                                  key={respIdx} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: respIdx * 0.05 }}
                                  className="flex items-start gap-4 text-sm hover:bg-white dark:hover:bg-gray-600/50 p-2 rounded transition-colors duration-150"
                                >
                                  <span className={`px-3 py-1 rounded text-xs font-medium min-w-16 shadow-sm ${
                                    response.code >= 200 && response.code < 300 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                  }`}>
                                    {response.code}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-300 flex-1">
                                    {response.description}
                                  </span>
                                  {response.example && (
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => copyToClipboard(response.example)}
                                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded transition-all duration-200"
                                    >
                                      View Example
                                    </motion.button>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 px-4 sm:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/8 rounded-full blur-2xl"
            animate={{
              scale: [0.8, 1.3, 0.8],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-8 border border-white/20 shadow-lg"
            >
              <CodeBracketIcon className="w-5 h-5" />
              Developer Ready
              <span className="ml-2 px-2 py-1 bg-white/10 rounded-full text-xs font-semibold">v2.1</span>
            </motion.div>

            {/* Enhanced Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Ready to
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Vote?
              </span>
            </motion.h2>

            {/* Enhanced Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Start building with the Votely API today. Get your API key and explore our interactive playground with real-time testing capabilities.
            </motion.p>

            {/* Enhanced Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-8 mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-gray-300 text-sm">Uptime SLA</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-gray-300 text-sm">Support</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-gray-300 text-sm">SDKs</div>
              </motion.div>
            </motion.div>

            {/* Enhanced Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <KeyIcon className="w-6 h-6" />
                <span className="text-lg">Get API Key</span>
                <ArrowRightIcon className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center gap-4 px-10 py-5 bg-transparent text-white font-bold rounded-2xl border-3 border-white/30 hover:border-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <PlayIcon className="w-6 h-6" />
                <span className="text-lg">Try Playground</span>
                <ArrowRightIcon className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </motion.button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 flex flex-wrap justify-center gap-6"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm font-medium"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Free Tier Available
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm font-medium"
              >
                <DocumentTextIcon className="w-4 h-4" />
                Comprehensive Docs
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm font-medium"
              >
                <GlobeAltIcon className="w-4 h-4" />
                Global CDN
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 