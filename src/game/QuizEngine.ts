import { QuizQuestion, WeaponType } from '../types';
import pktQuestionsData from '../data/pktQuestions.json';

export class QuizEngine {
  private rawQuestions: QuizQuestion[] = [];
  private baseNodeQuestions: Map<string, QuizQuestion[]> = new Map();
  private playerNodeStacks: Map<string, Map<string, QuizQuestion[]>> = new Map();
  private playerExhaustedNodes: Map<string, Set<string>> = new Map();
  private currentActiveQuiz: {
    question: QuizQuestion;
    shuffledOptions: { optionText: string; originalKey: string }[];
    timeLeftSeconds: number;
    playerId: string;
    nodeId: string;
  } | null = null;

  constructor() {
    this.rawQuestions = pktQuestionsData as QuizQuestion[];
    this.initNodeStacks();
  }

  public initNodeStacks() {
    this.baseNodeQuestions.clear();
    this.playerNodeStacks.clear();
    this.playerExhaustedNodes.clear();

    const nodeIds = ['node_1', 'node_2', 'node_3', 'node_4', 'node_5', 'node_6', 'node_7'];
    nodeIds.forEach((id) => this.baseNodeQuestions.set(id, []));

    // Distribute questions into base node stacks by explicit nodeId or fallback category
    this.rawQuestions.forEach((q) => {
      let targetNode = q.nodeId || 'node_1';

      if (!q.nodeId) {
        const catLower = (q.category || '').toLowerCase();
        if (catLower.includes('ecomove') || catLower.includes('plastik') || catLower.includes('sampah') || catLower.includes('residu') || catLower.includes('kehati') || catLower.includes('terumbu') || catLower.includes('pupuk kaltim') || catLower.includes('bontang')) {
          targetNode = 'node_7';
        } else if (catLower.includes('ai') || catLower.includes('kecerdasan') || catLower.includes('claude')) {
          targetNode = 'node_6';
        } else if (catLower.includes('esg') || catLower.includes('carbon') || catLower.includes('decarbonization')) {
          targetNode = 'node_5';
        } else if (catLower.includes('siber') || catLower.includes('cyber') || catLower.includes('audit')) {
          targetNode = 'node_4';
        } else if (catLower.includes('tata kelola') || catLower.includes('smap') || catLower.includes('korupsi')) {
          targetNode = 'node_3';
        } else if (catLower.includes('risk') || catLower.includes('mitigasi') || catLower.includes('rmm')) {
          targetNode = 'node_2';
        } else {
          targetNode = 'node_1';
        }
      }

      if (this.baseNodeQuestions.has(targetNode)) {
        this.baseNodeQuestions.get(targetNode)!.push(q);
      } else {
        this.baseNodeQuestions.get('node_1')!.push(q);
      }
    });
  }

  private ensurePlayerStacks(playerId: string = 'default'): {
    stacks: Map<string, QuizQuestion[]>;
    exhausted: Set<string>;
  } {
    const key = playerId || 'default';
    if (!this.playerNodeStacks.has(key)) {
      const stacks = new Map<string, QuizQuestion[]>();
      const exhausted = new Set<string>();

      this.baseNodeQuestions.forEach((questions, nodeId) => {
        const cloned = [...questions];
        // Shuffle questions within each node stack for this player
        for (let i = cloned.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
        }
        stacks.set(nodeId, cloned);
        if (cloned.length === 0) {
          exhausted.add(nodeId);
        }
      });

      this.playerNodeStacks.set(key, stacks);
      this.playerExhaustedNodes.set(key, exhausted);
    }

    return {
      stacks: this.playerNodeStacks.get(key)!,
      exhausted: this.playerExhaustedNodes.get(key)!,
    };
  }

  public isNodeExhausted(nodeId: string, playerId: string = 'default'): boolean {
    const { stacks, exhausted } = this.ensurePlayerStacks(playerId);
    const stack = stacks.get(nodeId);
    return !stack || stack.length === 0 || exhausted.has(nodeId);
  }

  public getExhaustedNodes(playerId: string = 'default'): Set<string> {
    const { exhausted } = this.ensurePlayerStacks(playerId);
    return exhausted;
  }

  public popNextQuestionForNode(nodeId: string, playerId: string) {
    const { stacks, exhausted } = this.ensurePlayerStacks(playerId);
    const stack = stacks.get(nodeId);
    if (!stack || stack.length === 0) {
      exhausted.add(nodeId);
      return null;
    }

    const question = stack.pop()!;
    if (stack.length === 0) {
      exhausted.add(nodeId);
    }

    // Parse options: original keys "A", "B", "C", "D"
    const optionsWithKeys = question.options.map((optText) => {
      const matchKey = optText.substring(0, 1);
      return {
        optionText: optText,
        originalKey: matchKey,
      };
    });

    // Shuffle option positions
    const shuffledOptions = [...optionsWithKeys];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }

    this.currentActiveQuiz = {
      question,
      shuffledOptions,
      timeLeftSeconds: 12.0,
      playerId,
      nodeId,
    };

    return this.currentActiveQuiz;
  }

  public getCurrentQuiz() {
    return this.currentActiveQuiz;
  }

  public updateTimer(dt: number): boolean {
    if (!this.currentActiveQuiz) return false;

    this.currentActiveQuiz.timeLeftSeconds -= dt;
    if (this.currentActiveQuiz.timeLeftSeconds <= 0) {
      this.currentActiveQuiz.timeLeftSeconds = 0;
      return true; // Timer expired
    }
    return false;
  }

  public evaluateAnswer(selectedOriginalKey: string): {
    isCorrect: boolean;
    pointsDelta: number;
    explanation: string;
    spawnedWeapon: WeaponType | null;
  } {
    if (!this.currentActiveQuiz) {
      return {
        isCorrect: false,
        pointsDelta: 0,
        explanation: '',
        spawnedWeapon: null,
      };
    }

    const correctKey = this.currentActiveQuiz.question.answer.trim().substring(0, 1);
    const isCorrect = selectedOriginalKey.trim().substring(0, 1) === correctKey;

    let pointsDelta = -10; // Penalty
    let spawnedWeapon: WeaponType | null = null;

    if (isCorrect) {
      pointsDelta = 50; // +50 Knowledge Points
      const weaponRewards: WeaponType[] = ['beam_rifle', 'risk_hammer', 'esg_shield', 'compliance_sword', 'decarb_blaster'];
      spawnedWeapon = weaponRewards[Math.floor(Math.random() * weaponRewards.length)];
    }

    const explanation = this.currentActiveQuiz.question.explanation;
    this.currentActiveQuiz = null;

    return {
      isCorrect,
      pointsDelta,
      explanation,
      spawnedWeapon,
    };
  }

  public cancelCurrentQuiz() {
    this.currentActiveQuiz = null;
  }

  public resetAll() {
    this.currentActiveQuiz = null;
    this.playerNodeStacks.clear();
    this.playerExhaustedNodes.clear();
  }
}
