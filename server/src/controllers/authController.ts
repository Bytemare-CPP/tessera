// /*
//     Logic for user authentication (sign up, login, logout).
// */

// import type { RequestHandler } from 'express';
// import { createUserWithEmailAndPassword,
//             signInWithEmailAndPassword,
//             signOut } from 'firebase/auth';
// import { auth } from '../services/firebase';

// export const signup: RequestHandler = async (req, res) => {
//     try{ 
//         const { email, password, name } = req.body;

//         // Create user in Firebase Auth
//         const userCred = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCred.user;
        
//         // We can store additional user data in Firestore here if needed

//         // Respond with user data
//         res.status(200).json({
//             uid: user.uid,
//             email: user.email,  
//             name: name || ''
//         });
//     } catch (error) {
//         res.status(400).json({ error: (error as Error).message });
//     }
// };


// export const login: RequestHandler = async (req, res) => {
//     try{
//         const { email, password } = req.body;

//         // Sign in with email & password
//         const userCred = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCred.user;

//         // Here we can create a custom token or just return user data
//         res.status(200).json({
//             uid: user.uid,
//             email: user.email
//         });
//     } catch (error) {
//         res.status(401).json({ error: (error as Error).message });
//     }
// };

// export const logout: RequestHandler =  async (req, res) => {
//     try {
//         // Firebase client logout
//         await signOut(auth);
//         res.status(200).json({ message: 'User logged out successfully' });
//     } catch (error) {
//         res.status(500).json({ error: (error as Error).message });
//     }
// };