const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new ApiError(response.status, error.error || 'An error occurred');
  }
  return response.json();
}

function getAuthHeaders(token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// Auth APIs
export const authApi = {
  signup: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },
};

// Profile APIs
export const profileApi = {
  get: async (token: string) => {
    const response = await fetch(`${API_URL}/api/profile`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse(response);
  },

  save: async (token: string, data: any) => {
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// Budget APIs
export const budgetApi = {
  get: async (token: string, year: number, month: string) => {
    const response = await fetch(`${API_URL}/api/budget/${year}/${month}`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse(response);
  },

  save: async (token: string, data: any) => {
    const response = await fetch(`${API_URL}/api/budget`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateCategory: async (token: string, categoryId: string, actual: number) => {
    const response = await fetch(`${API_URL}/api/budget/category/${categoryId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ actual }),
    });
    return handleResponse(response);
  },
};

// Savings APIs
export const savingsApi = {
  getAll: async (token: string) => {
    const response = await fetch(`${API_URL}/api/savings`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse(response);
  },

  generate: async (token: string, data: any) => {
    const response = await fetch(`${API_URL}/api/savings/generate`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  toggle: async (token: string, strategyId: string) => {
    const response = await fetch(`${API_URL}/api/savings/${strategyId}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
    });
    return handleResponse(response);
  },
};

// Scenario APIs
export const scenarioApi = {
  getAll: async (token: string) => {
    const response = await fetch(`${API_URL}/api/scenarios`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse(response);
  },

  submitAttempt: async (token: string, scenarioId: string, selectedOptionId: string) => {
    const response = await fetch(`${API_URL}/api/scenarios/attempt`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ scenarioId, selectedOptionId }),
    });
    return handleResponse(response);
  },

  getAttempts: async (token: string) => {
    const response = await fetch(`${API_URL}/api/scenarios/attempts`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse(response);
  },
};

// Learning APIs
export const learningApi = {
  getPaths: async (token: string) => {
    const response = await fetch(`${API_URL}/api/learning/paths`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse(response);
  },

  getPath: async (token: string, pathId: string) => {
    const response = await fetch(`${API_URL}/api/learning/paths/${pathId}`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse(response);
  },

  updateProgress: async (token: string, pathId: string, moduleId: string, isCompleted: boolean) => {
    const response = await fetch(`${API_URL}/api/learning/progress`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ pathId, moduleId, isCompleted }),
    });
    return handleResponse(response);
  },
};

// FRIDAY AI APIs
export const fridayApi = {
  getGuidance: async (token: string, sectionType: string, language: string) => {
    const response = await fetch(`${API_URL}/api/friday/guidance`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ sectionType, language }),
    });
    return handleResponse(response);
  },

  chat: async (token: string, message: string, conversationHistory: any[], language: string) => {
    const response = await fetch(`${API_URL}/api/friday/chat`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ message, conversationHistory, language }),
    });
    return handleResponse(response);
  },

  getStarterQuestions: async (token: string, language: string) => {
    const response = await fetch(`${API_URL}/api/friday/starter-questions?language=${language}`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse(response);
  },
};

