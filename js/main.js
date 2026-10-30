/**
 * Ayush Kumar - Developer Portfolio
 * Interactive Scripts & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initParticleCanvas();
  initCustomCursor();
  initTypewriter();
  initTerminal();
  initSkillsFilter();
  initProjectsFilter();
  init3DTilt();
  initIntersectionAnimations();
  initContactForm();
  initCopyEmail();
  initLiveClock();
  initAudioFeedback();
  initNavScroll();
  initProjectModals();
  initCallModal();
});

/* ==========================================================================
   1. Constellation / Ambient Particle Canvas
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);

  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255,' : 'rgba(157, 78, 221,';
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 130) {
          const alpha = (1 - distance / 130) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Custom Glowing Cursor
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const dot = document.querySelector('.custom-cursor-dot');
  if (!cursor || !dot) return;

  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover effect over interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, .glass-panel, .skill-card, .project-card');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

/* ==========================================================================
   3. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const typewriterEl = document.getElementById('typewriter');
  if (!typewriterEl) return;

  const roles = [
    'Full-Stack Software Engineer',
    'React & TypeScript Specialist',
    'Node.js & Backend Architect',
    'Modern Web Applications Builder',
    'Open Source Contributor'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typewriterEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 45;
    } else {
      typewriterEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 2000; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. Interactive Developer Terminal
   ========================================================================== */
function initTerminal() {
  const input = document.getElementById('terminal-cmd-input');
  const output = document.getElementById('terminal-cmd-output');
  if (!input || !output) return;

  const commands = {
    help: () => `Available commands:
  • <span class="highlight">about</span>      : Learn more about Ayush Kumar
  • <span class="highlight">skills</span>     : View primary tech stack & tools
  • <span class="highlight">projects</span>   : Highlighted full-stack applications
  • <span class="highlight">contact</span>    : Direct channels & social handles
  • <span class="highlight">sudo hire</span>  : Unlock priority hire action
  • <span class="highlight">date</span>       : Current system date & time
  • <span class="highlight">clear</span>      : Clear the terminal screen`,

    about: () => `<span class="success">Ayush Kumar</span>
Full-Stack Software Engineer dedicated to crafting fast, scalable, and beautifully designed web systems.
Passionate about modern cloud infrastructure, clean TypeScript architectures, and delightful UX.`,

    skills: () => `[Frontend]  : React, TypeScript, Next.js, Vue, Tailwind, HTML5/CSS3
[Backend]   : Node.js, Express, Python, Go, NestJS, GraphQL, REST
[Databases] : PostgreSQL, MongoDB, Redis, Prisma, Supabase
[Cloud/Ops] : Docker, AWS, Kubernetes, CI/CD, Git, Linux`,

    projects: () => `Featured Work:
1. <span class="highlight">DevFlow</span> - Cloud Observability & Metrics Intelligence
2. <span class="highlight">Galactic Ledger</span> - Real-time Web3 DeFi Portfolio Tracker
3. <span class="highlight">Neural Architect</span> - Visual AI Workflow & Prompt Studio
Scroll down to the Projects section to explore interactive previews!`,

    contact: () => `Direct Contacts:
Email    : ayush.kumar.dev@gmail.com
GitHub   : github.com/ayushkumar
LinkedIn : linkedin.com/in/ayush-kumar
X/Twitter: x.com/ayush_codes`,

    'sudo hire': () => `<span class="success">PRIORITY INVITATION LOGGED</span>
Let's build something great together!
Scrolling to the contact section now...`,

    date: () => `Local Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} (IST)`,

    matrix: () => `<span class="success">Wake up, Neo... The Matrix has you. Follow the white rabbit.</span>`,

    clear: () => {
      output.innerHTML = '';
      return '';
    }
  };

  function executeCommand(cmdStr) {
    const rawCmd = cmdStr.trim().toLowerCase();
    const cmdRow = document.createElement('div');
    cmdRow.className = 'terminal-output';
    cmdRow.innerHTML = `<span class="purple">visitor@ayush-dev:~$</span> ${cmdStr}`;
    output.appendChild(cmdRow);

    if (rawCmd === 'clear') {
      output.innerHTML = '';
      return;
    }

    const responseRow = document.createElement('div');
    responseRow.className = 'terminal-output';

    if (commands[rawCmd]) {
      responseRow.innerHTML = commands[rawCmd]();
      if (rawCmd === 'sudo hire') {
        const contactSec = document.getElementById('contact');
        if (contactSec) {
          setTimeout(() => contactSec.scrollIntoView({ behavior: 'smooth' }), 1000);
        }
      }
    } else if (rawCmd === '') {
      // Do nothing for empty input
      return;
    } else {
      responseRow.innerHTML = `command not found: <span class="highlight">${cmdStr}</span>. Type <span class="highlight">'help'</span> for available commands.`;
    }

    output.appendChild(responseRow);
    output.scrollTop = output.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      executeCommand(val);
      playSynthBeep(440, 0.05);
    }
  });

  // Quick action buttons in terminal header
  const quickBtns = document.querySelectorAll('.terminal-quick-btn');
  quickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
        playSynthBeep(520, 0.05);
      }
    });
  });
}

