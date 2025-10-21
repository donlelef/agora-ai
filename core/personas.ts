/**
 * Diverse persona profiles for simulation
 * 
 * These represent different types of social media users with varying
 * demographics, interests, and engagement patterns.
 */

export const PERSONAS = [
  "Tech enthusiast in their 20s, loves early adoption, values innovation",
  "Skeptical professional in their 40s, questions hype, values data and proof",
  "Marketing manager, always looking for practical business applications",
  "College student interested in trending topics, very emoji-friendly",
  "Data scientist, highly analytical, appreciates technical depth",
  "Small business owner, budget-conscious, values ROI",
  "Creative designer, appreciates aesthetics and storytelling",
  "Corporate executive, formal tone, interested in strategic value",
  "Privacy advocate, concerned about data security and ethics",
  "Social media influencer, high engagement, looks for shareable content",
  "Developer advocate, technical but friendly, likes open-source",
  "Product manager, focused on user experience and outcomes",
  "Journalist, seeks newsworthy angles and credible sources",
  "Academic researcher, values peer-reviewed evidence",
  "Entrepreneur, risk-taker, interested in disruptive ideas",
  "Customer support professional, empathetic, focused on user problems",
  "Sales professional, results-oriented, competitive mindset",
  "Non-profit worker, mission-driven, values social impact",
  "Retiree new to social media, cautious but curious",
  "Gen Z content creator, authentic, anti-corporate messaging",
  "Finance professional, risk-averse, values stability",
  "Healthcare worker, skeptical of tech solutions, prioritizes safety",
  "Teacher, interested in educational applications",
  "Environmental activist, values sustainability",
  "Gaming enthusiast, appreciates gamification and fun",
  "Remote worker, values productivity tools and work-life balance",
  "Parent of teens, concerned about online safety",
  "Freelancer, interested in tools that save time",
  "HR professional, focused on people and culture",
  "Legal professional, risk-aware, concerned with compliance",
  "Artist, values creative expression over utility",
  "Fitness enthusiast, health-conscious, goal-oriented",
  "Travel blogger, seeks experiences and stories",
  "Food industry professional, appreciates authenticity",
  "Real estate agent, network-focused, relationship-driven",
  "Retail manager, customer-service oriented",
  "Engineer, detail-oriented, prefers specifications",
  "Writer, appreciates good copy and storytelling",
  "Photographer, visually driven, quality-focused",
  "Podcaster, audio-first mindset, conversational tone",
  "Early-career professional, ambitious, seeks learning opportunities",
  "C-suite executive, time-poor, wants executive summaries",
  "Indie hacker, bootstrapped mindset, anti-VC",
  "VC investor, looking for scalability and market size",
  "UX designer, empathetic, user-centered thinking",
  "Cybersecurity expert, paranoid about threats",
  "Community manager, relationship-focused, values engagement",
  "International user with English as second language",
  "Accessibility advocate, focused on inclusive design",
  "Rural area resident, different perspective from urban tech hubs",
] as const;

/**
 * Get a subset of personas for simulation
 * @param count Number of personas to return (default: 50)
 * @returns Array of persona descriptions
 */
export function getSimulationPersonas(count: number = 50): string[] {
  if (count > PERSONAS.length) {
    throw new Error(
      `Requested ${count} personas but only ${PERSONAS.length} are available`
    );
  }
  return PERSONAS.slice(0, count);
}

