import { InvitationData, GeneratedLink } from './types';

export const generateInvitations = async (invitationData: InvitationData): Promise<GeneratedLink[]> => {
  try {
    const response = await fetch('/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invitationData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate invitations');
    }

    const data = await response.json();
    return data.links;
  } catch (error) {
    console.error('Error generating invitations:', error);
    throw error;
  }
};