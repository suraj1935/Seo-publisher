export const productDisplayTemplate = {
  slug: "sunsky-digital-solutions",
  meta_title: "Sun Sky | Web, App, SEO & AI Automation",
  meta_description:
    "Sun Sky designs and builds websites, mobile apps, SEO systems, and AI agent automation that help businesses launch faster and grow smarter.",
  meta_keywords:
    "Sun Sky, web development, app development, SEO, AI agents, automation, digital agency",
  og_title: "Sun Sky | Web, App, SEO & AI Automation",
  og_description:
    "Websites, mobile apps, SEO systems, and AI agent automation built to help your business launch faster and grow smarter.",
  og_image_url: "",
  html_content: `<main class="sunsky-page">
  <header class="sunsky-header">
    <a class="sunsky-logo" href="#home" aria-label="Sun Sky home">
      <img src="/sunsky-header-logo.png" alt="Sun Sky" />
    </a>
    <nav class="sunsky-nav" aria-label="Primary navigation">
      <a class="active" href="#home">Home</a>
      <a href="#about">About Us</a>
      <a href="#services">Services</a>
      <a href="#solutions">Solutions</a>
      <a href="#contact">Contact</a>
    </nav>
    <div class="sunsky-actions">
      <button class="theme-toggle" type="button" aria-label="Theme controls">
        <span>&#9728;</span>
        <span>&#9680;</span>
      </button>
      <a class="signin-button" href="/admin/login">Sign In</a>
    </div>
  </header>

  <section id="home" class="hero-section">
    <div class="hero-copy">
      <h1>Websites, Apps & AI.<br />Built to <span>Grow With You.</span></h1>
      <p>
        Sun Sky is a web development, app development, SEO, and AI automation
        studio. We design, build, and ship products that help businesses
        launch faster and run smarter.
      </p>
      <div class="hero-buttons">
        <a class="explore-button" href="#services">Explore Solutions <b>&#8594;</b></a>
        <a class="learn-button" href="#about">Learn More <b>&#9655;</b></a>
      </div>
      <div class="trusted">
        <p>Built on a modern, reliable stack</p>
        <div class="trusted-logos" aria-label="Technologies we build with">
          <strong>Next.js</strong>
          <strong>React</strong>
          <strong>Supabase</strong>
          <strong>FastAPI</strong>
          <strong>Vercel</strong>
        </div>
      </div>
    </div>

    <div class="hero-visual" aria-label="Sun Sky intelligent solutions visual">
      <img src="/sunsky-hero-orbit.png" alt="Sun Sky AI platform with solution cards" />
    </div>
  </section>

  <section id="about" class="feature-strip" aria-label="Core strengths">
    <article>
      <span class="feature-icon orange">&#8599;</span>
      <div>
        <h2>Future Ready</h2>
        <p>We build scalable solutions for tomorrow's challenges.</p>
      </div>
    </article>
    <article>
      <span class="feature-icon blue">&#9671;</span>
      <div>
        <h2>Secure & Reliable</h2>
        <p>Enterprise-grade security and robust architectures.</p>
      </div>
    </article>
    <article>
      <span class="feature-icon violet">&#9004;</span>
      <div>
        <h2>AI Powered</h2>
        <p>Intelligent systems that learn, adapt and deliver value.</p>
      </div>
    </article>
    <article>
      <span class="feature-icon teal">&#9637;</span>
      <div>
        <h2>Data Driven</h2>
        <p>Turning data into insights that drive real growth.</p>
      </div>
    </article>
  </section>

  <section id="services" class="services-section">
    <div class="section-intro">
      <p class="section-kicker">What we do</p>
      <h2>Building Digital Solutions<br />That Drive <span>Real Impact</span></h2>
      <p>
        From AI-powered platforms to cloud solutions, we help businesses innovate
        and transform with confidence.
      </p>
      <a href="#solutions">View All Services <b>&#8594;</b></a>
    </div>

    <div class="service-grid">
      <article>
        <span class="card-icon orange">&#9728;</span>
        <h3>AI & Machine Learning</h3>
        <p>Intelligent solutions that learn, predict, and optimize business outcomes.</p>
        <a href="#contact" aria-label="AI and machine learning">&#8594;</a>
      </article>
      <article>
        <span class="card-icon blue">&#9729;</span>
        <h3>Cloud & Data Engineering</h3>
        <p>Scalable cloud platforms and data pipelines built for performance.</p>
        <a href="#contact" aria-label="Cloud and data engineering">&#8594;</a>
      </article>
      <article>
        <span class="card-icon violet">&#9635;</span>
        <h3>Digital Product Development</h3>
        <p>End-to-end product development that brings ideas to life.</p>
        <a href="#contact" aria-label="Digital product development">&#8594;</a>
      </article>
      <article>
        <span class="card-icon teal">&#9881;</span>
        <h3>Automation Solutions</h3>
        <p>Streamline operations and boost efficiency with smart automation.</p>
        <a href="#contact" aria-label="Automation solutions">&#8594;</a>
      </article>
    </div>
  </section>

  <section id="solutions" class="impact-band">
    <div class="impact-title">
      <p class="section-kicker">Our impact</p>
      <h2>Numbers That<br />Reflect Our Journey</h2>
      <span></span>
    </div>
    <div class="impact-metrics">
      <article><span>&#9817;</span><strong>250+</strong><p>Happy Clients</p></article>
      <article><span>&#8599;</span><strong>500+</strong><p>Projects Delivered</p></article>
      <article><span>&#9678;</span><strong>25+</strong><p>Countries Served</p></article>
      <article><span>&#9813;</span><strong>10+</strong><p>Industry Awards</p></article>
    </div>
  </section>
</main>`,
  css_content: `:root {
  --sunsky-navy: #071844;
  --sunsky-blue: #075cff;
  --sunsky-orange: #ff650f;
  --sunsky-teal: #0ebeb5;
  --sunsky-violet: #6d36ff;
  --sunsky-muted: #506089;
  --sunsky-soft: #f7fbff;
  --sunsky-line: #dce7f8;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: #ffffff;
  color: var(--sunsky-navy);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

.sunsky-page {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 73% 19%, rgba(35, 133, 255, 0.18), transparent 31%),
    linear-gradient(180deg, #ffffff 0%, #f7fbff 42%, #ffffff 100%);
}

.sunsky-header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: 260px 1fr 220px;
  align-items: center;
  gap: 22px;
  width: min(1328px, calc(100% - 72px));
  margin: 0 auto;
  padding: 24px 0 12px;
  background: rgba(255, 255, 255, 0.74);
  backdrop-filter: blur(18px);
}

.sunsky-logo {
  display: inline-flex;
  align-items: center;
  width: 205px;
}

.sunsky-logo img {
  display: block;
  width: 100%;
  height: auto;
}

.sunsky-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(20px, 2.6vw, 44px);
  color: #06133a;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
}

.sunsky-nav a {
  position: relative;
  padding: 10px 0;
}

.sunsky-nav a.active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--sunsky-orange);
}

.sunsky-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  border: 1px solid var(--sunsky-line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: var(--sunsky-blue);
  padding: 0 13px;
  font-size: 20px;
  box-shadow: 0 10px 26px rgba(24, 60, 130, 0.08);
}

.signin-button,
.explore-button,
.learn-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-weight: 800;
}

.signin-button {
  min-width: 92px;
  height: 42px;
  background: linear-gradient(100deg, #ff6817 0%, #d85865 48%, #075cff 100%);
  color: white;
  box-shadow: 0 18px 34px rgba(14, 91, 255, 0.18);
}

.hero-section {
  display: grid;
  grid-template-columns: minmax(380px, 0.78fr) minmax(520px, 1.22fr);
  align-items: center;
  gap: 32px;
  width: min(1328px, calc(100% - 72px));
  margin: 4px auto 0;
  min-height: 400px;
}

.hero-copy {
  padding: 10px 0 20px;
}

.hero-copy h1 {
  margin: 0;
  color: var(--sunsky-navy);
  font-size: clamp(40px, 3.7vw, 56px);
  line-height: 1.08;
  letter-spacing: 0;
  font-weight: 900;
}

.hero-copy h1 span,
.section-intro h2 span {
  color: var(--sunsky-blue);
}

.hero-copy > p {
  max-width: 520px;
  margin: 22px 0 0;
  color: #334875;
  font-size: 17px;
  line-height: 1.72;
}

.hero-buttons {
  display: flex;
  gap: 22px;
  margin-top: 24px;
}

.explore-button,
.learn-button {
  min-width: 190px;
  min-height: 48px;
  gap: 20px;
  font-size: 15px;
}

.explore-button {
  background: linear-gradient(100deg, #ff650f 0%, #db5860 46%, #075cff 100%);
  color: white;
  box-shadow: 0 18px 34px rgba(14, 91, 255, 0.18);
}

.learn-button {
  border: 1px solid #8ca8ee;
  background: rgba(255, 255, 255, 0.72);
  color: #20345e;
}

.trusted {
  margin-top: 42px;
}

.trusted p {
  margin: 0 0 17px;
  color: #97a3bd;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.trusted-logos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;
  color: #8a96ae;
}

.trusted-logos strong {
  font-size: 19px;
  font-weight: 900;
}

.hero-visual {
  position: relative;
  min-height: 382px;
}

.hero-visual img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 392px;
  object-fit: contain;
  mix-blend-mode: multiply;
}

.feature-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  width: min(1328px, calc(100% - 72px));
  margin: 0 auto;
  transform: translateY(-66px);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 70px rgba(42, 79, 130, 0.12);
  backdrop-filter: blur(16px);
}

.feature-strip article {
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 22px;
  align-items: center;
  min-height: 96px;
  padding: 22px 34px;
}

.feature-strip article + article {
  border-left: 1px solid #e5ecf7;
}

.feature-icon,
.card-icon {
  display: inline-grid;
  place-items: center;
  color: currentColor;
  font-weight: 900;
}

.feature-icon {
  font-size: 38px;
}

.orange { color: var(--sunsky-orange); }
.blue { color: var(--sunsky-blue); }
.violet { color: var(--sunsky-violet); }
.teal { color: var(--sunsky-teal); }

.feature-strip h2 {
  margin: 0;
  font-size: 17px;
  line-height: 1.2;
}

.feature-strip p {
  margin: 7px 0 0;
  color: #31456f;
  font-size: 14px;
  line-height: 1.48;
}

.services-section {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 13px;
  align-items: start;
  width: min(1328px, calc(100% - 72px));
  margin: -90px auto 0;
  padding: 20px 0 24px;
}

.section-kicker {
  margin: 0 0 12px;
  color: var(--sunsky-orange);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.section-intro h2 {
  margin: 0;
  color: var(--sunsky-navy);
  font-size: 27px;
  line-height: 1.22;
  font-weight: 900;
}

.section-intro > p {
  margin: 18px 0 0;
  color: #334875;
  font-size: 15px;
  line-height: 1.65;
}

.section-intro > a {
  display: inline-flex;
  gap: 18px;
  margin-top: 22px;
  color: var(--sunsky-blue);
  font-size: 14px;
  font-weight: 900;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  align-items: start;
}

.service-grid article {
  position: relative;
  min-height: 198px;
  height: 198px;
  border: 1px solid #e0e9f7;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.86);
  padding: 24px 24px 22px;
  box-shadow: 0 18px 50px rgba(42, 79, 130, 0.08);
}

.card-icon {
  height: 34px;
  width: 34px;
  margin-bottom: 22px;
  font-size: 28px;
}

.service-grid h3 {
  margin: 0;
  color: var(--sunsky-navy);
  font-size: 16px;
  line-height: 1.25;
}

.service-grid p {
  margin: 11px 0 0;
  color: #334875;
  font-size: 13px;
  line-height: 1.55;
}

.service-grid article > a {
  position: absolute;
  right: 24px;
  bottom: 21px;
  color: currentColor;
  font-size: 22px;
  font-weight: 900;
}

.impact-band {
  display: grid;
  grid-template-columns: 270px 1fr;
  gap: 44px;
  align-items: center;
  width: min(1504px, calc(100% - 30px));
  margin: -10px auto 40px;
  border-radius: 14px;
  background:
    radial-gradient(circle at 58% 40%, rgba(20, 86, 190, 0.35), transparent 28%),
    linear-gradient(135deg, #071844 0%, #082c82 54%, #06143a 100%);
  color: white;
  padding: 24px 96px;
  min-height: 126px;
}

.impact-title h2 {
  margin: 0;
  font-size: 28px;
  line-height: 1.25;
  font-weight: 900;
}

.impact-title span {
  display: block;
  width: 32px;
  height: 3px;
  margin-top: 18px;
  background: linear-gradient(90deg, var(--sunsky-orange), var(--sunsky-blue));
}

.impact-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
}

.impact-metrics article {
  display: grid;
  grid-template-columns: 54px 1fr;
  column-gap: 20px;
  align-items: center;
  min-height: 78px;
}

.impact-metrics article + article {
  border-left: 1px solid rgba(255, 255, 255, 0.26);
  padding-left: 46px;
}

.impact-metrics span {
  grid-row: span 2;
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 999px;
  font-size: 24px;
}

.impact-metrics strong {
  font-size: 30px;
  line-height: 1;
}

.impact-metrics p {
  margin: 5px 0 0;
  color: #dfe8ff;
  font-size: 14px;
}

@media (max-width: 1180px) {
  .sunsky-header {
    grid-template-columns: 1fr auto;
  }

  .sunsky-nav {
    grid-column: 1 / -1;
    grid-row: 2;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .hero-section,
  .services-section {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    min-height: 0;
  }

  .feature-strip,
  .service-grid,
  .impact-metrics {
    grid-template-columns: repeat(2, 1fr);
  }

  .impact-band {
    grid-template-columns: 1fr;
    padding: 34px;
  }

  .impact-metrics article + article {
    border-left: 0;
    padding-left: 0;
  }
}

@media (max-width: 680px) {
  .sunsky-header,
  .hero-section,
  .feature-strip,
  .services-section {
    width: calc(100% - 28px);
  }

  .sunsky-header {
    grid-template-columns: 1fr;
    gap: 16px;
    padding-top: 16px;
  }

  .sunsky-logo {
    width: 178px;
  }

  .sunsky-actions {
    justify-content: space-between;
  }

  .sunsky-nav {
    gap: 24px;
    font-size: 14px;
  }

  .hero-section {
    margin-top: 10px;
    gap: 18px;
  }

  .hero-copy h1 {
    font-size: 38px;
  }

  .hero-copy > p {
    font-size: 15px;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .explore-button,
  .learn-button {
    width: 100%;
  }

  .trusted {
    margin-top: 34px;
  }

  .hero-visual img {
    max-height: none;
  }

  .feature-strip,
  .service-grid,
  .impact-metrics {
    grid-template-columns: 1fr;
  }

  .feature-strip article + article {
    border-left: 0;
    border-top: 1px solid #e5ecf7;
  }

  .feature-strip article {
    padding: 20px;
  }

  .services-section {
    padding-top: 42px;
  }

  .impact-band {
    width: calc(100% - 24px);
    padding: 28px 22px;
  }
}`,
  js_content: "",
  json_ld: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sun Sky",
    description:
      "Sun Sky designs and builds websites, mobile apps, SEO systems, and AI agent automation.",
    url: "https://sunsky.example",
  },
};
