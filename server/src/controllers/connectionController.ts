/*
    This file contains the logic for managing connections between users.
*/

import { RequestHandler } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');

export const createConnection: RequestHandler = async (req, res) => {
    try {
        const { user_1, user_2 } = req.body;

        if (!user_1 || !user_2) {
            res.status(400).json({ error: 'user_1 and user_2 are required' });
            return;
        }

        const { data, error } = await supabase
            .from('connections')
            .insert([{ user_1, user_2, status: 'pending' }])
            .select();

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(201).json({ message: 'Connection created successfully', connection: data });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const deleteConnection: RequestHandler = async (req, res) => {
    try {
        const { user_1, user_2 } = req.body;

        if (!user_1 || !user_2) {
            res.status(400).json({ error: 'user_1 and user_2 are required' });
            return;
        }

        const { error } = await supabase
            .from('connections')
            .delete()
            .or(`user_1.eq.${user_1},user_2.eq.${user_2}`);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: 'Connection deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updateConnection: RequestHandler = async (req, res) => {
    try {
        const { user_1, user_2, status } = req.body;

        if (!user_1 || !user_2 || !status) {
            res.status(400).json({ error: 'user_1, user_2, and status are required' });
            return;
        }

        const { error } = await supabase
            .from('connections')
            .update({ status })
            .or(`user_1.eq.${user_1},user_2.eq.${user_2}`);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: 'Connection updated successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getConnection: RequestHandler = async (req, res) => {
    try {
        const { user_1, user_2 } = req.query;

        if (!user_1 || !user_2) {
            res.status(400).json({ error: 'user_1 and user_2 are required' });
            return;
        }

        const { data, error } = await supabase
            .from('connections')
            .select('*')
            .or(`(user_1.eq.${user_1},user_2.eq.${user_2})`)
            .single();

        if (error || !data) {
            res.status(404).json({ error: error?.message || 'Connection not found' });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getConnections: RequestHandler = async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            res.status(400).json({ error: 'user_id is required' });
            return;
        }

        const { data, error } = await supabase
            .from('connections')
            .select('*')
            .or(`user_1.eq.${user_id},user_2.eq.${user_id}`);

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
