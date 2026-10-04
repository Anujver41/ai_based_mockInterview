/**
 * Test Case Generator
 * Generates 50 diverse, auto-verified test cases per problem.
 * All expected outputs are computed by correct JS reference implementations.
 * This prevents anyone from hardcoding a single answer to pass.
 */

import type { TestCase } from './problemApi';

/* ─── Seeded PRNG (Mulberry32) so generated cases are deterministic ─── */
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeRng(problemId: string) {
  // Stable seed from problem id string
  const seed = problemId.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0);
  return mulberry32(seed);
}

/* ─── Reference Algorithm Implementations ─── */

function solveEditDistance(w1: string, w2: string): number {
  const m = w1.length, n = w2.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i + j));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = w1[i - 1] === w2[j - 1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function solveLIS(nums: number[]): number {
  if (!nums.length) return 0;
  const dp = new Array(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++)
    for (let j = 0; j < i; j++)
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
  return Math.max(...dp);
}

function solveCoinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++)
    for (const c of coins)
      if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}

function solveClimbingStairs(n: number): number {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) { const t = a + b; a = b; b = t; }
  return b;
}

function solveMaxSubarray(nums: number[]): number {
  let max = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) { cur = Math.max(nums[i], cur + nums[i]); max = Math.max(max, cur); }
  return max;
}

function solveTwoSum(nums: number[], target: number): [number, number] | null {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp)!, i];
    map.set(nums[i], i);
  }
  return null;
}

function solveContainsDuplicate(nums: number[]): boolean {
  return new Set(nums).size !== nums.length;
}

function solveBestTimeBuySell(prices: number[]): number {
  let minP = prices[0], maxP = 0;
  for (const p of prices) { minP = Math.min(minP, p); maxP = Math.max(maxP, p - minP); }
  return maxP;
}

function solvePalindromeNumber(x: number): boolean {
  if (x < 0) return false;
  const s = String(x);
  return s === s.split('').reverse().join('');
}

function solveValidAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count: Record<string, number> = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of t) { if (!count[c]) return false; count[c]--; }
  return true;
}

function solveValidPalindrome(s: string): boolean {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}

function solveReverseString(chars: string[]): string[] {
  return [...chars].reverse();
}

function solveLongestSubstringNoRepeat(s: string): number {
  let max = 0, start = 0;
  const map = new Map<string, number>();
  for (let i = 0; i < s.length; i++) {
    if (map.has(s[i]) && map.get(s[i])! >= start) start = map.get(s[i])! + 1;
    map.set(s[i], i);
    max = Math.max(max, i - start + 1);
  }
  return max;
}

function solveMoveZeroes(nums: number[]): number[] {
  const r = nums.filter(x => x !== 0);
  while (r.length < nums.length) r.push(0);
  return r;
}

function solveContainerMostWater(height: number[]): number {
  let l = 0, r = height.length - 1, max = 0;
  while (l < r) {
    max = Math.max(max, Math.min(height[l], height[r]) * (r - l));
    if (height[l] < height[r]) l++; else r--;
  }
  return max;
}

function solveTrappingRainWater(height: number[]): number {
  let l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;
  while (l < r) {
    if (height[l] < height[r]) { lMax = Math.max(lMax, height[l]); water += lMax - height[l]; l++; }
    else { rMax = Math.max(rMax, height[r]); water += rMax - height[r]; r--; }
  }
  return water;
}

function solveProductExceptSelf(nums: number[]): number[] {
  const n = nums.length, res = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) { res[i] = prefix; prefix *= nums[i]; }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) { res[i] *= suffix; suffix *= nums[i]; }
  return res;
}

function solveBinarySearch(nums: number[], target: number): number {
  let l = 0, r = nums.length - 1;
  while (l <= r) { const m = (l + r) >> 1; if (nums[m] === target) return m; else if (nums[m] < target) l = m + 1; else r = m - 1; }
  return -1;
}

