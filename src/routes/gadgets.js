import express from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const prisma = new PrismaClient();

const generateCodename = () => {
  const prefixes = ['The', 'Project', 'Operation'];
  const nouns = ['Nightingale', 'Kraken', 'Phoenix', 'Shadow', 'Specter'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
};

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    
    const gadgets = await prisma.gadget.findMany({ where });
    const gadgetsWithProbability = gadgets.map(gadget => ({
      ...gadget,
      missionSuccessProbability: Math.floor(Math.random() * 41) + 60
    }));
    
    res.json(gadgetsWithProbability);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const gadget = await prisma.gadget.create({
      data: {
        name,
        codename: generateCodename(),
        status: 'Available'
      }
    });
    res.json(gadget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    
    const gadget = await prisma.gadget.update({
      where: { id },
      data: { name, status }
    });
    
    res.json(gadget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const gadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: 'Decommissioned',
        decommissionedAt: new Date()
      }
    });
    res.json(gadget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/self-destruct', async (req, res) => {
  try {
    const { id } = req.params;
    const confirmationCode = uuidv4().slice(0, 6);
    
    const gadget = await prisma.gadget.update({
      where: { id },
      data: { status: 'Destroyed' }
    });
    
    res.json({
      message: 'Self-destruct sequence initiated',
      confirmationCode,
      gadget
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;