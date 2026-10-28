import bcrypt from 'bcryptjs';
import { connectDB } from './db';
import { config } from './config';
import Page from './models/Page';
import AdminUser from './models/AdminUser';
import Settings from './models/Settings';

async function seed() {
  await connectDB();

  const existing = await AdminUser.findOne({ email: config.adminEmail });
  if (!existing) {
    if (config.isProduction && config.adminPassword.length < 12) {
      throw new Error(
        'No admin account exists yet. Set ADMIN_PASSWORD in Render to a secure password of at least 12 characters for the first deployment.'
      );
    }
    const hash = await bcrypt.hash(config.adminPassword, 12);
    await AdminUser.create({
      name: 'Lexis Technology Administrator',
      email: config.adminEmail,
      passwordHash: hash,
      role: 'superadmin',
    });
    console.log('Admin user created:', config.adminEmail);
  } else {
    let changed = false;
    if (!existing.name || existing.name.includes('EduJung')) {
      existing.name = 'Lexis Technology Administrator';
      changed = true;
    }
    if (existing.role !== 'superadmin') {
      existing.role = 'superadmin';
      changed = true;
    }
    if (changed) {
      await existing.save();
      console.log('Configured admin account updated to Lexis Technology superadmin');
    }
  }

  const settingsExist = await Settings.findOne();
  const defaultSettingsData = {
    siteName: 'Lexis Technology',
    logo: '/logo.png',
    phone: '+977-9800000000',
    email: 'contact@lexistechnology.com',
    address: 'Kathmandu, Nepal / Remote Worldwide',
    hours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
    socialLinks: [
      { platform: 'facebook', url: 'https://facebook.com/lexistechnology' },
      { platform: 'instagram', url: 'https://instagram.com/lexistechnology' },
      { platform: 'linkedin', url: 'https://linkedin.com/company/lexistechnology' },
      { platform: 'youtube', url: 'https://youtube.com/@lexistechnology' },
    ],
    footerColumns: [
      {
        title: 'CORE SERVICES',
        items: [
          { label: 'Website Making & Web Apps', url: '/web-development' },
          { label: 'Video Editing & Reels', url: '/video-editing' },
          { label: 'Photo Retouching & Design', url: '/photo-editing' },
          { label: 'Managed IT & Cloud Hosting', url: '/it-solutions' },
          { label: 'E-Commerce Development', url: '/web-development' },
          { label: 'Brand Identity Kits', url: '/photo-editing' },
        ],
      },
      {
        title: 'COMPANY',
        items: [
          { label: 'About Us', url: '/about' },
          { label: 'Our Portfolio', url: '/universities' },
          { label: 'Creative Team', url: '/team' },
          { label: 'Services Overview', url: '/services' },
        ],
      },
      {
        title: 'QUICK LINKS',
        items: [
          { label: 'Get a Free Quote', url: '/contact' },
          { label: 'Pricing & Packages', url: '/services' },
          { label: 'Contact Support', url: '/contact' },
        ],
      },
    ],
  };

  if (!settingsExist) {
    await Settings.create(defaultSettingsData);
    console.log('Site settings seeded for Lexis Technology');
  } else {
    settingsExist.siteName = 'Lexis Technology';
    settingsExist.email = 'contact@lexistechnology.com';
    settingsExist.footerColumns = defaultSettingsData.footerColumns as any;
    await settingsExist.save();
    console.log('Site settings updated to Lexis Technology');
  }

  // Home Page Configuration
  const homeData = {
    slug: 'home',
    title: 'Lexis Technology | Web Development, Video & Photo Editing',
    metaDescription: 'Lexis Technology is a premier IT and creative agency specializing in website making, viral video editing, photo retouching, and cloud IT solutions.',
    order: 0,
    isVisible: true,
    sections: [
      {
        type: 'hero',
        data: {
          headline: 'WE BUILD WEBSITES, CRAFT VIDEOS',
          subheadline: '& SHAPE DIGITAL BRANDS',
          tagline: 'High-Performance Web Development, Cinematic Video Editing & Pixel-Perfect Design',
          ctaText: 'Get a Free Quote',
          ctaLink: '/contact',
          backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
        },
      },
      {
        type: 'introCards',
        data: {
          title: 'Empowering Your Digital Evolution',
          description: 'We combine technical engineering with creative media production to build unforgettable digital experiences.',
          cards: [
            {
              title: 'Website Making & Web Apps',
              description: 'Custom responsive websites, SaaS platforms, and e-commerce stores engineered for speed, conversion, and clean code.',
            },
            {
              title: 'Professional Video Editing',
              description: 'Cinematic video cuts for YouTube creators, high-retention viral reels, shorts, podcasts, and brand commercials with sound design.',
            },
            {
              title: 'Photo Editing & Retouching',
              description: 'High-end product manipulation, e-commerce image retouching, logo branding kits, and eye-catching social media creatives.',
            },
          ],
        },
      },
      {
        type: 'about',
        data: {
          title: 'About Lexis Technology',
          subtitle: 'Technical Precision Meets Creative Vision',
          image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
          paragraphs: [
            'At Lexis Technology, we empower modern creators, startups, and growing enterprises with full-spectrum digital solutions. In today’s competitive world, having an extraordinary website and captivating video content is the fastest way to build authority and drive conversions.',
            'Founded by creative technologists and passionate developers, our studio handles every phase of your digital footprint: from custom web applications and lightning-fast landing pages, to viral video editing and professional graphic design. We treat every project like our own with transparent communication and pixel-perfect delivery.',
          ],
          ctaText: 'Explore Our Work',
          ctaLink: '/universities',
        },
      },
      {
        type: 'universities',
        data: {
          title: 'Featured Works & Projects',
          subtitle: 'Recent Websites, Video Edits & Creative Campaigns',
          ctaText: 'View Full Portfolio ...',
          ctaLink: '/universities',
          items: [
            {
              name: 'SaaS Analytics & Cloud Dashboard',
              country: 'Web Development',
              image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
            },
            {
              name: 'Commercial Product Launch Video',
              country: 'Video Production',
              image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
            },
            {
              name: 'High-End Studio Jewelry Retouching',
              country: 'Photo Retouching',
              image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
            },
            {
              name: 'Modern E-Commerce Fashion Storefront',
              country: 'Web Development',
              image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
            },
            {
              name: 'Viral Shorts & Instagram Reels Suite',
              country: 'Video Editing',
              image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
            },
            {
              name: 'Corporate Tech Brand Identity & 3D Assets',
              country: 'Brand Design',
              image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
            },
          ],
        },
      },
      {
        type: 'stats',
        data: {
          title: 'Our Impact In Numbers',
          items: [
            { value: '250+', label: 'Websites & Web Apps Launched' },
            { value: '1,400+', label: 'Videos Edited & Motion Graphics' },
            { value: '3,200+', label: 'Photos Retouched & Graphics Delivered' },
            { value: '99.4%', label: 'Client Satisfaction Rate' },
          ],
        },
      },
      {
        type: 'testimonials',
        data: {
          title: 'What Our Clients Say',
          subtitle: 'Trusted by Startup Founders, Creators & Growing Businesses',
          items: [
            {
              name: 'Aakash Shrestha',
              role: 'Founder, SaaS Horizon',
              rating: 5,
              message: 'Lexis Technology built our web application from scratch with flawless performance. Their attention to detail in code and UI design is unmatched in the industry.',
              image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            },
            {
              name: 'Pooja Sharma',
              role: 'Content Creator (500K+ Subs)',
              rating: 5,
              message: 'Their video editing team completely leveled up my YouTube channel and Reels. Retention rates went up by 40% in just two months.',
              image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
            },
            {
              name: 'Suman Pokharel',
              role: 'CEO, Apex Retail',
              rating: 5,
              message: 'From our e-commerce web build to our product photos and promotional commercials, Lexis Technology delivered everything on time and exceeded expectations.',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            },
            {
              name: 'Sneha Thapa',
              role: 'Marketing Director',
              rating: 5,
              message: 'Fast turnaround, superb communication, and top-tier creative polish. They are our go-to partner for all web and multimedia needs.',
              image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
            },
          ],
        },
      },
      {
        type: 'contact',
        data: {
          title: 'Request a Free Consultation & Quote',
          address: 'Kathmandu, Nepal / Remote Worldwide',
          phone: '+977-9800000000',
          email: 'contact@lexistechnology.com',
          hours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
        },
      },
    ],
  };

  await Page.findOneAndUpdate({ slug: 'home' }, homeData, { upsert: true, new: true });
  console.log('Home page updated for Lexis Technology');

  const createOrUpdatePage = async (slug: string, title: string, sections: any[]) => {
    await Page.findOneAndUpdate(
      { slug },
      { slug, title, order: 1, isVisible: true, sections },
      { upsert: true, new: true }
    );
    console.log(`${slug} page ready`);
  };

  await createOrUpdatePage('about', 'About Us', [
    {
      type: 'pageHero',
      data: {
        title: 'About Lexis Technology',
        subtitle: 'Our Mission, Values & Creative Engineering',
        backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
      },
    },
    {
      type: 'richText',
      data: {
        content: `
          <div class="space-y-4">
            <p><strong>Lexis Technology</strong> is an elite digital production and technology agency. We exist to help businesses, entrepreneurs, and content creators turn their visions into scalable web platforms and high-converting visual media.</p>
            <p>We believe that outstanding software engineering and world-class digital storytelling should not be isolated. By combining modern full-stack development with cinematic video editing and high-end graphic design, we provide a unified partner for your entire digital brand.</p>
          </div>
        `,
      },
    },
    {
      type: 'features',
      data: {
        title: 'Why Choose Lexis Technology?',
        items: [
          {
            title: 'Modern Architecture',
            description: 'We build with React, Next.js, Node.js, and modern cloud stacks designed for lightning speed and bank-grade security.',
          },
          {
            title: 'High-Retention Video Editing',
            description: 'Our video editors specialize in pacing, sound design, and visual hooks that stop scrolling and boost audience retention.',
          },
          {
            title: 'Transparent Pricing & SLAs',
            description: 'No hidden fees. We work with clear milestones, rapid iterations, and dedicated 1-on-1 support.',
          },
        ],
      },
    },
  ]);

  await createOrUpdatePage('services', 'Our Services', [
    {
      type: 'pageHero',
      data: {
        title: 'Complete IT & Creative Services',
        subtitle: 'Everything You Need To Build & Scale Your Digital Presence',
        backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
      },
    },
    {
      type: 'features',
      data: {
        title: 'Our Flagship Solutions',
        items: [
          {
            title: 'Website Making & Web Apps',
            description: 'Custom corporate websites, SaaS web applications, e-commerce storefronts, and conversion-optimized landing pages.',
          },
          {
            title: 'Professional Video Editing',
            description: 'Viral Shorts, TikTok & Reels, YouTube long-form content, corporate promo videos, 4K color grading, and motion graphics.',
          },
          {
            title: 'Photo Editing & Graphic Design',
            description: 'High-end product retouching, brand identity packages, logo design, marketing banners, and social media creative suites.',
          },
          {
            title: 'Managed IT & Cloud Hosting',
            description: 'Domain configuration, cloud server deployment, SSL security certificates, website maintenance, and 24/7 technical monitoring.',
          },
          {
            title: 'UI/UX Design & Prototyping',
            description: 'Figma wireframes, interactive user journey prototypes, design systems, and responsive design guidelines.',
          },
          {
            title: 'SEO & Performance Optimization',
            description: 'Core Web Vitals auditing, Google Search Console optimization, structured schema data, and sub-second page loads.',
          },
        ],
      },
    },
  ]);

  // Dedicated Service Pages
  const servicePages = [
    {
      slug: 'web-development',
      title: 'Website Making & Web Development',
      content: '<p>At Lexis Technology, we engineer custom web platforms tailored to your business model. Whether you need a corporate business website, an e-commerce platform with Stripe checkout, or a bespoke React/Next.js web application, we guarantee fast, secure, and responsive results.</p>',
      items: [
        { title: 'Custom Front-End & Back-End', description: 'Built with React, Next.js, Node.js, and TypeScript for exceptional performance.' },
        { title: 'Responsive Mobile-First Design', description: 'Flawless presentation on every smartphone, tablet, laptop, and 4K desktop display.' },
        { title: 'SEO & Conversion Architecture', description: 'Built-in schema, meta tags, and high-speed loading for top Google search rankings.' },
      ],
    },
    {
      slug: 'video-editing',
      title: 'Professional Video Editing & Production',
      content: '<p>Video is the dominant medium on the internet today. Our editors craft dynamic, high-retention video content for YouTube creators, Instagram Reels, TikTok, podcasts, and commercial advertisements.</p>',
      items: [
        { title: 'Viral Shorts & Reels', description: 'Fast-paced cuts, captions, animations, and sound effects proven to boost watch time.' },
        { title: 'YouTube Long-Form Edits', description: 'Storytelling, narrative pacing, B-roll integration, and clean chapter structuring.' },
        { title: 'Color Grading & Motion Graphics', description: 'Cinema-grade color correction, custom lower thirds, intro/outro animations, and SFX.' },
      ],
    },
    {
      slug: 'photo-editing',
      title: 'Photo Editing & Graphic Design',
      content: '<p>Visual perfection matters. From studio product manipulation to comprehensive brand identity kits, we create high-resolution imagery that makes your products and marketing materials irresistible.</p>',
      items: [
        { title: 'E-Commerce Product Retouching', description: 'Background removal, skin softening, color matching, and reflective surface polishing.' },
        { title: 'Brand Identity & Logo Design', description: 'Custom typography, vectorized logos, business stationery, and brand guidelines.' },
        { title: 'Social Media Creatives & Banners', description: 'High-CTR YouTube thumbnails, Instagram post bundles, and advertising banners.' },
      ],
    },
    {
      slug: 'it-solutions',
      title: 'Managed IT & Cloud Services',
      content: '<p>Keep your digital infrastructure running seamlessly without downtime. We handle the technical complexities of cloud hosting, domains, security, and ongoing updates so you can focus on growing your business.</p>',
      items: [
        { title: 'High-Speed Cloud Hosting', description: 'Configuration of AWS, Vercel, VPS, and cloud environments with automated backups.' },
        { title: 'Security & SSL Audits', description: 'SSL certificate installation, malware scanning, DDoS protection, and database security.' },
        { title: 'Continuous Maintenance & Support', description: 'Framework updates, bug fixing, uptime monitoring, and priority technical support.' },
      ],
    },
  ];

  for (const sp of servicePages) {
    await createOrUpdatePage(sp.slug, sp.title, [
      {
        type: 'pageHero',
        data: {
          title: sp.title,
          subtitle: 'Specialized Digital Services by Lexis Technology',
          backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
        },
      },
      { type: 'richText', data: { content: sp.content } },
      { type: 'features', data: { title: `Why Choose Lexis for ${sp.title}?`, items: sp.items } },
    ]);
  }

  // Universities (Portfolio Showcase Page)
  await createOrUpdatePage('universities', 'Our Portfolio', [
    {
      type: 'pageHero',
      data: {
        title: 'Our Portfolio & Works',
        subtitle: 'A Showcase of Websites, Video Edits & Graphic Creations',
        backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
      },
    },
    {
      type: 'universityList',
      data: {
        title: 'Selected Client Projects',
        items: [
          {
            name: 'SaaS Analytics & Cloud Dashboard',
            country: 'Web Development',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Commercial Product Launch Promo',
            country: 'Video Editing',
            image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'High-End Studio Jewelry Retouching',
            country: 'Photo Editing',
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Modern E-Commerce Fashion Storefront',
            country: 'Web Development',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Viral Shorts & Instagram Reels Suite',
            country: 'Video Editing',
            image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
          },
          {
            name: 'Corporate Tech Brand Identity & 3D Assets',
            country: 'Photo Editing',
            image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
    },
  ]);

  // Team Page
  await createOrUpdatePage('team', 'Our Team', [
    {
      type: 'pageHero',
      data: {
        title: 'Meet Our Experts',
        subtitle: 'The Technologists & Creatives Behind Lexis Technology',
        backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
      },
    },
    {
      type: 'features',
      data: {
        title: 'Team Leaders',
        items: [
          {
            title: 'Lead Full-Stack Architect',
            description: 'Specializes in high-performance web systems, cloud infrastructure, and modern JavaScript frameworks.',
            image: '',
          },
          {
            title: 'Head of Video Production',
            description: 'Cinema colorist and video editor specializing in YouTube pacing, viral hooks, and commercial commercials.',
            image: '',
          },
          {
            title: 'Senior Art & Design Director',
            description: 'Expert in high-end photo retouching, 3D asset generation, and complete corporate brand identity systems.',
            image: '',
          },
        ],
      },
    },
  ]);

  // Contact Page
  await createOrUpdatePage('contact', 'Contact Us', [
    {
      type: 'pageHero',
      data: {
        title: 'Get In Touch',
        subtitle: 'Request a Free Project Estimate & Consultation',
        backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
      },
    },
    {
      type: 'contact',
      data: {
        title: 'Send Us Your Project Brief',
        address: 'Kathmandu, Nepal / Remote Worldwide',
        phone: '+977-9800000000',
        email: 'contact@lexistechnology.com',
        hours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
      },
    },
  ]);

  console.log('Seeding complete for Lexis Technology!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
