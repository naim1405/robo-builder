// Robot Builder State
const robotState = {
    name: 'Guardian-X',
    head: null,
    body: null,
    arms: null,
    legs: null,
    power: null
};

// Part stats for calculating robot characteristics
const partStats = {
    head: {
        sensor_head: { speed: 70, power: 40, durability: 50 },
        combat_head: { speed: 50, power: 80, durability: 70 },
        dome_head: { speed: 60, power: 60, durability: 60 }
    },
    body: {
        armored_body: { speed: 40, power: 60, durability: 90 },
        stealth_body: { speed: 90, power: 50, durability: 40 },
        tank_body: { speed: 30, power: 70, durability: 100 }
    },
    arms: {
        hydraulic_arms: { speed: 50, power: 90, durability: 70 },
        precision_arms: { speed: 80, power: 60, durability: 50 },
        weapon_arms: { speed: 60, power: 100, durability: 60 }
    },
    legs: {
        tracked_legs: { speed: 60, power: 70, durability: 80 },
        bipedal_legs: { speed: 70, power: 50, durability: 60 },
        hover_unit: { speed: 100, power: 60, durability: 40 }
    },
    power: {
        fusion_core: { speed: 80, power: 100, durability: 70 },
        solar_cells: { speed: 60, power: 60, durability: 80 },
        arc_reactor: { speed: 90, power: 90, durability: 60 }
    }
};

// Part icons mapping
const partIcons = {
    head: {
        sensor_head: '👁️',
        combat_head: '😠',
        dome_head: '🔮'
    },
    body: {
        armored_body: '⚙️',
        stealth_body: '🌑',
        tank_body: '🏰'
    },
    arms: {
        hydraulic_arms: '🦾',
        precision_arms: '🤏',
        weapon_arms: '⚔️'
    },
    legs: {
        tracked_legs: '⚡',
        bipedal_legs: '🦵',
        hover_unit: '🌪️'
    },
    power: {
        fusion_core: '☢️',
        solar_cells: '☀️',
        arc_reactor: '💠'
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializePartSelection();
    initializeRobotName();
    loadRobotGallery();
    updateStats();
});

// Initialize part selection
function initializePartSelection() {
    const partOptions = document.querySelectorAll('.part-option');
    
    partOptions.forEach(option => {
        option.addEventListener('click', () => {
            const partType = option.dataset.part;
            const partValue = option.dataset.value;
            
            // Remove selection from siblings
            const siblings = option.parentElement.querySelectorAll('.part-option');
            siblings.forEach(sibling => sibling.classList.remove('selected'));
            
            // Add selection to clicked option
            option.classList.add('selected');
            
            // Update robot state
            robotState[partType] = partValue;
            
            // Update preview
            updatePreview(partType, partValue);
            
            // Update stats
            updateStats();
        });
    });
}

// Initialize robot name input
function initializeRobotName() {
    const nameInput = document.getElementById('robotName');
    nameInput.addEventListener('input', (e) => {
        robotState.name = e.target.value;
    });
}

// Update preview panel
function updatePreview(partType, partValue) {
    const previewElement = document.getElementById(`preview${capitalize(partType)}`);
    const iconElement = previewElement.querySelector('.part-icon');
    const labelElement = previewElement.querySelector('.part-label');
    
    iconElement.textContent = partIcons[partType][partValue];
    labelElement.textContent = formatPartName(partValue);
    previewElement.classList.add('selected');
}

// Update robot stats
function updateStats() {
    const stats = calculateStats();
    
    document.getElementById('statSpeed').style.width = `${stats.speed}%`;
    document.getElementById('statPower').style.width = `${stats.power}%`;
    document.getElementById('statDurability').style.width = `${stats.durability}%`;
}

// Calculate robot stats based on selected parts
function calculateStats() {
    let totalSpeed = 0;
    let totalPower = 0;
    let totalDurability = 0;
    let partCount = 0;
    
    for (const partType in robotState) {
        if (partType === 'name') continue;
        
        const partValue = robotState[partType];
        if (partValue && partStats[partType] && partStats[partType][partValue]) {
            const stats = partStats[partType][partValue];
            totalSpeed += stats.speed;
            totalPower += stats.power;
            totalDurability += stats.durability;
            partCount++;
        }
    }
    
    return {
        speed: partCount > 0 ? Math.round(totalSpeed / partCount) : 50,
        power: partCount > 0 ? Math.round(totalPower / partCount) : 50,
        durability: partCount > 0 ? Math.round(totalDurability / partCount) : 50
    };
}

