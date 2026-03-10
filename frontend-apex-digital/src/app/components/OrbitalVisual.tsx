import { useEffect, useRef } from 'react';

interface OrbitalVisualProps {
  variant?: 'hero' | 'services' | 'projects' | 'about' | 'contact' | 'careers';
  className?: string;
}

export function OrbitalVisual({ variant = 'hero', className = '' }: OrbitalVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;

    // Particle class for three-body problem simulation
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      mass: number;
      radius: number;
      color: string;

      constructor(x: number, y: number, vx: number, vy: number, mass: number, radius: number, color: string) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
      }

      update(particles: Particle[], gravity: number) {
        particles.forEach((other) => {
          if (other === this) return;

          const dx = other.x - this.x;
          const dy = other.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 0) {
            const force = (gravity * this.mass * other.mass) / (dist * dist);
            const fx = (force * dx) / dist;
            const fy = (force * dy) / dist;

            this.vx += fx / this.mass;
            this.vy += fy / this.mass;
          }
        });

        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.offsetWidth) this.vx *= -0.8;
        if (this.y < 0 || this.y > canvas.offsetHeight) this.vy *= -0.8;

        this.x = Math.max(0, Math.min(canvas.offsetWidth, this.x));
        this.y = Math.max(0, Math.min(canvas.offsetHeight, this.y));
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Orbital particle for circular orbits
    class OrbitalParticle {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      color: string;
      centerX: number;
      centerY: number;

      constructor(radius: number, speed: number, size: number, color: string, startAngle: number = 0) {
        this.angle = startAngle;
        this.radius = radius;
        this.speed = speed;
        this.size = size;
        this.color = color;
        this.centerX = centerX;
        this.centerY = centerY;
      }

      update() {
        this.angle += this.speed;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const x = this.centerX + Math.cos(this.angle) * this.radius;
        const y = this.centerY + Math.sin(this.angle) * this.radius;

        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw orbit path
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color.replace('1)', '0.1)');
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    let particles: (Particle | OrbitalParticle)[] = [];

    // Different configurations for each variant
    if (variant === 'hero') {
      // Simple orbital system (original)
      particles = [
        new OrbitalParticle(80, 0.01, 4, 'rgba(25, 115, 174, 1)', 0),
        new OrbitalParticle(140, 0.008, 5, 'rgba(57, 210, 237, 1)', Math.PI / 3),
        new OrbitalParticle(200, 0.006, 3, 'rgba(25, 115, 174, 0.8)', Math.PI),
      ];
    } else if (variant === 'services') {
      // Multiple orbital rings with more particles
      particles = [
        new OrbitalParticle(60, 0.015, 3, 'rgba(25, 115, 174, 1)', 0),
        new OrbitalParticle(60, 0.015, 3, 'rgba(57, 210, 237, 1)', Math.PI),
        new OrbitalParticle(100, 0.01, 4, 'rgba(25, 115, 174, 0.8)', 0),
        new OrbitalParticle(100, 0.01, 4, 'rgba(57, 210, 237, 0.8)', Math.PI / 2),
        new OrbitalParticle(100, 0.01, 4, 'rgba(25, 115, 174, 0.6)', Math.PI),
        new OrbitalParticle(140, 0.008, 5, 'rgba(57, 210, 237, 1)', Math.PI / 4),
        new OrbitalParticle(140, 0.008, 5, 'rgba(25, 115, 174, 0.7)', 3 * Math.PI / 4),
        new OrbitalParticle(180, 0.006, 3, 'rgba(57, 210, 237, 0.6)', 0),
        new OrbitalParticle(180, 0.006, 3, 'rgba(25, 115, 174, 0.5)', 2 * Math.PI / 3),
      ];
    } else if (variant === 'projects') {
      // Three-body problem simulation
      particles = [
        new Particle(centerX - 100, centerY - 50, 0.5, 0.8, 50, 6, 'rgba(25, 115, 174, 1)'),
        new Particle(centerX + 100, centerY - 50, -0.3, 1.0, 50, 6, 'rgba(57, 210, 237, 1)'),
        new Particle(centerX, centerY + 100, 0.1, -0.9, 50, 6, 'rgba(25, 115, 174, 0.7)'),
        new Particle(centerX - 150, centerY, 0.7, -0.5, 30, 4, 'rgba(57, 210, 237, 0.6)'),
        new Particle(centerX + 150, centerY, -0.6, 0.6, 30, 4, 'rgba(25, 115, 174, 0.5)'),
      ];
    } else if (variant === 'about') {
      // Gravity-influenced orbits
      particles = [
        new Particle(centerX - 120, centerY, 0, 1.5, 80, 7, 'rgba(25, 115, 174, 1)'),
        new Particle(centerX + 120, centerY, 0, -1.5, 80, 7, 'rgba(57, 210, 237, 1)'),
        new Particle(centerX, centerY - 120, 1.5, 0, 60, 5, 'rgba(25, 115, 174, 0.7)'),
        new Particle(centerX, centerY + 120, -1.5, 0, 60, 5, 'rgba(57, 210, 237, 0.7)'),
        new Particle(centerX - 80, centerY - 80, 1.0, 1.0, 40, 4, 'rgba(25, 115, 174, 0.5)'),
        new Particle(centerX + 80, centerY + 80, -1.0, -1.0, 40, 4, 'rgba(57, 210, 237, 0.5)'),
      ];
    } else if (variant === 'contact') {
      // Pulsating orbits with varying sizes
      particles = [
        new OrbitalParticle(70, 0.02, 5, 'rgba(25, 115, 174, 1)', 0),
        new OrbitalParticle(70, 0.02, 5, 'rgba(57, 210, 237, 1)', Math.PI / 2),
        new OrbitalParticle(70, 0.02, 5, 'rgba(25, 115, 174, 0.8)', Math.PI),
        new OrbitalParticle(70, 0.02, 5, 'rgba(57, 210, 237, 0.8)', 3 * Math.PI / 2),
        new OrbitalParticle(120, -0.015, 4, 'rgba(25, 115, 174, 1)', 0),
        new OrbitalParticle(120, -0.015, 4, 'rgba(57, 210, 237, 1)', Math.PI / 3),
        new OrbitalParticle(120, -0.015, 4, 'rgba(25, 115, 174, 0.7)', 2 * Math.PI / 3),
        new OrbitalParticle(120, -0.015, 4, 'rgba(57, 210, 237, 0.7)', Math.PI),
        new OrbitalParticle(170, 0.01, 3, 'rgba(25, 115, 174, 0.6)', Math.PI / 6),
        new OrbitalParticle(170, 0.01, 3, 'rgba(57, 210, 237, 0.6)', Math.PI / 2),
      ];
    } else if (variant === 'careers') {
      // Simple orbital system with more particles
      particles = [
        new OrbitalParticle(80, 0.01, 4, 'rgba(25, 115, 174, 1)', 0),
        new OrbitalParticle(140, 0.008, 5, 'rgba(57, 210, 237, 1)', Math.PI / 3),
        new OrbitalParticle(200, 0.006, 3, 'rgba(25, 115, 174, 0.8)', Math.PI),
        new OrbitalParticle(260, 0.004, 4, 'rgba(57, 210, 237, 0.8)', Math.PI / 6),
        new OrbitalParticle(320, 0.002, 5, 'rgba(25, 115, 174, 0.6)', Math.PI / 2),
      ];
    }

    let animationId: number;
    let time = 0;

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((particle) => {
        if (particle instanceof Particle) {
          particle.update(particles as Particle[], 0.5);
        } else {
          particle.update();
          
          // Pulsating effect for contact variant
          if (variant === 'contact') {
            const pulse = Math.sin(time * 0.05) * 0.3 + 1;
            particle.size = particle.size * pulse;
          }
        }
        particle.draw(ctx);
      });

      // Draw connections between particles for three-body problem
      if (variant === 'projects' || variant === 'about') {
        particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach((p2) => {
            if (p1 instanceof Particle && p2 instanceof Particle) {
              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 200) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(25, 115, 174, ${0.1 * (1 - dist / 200)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
          });
        });
      }

      time++;
      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationId);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}