/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TopicNode {
  id: string;
  parents: string[];
  children: string[];
  related: string[];
}

export class TopicGraph {
  private nodes: Map<string, TopicNode> = new Map();

  constructor() {
    this.prepopulateGraph();
  }

  /**
   * Pre-populates the Topic Graph with standard digital products, marketing, and SaaS categories
   */
  private prepopulateGraph() {
    const defaultNodes: TopicNode[] = [
      {
        id: "digital_products",
        parents: [],
        children: ["books", "printables", "notion_templates", "courses", "software_utilities"],
        related: []
      },
      {
        id: "printables",
        parents: ["digital_products"],
        children: ["journals", "planners", "stickers"],
        related: ["low_content_books", "etsy", "amazon_kdp"]
      },
      {
        id: "journals",
        parents: ["printables"],
        children: [],
        related: ["planners", "ebooks", "printables", "etsy", "amazon_kdp", "low_content_books"]
      },
      {
        id: "planners",
        parents: ["printables"],
        children: ["printable_planner"],
        related: ["journals", "notion_templates", "etsy"]
      },
      {
        id: "printable_planner",
        parents: ["planners"],
        children: [],
        related: ["journals", "printables", "notion_templates"]
      },
      {
        id: "notion_templates",
        parents: ["digital_products"],
        children: [],
        related: ["planners", "software_utilities", "templates"]
      },
      {
        id: "courses",
        parents: ["digital_products"],
        children: [],
        related: ["ebooks", "coaching"]
      },
      {
        id: "books",
        parents: ["digital_products"],
        children: ["ebooks", "low_content_books"],
        related: ["courses"]
      },
      {
        id: "ebooks",
        parents: ["books"],
        children: [],
        related: ["courses", "journals", "gumroad"]
      },
      {
        id: "low_content_books",
        parents: ["books"],
        children: [],
        related: ["amazon_kdp", "printables", "journals"]
      },
      {
        id: "amazon_kdp",
        parents: [],
        children: [],
        related: ["etsy", "low_content_books", "kdp"]
      },
      {
        id: "etsy",
        parents: [],
        children: [],
        related: ["printables", "planners", "journals", "stickers"]
      },
      {
        id: "software_utilities",
        parents: ["digital_products"],
        children: ["saas_tools"],
        related: ["notion_templates", "chrome_extensions", "whop"]
      },
      {
        id: "saas_tools",
        parents: ["software_utilities"],
        children: [],
        related: ["chrome_extensions", "whop", "stripe"]
      },
      {
        id: "whop",
        parents: [],
        children: [],
        related: ["stripe", "saas_tools", "discord_communities"]
      }
    ];

    defaultNodes.forEach(node => {
      this.nodes.set(node.id, node);
    });
  }

  /**
   * Adds or updates a topic node in the graph
   */
  addNode(node: TopicNode) {
    this.nodes.set(node.id, node);
  }

  /**
   * Retrieves a specific topic node
   */
  getNode(id: string): TopicNode | undefined {
    return this.nodes.get(id.toLowerCase());
  }

  /**
   * Scans a textual query and returns matching topic nodes + all their connected/related topics
   */
  findRelatedTopics(query: string): string[] {
    const normalized = query.toLowerCase();
    const relatedSet = new Set<string>();

    // 1. Find direct keyword matches or partial matches
    this.nodes.forEach((node, id) => {
      // Check if node id is in query, or query is in node id, or query mentions similar words
      const matches = 
        normalized.includes(id) || 
        id.includes(normalized) ||
        id.replace(/_/g, " ").split(" ").some(word => word.length > 3 && normalized.includes(word));

      if (matches) {
        relatedSet.add(id);
        // Add parents
        node.parents.forEach(p => relatedSet.add(p));
        // Add children
        node.children.forEach(c => relatedSet.add(c));
        // Add related
        node.related.forEach(r => relatedSet.add(r));
      }
    });

    // 2. If nothing directly matched, return query words split up to allow flexible search
    if (relatedSet.size === 0) {
      const words = normalized.split(/\s+/).filter(w => w.length > 3);
      words.forEach(w => relatedSet.add(w));
    }

    return Array.from(relatedSet);
  }

  /**
   * Gets a complete list of nodes in the graph
   */
  listNodes(): TopicNode[] {
    return Array.from(this.nodes.values());
  }
}