function solveFindMinRotated(nums: number[]): number {
  let l = 0, r = nums.length - 1;
  while (l < r) { const m = (l + r) >> 1; if (nums[m] > nums[r]) l = m + 1; else r = m; }
  return nums[l];
}

function solveIsAnagram(s: string, t: string): boolean { return solveValidAnagram(s, t); }

function solveIsomorphicStrings(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const stMap = new Map<string, string>(), tsMap = new Map<string, string>();
  for (let i = 0; i < s.length; i++) {
    const sc = s[i], tc = t[i];
    if (stMap.has(sc) && stMap.get(sc) !== tc) return false;
    if (tsMap.has(tc) && tsMap.get(tc) !== sc) return false;
    stMap.set(sc, tc); tsMap.set(tc, sc);
  }
  return true;
}

function solveRansomNote(note: string, mag: string): boolean {
  const freq: Record<string, number> = {};
  for (const c of mag) freq[c] = (freq[c] || 0) + 1;
  for (const c of note) { if (!freq[c]) return false; freq[c]--; }
  return true;
}

function solveValidPalindromeII(s: string): boolean {
  function isPalin(lo: number, hi: number): boolean {
    while (lo < hi) { if (s[lo] !== s[hi]) return false; lo++; hi--; } return true;
  }
  let l = 0, r = s.length - 1;
  while (l < r) { if (s[l] !== s[r]) return isPalin(l + 1, r) || isPalin(l, r - 1); l++; r--; }
  return true;
}

function solvePermutationInString(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false;
  const count = new Array(26).fill(0);
  for (const c of s1) count[c.charCodeAt(0) - 97]++;
  const win = new Array(26).fill(0);
  for (let i = 0; i < s2.length; i++) {
    win[s2.charCodeAt(i) - 97]++;
    if (i >= s1.length) win[s2.charCodeAt(i - s1.length) - 97]--;
    if (win.every((v, idx) => v === count[idx])) return true;
  }
  return false;
}

function solveMaxAverageSub(nums: number[], k: number): number {
  let sum = nums.slice(0, k).reduce((a, b) => a + b, 0), max = sum;
  for (let i = k; i < nums.length; i++) { sum += nums[i] - nums[i - k]; max = Math.max(max, sum); }
  return max / k;
}

function solveMinSizeSubarraySum(target: number, nums: number[]): number {
  let l = 0, sum = 0, min = Infinity;
  for (let r = 0; r < nums.length; r++) {
    sum += nums[r];
    while (sum >= target) { min = Math.min(min, r - l + 1); sum -= nums[l++]; }
  }
  return min === Infinity ? 0 : min;
}

function solveLargestRectHistogram(heights: number[]): number {
  const stack: number[] = [], h = [...heights, 0];
  let max = 0;
  for (let i = 0; i < h.length; i++) {
    while (stack.length && h[stack[stack.length - 1]] > h[i]) {
      const hi = h[stack.pop()!];
      const w = stack.length ? i - stack[stack.length - 1] - 1 : i;
      max = Math.max(max, hi * w);
    }
    stack.push(i);
  }
  return max;
}

function solveDailyTemperatures(temps: number[]): number[] {
  const ans = new Array(temps.length).fill(0), stack: number[] = [];
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      const j = stack.pop()!;
      ans[j] = i - j;
    }
    stack.push(i);
  }
  return ans;
}

/* ─── Random data helpers ─── */
function randInt(rng: () => number, lo: number, hi: number) {
  return Math.floor(rng() * (hi - lo + 1)) + lo;
}
function randArr(rng: () => number, n: number, lo: number, hi: number) {
  return Array.from({ length: n }, () => randInt(rng, lo, hi));
}
function randStr(rng: () => number, len: number, chars = 'abcdefghijklmnopqrstuvwxyz') {
  return Array.from({ length: len }, () => chars[Math.floor(rng() * chars.length)]).join('');
}
function randSortedArr(rng: () => number, n: number, lo: number, hi: number) {
  return [...new Set(randArr(rng, n + 5, lo, hi))].sort((a, b) => a - b).slice(0, n);
}

