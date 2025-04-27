import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import supabaseAdmin from '../services/supabaseAdmin';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Interface for the request with files
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Endpoint to handle selfie uploads
router.post('/upload', upload.single('selfie'), async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.body.userId;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
      return;
    }
    
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No selfie uploaded'
      });
      return;
    }
    
    // Prepare data for the vibe matcher service
    const formData = new FormData();
    formData.append('selfie', req.file.buffer, {
      filename: 'selfie.jpg',
      contentType: req.file.mimetype
    });
    formData.append('user_id', userId);
    
    // Optional: add location data if available
    if (req.body.latitude && req.body.longitude) {
      formData.append('latitude', req.body.latitude);
      formData.append('longitude', req.body.longitude);
    }
    
    // Send to vibe matcher service
    const vibeMatcher = process.env.VIBE_MATCHER_URL || 'http://localhost:8000';
    const response = await axios.post(`${vibeMatcher}/process-selfie`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    // If a match was found, create a connection
    if (response.data.match_found) {
      const matchedUserId = response.data.matched_user_id;
      const similarityScore = response.data.similarity_score;
      
      // Check if a connection already exists
      const { data: existingConnection, error: connectionError } = await supabaseAdmin
        .from('connections')
        .select('id, status')
        .or(`and(user_1.eq.${userId},user_2.eq.${matchedUserId}),and(user_1.eq.${matchedUserId},user_2.eq.${userId})`)
        .single();
      
      if (connectionError && connectionError.code !== 'PGRST116') {
        console.error('Error checking for existing connection:', connectionError);
      }
      
      let connectionId;
      
      if (existingConnection) {
        // Connection exists, use it
        connectionId = existingConnection.id;
      } else {
        // Create a new connection
        const { data: newConnection, error: insertError } = await supabaseAdmin
          .from('connections')
          .insert({
            user_1: userId,
            user_2: matchedUserId,
            status: 'pending',
            connection_type: 'vibe_match',
            similarity_score: similarityScore
          })
          .select()
          .single();
          
        if (insertError) {
          console.error('Error creating connection:', insertError);
          throw insertError;
        }
        
        connectionId = newConnection.id;
      }
      
      // Mark the selfie candidates as matched
      await supabaseAdmin
        .from('selfie_candidates')
        .update({ status: 'matched' })
        .in('user_id', [userId, matchedUserId])
        .eq('status', 'pending');
      
      // Get user details for the matched user
      const { data: matchedUser, error: userError } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', matchedUserId)
        .single();
      
      if (userError) {
        console.error('Error fetching matched user profile:', userError);
      }
      
      // Return match result
      res.json({
        success: true,
        matchFound: true,
        connection: {
          id: connectionId,
          matchedUser: matchedUser || { id: matchedUserId },
          similarityScore: similarityScore
        }
      });
    } else {
      // No match found
      res.json({
        success: true,
        matchFound: false
      });
    }
  } catch (error) {
    console.error('Error processing selfie:', error);
    next(error);
  }
});

export default router;