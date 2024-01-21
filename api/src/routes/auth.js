const express = require('express');
const Auth = require('../models/auth.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');
require ('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const {username , email ,password, role} = req.body;
        const user = await Auth.findOne({email})

        if(user) {
            return res.status(409).json({message: 'User already exists'});
        }

        if(password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = await Auth.create({username, email,password: passwordHash});

        const userToken = jwt.sign({id: newUser.id, role: newUser.role}, process.env.SECRET_TOKEN, {expiresIn: '1h'});

        res.status(201).json({
            status: "OK",
            newUser,
            userToken
        })

        } catch (error) { 
            return res.status(500).json({message: error.message});
    }
})

router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await Auth.findOne({username});
        if(!user) {
            return res.status(401).json({message: 'User does not exist'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({message: 'Incorrect password'});
        }

        const userToken = jwt.sign({id: user.id, role: user.role}, process.env.SECRET_TOKEN, {expiresIn: '1h'});
        
        res.status(200).json({
            status: "OK",
            user,
            userToken
        
        })
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
})

const limit = 15;

router.get('/users', auth, async (req, res) => {
    try {

        const users = await Auth.find().limit(limit);
        res.header('Access-Control-Expose-Headers', 'X-Total-Count', 'Content-Range');
        res.header('X-Total-Count', users.length);
        res.set('Content-Range', `users 0-${limit-1}/${users.length}`);
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await Auth.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/users/:id', async (req, res) => {
    try {
     
        if (req.body.password) {
          const newPasswordHash = await bcrypt.hash(req.body.password, 12);
          req.body.password = newPasswordHash;
        }
    
        const updatedUser = await Auth.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
        res.json(updatedUser);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

router.delete('/users/:id', auth, async(req, res) => {
    try {
        /*if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }*/

        const deletedUser = await Auth.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(req.userRole)
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/users', async (req, res) => {
    try {
        const {username , email ,password} = req.body;
        const user = await Auth.findOne({email})

        if(user) {
            return res.status(409).json({message: 'User already exists'});
        }

        if(password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = await Auth.create({username, email,password: passwordHash});

        const userToken = jwt.sign({id: newUser.id}, process.env.SECRET_TOKEN, {expiresIn: '1h'});

        res.status(201).json({
            status: "OK",
            newUser,
            userToken
        })

        } catch (error) { 
            return res.status(500).json({message: error.message});
    }
})


module.exports = router;