const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Partner = require('../models/Partner');
const sendMail = require('../utils/mailer');
const isStrongPassword = require('../utils/passwordValidator');

class UserController {
  async register(req, res) {
    try {
      const { username, firstname, lastname, email, password, role, address, latitude, longitude } = req.body;
      const allowedRoles = ['client', 'partenaire', 'admin'];
      if (!allowedRoles.includes(role)) return res.status(400).json({ error: 'Rôle invalide.' });

      const userAgent = req.headers['user-agent'] || '';
      if (role === 'admin' && userAgent.includes('Mozilla')) return res.status(403).json({ error: 'Création de compte admin interdite via l’interface.' });

      if (!username) return res.status(400).json({ error: 'Le nom d’utilisateur est obligatoire.' });
      if (role === 'client' && (!firstname || !lastname)) return res.status(400).json({ error: 'Nom et prénom obligatoires pour les clients.' });

      if (!isStrongPassword(password)) {
        return res.status(400).json({
          error: "Le mot de passe doit contenir au minimum 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
        });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ error: 'Cet email est déjà utilisé.' });

      const hashedPassword = await bcrypt.hash(password, 10);

      let profile_pic = null;
      if (req.file) {
        profile_pic = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }

      const userData = {
        username,
        email,
        password: hashedPassword,
        role,
        firstname: role === 'client' ? firstname : null,
        lastname: role === 'client' ? lastname : null,
        profile_pic
      };

      const newUser = await User.create(userData);

      if (role === 'partenaire') {
        await Partner.create({
          name: username,
          address,
          latitude,
          longitude,
          user_id: newUser.id
        });
      }

      const { password: _, ...userWithoutPassword } = newUser.toJSON();
      res.status(201).json({ message: 'Compte créé avec succès', user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur : ' + error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis.' });

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Email invalide.' });

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return res.status(401).json({ error: 'Mot de passe incorrect.' });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

      res.status(200).json({
        message: 'Connexion réussie',
        token,
        user: { id: user.id, username: user.username, email: user.email, role: user.role }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur : ' + error.message });
    }
  }

  async delete(req, res) {
    try {
      const userIdToDelete = parseInt(req.params.id);
      const userRequesting = req.user;

      if (userRequesting.role !== 'admin' && userRequesting.id !== userIdToDelete) {
        return res.status(403).json({ error: 'Vous ne pouvez supprimer que votre propre compte.' });
      }

      const user = await User.findByPk(userIdToDelete);
      if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

      await user.destroy();
      res.status(200).json({ message: 'Compte supprimé avec succès.' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression : ' + error.message });
    }
  }

  async update(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const userConnected = req.user;
      if (userConnected.id !== userId && userConnected.role !== 'admin') {
        return res.status(403).json({ error: 'Modification interdite.' });
      }

      const { firstname, lastname, password, profile_pic } = req.body;
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

      if (user.role === 'client') {
        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
      }

      if (profile_pic) user.profile_pic = profile_pic;
      if (password) {
        if (!isStrongPassword(password)) {
          return res.status(400).json({
            error: "Le mot de passe doit contenir au minimum 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
          });
        }
        user.password = await bcrypt.hash(password, 10);
      }

      await user.save();
      res.status(200).json({ message: 'Compte mis à jour avec succès.', user });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour : ' + error.message });
    }
  }

  async getAll(req, res) {
    try {
      const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role', 'createdAt'] });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur : ' + error.message });
    }
  }

  async getMe(req, res) {
    try {
      const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
      if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur : ' + error.message });
    }
  }

  async updateMe(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });

      const { firstname, lastname, email, password, profile_pic } = req.body;

      if (user.role === 'client') {
        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (email) user.email = email;
      }

      if (profile_pic) user.profile_pic = profile_pic;
      if (password) {
        if (!isStrongPassword(password)) {
          return res.status(400).json({
            error: "Le mot de passe doit contenir au minimum 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
          });
        }
        user.password = await bcrypt.hash(password, 10);
      }

      await user.save();
      res.status(200).json({ message: 'Compte mis à jour avec succès.', user });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour : ' + error.message });
    }
  }

  async deleteMe(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      await user.destroy();
      res.status(200).json({ message: 'Votre compte a bien été supprimé.' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression : ' + error.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email requis" });

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

      // Générer mot de passe temporaire sécurisé
      let tempPassword;
      do {
        tempPassword = Math.random().toString(36).slice(-10);
      } while (!isStrongPassword(tempPassword));

      const hashed = await bcrypt.hash(tempPassword, 10);
      user.password = hashed;
      await user.save();

      await sendMail(
        email,
        "Nouveau mot de passe temporaire - Durancy",
        `Bonjour, voici votre nouveau mot de passe temporaire : ${tempPassword}`
      );

      res.status(200).json({ message: "Mot de passe temporaire envoyé par email." });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur : " + error.message });
    }
  }
}

module.exports = new UserController();
