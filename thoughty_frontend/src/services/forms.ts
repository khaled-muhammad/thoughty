import api from './api';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: 'support' | 'sales' | 'feedback' | 'other';
  message: string;
}

export interface NewsletterData {
  email: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export const formsService = {
  // Contact form submission
  submitContactForm: async (formData: ContactFormData): Promise<ApiResponse> => {
    try {
      const response = await api.post('/forms/contact/', formData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Newsletter subscription
  subscribeToNewsletter: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/forms/newsletter/subscribe/', { email });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Newsletter unsubscription
  unsubscribeFromNewsletter: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/forms/newsletter/unsubscribe/', { email });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
}; 