/* ==========================================================================
   5. Skills Filter & Progress Animation
   ========================================================================== */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.skills-filter-tab');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
      playSynthBeep(600, 0.04);
    });
  });
}

/* ==========================================================================
   6. Projects Filter
   ========================================================================== */
function initProjectsFilter() {
  const tabs = document.querySelectorAll('.project-filter-tab');
  const cards = document.querySelectorAll('.project-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
      playSynthBeep(660, 0.04);
    });
  });
}

/* ==========================================================================
   7. 3D Card Tilt on Mousemove
   ========================================================================== */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  if (window.innerWidth < 768) return; // Disable on small devices

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   8. Intersection Observer for Skills Bar & Fade Ins
   ========================================================================== */
function initIntersectionAnimations() {
  const skillBars = document.querySelectorAll('.skill-level-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const level = bar.getAttribute('data-level') || '85%';
          bar.style.width = level;
        }
      });
    },
    { threshold: 0.25 }
  );

  skillBars.forEach((bar) => observer.observe(bar));
}

/* ==========================================================================
   9. Contact Form & Interactive Intent Dispatch
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const innerContent = document.getElementById('form-inner-content');
  const successState = document.getElementById('contact-success-state');
  const resetBtn = document.getElementById('reset-contact-form-btn');
  const intentInput = document.getElementById('form-intent');
  const subjectInput = document.getElementById('form-subject');
  const messageInput = document.getElementById('form-message');
  const charCountEl = document.getElementById('message-char-count');
  const intentPills = document.querySelectorAll('.intent-pill');

  if (!form) return;

  // Intent pills click handler
  const intentSubjects = {
    'Full-Time Role': 'Full-Time Opportunity Discussion',
    'Freelance Project': 'Freelance Web Project Collaboration',
    'Technical Consultation': 'Technical Architecture & Consulting Inquiry',
    'Saying Hello': 'Reaching Out to Say Hello'
  };

  intentPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      intentPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const intent = pill.getAttribute('data-intent');
      if (intentInput) intentInput.value = intent;
      if (subjectInput && intentSubjects[intent]) {
        subjectInput.value = intentSubjects[intent];
      }
      playSynthBeep(580, 0.04);
    });
  });

  // Real-time character count on message
  if (messageInput && charCountEl) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCountEl.textContent = `${len} / 800`;
      if (len > 750) {
        charCountEl.style.color = 'var(--accent-magenta)';
      } else {
        charCountEl.style.color = 'var(--text-muted)';
      }
    });
  }

  // Handle Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value.trim();
    const email = document.getElementById('form-email')?.value.trim();
    const subject = subjectInput?.value.trim() || 'General Inquiry';
    const message = messageInput?.value.trim();
    const intent = intentInput?.value || 'Full-Time Role';
    const timeline = document.getElementById('form-timeline')?.value || 'Next 1–2 months';

    if (!name || !email || !message) {
      showToast('⚠️ Please fill in all required fields (Name, Email, Message).', 'warning');
      return;
    }

    const submitBtn = document.getElementById('contact-submit-btn');
    const originalBtnHtml = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <i class="ph-bold ph-spinner ph-spin"></i>
      <span>Delivering Message...</span>
    `;

    // Simulate reliable dispatch & log to localStorage
    setTimeout(() => {
      const messages = JSON.parse(localStorage.getItem('ayush_portfolio_messages') || '[]');
      messages.push({
        id: Date.now(),
        name,
        email,
        intent,
        subject,
        timeline,
        message,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('ayush_portfolio_messages', JSON.stringify(messages));

      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;

      // Populate Success State
      const successName = document.getElementById('success-client-name');
      const successEmail = document.getElementById('success-client-email');
      const successIntent = document.getElementById('success-inquiry-type');

      if (successName) successName.textContent = name;
      if (successEmail) successEmail.textContent = email;
      if (successIntent) successIntent.textContent = intent;

      // Card transition
      if (innerContent && successState) {
        innerContent.style.display = 'none';
        successState.style.display = 'block';
      }

      showToast(`✨ Thanks ${name}! Your message has been received.`, 'success');
      playSynthBeep(880, 0.08);
    }, 850);
  });

  // Handle Reset / Send Another Note
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      if (charCountEl) charCountEl.textContent = '0 / 800';
      if (intentInput) intentInput.value = 'Full-Time Role';
      if (subjectInput) subjectInput.value = 'Full-Time Opportunity Discussion';

      intentPills.forEach((p, idx) => {
        if (idx === 0) p.classList.add('active');
        else p.classList.remove('active');
      });

      if (successState && innerContent) {
        successState.style.display = 'none';
        innerContent.style.display = 'block';
      }
    });
  }
}

/* ==========================================================================
   10. Copy Email to Clipboard
   ========================================================================== */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email') || 'ayush.kumar.dev@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`📋 Copied: ${email}`, 'success');
        playSynthBeep(700, 0.05);
      }).catch(() => {
        showToast(`Email: ${email}`, 'info');
      });
    });
  });
}

