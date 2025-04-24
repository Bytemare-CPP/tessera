/*
    This file contains the logic for managing connections between users.
*/

import { RequestHandler } from 'express';
import { createClient } from '@supabase/supabase-js';
import Joi from 'joi';

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');

// Joi Schemas
const createConnectionSchema = Joi.object({
    user_1: Joi.string().uuid().required(),
    user_2: Joi.string().uuid().required(),
});

const deleteConnectionSchema = Joi.object({
    user_1: Joi.string().uuid().required(),
    user_2: Joi.string().uuid().required(),
});

const updateConnectionSchema = Joi.object({
    user_1: Joi.string().uuid().required(),
    user_2: Joi.string().uuid().required(),
    status: Joi.string().valid('pending', 'accepted', 'rejected').required(),
});

const getConnectionSchema = Joi.object({
    user_1: Joi.string().uuid().required(),
    user_2: Joi.string().uuid().required(),
});

const getConnectionsSchema = Joi.object({
    user_id: Joi.string().uuid().required(),
});

// Controllers
export const createConnection: RequestHandler = async (req, res) => {
    try {
        const { error } = createConnectionSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { user_1, user_2 } = req.body;

        const { data, error: dbError } = await supabase
            .from('connections')
            .insert([{ user_1, user_2, status: 'pending' }])
            .select();

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(201).json({ message: 'Connection created successfully', connection: data });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const deleteConnection: RequestHandler = async (req, res) => {
    try {
        const { error } = deleteConnectionSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { user_1, user_2 } = req.body;

        const { error: dbError } = await supabase
            .from('connections')
            .delete()
            .or(`user_1.eq.${user_1},user_2.eq.${user_2}`);

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(200).json({ message: 'Connection deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updateConnection: RequestHandler = async (req, res) => {
    try {
        const { error } = updateConnectionSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { user_1, user_2, status } = req.body;

        const { error: dbError } = await supabase
            .from('connections')
            .update({ status })
            .or(`user_1.eq.${user_1},user_2.eq.${user_2}`);

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(200).json({ message: 'Connection updated successfully' });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getConnection: RequestHandler = async (req, res) => {
    try {
        const { error } = getConnectionSchema.validate(req.query);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { user_1, user_2 } = req.query;

        const { data, error: dbError } = await supabase
            .from('connections')
            .select('*')
            .or(`user_1.eq.${user_1},user_2.eq.${user_2}`)
            .single();

        if (dbError || !data) {
            res.status(404).json({ error: dbError?.message || 'Connection not found' });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getConnections: RequestHandler = async (req, res) => {
    try {
        const { error } = getConnectionsSchema.validate(req.query);
        if (error) {
            res.status(400).json({ error: `Validation Error: ${error.message}` });
            return;
        }

        const { user_id } = req.query;

        const { data, error: dbError } = await supabase
            .from('connections')
            .select('*')
            .or(`user_1.eq.${user_id},user_2.eq.${user_id}`);

        if (dbError) {
            res.status(400).json({ error: dbError.message });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
