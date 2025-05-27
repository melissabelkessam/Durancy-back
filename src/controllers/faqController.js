// src/controllers/faqController.js
const Faq = require('../models/Faq');

class FaqController {
  // vvoir toutes les questions
  async getAll(req, res) {
    try {
      const faqs = await Faq.findAll({ order: [['createdAt', 'DESC']] });
      res.status(200).json(faqs);
    } catch (error) {
      res.status(500).json({ error: "Erreur récupération FAQ : " + error.message });
    }
  }

  //creer une nouvelle question + réponse par l'admin no more 
  async create(req, res) {
    try {
      const { question, answer } = req.body;
      const user_id = req.user.id;

      if (!question) return res.status(400).json({ error: "La question est obligatoire." });

      const faq = await Faq.create({ question, answer, user_id });
      res.status(201).json({ message: "FAQ créée", faq });
    } catch (error) {
      res.status(500).json({ error: "Erreur création FAQ : " + error.message });
    }
  }

  // modifier la réponse dune FAQ
  async update(req, res) {
    try {
      const { id } = req.params;
      const { answer } = req.body;

      const faq = await Faq.findByPk(id);
      if (!faq) return res.status(404).json({ error: "FAQ introuvable." });

      faq.answer = answer;
      await faq.save();

      res.status(200).json({ message: "Réponse mise à jour", faq });
    } catch (error) {
      res.status(500).json({ error: "Erreur mise à jour FAQ : " + error.message });
    }
  }

  //supprimer une question
  async delete(req, res) {
    try {
      const { id } = req.params;

      const faq = await Faq.findByPk(id);
      if (!faq) return res.status(404).json({ error: "FAQ introuvable." });

      await faq.destroy();
      res.status(200).json({ message: "FAQ supprimée." });
    } catch (error) {
      res.status(500).json({ error: "Erreur suppression FAQ : " + error.message });
    }
  }
}

module.exports = new FaqController();
