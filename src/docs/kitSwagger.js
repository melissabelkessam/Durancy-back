/**
 * @swagger
 * tags:
 *   name: Kits
 *   description: Gestion des kits
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Kit:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         category:
 *           type: string
 *         image:
 *           type: string
 *           format: binary
 */

/**
 * @swagger
 * /kits:
 *   post:
 *     summary: Créer un nouveau kit
 *     tags: [Kits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kit de réparation souris
 *               description:
 *                 type: string
 *                 example: Pour écran cassé
 *               price:
 *                 type: number
 *                 example: 49.99
 *               stock:
 *                 type: integer
 *                 example: 4
 *               category:
 *                 type: string
 *                 example: smartphone
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image du kit à uploader
 *     responses:
 *       201:
 *         description: Kit créé avec succès
 *       400:
 *         description: Données manquantes
 *       500:
 *         description: Erreur serveur

 *   get:
 *     summary: Récupérer tous les kits
 *     tags: [Kits]
 *     responses:
 *       200:
 *         description: Liste des kits
 *       500:
 *         description: Erreur serveur

 * /kits/{id}:
 *   get:
 *     summary: Récupérer un kit par ID
 *     tags: [Kits]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du kit
 *     responses:
 *       200:
 *         description: Kit trouvé
 *       404:
 *         description: Kit non trouvé
 *       500:
 *         description: Erreur serveur

 *   put:
 *     summary: Mettre à jour un kit
 *     tags: [Kits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du kit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kit mis à jour
 *       404:
 *         description: Kit non trouvé
 *       500:
 *         description: Erreur serveur

 *   delete:
 *     summary: Supprimer un kit
 *     tags: [Kits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du kit
 *     responses:
 *       200:
 *         description: Kit supprimé
 *       404:
 *         description: Kit non trouvé
 *       500:
 *         description: Erreur serveur
 */
