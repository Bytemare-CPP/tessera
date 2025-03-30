import { Request, Response, RequestHandler } from 'express';
import { supabase } from '../services/supabase'; // Import Supabase client


/**
 * Get the user profile by user ID.
 */
export const getUserProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.query.user_id as string; // Get the user ID from query parameters

        if (!userId) {
            res.status(400).json({ error: 'Bad Request: user_id is required' });
            return;
        }

        // Query the 'profiles' table for the user's profile
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, is_active') // Select only necessary fields
            .eq('id', userId)
            .single();

        if (error || !profile) {
            res.status(404).json({ error: error?.message || 'Profile not found' });
            return;
        }

        res.status(200).json(profile); // Return the profile
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

/**
 * Update the user profile by user ID.
 */
export const updateUserProfile: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.user_id; // Get the user ID from the request body

        if (!userId) {
            res.status(400).json({ error: 'Bad Request: user_id is required' });
            return;
        }

        const updateData = req.body; // Get the update data from the request body

        // Validate the update data (optional, but recommended)
        if (!updateData || typeof updateData !== 'object') {
            res.status(400).json({ error: 'Invalid update data' });
            return;
        }

        // Remove user_id from the update data to avoid overwriting it
        delete updateData.user_id;

        // Update the user's profile in the 'profiles' table
        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};