/* ==========================================================================
   11. Live IST Clock & Working Status
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  const workingStatusEl = document.getElementById('live-working-status');

  function update() {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const timeStr = new Intl.DateTimeFormat('en-US', options).format(new Date());
    if (clockEl) clockEl.textContent = `${timeStr} (IST)`;

    // Check IST Hour for status
    if (workingStatusEl) {
      const hourFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        hour12: false
      });
      const istHour = parseInt(hourFormatter.format(new Date()), 10);

      if (istHour >= 9 && istHour < 22) {
        workingStatusEl.innerHTML = '<span style="color: var(--accent-emerald);">● Online & Active</span> • Full-Time & Freelance';
      } else {
        workingStatusEl.innerHTML = '<span style="color: var(--text-muted);">🌙 Away / Resting (Replies by Morning)</span>';
      }
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   11b. Schedule 1:1 Call Modal
   ========================================================================== */
function initCallModal() {
  const openBtn = document.getElementById('open-call-modal-btn');
  const modal = document.getElementById('call-modal');
  const closeBtn = document.getElementById('call-modal-close');

  if (!openBtn || !modal) return;

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    playSynthBeep(600, 0.05);
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   12. Web Audio API Subtle Futuristic Feedback
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioFeedback() {
  const audioToggle = document.getElementById('audio-toggle-btn');
  if (!audioToggle) return;

  audioToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    audioToggle.innerHTML = soundEnabled
      ? '<i class="ph-bold ph-speaker-high"></i>'
      : '<i class="ph-bold ph-speaker-slash"></i>';
    showToast(soundEnabled ? '🔊 UI Audio Enabled' : '🔇 UI Audio Muted', 'info');
  });
}

function playSynthBeep(frequency = 520, duration = 0.05) {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Audio context not allowed until interaction or unsupported
  }
}

/* ==========================================================================
   13. Navigation & Smooth Scroll Spy
   ========================================================================== */
function initNavScroll() {
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky header class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile drawer
  mobileToggle?.addEventListener('click', () => {
    mobileDrawer?.classList.toggle('open');
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileDrawer?.classList.remove('open');
    });
  });
}

/* ==========================================================================
   14. Project Detail Modal
   ========================================================================== */
