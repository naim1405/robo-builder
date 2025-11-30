import { Router, type Request, type Response } from 'express';

const router = Router();

// Sample data for now
const sampleRobots = [
  {
    id: '1',
    name: 'Guardian-X',
    head: 'sensor_head',
    body: 'armored_body',
    arms: 'hydraulic_arms',
    legs: 'tracked_legs',
    power: 'fusion_core',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Stealth-Runner',
    head: 'dome_head',
    body: 'stealth_body',
    arms: 'precision_arms',
    legs: 'bipedal_legs',
    power: 'arc_reactor',
    createdAt: new Date().toISOString()
  }
];

/**
 * POST /api/robot
 * Build a custom robot
 */
router.post('/robot', (req: Request, res: Response) => {
  const { name, head, body, arms, legs, power } = req.body;

  // Validate required fields
  if (!name || !head || !body || !arms || !legs || !power) {
    return res.status(400).json({
      success: false,
      error: 'All robot parts are required: name, head, body, arms, legs, power'
    });
  }

  // Create sample robot response
  const newRobot = {
    id: `${Date.now()}`,
    name,
    head,
    body,
    arms,
    legs,
    power,
    createdAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    message: 'Robot built successfully',
    robot: newRobot
  });
});

/**
 * GET /api/robot/:id
 * Get a robot by ID
 */
router.get('/robot/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  // Find sample robot
  const robot = sampleRobots.find(r => r.id === id);

  if (!robot) {
    return res.status(404).json({
      success: false,
      error: 'Robot not found'
    });
  }

  res.json({
    success: true,
    robot
  });
});

/**
 * GET /api/robots
 * Get all robots (for gallery)
 */
router.get('/robots', (req: Request, res: Response) => {
  res.json({
    success: true,
    robots: sampleRobots,
    count: sampleRobots.length
  });
});

/**
 * DELETE /api/robot/:id
 * Delete a robot
 */
router.delete('/robot/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if robot exists
  const robotIndex = sampleRobots.findIndex(r => r.id === id);

  if (robotIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Robot not found'
    });
  }

  res.json({
    success: true,
    message: 'Robot deleted successfully',
    id
  });
});

export default router;