// Build robot - send to API
async function buildRobot() {
    // Validate all parts are selected
    if (!robotState.name || !robotState.head || !robotState.body || 
        !robotState.arms || !robotState.legs || !robotState.power) {
        showToast('Please select all robot parts!', 'error');
        return;
    }
    
    const buildBtn = document.getElementById('buildBtn');
    buildBtn.disabled = true;
    buildBtn.innerHTML = '<span>⚙️</span> Building...';
    
    try {
        const response = await fetch('/api/robot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(robotState)
        });
        
        if (!response.ok) {
            throw new Error('Failed to build robot');
        }
        
        const data = await response.json();
        showToast(`🎉 ${data.robot.name} successfully built!`, 'success');
        
        // Reload gallery
        setTimeout(() => {
            loadRobotGallery();
        }, 500);
        
    } catch (error) {
        console.error('Error building robot:', error);
        showToast('Failed to build robot. Please try again.', 'error');
    } finally {
        buildBtn.disabled = false;
        buildBtn.innerHTML = '<span>🔨</span> Build Robot';
    }
}

// Load robot gallery
async function loadRobotGallery() {
    try {
        const response = await fetch('/api/robots');
        
        if (!response.ok) {
            throw new Error('Failed to load robots');
        }
        
        const data = await response.json();
        const gallery = document.getElementById('robotGallery');
        
        if (data.robots.length === 0) {
            gallery.innerHTML = `
                <div class="gallery-placeholder">
                    <span class="placeholder-icon">🤖</span>
                    <p>No robots built yet. Create your first robot!</p>
                </div>
            `;
            return;
        }
        
        gallery.innerHTML = data.robots.map(robot => `
            <div class="robot-card" data-id="${robot.id}">
                <h3>${robot.name}</h3>
                <div class="robot-card-parts">
                    <div>${partIcons.head[robot.head]} ${formatPartName(robot.head)}</div>
                    <div>${partIcons.body[robot.body]} ${formatPartName(robot.body)}</div>
                    <div>${partIcons.arms[robot.arms]} ${formatPartName(robot.arms)}</div>
                    <div>${partIcons.legs[robot.legs]} ${formatPartName(robot.legs)}</div>
                    <div>${partIcons.power[robot.power]} ${formatPartName(robot.power)}</div>
                </div>
                <div class="robot-card-actions">
                    <button class="btn btn-secondary" onclick="viewRobot('${robot.id}')">View</button>
                    <button class="btn btn-secondary" onclick="deleteRobot('${robot.id}')">Delete</button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

// View robot details
async function viewRobot(id) {
    try {
        const response = await fetch(`/api/robot/${id}`);
        
        if (!response.ok) {
            throw new Error('Robot not found');
        }
        
        const data = await response.json();
        const robot = data.robot;
        
        // Load robot into builder
        robotState.name = robot.name;
        robotState.head = robot.head;
        robotState.body = robot.body;
        robotState.arms = robot.arms;
        robotState.legs = robot.legs;
        robotState.power = robot.power;
        
        // Update UI
        document.getElementById('robotName').value = robot.name;
        
        // Update part selections
        document.querySelectorAll('.part-option').forEach(option => {
            option.classList.remove('selected');
            const partType = option.dataset.part;
            const partValue = option.dataset.value;
            if (robotState[partType] === partValue) {
                option.classList.add('selected');
            }
        });
        
        // Update previews
        for (const partType in robotState) {
            if (partType !== 'name' && robotState[partType]) {
                updatePreview(partType, robotState[partType]);
            }
        }
        
        updateStats();
        scrollToBuilder();
        showToast(`Loaded ${robot.name}`, 'success');
        
    } catch (error) {
        console.error('Error viewing robot:', error);
        showToast('Failed to load robot', 'error');
    }
}

// Delete robot
async function deleteRobot(id) {
    if (!confirm('Are you sure you want to delete this robot?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/robot/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete robot');
        }
        
        showToast('Robot deleted successfully', 'success');
        loadRobotGallery();
        
    } catch (error) {
        console.error('Error deleting robot:', error);
        showToast('Failed to delete robot', 'error');
    }
}

// Reset builder
function resetBuilder() {
    robotState.name = 'Guardian-X';
    robotState.head = null;
    robotState.body = null;
    robotState.arms = null;
    robotState.legs = null;
    robotState.power = null;
    
    document.getElementById('robotName').value = 'Guardian-X';
    
    document.querySelectorAll('.part-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelectorAll('.preview-part').forEach(part => {
        part.classList.remove('selected');
        part.querySelector('.part-icon').textContent = '❓';
        const partType = part.id.replace('preview', '').toLowerCase();
        part.querySelector('.part-label').textContent = capitalize(partType);
    });
    
    updateStats();
    showToast('Builder reset', 'success');
}

// Utility functions
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatPartName(partValue) {
    return partValue
        .split('_')
        .map(word => capitalize(word))
        .join(' ');
}

function scrollToBuilder() {
    document.getElementById('builder').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}