const projectDetailsData = {
  devflow: {
    title: 'DevFlow - Cloud Observability & Metrics Intelligence',
    category: 'Cloud & Full Stack Architecture',
    image: './assets/images/project-devflow.jpg',
    description: `DevFlow is a full-stack telemetry and distributed tracing platform engineered to process millions of real-time metrics across microservices. It features interactive latency heatmaps, real-time alerting engines, and automated anomaly detection algorithms.`,
    highlights: [
      'Sub-40ms end-to-end query latency with Redis caching layer & TimescaleDB',
      'WebSockets and Server-Sent Events (SSE) for instantaneous metric streaming',
      'Distributed tracing integration with OpenTelemetry and Jaeger standards',
      'Role-based access control with audited security tokens and SSO'
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'Go', 'PostgreSQL', 'Docker', 'AWS'],
    demoUrl: '#',
    codeUrl: '#'
  },
  vault: {
    title: 'Galactic Ledger - Web3 DeFi Portfolio Tracker',
    category: 'FinTech & Web3 Decentralized Analytics',
    image: './assets/images/project-vault.jpg',
    description: `An ultra-sleek decentralized financial portfolio manager aggregating balances, yield farming statistics, and swap history across Ethereum, Solana, and Polygon networks with instantaneous multi-currency valuation.`,
    highlights: [
      'Multi-chain wallet connection supporting MetaMask, Phantom, and WalletConnect',
      'Live cryptocurrency price feeds via Alchemy and CoinGecko WebSockets',
      'Automated gas optimization calculator with real-time slippage predictions',
      'Exportable tax-ready financial ledger sheets and historical charts'
    ],
    tech: ['Next.js', 'Tailwind', 'Ethers.js', 'Solidity', 'Graph Protocol', 'PostgreSQL'],
    demoUrl: '#',
    codeUrl: '#'
  },
  neuralai: {
    title: 'Neural Architect - Interactive AI Workflow Studio',
    category: 'AI / Machine Learning Tooling',
    image: './assets/images/project-neuralai.jpg',
    description: `A visual node-based workflow editor for orchestrating generative AI pipelines, chaining prompt templates, LLM reasoning loops, and multi-agent coordination with real-time parameter tuning.`,
    highlights: [
      'Drag-and-drop node graph canvas with custom SVG spline connections',
      'Compatible with OpenAI, Anthropic Claude, and Gemini API endpoints',
      'Streaming token generation with inline markdown rendering and code highlighting',
      'One-click workflow export to production-ready Python and Node.js microservices'
    ],
    tech: ['React Flow', 'TypeScript', 'FastAPI', 'Python', 'Redis', 'TailwindCSS'],
    demoUrl: '#',
    codeUrl: '#'
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body-content');
  if (!modal || !closeBtn || !modalBody) return;

  const detailButtons = document.querySelectorAll('.open-project-modal');
  detailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projKey = btn.getAttribute('data-project');
      const data = projectDetailsData[projKey];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
          <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 260px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(0, 240, 255, 0.2);">
          <span class="section-tag" style="margin-bottom: 10px;">${data.category}</span>
          <h2 style="font-size: 1.6rem; margin-bottom: 12px; font-weight: 800;">${data.title}</h2>
          <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 20px;">${data.description}</p>
          
          <h4 style="font-size: 1rem; margin-bottom: 10px; color: var(--accent-cyan); font-family: var(--font-mono);">Key Architecture & Engineering Highlights:</h4>
          <ul style="list-style: none; margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px;">
            ${data.highlights.map(h => `<li style="position: relative; padding-left: 20px; font-size: 0.9rem; color: var(--text-secondary);"><span style="position: absolute; left: 0; color: var(--accent-cyan);">▹</span>${h}</li>`).join('')}
          </ul>

          <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 10px; font-family: var(--font-mono);">Tech Stack</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;">
            ${data.tech.map(t => `<span class="tech-tag" style="background: rgba(0,240,255,0.08); border-color: rgba(0,240,255,0.25); color: var(--text-primary);">${t}</span>`).join('')}
          </div>

          <div style="display: flex; gap: 14px; flex-wrap: wrap;">
            <a href="${data.demoUrl}" class="btn btn-primary" onclick="event.preventDefault(); showToast('🚀 Live Demo Environment connecting...', 'info');">
              <i class="ph-bold ph-arrow-square-out"></i> Launch Live Application
            </a>
            <a href="${data.codeUrl}" class="btn btn-outline" onclick="event.preventDefault(); showToast('📦 Accessing GitHub Repository...', 'info');">
              <i class="ph-bold ph-github-logo"></i> View Repository
            </a>
          </div>
        </div>
      `;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      playSynthBeep(640, 0.05);
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ==========================================================================
   15. Toast Utility
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = '✨';
  if (type === 'success') icon = '✓';
  if (type === 'warning') icon = '⚠️';
  if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = `<span style="font-size: 1.1rem; color: var(--accent-cyan);">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
