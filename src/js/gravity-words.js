class GravityWords {
  constructor() {
    // Debug log
    console.log('Initializing GravityWords');
    
    this.canvas = document.getElementById('gravityCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set initial canvas size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Debug background to see if canvas is rendering
    this.ctx.fillStyle = 'rgba(137, 182, 165, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.engine = Matter.Engine.create({ 
      enableSleeping: false,
      constraintIterations: 8,
      positionIterations: 12,
      velocityIterations: 8
    });
    
    // Minimal gravity
    this.engine.world.gravity.y = 0;
    this.engine.world.gravity.scale = 0.0001;
    
    // Skills with different sizes based on importance
    this.skills = [
      { text: 'leadership', size: 1.4 },
      { text: 'communication', size: 1.3 },
      { text: 'management', size: 1.1 },
      { text: 'planning', size: 0.9 },
      { text: 'sql', size: 0.8 },
      { text: 'java', size: 1.2 },
      { text: 'kotlin', size: 1.1 },
      { text: 'wordpress', size: 1.3 },
      { text: 'curriculum design', size: 1.4 },
      { text: 'data', size: 1.0 },
      { text: 'collaboration', size: 1.3 },
      { text: 'problem solving', size: 1.2 },
      { text: 'android', size: 1.1 }
    ];

    this.words = [];
    this.particles = [];
    this.draggedBody = null;
    this.dragVelocity = { x: 0, y: 0 };
    this.lastDragPosition = null;
    this.lastDragTime = null;
    
    // Get initial color from CSS variable
    this.currentColor = this.getThemeColor();
    this.setupColorObserver();
    
    this.isInHeader = true;
    this.movementInterval = null;
    this.setupScrollWatcher();
    this.startContinuousMovement();
    
    // Initialize immediately
    this.init();
  }

  init() {
    console.log('Starting initialization');
    this.createWords();
    this.setupEvents();
    
    // Start the physics engine
    Matter.Runner.run(this.engine);
    
    // Start animation loop
    this.animate();
    console.log('Initialization complete');
  }

  getThemeColor() {
    const rootStyle = getComputedStyle(document.documentElement);
    const themeColor = rootStyle.getPropertyValue('--theme-primary').trim();
    return themeColor + 'B3'; // B3 in hex is 70% opacity
  }

  setupColorObserver() {
    // Watch for style changes (color switcher updates)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target === document.head) {
          const newColor = this.getThemeColor();
          if (newColor !== this.currentColor) {
            this.currentColor = newColor;
            // Update all existing words
            this.words.forEach(word => {
              word.color = this.currentColor;
            });
          }
        }
      });
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true
    });
  }

  createWords() {
    // Create header boundaries first
    this.createHeaderBoundaries();

    // Create boundary walls with smoother properties
    const margin = 20;
    const wallOptions = {
      isStatic: true,
      restitution: 0.5,
      friction: 0.1,
      slop: 0.05,
      density: 0.1
    };

    const walls = [
      Matter.Bodies.rectangle(this.canvas.width/2, -margin, this.canvas.width + margin*2, margin*2, wallOptions),
      Matter.Bodies.rectangle(this.canvas.width/2, this.canvas.height + margin, this.canvas.width + margin*2, margin*2, wallOptions),
      Matter.Bodies.rectangle(-margin, this.canvas.height/2, margin*2, this.canvas.height + margin*2, wallOptions),
      Matter.Bodies.rectangle(this.canvas.width + margin, this.canvas.height/2, margin*2, this.canvas.height + margin*2, wallOptions)
    ];
    Matter.World.add(this.engine.world, walls);

    this.skills.forEach((skill, i) => {
      const x = Math.random() * (this.canvas.width - 200) + 100;
      const y = Math.random() * (this.canvas.height - 200) + 100;
      
      const word = Matter.Bodies.rectangle(x, y, 150, 40, {
        chamfer: { radius: 10 },
        density: 0.0005,
        frictionAir: 0.01,
        friction: 0.05,
        restitution: 0.6,
        slop: 0.05,
        label: skill.text,
        angle: 0,
        color: this.currentColor // Use theme color
      });

      // Reduced initial velocity for gentler movement
      const speed = 1;
      const angle = Math.random() * Math.PI * 2;
      Matter.Body.setVelocity(word, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      });

      Matter.World.add(this.engine.world, word);
      this.words.push(word);
    });

    // Add gentle rotation over time
    setInterval(() => {
      this.words.forEach(word => {
        if (!this.draggedBody || word !== this.draggedBody) {
          const rotationSpeed = (Math.random() - 0.5) * 0.02;
          Matter.Body.rotate(word, rotationSpeed);
          
          // Keep rotation within ±30 degrees
          const currentAngle = word.angle % (Math.PI * 2);
          const maxAngle = Math.PI / 6; // 30 degrees
          if (Math.abs(currentAngle) > maxAngle) {
            Matter.Body.setAngle(word, Math.sign(currentAngle) * maxAngle);
          }
        }
      });
    }, 1000);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.words.forEach(word => {
        this.ctx.save();
        this.ctx.translate(word.position.x, word.position.y);
        this.ctx.rotate(word.angle);
        
        // Draw text with random color, no background
        this.ctx.fillStyle = word.color;
        this.ctx.font = '16px "Fira Code"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(word.label, 0, 0);
        
        this.ctx.restore();
    });
    
    requestAnimationFrame(() => this.animate());
  }

  setupEvents() {
    const canvas = this.canvas;
    
    // Add resize handler at the start of setupEvents
    window.addEventListener('resize', () => {
      // Update canvas dimensions
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      // Update boundary positions
      this.createHeaderBoundaries();
    });
    
    canvas.addEventListener('mousedown', (e) => {
      const mousePosition = {
        x: e.offsetX,
        y: e.offsetY
      };
      
      const clickedBody = this.words.find(word => {
        const bounds = word.bounds;
        return mousePosition.x >= bounds.min.x && 
               mousePosition.x <= bounds.max.x && 
               mousePosition.y >= bounds.min.y && 
               mousePosition.y <= bounds.max.y;
      });

      if (clickedBody) {
        this.draggedBody = clickedBody;
        this.lastDragPosition = mousePosition;
        this.lastDragTime = Date.now();
        canvas.style.cursor = 'grabbing';
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      if (this.draggedBody) {
        const currentPosition = { x: e.offsetX, y: e.offsetY };
        const currentTime = Date.now();
        
        // Calculate velocity with a maximum speed limit
        if (this.lastDragPosition && this.lastDragTime) {
          const dt = Math.max((currentTime - this.lastDragTime) / 1000, 0.016); // Minimum 16ms (60fps)
          this.dragVelocity = {
            x: (currentPosition.x - this.lastDragPosition.x) / dt,
            y: (currentPosition.y - this.lastDragPosition.y) / dt
          };
          
          // Limit maximum velocity
          const maxVelocity = 15;
          const velocityMagnitude = Math.sqrt(
            this.dragVelocity.x * this.dragVelocity.x + 
            this.dragVelocity.y * this.dragVelocity.y
          );
          
          if (velocityMagnitude > maxVelocity) {
            const scale = maxVelocity / velocityMagnitude;
            this.dragVelocity.x *= scale;
            this.dragVelocity.y *= scale;
          }
        }
        
        Matter.Body.setPosition(this.draggedBody, currentPosition);
        Matter.Body.setVelocity(this.draggedBody, { x: 0, y: 0 });
        
        this.lastDragPosition = currentPosition;
        this.lastDragTime = currentTime;
      } else {
        // Hover effect
        const mousePosition = { x: e.offsetX, y: e.offsetY };
        const hoveredBody = this.words.find(word => {
          const bounds = word.bounds;
          return mousePosition.x >= bounds.min.x && 
                 mousePosition.x <= bounds.max.x && 
                 mousePosition.y >= bounds.min.y && 
                 mousePosition.y <= bounds.max.y;
        });
        canvas.style.cursor = hoveredBody ? 'grab' : 'default';
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.draggedBody && this.dragVelocity) {
        // Apply throwing velocity with dampening
        const throwDampening = 0.1; // Reduce this value to make throws gentler
        Matter.Body.setVelocity(this.draggedBody, {
          x: this.dragVelocity.x * throwDampening,
          y: this.dragVelocity.y * throwDampening
        });
      }
      this.draggedBody = null;
      this.lastDragPosition = null;
      this.lastDragTime = null;
      this.dragVelocity = { x: 0, y: 0 };
      canvas.style.cursor = 'default';
    });

    // Enhanced collision handling
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        if (this.words.includes(pair.bodyA) && this.words.includes(pair.bodyB)) {
          // Get current velocities
          const vA = pair.bodyA.velocity;
          const vB = pair.bodyB.velocity;
          
          // Calculate new velocities (reduced for gentler movement)
          const dampening = 0.8;
          const minSpeed = 0.2;
          const maxSpeed = 1.5;
          
          // Apply velocities in opposite directions
          ['bodyA', 'bodyB'].forEach(bodyKey => {
            const body = pair[bodyKey];
            const velocity = bodyKey === 'bodyA' ? vB : vA;
            
            // Calculate new velocity
            let newVx = -velocity.x * dampening;
            let newVy = -velocity.y * dampening;
            
            // Ensure minimum movement
            if (Math.abs(newVx) < minSpeed && Math.abs(newVy) < minSpeed) {
              const angle = Math.random() * Math.PI * 2;
              newVx = Math.cos(angle) * minSpeed;
              newVy = Math.sin(angle) * minSpeed;
            }
            
            // Limit maximum speed
            const speed = Math.sqrt(newVx * newVx + newVy * newVy);
            if (speed > maxSpeed) {
              const scale = maxSpeed / speed;
              newVx *= scale;
              newVy *= scale;
            }
            
            Matter.Body.setVelocity(body, {
              x: newVx,
              y: newVy
            });
          });
        }
      });
    });

    // Add scroll handler for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Throttle scroll handling
      scrollTimeout = setTimeout(() => {
        const header = document.querySelector('header');
        const headerRect = header.getBoundingClientRect();
        this.isInHeader = headerRect.bottom > 0;
        
        if (this.isInHeader) {
          this.startContinuousMovement();
        } else {
          this.stopContinuousMovement();
        }
      }, 100);
    });
  }

  createHeaderBoundaries() {
    const boundaryOptions = {
      isStatic: true,
      restitution: 0.5,
      friction: 0.05,
      slop: 0.05,
      density: 0.1
    };

    const createBoundary = (element) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const padding = 10;
        const boundaryBody = Matter.Bodies.rectangle(
          rect.x + rect.width/2,
          rect.y + rect.height/2,
          rect.width + padding * 2,
          rect.height + padding * 2,
          boundaryOptions
        );
        Matter.World.add(this.engine.world, boundaryBody);
      }
    };

    // Create boundaries for each text element
    document.querySelectorAll('.header-text, h1, .scroll-arrow').forEach(element => {
      createBoundary(element);
    });
  }

  setupScrollWatcher() {
    const header = document.querySelector('header'); // Adjust selector as needed
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          this.isInHeader = entry.isIntersecting;
          if (this.isInHeader) {
            this.startContinuousMovement();
          } else {
            this.stopContinuousMovement();
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of header is visible
    );

    if (header) {
      observer.observe(header);
    }
  }

  startContinuousMovement() {
    if (this.movementInterval) return;
    
    this.movementInterval = setInterval(() => {
      if (!this.isInHeader) return;

      this.words.forEach(word => {
        if (!this.draggedBody || word !== this.draggedBody) {
          // Add very small random force
          const forceMagnitude = 0.00003;
          const angle = Math.random() * Math.PI * 2;
          
          // Only apply force if word is moving too slowly
          const speed = Math.sqrt(
            word.velocity.x * word.velocity.x + 
            word.velocity.y * word.velocity.y
          );
          
          if (speed < 0.2) {
            Matter.Body.applyForce(word, word.position, {
              x: Math.cos(angle) * forceMagnitude,
              y: Math.sin(angle) * forceMagnitude
            });
          }

          // Maintain minimum velocity
          if (speed < 0.1) {
            const minSpeed = 0.2;
            const angle = Math.random() * Math.PI * 2;
            Matter.Body.setVelocity(word, {
              x: Math.cos(angle) * minSpeed,
              y: Math.sin(angle) * minSpeed
            });
          }
        }
      });
    }, 1000);
  }

  stopContinuousMovement() {
    if (this.movementInterval) {
      clearInterval(this.movementInterval);
      this.movementInterval = null;

      // Gradually slow down all words
      this.words.forEach(word => {
        Matter.Body.setVelocity(word, {
          x: word.velocity.x * 0.95,
          y: word.velocity.y * 0.95
        });
      });
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, creating GravityWords');
  new GravityWords();
});