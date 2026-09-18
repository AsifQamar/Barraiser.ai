import { SessionResponse, DossierResponse, HistoryItem } from "./types";

export const mockSessionResponse: SessionResponse = {
  sessionId: "sess_amz_98234ab1",
  targetRole: "Amazon SDE-1 (AWS Messaging & Streaming)",
  codingChallenge: {
    title: "High-Throughput LRU Cache with TTL Eviction",
    difficulty: "Medium",
    description: `Design and implement a data structure for a **Least Recently Used (LRU) Cache** that also supports **Time-To-Live (TTL)** expiration per key.

The cache should support the following operations in $O(1)$ average time complexity:
- \`get(key)\`: Return the value of the key if the key exists and has not expired. Otherwise, return \`-1\`.
- \`put(key, value, ttlMs)\`: Update or insert the value if key does not exist. The item should expire after \`ttlMs\` milliseconds from insertion. When the cache reaches its capacity, invalidate the least recently used key before inserting.

### Real Amazon Bar Raiser Constraints:
- Handle concurrent read/write access safety considerations in your architectural commentary.
- Consider what happens when keys expire but are never queried again. Does your solution leak memory?`,
    starterCode: `// Language: Java 21
import java.util.*;

class LRUCacheWithTTL {
    private final int capacity;

    public LRUCacheWithTTL(int capacity) {
        this.capacity = capacity;
        // TODO: Initialize internal doubly-linked list & hash map
    }

    public int get(int key) {
        // Return value if valid and not expired, else -1
        return -1;
    }

    public void put(int key, int value, long ttlMs) {
        // Insert key with TTL expiration timestamp
    }
}`,
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
      "1 <= ttlMs <= 10^7",
      "At most 2 * 10^5 calls will be made to get and put."
    ],
    examples: [
      {
        input: 'LRUCacheWithTTL cache = new LRUCacheWithTTL(2);\ncache.put(1, 100, 5000); // Expires in 5s\ncache.put(2, 200, 1000); // Expires in 1s\ncache.get(1); // returns 100\n// Wait 1.5s...\ncache.get(2); // returns -1 (expired)',
        output: "100, -1",
        explanation: "Key 2 expired after 1000ms TTL and was dropped on read."
      }
    ]
  },
  leadershipPrinciple: {
    principle: "Customer Obsession & Bias for Action",
    question: "Describe a high-stakes scenario where an urgent production outage or degraded customer experience required you to take calculated risks and deploy a temporary mitigation with incomplete data. How did you validate that customers were protected, and what was your long-term root-cause fix?",
    tip: "Amazon Bar Raisers strictly look for quantifiable business metrics (latency drop, packet loss percentage, prevented financial loss) and an emphasis on what YOU specifically drove ('I decided' vs 'We thought')."
  },
  createdAt: new Date().toISOString()
};

export const mockDossierResponse: DossierResponse = {
  sessionId: "sess_amz_98234ab1",
  targetRole: "Amazon SDE-1 (AWS Messaging & Streaming)",
  verdict: "Hire",
  summary: "Candidate demonstrates crisp algorithmic mastery with clean doubly-linked list node management and accurate $O(1)$ amortized get/put mechanics. The behavioral response demonstrated exceptional Bias for Action during a live payment webhook incident, though follow-up probes revealed mild ambiguity regarding passive memory leak cleanup for unread expired keys.",
  technicalEvaluation: {
    timeComplexity: "O(1) amortized for get() and put() using HashMap + Doubly LinkedList pointers.",
    spaceComplexity: "O(Capacity) auxiliary memory bound by hash table entries and node references.",
    edgeCasesIdentified: "Correctly handles active TTL expiration upon invocation of get(). However, keys that expire without subsequent lookups remain resident until capacity eviction triggers."
  },
  leadershipScorecard: [
    {
      principle: "Customer Obsession",
      score: 4,
      feedback: "Directly prioritized stopping merchant webhook dropoffs over internal report delays. Showed deep empathy for downstream payment failures."
    },
    {
      principle: "Bias for Action",
      score: 5,
      feedback: "Deployed an in-memory ring-buffer queue within 45 minutes of telemetry alarm trigger, averting SLA breach."
    },
    {
      principle: "Dive Deep",
      score: 3,
      feedback: "Demonstrated root cause understanding in post-mortem, but lacked clarity on how synthetic probe transactions were monitored during the rollback."
    },
    {
      principle: "Deliver Results",
      score: 4,
      feedback: "Quantified metric improvements cleanly: webhook failure rate dropped from 5.4% to 0.01% with zero reconciliation mismatches."
    }
  ],
  actionableFixes: [
    "Address Passive TTL Memory Bleed: Propose a lightweight background wheel timer (e.g. Netty HashedWheelTimer) or lazy randomized sample eviction so abandoned expired keys don't consume heap indefinitely.",
    "Detail Concurrency Controls: In production, explain why ConcurrentHashMap combined with StampedLock or fine-grained bucket locks beats synchronized method blocks.",
    "Strengthen STAR Metrics: Specify the absolute financial or request volume (e.g. '15,000 transactions/sec' or '$120,000 in at-risk revenue') to make your business impact unmistakable to executive Bar Raisers."
  ],
  createdAt: new Date().toISOString()
};

export const initialMockHistory: HistoryItem[] = [
  {
    sessionId: "sess_amz_98234ab1",
    targetRole: "Amazon SDE-1 (AWS Messaging)",
    createdAt: "2026-09-18T10:30:00.000Z",
    verdict: "Hire",
    summary: "Solid $O(1)$ TTL cache implementation; sharp Bias for Action with 0.01% webhook drop resolution.",
    codingTitle: "High-Throughput LRU Cache with TTL Eviction"
  },
  {
    sessionId: "sess_cred_45910fe2",
    targetRole: "CRED Platform Engineer",
    createdAt: "2026-09-17T18:15:00.000Z",
    verdict: "Strong Hire",
    summary: "Flawless distributed rate limiter (Token Bucket) + Ownership LP demonstration under 25k RPS spike.",
    codingTitle: "Distributed Token Bucket Rate Limiter"
  },
  {
    sessionId: "sess_phnp_12093cc7",
    targetRole: "PhonePe Backend SDE",
    createdAt: "2026-09-16T14:00:00.000Z",
    verdict: "Lean Hire",
    summary: "Functional transaction ledger but missed edge-case handling for out-of-order idempotency keys.",
    codingTitle: "Idempotent Transaction Ledger & Reconciliation"
  }
];
