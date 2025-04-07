// controllers/genericController.js
module.exports = (service, validate) => ({
    create: async (req, res) => {
        try {
            const { error } = validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const data = await service.create(req.body);
            res.status(201).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Create failed' });
        }
    },

    getAll: async (req, res) => {
        try {
            const data = await service.findAll();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Fetch failed' });
        }
    },

    getById: async (req, res) => {
        try {
            const data = await service.findById(req.params.id);
            if (!data) return res.status(404).json({ error: 'Not found' });
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Fetch failed' });
        }
    },

    update: async (req, res) => {
        try {
            const { error } = validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const data = await service.update(req.params.id, req.body);
            if (!data) return res.status(404).json({ error: 'Not found' });
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Update failed' });
        }
    },

    remove: async (req, res) => {
        try {
            const data = await service.remove(req.params.id);
            if (!data) return res.status(404).json({ error: 'Not found' });
            res.json({ message: 'Deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Delete failed' });
        }
    },
});
