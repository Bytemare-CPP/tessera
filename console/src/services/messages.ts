import supabaseClient from './supabaseClient';
import { useEffect } from 'react';

// Fetch messages between two users
export const fetchMessages = async (sender_id: string, receiver_id: string) => {
  const { data, error } = await supabaseClient
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

// Send a new message
export const sendMessage = async (sender_id: string, receiver_id: string, content: string) => {
  const { data, error } = await supabaseClient
    .from('messages')
    .insert([{ sender_id, receiver_id, content }]);

  if (error) throw error;
  return data;
};

// Realtime listener for new messages
export const useRealtimeMessages = (onNewMessage: (message: any) => void) => {
  useEffect(() => {
    const channel = supabaseClient
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('Received Realtime Payload:', payload);  // super important
          onNewMessage(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [onNewMessage]);
};
