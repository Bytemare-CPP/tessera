/*
    This file defines the endpoints related to user connections
*/

import express from 'express';
import {
    createConnection,
    deleteConnection,
    updateConnection,
    getConnection,
    getConnections,
} from '../controllers/connectionController';

const router = express.Router();

router.post('/', createConnection);
router.delete('/', deleteConnection);
router.put('/', updateConnection);
router.get('/', getConnection);
router.get('/all', getConnections);

export default router;