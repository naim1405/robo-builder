import { Router, type Request, type Response } from 'express';

const router = Router();

// Sample parts catalog
const availableParts = {
  heads: [
    {
      id: 'sensor_head',
      name: 'Sensor Head',
      description: 'Advanced sensor array for enhanced detection',
      icon: '👁️',
      stats: {
        speed: 70,
        power: 40,
        durability: 50
      }
    },
    {
      id: 'combat_head',
      name: 'Combat Head',
      description: 'Reinforced head unit for battle scenarios',
      icon: '😠',
      stats: {
        speed: 50,
        power: 80,
        durability: 70
      }
    },
    {
      id: 'dome_head',
      name: 'Dome Head',
      description: 'Balanced all-purpose head unit',
      icon: '🔮',
      stats: {
        speed: 60,
        power: 60,
        durability: 60
      }
    }
  ],
  bodies: [
    {
      id: 'armored_body',
      name: 'Armored Body',
      description: 'Heavy armor plating for maximum protection',
      icon: '⚙️',
      stats: {
        speed: 40,
        power: 60,
        durability: 90
      }
    },
    {
      id: 'stealth_body',
      name: 'Stealth Body',
      description: 'Lightweight frame for stealth operations',
      icon: '🌑',
      stats: {
        speed: 90,
        power: 50,
        durability: 40
      }
    },
    {
      id: 'tank_body',
      name: 'Tank Body',
      description: 'Ultra-heavy chassis for extreme durability',
      icon: '🏰',
      stats: {
        speed: 30,
        power: 70,
        durability: 100
      }
    }
  ],
  arms: [
    {
      id: 'hydraulic_arms',
      name: 'Hydraulic Arms',
      description: 'Powerful hydraulic limbs for heavy lifting',
      icon: '🦾',
      stats: {
        speed: 50,
        power: 90,
        durability: 70
      }
    },
    {
      id: 'precision_arms',
      name: 'Precision Arms',
      description: 'High-precision manipulators for delicate tasks',
      icon: '🤏',
      stats: {
        speed: 80,
        power: 60,
        durability: 50
      }
    },
    {
      id: 'weapon_arms',
      name: 'Weapon Arms',
      description: 'Combat-ready weaponized arms',
      icon: '⚔️',
      stats: {
        speed: 60,
        power: 100,
        durability: 60
      }
    }
  ],
  legs: [
    {
      id: 'tracked_legs',
      name: 'Tracked Legs',
      description: 'All-terrain tank treads',
      icon: '⚡',
      stats: {
        speed: 60,
        power: 70,
        durability: 80
      }
    },
    {
      id: 'bipedal_legs',
      name: 'Bipedal Legs',
      description: 'Humanoid walking legs',
      icon: '🦵',
      stats: {
        speed: 70,
        power: 50,
        durability: 60
      }
    },
    {
      id: 'hover_unit',
      name: 'Hover Unit',
      description: 'Anti-gravity propulsion system',
      icon: '🌪️',
      stats: {
        speed: 100,
        power: 60,
        durability: 40
      }
    }
  ],
  powerSources: [
    {
      id: 'fusion_core',
      name: 'Fusion Core',
      description: 'Nuclear fusion reactor for maximum power',
      icon: '☢️',
      stats: {
        speed: 80,
        power: 100,
        durability: 70
      }
    },
    {
      id: 'solar_cells',
      name: 'Solar Cells',
      description: 'Renewable solar energy system',
      icon: '☀️',
      stats: {
        speed: 60,
        power: 60,
        durability: 80
      }
    },
    {
      id: 'arc_reactor',
      name: 'Arc Reactor',
      description: 'Advanced energy generation core',
      icon: '💠',
      stats: {
        speed: 90,
        power: 90,
        durability: 60
      }
    }
  ]
};

/**
 * GET /api/parts
 * Get all available robot parts
 */
router.get('/parts', (req: Request, res: Response) => {
  res.json({
    success: true,
    parts: availableParts,
    categories: ['heads', 'bodies', 'arms', 'legs', 'powerSources']
  });
});

/**
 * GET /api/parts/:category
 * Get parts by category
 */
router.get('/parts/:category', (req: Request, res: Response) => {
  const { category } = req.params;

  const validCategories = ['heads', 'bodies', 'arms', 'legs', 'powerSources'];
  
  if (!category || !validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid category. Valid categories: heads, bodies, arms, legs, powerSources'
    });
  }

  res.json({
    success: true,
    category,
    parts: availableParts[category as keyof typeof availableParts]
  });
});

export default router;
