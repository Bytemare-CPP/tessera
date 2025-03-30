/*   
    This file contains the logic for the posts routes
*/

import { RequestHandler } from 'express';
import { createClient } from '@supabase/supabase-js';
import Joi from 'joi';

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

// Schema for creating a post
export const createPostSchema = Joi.object({
    user_id: Joi.string().uuid().required(),
    text: Joi.string().min(1).max(500).required(),
});

// Schema for updating a post
export const updatePostSchema = Joi.object({
    id: Joi.string().required(),
    text: Joi.string().min(1).max(500).required(),
});

// Schema for deleting a post
export const deletePostSchema = Joi.object({
    id: Joi.string().required(),
    user_id: Joi.string().uuid().required(),
});

// Schema for getting posts
export const getPostsSchema = Joi.object({
    user_id: Joi.string().uuid().required(),
});

export const createPost: RequestHandler = async (req, res) => {
    try {
        // Define the validation schema
        const schema = Joi.object({
            user_id: Joi.string().uuid().required(),
            text: Joi.string().min(1).max(500).required(),
        });

        // Validate the request body
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { user_id, text } = req.body;

        // Insert the post into the database
        const { data, error: dbError } = await supabase
            .from('posts')
            .insert([{ user_id, text }])
            .select();

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(201).json({ message: 'Post created successfully', post: data });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updatePost: RequestHandler = async (req, res) => {
    try {
        // Define the validation schema
        const schema = Joi.object({
            id: Joi.string().required(),
            text: Joi.string().min(1).max(500).required(),
        });

        // Validate the request body
        const { error } = schema.validate({ ...req.body, id: req.params.id });
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { id } = req.params;
        const { text } = req.body;

        // Update the post in the database
        const { error: dbError } = await supabase
            .from('posts')
            .update({ text })
            .eq('id', id);

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const deletePost: RequestHandler = async (req, res) => {
    try {
        // Define the validation schema
        const schema = Joi.object({
            id: Joi.string().required(),
            user_id: Joi.string().uuid().required(),
        });

        // Validate the request body and params
        const { error } = schema.validate({ ...req.body, id: req.params.id });
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { id } = req.params;
        const { user_id } = req.body;

        // Delete the post from the database
        const { error: dbError } = await supabase
            .from('posts')
            .delete()
            .match({ id, user_id });

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getPost: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params; // Extract `id` from the URL path

        if (!id) {
            res.status(400).json({ error: 'id is required' });
            return;
        }

        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            res.status(404).json({ error: error?.message || 'Post not found' });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getPosts: RequestHandler = async (req, res) => {
    try {
        // Define the validation schema
        const schema = Joi.object({
            user_id: Joi.string().uuid().required(),
        });

        // Validate the query parameters
        const { error } = schema.validate(req.query);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { user_id } = req.query;

        // Fetch posts for the user
        const { data, error: dbError } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', user_id);

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};