/* ─── Generator map: problem id → generate 50 TestCase[] ─── */

type Generator = (rng: () => number) => TestCase[];

const GENERATORS: Record<string, Generator> = {

  // p-1  Edit Distance
  'p-1': (rng) => {
    const pairs: [string, string][] = [
      ['horse','ros'],['intention','execution'],['','abc'],['abc',''],
      ['a','a'],['ab','bc'],['sunday','saturday'],['kitten','sitting'],
    ];
    const cases: TestCase[] = pairs.map(([w1, w2]) => ({
      input: `"${w1}"\n"${w2}"`, expectedOutput: String(solveEditDistance(w1, w2)), isHidden: false
    }));
    while (cases.length < 50) {
      const w1 = randStr(rng, randInt(rng, 1, 8));
      const w2 = randStr(rng, randInt(rng, 1, 8));
      cases.push({ input: `"${w1}"\n"${w2}"`, expectedOutput: String(solveEditDistance(w1, w2)), isHidden: true });
    }
    return cases;
  },

  // p-2  Longest Increasing Subsequence
  'p-2': (rng) => {
    const fixed: number[][] = [
      [10,9,2,5,3,7,101,18],[0,1,0,3,2],[7,7,7,7,7],[4,10,4,3,8,9],[1,2,3,4,5],
    ];
    const cases: TestCase[] = fixed.map(nums => ({
      input: JSON.stringify(nums), expectedOutput: String(solveLIS(nums)), isHidden: false
    }));
    while (cases.length < 50) {
      const nums = randArr(rng, randInt(rng, 3, 12), -20, 20);
      cases.push({ input: JSON.stringify(nums), expectedOutput: String(solveLIS(nums)), isHidden: true });
    }
    return cases;
  },

  // p-3  Coin Change
  'p-3': (rng) => {
    const fixed: [number[], number][] = [
      [[1,2,5],11],[[2],3],[[1],0],[[1,2,5],100],[[3],7],[[2,5,10,1],27],[[1,2,5],8],
    ];
    const cases: TestCase[] = fixed.map(([coins, amt]) => ({
      input: `${JSON.stringify(coins)}\n${amt}`, expectedOutput: String(solveCoinChange(coins, amt)), isHidden: false
    }));
    while (cases.length < 50) {
      const coins = [...new Set(randArr(rng, randInt(rng, 1, 4), 1, 10))];
      const amount = randInt(rng, 0, 30);
      cases.push({ input: `${JSON.stringify(coins)}\n${amount}`, expectedOutput: String(solveCoinChange(coins, amount)), isHidden: true });
    }
    return cases;
  },

  // p-4  Climbing Stairs
  'p-4': (rng) => {
    const cases: TestCase[] = Array.from({ length: 10 }, (_, i) => i + 1).map(n => ({
      input: String(n), expectedOutput: String(solveClimbingStairs(n)), isHidden: false
    }));
    while (cases.length < 50) {
      const n = randInt(rng, 1, 45);
      cases.push({ input: String(n), expectedOutput: String(solveClimbingStairs(n)), isHidden: true });
    }
    return cases;
  },

  // p-43  Maximum Subarray
  'p-43': (rng) => {
    const fixed = [[-2,1,-3,4,-1,2,1,-5,4],[1],[5,4,-1,7,8],[-1,-2,-3],[-2,-1],[0,0,0]];
    const cases: TestCase[] = fixed.map(nums => ({
      input: JSON.stringify(nums), expectedOutput: String(solveMaxSubarray(nums)), isHidden: false
    }));
    while (cases.length < 50) {
      const nums = randArr(rng, randInt(rng, 2, 10), -10, 10);
      cases.push({ input: JSON.stringify(nums), expectedOutput: String(solveMaxSubarray(nums)), isHidden: true });
    }
    return cases;
  },

  // p-47  Two Sum
  'p-47': (rng) => {
    const cases: TestCase[] = [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]', isHidden: false },
      { input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: false },
    ];
    while (cases.length < 50) {
      const len = randInt(rng, 2, 8);
      const nums = randArr(rng, len, -20, 20);
      // Pick a valid target so there is always a solution
      const i = randInt(rng, 0, len - 2);
      const j = randInt(rng, i + 1, len - 1);
      const target = nums[i] + nums[j];
      const res = solveTwoSum(nums, target);
      if (res) cases.push({ input: `${JSON.stringify(nums)}\n${target}`, expectedOutput: JSON.stringify(res), isHidden: true });
    }
    return cases;
  },

  // p-45  Contains Duplicate
  'p-45': (rng) => {
    const fixed = [[1,2,3,1],[1,2,3,4],[1,1,1,3,3,4,3,2,4,2]];
    const cases: TestCase[] = fixed.map(nums => ({
      input: JSON.stringify(nums), expectedOutput: String(solveContainsDuplicate(nums)), isHidden: false
    }));
    while (cases.length < 50) {
      const nums = randArr(rng, randInt(rng, 2, 12), 1, 8);
      cases.push({ input: JSON.stringify(nums), expectedOutput: String(solveContainsDuplicate(nums)), isHidden: true });
    }
    return cases;
  },

  // p-46  Best Time to Buy and Sell Stock
  'p-46': (rng) => {
    const fixed = [[7,1,5,3,6,4],[7,6,4,3,1],[2,4,1],[1,2],[1,1]];
    const cases: TestCase[] = fixed.map(prices => ({
      input: JSON.stringify(prices), expectedOutput: String(solveBestTimeBuySell(prices)), isHidden: false
    }));
    while (cases.length < 50) {
      const prices = randArr(rng, randInt(rng, 2, 10), 1, 100);
      cases.push({ input: JSON.stringify(prices), expectedOutput: String(solveBestTimeBuySell(prices)), isHidden: true });
    }
    return cases;
  },

  // p-49  Palindrome Number
  'p-49': (rng) => {
    const fixed = [121,-121,10,0,1,11,1221,12321,-1];
    const cases: TestCase[] = fixed.map(x => ({
      input: String(x), expectedOutput: String(solvePalindromeNumber(x)), isHidden: false
    }));
    while (cases.length < 50) {
      const x = randInt(rng, -999, 9999);
      cases.push({ input: String(x), expectedOutput: String(solvePalindromeNumber(x)), isHidden: true });
    }
    return cases;
  },

  // p-41  Valid Anagram
  'p-41': (rng) => {
    const fixed: [string, string][] = [['anagram','nagaram'],['rat','car'],['a','a'],['ab','a'],['','']];
    const cases: TestCase[] = fixed.map(([s, t]) => ({
      input: `"${s}"\n"${t}"`, expectedOutput: String(solveValidAnagram(s, t)), isHidden: false
    }));
    while (cases.length < 50) {
      const s = randStr(rng, randInt(rng, 1, 6));
      const t = rng() < 0.5 ? s.split('').sort(() => rng() - 0.5).join('') : randStr(rng, randInt(rng, 1, 6));
      cases.push({ input: `"${s}"\n"${t}"`, expectedOutput: String(solveValidAnagram(s, t)), isHidden: true });
    }
    return cases;
  },

  // p-40  Valid Palindrome
  'p-40': (rng) => {
    const fixed = ['A man, a plan, a canal: Panama','race a car',' ','Was it a car or a cat I saw?'];
    const cases: TestCase[] = fixed.map(s => ({
      input: `"${s}"`, expectedOutput: String(solveValidPalindrome(s)), isHidden: false
    }));
    while (cases.length < 50) {
      const s = randStr(rng, randInt(rng, 2, 10), 'aAbBcCdD12 ?,!');
      cases.push({ input: `"${s}"`, expectedOutput: String(solveValidPalindrome(s)), isHidden: true });
    }
    return cases;
  },

  // p-25  Longest Substring Without Repeating
  'p-25': (rng) => {
    const fixed = ['abcabcbb','bbbbb','pwwkew','','a','au','dvdf'];
    const cases: TestCase[] = fixed.map(s => ({
      input: `"${s}"`, expectedOutput: String(solveLongestSubstringNoRepeat(s)), isHidden: false
    }));
    while (cases.length < 50) {
      const s = randStr(rng, randInt(rng, 1, 10), 'abcdefgh');
      cases.push({ input: `"${s}"`, expectedOutput: String(solveLongestSubstringNoRepeat(s)), isHidden: true });
    }
    return cases;
  },

  // p-30  Move Zeroes
  'p-30': (rng) => {
    const fixed = [[0,1,0,3,12],[0],[1],[0,0],[1,2,3]];
    const cases: TestCase[] = fixed.map(nums => ({
      input: JSON.stringify(nums), expectedOutput: JSON.stringify(solveMoveZeroes(nums)), isHidden: false
    }));
    while (cases.length < 50) {
      const nums = randArr(rng, randInt(rng, 2, 8), 0, 5);
      cases.push({ input: JSON.stringify(nums), expectedOutput: JSON.stringify(solveMoveZeroes(nums)), isHidden: true });
    }
    return cases;
  },

  // p-28  Container With Most Water
  'p-28': (rng) => {
    const fixed = [[1,8,6,2,5,4,8,3,7],[1,1],[4,3,2,1,4],[1,2,1]];
    const cases: TestCase[] = fixed.map(h => ({
      input: JSON.stringify(h), expectedOutput: String(solveContainerMostWater(h)), isHidden: false
    }));
    while (cases.length < 50) {
      const h = randArr(rng, randInt(rng, 2, 10), 0, 10);
      cases.push({ input: JSON.stringify(h), expectedOutput: String(solveContainerMostWater(h)), isHidden: true });
    }
    return cases;
  },

  // p-42  Trapping Rain Water
  'p-42': (rng) => {
    const fixed = [[0,1,0,2,1,0,1,3,2,1,2,1],[4,2,0,3,2,5],[1,0,1],[3,0,3],[0,0,0]];
    const cases: TestCase[] = fixed.map(h => ({
      input: JSON.stringify(h), expectedOutput: String(solveTrappingRainWater(h)), isHidden: false
    }));
    while (cases.length < 50) {
      const h = randArr(rng, randInt(rng, 3, 10), 0, 5);
      cases.push({ input: JSON.stringify(h), expectedOutput: String(solveTrappingRainWater(h)), isHidden: true });
    }
    return cases;
  },

  // p-44  Product of Array Except Self
  'p-44': (rng) => {
    const fixed = [[1,2,3,4],[-1,1,0,-3,3],[1,0,0],[2,2,2,2]];
    const cases: TestCase[] = fixed.map(nums => ({
      input: JSON.stringify(nums), expectedOutput: JSON.stringify(solveProductExceptSelf(nums)), isHidden: false
    }));
    while (cases.length < 50) {
      const nums = randArr(rng, randInt(rng, 2, 6), -5, 5);
      cases.push({ input: JSON.stringify(nums), expectedOutput: JSON.stringify(solveProductExceptSelf(nums)), isHidden: true });
    }
    return cases;
  },

  // p-13  Binary Search
  'p-13': (rng) => {
    const fixed: [number[], number][] = [
      [[-1,0,3,5,9,12],9],[[-1,0,3,5,9,12],2],[[5],5],[[1,3],3],[[-1,0,3,5,9,12],-1]
    ];
    const cases: TestCase[] = fixed.map(([nums, t]) => ({
      input: `${JSON.stringify(nums)}\n${t}`, expectedOutput: String(solveBinarySearch(nums, t)), isHidden: false
    }));
    while (cases.length < 50) {
      const nums = randSortedArr(rng, randInt(rng, 3, 10), -20, 20);
      const target = rng() < 0.6 ? nums[randInt(rng, 0, nums.length - 1)] : randInt(rng, -25, 25);
      cases.push({ input: `${JSON.stringify(nums)}\n${target}`, expectedOutput: String(solveBinarySearch(nums, target)), isHidden: true });
    }
    return cases;
  },

  // p-11  Find Minimum in Rotated Sorted Array
  'p-11': (rng) => {
    const fixed = [[3,4,5,1,2],[4,5,6,7,0,1,2],[11,13,15,17],[1],[2,1]];
    const cases: TestCase[] = fixed.map(nums => ({
      input: JSON.stringify(nums), expectedOutput: String(solveFindMinRotated(nums)), isHidden: false
    }));
    while (cases.length < 50) {
      const sorted = randSortedArr(rng, randInt(rng, 2, 10), -30, 30);
      const pivot = randInt(rng, 0, sorted.length - 1);
      const rotated = [...sorted.slice(pivot), ...sorted.slice(0, pivot)];
      cases.push({ input: JSON.stringify(rotated), expectedOutput: String(solveFindMinRotated(rotated)), isHidden: true });
    }
    return cases;
  },

  // p-35  Isomorphic Strings
  'p-35': (rng) => {
    const fixed: [string, string][] = [['egg','add'],['foo','bar'],['paper','title'],['a','a'],['ab','aa']];
    const cases: TestCase[] = fixed.map(([s, t]) => ({
      input: `"${s}"\n"${t}"`, expectedOutput: String(solveIsomorphicStrings(s, t)), isHidden: false
    }));
    while (cases.length < 50) {
      const s = randStr(rng, randInt(rng, 2, 6), 'abcde');
      // Build isomorphic t with prob 0.5
      let t: string;
      if (rng() < 0.5) {
        const map: Record<string, string> = {};
        const used = new Set<string>();
        const chars = 'uvwxy';
        t = s.split('').map(c => {
          if (!map[c]) { const ch = chars.split('').find(x => !used.has(x)) || c; map[c] = ch; used.add(ch); }
          return map[c];
        }).join('');
      } else {
        t = randStr(rng, s.length, 'abcde');
      }
      cases.push({ input: `"${s}"\n"${t}"`, expectedOutput: String(solveIsomorphicStrings(s, t)), isHidden: true });
    }
    return cases;
  },

  // p-36  Ransom Note
  'p-36': (rng) => {
    const fixed: [string, string][] = [['a','b'],['aa','ab'],['aa','aab'],['abc','aabbcc'],['z','']];
    const cases: TestCase[] = fixed.map(([note, mag]) => ({
      input: `"${note}"\n"${mag}"`, expectedOutput: String(solveRansomNote(note, mag)), isHidden: false
    }));
    while (cases.length < 50) {
      const note = randStr(rng, randInt(rng, 1, 5), 'abc');
      const extra = rng() < 0.6 ? note : '';
      const mag = (note + extra + randStr(rng, randInt(rng, 0, 3), 'abc')).split('').sort(() => rng() - 0.5).join('');
      cases.push({ input: `"${note}"\n"${mag}"`, expectedOutput: String(solveRansomNote(note, mag)), isHidden: true });
    }
    return cases;
  },

  // p-31  Valid Palindrome II
  'p-31': (rng) => {
    const fixed = ['aba','abca','abc','deeee','a'];
    const cases: TestCase[] = fixed.map(s => ({
      input: `"${s}"`, expectedOutput: String(solveValidPalindromeII(s)), isHidden: false
    }));
    while (cases.length < 50) {
      const s = randStr(rng, randInt(rng, 2, 8), 'abcd');
      cases.push({ input: `"${s}"`, expectedOutput: String(solveValidPalindromeII(s)), isHidden: true });
    }
    return cases;
  },

  // p-24  Permutation in String
  'p-24': (rng) => {
    const fixed: [string, string][] = [['ab','eidbaooo'],['ab','eidboaoo'],['a','ab'],['abc','bbbca']];
    const cases: TestCase[] = fixed.map(([s1, s2]) => ({
      input: `"${s1}"\n"${s2}"`, expectedOutput: String(solvePermutationInString(s1, s2)), isHidden: false
    }));
    while (cases.length < 50) {
      const s1 = randStr(rng, randInt(rng, 1, 4), 'abc');
      const s2 = randStr(rng, randInt(rng, s1.length, s1.length + 5), 'abcd');
      cases.push({ input: `"${s1}"\n"${s2}"`, expectedOutput: String(solvePermutationInString(s1, s2)), isHidden: true });
    }
    return cases;
  },

  // p-19  Largest Rectangle in Histogram
  'p-19': (rng) => {
    const fixed = [[2,1,5,6,2,3],[2,4],[1],[1,1],[6,2,5,4,5,1,6]];
    const cases: TestCase[] = fixed.map(h => ({
      input: JSON.stringify(h), expectedOutput: String(solveLargestRectHistogram(h)), isHidden: false
    }));
    while (cases.length < 50) {
      const h = randArr(rng, randInt(rng, 1, 8), 0, 8);
      cases.push({ input: JSON.stringify(h), expectedOutput: String(solveLargestRectHistogram(h)), isHidden: true });
    }
    return cases;
  },

  // p-20  Daily Temperatures
  'p-20': (rng) => {
    const fixed = [[73,74,75,71,69,72,76,73],[30,40,50,60],[30,60,90]];
    const cases: TestCase[] = fixed.map(t => ({
      input: JSON.stringify(t), expectedOutput: JSON.stringify(solveDailyTemperatures(t)), isHidden: false
    }));
    while (cases.length < 50) {
      const temps = randArr(rng, randInt(rng, 2, 8), 30, 100);
      cases.push({ input: JSON.stringify(temps), expectedOutput: JSON.stringify(solveDailyTemperatures(temps)), isHidden: true });
    }
    return cases;
  },

  // p-26  Maximum Average Subarray I
  'p-26': (rng) => {
    const fixed: [number[], number][] = [[[1,12,-5,-6,50,3],4],[[5],1],[[1,2,3,4,5],3]];
    const cases: TestCase[] = fixed.map(([nums, k]) => ({
      input: `${JSON.stringify(nums)}\n${k}`, expectedOutput: String(solveMaxAverageSub(nums, k)), isHidden: false
    }));
    while (cases.length < 50) {
      const n = randInt(rng, 3, 8);
      const k = randInt(rng, 1, n);
      const nums = randArr(rng, n, -10, 50);
      cases.push({ input: `${JSON.stringify(nums)}\n${k}`, expectedOutput: String(solveMaxAverageSub(nums, k)), isHidden: true });
    }
    return cases;
  },

  // p-27  Minimum Size Subarray Sum
  'p-27': (rng) => {
    const fixed: [number, number[]][] = [[7,[2,3,1,2,4,3]],[4,[1,4,4]],[11,[1,1,1,1,1,1,1,1]]];
    const cases: TestCase[] = fixed.map(([t, nums]) => ({
      input: `${t}\n${JSON.stringify(nums)}`, expectedOutput: String(solveMinSizeSubarraySum(t, nums)), isHidden: false
    }));
    while (cases.length < 50) {
      const nums = randArr(rng, randInt(rng, 2, 8), 1, 10);
      const target = randInt(rng, 2, nums.reduce((a, b) => a + b, 0));
      cases.push({ input: `${target}\n${JSON.stringify(nums)}`, expectedOutput: String(solveMinSizeSubarraySum(target, nums)), isHidden: true });
    }
    return cases;
  },

};

/**
 * Get 50 generated test cases for a problem.
 * Falls back to the problem's original testCases if no generator exists.
 */
export function getGeneratedTestCases(problemId: string, originalCases: TestCase[]): TestCase[] {
  const gen = GENERATORS[problemId];
  if (!gen) return originalCases; // no generator yet – use original
  const rng = makeRng(problemId);
  return gen(rng);
}
